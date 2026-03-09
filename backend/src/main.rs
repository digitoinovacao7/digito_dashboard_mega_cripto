use axum::{
    extract::{State, Json},
    routing::{post, get},
    Router,
    http::{StatusCode, Method},
    response::IntoResponse,
};
use tower_http::cors::{Any, CorsLayer};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use std::str::FromStr;
use anchor_client::{Client, Cluster, Program};
use anchor_lang::prelude::*;
use solana_sdk::{
    signature::{Keypair, Signer},
    pubkey::Pubkey,
    system_program,
};
use cached::proc_macro::cached;
use chrono::{DateTime, Utc};
use reqwest;

#[derive(Debug, Serialize, Clone)]
struct CryptoPrice {
    id: String,
    symbol: String,
    name: String,
    image: String,
    price_brl: f64,
    change_24h: f64,
}

#[derive(Debug, Deserialize)]
struct CoinGeckoCoin {
    brl: f64,
    brl_24h_change: f64,
}

// ... Webhook Payload structs ...
#[derive(Deserialize, Debug)]
struct WebhookPayload {
    action: Option<String>,
    #[serde(rename = "type")]
    type_: Option<String>,
    data: Option<PaymentData>,
}

#[derive(Deserialize, Debug)]
struct PaymentData {
    id: String,
}

// ... Create Payment structs ...
#[derive(Deserialize, Clone)]
struct BetPayload {
    numbers: Vec<u8>,
    user_pubkey: String,
}

#[derive(Serialize)]
struct PaymentIntentResponse {
    qr_code: String,
    tx_id: String,
}

struct AppState {
    program: Program,
    server_keypair: Arc<Keypair>,
    pending_bets: Arc<Mutex<HashMap<String, BetPayload>>>,
}

#[tokio::main]
async fn main() {
    let server_keypair = Arc::new(Keypair::new());
    let program_id = Pubkey::from_str("3PSnWULou1gWHj1SxGL4S5Gu12PrrRvHsGifqpM4CjH9").unwrap();
    
    let client = Client::new(Cluster::Devnet, Arc::clone(&server_keypair));
    let program = client.program(program_id);

    let state = Arc::new(AppState {
        program,
        server_keypair,
        pending_bets: Arc::new(Mutex::new(HashMap::new())),
    });

    // Configure CORS for local development React site
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .route("/create-payment", post(create_payment_intent))
        .route("/webhook/mercadopago", post(mercado_pago_webhook))
        .route("/prices", get(prices))
        .layer(cors)
        .with_state(state);

    println!("Backend server listening on 0.0.0.0:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn prices() -> impl IntoResponse {
    match get_prices().await {
        Ok(prices) => (StatusCode::OK, Json(prices)).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch prices").into_response(),
    }
}

#[cached(time = 60, result = true)]
async fn get_prices() -> Result<Vec<CryptoPrice>, reqwest::Error> {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin&vs_currencies=brl&include_24hr_change=true";
    let response: HashMap<String, CoinGeckoCoin> = reqwest::get(url).await?.json().await?;

    let mut prices: Vec<CryptoPrice> = Vec::new();

    for (id, data) in response {
        let (symbol, name, image) = match id.as_str() {
            "bitcoin" => ("BTC", "Bitcoin", "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"),
            "ethereum" => ("ETH", "Ethereum", "https://assets.coingecko.com/coins/images/279/large/ethereum.png"),
            "solana" => ("SOL", "Solana", "https://assets.coingecko.com/coins/images/4128/large/solana.png"),
            "usd-coin" => ("USDC", "USD Coin", "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"),
            _ => continue,
        };

        prices.push(CryptoPrice {
            id,
            symbol: symbol.to_string(),
            name: name.to_string(),
            image: image.to_string(),
            price_brl: data.brl,
            change_24h: data.brl_24h_change,
        });
    }

    Ok(prices)
}

async fn create_payment_intent(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<BetPayload>,
) -> impl IntoResponse {
    println!("Received bet request for public key: {}", payload.user_pubkey);
    println!("Numbers selected: {:?}", payload.numbers);

    let mp_tx_id = format!("MP-{}", uuid::Uuid::new_v4());
    
    let mut bets = state.pending_bets.lock().unwrap();
    bets.insert(mp_tx_id.clone(), payload);

    let response = PaymentIntentResponse {
        qr_code: "00020101021126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42665544000052040000530398654045.005802BR5913MegaCripto SA6009Sao Paulo62070503***6304A1B2".to_string(),
        tx_id: mp_tx_id,
    };

    (StatusCode::CREATED, Json(response))
}

async fn mercado_pago_webhook(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<WebhookPayload>,
) -> Result<StatusCode, (StatusCode, String)> {
    println!("Received webhook: {:?}", payload);
    
    let is_payment = payload.action.as_deref() == Some("payment.created") || payload.type_.as_deref() == Some("payment");
    
    if is_payment {
        if let Some(data) = payload.data {
            println!("Processing payment ID: {}", data.id);
            let status = "approved"; // mock
            
            if status == "approved" {
                let bet_payload = {
                    let mut bets = state.pending_bets.lock().unwrap();
                    bets.remove(&data.id)
                };

                if let Some(bet) = bet_payload {
                    let user_pubkey: Pubkey = bet.user_pubkey.parse().unwrap();
                    let draw_id = 1;
                    
                    match process_bet_on_chain(State(state), user_pubkey, bet.numbers, draw_id, data.id.clone()).await {
                        Ok(sig) => println!("Bet {} registered on-chain! Tx: {}", data.id, sig),
                        Err(e) => eprintln!("Failed to register bet on-chain: {:?}", e),
                    }
                } else {
                    eprintln!("Bet not found for payment ID: {}", data.id);
                }
            }
        }
    }
    
    Ok(StatusCode::OK)
}

#[derive(Accounts)]
pub struct RegisterBet<'info> {
    #[account(init, payer = server_authority, space = 8 + 32 + 15 + 8 + 4 + 64 + 8)]
    pub bet_account: Account<'info, Bet>,
    /// CHECK: The user who owns the bet, does not need to sign as server pays
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub server_authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Bet {
    pub user_pubkey: Pubkey,
    pub numbers: [u8; 15],
    pub draw_id: u64,
    pub pix_transaction_id: String,
    pub timestamp: i64,
}

async fn process_bet_on_chain(
    State(state): State<Arc<AppState>>,
    user_pubkey: Pubkey,
    numbers: Vec<u8>,
    draw_id: u64,
    pix_transaction_id: String,
) -> Result<String, Box<dyn std::error::Error>> {
    println!(
        "Executing Anchor Instruction `register_bet` for user {} (MP Tx ID: {})",
        user_pubkey, pix_transaction_id
    );

    let numbers_array: [u8; 15] = numbers.try_into().map_err(|_| "Invalid number of bets")?;
    
    let bet_keypair = Keypair::new();

    let sig = state.program
        .request()
        .signer(&*state.server_keypair)
        .signer(&bet_keypair)
        .accounts(RegisterBet {
            bet_account: bet_keypair.pubkey(),
            user: user_pubkey,
            server_authority: state.server_keypair.pubkey(),
            system_program: system_program::ID,
        })
        .args(instruction::RegisterBet {
            numbers: numbers_array,
            draw_id,
            pix_transaction_id,
        })
        .send()?;
    
    Ok(sig.to_string())
}

mod instruction {
    use anchor_lang::prelude::*;
    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct RegisterBet {
        pub numbers: [u8; 15],
        pub draw_id: u64,
        pub pix_transaction_id: String,
    }
}
