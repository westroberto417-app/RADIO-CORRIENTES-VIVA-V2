import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface LiveClockProps {
  className?: string;
  timeZone?: string;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  className = '',
  timeZone = 'America/Argentina/Buenos_Aires',
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    // Update every second for smooth ticking
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formatter options for Argentina time
  const timeFormatter = new Intl.DateTimeFormat('es-AR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  let timeString = '';
  let dateString = '';

  try {
    timeString = timeFormatter.format(currentDate);
    // Capitalize first letter of each word in date
    const rawDate = dateFormatter.format(currentDate);
    dateString = rawDate.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  } catch {
    // Fallback if timeZone is unsupported
    timeString = currentDate.toLocaleTimeString('es-AR', { hour12: false });
    dateString = currentDate.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  return (
    <div
      className={`mt-2 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-cyan-500/30 text-white shadow-[0_0_18px_rgba(6,182,212,0.22)] select-none transition-all duration-300 hover:border-cyan-400/50 ${className}`}
      aria-label={`Hora actual en transmisión: ${timeString}, ${dateString}`}
      title="Hora oficial de transmisión (Corrientes, Argentina)"
    >
      {/* Live studio indicator & clock icon */}
      <div className="flex items-center gap-1.5 text-cyan-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
        <Clock className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
      </div>

      {/* Digital Time Display */}
      <span className="font-mono text-xs sm:text-[13px] font-black tracking-widest text-cyan-200 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
        {timeString}
      </span>

      {/* Subtle divider */}
      <span className="w-1 h-3 rounded-full bg-white/20" />

      {/* Date Display */}
      <div className="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-white/80">
        <Calendar className="w-3 h-3 text-pink-400 opacity-90" />
        <span>{dateString}</span>
      </div>
    </div>
  );
};
