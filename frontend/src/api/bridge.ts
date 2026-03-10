import axios from 'axios';

// URL do Backend Server Rust (Axum)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface PaymentIntentResponse {
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
  tx_id: string;
}

export const startBet = async (bets: number[][], userPubKey: string): Promise<PaymentIntentResponse> => {
  try {
    // 1. O Frontend dispara um pedido de Pix via POST.
    const response = await axios.post(`${API_URL}/create-payment`, { 
        bets,
        user_pubkey: userPubKey
    });
    
    // 2. Retorna o conteúdo da cobrança PIX gerada pelo Backend
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

export interface Config {
  bet_prices: BetPrice[];
  prize_percentage: number;
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
