import React from 'react';
import { Coffee } from 'lucide-react';

interface AnimatedCoffeeIconProps {
  className?: string;
  isActive?: boolean;
}

export const AnimatedCoffeeIcon: React.FC<AnimatedCoffeeIconProps> = ({
  className = 'w-5 h-5',
  isActive = false,
}) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Animated steam vapor lines */}
      <span
        className={`absolute -top-2 left-1.5 w-0.5 h-1.5 rounded-full bg-cyan-300 transition-opacity duration-300 ${
          isActive ? 'opacity-100 animate-bounce' : 'opacity-70 animate-pulse'
        }`}
        style={{ animationDuration: '1.2s' }}
      />
      <span
        className={`absolute -top-2.5 left-2.5 w-0.5 h-2 rounded-full bg-cyan-200 transition-opacity duration-300 ${
          isActive ? 'opacity-100 animate-bounce' : 'opacity-80 animate-pulse'
        }`}
        style={{ animationDuration: '1s', animationDelay: '0.2s' }}
      />
      <span
        className={`absolute -top-2 left-3.5 w-0.5 h-1.5 rounded-full bg-cyan-300 transition-opacity duration-300 ${
          isActive ? 'opacity-100 animate-bounce' : 'opacity-70 animate-pulse'
        }`}
        style={{ animationDuration: '1.3s', animationDelay: '0.4s' }}
      />

      {/* Coffee Cup with gentle pulse */}
      <Coffee
        className={`${className} transition-transform duration-300 ${
          isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]' : ''
        }`}
      />

      {/* Subtle glowing halo when active */}
      {isActive && (
        <span
          className="absolute -inset-1 rounded-full bg-cyan-400/25 blur-sm pointer-events-none -z-10 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
