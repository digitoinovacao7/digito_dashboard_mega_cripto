import { useState, useEffect } from "react";
import { ShieldCheck, Cpu, CheckCircle2, Trophy, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function LiveDrawPage() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Simular a progressão do sorteio
    const timer1 = setTimeout(() => setStep(1), 3000); // 3s: Solicitando Oráculo
    const timer2 = setTimeout(() => setStep(2), 8000); // 8s: Aguardando Oráculo
    const timer3 = setTimeout(() => setStep(3), 15000); // 15s: Revelando Números
    const timer4 = setTimeout(() => setStep(4), 22000); // 22s: Apuração Final

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const drawnNumbers = [5, 12, 18, 21, 2, 8, 14, 25, 19, 3, 7, 11, 23, 1, 9];

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 flex items-center justify-center gap-4">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-feedback-error opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-feedback-error"></span>
          </span>
          Sorteio Mega Cripto UAI Ao Vivo
        </h1>
        <p className="text-text-secondary text-xl">
          Acompanhe a transparência em tempo real
        </p>
      </div>

      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Cpu className="w-full h-full text-accent-gold rotating-slow" />
        </div>

        <div className="relative z-10 space-y-10">
          {/* Timeline */}
          <div className="flex flex-col gap-6">
            {/* Step 1 */}
            <div
              className={`transition-all duration-500 flex items-start gap-4 ${
                step >= 1 ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`p-3 rounded-full ${
                  step >= 1
                    ? "bg-primary-accent text-bg-base"
                    : "bg-bg-base border border-border-subtle text-text-disabled"
                }`}
              >
                {step > 1 ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <ShieldCheck
                    className={`w-6 h-6 ${step === 1 ? "animate-pulse" : ""}`}
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading">
                  1. Solicitando Aleatoriedade
                </h3>
                <p className="text-text-secondary text-sm mb-2">
                  Contato com o Smart Contract estabelecido.
                </p>
                {step >= 1 && (
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-xs font-mono text-primary-accent hover:underline bg-primary-accent/10 px-3 py-1 rounded"
                  >
                    Ver Transação na Solana ↗
                  </a>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`transition-all duration-500 flex items-start gap-4 ${
                step >= 2 ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`p-3 rounded-full ${
                  step >= 2
                    ? "bg-accent-gold text-bg-base"
                    : "bg-bg-base border border-border-subtle text-text-disabled"
                }`}
              >
                {step > 2 ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Cpu
                    className={`w-6 h-6 ${
                      step === 2 ? "animate-spin-slow" : ""
                    }`}
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading">
                  2. Aguardando Oráculo Chainlink VRF
                </h3>
                <p className="text-text-secondary text-sm">
                  Gerando números com prova criptográfica matematicamente
                  inviolável.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Revelação */}
          {step >= 3 && (
            <div className="pt-8 border-t border-border-subtle animate-fade-in-up">
              <h3 className="text-2xl font-bold font-heading text-center mb-6">
                3. Números Sorteados
              </h3>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
                {drawnNumbers.map((num, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-accent-gold text-bg-base font-black text-xl shadow-lg border-2 border-accent-gold transform scale-0 animate-pop-in"
                    style={{
                      animationDelay: `${idx * 150}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-xs font-mono text-accent-gold hover:underline bg-accent-gold/10 px-3 py-1 rounded"
                >
                  <Lock className="w-3 h-3" /> Verificar Prova Criptográfica do
                  Sorteio ↗
                </a>
              </div>
            </div>
          )}

          {/* Step 4: Apuração */}
          {step >= 4 && (
            <div className="pt-8 border-t border-border-subtle animate-fade-in-up">
              <h3 className="text-2xl font-bold font-heading text-center mb-6 flex items-center justify-center gap-2">
                <Trophy className="text-feedback-success" /> 4. Resultados
                Finais e Premiação
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-bg-base border border-border-subtle p-4 rounded-xl text-center">
                  <div className="text-sm text-text-secondary mb-1">
                    15 Acertos
                  </div>
                  <div className="text-2xl font-bold font-heading text-feedback-success mb-2">
                    1 Ganhador
                  </div>
                  <div className="text-lg font-mono">R$ 5.230,00</div>
                </div>
                <div className="bg-bg-base border border-border-subtle p-4 rounded-xl text-center">
                  <div className="text-sm text-text-secondary mb-1">
                    14 Acertos
                  </div>
                  <div className="text-2xl font-bold font-heading text-text-primary mb-2">
                    12 Ganhadores
                  </div>
                  <div className="text-lg font-mono">R$ 150,00</div>
                </div>
                <div className="bg-bg-base border border-border-subtle p-4 rounded-xl text-center">
                  <div className="text-sm text-text-secondary mb-1">
                    13 Acertos
                  </div>
                  <div className="text-2xl font-bold font-heading text-text-primary mb-2">
                    45 Ganhadores
                  </div>
                  <div className="text-lg font-mono">R$ 25,00</div>
                </div>
              </div>

              <div className="mt-8 text-center bg-feedback-success/10 border border-feedback-success/30 p-4 rounded-lg">
                <p className="text-feedback-success font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 /> Pagamentos automáticos via PIX iniciados!
                </p>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/resultados"
                  className="text-primary-accent hover:underline font-bold"
                >
                  Ver histórico de resultados completo &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
