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

// TODO: Replace with Real Backend Fetch once endpoints are ready in Rust
export const getAdminStats = async (): Promise<AdminStats> => {
  // Simulating an Axios call to /admin/stats
  return new Promise((resolve) => setTimeout(() => resolve({
    volumeBRL: 4250.00,
    totalTickets: 850,
    gasPoolSOL: 12.45,
    gasTxCapacity: 150000,
    newRegistrations24h: 142,
    currentDrawId: "001"
  }), 800));
};

export const getUserStats = async (email: string): Promise<UserStats> => {
   // Simulating an Axios call to /user/stats?email=
   return new Promise((resolve) => setTimeout(() => resolve({
    pubKey: "DxL9cE7yA2B5mCqP...8uF2",
    tickets: [
      {
        id: "tx_1",
        drawId: "001",
        numbers: [2, 4, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 1],
        status: "Aguardando Sorteio",
        verifiedAt: "20:34"
      },
      {
        id: "tx_2",
        drawId: "000",
        numbers: [5, 12, 14, 15, 16, 20, 21, 22, 23, 24, 7, 8, 9, 10, 3],
        status: "Não Premiado"
      }
    ]
   }), 600));
};
