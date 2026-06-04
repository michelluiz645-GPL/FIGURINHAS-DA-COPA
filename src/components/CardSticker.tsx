import React from "react";
import { Sticker, RarityType } from "../types";
import { ShieldCheck, Calendar, Hash, Milestone } from "lucide-react";

interface CardStickerProps {
  key?: React.Key | string;
  sticker: Sticker;
  showDetails?: boolean;
  onClick?: () => void;
  price?: number;
  condition?: string;
  sellerName?: string;
  badgeText?: string;
}

const getRarityStyles = (rarity: RarityType) => {
  switch (rarity) {
    case "Lendária":
      return {
        border: "border-amber-400/50 shadow-amber-500/20",
        text: "text-amber-400 font-bold",
        badge: "bg-amber-500/20 text-amber-300 border-amber-400/30",
        bgGlow: "rgba(245, 158, 11, 0.15)",
      };
    case "Épica":
      return {
        border: "border-purple-400/50 shadow-purple-500/20",
        text: "text-purple-400 font-bold",
        badge: "bg-purple-500/20 text-purple-300 border-purple-400/30",
        bgGlow: "rgba(168, 85, 247, 0.15)",
      };
    case "Rara":
      return {
        border: "border-blue-400/50 shadow-blue-500/20",
        text: "text-blue-400 font-bold",
        badge: "bg-blue-500/20 text-blue-300 border-blue-400/30",
        bgGlow: "rgba(59, 130, 246, 0.15)",
      };
    case "Comum":
    default:
      return {
        border: "border-slate-500/30 shadow-slate-500/5",
        text: "text-slate-400",
        badge: "bg-slate-500/10 text-slate-300 border-slate-500/20",
        bgGlow: "rgba(148, 163, 184, 0.05)",
      };
  }
};

export default function CardSticker({
  sticker,
  showDetails = false,
  onClick,
  price,
  condition,
  sellerName,
  badgeText,
}: CardStickerProps) {
  const styles = getRarityStyles(sticker.rarity);

  return (
    <div
      onClick={onClick}
      id={`sticker-card-${sticker.id}`}
      className={`relative rounded-3xl overflow-hidden glass-card transition-all duration-300 ${
        onClick ? "cursor-pointer hover:-translate-y-2 hover:scale-[1.03]" : ""
      } ${styles.border} shadow-xl max-w-sm w-full mx-auto p-4 flex flex-col justify-between h-[390px] shine-card`}
      style={{
        boxShadow: `0 10px 30px -10px ${styles.bgGlow}, inset 0 1px 1px rgba(255,255,255,0.1)`,
      }}
    >
      {/* Glow ambient circle in background */}
      <div
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full filter blur-2xl opacity-40 pointer-events-none"
        style={{ background: styles.bgGlow }}
      />
      {/* Hover animated shine effect */}
      <div className="shine-overlay pointer-events-none" />

      {/* Top Header / Rarity Badge & Sticker Number */}
      <div className="flex justify-between items-center z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-display tracking-wide uppercase border backdrop-blur-sm ${styles.badge}`}
        >
          {sticker.rarity}
        </span>
        <div className="flex items-center gap-1 text-slate-400 font-mono text-xs bg-black/30 px-2.5 py-1 rounded-md border border-slate-700/50">
          <Hash className="w-3" />
          <span>{sticker.number}</span>
        </div>
      </div>

      {/* Giant Sticker Display Core */}
      <div className="relative py-4 flex flex-col items-center justify-center flex-1 my-3">
        {/* Holographic background sticker canvas */}
        <div
          className={`w-32 h-32 rounded-2xl bg-gradient-to-tr ${sticker.gradient} flex items-center justify-center text-6xl shadow-inner relative group`}
        >
          {/* Outer graphic border pattern */}
          <div className="absolute inset-1.5 border border-white/25 rounded-xl border-dashed" />
          {/* Sticker Emoji */}
          <span className="transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md floating-sticker-delayed-1">
            {sticker.emoji}
          </span>
          
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-white/20 via-transparent to-black/10 rounded-2xl pointer-events-none" />
        </div>
      </div>

      {/* Sticker Title & Footer Details */}
      <div className="space-y-2.5 z-10">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-xl font-display font-bold text-white tracking-tight leading-tight">
              {sticker.name}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 font-mono hover:text-white transition-colors">
              <Milestone className="w-3 text-slate-500" />
              {sticker.category}
            </p>
          </div>
          {badgeText && (
            <span className="bg-brand-green/20 text-brand-green px-2 py-0.5 rounded text-xxs font-mono border border-brand-green/30 animate-pulse">
              {badgeText}
            </span>
          )}
        </div>

        {/* Display Condition/Price or Description */}
        {price !== undefined ? (
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <div>
              {sellerName && (
                <p className="text-xxs text-slate-400">
                  Vendedor: <span className="text-slate-200 font-medium">{sellerName}</span>
                </p>
              )}
              {condition && (
                <p className="text-xxs text-slate-400 mt-0.5">
                  Estado: <span className="text-amber-400 font-semibold">{condition}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs text-brand-yellow font-mono block">Valor</span>
              <span className="text-lg font-mono font-bold text-brand-yellow glow-text-yellow">
                TC$ {price.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-300 line-clamp-2 h-8 leading-snug">
            {sticker.description}
          </p>
        )}
      </div>
    </div>
  );
}
