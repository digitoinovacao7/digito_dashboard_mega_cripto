import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { X, Fingerprint } from 'lucide-react';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();

  if (!isLoginModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 px-4">
      <div className="bg-bg-surface border border-border-subtle p-8 rounded-3xl shadow-2xl text-center max-w-md w-full relative overflow-hidden group">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-accent/10 rounded-full blur-3xl group-hover:bg-primary-accent/20 transition-colors duration-500"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cta-primary/10 rounded-full blur-3xl group-hover:bg-cta-primary/20 transition-colors duration-500"></div>

        <button 
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-text-disabled hover:text-text-primary transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-bg-base rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border-subtle shadow-inner relative z-10">
          <Fingerprint className="w-10 h-10 text-primary-accent animate-pulse" />
        </div>

        <h2 className="text-3xl font-heading font-bold mb-3 text-white relative z-10">Acesso Necessário</h2>
        <p className="text-text-secondary mb-8 text-lg leading-relaxed relative z-10">
          Para começar a apostar e ter a chance de ganhar prêmios incríveis, você precisa acessar sua conta.
        </p>

        <div className="relative z-10">
          <button
            onClick={login}
            className="group flex items-center justify-center gap-4 bg-white hover:bg-white/90 text-black font-bold py-5 px-6 rounded-2xl w-full transition-all active:scale-[0.98] shadow-lg hover:shadow-white/20 border border-white/50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            <span className="text-lg">Entrar com Google</span>
          </button>
        </div>

        <p className="mt-8 text-xs text-text-disabled relative z-10">
          Ao entrar, você concorda com nossos <a href="/termos" className="underline hover:text-text-secondary">Termos de Uso</a> e <a href="/privacidade" className="underline hover:text-text-secondary">Privacidade</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
