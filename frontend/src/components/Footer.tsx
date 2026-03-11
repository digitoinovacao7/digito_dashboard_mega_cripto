import { BookOpen, ShieldCheck, Scale, AlertTriangle, Github, Twitter, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ApostarAgoraLink() {
  const { user, openLoginModal } = useAuth();
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (user) {
      navigate('/jogar');
    } else {
      openLoginModal();
    }
  };

  return (
    <button onClick={handleClick} className="hover:text-primary-accent transition-colors text-left">
      Apostar Agora
    </button>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border-subtle bg-bg-surface/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1 */}
          <div className="md:col-span-1 border-r border-border-subtle/50 pr-6">
             <Link to="/" className="flex items-center gap-3 w-fit mb-4">
               {/* Logo Simulada */}
               <div className="w-10 h-10 bg-gradient-to-br from-primary-accent to-accent-magenta rounded-xl flex items-center justify-center p-1 shadow-[0_0_15px_rgba(0,255,204,0.3)]">
                 <div className="w-full h-full bg-bg-base rounded-lg flex items-center justify-center">
                   <div className="w-4 h-4 bg-primary-accent rounded-sm rotate-45"></div>
                 </div>
               </div>
               <div>
                  <h1 className="text-xl font-heading font-black tracking-tight text-white leading-tight">MEGA<br/><span className="text-primary-accent">CRIPTO</span></h1>
               </div>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              A revolução transparente das loterias usando contratos inteligentes na Solana. Pagamentos em PIX.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-bg-base border border-border-subtle rounded-full text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-bg-base border border-border-subtle rounded-full text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-bg-base border border-border-subtle rounded-full text-text-secondary hover:text-primary-accent hover:border-primary-accent transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-accent" /> Plataforma
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><ApostarAgoraLink /></li>
              <li><Link to="/resultados" className="hover:text-primary-accent transition-colors">Últimos Resultados</Link></li>
              <li><Link to="/regras" className="hover:text-primary-accent transition-colors">Como Jogar</Link></li>
              <li><a href="mailto:suporte@megacripto.com" className="hover:text-primary-accent transition-colors">Suporte</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary-accent" /> Legal &amp; Compliance
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/termos" className="hover:text-primary-accent transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="hover:text-primary-accent transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/jogo-responsavel" className="hover:text-primary-accent transition-colors flex items-center gap-2">Jogo Responsável <AlertTriangle className="w-3 h-3 text-feedback-warning" /></Link></li>
            </ul>
          </div>


        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between text-xs text-text-disabled gap-4">
          <p>© 2026 Mega Cripto LLC. Todos os direitos reservados. 18+</p>
          <div className="flex gap-4 font-mono">
            <span>Rede Solana (Devnet)</span>
            <span>v1.0.0-rc</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
