import React, { useState } from 'react';
import { MessageSquare, X, Send, Heart, MessageCircle } from 'lucide-react';

interface ListenerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

export const ListenerChatModal: React.FC<ListenerChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Locutor / Cabina',
      text: '¡Bienvenidos a la transmisión oficial de Radio Corrientes Viva! Dejen sus saludos desde donde nos escuchan.',
      time: '19:40',
    },
    {
      id: '2',
      sender: 'María Eugenia (San Miguel)',
      text: '¡Hermosa la música y bendiciones a toda la audiencia!',
      time: '19:42',
    },
    {
      id: '3',
      sender: 'Carlos Andrés',
      text: 'Escuchando desde Corrientes Capital con excelente sonido 📻✨',
      time: '19:44',
    },
  ]);
  const [input, setInput] = useState('');
  const [senderName, setSenderName] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: senderName.trim() || 'Oyente',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const openWhatsAppChat = () => {
    const text = encodeURIComponent('¡Hola Radio Corrientes Viva! Les escribo desde la app oficial.');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#0e0c24] border border-pink-500/30 shadow-2xl shadow-pink-950/50 p-5 flex flex-col h-[520px] max-h-[85vh] ring-1 ring-pink-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 id="chatModalTitle" className="text-base font-bold text-white">
                Comunidad en Vivo
              </h2>
              <p className="text-[11px] text-pink-300/70">
                Comparte con los oyentes de Radio Corrientes Viva
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Direct Banner */}
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-200">¿Quieres chatear directo al WhatsApp del estudio?</span>
          </div>
          <button
            type="button"
            onClick={openWhatsAppChat}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shrink-0 transition"
          >
            Abrir WhatsApp
          </button>
        </div>

        {/* Chat message list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
          {messages.map((msg) => {
            const isStudio = msg.sender.includes('Cabina');
            return (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl border ${
                  isStudio
                    ? 'bg-pink-950/30 border-pink-500/30 text-pink-100'
                    : 'bg-white/[0.04] border-white/10 text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`font-bold ${isStudio ? 'text-pink-400' : 'text-indigo-300'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-white/40">{msg.time}</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed">{msg.text}</p>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="pt-2 border-t border-white/10 shrink-0 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Tu nombre (opcional)"
              className="w-1/3 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje para los oyentes..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition flex items-center justify-center cursor-pointer shadow-md shadow-pink-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
