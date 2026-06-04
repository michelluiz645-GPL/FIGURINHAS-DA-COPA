import React, { useState } from "react";
import { UserProfile, OwnedSticker, Sticker, Listing } from "../types";
import { STICKERS } from "../data";
import { Tag, Plus, Check, Info, FileText, X, Sparkles, BookOpen, Layers } from "lucide-react";

interface MyAlbumViewProps {
  currentUser: UserProfile;
  ownedStickers: OwnedSticker[];
  listings: Listing[];
  onSellSticker: (stickerId: string, price: number, condition: "Excelente" | "Muito Bom" | "Marcas de Uso") => void;
}

export default function MyAlbumView({
  currentUser,
  ownedStickers,
  listings,
  onSellSticker,
}: MyAlbumViewProps) {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  
  // Sell Form States
  const [sellPrice, setSellPrice] = useState("");
  const [sellCondition, setSellCondition] = useState<"Excelente" | "Muito Bom" | "Marcas de Uso">("Excelente");
  const [sellError, setSellError] = useState("");
  const [sellSuccess, setSellSuccess] = useState(false);

  // Calculate stats
  const distinctOwnedStickers = Array.from(new Set(ownedStickers.map((o) => o.stickerId)));
  const totalStickersInSystem = STICKERS.length;
  const albumProgressPercent = Math.round((distinctOwnedStickers.length / totalStickersInSystem) * 100);
  const totalOwnedCopies = ownedStickers.length;

  // Helpers to check ownership and quantity
  const getOwnedCopies = (stickerId: string) => {
    return ownedStickers.filter((o) => o.stickerId === stickerId);
  };

  const getUnlistedCopies = (stickerId: string) => {
    return ownedStickers.filter((o) => o.stickerId === stickerId && !o.isListed);
  };

  const getStickerStatus = (stickerId: string) => {
    const unlistedCopies = getUnlistedCopies(stickerId);
    const listedCopies = ownedStickers.filter((o) => o.stickerId === stickerId && o.isListed);
    return {
      owned: ownedStickers.some((o) => o.stickerId === stickerId),
      unlistedQty: unlistedCopies.length,
      listedQty: listedCopies.length,
      totalQty: unlistedCopies.length + listedCopies.length,
    };
  };

  const handleOpenCardDetails = (sticker: Sticker) => {
    const status = getStickerStatus(sticker.id);
    if (!status.owned) return; // Can't view full details of unowned sticker
    setSelectedSticker(sticker);
    setSellPrice("");
    setSellCondition("Excelente");
    setSellError("");
    setSellSuccess(false);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setSellError("");

    if (!selectedSticker) return;

    const priceNum = parseFloat(sellPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setSellError("Por favor informe um valor de venda válido maior que zero.");
      return;
    }

    onSellSticker(selectedSticker.id, priceNum, sellCondition);
    setSellSuccess(true);
    
    setTimeout(() => {
      setSellSuccess(false);
      setSelectedSticker(null);
    }, 1500);
  };

  return (
    <div id="my-album-view" className="space-y-8 animate-fade-in pb-16">
      
      {/* Portfolio Progress Header Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-brand-green to-brand-blue" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          <div className="md:col-span-4 space-y-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
              <BookOpen className="w-7 text-brand-green" />
              <span>Seu Álbum</span>
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Colecione, gerencie e anuncie seus cards duplicados. Complete todos os slots para se tornar um Mestre Colecionador!
            </p>
          </div>

          {/* Progress graph */}
          <div className="md:col-span-4 bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Slots Preenchidos</span>
              <span className="font-mono text-brand-green font-bold text-sm">
                {distinctOwnedStickers.length} / {totalStickersInSystem} ({albumProgressPercent}%)
              </span>
            </div>
            
            {/* Visual Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-brand-green to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${albumProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Duplicates Counter */}
          <div className="md:col-span-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/3 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 block uppercase font-mono tracking-wider">Total Figurinhas</span>
              <span className="text-xl font-mono font-bold text-white leading-none mt-1 block">
                {totalOwnedCopies} un.
              </span>
            </div>
            <div className="bg-white/3 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] text-slate-500 block uppercase font-mono tracking-wider">Disponíveis</span>
              <span className="text-xl font-mono font-bold text-brand-yellow leading-none mt-1 block">
                {ownedStickers.filter(s => !s.isListed).length} un.
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Album Sticker Grid (showing empty pockets and owned) */}
      <div>
        <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2 pl-1">
          <Layers className="w-5 text-brand-yellow" />
          <span>Coleção de Figurinhas</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {STICKERS.map((st) => {
            const status = getStickerStatus(st.id);
            const isLegendary = st.rarity === "Lendária";
            
            return (
              <div
                key={st.id}
                onClick={() => handleOpenCardDetails(st)}
                id={`album-slot-${st.id}`}
                className={`group rounded-2xl p-3 border transition-all relative overflow-hidden flex flex-col justify-between aspect-square select-none cursor-pointer duration-300 ${
                  status.owned
                    ? "bg-slate-900/60 border-slate-700/60 hover:border-brand-yellow hover:shadow-lg hover:shadow-brand-yellow/5 hover:-translate-y-1"
                    : "bg-slate-950/40 border-slate-900/80 opacity-40 hover:opacity-50"
                }`}
              >
                {/* Number indicator */}
                <span className="text-[9px] font-mono text-slate-500 absolute top-2 left-2">
                  {st.number}
                </span>

                {/* Duplicates Badge Count */}
                {status.totalQty > 1 && (
                  <span className="absolute top-2 right-2 bg-brand-yellow text-slate-950 font-mono text-[9px] font-bold h-4.5 px-1.5 rounded-full flex items-center justify-center border border-slate-900">
                    x{status.totalQty}
                  </span>
                )}

                {/* Core illustration */}
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                  {status.owned ? (
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${st.gradient} flex items-center justify-center text-3xl shadow-md`}
                    >
                      <span className="group-hover:scale-110 transition-transform">{st.emoji}</span>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-800/20 border border-slate-800 border-dashed flex items-center justify-center text-xl text-slate-600 font-mono">
                      ?
                    </div>
                  )}
                </div>

                {/* Name Label */}
                <div className="text-center mt-2">
                  <p
                    className={`text-xs font-semibold truncate ${
                      status.owned ? "text-slate-100" : "text-slate-600"
                    }`}
                  >
                    {st.name}
                  </p>
                  <p
                    className={`text-[8px] font-mono tracking-widest uppercase ${
                      isLegendary && status.owned ? "text-brand-yellow" : "text-slate-500"
                    }`}
                  >
                    {st.rarity}
                  </p>
                </div>

                {/* Owned Checked indicator overlay */}
                {status.owned && (
                  <div className="absolute right-2 bottom-2 bg-brand-green/20 p-0.5 rounded-full border border-brand-green/30">
                    <Check className="w-2.5 h-2.5 text-brand-green" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CARD DETAIL / SALE CREATOR MODAL OVERLAY */}
      {selectedSticker && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 overflow-hidden relative shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
              <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-brand-green" />
                <span>Gerenciar Figurinha</span>
              </h3>
              <button
                onClick={() => setSelectedSticker(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5" />
              </button>
            </div>

            {sellSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-brand-green/25 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                  ✨
                </div>
                <h4 className="text-lg font-bold text-brand-green">Anunciado no Mercado!</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Seu card está ativo e disponível para compra na loja do Trocacard.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Small preview card row */}
                <div className="flex gap-4 p-3 bg-slate-900/60 rounded-2xl border border-white/5 items-center">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-tr ${selectedSticker.gradient} flex items-center justify-center text-3xl shadow-inner`}
                  >
                    <span>{selectedSticker.emoji}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                      {selectedSticker.rarity}
                    </span>
                    <h4 className="text-base font-bold text-white font-display mt-0.5">
                      {selectedSticker.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400">
                      Nº {selectedSticker.number} • Ano {selectedSticker.releaseYear}
                    </p>
                  </div>
                </div>

                {/* Sub Description */}
                <div className="text-xs text-slate-400 font-sans leading-relaxed">
                  <p className="font-medium text-slate-300">Sobre o item:</p>
                  <p>{selectedSticker.description}</p>
                </div>

                {/* Card Ownership Summary */}
                <div className="grid grid-cols-2 gap-3 bg-white/3 p-3 rounded-xl text-xxs font-mono text-center">
                  <div>
                    <span className="text-slate-500 block">TOTAL DE CÓPIAS</span>
                    <span className="font-bold text-white text-xs mt-0.5 block">
                      {getStickerStatus(selectedSticker.id).totalQty} un.
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">JÁ ANUNCIADAS</span>
                    <span className="font-bold text-brand-yellow text-xs mt-0.5 block">
                      {getStickerStatus(selectedSticker.id).listedQty} un.
                    </span>
                  </div>
                </div>

                {/* Sell Form Block (Only show if there are unlisted copies to sell) */}
                {getStickerStatus(selectedSticker.id).unlistedQty > 0 ? (
                  <form onSubmit={handleCreateListing} className="space-y-4 pt-3 border-t border-white/5">
                    <h4 className="text-xs font-display font-extrabold text-white uppercase tracking-wider pl-0.5 flex items-center gap-1">
                      <span>💰 Criar Anúncio de Venda</span>
                    </h4>

                    {sellError && (
                      <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xxs font-mono text-center">
                        {sellError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {/* Price field */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase">
                          Preço Pretendido (TC$)
                        </label>
                        <input
                          type="number"
                          step="0.50"
                          min="1"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                          placeholder="Ex: 85.00"
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-slate-100 text-xs font-mono focus:outline-none focus:border-brand-green"
                          required
                          id="price-sell-input"
                        />
                      </div>

                      {/* Condition selection */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase">
                          Estado de Conservação
                        </label>
                        <select
                          value={sellCondition}
                          onChange={(e) => setSellCondition(e.target.value as any)}
                          className="w-full px-3 py-2 bg-black/40 rounded-lg border border-white/5 text-slate-100 text-xs focus:outline-none focus:border-brand-green"
                          id="condition-sell-select"
                        >
                          <option value="Excelente" className="bg-[#0b0b1c]">Excelente</option>
                          <option value="Muito Bom" className="bg-[#0b0b1c]">Muito Bom</option>
                          <option value="Marcas de Uso" className="bg-[#0b0b1c]">Marcas de Uso</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="btn-confirm-sell-listing"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-green to-emerald-600 hover:shadow-lg hover:shadow-brand-green/10 text-slate-900 font-display font-bold text-xs uppercase tracking-wide cursor-pointer transition-all flex justify-center items-center gap-1"
                    >
                      <Plus className="w-4 h-4 text-slate-900 font-bold" />
                      <span>Anunciar agora no mercado</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-center">
                    <p className="text-xxs text-amber-200 leading-snug">
                      Você já anunciou todas as suas {getStickerStatus(selectedSticker.id).totalQty} cópias deste card para venda! Aguarde outros colecionadores comprarem seu anúncio.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
