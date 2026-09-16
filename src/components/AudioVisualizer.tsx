import React, { useMemo } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 26,
  className = '',
}) => {
  // 26 frequency bands configured with realistic harmonic wave distribution
  const bands = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const normalized = i / (barCount - 1);
      // Realistic acoustic curve: stronger presence in low-mids and vocals
      const curve = Math.sin(normalized * Math.PI) * 0.35 + 0.65;
      const speed = 0.38 + (i % 6) * 0.1;
      const delay = (i % 7) * 0.06;
      const peakDelay = (i % 5) * 0.08;
      const peakSpeed = 0.42 + (i % 4) * 0.11;

      // Height distribution
      const baseHeights = [45, 65, 90, 75, 98, 60, 85, 95, 70, 88, 55, 78, 92, 65, 80, 85, 60, 72, 50, 68, 48, 58, 40, 52];
      const maxH = Math.round((baseHeights[i % baseHeights.length] || 70) * curve);

      // Color mapping: bass (indigo) -> mids (violet) -> treble (rose/coral)
      let colorClass = 'from-indigo-500 to-indigo-400';
      let peakColor = 'bg-indigo-300 shadow-[0_0_4px_rgba(165,180,252,0.8)]';

      if (normalized > 0.65) {
        colorClass = 'from-purple-500 to-rose-400';
        peakColor = 'bg-rose-300 shadow-[0_0_4px_rgba(253,164,175,0.8)]';
      } else if (normalized > 0.3) {
        colorClass = 'from-indigo-500 to-purple-400';
        peakColor = 'bg-purple-300 shadow-[0_0_4px_rgba(216,180,254,0.8)]';
      }

      return {
        id: i,
        speed,
        delay,
        peakSpeed,
        peakDelay,
        maxH,
        colorClass,
        peakColor,
      };
    });
  }, [barCount]);

  return (
    <div
      className={`flex items-end justify-between gap-1 w-full h-5 px-1 ${className}`}
      aria-label="Espectro visual de audio"
    >
      {bands.map((band) => (
        <div
          key={band.id}
          className="flex-1 flex flex-col items-center justify-end h-full"
        >
          {/* Floating Peak Hold Dot */}
          <span
            style={{
              animationDuration: isPlaying ? `${band.peakSpeed}s` : '0s',
              animationDelay: isPlaying ? `${band.peakDelay}s` : '0s',
            }}
            className={`w-full max-w-[4px] h-[2.5px] rounded-full mb-0.5 transition-all ${
              isPlaying ? `${band.peakColor} animate-peak` : 'bg-white/10 opacity-20'
            }`}
          />

          {/* Dynamic Sound Wave Bar */}
          <div
            style={{
              height: isPlaying ? `${band.maxH}%` : '12%',
              animationDuration: isPlaying ? `${band.speed}s` : '0s',
              animationDelay: isPlaying ? `${band.delay}s` : '0s',
            }}
            className={`w-full max-w-[4px] rounded-full bg-gradient-to-t ${
              band.colorClass
            } transition-all duration-300 ${
              isPlaying
                ? 'animate-spectrum shadow-[0_0_6px_rgba(99,102,241,0.3)]'
                : 'opacity-25'
            }`}
          />
        </div>
      ))}
    </div>
  );
};
