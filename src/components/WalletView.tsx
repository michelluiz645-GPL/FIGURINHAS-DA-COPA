import React, { useState } from "react";
import { UserProfile, SystemTransaction } from "../types";
import { CreditCard, Landmark, QrCode, ArrowDownRight, Wallet, History, FileText, CheckCircle2, RefreshCw } from "lucide-react";

interface WalletViewProps {
  currentUser: UserProfile;
  transactions: SystemTransaction[];
  onDeposit: (amount: number) => void;
}

export default function WalletView({ currentUser, transactions, onDeposit }: WalletViewProps) {
  const [depositAmount, setDepositAmount] = useState("200.00");
  const [pixAmount, setPixAmount] = useState("100.00");
  
  // Credit card inputs
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("12/30");
  const [cardCvv, setCardCvv] = useState("321");

  // Loading / processing indicators
  const [processingState, setProcessingState] = useState<"idle" | "loading" | "success">("idle");
  const [processingAmount, setProcessingAmount] = useState(0);

  const userTransactions = transactions.filter((t) => t.details.includes(currentUser.name) || t.type === "Depósito");

  const handleCreditCardDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(depositAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setProcessingAmount(amountVal);
    setProcessingState("loading");

    setTimeout(() => {
      onDeposit(amountVal);
      setProcessingState("success");
      
      setTimeout(() => {
        setProcessingState("idle");
        setDepositAmount("200.00");
      }, 1500);
    }, 2000);
  };

  const handlePixDeposit = () => {
    const amountVal = parseFloat(pixAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setProcessingAmount(amountVal);
    setProcessingState("loading");

    setTimeout(() => {
      onDeposit(amountVal);
      setProcessingState("success");

      setTimeout(() => {
        setProcessingState("idle");
      }, 1500);
    }, 1500);
  };

  return (
    <div id="wallet-view" className="space-y-8 animate-fade-in pb-16">
      
      {/* Wallet Interactive Balance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Visa Glass Bank Card (Left Column) */}
        <div className="md:col-span-5">
          <div
            className="rounded-3xl p-6 h-full flex flex-col justify-between border relative overflow-hidden text-white"
            style={{
              background: "linear-gradient(135deg, rgba(23, 23, 37, 0.95) 0%, rgba(10, 10, 26, 0.98) 100%)",
              borderColor: "rgba(255, 215, 0, 0.25)",
              boxShadow: "0 15px 35px -10px rgba(255, 215, 0, 0.1), inset 0 1px 2px rgba(255,255,255,0.05)",
            }}
          >
            {/* Gloss light blob overlays */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full filter blur-xl" />
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-brand-blue/15 rounded-full filter blur-2xl" />

            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                  CARTEIRA DIGITAL TROCACARD
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xl">🎴</span>
                  <span className="font-display font-medium text-sm text-slate-200">Trocacard Premium</span>
                </div>
              </div>
              <Wallet className="text-brand-yellow w-6 h-6" />
            </div>

            <div className="my-10 relative z-10">
              <p className="text-xs text-slate-400 font-mono">SALDO ATUAL DISPONÍVEL</p>
              <h3 className="text-4xl font-mono font-bold text-brand-yellow tracking-tight mt-1 glow-text-yellow">
                TC$ {currentUser.walletBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-[9px] text-slate-500 font-mono">COLECIONADOR TITULAR</p>
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">{currentUser.name}</p>
              </div>
              
              <div className="text-right">
                <p className="text-[9px] text-slate-500 font-mono">ADESÃO</p>
                <p className="text-[10px] font-mono text-slate-300">{currentUser.joinedDate}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Deposit methods Tabs (Right Column) */}
        <div className="md:col-span-7">
          <div className="glass-card rounded-3xl p-6 border border-white/5 h-full space-y-6 relative">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
              <Landmark className="text-brand-yellow w-4 h-4" />
              <span>Depositar Saldo Fictício</span>
            </h3>

            {processingState === "loading" ? (
              <div className="text-center py-16 space-y-4 flex flex-col items-center justify-center h-full">
                <RefreshCw className="w-10 h-10 text-brand-yellow animate-spin" />
                <p className="text-sm font-semibold text-white">Processando transferência bancária...</p>
                <p className="text-xxs font-mono text-slate-500">Aguardando validação da corretora virtual...</p>
              </div>
            ) : processingState === "success" ? (
              <div className="text-center py-16 space-y-4 flex flex-col items-center justify-center h-full">
                <CheckCircle2 className="w-12 h-12 text-brand-green animate-pulse" />
                <h4 className="text-xl font-bold text-brand-green">Depósito Concluído!</h4>
                <p className="text-xs text-slate-300 font-mono">
                  + TC$ {processingAmount.toFixed(2)} adicionados ao seu saldo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pix simulation */}
                <div className="p-4 rounded-2xl bg-black/35 border border-white/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xxs font-mono text-slate-500 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-brand-green" />
                      DEPÓSITO VIA PIX
                    </span>
                    <p className="text-xs text-slate-300 leading-snug">
                      Gere um código Pix simulado e confirme o pagamento em segundos.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase">Valor do Pix</label>
                      <input
                        type="number"
                        value={pixAmount}
                        onChange={(e) => setPixAmount(e.target.value)}
                        placeholder="Ex: 100.00"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e0e24] border border-white/10 text-slate-100 text-xs font-mono focus:outline-none"
                        id="pix-amount-input"
                      />
                    </div>

                    <button
                      onClick={handlePixDeposit}
                      id="btn-trigger-pix"
                      className="w-full py-2 px-3 rounded-lg bg-[#14231b] border border-brand-green/30 hover:border-brand-green text-brand-green hover:bg-brand-green/15 transition-all text-[11px] font-bold font-mono tracking-wider cursor-pointer"
                    >
                      PAGAR VIA PIX
                    </button>
                  </div>
                </div>

                {/* Credit card Simulation */}
                <form onSubmit={handleCreditCardDeposit} className="p-4 rounded-2xl bg-black/35 border border-white/5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-xxs font-mono text-slate-500 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-brand-yellow" />
                      SIMULAR CARTÃO DE CRÉDITO
                    </span>
                    
                    <div className="space-y-2 pt-1.5">
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-slate-500 font-mono uppercase">Valor Depositado (TC$)</label>
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="Ex: 50.00"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0e0e24] border border-white/10 text-slate-100 text-xs font-mono focus:outline-none"
                          required
                          id="cc-amount-input"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <label className="text-[9px] text-slate-500 font-mono uppercase">Nome Impresso</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Ex: TITULAR DO CARD"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0e0e24] border border-white/10 text-slate-100 text-[10px] tracking-wider uppercase focus:outline-none"
                          required
                          id="cc-name-input"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-cc-submit"
                    className="w-full py-2 rounded-lg bg-[#241a0e] border border-brand-yellow/30 hover:border-brand-yellow text-brand-yellow hover:bg-brand-yellow/15 transition-all text-[11px] font-bold font-mono tracking-wider cursor-pointer"
                  >
                    CONFIRMAR CRÉDITO
                  </button>
                </form>

              </div>
            )}
          </div>
        </div>

      </div>

      {/* Transactions History list */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-bold text-white pl-1 flex items-center gap-2">
          <History className="text-brand-blue" />
          <span>Extrato de Transações Recentes</span>
        </h3>

        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          {userTransactions.length === 0 ? (
            <div className="text-center py-10 font-sans text-slate-500 text-xs text-slate-400">
              Nenhuma transação financeira registrada em sua conta.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-sans text-slate-300 border-collapse">
              <thead>
                <tr className="bg-white/3 border-b border-white/5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-mono">TIPO</th>
                  <th className="p-4 font-mono">DETALHES DA OPERAÇÃO</th>
                  <th className="p-4 font-mono">VALOR</th>
                  <th className="p-4 font-mono text-right">DATA / HORA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userTransactions.map((t) => {
                  const isPositive = t.type === "Venda" || t.type === "Depósito" || (t.type === "Troca" && t.amount > 0);
                  return (
                    <tr key={t.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            t.type === "Depósito"
                              ? "bg-brand-blue/15 text-brand-blue border border-brand-blue/20"
                              : t.type === "Compra"
                              ? "bg-red-500/15 text-red-300 border border-red-500/10"
                              : "bg-brand-green/20 text-brand-green border border-brand-green/20"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {t.details}
                      </td>
                      <td className={`p-4 font-mono font-bold ${isPositive ? "text-brand-green" : "text-red-400"}`}>
                        {isPositive ? "+" : "-"} TC$ {Math.abs(t.amount).toFixed(2)}
                      </td>
                      <td className="p-4 text-right text-slate-500 font-mono text-[10px]">
                        {new Date(t.timestamp).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
