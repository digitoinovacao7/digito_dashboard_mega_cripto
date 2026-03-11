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
use anchor_client::{Client, Cluster};
use solana_sdk::{
    signature::Keypair,
    pubkey::Pubkey,
    signer::Signer,
    system_program,
};
use solana_client::rpc_client::RpcClient;
use cached::proc_macro::cached;
use reqwest;
use chrono::Local;
use rand::Rng;

// ─────────────────────────────────────────────────────────
//  STRUCTS DE PREÇO E CRIPTO
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
//  STRUCTS DO MERCADO PAGO
// ─────────────────────────────────────────────────────────

/// Corpo enviado ao endpoint POST /v1/payments do Mercado Pago
#[derive(Serialize, Debug)]
struct MpCreatePaymentBody {
    transaction_amount: f64,
    description: String,
    payment_method_id: String,
    payer: MpPayer,
    notification_url: String,
}

#[derive(Serialize, Debug)]
struct MpPayer {
    email: String,
    identification: MpIdentification,
}

#[derive(Serialize, Debug)]
struct MpIdentification {
    #[serde(rename = "type")]
    type_: String,
    number: String,
}

/// Resposta do Mercado Pago ao criar um pagamento PIX
#[derive(Deserialize, Debug)]
struct MpPaymentResponse {
    id: i64,
    status: String,
    point_of_interaction: Option<MpPointOfInteraction>,
}

#[derive(Deserialize, Debug)]
struct MpPointOfInteraction {
    transaction_data: Option<MpTransactionData>,
}

#[derive(Deserialize, Debug)]
struct MpTransactionData {
    qr_code: Option<String>,
    qr_code_base64: Option<String>,
    ticket_url: Option<String>,
}

/// Resposta do Mercado Pago ao consultar GET /v1/payments/{id}
#[derive(Deserialize, Debug)]
struct MpPaymentStatusResponse {
    id: i64,
    status: String, // "approved", "pending", "rejected", etc.
}

// ─────────────────────────────────────────────────────────
//  STRUCTS DO PAYOUT (pagamento de prêmios)
// ─────────────────────────────────────────────────────────

/// Corpo enviado ao endpoint de transferência PIX do Mercado Pago
#[derive(Serialize, Debug)]
struct MpPayoutBody {
    transaction_amount: f64,
    description: String,
    payment_method_id: String,
    receiver_address: String, // chave PIX do ganhador
}

/// Resposta do payout
#[derive(Deserialize, Debug)]
struct MpPayoutResponse {
    id: Option<i64>,
    status: Option<String>,
}

// ─────────────────────────────────────────────────────────
//  STRUCTS DO WEBHOOK
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
//  STRUCTS DE APOSTAS E ESTADO
// ─────────────────────────────────────────────────────────

#[derive(Deserialize, Clone)]
struct BetPayload {
    bets: Vec<Vec<u8>>,
    user_pubkey: String,
    payer_email: Option<String>,
    payer_cpf: Option<String>,
}

#[derive(Serialize, Clone)]
struct PaymentIntentResponse {
    qr_code: String,
    qr_code_base64: Option<String>,
    ticket_url: Option<String>,
    tx_id: String,
    mp_payment_id: i64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
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

#[derive(Serialize, Deserialize, Clone, Debug)]
struct UserTicket {
    id: String,
    #[serde(rename = "drawId")]
    draw_id: String,
    numbers: Vec<u8>,
    status: String,
    #[serde(rename = "verifiedAt")]
    verified_at: Option<String>,
    /// Link da transação na Solana Explorer
    #[serde(rename = "solanaTx")]
    solana_tx: Option<String>,
    /// Valor do prêmio (R$), preenchido após apuração
    #[serde(rename = "prizeAmountBRL")]
    prize_amount_brl: Option<f64>,
}

#[derive(Deserialize)]
struct UserStatsQuery {
    email: Option<String>,
}

#[derive(Serialize, Clone)]
struct UserStats {
    #[serde(rename = "pubKey")]
    pub_key: String,
    tickets: Vec<UserTicket>,
}

/// Armazena os dados de uma aposta pendente (aguardando confirmação do PIX)
#[derive(Clone, Debug)]
struct PendingBet {
    numbers: Vec<Vec<u8>>,   // múltiplos jogos do mesmo checkout
    user_pubkey: String,
    user_email: String,
    draw_id: String,
    mp_payment_id: i64,
    total_amount: f64,
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

#[derive(Serialize, Deserialize, Clone, Debug)]
struct DrawResult {
    draw_id: String,
    date: String,
    numbers: Vec<u8>,
    tx: String,
    /// Mapa de faixas → Resultado (ex: "15 acertos" → WinnerTier)
    tiers: Option<Vec<WinnerTier>>,
}

/// Resultado de uma faixa de premiação após apuração
#[derive(Serialize, Deserialize, Clone, Debug)]
struct WinnerTier {
    matches: u8,       // quantidade de acertos (15, 14, 13...)
    winners_count: u32,
    prize_per_winner: f64,
    total_prize: f64,
}

// ─────────────────────────────────────────────────────────
//  APP STATE (memória compartilhada entre handlers)
// ─────────────────────────────────────────────────────────

struct AppState {
    program_id: Pubkey,
    server_keypair: Arc<Keypair>,
    pending_bets: Arc<Mutex<HashMap<String, PendingBet>>>,
    admin_stats: Arc<Mutex<AdminStats>>,
    user_tickets: Arc<Mutex<HashMap<String, Vec<UserTicket>>>>,
    config: Arc<Mutex<Config>>,
    draw_results: Arc<Mutex<Vec<DrawResult>>>,
    /// Jackpot acumulado de concursos anteriores sem ganhador na faixa máxima
    jackpot_accumulated: Arc<Mutex<f64>>,
}

// ─────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    // Carrega o keypair do servidor (servidor é o `server_authority` no contrato)
    let server_keypair = load_server_keypair();
    let program_id = Pubkey::from_str("3PSnWULou1gWHj1SxGL4S5Gu12PrrRvHsGifqpM4CjH9").unwrap();

    println!("🔑  Server pubkey: {}", server_keypair.pubkey());
    println!("📄  Program ID:    {}", program_id);

    let client_id = Client::new(Cluster::Devnet, Arc::clone(&server_keypair));
    let _ = client_id; // garante que Client e Cluster continuam usados

    let state = Arc::new(AppState {
        program_id,
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
                tiers: None,
            },
        ])),
        jackpot_accumulated: Arc::new(Mutex::new(0.0)),
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .route("/create-payment",          post(create_payment_intent))
        .route("/webhook/mercadopago",     post(mercado_pago_webhook))
        .route("/prices",                  get(prices))
        .route("/admin/stats",             get(admin_stats))
        .route("/user/stats",              get(user_stats))
        .route("/admin/config",            get(get_config).post(update_config))
        .route("/results",                 get(get_results))
        .route("/admin/trigger-draw",      post(trigger_draw))
        .layer(cors)
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);
    println!("🚀  Backend Mega Cripto escutando em {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// ─────────────────────────────────────────────────────────
//  HELPER: carrega keypair do servidor
// ─────────────────────────────────────────────────────────

fn load_server_keypair() -> Arc<Keypair> {
    // Em produção: leia de SOLANA_KEYPAIR_PATH ou de uma variável de ambiente.
    // Em dev: gera um efêmero (não use em mainnet sem persistência).
    if let Ok(path) = std::env::var("SOLANA_KEYPAIR_PATH") {
        match std::fs::read_to_string(&path) {
            Ok(content) => {
                let bytes: Vec<u8> = serde_json::from_str(&content)
                    .expect("SOLANA_KEYPAIR_PATH deve ser um JSON array de bytes");
                Arc::new(Keypair::from_bytes(&bytes).expect("Keypair inválido"))
            }
            Err(e) => {
                eprintln!("⚠️  Não foi possível ler SOLANA_KEYPAIR_PATH ({}): {}. Usando keypair efêmero.", path, e);
                Arc::new(Keypair::new())
            }
        }
    } else {
        eprintln!("⚠️  SOLANA_KEYPAIR_PATH não definida. Usando keypair efêmero (apenas dev).");
        Arc::new(Keypair::new())
    }
}

// ─────────────────────────────────────────────────────────
//  HELPER: lê o MP_ACCESS_TOKEN da variável de ambiente
// ─────────────────────────────────────────────────────────

fn mp_access_token() -> String {
    std::env::var("MP_ACCESS_TOKEN")
        .unwrap_or_else(|_| "TEST-000000000000000-000000-00000000000000000000000000000000-000000000".to_string())
}

fn mp_webhook_url() -> String {
    std::env::var("MP_WEBHOOK_URL")
        .unwrap_or_else(|_| "https://seu-dominio.com/webhook/mercadopago".to_string())
}

// ─────────────────────────────────────────────────────────
//  HELPER: calcula total de acertos entre dois vetores
// ─────────────────────────────────────────────────────────

fn count_matches(bet_numbers: &[u8], drawn_numbers: &[u8]) -> u8 {
    bet_numbers.iter().filter(|n| drawn_numbers.contains(n)).count() as u8
}

// ─────────────────────────────────────────────────────────
//  HANDLER: criar pagamento PIX (Mercado Pago real)
// ─────────────────────────────────────────────────────────

async fn create_payment_intent(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<BetPayload>,
) -> impl IntoResponse {
    let bets = &payload.bets;
    let user_email = payload.payer_email.clone().unwrap_or_else(|| "cliente@megacripto.com.br".to_string());
    let user_cpf = payload.payer_cpf.clone().unwrap_or_else(|| "00000000000".to_string());

    // Calcula o total a cobrar
    let config = state.config.lock().unwrap().clone();
    let mut total_amount: f64 = 0.0;
    for bet in bets {
        let price = config.bet_prices.iter()
            .find(|p| p.numbers_count == bet.len() as u8)
            .map_or(0.0, |p| p.price);
        total_amount += price;
    }

    if total_amount <= 0.0 {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({
            "error": "Nenhuma aposta válida no carrinho ou preço não encontrado."
        }))).into_response();
    }

    let current_draw_id = state.admin_stats.lock().unwrap().current_draw_id.clone();

    // ── Etapa 1: Chamar a API real do Mercado Pago ──────────────────────
    let mp_body = MpCreatePaymentBody {
        transaction_amount: total_amount,
        description: format!("MegaCripto - Concurso #{} - {} jogo(s)", current_draw_id, bets.len()),
        payment_method_id: "pix".to_string(),
        payer: MpPayer {
            email: user_email.clone(),
            identification: MpIdentification {
                type_: "CPF".to_string(),
                number: user_cpf,
            },
        },
        notification_url: mp_webhook_url(),
    };

    let access_token = mp_access_token();
    let client = reqwest::Client::new();

    let mp_response = client
        .post("https://api.mercadopago.com/v1/payments")
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .header("X-Idempotency-Key", uuid::Uuid::new_v4().to_string())
        .json(&mp_body)
        .send()
        .await;

    let (qr_code, qr_code_base64, ticket_url, mp_payment_id) = match mp_response {
        Ok(resp) if resp.status().is_success() => {
            match resp.json::<MpPaymentResponse>().await {
                Ok(mp) => {
                    let poi = mp.point_of_interaction.as_ref();
                    let td  = poi.and_then(|p| p.transaction_data.as_ref());
                    (
                        td.and_then(|t| t.qr_code.clone())
                          .unwrap_or_else(|| "ERRO_AO_GERAR_QR_CODE".to_string()),
                        td.and_then(|t| t.qr_code_base64.clone()),
                        td.and_then(|t| t.ticket_url.clone()),
                        mp.id,
                    )
                }
                Err(e) => {
                    eprintln!("❌  MP parse error: {}", e);
                    return (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                        "error": format!("Falha ao processar resposta do Mercado Pago: {}", e)
                    }))).into_response();
                }
            }
        }
        Ok(resp) => {
            let status = resp.status();
            let body = resp.text().await.unwrap_or_default();
            eprintln!("❌  MP API error {}: {}", status, body);
            return (StatusCode::BAD_GATEWAY, Json(serde_json::json!({
                "error": format!("Mercado Pago retornou erro {}: {}", status, body)
            }))).into_response();
        }
        Err(e) => {
            eprintln!("❌  MP request failed: {}", e);
            return (StatusCode::SERVICE_UNAVAILABLE, Json(serde_json::json!({
                "error": format!("Não foi possível conectar ao Mercado Pago: {}", e)
            }))).into_response();
        }
    };

    // ── Etapa 2: Armazenar aposta pendente com o ID real do MP ──────────
    let tx_id = format!("MP-{}", mp_payment_id);

    {
        let mut bets_map = state.pending_bets.lock().unwrap();
        bets_map.insert(tx_id.clone(), PendingBet {
            numbers: bets.clone(),
            user_pubkey: payload.user_pubkey.clone(),
            user_email: user_email.clone(),
            draw_id: current_draw_id.clone(),
            mp_payment_id,
            total_amount,
        });
    }

    // Atualiza o volume e contagem de bilhetes imediatamente
    {
        let mut stats = state.admin_stats.lock().unwrap();
        stats.total_tickets += bets.len() as u32;
        stats.volume_brl += total_amount;
    }

    println!("✅  PIX criado: MP-ID={}, email={}, total=R${:.2}, draw={}", mp_payment_id, user_email, total_amount, current_draw_id);

    (StatusCode::CREATED, Json(PaymentIntentResponse {
        qr_code,
        qr_code_base64,
        ticket_url,
        tx_id,
        mp_payment_id,
    })).into_response()
}

// ─────────────────────────────────────────────────────────
//  HANDLER: Webhook do Mercado Pago
// ─────────────────────────────────────────────────────────

async fn mercado_pago_webhook(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<WebhookPayload>,
) -> Result<StatusCode, (StatusCode, String)> {
    println!("📩  Webhook recebido: action={:?}, type={:?}", payload.action, payload.type_);

    let is_payment = payload.action.as_deref() == Some("payment.updated")
        || payload.action.as_deref() == Some("payment.created")
        || payload.type_.as_deref() == Some("payment");

    if !is_payment {
        return Ok(StatusCode::OK);
    }

    let mp_payment_id_str = match payload.data.as_ref() {
        Some(d) => d.id.clone(),
        None => {
            eprintln!("⚠️  Webhook sem data.id");
            return Ok(StatusCode::OK);
        }
    };

    // ── Etapa 1: Consultar status real do pagamento na API do MP ────────
    let access_token = mp_access_token();
    let client = reqwest::Client::new();

    let status_resp = client
        .get(format!("https://api.mercadopago.com/v1/payments/{}", mp_payment_id_str))
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| (StatusCode::SERVICE_UNAVAILABLE, e.to_string()))?;

    let payment_status = status_resp
        .json::<MpPaymentStatusResponse>()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    println!("🔍  Status MP #{}: {}", payment_status.id, payment_status.status);

    if payment_status.status != "approved" {
        println!("⏳  Pagamento {} ainda não aprovado (status: {}). Ignorando.", mp_payment_id_str, payment_status.status);
        return Ok(StatusCode::OK);
    }

    // ── Etapa 2: Recuperar aposta pendente pelo ID do MP ────────────────
    let tx_id = format!("MP-{}", mp_payment_id_str);
    let pending_bet = {
        let mut bets_map = state.pending_bets.lock().unwrap();
        bets_map.remove(&tx_id)
    };

    let bet = match pending_bet {
        Some(b) => b,
        None => {
            eprintln!("⚠️  Aposta não encontrada para tx_id={} (pode ser duplicata de webhook)", tx_id);
            return Ok(StatusCode::OK);
        }
    };

    // ── Etapa 3: Registrar cada jogo na Solana ──────────────────────────
    let mut solana_sigs: Vec<String> = Vec::new();
    for game_numbers in &bet.numbers {
        let user_pubkey = match bet.user_pubkey.parse::<Pubkey>() {
            Ok(p) => p,
            Err(_) => {
                eprintln!("⚠️  pubkey inválida: {}", bet.user_pubkey);
                continue;
            }
        };

        match register_bet_on_chain(
            &state,
            user_pubkey,
            game_numbers,
            bet.draw_id.parse::<u64>().unwrap_or(0),
            tx_id.clone(),
        ).await {
            Ok(sig) => {
                println!("⛓️   Aposta registrada on-chain: {}", sig);
                solana_sigs.push(sig);
            }
            Err(e) => {
                eprintln!("❌  Falha ao registrar on-chain: {:?}", e);
                // Em produção: retentar ou mover para fila de dead-letter
                solana_sigs.push(format!("FALHA:{}", e));
            }
        }
    }

    // ── Etapa 4: Criar tickets na memória do usuário ─────────────────────
    {
        let mut user_map = state.user_tickets.lock().unwrap();
        let user_tickets = user_map.entry(bet.user_email.clone()).or_insert_with(Vec::new);
        for (i, game_numbers) in bet.numbers.iter().enumerate() {
            let sig = solana_sigs.get(i).cloned().unwrap_or_else(|| "pendente".to_string());
            let solana_explorer_url = if sig.starts_with("FALHA") {
                None
            } else {
                Some(format!("https://explorer.solana.com/tx/{}?cluster=devnet", sig))
            };

            user_tickets.push(UserTicket {
                id: format!("{}-{}", tx_id, i),
                draw_id: bet.draw_id.clone(),
                numbers: game_numbers.clone(),
                status: "Aguardando Sorteio".to_string(),
                verified_at: Some(chrono::Utc::now().format("%H:%M").to_string()),
                solana_tx: solana_explorer_url,
                prize_amount_brl: None,
            });
        }
    }

    println!("✅  {} jogo(s) registrado(s) para {}", bet.numbers.len(), bet.user_email);
    Ok(StatusCode::OK)
}

// ─────────────────────────────────────────────────────────
//  ITEM 2: Registro real on-chain via Anchor Client
// ─────────────────────────────────────────────────────────

async fn register_bet_on_chain(
    state: &AppState,
    user_pubkey: Pubkey,
    numbers: &[u8],
    draw_id: u64,
    pix_transaction_id: String,
) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        transaction::Transaction,
        commitment_config::CommitmentConfig,
    };
    use borsh::BorshSerialize;

    // ── Serializa os argumentos da instrução manualmente (Borsh) ─────────
    // Layout: discriminator(8) | numbers([u8;15]) | draw_id(u64) | pix_tx_id(String)
    // Discriminador = sha256("global:register_bet")[..8]
    let discriminator: [u8; 8] = [219, 68, 244, 185, 247, 144, 30, 143];

    let mut numbers_arr = [0u8; 15];
    for (i, &n) in numbers.iter().take(15).enumerate() {
        numbers_arr[i] = n;
    }

    let mut ix_data = discriminator.to_vec();
    BorshSerialize::serialize(&numbers_arr, &mut ix_data)?;
    BorshSerialize::serialize(&draw_id, &mut ix_data)?;
    BorshSerialize::serialize(&pix_transaction_id, &mut ix_data)?;

    // ── Deriva o PDA da conta Bet ─────────────────────────────────────────
    let (bet_account_pda, _bump) = Pubkey::find_program_address(
        &[
            b"bet",
            state.server_keypair.pubkey().as_ref(),
            user_pubkey.as_ref(),
            &draw_id.to_le_bytes(),
            pix_transaction_id.as_bytes().get(..32).unwrap_or(pix_transaction_id.as_bytes()),
        ],
        &state.program_id,
    );

    println!(
        "⛓️   Enviando tx → program={}, bet_pda={}, user={}, draw_id={}",
        state.program_id, bet_account_pda, user_pubkey, draw_id
    );

    // ── Monta as accounts da instrução ──────────────────────────────────
    let accounts = vec![
        AccountMeta::new(bet_account_pda, false),
        AccountMeta::new_readonly(user_pubkey, false),
        AccountMeta::new(state.server_keypair.pubkey(), true),
        AccountMeta::new_readonly(system_program::ID, false),
    ];

    let instruction = Instruction {
        program_id: state.program_id,
        accounts,
        data: ix_data,
    };

    let keypair_bytes = state.server_keypair.to_bytes();
    let _program_id = state.program_id;
    let rpc_url = std::env::var("SOLANA_RPC_URL")
        .unwrap_or_else(|_| "https://api.devnet.solana.com".to_string());

    let sig = tokio::task::spawn_blocking(move || -> Result<String, String> {
        let rpc = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());
        let keypair = Keypair::from_bytes(&keypair_bytes).map_err(|e| e.to_string())?;
        let recent_blockhash = rpc.get_latest_blockhash().map_err(|e| e.to_string())?;
        let tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&keypair.pubkey()),
            &[&keypair],
            recent_blockhash,
        );
        let sig = rpc.send_and_confirm_transaction(&tx).map_err(|e| e.to_string())?;
        Ok(sig.to_string())
    })
    .await
    .map_err(|e| Box::<dyn std::error::Error + Send + Sync>::from(e.to_string()))?
    .map_err(|e| Box::<dyn std::error::Error + Send + Sync>::from(e))?;

    Ok(sig)
}



// ─────────────────────────────────────────────────────────
//  ITEM 3: Sorteio + Apuração de Ganhadores
// ─────────────────────────────────────────────────────────

async fn trigger_draw(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    // ── 1. Gera os números sorteados (produção: usar Chainlink VRF) ──────
    let mut rng = rand::thread_rng();
    let mut drawn: Vec<u8> = Vec::new();
    while drawn.len() < 15 {
        let n: u8 = rng.gen_range(1..=25);
        if !drawn.contains(&n) {
            drawn.push(n);
        }
    }
    drawn.sort();

    let draw_id = {
        let stats = state.admin_stats.lock().unwrap();
        stats.current_draw_id.clone()
    };

    println!("🎯  Sorteio #{}: {:?}", draw_id, drawn);

    // ── 2. Apuração: varre todos os tickets e calcula acertos ────────────
    let prize_percentage = state.config.lock().unwrap().prize_percentage;
    let total_pool = state.admin_stats.lock().unwrap().volume_brl;
    let jackpot_prev = *state.jackpot_accumulated.lock().unwrap();
    let total_prize_pool = (total_pool * prize_percentage / 100.0) + jackpot_prev;

    // Regras de distribuição por faixa (% do pool de prêmios)
    // 15 acertos = 60%, 14 acertos = 25%, 13 acertos = 15%
    let tier_rules: Vec<(u8, f64)> = vec![
        (15, 0.60),
        (14, 0.25),
        (13, 0.15),
    ];

    // Conta ganhadores por faixa
    let mut tier_winners: HashMap<u8, Vec<String>> = HashMap::new(); // faixa → vec de user_emails
    let mut tier_prize_amount: HashMap<u8, f64> = HashMap::new();

    for (matches_required, percentage) in &tier_rules {
        let prize = total_prize_pool * percentage;
        tier_prize_amount.insert(*matches_required, prize);
        tier_winners.insert(*matches_required, Vec::new());
    }

    {
        let mut user_map = state.user_tickets.lock().unwrap();
        for (user_email, tickets) in user_map.iter_mut() {
            for ticket in tickets.iter_mut() {
                if ticket.draw_id != draw_id {
                    continue; // pertence a outro concurso
                }

                let matches = count_matches(&ticket.numbers, &drawn);
                let matched_tier = tier_rules.iter().find(|(req, _)| matches >= *req);

                if let Some((tier, _)) = matched_tier {
                    if let Some(winners) = tier_winners.get_mut(tier) {
                        winners.push(user_email.clone());
                    }
                    ticket.status = "Premiado".to_string();
                } else {
                    ticket.status = "Não Premiado".to_string();
                }
            }
        }
    }

    // ── 3. Calcula prêmio por ganhador e lógica de acumulação ────────────
    let mut tiers_result: Vec<WinnerTier> = Vec::new();
    let mut jackpot_next: f64 = 0.0;

    for (matches_required, _) in &tier_rules {
        let winners = tier_winners.get(matches_required).cloned().unwrap_or_default();
        let prize_pool = *tier_prize_amount.get(matches_required).unwrap_or(&0.0);

        if winners.is_empty() {
            // Nenhum ganhador → acumula para próximo concurso
            println!(
                "🔄  {} acertos: 0 ganhadores → R${:.2} acumulado para próximo concurso",
                matches_required, prize_pool
            );
            jackpot_next += prize_pool;
            tiers_result.push(WinnerTier {
                matches: *matches_required,
                winners_count: 0,
                prize_per_winner: 0.0,
                total_prize: prize_pool,
            });
        } else {
            let prize_per_winner = prize_pool / winners.len() as f64;
            println!(
                "🏆  {} acertos: {} ganhador(es) → R${:.2} cada",
                matches_required, winners.len(), prize_per_winner
            );

            tiers_result.push(WinnerTier {
                matches: *matches_required,
                winners_count: winners.len() as u32,
                prize_per_winner,
                total_prize: prize_pool,
            });

            // Atualiza os tickets dos ganhadores com o valor do prêmio
            {
                let mut user_map = state.user_tickets.lock().unwrap();
                for winner_email in &winners {
                    if let Some(tickets) = user_map.get_mut(winner_email.as_str()) {
                        for ticket in tickets.iter_mut() {
                            if ticket.draw_id == draw_id && ticket.status == "Premiado" {
                                let matches = count_matches(&ticket.numbers, &drawn);
                                if matches >= *matches_required {
                                    ticket.prize_amount_brl = Some(prize_per_winner);
                                }
                            }
                        }
                    }
                }
            }

            // ── ITEM 4: Pagar os ganhadores via PIX (Mercado Pago) ──────────────
            // Roda em background para não bloquear a resposta
            let winners_clone = winners.clone();
            let prize_clone = prize_per_winner;
            let draw_id_clone = draw_id.clone();
            let user_map_arc = Arc::clone(&state.user_tickets);

            tokio::spawn(async move {
                for winner_email in winners_clone {
                    // Busca a chave PIX do ganhador (armazenada como `pub_key` no ticket)
                    let _pix_key = {
                        let map = user_map_arc.lock().unwrap();
                        map.get(&winner_email)
                           .and_then(|tickets| tickets.first())
                           .map(|t| t.id.clone()) // Em produção: campo `pix_key` dedicado
                    };

                    // Em produção real, pix_key viria do UserAccount on-chain (campo pix_key do `initialize_user`)
                    // Por ora, usamos o email como chave PIX (tipo EMAIL no MP)
                    if let Err(e) = pay_winner_via_pix(
                        &winner_email,       // chave PIX tipo e-mail
                        "email",
                        prize_clone,
                        &draw_id_clone,
                    ).await {
                        eprintln!("❌  Payout falhou para {}: {:?}", winner_email, e);
                    } else {
                        println!("💸  Payout OK para {} - R${:.2}", winner_email, prize_clone);
                    }
                }
            });
        }
    }

    // ── 4. Persiste o jackpot do próximo concurso ─────────────────────────
    *state.jackpot_accumulated.lock().unwrap() = jackpot_next;

    // ── 5. Registra o resultado e avança o concurso ───────────────────────
    let new_draw_id = draw_id.parse::<u64>().unwrap_or(101) + 1;

    {
        let mut results = state.draw_results.lock().unwrap();
        results.insert(0, DrawResult {
            draw_id: draw_id.clone(),
            date: Local::now().format("%d/%m/%Y").to_string(),
            numbers: drawn.clone(),
            tx: format!("solana_vrf_tx_{}", draw_id), // Em prod: hash real da tx Chainlink VRF
            tiers: Some(tiers_result),
        });
    }

    {
        let mut stats = state.admin_stats.lock().unwrap();
        stats.current_draw_id = new_draw_id.to_string();
        stats.volume_brl = jackpot_next;  // O volume do novo concurso começa com o jackpot acumulado
        stats.total_tickets = 0;
    }

    let stats = state.admin_stats.lock().unwrap().clone();
    (StatusCode::OK, Json(stats))
}

// ─────────────────────────────────────────────────────────
//  ITEM 4: Pagamento de Prêmios via PIX (Mercado Pago)
// ─────────────────────────────────────────────────────────

async fn pay_winner_via_pix(
    pix_key: &str,
    pix_key_type: &str,  // "email", "cpf", "phone", "random"
    amount: f64,
    draw_id: &str,
) -> Result<i64, Box<dyn std::error::Error + Send + Sync>> {
    let access_token = mp_access_token();
    let client = reqwest::Client::new();

    // O endpoint de disbursements do Mercado Pago (transferências para terceiros)
    let payout_body = serde_json::json!({
        "amount": amount,
        "description": format!("Prêmio MegaCripto - Concurso #{}", draw_id),
        "payment_method": {
            "id": "pix",
            "type": "bank_transfer",
            "details": {
                "financial_institution": "pix",
                "pix_transaction_type": "transfer",
                "receiver_identification": {
                    "type": pix_key_type,
                    "value": pix_key
                }
            }
        }
    });

    let resp = client
        .post("https://api.mercadopago.com/v1/account/bank_transfers")
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .header("X-Idempotency-Key", uuid::Uuid::new_v4().to_string())
        .json(&payout_body)
        .send()
        .await?;

    let status = resp.status();
    if !status.is_success() {
        let body = resp.text().await?;
        eprintln!("❌  Payout MP error {}: {}", status, body);
        return Err(format!("Mercado Pago payout error {}: {}", status, body).into());
    }

    let payout_resp: MpPayoutResponse = resp.json().await?;
    let payout_id = payout_resp.id.unwrap_or(0);
    println!(
        "✅  PIX enviado: id={}, status={:?}, destino={}, valor=R${:.2}",
        payout_id, payout_resp.status, pix_key, amount
    );

    Ok(payout_id)
}

// ─────────────────────────────────────────────────────────
//  OUTROS HANDLERS (sem alteração de lógica)
// ─────────────────────────────────────────────────────────

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

async fn update_config(
    State(state): State<Arc<AppState>>,
    Json(new_config): Json<Config>,
) -> impl IntoResponse {
    let mut config = state.config.lock().unwrap();
    config.bet_prices = new_config.bet_prices;
    config.prize_percentage = new_config.prize_percentage;
    (StatusCode::OK, Json(config.clone()))
}

async fn admin_stats(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let stats = state.admin_stats.lock().unwrap().clone();
    (StatusCode::OK, Json(stats))
}

async fn user_stats(
    State(state): State<Arc<AppState>>,
    Query(params): Query<UserStatsQuery>,
) -> impl IntoResponse {
    let email = params.email.unwrap_or_else(|| "unknown".to_string());
    let tickets = {
        let guard = state.user_tickets.lock().unwrap();
        guard.get(&email).cloned().unwrap_or_else(Vec::new)
    };
    let stats = UserStats { pub_key: email, tickets };
    (StatusCode::OK, Json(stats))
}

#[cached(time = 60, result = true)]
async fn get_prices() -> std::result::Result<Vec<CryptoPrice>, String> {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin&vs_currencies=brl&include_24hr_change=true";
    let response: HashMap<String, CoinGeckoCoin> = reqwest::get(url)
        .await.map_err(|e| e.to_string())?
        .json()
        .await.map_err(|e| e.to_string())?;

    let mut prices: Vec<CryptoPrice> = Vec::new();
    for (id, data) in response {
        let (symbol, name, image) = match id.as_str() {
            "bitcoin"   => ("BTC",  "Bitcoin",  "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"),
            "ethereum"  => ("ETH",  "Ethereum", "https://assets.coingecko.com/coins/images/279/large/ethereum.png"),
            "solana"    => ("SOL",  "Solana",   "https://assets.coingecko.com/coins/images/4128/large/solana.png"),
            "usd-coin"  => ("USDC", "USD Coin", "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"),
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
