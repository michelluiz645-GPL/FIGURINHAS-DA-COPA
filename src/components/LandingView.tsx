import React from "react";
import { STICKERS } from "../data";
import CardSticker from "./CardSticker";
import { ArrowRight, ShoppingBag, RefreshCw, ShieldCheck, Star } from "lucide-react";

interface LandingViewProps {
  onNavigate: (route: string) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  // Select dynamic World Cup Figurinhas da Copa for the frontpage featured strip
  const featuredStickers = STICKERS.filter((s) => s.category === "Copa do Mundo").slice(0, 4);

  const steps = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-brand-yellow font-bold" />,
      title: "1. Escolha suas Figurinhas",
      desc: "Navegue pelo mercado premium e encontre as figurinhas que faltam para completar seu álbum.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-brand-green font-bold" />,
      title: "2. Proponha Trocas",
      desc: "Troque seus cards repetidos diretamente com colecionadores ativos de todo o país de forma 100% segura.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-blue font-bold" />,
      title: "3. Negocie com Segurança",
      desc: "Todas as transações e saldos da carteira são processados instantaneamente por nosso validador inteligente.",
    },
  ];

  return (
    <div id="landing-page" className="relative flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-center px-4 overflow-hidden">
        {/* Animated Background Preview Elements */}
        <div className="absolute top-1/4 left-1/10 transform -translate-x-12 opacity-35 hidden lg:block float-sticker pointer-events-none">
          <div className="w-28 h-40 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-5xl shadow-xl border border-amber-400/30">
            ⚽
          </div>
        </div>
        <div className="absolute bottom-1/4 right-1/12 transform translate-x-12 opacity-35 hidden lg:block floating-sticker-delayed-1 pointer-events-none">
          <div className="w-28 h-40 bg-gradient-to-tr from-purple-500 to-indigo-700 rounded-2xl flex items-center justify-center text-5xl shadow-xl border border-purple-500/30">
            ☄️
          </div>
        </div>
        <div className="absolute top-1/3 right-1/10 transform translate-x-6 opacity-30 hidden lg:block floating-sticker-delayed-2 pointer-events-none">
          <div className="w-24 h-36 bg-gradient-to-tr from-sky-300 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-sky-300/30">
            🔟
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-brand-yellow font-mono tracking-wider backdrop-blur-md">
            <Star className="w-3.5 fill-brand-yellow text-brand-yellow" />
            <span>NOVA TEMPORADA DE COLECIONÁVEIS 2026</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tight text-white uppercase select-none">
            🎴 <span className="bg-gradient-to-r from-brand-yellow via-brand-green to-brand-blue bg-clip-text text-transparent glow-text-yellow">Trocacard</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Compre, venda e troque suas figurinhas favoritas na primeira plataforma brasileira totalmente gamificada com glassmorphic design.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate("#login")}
              id="btn-hero-cta"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-yellow to-amber-500 text-slate-900 font-display font-bold text-lg hover:shadow-lg hover:shadow-brand-yellow/30 hover:scale-[1.05] transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              Começar Agora
              <ArrowRight className="w-5" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("featured-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-display font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-md w-full sm:w-auto justify-center flex cursor-pointer"
            >
              Explorar Destaques
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured-section" className="py-20 px-4 bg-black/20 backdrop-blur-3xs relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              Figurinhas em <span className="text-brand-yellow glow-text-yellow">Destaque</span>
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto font-sans">
              Veja algumas das relíquias mais raras e cobiçadas pelos maiores colecionadores da comunidade.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {featuredStickers.map((st) => (
              <CardSticker
                key={st.id}
                sticker={st}
                onClick={() => onNavigate("#login")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-transparent to-[#050510]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-center text-white mb-16">
            Como Funciona o <span className="text-brand-green glow-text-green">Trocacard</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                id={`step-card-${idx}`}
                className="glass-card rounded-3xl p-8 border border-white/5 text-center flex flex-col items-center space-y-4 hover:translate-y-[-5px] transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/10 mb-2">
                  {step.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#03030b] py-12 px-4 z-10 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎴</span>
            <div>
              <span className="font-display font-bold text-lg text-white">Trocacard</span>
              <p className="text-xs text-slate-500 font-mono">© 2026 Trocacard Colmeia Corp</p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-3 h-3 rounded-full bg-brand-yellow animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-brand-green animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span className="w-3 h-3 rounded-full bg-brand-blue animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400 font-mono text-xs">
            <a href="#termos" className="hover:text-amber-400 transition-colors">Termos</a>
            <a href="#privacidade" className="hover:text-emerald-400 transition-colors">Privacidade</a>
            <a href="#contato" className="hover:text-blue-400 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
