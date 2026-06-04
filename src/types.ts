export type RarityType = "Comum" | "Rara" | "Épica" | "Lendária";

export interface Sticker {
  id: string;
  name: string;
  category: string;
  rarity: RarityType;
  emoji: string;
  gradient: string; // CSS gradient class (e.g., "from-yellow-400 to-amber-600")
  description: string;
  number: string; // e.g., "TC-005"
  releaseYear: number;
}

export interface Listing {
  id: string;
  stickerId: string;
  sellerId: string;
  sellerName: string;
  price: number;
  condition: "Excelente" | "Muito Bom" | "Marcas de Uso";
  status: "Ativo" | "Vendido" | "Cancelado";
  createdAt: string;
}

export interface OwnedSticker {
  id: string;
  stickerId: string;
  ownerId: string;
  condition: "Excelente" | "Muito Bom" | "Marcas de Uso";
  isListed: boolean;
  listingId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  role: "user" | "admin";
  avatar: string; // emoji or CSS pattern
  joinedDate: string;
}

export interface TradeProposal {
  id: string;
  proposerId: string;
  proposerName: string;
  receiverId: string;
  receiverName: string;
  offeredStickerId: string; // single card trade for simple structure, or multi
  requestedStickerId: string;
  status: "Pendente" | "Aceito" | "Recusado";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface SystemTransaction {
  id: string;
  type: "Compra" | "Venda" | "Troca" | "Depósito";
  details: string;
  amount: number;
  timestamp: string;
}
