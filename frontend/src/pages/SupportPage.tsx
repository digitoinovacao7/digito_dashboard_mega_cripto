import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, ShieldCheck, ExternalLink, Send, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const SupportPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.description) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'support_tickets'), {
        ...formData,
        status: 'open',
        createdAt: serverTimestamp()
      });

      toast.success('Ticket enviado com sucesso! Entraremos em contato em breve.');
      setFormData({ name: '', email: '', description: '' });
    } catch (error) {
      console.error('Error sending ticket:', error);
      toast.error('Erro ao enviar o ticket. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 bg-gradient-to-r from-white via-primary-accent to-white bg-clip-text text-transparent">
          Central de Suporte
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Estamos aqui para ajudar você. Tire suas dúvidas, reporte problemas ou dê sugestões para melhorarmos sua experiência.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Support Card 1: Email */}
        <div className="bg-bg-surface border border-border-subtle p-8 rounded-3xl hover:border-primary-accent/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Mail className="w-24 h-24 text-primary-accent" />
          </div>
          <div className="w-14 h-14 bg-bg-base rounded-2xl flex items-center justify-center mb-6 border border-border-subtle group-hover:scale-110 transition-transform">
            <Mail className="w-7 h-7 text-primary-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white">E-mail de Suporte</h3>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Para questões formais, segurança ou parcerias, envie um e-mail diretamente para nosso time.
          </p>
          <a 
            href="mailto:suporte@megacripto.com"
            className="inline-flex items-center gap-2 text-primary-accent font-bold hover:gap-3 transition-all"
          >
            suporte@megacripto.com <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Support Card 2: Community */}
        <div className="bg-bg-surface border border-border-subtle p-8 rounded-3xl hover:border-cta-primary/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <MessageSquare className="w-24 h-24 text-cta-primary" />
          </div>
          <div className="w-14 h-14 bg-bg-base rounded-2xl flex items-center justify-center mb-6 border border-border-subtle group-hover:scale-110 transition-transform">
            <MessageSquare className="w-7 h-7 text-cta-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white">Comunidade Discord</h3>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Participe do nosso Discord oficial para ajuda em tempo real da comunidade e moderadores.
          </p>
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-cta-primary font-bold hover:gap-3 transition-all"
          >
            Entrar no Discord <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 bg-bg-surface/30 p-8 rounded-3xl border border-border-subtle border-dashed">
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-primary-accent/10 rounded-lg">
            <Clock className="w-5 h-5 text-primary-accent" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Tempo de Resposta</h4>
            <p className="text-xs text-text-secondary leading-relaxed">Média de 2h a 24h dependendo da complexidade.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-cta-primary/10 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-cta-primary" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Suporte Seguro</h4>
            <p className="text-xs text-text-secondary leading-relaxed">Nunca pediremos suas chaves privadas ou senhas.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-accent-gold/10 rounded-lg">
            <ExternalLink className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Base de Conhecimento</h4>
            <p className="text-xs text-text-secondary leading-relaxed">Confira nossas regras antes de abrir um ticket.</p>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-accent via-accent-magenta to-cta-primary"></div>
        
        <div className="p-10">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-heading font-bold text-white mb-3">Envie uma Mensagem</h3>
            <p className="text-text-secondary">
              Preencha o formulário abaixo e nosso time técnico entrará em contato o mais breve possível.
            </p>
          </div>

          <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-text-secondary ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className="w-full bg-bg-base border border-border-subtle rounded-xl py-4 px-5 text-white focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent transition-all placeholder:text-text-disabled"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-text-secondary ml-1">E-mail para Contato</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplo@email.com"
                  required
                  className="w-full bg-bg-base border border-border-subtle rounded-xl py-4 px-5 text-white focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent transition-all placeholder:text-text-disabled"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-text-secondary ml-1">Como podemos ajudar?</label>
              <textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Descreva detalhadamente sua dúvida ou problema..."
                required
                className="w-full bg-bg-base border border-border-subtle rounded-xl py-4 px-5 text-white focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent transition-all placeholder:text-text-disabled resize-none"
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-accent to-accent-magenta text-white font-black py-5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-accent/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Ticket de Suporte
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
