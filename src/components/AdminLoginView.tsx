import React, { useState } from "react";
import { GUEST_USERS } from "../data";
import { ShieldCheck, Lock, Mail, ArrowLeft, Terminal } from "lucide-react";

interface AdminLoginViewProps {
  onNavigate: (route: string) => void;
  onLogin: (email: string, pass: string) => boolean;
  onLoginId: (userId: string) => void;
}

export default function AdminLoginView({ onNavigate, onLogin, onLoginId }: AdminLoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "admin@trocacard.com" && password === "admin123") {
      // Find default admin or log in
      onLoginId("usr_vinicius");
      return;
    }

    const success = onLogin(email, password);
    if (!success) {
      setError("Credenciais administrativas de segurança inválidas.");
    }
  };

  const handleQuickAdmin = () => {
    onLoginId("usr_vinicius");
  };

  return (
    <div id="admin-login-page" className="w-full min-h-screen py-24 flex flex-col justify-center items-center px-4 relative z-10">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Admin Header */}
        <div className="text-center space-y-2">
          <Terminal className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-display font-extrabold text-white uppercase tracking-wider">
            Painel <span className="text-red-500">Administrativo</span>
          </h2>
          <p className="text-slate-400 font-mono text-[11px]">
            SISTEMA DE SEGURANÇA E REGISTRO TROCACARD
          </p>
        </div>

        {/* Security Glass Box Form */}
        <div className="glass-card rounded-3xl p-6 border border-red-500/25 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-600/15 border border-red-500/30 text-red-300 text-xxs font-mono text-center">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest pl-1">
                E-mail Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@trocacard.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-red-500"
                  id="admin-email-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest pl-1">
                Chave de Segurança / Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha Administrativa"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-red-500"
                  id="admin-password-input"
                />
              </div>
            </div>

            <button
              type="submit"
              id="admin-submit-btn"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-all cursor-pointer"
            >
              Autenticar Terminal
            </button>
          </form>

          {/* Quick Bypass Button */}
          <div className="mt-5 pt-4 border-t border-slate-900 text-center">
            <button
              onClick={handleQuickAdmin}
              id="btn-quick-admin"
              className="text-red-400 hover:text-red-300 font-mono text-[10px] bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-900/30 w-full cursor-pointer hover:border-red-500 transition-all"
            >
              🔓 Bypass Rápido: Logar como Admin (Vinícius)
            </button>
          </div>
        </div>

        {/* Return Button */}
        <div className="text-center">
          <button
            onClick={() => onNavigate("#landing")}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3" />
            <span>Voltar para o Início</span>
          </button>
        </div>

      </div>
    </div>
  );
}
