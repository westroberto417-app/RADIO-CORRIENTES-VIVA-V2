import React, { useMemo } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 52,
  className = '',
}) => {
  // Waveform profile matching the uploaded ESPECTRO MUSICAL.png:
  // Symmetrical frequency spikes that expand up and down from the center horizontal axis
  const bars = useMemo(() => {
    // Envelope pattern creating the rhythmic mountain-and-valley shape of real music waveforms
    const heights = [
      15, 22, 35, 55, 75, 45, 85, 95, 60, 40,
      70, 90, 100, 85, 60, 45, 80, 95, 70, 50,
      35, 65, 88, 98, 75, 50, 70, 92, 100, 80,
      60, 45, 75, 90, 85, 65, 45, 80, 95, 70,
      50, 35, 60, 80, 90, 75, 55, 40, 60, 45,
      30, 20
    ];

    return Array.from({ length: barCount }).map((_, i) => {
      const normalized = i / (barCount - 1);
      // Realistic acoustic bell curve + rhythmic peaks
      const baseH = heights[i % heights.length] || 50;
      const speed = 0.35 + (i % 7) * 0.08;
      const delay = (i % 9) * 0.05;

      // Hues shifting from pink-magenta to violet with subtle white/cyan center
      let color = 'from-[#ec4899] via-[#d946ef] to-[#a855f7]';
      if (i > barCount * 0.4 && i < barCount * 0.6) {
        color = 'from-[#f43f5e] via-[#ec4899] to-[#c084fc]';
      }

      return {
        id: i,
        baseH,
        speed,
        delay,
        color,
      };
    });
  }, [barCount]);

  return (
    <div
      className={`relative flex items-center justify-between w-full h-14 sm:h-16 px-2 overflow-hidden ${className}`}
      aria-label="Espectro Musical en Tiempo Real"
    >
      {/* Symmetrical vertical soundwave bars (expanding up and down from center) */}
      <div className="flex items-center justify-between w-full h-full gap-[2px] sm:gap-[3px]">
        {bars.map((bar) => (
          <div
            key={bar.id}
            className="flex-1 flex flex-col items-center justify-center h-full"
          >
            {/* Top half of the waveform (pointing up) */}
            <div
              style={{
                height: isPlaying ? `${bar.baseH / 2}%` : '8%',
                animationDuration: isPlaying ? `${bar.speed}s` : '0s',
                animationDelay: isPlaying ? `${bar.delay}s` : '0s',
              }}
              className={`w-full max-w-[3px] rounded-t-full bg-gradient-to-t ${
                bar.color
              } transition-all duration-300 ${
                isPlaying
                  ? 'animate-spectrum-up drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]'
                  : 'opacity-30'
              }`}
            />

            {/* Glowing center nexus node */}
            <div
              className={`w-full max-w-[3px] h-[1.5px] bg-white transition-all ${
                isPlaying
                  ? 'shadow-[0_0_6px_#ffffff] opacity-90'
                  : 'bg-pink-500/40 opacity-40'
              }`}
            />

            {/* Bottom half of the waveform (pointing down, mirroring top half) */}
            <div
              style={{
                height: isPlaying ? `${bar.baseH / 2}%` : '8%',
                animationDuration: isPlaying ? `${bar.speed}s` : '0s',
                animationDelay: isPlaying ? `${bar.delay}s` : '0s',
              }}
              className={`w-full max-w-[3px] rounded-b-full bg-gradient-to-b ${
                bar.color
              } transition-all duration-300 ${
                isPlaying
                  ? 'animate-spectrum-down drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]'
                  : 'opacity-30'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Subtle glowing center horizontal line across the spectrum */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-pink-400/60 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};
