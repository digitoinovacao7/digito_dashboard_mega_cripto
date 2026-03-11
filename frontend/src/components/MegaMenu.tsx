import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { X } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const { user, isAdmin, login, logout } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-bg-base/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-text-secondary">
        <X className="w-8 h-8" />
      </button>
      <div className="flex flex-col items-center space-y-8">
        <Link
          to="/resultados"
          className="text-text-secondary hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors"
          onClick={handleLinkClick}
        >
          Resultados
        </Link>
        <Link
          to="/regras"
          className="text-text-secondary hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors"
          onClick={handleLinkClick}
        >
          Como Jogar
        </Link>
        {user && (
          <>
            <Link
              to="/jogar"
              className="text-cta-primary hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors font-bold"
              onClick={handleLinkClick}
            >
              Jogar Agora
            </Link>

            <Link
              to="/minhas-apostas"
              className="text-text-secondary hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors"
              onClick={handleLinkClick}
            >
              Minhas Apostas
            </Link>
          </>
        )}
        {isAdmin && (
          <Link
            to="/admin-secret"
            className="text-accent-gold hover:text-accent-gold/80 px-3 py-2 rounded-md text-lg font-medium transition-colors"
            onClick={handleLinkClick}
          >
            Admin
          </Link>
        )}
        {user ? (
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-700 w-full">
            <div className="flex flex-col text-center">
              <span className="text-sm text-slate-400 font-mono">
                {user.email}
              </span>
              <span className="text-sm text-primary-accent font-mono font-bold tracking-wider">
                {user.pubkey.slice(0, 4)}...{user.pubkey.slice(-4)}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                handleLinkClick();
              }}
              className="text-slate-400 hover:text-white text-lg font-medium transition-all"
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              login();
              handleLinkClick();
            }}
            className="bg-cta-primary hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all shadow-lg shadow-cta-primary/20 mt-4"
          >
            Entrar
          </button>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
