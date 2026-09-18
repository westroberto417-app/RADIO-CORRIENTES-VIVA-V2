import React, { useState } from 'react';
import { Mic, X, Send, Check, Music } from 'lucide-react';

interface SongRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SongRequestModal: React.FC<SongRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [song, setSong] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!song.trim()) return;

    // Format WhatsApp message to radio station
    const text = encodeURIComponent(
      `📻 *Pedido Musical para Radio Corrientes Viva* 🎵\n\n` +
      `👤 *Nombre:* ${name || 'Oyente fiel'}\n` +
      `🎶 *Tema solicitado:* ${song}\n` +
      (message ? `💬 *Mensaje:* ${message}\n` : '') +
      `\n¡Saludos desde la App oficial!`
    );

    window.open(`https://wa.me/?text=${text}`, '_blank');
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setSong('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="requestModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[#0e0c24] border border-pink-500/30 shadow-2xl shadow-pink-950/50 p-6 overflow-hidden ring-1 ring-pink-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 id="requestModalTitle" className="text-base font-bold text-white">
                Pedir Tema Musical
              </h2>
              <p className="text-[11px] text-pink-300/70">
                Llega directo a la cabina de Radio Corrientes Viva
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

        {sent ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/40">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">¡Pedido enviado con éxito!</h3>
            <p className="text-xs text-white/60">
              Tu mensaje fue preparado para la mesa de transmisión.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Tu Nombre o Apodo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan de San Miguel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Canción o Artista solicitado <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <Music className="w-4 h-4 text-pink-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  placeholder="Ej. Nombre del tema o grupo"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Mensaje o Saludo para el programa
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Un saludo especial para la familia..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido Musical</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
