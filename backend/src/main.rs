use axum::{
    extract::{State, Json},
    routing::{post, get},
    Router,
    http::{StatusCode, Method},
    response::IntoResponse,
};
use tower_http::cors::{Any, CorsLayer};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use solana_sdk::{
    signature::{Keypair, Signer},
    pubkey::Pubkey,
};

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
#[derive(Deserialize)]
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
    server_keypair: Keypair,
    program_id: Pubkey,
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState {
        server_keypair: Keypair::new(),
        program_id: Pubkey::default(), 
    });

    // Configure CORS for local development React site
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .route("/create-payment", post(create_payment_intent))
        .route("/webhook/mercadopago", post(mercado_pago_webhook))
        .layer(cors)
        .with_state(state);

    println!("Backend server listening on 0.0.0.0:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn create_payment_intent(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<BetPayload>,
) -> impl IntoResponse {
    println!("Received bet request for public key: {}", payload.user_pubkey);
    println!("Numbers selected: {:?}", payload.numbers);

    // 1. Gera o Pix no Mercado Pago através da API do SDK ou reqwest
    // mock:
    let mp_tx_id = format!("MP-{}", uuid::Uuid::new_v4());
    
    // 2. Salva temporariamente os números escolhidos no cache/banco
    // (A implementar: Redis store com chave `mp_tx_id`)

    // 3. Retorna o QR Code (mock do copia e cola pix) para o Frontend
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
    
    // Support either "payment.created" action or "payment" type depending on MP API version
    let is_payment = payload.action.as_deref() == Some("payment.created") || payload.type_.as_deref() == Some("payment");
    
    if is_payment {
        if let Some(data) = payload.data {
            println!("Processing payment ID: {}", data.id);
            // 1. Check payment status from Mercado Pago API using data.id
            // let status = check_mercadopago_status(&data.id).await;
            
            // 2. If approved, retrieve bet from cache using payment ID
            let status = "approved"; // mock
            
            if status == "approved" {
                // Mock bet data
                let user_pubkey = Pubkey::new_unique();
                let numbers: [u8; 15] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
                let draw_id = 1;
                
                // 3. Send to Solana Smart Contract
                match process_bet_on_chain(&state, user_pubkey, numbers, draw_id, data.id.clone()).await {
                    Ok(sig) => println!("Bet {} registered on-chain! Tx: {}", data.id, sig),
                    Err(e) => eprintln!("Failed to register bet on-chain: {:?}", e),
                }
            }
        }
    }
    
    Ok(StatusCode::OK)
}

// Function that integrates with Anchor Client
async fn process_bet_on_chain(
    state: &AppState,
    user_pubkey: Pubkey,
    numbers: [u8; 15],
    draw_id: u64,
    pix_transaction_id: String,
) -> Result<String, Box<dyn std::error::Error>> {
    println!(
        "Executing Anchor Instruction `register_bet` for user {} (MP Tx ID: {})",
        user_pubkey, pix_transaction_id
    );
    
    // Normal anchor-client interaction to send transaction to Solana
    // let program = state.anchor_client.program(state.program_id);
    // let bet_keypair = Keypair::new();
    // let sig = program
    //     .request()
    //     .signer(&state.server_keypair)
    //     .signer(&bet_keypair)
    //     .accounts(digito_dashboard_mega_cripto::accounts::RegisterBet {
    //         bet_account: bet_keypair.pubkey(),
    //         user: user_pubkey,
    //         server_authority: state.server_keypair.pubkey(),
    //         system_program: solana_sdk::system_program::id(),
    //     })
    //     .args(digito_dashboard_mega_cripto::instruction::RegisterBet {
    //         numbers,
    //         draw_id,
    //         pix_transaction_id,
    //     })
    //     .send()?;
    // Ok(sig.to_string())
    
    Ok("MockSignature123456789".to_string())
}
