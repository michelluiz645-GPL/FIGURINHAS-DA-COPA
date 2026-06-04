import React, { useState, useEffect } from "react";
import { UserProfile, OwnedSticker, Listing, TradeProposal, ChatMessage, SystemTransaction, Sticker } from "./types";
import { STICKERS, INITIAL_LISTINGS, GUEST_USERS } from "./data";

// Sub views
import LandingView from "./components/LandingView";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";
import AdminLoginView from "./components/AdminLoginView";
import MarketplaceView from "./components/MarketplaceView";
import MyAlbumView from "./components/MyAlbumView";
import TradingHubView from "./components/TradingHubView";
import ChatSimulatorView from "./components/ChatSimulatorView";
import WalletView from "./components/WalletView";
import AdminConsoleView from "./components/AdminConsoleView";

// Icons for dashboard navbar
import { ShoppingBag, BookOpen, ArrowRightLeft, MessageSquare, Wallet, ShieldCheck, LogOut, Menu, X, Bell } from "lucide-react";

export default function App() {
  // --- STATE DECLARATIONS ---
  const [route, setRoute] = useState(window.location.hash || "#landing");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>("market"); // "market" | "album" | "trades" | "chat" | "wallet" | "admin"

  // Platform database collections (backed by localStorage)
  const [listings, setListings] = useState<Listing[]>([]);
  const [ownedStickers, setOwnedStickers] = useState<OwnedSticker[]>([]);
  const [tradeProposals, setTradeProposals] = useState<TradeProposal[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [systemTransactions, setSystemTransactions] = useState<SystemTransaction[]>([]);

  // Mobile Menu state for navbar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- ROUTING HANDLER (HASHCHANGE) ---
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash || "#landing";
      setRoute(currentHash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (hash: string) => {
    window.location.hash = hash;
    setMobileMenuOpen(false);
  };

  // --- DATA INITIALIZATION (LOCAL STORAGE) ---
  useEffect(() => {
    // 1. Listings
    const savedListings = localStorage.getItem("trocacard_listings");
    if (savedListings) {
      setListings(JSON.parse(savedListings));
    } else {
      localStorage.setItem("trocacard_listings", JSON.stringify(INITIAL_LISTINGS));
      setListings(INITIAL_LISTINGS);
    }

    // 2. User Session
    const savedSession = localStorage.getItem("trocacard_session");
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }

    // 3. Owned Stickers
    const savedOwned = localStorage.getItem("trocacard_owned_stickers");
    if (savedOwned) {
      setOwnedStickers(JSON.parse(savedOwned));
    } else {
      // Default placeholder initial owned cards (mixture of some base cards)
      const starterOwned: OwnedSticker[] = [
        { id: "own_1", stickerId: "stk_3", ownerId: "usr_alice", condition: "Excelente", isListed: true, listingId: "lst_2" },
        { id: "own_2", stickerId: "stk_1", ownerId: "usr_alice", condition: "Excelente", isListed: true, listingId: "lst_1" },
        { id: "own_3", stickerId: "stk_4", ownerId: "usr_carol", condition: "Muito Bom", isListed: true, listingId: "lst_3" },
        { id: "own_4", stickerId: "stk_6", ownerId: "usr_david", condition: "Excelente", isListed: true, listingId: "lst_4" },
        { id: "own_5", stickerId: "stk_8", ownerId: "usr_carol", condition: "Marcas de Uso", isListed: true, listingId: "lst_5" },
        { id: "own_6", stickerId: "stk_11", ownerId: "usr_bob", condition: "Excelente", isListed: true, listingId: "lst_6" },
      ];
      localStorage.setItem("trocacard_owned_stickers", JSON.stringify(starterOwned));
      setOwnedStickers(starterOwned);
    }

    // 4. Trade proposals (with active simulated defaults)
    const savedTrades = localStorage.getItem("trocacard_trades");
    if (savedTrades) {
      setTradeProposals(JSON.parse(savedTrades));
    } else {
      const defaultTrades: TradeProposal[] = [
        {
          id: "prop_1",
          proposerId: "usr_alice",
          proposerName: "Alice Trader",
          receiverId: "", // Will map dynamic target or logged in user
          receiverName: "Você",
          offeredStickerId: "stk_2", // Messi Mágico
          requestedStickerId: "stk_1", // Ney Gold
          status: "Pendente",
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem("trocacard_trades", JSON.stringify(defaultTrades));
      setTradeProposals(defaultTrades);
    }

    // 5. Chat Logs pre-populates
    const savedChats = localStorage.getItem("trocacard_chats");
    if (savedChats) {
      setChatMessages(JSON.parse(savedChats));
    } else {
      const defaultChats: ChatMessage[] = [
        { id: "msg_1", senderId: "usr_alice", senderName: "Alice Trader", receiverId: "guest", text: "Olá! Vi que você tem interesse em figurinhas de futebol. Tem algum Messi Mágico ou Neymar Jr Gold repetido pra negociar?", timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: "msg_2", senderId: "usr_bob", senderName: "Bob Cards", receiverId: "guest", text: "E aí colecionador! Ofereço descontos especiais se levar mais de 2 cards meus no mercado.", timestamp: new Date(Date.now() - 1800000).toISOString() }
      ];
      localStorage.setItem("trocacard_chats", JSON.stringify(defaultChats));
      setChatMessages(defaultChats);
    }

    // 6. System Logs for administrator
    const savedTrans = localStorage.getItem("trocacard_transactions");
    if (savedTrans) {
      setSystemTransactions(JSON.parse(savedTrans));
    } else {
      const defaultTrans: SystemTransaction[] = [
        { id: "TX-1001", type: "Depósito", details: "Adesão de sistema Alice Trader", amount: 150.00, timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: "TX-1002", type: "Depósito", details: "Adesão de sistema Bob Cards", amount: 200.00, timestamp: new Date(Date.now() - 43200000).toISOString() }
      ];
      localStorage.setItem("trocacard_transactions", JSON.stringify(defaultTrans));
      setSystemTransactions(defaultTrans);
    }
  }, []);

  // Sync state modifications directly to Local Storage
  const updateListingsState = (newList: Listing[]) => {
    setListings(newList);
    localStorage.setItem("trocacard_listings", JSON.stringify(newList));
  };

  const updateOwnedStickersState = (newList: OwnedSticker[]) => {
    setOwnedStickers(newList);
    localStorage.setItem("trocacard_owned_stickers", JSON.stringify(newList));
  };

  const updateTradesState = (newList: TradeProposal[]) => {
    setTradeProposals(newList);
    localStorage.setItem("trocacard_trades", JSON.stringify(newList));
  };

  const updateChatsState = (newList: ChatMessage[]) => {
    setChatMessages(newList);
    localStorage.setItem("trocacard_chats", JSON.stringify(newList));
  };

  const updateTransactionsState = (newList: SystemTransaction[]) => {
    setSystemTransactions(newList);
    localStorage.setItem("trocacard_transactions", JSON.stringify(newList));
  };

  const updateSessionUserAndStore = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("trocacard_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("trocacard_session");
    }
  };

  // --- TRIGGER SYSTEM ALERTS ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- ACTIONS: AUTHENTICATION SERVICES ---
  
  const handleLogin = (emailInput: string, passInput: string): boolean => {
    // Basic verification: Check if mock email fits guest accounts or registered custom user
    const matchedGuest = GUEST_USERS.find((g) => g.email.toLowerCase() === emailInput.toLowerCase());
    
    if (matchedGuest) {
      executeLoginService(matchedGuest.id, matchedGuest.name, matchedGuest.email, matchedGuest.walletBalance, matchedGuest.role, matchedGuest.avatar, matchedGuest.joinedDate);
      return true;
    }
    
    // Check local custom users or handle fallback
    return false;
  };

  const handleLoginGuestId = (guestId: string) => {
    const guest = GUEST_USERS.find((g) => g.id === guestId);
    if (!guest) return;

    executeLoginService(guest.id, guest.name, guest.email, guest.walletBalance, guest.role, guest.avatar, guest.joinedDate);
    
    // Also, load guest specific card inventory if it doesn't already exist for this custom session!
    const savedOwned = localStorage.getItem("trocacard_owned_stickers") || "[]";
    const currentOwnedList: OwnedSticker[] = JSON.parse(savedOwned);
    
    const alreadyLoadCards = currentOwnedList.some((c) => c.ownerId === guest.id);
    if (!alreadyLoadCards) {
      const generatedCards: OwnedSticker[] = guest.initialCards.flatMap((ic, index) => {
        const copies: OwnedSticker[] = [];
        for (let i = 0; i < ic.qty; i++) {
          copies.push({
            id: `own_${guest.id}_${ic.stickerId}_${i}_${index}`,
            stickerId: ic.stickerId,
            ownerId: guest.id,
            condition: ic.condition,
            isListed: false
          });
        }
        return copies;
      });
      const mergedList = [...currentOwnedList, ...generatedCards];
      updateOwnedStickersState(mergedList);
    }
  };

  const executeLoginService = (id: string, name: string, email: string, balance: number, role: "user" | "admin", avatar: string, joined: string) => {
    const userSession: UserProfile = {
      id,
      name,
      email,
      walletBalance: balance,
      role,
      avatar,
      joinedDate: joined || new Date().toISOString().split("T")[0],
    };
    
    updateSessionUserAndStore(userSession);
    triggerToast(`Bem vindo de volta, ${name}!`);
    
    // Redirect securely to dashboard
    navigate("#dashboard");
    setActiveTab(role === "admin" ? "admin" : "market");
  };

  const handleRegister = (nameReg: string, emailReg: string, passReg: string) => {
    const id = `usr_custom_${Date.now()}`;
    const userSession: UserProfile = {
      id,
      name: nameReg,
      email: emailReg,
      walletBalance: 500.00, // Starter credit
      role: "user",
      avatar: "🎒",
      joinedDate: new Date().toISOString().split("T")[0]
    };

    updateSessionUserAndStore(userSession);

    // Initial free stickers pack injection
    const currentOwnedList = [...ownedStickers];
    const newFreebies: OwnedSticker[] = [
      { id: `own_reg_1_${Date.now()}`, stickerId: "stk_3", ownerId: id, condition: "Excelente", isListed: false }, // Pikachu Spark
      { id: `own_reg_2_${Date.now()}`, stickerId: "stk_8", ownerId: id, condition: "Excelente", isListed: false }, // Cassete Retro
      { id: `own_reg_3_${Date.now()}`, stickerId: "stk_10", ownerId: id, condition: "Muito Bom", isListed: false }, // Sonic Hype
      { id: `own_reg_4_${Date.now()}`, stickerId: "stk_12", ownerId: id, condition: "Marcas de Uso", isListed: false }, // Pepe Frog
      { id: `own_reg_5_${Date.now()}`, stickerId: "stk_7", ownerId: id, condition: "Excelente", isListed: false } // Doge Astronaut
    ];
    updateOwnedStickersState([...currentOwnedList, ...newFreebies]);

    // Register bonus transaction
    const trans = [...systemTransactions];
    const newTx: SystemTransaction = {
      id: `TX-REG-${Date.now().toString().slice(-4)}`,
      type: "Depósito",
      details: `Pacote Boas-Vindas Colecionador: ${nameReg}`,
      amount: 500.00,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...trans, newTx]);

    triggerToast(`Conta ${nameReg} criada! +5 Figurinhas e TC$ 500 creditados!`);
    navigate("#dashboard");
    setActiveTab("market");
  };

  const handleLogout = () => {
    if (currentUser) {
      triggerToast(`Sessão encerrada com sucesso.`);
    }
    updateSessionUserAndStore(null);
    navigate("#landing");
  };


  // --- ACTIONS: COLLECTIBLE INTERACTIONS ---

  // BUY card listed in open marketplace board
  const handleBuyMarketListing = (listingId: string) => {
    if (!currentUser) return;

    const targetListing = listings.find((l) => l.id === listingId);
    if (!targetListing || targetListing.status !== "Ativo") return;

    if (currentUser.walletBalance < targetListing.price) {
      triggerToast("Erro: Saldo virtual insuficiente.");
      return;
    }

    // 1. Decrease buyer wallet sum
    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance - targetListing.price
    };
    updateSessionUserAndStore(updatedUser);

    // 2. Mark listing as VENDIDO
    const updatedListings = listings.map((l) =>
      l.id === listingId ? { ...l, status: "Vendido" as const } : l
    );
    updateListingsState(updatedListings);

    // 3. Update database of card ownerships
    // Transfer card from seller portfolio to current user portfolio
    const updatedOwned = ownedStickers.map((own) => {
      if (own.listingId === listingId) {
        return {
          ...own,
          ownerId: currentUser.id,
          isListed: false,
          listingId: undefined
        };
      }
      return own;
    });
    updateOwnedStickersState(updatedOwned);

    // 4. Log transactions audit
    const stickerName = STICKERS.find((s) => s.id === targetListing.stickerId)?.name || "Figurinha";
    const transId = `TX-BUY-${Date.now().toString().slice(-4)}`;
    const newTx: SystemTransaction = {
      id: transId,
      type: "Compra",
      details: `${currentUser.name} comprou [${stickerName}] de ${targetListing.sellerName}`,
      amount: targetListing.price,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...systemTransactions, newTx]);

    triggerToast(`Você adquiriu ${stickerName} com sucesso por TC$ ${targetListing.price.toFixed(2)}!`);
  };

  // SELL customizable card owned in inventory
  const handleSellCollectible = (stickerId: string, price: number, condition: "Excelente" | "Muito Bom" | "Marcas de Uso") => {
    if (!currentUser) return;

    // Find custom available unlisted copies of this sticker in owned folder
    const availableCopyIndex = ownedStickers.findIndex(
      (o) => o.stickerId === stickerId && o.ownerId === currentUser.id && !o.isListed
    );
    if (availableCopyIndex === -1) {
      triggerToast("Erro: Não há cópias livres para venda.");
      return;
    }

    const listingId = `lst_custom_${Date.now()}`;
    const newListing: Listing = {
      id: listingId,
      stickerId,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      price,
      condition,
      status: "Ativo",
      createdAt: new Date().toISOString()
    };

    // Save active listing
    updateListingsState([newListing, ...listings]);

    // Flag isListed: true in user owned state item
    const targetOwnedItem = ownedStickers[availableCopyIndex];
    const updatedOwned = ownedStickers.map((item) =>
      item.id === targetOwnedItem.id ? { ...item, isListed: true, listingId } : item
    );
    updateOwnedStickersState(updatedOwned);

    // Append system audits
    const stickerName = STICKERS.find((s) => s.id === stickerId)?.name || "Figurinha";
    const transId = `TX-LST-${Date.now().toString().slice(-4)}`;
    const newTx: SystemTransaction = {
      id: transId,
      type: "Venda",
      details: `${currentUser.name} anunciou [${stickerName}] por TC$ ${price.toFixed(2)}`,
      amount: price,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...systemTransactions, newTx]);

    triggerToast(`Você listou ${stickerName} para venda por TC$ ${price.toFixed(2)}!`);
  };


  // --- ACTIONS: SWAP / TRADING HUB SERVICES ---

  // Initiate direct trade proposal
  const handleProposeTrade = (receiverId: string, offeredStickerId: string, requestedStickerId: string) => {
    if (!currentUser) return;

    // 1. Verify availability of unlisted copy of custom offered card
    const availableIdx = ownedStickers.findIndex(
      (o) => o.stickerId === offeredStickerId && o.ownerId === currentUser.id && !o.isListed
    );
    if (availableIdx === -1) {
      triggerToast("Erro: Você não possui este card disponível para oferta.");
      return;
    }

    const recUser = GUEST_USERS.find((g) => g.id === receiverId) || { name: "Colecionador" };

    const proposalId = `prop_custom_${Date.now()}`;
    const newProposal: TradeProposal = {
      id: proposalId,
      proposerId: currentUser.id,
      proposerName: currentUser.name,
      receiverId,
      receiverName: recUser.name,
      offeredStickerId,
      requestedStickerId,
      status: "Pendente",
      createdAt: new Date().toISOString()
    };

    const updatedProposals = [newProposal, ...tradeProposals];
    updateTradesState(updatedProposals);

    // Lock offered card during negotiations so it cannot be listed or sold elsewhere
    const targetItem = ownedStickers[availableIdx];
    const updatedOwned = ownedStickers.map((item) =>
      item.id === targetItem.id ? { ...item, isListed: true, listingId: `locked_trade_${proposalId}` } : item
    );
    updateOwnedStickersState(updatedOwned);

    triggerToast("Proposta de troca enviada! Aguarde a resposta do colecionador.");

    // SIMULATED AUTOMATED RESPONSE SYSTEM:
    // Simulated collector will analyze proposal after 6-8 seconds
    setTimeout(() => {
      // Refresh current states inside callbacks to avoid closing on stale closures
      const latestTradesStr = localStorage.getItem("trocacard_trades") || "[]";
      const latestTradesList: TradeProposal[] = JSON.parse(latestTradesStr);
      
      const foundPropIndex = latestTradesList.findIndex((p) => p.id === proposalId && p.status === "Pendente");
      if (foundPropIndex === -1) return; // already answered or cancelled

      const offerCard = STICKERS.find((s) => s.id === offeredStickerId);
      const requestCard = STICKERS.find((s) => s.id === requestedStickerId);

      if (!offerCard || !requestCard) return;

      // Determine bot response formula
      // Bots are happy if they receive Legendary (Lendária) or Epic cards, or if current offers are matching category interests
      let approved = false;

      // Alice loves Copa do Mundo:
      if (receiverId === "usr_alice" && offerCard.category === "Copa do Mundo") approved = true;
      // Carol loves Lendas do Futebol
      else if (receiverId === "usr_carol" && offerCard.category === "Lendas do Futebol") approved = true;
      // Generic formula: Is offered card of equal or greater rarity level?
      else {
        const raritiesValues = { "Comum": 1, "Rara": 2, "Épica": 3, "Lendária": 4 };
        if (raritiesValues[offerCard.rarity] >= raritiesValues[requestCard.rarity]) {
          approved = true;
        }
      }

      if (approved) {
        // execute approval swap!
        executeTradeProposalSuccess(proposalId, latestTradesList);
      } else {
        // deny trade proposal and unlocking offered card copies
        const rejectedTrades = latestTradesList.map((p) =>
          p.id === proposalId ? { ...p, status: "Recusado" as const } : p
        );
        updateTradesState(rejectedTrades);

        // Unlock user cards
        const latestOwnedStr = localStorage.getItem("trocacard_owned_stickers") || "[]";
        const latestOwned: OwnedSticker[] = JSON.parse(latestOwnedStr);
        const unlockedOwned = latestOwned.map((item) =>
          item.listingId === `locked_trade_${proposalId}`
            ? { ...item, isListed: false, listingId: undefined }
            : item
        );
        updateOwnedStickersState(unlockedOwned);

        triggerToast(`${recUser.name} recusou sua proposta de troca comercial.`);
      }

    }, 7000);
  };

  // ACCEPT dynamic swap proposal
  const handleAcceptTradeProposal = (proposalId: string) => {
    // Call trade success helper directly
    executeTradeProposalSuccess(proposalId, tradeProposals);
  };

  // REJECT dynamic swap proposal
  const handleRejectTradeProposal = (proposalId: string) => {
    const updatedTrades = tradeProposals.map((p) =>
      p.id === proposalId ? { ...p, status: "Recusado" as const } : p
    );
    updateTradesState(updatedTrades);
    triggerToast("Você recusou a proposta de troca.");
  };

  // Executer of trade swaps transferences
  const executeTradeProposalSuccess = (proposalId: string, currentProposals: TradeProposal[]) => {
    const prop = currentProposals.find((p) => p.id === proposalId);
    if (!prop) return;

    // 1. Mark proposal as ACEITO
    const updatedProposals = currentProposals.map((p) =>
      p.id === proposalId ? { ...p, status: "Aceito" as const } : p
    );
    updateTradesState(updatedProposals);

    // Refreshes owned stickers to process swaps safely
    const latestOwnedStr = localStorage.getItem("trocacard_owned_stickers") || "[]";
    const currentOwnedList: OwnedSticker[] = JSON.parse(latestOwnedStr);

    // Identify target cards
    // 1. The proposer offered a card to give
    // Find unlisted or locked offered card owned by PROPOSER (could be current user, or guest)
    const proposerOfferIdx = currentOwnedList.findIndex(
      (o) => o.stickerId === prop.offeredStickerId && o.ownerId === prop.proposerId
    );

    // 2. Proposer requested a receiver card
    // Find receiver card owned by RECEIVER
    const receiverRequestIdx = currentOwnedList.findIndex(
      (o) => o.stickerId === prop.requestedStickerId && o.ownerId === prop.receiverId
    );

    // If both users are simulated or valid
    let runningOwnedList = [...currentOwnedList];

    if (proposerOfferIdx !== -1) {
      // Proposer card goes to Receiver
      runningOwnedList[proposerOfferIdx] = {
        ...runningOwnedList[proposerOfferIdx],
        ownerId: prop.receiverId,
        isListed: false,
        listingId: undefined
      };
    }

    if (receiverRequestIdx !== -1) {
      // Receiver card goes to Proposer
      runningOwnedList[receiverRequestIdx] = {
        ...runningOwnedList[receiverRequestIdx],
        ownerId: prop.proposerId,
        isListed: false,
        listingId: undefined
      };
    } else {
      // Fallback injection if receiver is bot/was simulated: Give proposer the card!
      runningOwnedList.push({
        id: `own_trade_inject_${Date.now()}`,
        stickerId: prop.requestedStickerId,
        ownerId: prop.proposerId,
        condition: "Excelente",
        isListed: false
      });
    }

    updateOwnedStickersState(runningOwnedList);

    // Append system transaction audit trails
    const offerName = STICKERS.find((s) => s.id === prop.offeredStickerId)?.name || "Card A";
    const requestName = STICKERS.find((s) => s.id === prop.requestedStickerId)?.name || "Card B";
    
    const transId = `TX-SWAP-${Date.now().toString().slice(-4)}`;
    const newTx: SystemTransaction = {
      id: transId,
      type: "Troca",
      details: `Troca efetuada: [${offerName}] por [${requestName}] entre ${prop.proposerName} e ${prop.receiverName}`,
      amount: 0,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...systemTransactions, newTx]);

    triggerToast(`Troca concluída com sucesso! Cards transferidos.`);
  };


  // --- ACTIONS: BANK DEPOSIT GATEWAY ---
  const handleBankDeposit = (amount: number) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance + amount
    };
    updateSessionUserAndStore(updatedUser);

    // Log transaction history
    const transId = `TX-DEP-${Date.now().toString().slice(-4)}`;
    const newTx: SystemTransaction = {
      id: transId,
      type: "Depósito",
      details: `${currentUser.name} depositou fundos via carteira premium`,
      amount,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...systemTransactions, newTx]);
    triggerToast(`Depósito de TC$ ${amount.toFixed(2)} creditado na conta!`);
  };


  // --- ACTIONS: CHAT SIMULATOR PRIVATE MESSAGES ---
  
  const handleSendChatMessage = (receiverId: string, text: string) => {
    if (!currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg_cust_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text,
      timestamp: new Date().toISOString()
    };

    updateChatsState([...chatMessages, newMsg]);
  };

  const handleReceiveSimulatedChatMessage = (senderId: string, text: string, delayMs: number) => {
    setTimeout(() => {
      // Update references dynamically to avoid losing messages during concurrent edits
      const currentLocals = localStorage.getItem("trocacard_chats") || "[]";
      const parsedFeed: ChatMessage[] = JSON.parse(currentLocals);

      const senderName = COLLECTORS.find((c) => c.id === senderId)?.name || "Colecionador";

      const simulatedMsg: ChatMessage = {
        id: `msg_sim_${Date.now()}`,
        senderId,
        senderName,
        receiverId: currentUser?.id || "guest",
        text,
        timestamp: new Date().toISOString()
      };

      // Trigger standard system notification sound indicator using subtle toaster
      setChatMessages([...parsedFeed, simulatedMsg]);
      localStorage.setItem("trocacard_chats", JSON.stringify([...parsedFeed, simulatedMsg]));
      
      triggerToast(`Nova mensagem recebida de: ${senderName}`);
    }, delayMs);
  };


  // --- ACTIONS: ADMIN CONSOLE EXCLUSIVES ---

  const handleAdminRewardUser = (emailTarget: string, amount: number) => {
    // If target email target is custom user, reward them directly
    if (currentUser?.email.toLowerCase() === emailTarget.toLowerCase()) {
      const updatedUser = {
        ...currentUser,
        walletBalance: currentUser.walletBalance + amount
      };
      updateSessionUserAndStore(updatedUser);
    }
    
    // Log System Tx
    const newTx: SystemTransaction = {
      id: `TX-ADM-${Date.now().toString().slice(-4)}`,
      type: "Depósito",
      details: `Crédito administrativo injetado em: ${emailTarget}`,
      amount,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...systemTransactions, newTx]);
  };

  const handleAdminGiftSticker = (emailTarget: string, stickerId: string) => {
    let ownerId = "usr_felipe"; // default target guest
    if (currentUser?.email.toLowerCase() === emailTarget.toLowerCase()) {
      ownerId = currentUser.id;
    }

    const newGiftCard: OwnedSticker = {
      id: `own_adm_gift_${Date.now()}`,
      stickerId,
      ownerId,
      condition: "Excelente",
      isListed: false
    };

    updateOwnedStickersState([...ownedStickers, newGiftCard]);

    const sName = STICKERS.find((s) => s.id === stickerId)?.name || "Figurinha";
    const newTx: SystemTransaction = {
      id: `TX-ADM-${Date.now().toString().slice(-4)}`,
      type: "Troca",
      details: `Brinde de figurinha [${sName}] injetado por Admin em: ${emailTarget}`,
      amount: 0,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...systemTransactions, newTx]);
  };

  const handleAdminCancelListing = (listingId: string) => {
    const updatedListings = listings.map((l) =>
      l.id === listingId ? { ...l, status: "Cancelado" as const } : l
    );
    updateListingsState(updatedListings);

    // Unlock card in seller inventory
    const updatedOwned = ownedStickers.map((item) =>
      item.listingId === listingId ? { ...item, isListed: false, listingId: undefined } : item
    );
    updateOwnedStickersState(updatedOwned);

    // Log admin intervention
    const newTx: SystemTransaction = {
      id: `TX-ADM-${Date.now().toString().slice(-4)}`,
      type: "Troca",
      details: `Anúncio ID ${listingId} banido por moderação administrativa`,
      amount: 0,
      timestamp: new Date().toISOString()
    };
    updateTransactionsState([...systemTransactions, newTx]);
  };

  const COLLECTORS = [
    { id: "usr_alice", name: "Alice Trader" },
    { id: "usr_bob", name: "Bob Cards" },
    { id: "usr_carol", name: "Carol (CopaHunter)" },
    { id: "usr_felipe", name: "Felipe Colecionador" }
  ];


  // --- VIEW RENDERING ENGINE ---

  const renderActiveRouteView = () => {
    switch (route) {
      case "#login":
        return (
          <LoginView
            onNavigate={navigate}
            onLogin={handleLogin}
            onLoginId={handleLoginGuestId}
          />
        );
      case "#register":
        return (
          <RegisterView
            onNavigate={navigate}
            onRegister={handleRegister}
          />
        );
      case "#admin-login":
        return (
          <AdminLoginView
            onNavigate={navigate}
            onLogin={handleLogin}
            onLoginId={handleLoginGuestId}
          />
        );
      case "#dashboard":
        if (!currentUser) {
          // If unauthenticated, bounce back securely to landing page
          return <LandingView onNavigate={navigate} />;
        }
        return renderDashboardTab();
      case "#landing":
      default:
        return <LandingView onNavigate={navigate} />;
    }
  };

  const renderDashboardTab = () => {
    switch (activeTab) {
      case "album":
        return (
          <MyAlbumView
            currentUser={currentUser!}
            ownedStickers={ownedStickers.filter((s) => s.ownerId === currentUser!.id)}
            listings={listings}
            onSellSticker={handleSellCollectible}
          />
        );
      case "trades":
        return (
          <TradingHubView
            currentUser={currentUser!}
            ownedStickers={ownedStickers.filter((s) => s.ownerId === currentUser!.id)}
            tradeProposals={tradeProposals.filter(
              (p) => p.proposerId === currentUser!.id || p.receiverId === currentUser!.id || p.receiverId === ""
            ).map(p => p.receiverId === "" ? { ...p, receiverId: currentUser!.id } : p)}
            onAcceptTrade={handleAcceptTradeProposal}
            onRejectTrade={handleRejectTradeProposal}
            onCreateTradeProposal={handleProposeTrade}
          />
        );
      case "chat":
        return (
          <ChatSimulatorView
            currentUser={currentUser!}
            chatMessages={chatMessages}
            onSendMessage={handleSendChatMessage}
            onReceiveMessageSimulated={handleReceiveSimulatedChatMessage}
          />
        );
      case "wallet":
        return (
          <WalletView
            currentUser={currentUser!}
            transactions={systemTransactions}
            onDeposit={handleBankDeposit}
          />
        );
      case "admin":
        if (currentUser?.role !== "admin") {
          setActiveTab("market");
          return null;
        }
        return (
          <AdminConsoleView
            currentUser={currentUser!}
            listings={listings}
            transactions={systemTransactions}
            ownedStickers={ownedStickers}
            onRewardUser={handleAdminRewardUser}
            onGiftSticker={handleAdminGiftSticker}
            onCancelListingAdmin={handleAdminCancelListing}
          />
        );
      case "market":
      default:
        return (
          <MarketplaceView
            currentUser={currentUser!}
            listings={listings}
            onBuyListing={handleBuyMarketListing}
            onNavigateTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-dark-bg font-sans selection:bg-brand-yellow selection:text-slate-900">
      
      {/* Ambient background blur elements (CSS mesh animated) */}
      <div className="ambient-bg" />
      <div className="ambient-blob blob-yellow" />
      <div className="ambient-blob blob-green" />
      <div className="ambient-blob blob-blue" />
      
      {/* Subtle background grain layout */}
      <div className="grain-overlay" />

      {/* TOP MENU NAVIGATION BAR (Glassmorphism Header) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a1a]/40 backdrop-blur-xl border-b border-white/5 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div
            onClick={() => navigate("#landing")}
            className="flex items-center gap-2 cursor-pointer font-display font-extrabold text-xl uppercase tracking-wider text-white select-none whitespace-nowrap"
          >
            <span>🎴</span>
            <span className="bg-gradient-to-r from-brand-yellow via-brand-green to-brand-blue bg-clip-text text-transparent glow-text-yellow">
              Trocacard
            </span>
          </div>

          {/* Core Menu nodes */}
          {currentUser ? (
            /* AUTHENTICATED NAVBAR LINKS */
            <nav className="hidden lg:flex items-center gap-1 bg-white/3 border border-white/5 p-1 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("market"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  route === "#dashboard" && activeTab === "market"
                    ? "bg-brand-yellow text-slate-950 font-bold"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mercado</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("album"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  route === "#dashboard" && activeTab === "album"
                    ? "bg-brand-green text-slate-950 font-bold"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Álbum</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("trades"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  route === "#dashboard" && activeTab === "trades"
                    ? "bg-brand-blue text-white font-bold"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Trocas</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("chat"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  route === "#dashboard" && activeTab === "chat"
                    ? "bg-white/10 text-white font-bold"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("wallet"); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  route === "#dashboard" && activeTab === "wallet"
                    ? "bg-brand-yellow text-slate-950 font-bold"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Carteira</span>
              </button>

              {currentUser.role === "admin" && (
                <button
                  onClick={() => { navigate("#dashboard"); setActiveTab("admin"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    route === "#dashboard" && activeTab === "admin"
                      ? "bg-red-500 text-white"
                      : "text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              )}
            </nav>
          ) : (
            /* GUEST ANONYMOUS MARKETING HEADER LINKS */
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <a href="#how-it-works" className="text-slate-300 hover:text-brand-yellow transition-colors font-semibold">Como Funciona</a>
              <a href="#featured-section" className="text-slate-300 hover:text-brand-green transition-colors font-semibold">Figurinhas</a>
              <a href="#contato" className="text-slate-300 hover:text-brand-blue transition-colors font-semibold">Suporte</a>
            </div>
          )}

          {/* Right Corner Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              /* Auth actions */
              <div className="flex items-center gap-3">
                
                {/* Balance display pill inside NAVBAR */}
                <div
                  onClick={() => { navigate("#dashboard"); setActiveTab("wallet"); }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 hover:bg-white/8 border border-white/5 cursor-pointer backdrop-blur-md transition-all"
                >
                  <Wallet className="w-3.5 h-3.5 text-brand-yellow" />
                  <span className="font-mono text-xs font-bold text-brand-yellow">
                    TC$ {currentUser.walletBalance.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </span>
                </div>

                {/* User avatar and logout */}
                <div className="flex items-center gap-2 bg-slate-900/60 pl-2.5 pr-1 py-1 rounded-full border border-white/5 select-none text-xs">
                  <span className="text-sm">{currentUser.avatar}</span>
                  <span className="font-semibold text-white max-w-[100px] truncate hidden md:inline">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    id="btn-nav-logout"
                    aria-label="Logout"
                    className="p-1 px-1.5 ml-1 select-none rounded-full bg-white/2 hover:bg-red-500/15 text-slate-400 hover:text-red-300 transition-all cursor-pointer"
                    title="Sair da Conta"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ) : (
              /* Anon marketing actions - TOP RIGHT CORNER CUSTOMIZATION REQUEST */
              <div className="flex items-center gap-2.5">
                
                {/* Admin button - smaller style requested */}
                <button
                  onClick={() => navigate("#admin-login")}
                  className="px-3 py-1.5 rounded-xl bg-white/3 border border-white/5 text-slate-400 font-sans font-medium text-xs hover:bg-white/8 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  id="btn-nav-admin"
                >
                  <span>⚙</span>
                  <span>Admin</span>
                </button>

                {/* Main Auth button */}
                <button
                  onClick={() => navigate("#login")}
                  className="px-4.5 py-2 rounded-xl bg-gradient-to-r from-brand-yellow to-amber-500 text-slate-950 font-display font-extrabold text-xs uppercase tracking-wide hover:shadow-md hover:shadow-brand-yellow/15 active:scale-95 transition-all cursor-pointer"
                  id="btn-nav-login"
                >
                  Entrar / Login
                </button>

              </div>
            )}

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/3 border border-white/5 text-white hover:bg-white/8 lg:hidden cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5" /> : <Menu className="w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE DROP-DOWN MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] bg-dark-bg/95 backdrop-blur-xl z-30 lg:hidden flex flex-col p-6 space-y-6 animate-fade-in border-t border-white/5">
          {currentUser ? (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("market"); }}
                className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "market" ? "bg-brand-yellow text-slate-950 font-bold" : "bg-white/3 text-slate-200"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Mercado de Figurinhas</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("album"); }}
                className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "album" ? "bg-brand-green text-slate-950 font-bold" : "bg-white/3 text-slate-200"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Seu Álbum</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("trades"); }}
                className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "trades" ? "bg-brand-blue text-white font-bold" : "bg-white/3 text-slate-200"
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Trocas</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("chat"); }}
                className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "chat" ? "bg-white/10 text-white font-bold" : "bg-white/3 text-slate-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => { navigate("#dashboard"); setActiveTab("wallet"); }}
                className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "wallet" ? "bg-brand-yellow text-slate-950 font-bold" : "bg-white/3 text-slate-200"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Carteira Digital</span>
              </button>

              {currentUser.role === "admin" && (
                <button
                  onClick={() => { navigate("#dashboard"); setActiveTab("admin"); }}
                  className="py-3 px-4 rounded-xl bg-red-600/20 text-red-300 font-mono text-sm font-bold border border-red-500/20"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="py-3 px-4 rounded-xl bg-red-500/10 text-red-400 font-semibold mt-4 text-center cursor-pointer hover:bg-red-500/15"
              >
                Sair da Conta
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-center text-base font-semibold">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-slate-300 hover:text-brand-yellow">Como Funciona</a>
              <a href="#featured-section" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-slate-300 hover:text-brand-green">Destaques</a>
              <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-slate-300 hover:text-brand-blue">Suporte</a>
              
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                <button
                  onClick={() => navigate("#admin-login")}
                  className="py-3 rounded-xl bg-white/3 border border-white/5 text-slate-400 text-xs font-bold"
                >
                  Painel Admin
                </button>
                <button
                  onClick={() => navigate("#login")}
                  className="py-3 rounded-xl bg-brand-yellow text-slate-950 text-xs font-bold"
                >
                  Login / Enviar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CORE VIEW LAYER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {renderActiveRouteView()}
      </main>

      {/* INTERACTIVE TOASTER POPUP (Glass Floating Pill Alert) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4.5 rounded-2xl glass-card border-brand-yellow/30 bg-[#070716]/90 max-w-sm flex items-center gap-3 shadow-xl animate-fade-in animate-bounce-subtle">
          <div className="w-8 h-8 rounded-xl bg-brand-yellow/15 flex items-center justify-center border border-brand-yellow/25 flex-shrink-0">
            <Bell className="w-4 h-4 text-brand-yellow animate-shake" />
          </div>
          <div>
            <p className="text-xs text-white font-semibold font-sans">{toastMessage}</p>
          </div>
        </div>
      )}

    </div>
  );
}
