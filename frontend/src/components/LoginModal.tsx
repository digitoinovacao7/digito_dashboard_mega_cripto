import React from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();

  if (!isLoginModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-surface p-8 rounded-lg shadow-lg text-center max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-4">Acesso Necessário</h2>
        <p className="text-text-secondary mb-6">
          Para começar a apostar e ter a chance de ganhar prêmios incríveis, você precisa acessar sua conta.
        </p>
        <button
          onClick={login}
          className="bg-primary-accent hover:bg-primary-accent/90 text-black font-bold py-2 px-4 rounded w-full"
        >
          Acessar com Google
        </button>
        <button
          onClick={closeLoginModal}
          className="mt-4 text-sm text-text-secondary hover:text-text-primary"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
