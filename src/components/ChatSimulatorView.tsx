import React, { useState, useEffect, useRef } from "react";
import { UserProfile, ChatMessage } from "../types";
import { Send, Sparkles, MessageSquare, AlertCircle, Smile } from "lucide-react";

interface ChatSimulatorViewProps {
  currentUser: UserProfile;
  chatMessages: ChatMessage[];
  onSendMessage: (receiverId: string, text: string) => void;
  onReceiveMessageSimulated: (senderId: string, text: string, delayMs: number) => void;
}

const COLLECTORS = [
  { id: "usr_alice", name: "Alice Trader", avatar: "🎒", desc: "Colecionadora de figurinhas da Copa" },
  { id: "usr_bob", name: "Bob Cards", avatar: "👒", desc: "Vendedor de cards Comuns e Raras" },
  { id: "usr_carol", name: "Carol (CopaHunter)", avatar: "🏆", desc: "Foco total na categoria Lendas do Futebol" },
  { id: "usr_felipe", name: "Felipe Colecionador", avatar: "⚽", desc: "À procura de figurinhas de Futebol lendárias" }
];

export default function ChatSimulatorView({
  currentUser,
  chatMessages,
  onSendMessage,
  onReceiveMessageSimulated
}: ChatSimulatorViewProps) {
  const [activePartnerId, setActivePartnerId] = useState(COLLECTORS[0].id);
  const [typeText, setTypeText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePartner = COLLECTORS.find((c) => c.id === activePartnerId) || COLLECTORS[0];

  // Filter messages for current conservation pair
  const conversationMessages = chatMessages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activePartnerId) ||
      (m.senderId === activePartnerId && m.receiverId === currentUser.id)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeText.trim()) return;

    const userMessage = typeText.trim();
    onSendMessage(activePartnerId, userMessage);
    setTypeText("");

    // Simulate reactive responses based on keywords
    generateBotReply(userMessage);
  };

  const generateBotReply = (msgStr: string) => {
    const lowercaseMsg = msgStr.toLowerCase();
    let reply = "";

    if (activePartnerId === "usr_alice") {
      if (lowercaseMsg.includes("troca") || lowercaseMsg.includes("propor")) {
        reply = "Oi! Olhei seu álbum e achei super legal. Pode propor a troca na Central de Trocas que se for justa por alguma figurinha da Copa eu aceito na hora!";
      } else if (lowercaseMsg.includes("pelé") || lowercaseMsg.includes("maradona") || lowercaseMsg.includes("copa")) {
        reply = "Nossa, eu sou fascinada pela Copa do Mundo! O Pelé #10 e o Maradona Divine são minhas relíquias prediletas.";
      } else {
        reply = "Olá! Vamos negociar algumas figurinhas da Copa do Mundo hoje? Tenho duplicadas excelentes.";
      }
    } else if (activePartnerId === "usr_bob") {
      if (lowercaseMsg.includes("comprar") || lowercaseMsg.includes("anúncio") || lowercaseMsg.includes("preço")) {
        reply = "Com certeza! Coloquei os preços lá embaixo no mercado ativo para vender rápido hoje. Fique à vontade para arrematar.";
      } else if (lowercaseMsg.includes("mbappé") || lowercaseMsg.includes("desconto")) {
        reply = "O Mbappé Flash está excelente! O valor de TC$ 90 está ótimo, mas se quiser me chama mais tarde que eu mudo o preço.";
      } else {
        reply = "Opa! Bob Cards na área. Se precisar de figurinhas raras e boas, dá uma olhada na minha vitrine do Mercado.";
      }
    } else if (activePartnerId === "usr_carol") {
      if (lowercaseMsg.includes("lendas") || lowercaseMsg.includes("ronaldo") || lowercaseMsg.includes("ronaldinho")) {
        reply = "Sou uma grande fã das lendas do futebol! O Ronaldinho Bruxo e o Ronaldo Fenômeno representam pura arte em campo 🎨. Você concorda?";
      } else {
        reply = "Olá! Estou tentando focar minha coleção inteira em itens Lendas do Futebol. Se tiver cards repetidos dessa categoria, me envia proposta de troca imediata!";
      }
    } else if (activePartnerId === "usr_felipe") {
      if (lowercaseMsg.includes("futebol") || lowercaseMsg.includes("ney") || lowercaseMsg.includes("leo") || lowercaseMsg.includes("cr7")) {
        reply = "Rapaz, eu sou louco pelo Ney Gold e Cr7 Legend. Se você me propor esses cards eu posso te dar ótimas vantagens em troca!";
      } else {
        reply = "E aí! Procurando decolar no álbum de Futebol internacional. Tem figurinhas repetidas da seleção pra trocar?";
      }
    }

    if (reply) {
      // Trigger simulated scheduled incoming message
      onReceiveMessageSimulated(activePartnerId, reply, 2000);
    }
  };

  const preselectedOptions = [
    "Olá! Gostaria de negociar uma figurinha com você.",
    "Você aceita propor uma troca na Central de Trocas?",
    "Olhei os anúncios que você postou no Mercado ativo e achei bem legal!",
    "Tenho interesse nos seus cards de Futebol e da Copa!"
  ];

  return (
    <div id="chat-simulator-view" className="space-y-8 animate-fade-in pb-16">
      
      {/* Intro Header */}
      <div className="glass-card rounded-3xl p-5 border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
            <MessageSquare className="text-brand-blue" />
            <span>Chat Comunitário</span>
          </h2>
          <p className="text-slate-400 text-xs">
            Converse diretamente com bots de colecionadores ativos. Negocie preços e estimule propostas de trocas!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[600px] items-stretch">
        
        {/* Collectors List Column (Left 4 cols) */}
        <div className="md:col-span-4 bg-slate-900/30 border border-white/5 rounded-3xl p-4 flex flex-col gap-3 overflow-y-auto">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-1">
            Membros Ativos
          </h3>
          
          <div className="space-y-2.5">
            {COLLECTORS.map((collector) => (
              <button
                key={collector.id}
                onClick={() => setActivePartnerId(collector.id)}
                className={`w-full p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                  activePartnerId === collector.id
                    ? "bg-brand-blue/10 border-brand-blue/40 shadow-md"
                    : "bg-white/3 border-transparent hover:bg-white/5"
                }`}
              >
                <span className="text-2xl bg-black/35 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5">
                  {collector.avatar}
                </span>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {collector.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {collector.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window Column (Right 8 cols) */}
        <div className="md:col-span-8 glass-card border border-white/5 rounded-3xl flex flex-col justify-between overflow-hidden relative">
          
          {/* Chat Partner Header bar */}
          <div className="p-4 border-b border-white/5 bg-[#0e0e24] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl bg-slate-800/80 w-8 h-8 rounded-lg flex items-center justify-center">
                {activePartner.avatar}
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">{activePartner.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
                  <span className="text-[9px] font-mono text-slate-500">Conectado on-line</span>
                </div>
              </div>
            </div>
            
            <span className="text-xxs font-mono text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20">
              Negociador Ativo
            </span>
          </div>

          {/* Messages Feed area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[400px] no-scrollbar bg-black/10">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-2xl">💬</p>
                <p className="text-xs text-slate-400 font-sans leading-snug">
                  Nenhum histórico com {activePartner.name}.<br />
                  Envie uma mensagem abaixo para começar a negociar!
                </p>
              </div>
            ) : (
              conversationMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? "bg-brand-blue text-white rounded-tr-none shadow-md shadow-brand-blue/10"
                          : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      <p className="leading-relaxed font-sans">{msg.text}</p>
                      <span className="text-[8px] font-mono mt-1 pr-0.5 text-right block opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies preselected bar helper */}
          <div className="px-4 py-2 bg-black/40 border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
            {preselectedOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setTypeText(opt)}
                className="px-3 py-1.5 rounded-lg bg-white/3 border border-white/5 text-slate-400 hover:text-white hover:bg-white/8 transition-all text-xxs whitespace-nowrap cursor-pointer hover:border-brand-blue/30"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Form Message input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-[#0a0a1a] flex gap-2.5 items-center">
            <input
              type="text"
              value={typeText}
              onChange={(e) => setTypeText(e.target.value)}
              placeholder={`Digite uma mensagem privada para ${activePartner.name}...`}
              className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-brand-blue transition-all"
              id="chat-text-input"
            />
            <button
              type="submit"
              className="p-3 rounded-xl bg-brand-blue hover:bg-blue-600 transition-all font-bold text-white cursor-pointer hover:shadow-lg hover:shadow-brand-blue/15 flex-shrink-0"
              id="chat-send-btn"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
