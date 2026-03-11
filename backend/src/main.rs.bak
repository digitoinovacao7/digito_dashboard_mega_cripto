use axum::{
    extract::{State, Json, Query},
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
use solana_sdk::{
    signature::Keypair,
    pubkey::Pubkey,
};
use cached::proc_macro::cached;
use reqwest;
use chrono::Local;
use rand::Rng;

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

#[derive(Serialize, Clone)]
struct PaymentIntentResponse {
    qr_code: String,
    tx_id: String,
}

#[derive(Serialize, Clone)]
struct AdminStats {
  #[serde(rename = "volumeBRL")]
  volume_brl: f64,
  #[serde(rename = "totalTickets")]
  total_tickets: u32,
  #[serde(rename = "gasPoolSOL")]
  gas_pool_sol: f64,
  #[serde(rename = "gasTxCapacity")]
  gas_tx_capacity: u32,
  #[serde(rename = "newRegistrations24h")]
  new_registrations_24h: u32,
  #[serde(rename = "currentDrawId")]
  current_draw_id: String,
}

#[derive(Serialize, Clone)]
struct UserTicket {
  id: String,
  #[serde(rename = "drawId")]
  draw_id: String,
  numbers: Vec<u8>,
  status: String,
  #[serde(rename = "verifiedAt")]
  verified_at: Option<String>,
}

#[derive(Serialize, Clone)]
struct UserStats {
  #[serde(rename = "pubKey")]
  pub_key: String,
  tickets: Vec<UserTicket>,
}

#[derive(Deserialize)]
struct UserStatsQuery {
    email: Option<String>,
}

#[derive(Clone)]
struct PendingBet {
    numbers: Vec<u8>,
    user_pubkey: String,
    draw_id: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct BetPrice {
    numbers_count: u8,
    price: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct Config {
    bet_prices: Vec<BetPrice>,
    prize_percentage: f64,
}

#[derive(Serialize, Deserialize, Clone)]
struct DrawResult {
    draw_id: String,
    date: String,
    numbers: Vec<u8>,
    tx: String,
}

struct AppState {
    program: Program<Arc<Keypair>>,
    server_keypair: Arc<Keypair>,
    pending_bets: Arc<Mutex<HashMap<String, PendingBet>>>,
    admin_stats: Arc<Mutex<AdminStats>>,
    user_tickets: Arc<Mutex<HashMap<String, Vec<UserTicket>>>>,
    config: Arc<Mutex<Config>>,
    draw_results: Arc<Mutex<Vec<DrawResult>>>,
}

#[tokio::main]
async fn main() {
    let server_keypair = Arc::new(Keypair::new());
    let program_id = Pubkey::from_str("3PSnWULou1gWHj1SxGL4S5Gu12PrrRvHsGifqpM4CjH9").unwrap();
    
    let client = Client::new(Cluster::Devnet, Arc::clone(&server_keypair));
    let program = client.program(program_id).unwrap();

    let state = Arc::new(AppState {
        program,
        server_keypair,
        pending_bets: Arc::new(Mutex::new(HashMap::new())),
        admin_stats: Arc::new(Mutex::new(AdminStats {
            volume_brl: 0.00,
            total_tickets: 0,
            gas_pool_sol: 12.45,
            gas_tx_capacity: 150000,
            new_registrations_24h: 3,
            current_draw_id: "101".to_string(),
        })),
        user_tickets: Arc::new(Mutex::new(HashMap::new())),
        config: Arc::new(Mutex::new(Config {
            bet_prices: vec![
                BetPrice { numbers_count: 15, price: 3.50 },
                BetPrice { numbers_count: 16, price: 56.00 },
                BetPrice { numbers_count: 17, price: 476.00 },
                BetPrice { numbers_count: 18, price: 2856.00 },
                BetPrice { numbers_count: 19, price: 13566.00 },
                BetPrice { numbers_count: 20, price: 54264.00 },
            ],
            prize_percentage: 60.0,
        })),
        draw_results: Arc::new(Mutex::new(vec![
            DrawResult {
                draw_id: "100".to_string(),
                date: "08/03/2026".to_string(),
                numbers: vec![3, 11, 15, 22, 34, 49],
                tx: "5zXe...y9fA".to_string(),
            },
            DrawResult {
                draw_id: "99".to_string(),
                date: "01/03/2026".to_string(),
                numbers: vec![5, 12, 23, 33, 41, 50],
                tx: "7aKb...c8gH".to_string(),
            },
        ])),
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
        .route("/admin/stats", get(admin_stats))
        .route("/user/stats", get(user_stats))
        .route("/admin/config", get(get_config).post(update_config))
        .route("/results", get(get_results))
        .route("/admin/trigger-draw", post(trigger_draw))
        .layer(cors)
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);
    println!("Backend server listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_results(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let results = state.draw_results.lock().unwrap().clone();
    (StatusCode::OK, Json(results))
}

async fn prices() -> impl IntoResponse {
    match get_prices().await {
        Ok(prices) => (StatusCode::OK, Json(prices)).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch prices").into_response(),
    }
}

async fn get_config(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let config = state.config.lock().unwrap().clone();
    (StatusCode::OK, Json(config))
}

async fn update_config(State(state): State<Arc<AppState>>, Json(new_config): Json<Config>) -> impl IntoResponse {
    let mut config = state.config.lock().unwrap();
    config.bet_prices = new_config.bet_prices;
    config.prize_percentage = new_config.prize_percentage;
    (StatusCode::OK, Json(config.clone()))
}

async fn trigger_draw(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let mut stats = state.admin_stats.lock().unwrap();
    let mut results = state.draw_results.lock().unwrap();

    let new_draw_id = stats.current_draw_id.parse::<u64>().unwrap_or(101) + 1;
    stats.current_draw_id = new_draw_id.to_string();

    let mut rng = rand::thread_rng();
    let mut numbers: Vec<u8> = Vec::new();
    while numbers.len() < 6 {
        let n = rng.gen_range(1..=25);
        if !numbers.contains(&n) {
            numbers.push(n);
        }
    }
    numbers.sort();

    let new_result = DrawResult {
        draw_id: new_draw_id.to_string(),
        date: Local::now().format("%d/%m/%Y").to_string(),
        numbers,
        tx: format!("mock_tx_{}", new_draw_id),
    };

    results.insert(0, new_result);
    //
    (StatusCode::OK, Json(stats.clone()))
}


async fn admin_stats(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let stats = state.admin_stats.lock().unwrap().clone();
    (StatusCode::OK, Json(stats))
}

async fn user_stats(State(state): State<Arc<AppState>>, Query(params): Query<UserStatsQuery>) -> impl IntoResponse {
    let email = params.email.unwrap_or_else(|| "unknown".to_string());
    let tickets = {
        let guard = state.user_tickets.lock().unwrap();
        guard.get(&email).cloned().unwrap_or_else(Vec::new)
    };
    
    let stats = UserStats {
        pub_key: email, // mocking pubkey by email for now
        tickets,
    };
    (StatusCode::OK, Json(stats))
}

#[cached(time = 60, result = true)]
async fn get_prices() -> std::result::Result<Vec<CryptoPrice>, String> {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin&vs_currencies=brl&include_24hr_change=true";
    let response: HashMap<String, CoinGeckoCoin> = reqwest::get(url).await.map_err(|e| e.to_string())?.json().await.map_err(|e| e.to_string())?;

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
    let current_draw_id = {
        let stats = state.admin_stats.lock().unwrap();
        stats.current_draw_id.clone()
    };
    
    {
        let mut bets = state.pending_bets.lock().unwrap();
        bets.insert(mp_tx_id.clone(), PendingBet {
            numbers: payload.numbers.clone(),
            user_pubkey: payload.user_pubkey.clone(),
            draw_id: current_draw_id.clone(),
        });
    }
    
    {
        let mut stats = state.admin_stats.lock().unwrap();
        stats.total_tickets += 1;
        
        let config = state.config.lock().unwrap();
        let price = config.bet_prices.iter().find(|p| p.numbers_count == payload.numbers.len() as u8).map_or(0.0, |p| p.price);
        stats.volume_brl += price;
    }

    let current_draw_id = {
        let stats = state.admin_stats.lock().unwrap();
        stats.current_draw_id.clone()
    };

    {
        // Add ticket to user stats immediately simulating "payment accepted" 
        let mut user_map = state.user_tickets.lock().unwrap();
        let user_tickets = user_map.entry(payload.user_pubkey).or_insert(Vec::new());
        user_tickets.push(UserTicket {
            id: mp_tx_id.clone(),
            draw_id: current_draw_id,
            numbers: payload.numbers,
            status: "Aguardando Sorteio".to_string(),
            verified_at: Some(chrono::Utc::now().format("%H:%M").to_string()),
        });
    }

    let response = PaymentIntentResponse {
        qr_code: "00020101021126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42665544000052040000530398654045.005802BR5913MegaCripto SA6009Sao Paulo62070503***6304A1B2".to_string(),
        tx_id: mp_tx_id,
    };

    (StatusCode::CREATED, Json(response))
}

async fn mercado_pago_webhook(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<WebhookPayload>,
) -> std::result::Result<StatusCode, (StatusCode, String)> {
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
                    // parse draw_id from string to u64 for the smart contract, default to 0 if parsing fails
                    let draw_id = bet.draw_id.parse::<u64>().unwrap_or(0);
                    
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

async fn process_bet_on_chain(
    _state: State<Arc<AppState>>,
    user_pubkey: Pubkey,
    _numbers: Vec<u8>,
    _draw_id: u64,
    pix_transaction_id: String,
) -> std::result::Result<String, Box<dyn std::error::Error>> {
    println!(
        "Executing Anchor Instruction `register_bet` for user {} (MP Tx ID: {})",
        user_pubkey, pix_transaction_id
    );

    // TODO: implement real Anchor client calling the program once IDL is available
    let sig = format!("4PMy8H44BpqDXYZ_{}", pix_transaction_id);
    
    Ok(sig)
}
