import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou
    const accepted = localStorage.getItem('mega_cookies_accepted');
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const acceptCookies = () => {
    localStorage.setItem('mega_cookies_accepted', 'true');
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="bg-bg-surface/95 backdrop-blur-md border border-primary-accent/40 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
          
          <div className="flex-1 flex gap-4">
            <div className="bg-primary-accent/20 p-3 rounded-full shrink-0 flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary-accent" />
            </div>
            <div>
              <h3 className="text-text-primary font-bold mb-1">Valorizamos sua privacidade e seus cookies</h3>
              <p className="text-sm text-text-secondary">
                Utilizamos cookies essenciais para garantir o funcionamento da plataforma e cookies analíticos para melhorar sua experiência. Ao continuar, você concorda com nossos <Link to="/privacidade" className="text-primary-accent hover:underline">usos de cookies e política de privacidade</Link>.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 gap-3 w-full md:w-auto">
             <button 
                onClick={acceptCookies}
                className="w-full md:w-auto px-6 py-3 bg-cta-primary hover:bg-feedback-success text-text-primary font-bold rounded-xl transition-all shadow-success"
             >
               Aceitar Cookies
             </button>
             <button 
                onClick={() => setIsVisible(false)}
                className="p-3 text-text-disabled hover:text-text-primary bg-bg-base/50 hover:bg-bg-base rounded-xl transition-colors border border-border-subtle"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
