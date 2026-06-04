import React, { useState } from "react";
import { User, Lock, Mail, ArrowLeft, Heart, Coins } from "lucide-react";

interface RegisterViewProps {
  onNavigate: (route: string) => void;
  onRegister: (name: string, email: string, pass: string) => void;
}

export default function RegisterView({ onNavigate, onRegister }: RegisterViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Todos os campos devem ser preenchidos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    if (password.length < 4) {
      setError("A senha deve conter no mínimo 4 caracteres.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onRegister(name, email, password);
    }, 2500);
  };

  return (
    <div id="register-page" className="w-full min-h-screen py-24 flex flex-col justify-center items-center px-4 relative z-10 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="text-5xl cursor-pointer" onClick={() => onNavigate("#landing")}>🎴</span>
          <h2 className="text-3xl font-display font-extrabold text-white">
            Criar sua <span className="text-brand-green glow-text-green">Conta</span>
          </h2>
          <p className="text-slate-400 text-sm">
            E receba na hora um Kit de Boas-Vindas Colecionador!
          </p>
        </div>

        {/* Register Form Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          {/* Ambient Light */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/10 rounded-full filter blur-xl pointer-events-none" />

          {success ? (
            <div className="text-center py-8 space-y-6 animate-pulse">
              <div className="w-16 h-16 bg-brand-green/20 border border-brand-green/40 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-brand-green" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-brand-green">Cadastro Concluído!</h3>
                <p className="text-sm text-slate-300">
                  Preparando seu pacote de colecionador premium...
                </p>
              </div>
              <div className="flex justify-center items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 max-w-xs mx-auto text-left">
                <Coins className="w-10 h-10 text-brand-yellow flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">BÔNUS ADICIONADO</h4>
                  <p className="text-xs text-brand-yellow font-mono font-semibold">+ TC$ 500.00 Carteira</p>
                  <p className="text-xxs text-slate-500 font-mono">+ 5 Figurinhas iniciais raras</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xxs font-mono font-medium text-slate-300 uppercase tracking-widest pl-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu Nome completo"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                    id="register-name-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xxs font-mono font-medium text-slate-300 uppercase tracking-widest pl-1">
                  E-MAIL / ENDEREÇO
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                    id="register-email-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xxs font-mono font-medium text-slate-300 uppercase tracking-widest pl-1">
                  Definir Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                    id="register-password-input"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xxs font-mono font-medium text-slate-300 uppercase tracking-widest pl-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                    id="register-confirm-password-input"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1 pb-2">
                <input
                  type="checkbox"
                  required
                  id="register-terms-checkbox"
                  className="mt-1 accent-brand-green rounded cursor-pointer"
                />
                <label htmlFor="register-terms-checkbox" className="text-xxs text-slate-400 leading-snug cursor-pointer select-none">
                  Concordo com os Termos de Serviço do Trocacard e aceito o pacote inicial de 5 figurinhas gratuitas.
                </label>
              </div>

              <button
                type="submit"
                id="register-submit-btn"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-green to-emerald-600 text-slate-900 font-display font-bold text-sm tracking-wide uppercase hover:shadow-lg hover:shadow-brand-green/20 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Cadastrar e Receber Brindes
              </button>
            </form>
          )}

          {/* Quick login Link */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-slate-400">
            Já possui uma conta?{" "}
            <button
              onClick={() => onNavigate("#login")}
              className="text-brand-green font-bold underline hover:text-emerald-400 cursor-pointer"
            >
              Fazer Login
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => onNavigate("#landing")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5" />
            <span>Voltar para a página inicial</span>
          </button>
        </div>

      </div>
    </div>
  );
}
