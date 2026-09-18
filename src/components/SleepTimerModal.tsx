import React from 'react';
import { Timer, X, Check, Clock, AlertCircle } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMinutes: number | null;
  remainingSeconds: number | null;
  onSetTimer: (minutes: number) => void;
  onClearTimer: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  activeMinutes,
  remainingSeconds,
  onSetTimer,
  onClearTimer,
}) => {
  if (!isOpen) return null;

  const presets = [15, 30, 45, 60, 90];

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sleepTimerTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[32px] bg-[#0d0a21]/90 backdrop-blur-2xl border border-pink-500/30 p-6 shadow-[0_0_50px_rgba(236,72,153,0.3)] flex flex-col gap-4 text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 shadow-md">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="sleepTimerTitle" className="text-base font-bold text-white">
                Temporizador de Apagado
              </h2>
              <p className="text-[11px] text-white/60">
                Pausa la radio automáticamente
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar temporizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Countdown Display if active */}
        {remainingSeconds !== null && remainingSeconds > 0 ? (
          <div className="p-4 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
              </span>
              <div>
                <p className="text-xs font-semibold text-pink-200">Apagado programado en:</p>
                <p className="text-2xl font-black text-pink-400 tracking-wider">
                  {formatRemaining(remainingSeconds)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearTimer}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/30 text-white/90 hover:text-red-200 border border-white/15 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/60 flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Elige en cuántos minutos deseas que se detenga la reproducción.</span>
          </div>
        )}

        {/* Preset Options Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-1">
          {presets.map((mins) => {
            const isSelected = activeMinutes === mins;
            return (
              <button
                key={mins}
                type="button"
                onClick={() => onSetTimer(mins)}
                className={`py-3 px-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
                }`}
              >
                <span>{mins} minutos</span>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Action Button: Clear timer if active */}
        {activeMinutes !== null && (
          <button
            type="button"
            onClick={onClearTimer}
            className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-red-600/30 text-white/80 hover:text-red-200 border border-white/15 text-xs font-bold transition cursor-pointer"
          >
            Desactivar temporizador
          </button>
        )}
      </div>
    </div>
  );
};
