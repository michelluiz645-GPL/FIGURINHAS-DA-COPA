import React, { useState } from "react";
import { UserProfile, OwnedSticker, TradeProposal, Sticker } from "../types";
import { STICKERS } from "../data";
import { RefreshCw, Repeat, ArrowRightLeft, Check, X, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";

interface TradingHubViewProps {
  currentUser: UserProfile;
  ownedStickers: OwnedSticker[];
  tradeProposals: TradeProposal[];
  onAcceptTrade: (proposalId: string) => void;
  onRejectTrade: (proposalId: string) => void;
  onCreateTradeProposal: (receiverId: string, offerStickerId: string, requestStickerId: string) => void;
}

export default function TradingHubView({
  currentUser,
  ownedStickers,
  tradeProposals,
  onAcceptTrade,
  onRejectTrade,
  onCreateTradeProposal,
}: TradingHubViewProps) {
  const [selectedOfferStickerId, setSelectedOfferStickerId] = useState("");
  const [selectedRequestStickerId, setSelectedRequestStickerId] = useState("");
  const [selectedReceiverId, setSelectedReceiverId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const unlistedOwnedCopies = ownedStickers.filter((s) => !s.isListed);

  // Group owned stickers to avoid duplicates in list
  const uniqueOwnedUnlisted = Array.from(new Set(unlistedOwnedCopies.map((s) => s.stickerId)))
    .map((id) => STICKERS.find((st) => st.id === id))
    .filter(Boolean) as Sticker[];

  // Targets: stickers currently not owned by user OR all stickers
  const potentialRequestStickers = STICKERS.filter(
    (s) => !ownedStickers.some((os) => os.stickerId === s.id)
  );

  const mockUsers = [
    { id: "usr_alice", name: "Alice Trader" },
    { id: "usr_bob", name: "Bob Cards" },
    { id: "usr_carol", name: "Carol (CopaHunter)" },
    { id: "usr_mariana", name: "Mariana (StickerHunter)" },
  ].filter((u) => u.id !== currentUser.id);

  const getStickerOfId = (stickerId: string) => {
    return STICKERS.find((s) => s.id === stickerId);
  };

  const handleCreateTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedOfferStickerId || !selectedRequestStickerId || !selectedReceiverId) {
      setError("Por favor preencha todas as seleções para propor a troca.");
      return;
    }

    if (selectedOfferStickerId === selectedRequestStickerId) {
      setError("Você não pode trocar uma figurinha por ela mesma.");
      return;
    }

    onCreateTradeProposal(selectedReceiverId, selectedOfferStickerId, selectedRequestStickerId);
    setSuccess("Sua proposta de troca foi enviada! Aguardando o outro colecionador analisar o card.");
    
    // Clear selections
    setSelectedOfferStickerId("");
    setSelectedRequestStickerId("");
    setSelectedReceiverId("");

    setTimeout(() => {
      setSuccess("");
    }, 4500);
  };

  return (
    <div id="trading-hub-view" className="space-y-8 animate-fade-in pb-16">
      
      {/* Intro Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full filter blur-xl pointer-events-none" />
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white leading-tight flex items-center justify-center md:justify-start gap-2">
            <ArrowRightLeft className="text-brand-green w-7 h-7" />
            <span>Central de Trocas</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Proponha escambos inteligentes de cards. Ofereça suas duplicadas em troca de itens procurados para preencher seu álbum mais rápido.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Propose a trade (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-5">
            <h3 className="font-display font-bold text-lg text-white pb-3 border-b border-white/5 flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-brand-green" />
              <span>Propor Nova Troca</span>
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xxs font-mono text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-brand-green/10 border border-brand-green/35 text-brand-green text-xxs font-mono text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleCreateTrade} className="space-y-4">
              
              {/* Select Receiver Trader */}
              <div className="space-y-1.5">
                <label className="block text-xxs font-mono text-slate-400 uppercase pl-0.5">
                  1. PARCEIRO DE NEGÓCIO
                </label>
                <select
                  value={selectedReceiverId}
                  onChange={(e) => setSelectedReceiverId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 rounded-xl border border-white/5 text-slate-200 text-xs focus:outline-none focus:border-brand-green"
                  id="trade-receiver-select"
                >
                  <option value="" className="bg-[#0b0b1c]">Selecione um Colecionador...</option>
                  {mockUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#0b0b1c]">
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Card to Offer */}
              <div className="space-y-1.5">
                <label className="block text-xxs font-mono text-slate-400 uppercase pl-0.5">
                  2. CARD QUE VOCÊ VAI OFERECER (O SEU CORPO)
                </label>
                <select
                  value={selectedOfferStickerId}
                  onChange={(e) => setSelectedOfferStickerId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 rounded-xl border border-white/5 text-slate-200 text-xs focus:outline-none focus:border-brand-green"
                  id="trade-offer-select"
                >
                  <option value="" className="bg-[#0b0b1c]">Selecione um card disponível...</option>
                  {uniqueOwnedUnlisted.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#0b0b1c]">
                      {st.emoji} {st.name} ({st.rarity} - Nº {st.number})
                    </option>
                  ))}
                </select>
                {unlistedOwnedCopies.length === 0 && (
                  <p className="text-[10px] text-amber-500 font-sans pl-0.5">
                    Você não possui figurinhas avulsas para oferecer. Adquira pacotes ou compre algumas no Mercado!
                  </p>
                )}
              </div>

              {/* Select Card to Request */}
              <div className="space-y-1.5">
                <label className="block text-xxs font-mono text-slate-400 uppercase pl-0.5">
                  3. CARD QUE VOCÊ QUER RECEBER (O DELES)
                </label>
                <select
                  value={selectedRequestStickerId}
                  onChange={(e) => setSelectedRequestStickerId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 rounded-xl border border-white/5 text-slate-200 text-xs focus:outline-none focus:border-brand-green"
                  id="trade-request-select"
                >
                  <option value="" className="bg-[#0b0b1c]">Selecione um card para obter...</option>
                  {STICKERS.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#0b0b1c]">
                      {st.emoji} {st.name} ({st.rarity} - Nº {st.number})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                id="btn-propose-trade-final"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-green to-emerald-600 text-slate-950 font-display font-bold text-xs uppercase tracking-wide hover:shadow-lg hover:shadow-brand-green/10 transition-all cursor-pointer flex justify-center items-center gap-1.5"
              >
                <span>Propor Troca Direta</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        </div>

        {/* Proposals List (Right Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 h-full flex flex-col">
            <h3 className="font-display font-bold text-lg text-white pb-3 border-b border-white/5 mb-5 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-brand-yellow animate-spin" style={{ animationDuration: "12s" }} />
              <span>Painel de Trocas Ativas</span>
            </h3>

            {tradeProposals.length === 0 ? (
              <div className="text-center py-12 space-y-4 my-auto">
                <p className="text-3xl">📭</p>
                <p className="text-sm text-slate-400 font-sans">Nenhuma troca pendente no momento.</p>
                <p className="text-xxs text-slate-500 font-sans max-w-xs mx-auto">
                  Utilize o formulário de proposta ou comece a interagir nos chats colecionadores para motivar trocas comunitárias!
                </p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                {tradeProposals.map((proposal) => {
                  const offerSticker = getStickerOfId(proposal.offeredStickerId);
                  const requestSticker = getStickerOfId(proposal.requestedStickerId);
                  
                  if (!offerSticker || !requestSticker) return null;

                  const isInbound = proposal.receiverId === currentUser.id;

                  return (
                    <div
                      key={proposal.id}
                      className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-3 relative overflow-hidden group"
                    >
                      {/* Active Status Ribbon indicator */}
                      <div className="flex justify-between items-center text-xxs font-mono">
                        <span className="text-slate-400">
                          {isInbound ? `De: ${proposal.proposerName}` : `Para: ${proposal.receiverName}`}
                        </span>
                        
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            proposal.status === "Pendente"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse"
                              : proposal.status === "Aceito"
                              ? "bg-brand-green/20 text-brand-green border border-brand-green/30"
                              : "bg-red-500/15 text-red-300 border border-red-500/20"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      {/* Swap Details layout */}
                      <div className="grid grid-cols-11 gap-2 items-center text-center">
                        
                        {/* Offered Card */}
                        <div className="col-span-5 bg-black/30 p-2.5 rounded-xl border border-white/5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${offerSticker.gradient} flex items-center justify-center text-lg mx-auto mb-1 shadow-sm`}>
                            {offerSticker.emoji}
                          </div>
                          <p className="text-[10px] font-bold text-white truncate">{offerSticker.name}</p>
                          <p className="text-[8px] text-slate-500 font-mono">Nº {offerSticker.number}</p>
                        </div>

                        {/* Middle Action Indicator */}
                        <div className="col-span-1 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold text-brand-green">👉</span>
                        </div>

                        {/* Requested Card */}
                        <div className="col-span-5 bg-black/30 p-2.5 rounded-xl border border-white/5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${requestSticker.gradient} flex items-center justify-center text-lg mx-auto mb-1 shadow-sm`}>
                            {requestSticker.emoji}
                          </div>
                          <p className="text-[10px] font-bold text-white truncate">{requestSticker.name}</p>
                          <p className="text-[8px] text-slate-500 font-mono">Nº {requestSticker.number}</p>
                        </div>

                      </div>

                      {/* Accept/Delete actions for INBOUND proposals */}
                      {proposal.status === "Pendente" && isInbound && (
                        <div className="flex gap-2.5 pt-2 border-t border-white/5">
                          <button
                            onClick={() => onRejectTrade(proposal.id)}
                            className="w-1/2 py-2 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-200 text-xxs font-bold transition-all cursor-pointer flex justify-center items-center gap-1"
                          >
                            <X className="w-3" />
                            Recusar
                          </button>
                          <button
                            onClick={() => onAcceptTrade(proposal.id)}
                            className="w-1/2 py-2 rounded-lg bg-brand-green/20 border border-brand-green/45 hover:bg-brand-green/30 text-brand-green text-xxs font-bold transition-all cursor-pointer flex justify-center items-center gap-1"
                          >
                            <Check className="w-3" />
                            Aceitar Troca
                          </button>
                        </div>
                      )}

                      {/* Cancel action for OUTBOUND proposals */}
                      {proposal.status === "Pendente" && !isInbound && (
                        <p className="text-[10px] text-slate-500 font-mono text-center pt-2 border-t border-white/5">
                          Aguardando parecer do colecionador parceiro...
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
