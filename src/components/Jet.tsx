import React from "react";

interface ChineseJetProps {
  rotation?: number; // Tilt of the jet (roll/banking)
  activeScroll?: boolean; // If scrolling is active, increase afterburner flames
}

export const ChineseJet: React.FC<ChineseJetProps> = ({ rotation = 0, activeScroll = false }) => {
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
            cx="86"
            cy="212"
            rx="11"
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
            cx="86"
            cy="210"
            rx="4.5"
            ry={activeScroll ? "18" : "8"}
            fill="#ffffff"
            className="opacity-90"
          />
        </g>

        {/* Right Exhaust Flame */}
        <g className="origin-top">
          <ellipse
            cx="114"
            cy="212"
            rx="11"
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
            cx="114"
            cy="210"
            rx="4.5"
            ry={activeScroll ? "18" : "8"}
            fill="#ffffff"
            className="opacity-90"
          />
        </g>

        {/* --- CHINESE J-20 MIGHTY DRAGON HULL --- */}
        {/* Base solid polygon for solid visual depth */}
        <polygon
          points="100,12 108,45 132,60 110,65 110,85 110,95 185,175 185,180 122,185 122,205 112,212 100,208 88,212 78,205 78,185 15,180 15,175 90,95 90,85 90,65 68,60 92,45"
          fill="#0c111d"
          stroke="#1e293b"
          strokeWidth="1.5"
          className="opacity-95"
        />

        {/* Blueprint Neon Outlines */}
        <polygon
          points="100,12 108,45 132,60 110,65 110,85 110,95 185,175 185,180 122,185 122,205 112,212 100,208 88,212 78,205 78,185 15,180 15,175 90,95 90,85 90,65 68,60 92,45"
          stroke="url(#neonCyanGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Forward Canards Internal Details */}
        <polygon
          points="110,65 132,60 108,45"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#111827"
          opacity="0.8"
        />
        <polygon
          points="90,65 68,60 92,45"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#111827"
          opacity="0.8"
        />

        {/* Diverterless Supersonic Intakes (DSI) panel structures */}
        <rect
          x="75"
          y="80"
          width="13"
          height="45"
          rx="2"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#0f172a"
          opacity="0.9"
        />
        <rect
          x="112"
          y="80"
          width="13"
          height="45"
          rx="2"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
          fill="#0f172a"
          opacity="0.9"
        />

        {/* Wing flap detail lines & panel lines */}
        <path
          d="M 110,95 L 145,135 M 90,95 L 55,135"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 125,120 L 180,175 M 75,120 L 20,175"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 134,182 L 175,180 M 66,182 L 25,180"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.2"
          opacity="0.7"
        />

        {/* Central Spine longitudinal line */}
        <line
          x1="100"
          y1="14"
          x2="100"
          y2="206"
          stroke="url(#neonCyanGrad)"
          strokeWidth="2"
          opacity="0.75"
        />

        {/* Outboard canted twin vertical stabilizers far back on tail booms */}
        <path
          d="M 78,180 L 60,215 L 66,222 L 80,195 Z"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />
        <path
          d="M 122,180 L 140,215 L 134,222 L 120,195 Z"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />

        {/* Slim Cockpit Canopy Bubble */}
        <ellipse
          cx="100"
          cy="74"
          rx="7"
          ry="22"
          fill="#0f172a"
          stroke="url(#neonCyanGrad)"
          strokeWidth="2"
        />
        {/* Canopy glare line */}
        <path
          d="M 98,60 C 98,60 101,70 98,87"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.7"
          strokeLinecap="round"
        />

        {/* Dual WS-15 Engine Exhaust Nozzles */}
        <rect
          x="79"
          y="202"
          width="13"
          height="11"
          rx="1"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />
        <rect
          x="108"
          y="202"
          width="13"
          height="11"
          rx="1"
          fill="#1e293b"
          stroke="url(#neonCyanGrad)"
          strokeWidth="1.5"
        />

        {/* --- POSITION/NAVIGATION STROBE LIGHTS --- */}
        {/* Left Wing Strobe (Red) */}
        <circle cx="17" cy="177" r="4.5" fill="#f43f5e" className="animate-ping" style={{ animationDuration: "1s" }} />
        <circle cx="17" cy="177" r="3" fill="#ef4444" />

        {/* Right Wing Strobe (Green) */}
        <circle cx="183" cy="177" r="4.5" fill="#10b981" className="animate-ping" style={{ animationDuration: "1s", animationDelay: "0.2s" }} />
        <circle cx="183" cy="177" r="3" fill="#10b981" />
      </svg>
    </div>
  );
};
