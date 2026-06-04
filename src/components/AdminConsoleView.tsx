import React, { useState } from "react";
import { UserProfile, SystemTransaction, Listing, OwnedSticker, Sticker } from "../types";
import { STICKERS } from "../data";
import { Shield, Users, Coins, Trash2, Gift, ClipboardList, Eye, CheckCircle2, ChevronRight, Filter } from "lucide-react";

interface AdminConsoleViewProps {
  currentUser: UserProfile;
  listings: Listing[];
  transactions: SystemTransaction[];
  ownedStickers: OwnedSticker[];
  onRewardUser: (targetEmail: string, amount: number) => void;
  onGiftSticker: (targetEmail: string, stickerId: string) => void;
  onCancelListingAdmin: (listingId: string) => void;
}

export default function AdminConsoleView({
  currentUser,
  listings,
  transactions,
  ownedStickers,
  onRewardUser,
  onGiftSticker,
  onCancelListingAdmin,
}: AdminConsoleViewProps) {
  const [targetEmail, setTargetEmail] = useState("");
  const [giftStickerId, setGiftStickerId] = useState("");
  const [rewardAmount, setRewardAmount] = useState("150.00");
  const [alertMessage, setAlertMessage] = useState("");

  const activeListings = listings.filter((l) => l.status === "Ativo");

  const totalTokensCirculating = ownedStickers.length;
  const systemCirculatingBalance = listings.reduce((acc, current) => acc + (current.status === "Ativo" ? current.price : 0), 0) + 12000.00; // estimated mock scale

  const handleRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail || !rewardAmount) return;

    const rewardVal = parseFloat(rewardAmount);
    if (isNaN(rewardVal) || rewardVal <= 0) return;

    onRewardUser(targetEmail, rewardVal);
    setAlertMessage(`Saldo de TC$ ${rewardVal.toFixed(2)} enviado com sucesso para ${targetEmail}!`);
    setRewardAmount("150.00");
    
    setTimeout(() => {
      setAlertMessage("");
    }, 4000);
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail || !giftStickerId) return;

    onGiftSticker(targetEmail, giftStickerId);
    const stickerName = STICKERS.find((s) => s.id === giftStickerId)?.name || "Figurinha";
    setAlertMessage(`Figurinha [${stickerName}] depositada diretamente no álbum de: ${targetEmail}!`);
    setGiftStickerId("");

    setTimeout(() => {
      setAlertMessage("");
    }, 4000);
  };

  const handleCancelListing = (listingId: string) => {
    onCancelListingAdmin(listingId);
    setAlertMessage("Anúncio moderado e removido do catálogo de vendas.");

    setTimeout(() => {
      setAlertMessage("");
    }, 4000);
  };

  return (
    <div id="admin-console-view" className="space-y-8 animate-fade-in pb-16">
      
      {/* Admin Title Info */}
      <div className="glass-card rounded-3xl p-6 border border-red-500/25 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full filter blur-xl pointer-events-none" />
        <div className="space-y-1.5 text-center md:text-left z-10">
          <h2 className="text-2xl font-display font-extrabold text-white flex items-center justify-center md:justify-start gap-2.5">
            <Shield className="text-red-500 w-7 h-7" />
            <span>Terminal do Administrador</span>
          </h2>
          <p className="text-slate-400 text-xs">
            Acesso root total ao mercado virtual de figurines, audit de logs financeiros e moderação de anúncios spam.
          </p>
        </div>
        <div className="bg-red-500/10 px-4 py-2 border border-red-500/20 text-red-400 rounded-xl text-xxs font-mono tracking-widest uppercase z-10">
          LOGADO COMO ADM SOBERANO
        </div>
      </div>

      {alertMessage && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-brand-green/30 text-brand-green text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-brand-green" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
          <p className="text-[10px] text-slate-500 font-mono">ANÚNCIOS ATIVOS NO CATÁLOGO</p>
          <div className="flex items-center gap-2">
            <ClipboardList className="text-brand-yellow w-5 h-5" />
            <span className="text-2xl font-mono font-bold text-white">{activeListings.length} anúncios</span>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
          <p className="text-[10px] text-slate-500 font-mono">TOTAL DE CORES CIRCULANTES</p>
          <div className="flex items-center gap-2">
            <Users className="text-brand-green w-5 h-5" />
            <span className="text-2xl font-mono font-bold text-white">{totalTokensCirculating} figurinhas</span>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
          <p className="text-[10px] text-slate-500 font-mono">CAPITALIZADO EM CIRCULAÇÃO</p>
          <div className="flex items-center gap-2">
            <Coins className="text-brand-blue w-5 h-5" />
            <span className="text-2xl font-mono font-bold text-brand-blue font-semibold">
              TC$ {systemCirculatingBalance.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Core management utilities */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Gift or reward collectors (Left Column 5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="text-sm font-display font-bold text-white pb-3 border-b border-white/5 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="text-brand-green w-4 h-4" />
              <span>Ações do Corretor / Brindes</span>
            </h3>

            {/* Direct Coin Rewards Form */}
            <form onSubmit={handleRewardSubmit} className="space-y-4">
              <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1 pl-0.5">
                💎 Bonificar Saldo / Dar Coins
              </h4>
              <div className="space-y-2">
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="E-mail do colecionador alvo"
                  className="w-full px-3 py-2 bg-black/40 border border-white/5 text-slate-200 text-xs rounded-xl focus:outline-none"
                  required
                />
                
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="50"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    placeholder="Quantidade TC$"
                    className="w-2/3 px-3 py-2 bg-black/40 border border-white/5 text-slate-200 text-xs rounded-xl focus:outline-none font-mono"
                    required
                  />
                  <button
                    type="submit"
                    className="w-1/3 py-2 bg-brand-green hover:bg-emerald-600 font-display font-medium text-slate-900 text-xs rounded-xl cursor-pointer"
                  >
                    Creditar
                  </button>
                </div>
              </div>
            </form>

            {/* Direct Sticker Injection Form */}
            <form onSubmit={handleGiftSubmit} className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1 pl-0.5">
                🎁 Injetar Figurinha Direto
              </h4>
              <div className="space-y-2">
                <select
                  value={giftStickerId}
                  onChange={(e) => setGiftStickerId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/5 text-slate-300 text-xs rounded-xl focus:outline-none select-none"
                  required
                >
                  <option value="" className="bg-[#0b0b1c]">Selecione uma figurinha para dar...</option>
                  {STICKERS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0b0b1c]">
                      {s.emoji} {s.name} ({s.rarity} - Nº {s.number})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-blue hover:bg-blue-600 font-display font-medium text-white text-xs rounded-xl cursor-pointer"
                >
                  Confirmar Envio Brinde
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* Action Board (Right Column 7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-5 flex flex-col justify-between h-full">
            <h3 className="text-sm font-display font-bold text-white pb-3 border-b border-white/5 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="text-red-500 w-4 h-4" />
              <span>Moderar Anúncios Ativos</span>
            </h3>

            {activeListings.length === 0 ? (
              <div className="text-center py-10 font-sans text-slate-500 text-xs">
                Nenhum anúncio ativo no mercado para moderar.
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2">
                {activeListings.map((listing) => {
                  const stickerObj = STICKERS.find((s) => s.id === listing.stickerId);
                  if (!stickerObj) return null;

                  return (
                    <div
                      key={listing.id}
                      className="p-3 bg-white/2 border border-white/5 rounded-xl flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stickerObj.emoji}</span>
                        <div>
                          <p className="font-bold text-slate-200">
                            {stickerObj.name}{" "}
                            <span className="text-[10px] text-slate-500 font-mono">
                              (Nº {stickerObj.number})
                            </span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Vendedor: {listing.sellerName} • Preço:{" "}
                            <span className="text-brand-yellow font-mono">
                              TC$ {listing.price.toFixed(0)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCancelListing(listing.id)}
                        id={`btn-moderate-${listing.id}`}
                        className="p-2 ml-2 rounded-lg bg-red-500/15 border border-red-500/20 hover:bg-red-500/30 text-red-300 transition-all cursor-pointer flex-shrink-0"
                        title="Banir/Remover anúncio"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Global System Transaction Logs */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-bold text-white pl-1 flex items-center gap-2">
          <ChevronRight className="text-red-500 font-bold" />
          <span>Log Global de Auditoria de Transações</span>
        </h3>

        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-xxs font-mono text-slate-400 border-collapse">
            <thead>
              <tr className="bg-red-950/15 border-b border-red-950/40 text-slate-500 pl-4 py-2 uppercase">
                <th className="p-3">ID TRANS</th>
                <th className="p-3">EVENTO</th>
                <th className="p-3">LOG DE DETALHES</th>
                <th className="p-3">MONETÁRIO</th>
                <th className="p-3 text-right">HORA UTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[...transactions].reverse().map((t) => (
                <tr key={t.id} className="hover:bg-red-950/5 transition-colors">
                  <td className="p-3 font-semibold">{t.id}</td>
                  <td className="p-3">
                    <span className="text-white font-bold">{t.type}</span>
                  </td>
                  <td className="p-3 text-slate-300">{t.details}</td>
                  <td className="p-3 text-brand-yellow">TC$ {t.amount.toFixed(2)}</td>
                  <td className="p-3 text-right text-slate-500">
                    {new Date(t.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
