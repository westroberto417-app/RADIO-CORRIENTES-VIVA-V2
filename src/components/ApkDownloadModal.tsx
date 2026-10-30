import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  FileDown,
  Sparkles,
} from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  if (!isOpen) return null;

  const apkUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/RadioCorrientesViva.apk`
    : '/RadioCorrientesViva.apk';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(apkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'App Android Oficial - Radio Corrientes Viva',
      text: 'Descargá la app oficial de Radio Corrientes Viva para Android (.APK)',
      url: apkUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Ignored
      }
    } else {
      handleCopyLink();
    }
  };

  const onDownloadClick = () => {
    setDownloadStarted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apkModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0d0a21]/95 border-[2px] border-emerald-500/40 p-5 sm:p-6 text-white shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col gap-4 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient header */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-emerald-500 text-black font-black text-[9px] rounded-full uppercase">
                APK
              </span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Aplicación Android Nativa</span>
              </div>
              <h2 id="apkModalTitle" className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                Instalar App en tu Celular
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Station identity badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
          <img
            src="/radio-logo.png"
            alt="Radio Corrientes Viva"
            className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-white tracking-wide uppercase">Radio Corrientes Viva</p>
            <p className="text-[11px] text-pink-300 italic">"Porque está viva la raíz..."</p>
            <p className="text-[10px] text-white/50 mt-0.5">Paquete APK 1.0 • 11.2 MB • San Miguel, Corrientes</p>
          </div>
        </div>

        {/* Primary Download Action Button */}
        <div className="space-y-2">
          <a
            href="/RadioCorrientesViva.apk"
            download="RadioCorrientesViva.apk"
            onClick={onDownloadClick}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] transition-all transform active:scale-95 cursor-pointer text-center"
          >
            <Download className="w-5 h-5 text-black stroke-[2.5]" />
            <span>DESCARGAR APK ANDROID (11.2 MB)</span>
          </a>

          {downloadStarted && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>¡Descarga iniciada!</strong> Revisa la barra de notificaciones o descargas de tu teléfono.
              </span>
            </div>
          )}
        </div>

        {/* Quick Features List */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-white/80">Audio en segundo plano sin cortes</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-white/80">Control en pantalla de bloqueo</span>
          </div>
        </div>

        {/* 3 Step Installation Guide */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3">
          <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>Pasos sencillos para instalar en Android:</span>
          </p>

          <ol className="space-y-2.5 text-xs text-white/80 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white">Toca en Descargar APK:</strong> Si tu celular muestra el aviso común <em>«El archivo puede ser dañino»</em>, presiona <strong className="text-emerald-400">«Descargar de todos modos»</strong> (es la advertencia estándar de Android para apps descargadas directo desde internet).
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white">Abre el archivo:</strong> Al terminar la descarga, pulsa <strong className="text-emerald-400">«Abrir»</strong> en la notificación o busca <code>RadioCorrientesViva.apk</code> en la carpeta de Descargas.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-white">Instalar:</strong> Si te solicita autorización, activa <strong className="text-emerald-400">«Permitir desde esta fuente»</strong> y presiona <strong className="text-white">«Instalar»</strong>. ¡Listo!
              </div>
            </li>
          </ol>
        </div>

        {/* Help Toggle for Xiaomi / Redmi / Samsung */}
        <div>
          <button
            type="button"
            onClick={() => setShowTroubleshoot((prev) => !prev)}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white text-xs font-semibold flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>¿Tienes Xiaomi, Redmi, POCO o Samsung?</span>
            </span>
            <span className="text-[11px] text-pink-400">{showTroubleshoot ? 'Ocultar' : 'Ver ayuda'}</span>
          </button>

          {showTroubleshoot && (
            <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5 animate-in fade-in">
              <p>
                <strong>Para Xiaomi / Redmi / POCO:</strong>
              </p>
              <p className="text-[11px] text-white/80">
                Al intentar abrir el APK, si dice "Por motivos de seguridad...", presiona <strong>Ajustes</strong> &gt; activa <strong>Confiar en esta fuente</strong> &gt; espera la cuenta regresiva &gt; Aceptar &gt; Instalar.
              </p>
            </div>
          )}
        </div>

        {/* Secondary Actions: Copy Link & Share */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white/70" />
                <span>Copiar Enlace APK</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            title="Compartir APK"
          >
            <Share2 className="w-4 h-4 text-pink-400" />
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
