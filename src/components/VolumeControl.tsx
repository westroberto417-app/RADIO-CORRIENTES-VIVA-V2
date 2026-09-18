import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number; // 0 to 1
  onChange: (newVolume: number) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume || 0.8);
  const wrapRef = useRef<HTMLDivElement>(null);

  const percentage = Math.round(volume * 100);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      onChange(0);
    } else {
      onChange(prevVolume > 0 ? prevVolume : 0.8);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5 text-red-400" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5 text-[#f4f6f8]" />;
    return <Volume2 className="w-5 h-5 text-[#f4f6f8]" />;
  };

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        id="volumeToggleBtn"
        onClick={() => setIsOpen((prev) => !prev)}
        onDoubleClick={toggleMute}
        aria-label={`Volumen ${percentage}%`}
        title="VOLUMEN"
        className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm ${
          isOpen
            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/50'
            : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10'
        }`}
      >
        <span>{getVolumeIcon()}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">VOLUMEN</span>
      </button>

      {/* Popover Slider in Crystal Glass */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Ajuste de volumen"
          className="absolute bottom-14 left-1/2 -translate-x-1/2 z-40 w-48 p-3.5 rounded-2xl bg-[#0c0d12]/80 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/60 flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10"
        >
          <div className="flex items-center justify-between w-full text-xs font-semibold text-white/80 px-1">
            <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-bold">Volumen</span>
            <span className="font-mono text-white">{percentage}%</span>
          </div>

          <div className="w-full flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 text-white/70 hover:text-white transition cursor-pointer"
              title={volume === 0 ? 'Reactivar audio' : 'Silenciar'}
            >
              {volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              id="volumeRange"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
