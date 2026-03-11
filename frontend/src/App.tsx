import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import GameInterface from "./pages/GameInterface";
import UserDash from "./pages/UserDash";
import AdminDash from "./pages/AdminDash";
import RulesPage from "./pages/RulesPage";
import PreviousResultsPage from "./pages/PreviousResultsPage";
import MyBetsPage from "./pages/MyBetsPage";
import LiveDrawPage from "./pages/LiveDrawPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ResponsibleGamingPage from "./pages/ResponsibleGamingPage";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import MegaMenu from "./components/MegaMenu";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Menu } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import VerificarIdadePage from "./pages/VerificarIdadePage";

function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, isAdmin, login, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-bg-base/80 backdrop-blur-md border-b border-border-subtle z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
               <div className="w-8 h-8 bg-gradient-to-br from-primary-accent to-accent-magenta rounded-lg flex items-center justify-center p-0.5 shadow-[0_0_10px_rgba(0,255,204,0.2)]">
                 <div className="w-full h-full bg-bg-base rounded-md flex items-center justify-center">
                   <div className="w-3 h-3 bg-primary-accent rounded-sm rotate-45"></div>
                 </div>
               </div>
               <div>
                  <h1 className="text-lg font-heading font-black tracking-tight text-white leading-tight">MEGA<br/><span className="text-primary-accent">CRIPTO</span></h1>
               </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                to="/resultados"
                className="text-text-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Resultados
              </Link>
              <Link
                to="/regras"
                className="text-text-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Como Jogar
              </Link>
              {user && (
                <>
                  <Link
                    to="/jogar"
                    className="text-cta-primary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors font-bold"
                  >
                    Jogar Agora
                  </Link>

                  <Link
                    to="/minhas-apostas"
                    className="text-text-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Minhas Apostas
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin-secret"
                  className="text-accent-gold hover:text-accent-gold/80 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-slate-400 font-mono">
                      {user.email}
                    </span>
                    <span className="text-xs text-primary-accent font-mono font-bold tracking-wider">
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
                  className="bg-cta-primary hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-cta-primary/20 ml-2 cursor-pointer"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={onMenuClick} className="p-2 text-text-secondary">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen pt-16 flex flex-col font-body text-slate-200 relative">
        <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resultados" element={<PreviousResultsPage />} />
            <Route path="/regras" element={<RulesPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/privacidade" element={<PrivacyPage />} />
            <Route path="/jogo-responsavel" element={<ResponsibleGamingPage />} />
            <Route path="/live-draw" element={<LiveDrawPage />} />
            <Route path="/verificar-idade" element={<VerificarIdadePage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/jogar" element={<GameInterface />} />
              <Route path="/meu-painel" element={<UserDash />} />
              <Route path="/minhas-apostas" element={<MyBetsPage />} />
              <Route path="/admin-secret" element={<AdminDash />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
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
