import axios from 'axios';

// URL do Backend Server Rust (Axum)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface PaymentIntentResponse {
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
  tx_id: string;
  mp_payment_id?: number;
}

export interface StartBetOptions {
  bets: number[][];
  userPubKey: string;
  payerEmail?: string;
  payerCpf?: string;
}

export const startBet = async (options: StartBetOptions): Promise<PaymentIntentResponse> => {
  try {
    const response = await axios.post(`${API_URL}/create-payment`, {
      bets: options.bets,
      user_pubkey: options.userPubKey,
      payer_email: options.payerEmail,
      payer_cpf: options.payerCpf,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar cobrança Pix:', error);
    throw error;
  }
};

// Interfaces for Dynamic Data
export interface CryptoPrice {
    id: string;
    symbol: string;
    name: string;
    image: string;
    price_brl: number;
    change_24h: number;
}

export interface AdminStats {
  volumeBRL: number;
  totalTickets: number;
  gasPoolSOL: number;
  gasTxCapacity: number;
  newRegistrations24h: number;
  currentDrawId: string;
}

export interface UserTicket {
  id: string;
  drawId: string;
  numbers: number[];
  status: "Aguardando Sorteio" | "Não Premiado" | "Premiado";
  verifiedAt?: string;
  /** Link da transação da aposta na Solana Explorer */
  solanaTx?: string;
  /** Valor do prêmio em R$ (preenchido pelo backend após apuração) */
  prizeAmountBRL?: number;
}

export interface UserStats {
  pubKey: string;
  tickets: UserTicket[];
}

export const getPrices = async (): Promise<CryptoPrice[]> => {
  try {
    const response = await axios.get(`${API_URL}/prices`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar preços:', error);
    throw error;
  }
};

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar stats do admin:', error);
    throw error;
  }
};

export const getUserStats = async (email: string): Promise<UserStats> => {
  try {
    const response = await axios.get(`${API_URL}/user/stats`, { params: { email } });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar stats do usuário:', error);
    throw error;
  }
};

export interface BetPrice {
  numbers_count: number;
  price: number;
}

export interface PrizeTierConfig {
  matches: number;
  prize_percentage: number;
}

export interface Config {
  global_prize_pool_percentage: number;
  bet_prices: BetPrice[];
  prize_tiers: PrizeTierConfig[];
}

export const getConfig = async (): Promise<Config> => {
  try {
    const response = await axios.get(`${API_URL}/admin/config`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    throw error;
  }
};

export const updateConfig = async (newConfig: Config): Promise<Config> => {
  try {
    const response = await axios.post(`${API_URL}/admin/config`, newConfig);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    throw error;
  }
};

export interface DrawResult {
  draw_id: string;
  date: string;
  numbers: number[];
  tx: string;
}

export const getResults = async (): Promise<DrawResult[]> => {
  try {
    const response = await axios.get(`${API_URL}/results`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    throw error;
  }
};

export const triggerDraw = async (): Promise<AdminStats> => {
  try {
    const response = await axios.post(`${API_URL}/admin/trigger-draw`);
    return response.data;
  } catch (error) {
    console.error('Erro ao acionar sorteio:', error);
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────
//  NOVOS: Timer real, encerramento de apostas, PIX key, polling
// ──────────────────────────────────────────────────────────────

export interface DrawStatus {
  betsOpen: boolean;
  nextDrawAt: string | null;  // ISO 8601
  msUntilDraw: number | null; // ms restantes (calculado no servidor)
  currentDrawId: string;
}

export const getDrawStatus = async (): Promise<DrawStatus> => {
  const response = await axios.get(`${API_URL}/draw/status`);
  return response.data;
};

export const setNextDraw = async (nextDrawAt: string): Promise<{ok: boolean}> => {
  const response = await axios.post(`${API_URL}/admin/set-next-draw`, { next_draw_at: nextDrawAt });
  return response.data;
};

export const toggleBets = async (): Promise<{bets_open: boolean}> => {
  const response = await axios.post(`${API_URL}/admin/toggle-bets`);
  return response.data;
};

export interface PaymentStatus {
  tx_id: string;
  confirmed: boolean;
  solana_tx?: string;
}

export const getPaymentStatus = async (txId: string): Promise<PaymentStatus> => {
  const response = await axios.get(`${API_URL}/payment/status/${txId}`);
  return response.data;
};

export interface RegisterPixKeyOptions {
  email: string;
  pixKey: string;
  pixKeyType: 'email' | 'cpf' | 'phone' | 'random';
}

export const registerPixKey = async (opts: RegisterPixKeyOptions): Promise<{ok: boolean}> => {
  const response = await axios.post(`${API_URL}/user/register-pix`, {
    email: opts.email,
    pix_key: opts.pixKey,
    pix_key_type: opts.pixKeyType,
  });
  return response.data;
};

export interface UserSettingsOptions {
  is_self_excluded: boolean;
  daily_limit_brl: number | null;
}

export const getUserSettings = async (email: string): Promise<UserSettingsOptions> => {
  try {
    const response = await axios.post(`${API_URL}/user/settings`, { email });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error);
    throw error;
  }
};

export const updateUserSettings = async (email: string, is_self_excluded?: boolean, daily_limit_brl?: number | null): Promise<UserSettingsOptions> => {
  try {
    const response = await axios.put(`${API_URL}/user/settings`, { 
        email, 
        is_self_excluded, 
        daily_limit_brl: daily_limit_brl === null ? -1 : daily_limit_brl 
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error);
    throw error;
  }
};
