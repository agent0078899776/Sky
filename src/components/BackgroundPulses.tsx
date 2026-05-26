import React, { useEffect, useState } from "react";

interface PulseParticle {
  id: number;
  x: number; // percentage from left
  y: number; // initial percentage from top
  size: number; // size in px
  duration: number; // speed in seconds
  delay: number; // start delay in seconds
  opacity: number;
}

export const BackgroundPulses: React.FC = () => {
  const [pulses, setPulses] = useState<PulseParticle[]>([]);

  useEffect(() => {
    // Generate static nodes with responsive coordinates to avoid re-renders
    const list: PulseParticle[] = [];
    for (let i = 0; i < 28; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1, // 1px to 3px tiny stars/pulses
        duration: Math.random() * 15 + 15, // extremely slow drifting (15s to 30s)
        delay: Math.random() * -20, // negative delay so they start at random phases
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    setPulses(list);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Laser Beams Shooting Downwards (Sparsely distributed for a premium feel) */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => {
          const left = 15 + i * 16 + Math.sin(i) * 5; // spacing out
          const delay = i * 4.5;
          const duration = 12 + i * 3;
          return (
            <div
              key={`beam-${i}`}
              className="absolute top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
              style={{
                left: `${left}%`,
              }}
            >
              {/* Traveling light pulse bullet */}
              <div
                className="absolute w-[2px] h-24 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent opacity-85 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse-travel"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Floating starry celestial pulses */}
      <svg className="absolute inset-0 w-full h-full opacity-60">
        {pulses.map((p) => (
          <g key={p.id}>
            {/* Pulsing glow ring */}
            <circle
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size * 2.5}
              fill="url(#pulseGlow)"
              className="animate-pulse opacity-20"
              style={{
                animationDuration: `${p.duration / 4}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
            {/* Core dot */}
            <circle
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size}
              fill="#22d3ee"
              style={{
                opacity: p.opacity,
                transition: "opacity 1s ease-in-out",
              }}
            />
          </g>
        ))}
        {/* Gradients definitions as custom SVG components */}
        <defs>
          <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
