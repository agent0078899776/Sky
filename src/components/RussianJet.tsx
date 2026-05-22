import React from "react";

interface RussianJetProps {
  rotation?: number; // Tilt of the jet (roll/banking)
  activeScroll?: boolean; // If scrolling is active, increase afterburner flames
}

export const RussianJet: React.FC<RussianJetProps> = ({ rotation = 0, activeScroll = false }) => {
  return (
    <div
      className="relative transition-transform duration-300 ease-out"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Jet Silhouette + blueprint overlay SVG */}
      <svg
        width="150"
        height="180"
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_0_15px_rgba(6,182,212,0.35)]"
      >
        <defs>
          {/* Blue-cyan neon gradient for the blueprint lines */}
          <linearGradient id="neonCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.9" />
          </linearGradient>

          {/* Engine thrust heat fire gradient */}
          <radialGradient id="afterburnerFire" cx="50%" cy="0%" r="50%">
            <stop offset="0%" stopColor="#ffb703" />
            <stop offset="30%" stopColor="#f77f00" />
            <stop offset="70%" stopColor="#d62828" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d62828" stopOpacity="0" />
          </radialGradient>

          {/* Cyber aura backlight */}
          <radialGradient id="cyberBacklight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#060a14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Backlight Glow Circle */}
        <circle cx="100" cy="110" r="80" fill="url(#cyberBacklight)" />

        {/* --- DYNAMIC AFTERBURNER FLAMES --- */}
        {/* Left Exhaust Flame */}
        <g className="origin-top">
          <ellipse
            cx="84"
            cy="200"
            rx="12"
            ry={activeScroll ? "38" : "18"}
            fill="url(#afterburnerFire)"
            className={`transition-all duration-300 ${
              activeScroll ? "animate-pulse" : "opacity-75"
            }`}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center top",
              animationDuration: "0.08s",
            }}
          />
          {/* Core plasma white glow */}
          <ellipse
            cx="84"
            cy="198"
            rx="5"
            ry={activeScroll ? "18" : "8"}
            fill="#ffffff"
            className="opacity-90"
          />
        </g>

        {/* Right Exhaust Flame */}
        <g className="origin-top">
          <ellipse
            cx="116"
            cy="200"
            rx="12"
            ry={activeScroll ? "38" : "18"}
            fill="url(#afterburnerFire)"
            className={`transition-all duration-300 ${
              activeScroll ? "animate-pulse" : "opacity-75"
            }`}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center top",
              animationDuration: "0.08s",
            }}
          />
          {/* Core plasma white glow */}
          <ellipse
            cx="116"
            cy="198"
            rx="5"
            ry={activeScroll ? "18" : "8"}
            fill="#ffffff"
            className="opacity-90"
          />
        </g>

        {/* --- FIGHTER JET HULL STRUCTURE (SU-57 PROFILE) --- */}
        
        {/* Base filled polygon for solid visual weighting */}
        <polygon
          points="100,20 120,45 130,55 135,70 190,145 178,175 136,170 124,198 116,204 100,200 84,204 76,198 64,170 22,175 10,145 65,70 70,55 80,45"
          fill="#111827"
          stroke="#1e293b"
          strokeWidth="1.5"
          className="opacity-95"
        />

        {/* Radar absorbent panel layers (Blueprint neon lines) */}
        <polygon
          points="100,20 120,45 130,55 135,70 190,145 178,175 136,170 124,198 116,204 100,200 84,204 76,198 64,170 22,175 10,145 65,70 70,55 80,45"
          stroke="url(#neonCyanGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* LERX (Leading Edge Root Extensions) Inner Lines */}
        <path
          d="M 100,30 L 115,50 L 126,62 L 128,82 M 100,30 L 85,50 L 74,62 L 72,82"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Left Wing Intake duct / engine nacelle panels */}
        <rect
          x="72"
          y="100"
          width="15"
          height="90"
          rx="3"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#0f172a"
          opacity="0.9"
        />
        {/* Right Wing Intake duct / engine nacelle panels */}
        <rect
          x="113"
          y="100"
          width="15"
          height="90"
          rx="3"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#0f172a"
          opacity="0.9"
        />

        {/* Wing flap detail lines */}
        <path
          d="M 60,110 L 28,144 M 140,110 L 172,144 M 64,136 L 36,158 M 136,136 L 164,158"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Central Spine line */}
        <line
          x1="100"
          y1="22"
          x2="100"
          y2="198"
          stroke="url(#neonCyanGrad)"
          strokeWidth="2"
          opacity="0.75"
        />

        {/* Horizontal Tail elevators */}
        <polygon
          points="84,198 45,215 48,230 80,210"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#0f172a"
        />
        <polygon
          points="116,198 155,215 152,230 120,210"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#0f172a"
        />

        {/* Canted Twin Vertical Stabilizers (v-tails) */}
        <path
          d="M 78,160 L 55,200 L 60,210 L 82,180 Z"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />
        <path
          d="M 122,160 L 145,200 L 140,210 L 118,180 Z"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />

        {/* Cockpit Canopy Bubble */}
        <ellipse
          cx="100"
          cy="75"
          rx="8"
          ry="24"
          fill="#0f172a"
          stroke="url(#neonCyanGrad)"
          strokeWidth="2"
        />
        {/* Canopy glare / reflection line */}
        <path
          d="M 98,60 C 98,60 102,70 98,90"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.7"
          strokeLinecap="round"
        />

        {/* Dual Afterburner Engine Nozzles styling */}
        <rect
          x="77"
          y="190"
          width="14"
          height="11"
          rx="1.5"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />
        <rect
          x="109"
          y="190"
          width="14"
          height="11"
          rx="1.5"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />

        {/* --- POSITION/NAVIGATION STROBE LIGHTS --- */}
        {/* Left Wing Strobe (Red) */}
        <circle cx="22" cy="173" r="4.5" fill="#f43f5e" className="animate-ping" style={{ animationDuration: "1s" }} />
        <circle cx="22" cy="173" r="3" fill="#ef4444" />

        {/* Right Wing Strobe (Green) */}
        <circle cx="178" cy="173" r="4.5" fill="#10b981" className="animate-ping" style={{ animationDuration: "1s", animationDelay: "0.2s" }} />
        <circle cx="178" cy="173" r="3" fill="#10b981" />
      </svg>
    </div>
  );
};
