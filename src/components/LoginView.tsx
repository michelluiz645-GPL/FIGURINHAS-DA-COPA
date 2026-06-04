import React, { useState } from "react";
import { GUEST_USERS } from "../data";
import { User, Lock, ArrowRight, Shield, ShieldAlert, BadgeCheck } from "lucide-react";

interface LoginViewProps {
  onNavigate: (route: string) => void;
  onLogin: (email: string, pass: string) => boolean;
  onLoginId: (userId: string) => void;
}

export default function LoginView({ onNavigate, onLogin, onLoginId }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor preencha todos os campos.");
      return;
    }

    const success = onLogin(email, password);
    if (!success) {
      setError("Credenciais inválidas. Use o Acesso Rápido abaixo!");
    }
  };

  return (
    <div id="login-page" className="w-full min-h-screen py-24 flex flex-col justify-center items-center px-4 relative z-10">
      <div className="w-full max-w-md space-y-8">
        
        {/* Page Logo Branding Header */}
        <div className="text-center space-y-2">
          <span className="text-5xl cursor-pointer" onClick={() => onNavigate("#landing")}>🎴</span>
          <h2 className="text-3xl font-display font-extrabold text-white">
            Acessar <span className="text-brand-yellow glow-text-yellow">Trocacard</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Entre na sua conta para negociar suas figurinhas
          </p>
        </div>

        {/* Login Form Glass Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          {/* Ambient light glow in card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full filter blur-xl pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs text-center flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-widest pl-1">
                E-MAIL
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                  id="login-email-input"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-widest">
                  SENHA
                </label>
                <a href="#forgot" className="text-xxs font-mono text-brand-yellow hover:underline">
                  Esqueceu?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                  id="login-password-input"
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="w-full py-4.5 rounded-xl bg-gradient-to-r from-brand-yellow to-amber-500 text-slate-900 font-display font-bold text-sm tracking-wide uppercase hover:shadow-lg hover:shadow-brand-yellow/15 hover:scale-[1.01] transition-all cursor-pointer flex justify-center items-center gap-2"
            >
              <span>Entrar</span>
              <ArrowRight className="w-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
            Não tem uma conta?{" "}
            <button
              onClick={() => onNavigate("#register")}
              className="text-brand-yellow font-bold underline hover:text-amber-300 cursor-pointer"
            >
              Cadastre-se aqui
            </button>
          </div>
        </div>

        {/* QUICK ACCESS CARD (below login card) */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 relative bg-white/3 overflow-hidden text-center shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-brand-green to-brand-blue" />
          
          <h3 className="text-sm font-display font-extrabold text-white uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
            <span>✨ Acesso Rápido (Contas de Teste)</span>
          </h3>
          <p className="text-xxs text-slate-400 mb-4 px-2 leading-relaxed">
            Clique em qualquer usuário simulado para fazer login instantâneo e testar a compra e venda de figurinhas no mercado!
          </p>

          <div className="grid grid-cols-1 gap-3">
            {GUEST_USERS.map((g) => (
              <button
                key={g.id}
                onClick={() => onLoginId(g.id)}
                id={`btn-guest-${g.id}`}
                className="w-full p-3.5 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/7 hover:border-white/20 hover:scale-[1.02] transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl bg-slate-800/80 w-10 h-10 rounded-xl flex items-center justify-center border border-white/10">
                    {g.avatar}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-brand-yellow transition-colors">
                      {g.name}
                    </h4>
                    <p className="text-xxs font-mono text-slate-500">{g.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  {g.role === "admin" ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                      <Shield className="w-2.5" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30 flex items-center gap-1">
                      <BadgeCheck className="w-2.5" />
                      Colecionador
                    </span>
                  )}
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500">Saldo</p>
                    <p className="text-xs font-bold text-brand-yellow">TC$ {g.walletBalance.toFixed(0)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
