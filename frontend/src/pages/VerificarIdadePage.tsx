import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const VerificarIdadePage: React.FC = () => {
  const { completeKyc, isVerified, isLoading, isAdmin } = useAuth();

  // Redirect admins as they don't need KYC
  if (isAdmin) {
    return <Navigate to="/admin-secret" replace />;
  }

  // If the user is already verified (e.g., after clicking approve), redirect them.
  if (isVerified) {
    return <Navigate to="/jogar" replace />;
  }

  const handleApprove = () => {
    completeKyc('APPROVE');
  };

  const handleReject = () => {
    completeKyc('REJECT');
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Verificação de Perfil (Modo de Teste)</h1>
      <p className="mb-8">
        Esta é uma tela para testes. Em produção, aqui haverá um formulário para validação de Nome, CPF e Data de Nascimento via BigData Corp.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleApprove}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Simular Aprovação de KYC
        </button>
        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Simular Rejeição de KYC
        </button>
      </div>
    </div>
  );
};

export default VerificarIdadePage;
