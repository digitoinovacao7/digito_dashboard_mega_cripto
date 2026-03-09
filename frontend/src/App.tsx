import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameInterface from "./pages/GameInterface";
import UserDash from "./pages/UserDash";
import AdminDash from "./pages/AdminDash";
import RulesPage from "./pages/RulesPage";
import PreviousResultsPage from "./pages/PreviousResultsPage";
import MyBetsPage from "./pages/MyBetsPage";
import { AuthProvider, useAuth } from "./hooks/useAuth";

function Navbar() {
  const { user, isAdmin, login, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-brand-bg/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-heading font-bold text-white flex items-center gap-2"
            >
              <span className="text-brand-accent">✦</span> MegaCripto
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                to="/jogar"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Jogar Agora
              </Link>
              <Link
                to="/resultados"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Resultados
              </Link>
              <Link
                to="/regras"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Regras
              </Link>
              {user && (
                <>
                  <Link
                    to="/meu-painel"
                    className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Meu Painel
                  </Link>
                  <Link
                    to="/minhas-apostas"
                    className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Minhas Apostas
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin-secret"
                  className="text-brand-web3 hover:text-brand-web3/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Painel de Controle
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-slate-400 font-mono">
                      {user.email}
                    </span>
                    <span className="text-xs text-brand-pix font-mono font-bold tracking-wider">
                      {user.pubkey.slice(0, 4)}...{user.pubkey.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-slate-400 hover:text-white text-sm font-medium transition-all"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="bg-brand-pix hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-pix/20 ml-2"
                >
                  Entrar com Google
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/50 py-8 mt-12 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>&copy; 2026 MegaCripto. Contrato Inteligente Auditável.</p>
      </div>
    </footer>
  );
}

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen pt-16 flex flex-col font-body text-slate-200">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jogar" element={<GameInterface />} />
            <Route path="/resultados" element={<PreviousResultsPage />} />
            <Route path="/regras" element={<RulesPage />} />
            <Route path="/meu-painel" element={<UserDash />} />
            <Route path="/minhas-apostas" element={<MyBetsPage />} />
            <Route path="/admin-secret" element={<AdminDash />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
