import axios from 'axios';

// URL do Backend Server Rust (Axum)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface PaymentIntentResponse {
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
  tx_id: string;
}

export const startBet = async (numbers: number[], userPubKey: string): Promise<PaymentIntentResponse> => {
  try {
    // 1. O Frontend dispara um pedido de Pix via POST.
    const response = await axios.post(`${API_URL}/create-payment`, { 
        numbers,
        user_pubkey: userPubKey
    });
    
    // 2. Retorna o conteúdo da cobrança PIX gerada pelo Backend
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar cobrança Pix:', error);
    throw error;
  }
};
