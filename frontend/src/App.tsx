import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameInterface from './pages/GameInterface';
import UserDash from './pages/UserDash';
import AdminDash from './pages/AdminDash';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-brand-bg/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <span className="text-brand-accent">✦</span> MegaCripto
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/jogar" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Jogar Agora
              </Link>
              <Link to="/meu-painel" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Meu Painel
              </Link>
              <Link to="/admin-secret" className="text-brand-web3 hover:text-brand-web3/80 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Admin
              </Link>
              <button className="bg-brand-pix hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-pix/20">
                Conectar
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen pt-16 font-body text-slate-200">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jogar" element={<GameInterface />} />
            <Route path="/meu-painel" element={<UserDash />} />
            <Route path="/admin-secret" element={<AdminDash />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
