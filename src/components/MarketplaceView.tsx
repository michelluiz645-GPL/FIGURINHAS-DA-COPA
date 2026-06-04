import React, { useState } from "react";
import { Sticker, Listing, UserProfile } from "../types";
import { STICKERS, CATEGORIES } from "../data";
import CardSticker from "./CardSticker";
import { Search, SlidersHorizontal, ArrowUpDown, X, ShoppingCart, Info, AlertCircle, Sparkles } from "lucide-react";

interface MarketplaceViewProps {
  currentUser: UserProfile;
  listings: Listing[];
  onBuyListing: (listingId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export default function MarketplaceView({
  currentUser,
  listings,
  onBuyListing,
  onNavigateTab,
}: MarketplaceViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedRarity, setSelectedRarity] = useState("Todas");
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "price-asc" | "price-desc"
  
  // Modal State for focused purchase
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Active listings
  const activeListings = listings.filter((l) => l.status === "Ativo");

  // Filter listings based on search, category and rarity
  const filteredListings = activeListings.filter((l) => {
    const sticker = STICKERS.find((s) => s.id === l.stickerId);
    if (!sticker) return false;

    const matchesSearch = sticker.name.toLowerCase().includes(search.toLowerCase()) || 
                          sticker.number.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || sticker.category === selectedCategory;
    const matchesRarity = selectedRarity === "Todas" || sticker.rarity === selectedRarity;
    
    return matchesSearch && matchesCategory && matchesRarity;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    // Default recent
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getStickerOfListing = (stickerId: string) => {
    return STICKERS.find((s) => s.id === stickerId);
  };

  const handleOpenBuyModal = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleConfirmPurchase = () => {
    if (!selectedListing) return;
    
    // Call main app buy listing
    onBuyListing(selectedListing.id);
    
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      setSelectedListing(null);
    }, 1200);
  };

  const categories = CATEGORIES;
  const rarities = ["Todas", "Comum", "Rara", "Épica", "Lendária"];

  return (
    <div id="marketplace-view" className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Promo Box */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-brand-yellow/10 to-brand-blue/10 rounded-full filter blur-2xl pointer-events-none" />
        <div className="space-y-2 text-center md:text-left z-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
            Mercado Ativo de <span className="text-brand-yellow glow-text-yellow">Figurinhas</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Compre cards direto de outros negociadores. Filtre por categorias ou acabe de obter a figurinha lendária faltante.
          </p>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-center font-mono z-10 w-full md:w-auto">
          <p className="text-xxs text-slate-500">SEU SALDO ATUAL</p>
          <p className="text-2xl font-bold text-brand-yellow glow-text-yellow-sm">
            TC$ {currentUser.walletBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <button
            onClick={() => onNavigateTab("wallet")}
            className="text-[10px] text-brand-yellow font-bold underline mt-1 block w-full hover:text-white"
          >
            Depositar na Carteira
          </button>
        </div>
      </div>

      {/* Filter Toolbar controls */}
      <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search text */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pelo nome ou número da figurinha..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 text-slate-200 text-sm focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow/30"
              id="mkt-search-input"
            />
          </div>

          {/* Rarity Select */}
          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="text-slate-400 w-4 h-4 flex-shrink-0" />
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full py-2.5 px-3 bg-black/40 rounded-xl border border-white/5 text-slate-200 text-sm font-sans focus:outline-none focus:border-brand-yellow"
              id="mkt-rarity-select"
            >
              {rarities.map((r) => (
                <option key={r} value={r} className="bg-[#0c0c1b]">
                  Raridade: {r}
                </option>
              ))}
            </select>
          </div>

          {/* Sort pricing */}
          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="text-slate-400 w-4 h-4 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-black/40 rounded-xl border border-white/5 text-slate-200 text-sm focus:outline-none focus:border-brand-yellow"
              id="mkt-sort-select"
            >
              <option value="recent" className="bg-[#0c0c1b]">Mais Recentes</option>
              <option value="price-asc" className="bg-[#0c0c1b]">Preço: Menor ao Maior</option>
              <option value="price-desc" className="bg-[#0c0c1b]">Preço: Maior ao Menor</option>
            </select>
          </div>

        </div>

        {/* Category horizontal scrolling labels */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-yellow text-slate-950 font-bold shadow-md shadow-brand-yellow/15 scale-[1.03]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Core Listings Grid */}
      {sortedListings.length === 0 ? (
        <div id="mkt-empty-state" className="glass-card rounded-3xl p-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto text-3xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-200">Nenhum anúncio encontrado</h3>
          <p className="text-slate-400 text-xs leading-relaxed font-sans">
            Não encontramos figurinhas correspondentes à busca atual. Tente alterar os filtros de categoria ou raridade!
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("Todos");
              setSelectedRarity("Todas");
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedListings.map((listing) => {
            const sticker = getStickerOfListing(listing.stickerId);
            if (!sticker) return null;
            return (
              <CardSticker
                key={listing.id}
                sticker={sticker}
                price={listing.price}
                condition={listing.condition}
                sellerName={listing.sellerId === currentUser.id ? "Você" : listing.sellerName}
                onClick={() => handleOpenBuyModal(listing)}
                badgeText={listing.sellerId === currentUser.id ? "SEU ANÚNCIO" : undefined}
              />
            );
          })}
        </div>
      )}

      {/* PURCHASE STICKER MODAL OVERLAY */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 overflow-hidden relative shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
              <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-1.5">
                <ShoppingCart className="w-5 text-brand-yellow" />
                <span>Confirmar Compra</span>
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5" />
              </button>
            </div>

            {successAnimation ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-brand-green/20 border border-brand-green/50 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                  ✨
                </div>
                <h4 className="text-xl font-bold text-brand-green">Compra Executada!</h4>
                <p className="text-xs text-slate-400 font-mono">
                  A figurinha foi enviada diretamente para o seu álbum.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Visual Card Row inside modal */}
                <div className="flex gap-4 p-3 bg-slate-900/60 rounded-2xl border border-white/5 items-center">
                  <div
                    className={`w-20 h-20 rounded-xl bg-gradient-to-tr ${
                      getStickerOfListing(selectedListing.stickerId)?.gradient
                    } flex items-center justify-center text-4xl shadow-inner`}
                  >
                    <span>{getStickerOfListing(selectedListing.stickerId)?.emoji}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                      {getStickerOfListing(selectedListing.stickerId)?.rarity}
                    </span>
                    <h4 className="text-lg font-bold text-white font-display mt-1">
                      {getStickerOfListing(selectedListing.stickerId)?.name}
                    </h4>
                    <p className="text-xxs font-mono text-slate-400">
                      Nº {getStickerOfListing(selectedListing.stickerId)?.number} • Ano{" "}
                      {getStickerOfListing(selectedListing.stickerId)?.releaseYear}
                    </p>
                  </div>
                </div>

                {/* Seller & Condition Detail Grid */}
                <div className="grid grid-cols-2 gap-3 bg-white/3 p-4 rounded-xl text-xs font-sans">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">VENDEDOR</span>
                    <span className="font-semibold text-slate-200">{selectedListing.sellerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">ESTADO</span>
                    <span className="font-semibold text-amber-400">{selectedListing.condition}</span>
                  </div>
                </div>

                {/* Check Balance Block */}
                <div className="bg-slate-950/60 p-4 rounded-xl space-y-2 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Preço do Card:</span>
                    <span className="font-mono text-white">TC$ {selectedListing.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-white/5">
                    <span className="text-slate-400">Seu Saldo:</span>
                    <span className="font-mono text-slate-300">TC$ {currentUser.walletBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-xs font-bold text-white">Saldo Restante:</span>
                    <span
                      className={`font-mono text-sm font-bold ${
                        currentUser.walletBalance - selectedListing.price >= 0
                          ? "text-brand-green"
                          : "text-red-400"
                      }`}
                    >
                      TC$ {(currentUser.walletBalance - selectedListing.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Conditional warning or action buttons */}
                {currentUser.walletBalance < selectedListing.price ? (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex gap-2.5 items-start">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-red-200 font-bold">Saldo Insuficiente</p>
                      <p className="text-xxs text-slate-400 mt-0.5 leading-relaxed">
                        Você precisa de mais TC$ { (selectedListing.price - currentUser.walletBalance).toFixed(2) } para completar esta transação.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedListing(null);
                          onNavigateTab("wallet");
                        }}
                        className="text-xxs text-brand-yellow underline font-bold mt-1 inline-block block hover:text-white"
                      >
                        Carregar carteira agora
                      </button>
                    </div>
                  </div>
                ) : selectedListing.sellerId === currentUser.id ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 text-center">
                    Você não pode comprar seu próprio card listado para venda!
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="w-1/3 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmPurchase}
                      id="btn-confirm-purchase-final"
                      className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-brand-yellow to-amber-500 hover:shadow-lg hover:shadow-brand-yellow/10 text-slate-950 font-display font-bold text-xs uppercase tracking-wide transition-all cursor-pointer flex justify-center items-center gap-1"
                    >
                      <Sparkles className="w-4 h-4 text-slate-900" />
                      <span>Confirmar Compra</span>
                    </button>
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
