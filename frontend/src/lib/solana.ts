import { Connection, clusterApiUrl } from '@solana/web3.js';

// No Frontend: Para testar com dinheiro de mentira usamos 'devnet'
// Quando for para valer com dinheiro real (produção), você mudará para 'mainnet-beta'
export const NETWORK = import.meta.env.VITE_SOLANA_NETWORK || 'devnet'; 
export const connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');

export const connectWallet = async () => {
    if ("solana" in window) {
        const provider = (window as any).solana;
        if (provider.isPhantom) {
            try {
                const response = await provider.connect();
                console.log('Wallet connected!', response.publicKey.toString());
                return response.publicKey.toString();
            } catch (err: any) {
                console.error("User rejected request");
            }
        }
    } else {
        window.open("https://phantom.app/", "_blank");
    }
};

export const disconnectWallet = async () => {
     if ("solana" in window) {
        const provider = (window as any).solana;
        if(provider) {
             await provider.disconnect();
        }
    }
}
