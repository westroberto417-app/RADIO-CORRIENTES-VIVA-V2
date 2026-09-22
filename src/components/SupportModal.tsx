import React, { useState } from 'react';
import {
  X,
  Coffee,
  CreditCard,
  Copy,
  Check,
  ArrowDown,
  MessageCircle,
  ExternalLink,
  Heart,
  Sparkles,
  Radio,
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<'alias' | 'cvu' | null>(null);

  const ALIAS = 'westtecnobell';
  const CVU = '0000003100067616194578';
  const WHATSAPP_NUMBER = '1159204990';
  const WHATSAPP_INTL = '5491159204990';
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(
    'Hola, me comunico desde la app de Radio Corrientes Viva para más información sobre cómo apoyar a la emisora.'
  )}`;

  if (!isOpen) return null;

  const handleCopy = async (text: string, field: 'alias' | 'cvu') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="supportModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md max-h-[92vh] rounded-[36px] bg-[#0c0920]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_60px_rgba(0,229,255,0.25),0_0_40px_rgba(236,72,153,0.2)] flex flex-col overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-36 bg-gradient-to-b from-pink-500/20 to-transparent blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition cursor-pointer"
          title="Cerrar"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="p-5 sm:p-6 flex flex-col items-center text-center">
          {/* On Air / Live Station Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-pink-500/30 text-[10px] font-bold text-pink-300 tracking-widest uppercase mb-3 shadow-[0_0_10px_rgba(236,72,153,0.3)]">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span>AL AIRE • RADIO CORRIENTES VIVA</span>
          </div>

          {/* Main Title Matching Photo */}
          <h2
            id="supportModalTitle"
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-white drop-shadow-md"
          >
            APOYÁ A{' '}
            <span className="italic block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-400 to-rose-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]">
              NUESTRA RADIO
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-2.5 text-xs sm:text-sm text-white/75 max-w-xs font-normal leading-relaxed">
            Ayudanos a seguir creciendo y a mejorar nuestra transmisión comunitaria.
          </p>

          {/* Animated Coffee Badge */}
          <div className="my-5 flex flex-col items-center">
            {/* Animated Circular Badge with glowing steam */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-pink-500 opacity-60 blur-lg animate-pulse" />
              <div className="relative w-18 h-18 rounded-full bg-gradient-to-b from-[#131d3b] to-[#0a1226] border-2 border-cyan-400/70 flex items-center justify-center shadow-[0_0_25px_rgba(0,229,255,0.45)]">
                <div className="relative flex flex-col items-center justify-center">
                  {/* Animated Rising Steam Wisps */}
                  <div className="flex gap-1 mb-1">
                    <span className="w-1 h-2 rounded-full bg-cyan-300/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-3 rounded-full bg-cyan-200 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 rounded-full bg-cyan-300/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <Coffee className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                </div>
              </div>
            </div>

            {/* Label below circle */}
            <p className="mt-3 text-[11px] font-extrabold tracking-widest uppercase text-white/60">
              DONÁ UN CAFECITO A LA RADIO
            </p>

            {/* Downward bouncing arrow */}
            <div className="mt-1 animate-bounce text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Mercado Pago Card Matching Photo */}
          <div className="w-full rounded-3xl bg-[#09152b]/90 border border-cyan-500/40 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,180,255,0.18)] text-left space-y-4">
            {/* Mercado Pago Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0">
                <CreditCard className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white uppercase flex items-center justify-between">
                  <span>MERCADO PAGO</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    Transferencia
                  </span>
                </h3>
                <p className="text-xs text-cyan-300/80 font-medium">Abrir app y transferir</p>
              </div>
            </div>

            {/* ALIAS Row */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/50">ALIAS</p>
                <p className="text-sm font-bold text-white font-mono tracking-wide truncate">
                  {ALIAS}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(ALIAS, 'alias')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copiedField === 'alias'
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                }`}
                title="Copiar Alias"
              >
                {copiedField === 'alias' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* CVU Row */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/50">CVU</p>
                <p className="text-xs sm:text-sm font-bold text-white font-mono tracking-tight truncate">
                  {CVU}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(CVU, 'cvu')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copiedField === 'cvu'
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                }`}
                title="Copiar CVU"
              >
                {copiedField === 'cvu' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Contact Button (User request) */}
          <div className="w-full mt-4">
            <a
              id="whatsappSupportBtn"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba59] hover:to-[#0f7a6d] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] flex items-center justify-between transition-all transform active:scale-98 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black tracking-wide text-white uppercase">
                    Consultar por WhatsApp
                  </p>
                  <p className="text-[11px] text-white/90 font-medium">
                    Número: <span className="font-bold underline">11 5920 4990</span>
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          </div>

          {/* Thank You Footer Note */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/50">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            <span>¡Gracias por ser parte de Radio Corrientes Viva!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
