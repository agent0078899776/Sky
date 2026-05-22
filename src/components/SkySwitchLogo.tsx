import React from "react";

interface SkySwitchLogoProps {
  size?: number;
  interactive?: boolean;
}

export const SkySwitchLogo: React.FC<SkySwitchLogoProps> = ({ 
  size = 40, 
  interactive = true 
}) => {
  return (
    <div 
      className={`relative inline-block select-none ${
        interactive ? "hover:scale-105 transition-transform duration-300 active:scale-95 cursor-pointer" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse-subtle"
        style={{ animationDuration: "5s" }}
      >
        <defs>
          {/* Cyan 3D metallic plastic shading gradient */}
          <linearGradient id="cyanRibbon" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan 400 */}
            <stop offset="35%" stopColor="#0ea5e9" /> {/* Sky 500 */}
            <stop offset="70%" stopColor="#2563eb" /> {/* Blue 600 */}
            <stop offset="100%" stopColor="#1e3a8a" /> {/* Blue 900 */}
          </linearGradient>

          {/* Lime Green to Emerald 3D metallic shading gradient */}
          <linearGradient id="greenRibbon" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#a3e635" /> {/* Lime 400 */}
            <stop offset="40%" stopColor="#84cc16" /> {/* Lime 500 */}
            <stop offset="75%" stopColor="#16a34a" /> {/* Green 600 */}
            <stop offset="100%" stopColor="#14532d" /> {/* Green 900 */}
          </linearGradient>

          {/* Golden Orange high-intensity active core indicator */}
          <linearGradient id="goldIndicator" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Deep dark backing for contrasting 3D depth */}
          <radialGradient id="innerDepthShadow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#020617" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#060a14" stopOpacity="0" />
          </radialGradient>

          {/* Glass-reflection white-to-transparent overlay */}
          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* 3D Drop Shadow filter */}
          <filter id="meshShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="3" floodColor="#020617" floodOpacity="0.85" />
          </filter>

          {/* Neon inner edge glow filter */}
          <filter id="neonGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Underlying dark perspective shadow */}
        <circle cx="60" cy="65" r="45" fill="url(#innerDepthShadow)" />

        {/* 2. Outer Glassmorphic Chrome Orbital Ring (Representing the Sky/Atmosphere) */}
        <circle
          cx="60"
          cy="60"
          r="48"
          stroke="url(#cyanRibbon)"
          strokeWidth="6"
          strokeOpacity="0.65"
          filter="url(#meshShadow)"
        />
        {/* Subtle glowing highlights on the orbital ring */}
        <circle
          cx="60"
          cy="60"
          r="48"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="40 180"
          strokeLinecap="round"
          className="animate-spin"
          style={{ animationDuration: "14s" }}
        />

        {/* 3. Outer Neon Edge Shield Tracker */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#00A3E0"
          strokeWidth="1"
          strokeDasharray="4 8"
          strokeOpacity="0.4"
        />

        {/* --- DYNAMIC INTERWOVEN S-SHAPED 3D RIBBONS --- */}
        <g filter="url(#meshShadow)">
          {/* Blue/Cyan Left Ribbon (Dynamic swoop upward & overlapping) */}
          <path
            d="M 28,75 
               C 22,55 35,32 58,32 
               C 74,32 86,44 86,58
               C 86,66 78,75 66,75
               C 58,75 52,69 52,62
               C 52,55 58,49 66,49
               C 70,49 74,52 74,56"
            stroke="url(#cyanRibbon)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lime Green Right Ribbon (Interlocking swoop downward with distinct Z-depth) */}
          <path
            d="M 92,45 
               C 98,65 85,88 62,88 
               C 46,88 34,76 34,62
               C 34,54 42,45 54,45
               C 62,45 68,51 68,58
               C 68,65 62,71 54,71
               C 50,71 46,68 46,64"
            stroke="url(#greenRibbon)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
        </g>

        {/* 4. Glass Shield Glossy Arc (Creates 3D refraction glare) */}
        <path
          d="M 20,40 C 35,22 85,22 100,40 C 80,30 40,30 20,40 Z"
          fill="url(#glassReflection)"
          opacity="0.8"
        />

        {/* 5. Center Core Contact Bead (Tactical switch status node) */}
        <circle
          cx="60"
          cy="60"
          r="5.5"
          fill="url(#goldIndicator)"
          stroke="#ffffff"
          strokeWidth="1.5"
          filter="url(#neonGlow)"
          className="animate-pulse"
          style={{ animationDuration: "1.5s" }}
        />
      </svg>
    </div>
  );
};
