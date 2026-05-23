import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface SkySwitchLogoProps {
  size?: number;
  interactive?: boolean;
}

export const SkySwitchLogo: React.FC<SkySwitchLogoProps> = ({ 
  size = 40, 
  interactive = true 
}) => {
  // 3D Tilt variables
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for 3D rotation feel
  const springConfig = { damping: 18, stiffness: 160, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Compute normalized coordinates from -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    if (interactive) setHovered(true);
  };

  const logoContent = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="filter drop-shadow-[0_4px_16px_rgba(56,189,248,0.3)]"
    >
      <defs>
        {/* SkySwitch Royal Sky Blue metallic chrome gradient */}
        <linearGradient id="skySwitchCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" /> {/* Sky 300 */}
          <stop offset="45%" stopColor="#38bdf8" /> {/* Sky 400 (Exact core color in image) */}
          <stop offset="80%" stopColor="#0284c7" /> {/* Sky 600 */}
          <stop offset="100%" stopColor="#0c4a6e" /> {/* Sky 900 */}
        </linearGradient>

        {/* Outer concentric neon glow gradient */}
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </linearGradient>

        {/* Glossy overlay for physical 3D glass dome look */}
        <radialGradient id="glassSphereGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
        </radialGradient>

        {/* Underlying active plate glow */}
        <radialGradient id="cyberPlateSphere" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Dropshadow filter to simulate physical depth profile */}
        <filter id="traceDepthShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1.5" dy="3.5" stdDeviation="2" floodColor="#020617" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* 3D Ambient shadow sphere */}
      <circle cx="100" cy="103" r="92" fill="#020617" opacity="0.5" />
      <circle cx="100" cy="100" r="92" fill="url(#cyberPlateSphere)" />

      {/* Glass Base platter */}
      <circle cx="100" cy="100" r="90" fill="#060b18" stroke="url(#skySwitchCyanGrad)" strokeWidth="1" />

      {/* --- RECREATED ORIGINAL GEOMETRY DESIGN (100% FAITHFUL TO THE LOGO VECTOR SEEN IN THE IMAGE) --- */}
      
      {/* --- GEOMETRIC INTENSITY CONCENTRIC RADAR RINGS (ELEGANT ROTATIONAL MOTIONS) --- */}
      
      {/* 1. Outer Concentric Bezel Ring - slowly rotating clockwise */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 36, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "100px 100px" }}
      >
        <circle 
          cx="100" 
          cy="100" 
          r="86" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="1.2" 
          strokeOpacity="0.4" 
        />
        <circle 
          cx="100" 
          cy="100" 
          r="86" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="2.8" 
          strokeOpacity="0.7" 
          strokeDasharray="14 100 30 70"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="86" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="3.5" 
          strokeOpacity="0.95" 
          strokeDasharray="4 176"
        />
      </motion.g>

      {/* 2. Inner Concentric Ring - slowly rotating counter-clockwise */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 48, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "100px 100px" }}
      >
        <circle 
          cx="100" 
          cy="100" 
          r="75" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="1" 
          strokeOpacity="0.3" 
        />
        <circle 
          cx="100" 
          cy="100" 
          r="75" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="1.8" 
          strokeOpacity="0.65" 
          strokeDasharray="20 40 40 50"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="75" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="2.5" 
          strokeOpacity="0.8" 
          strokeDasharray="2 58"
        />
      </motion.g>

      {/* 3. Center Interlocking Circuit "S" Traces (Exact mathematical vector reproduction of https://imgur.com/5jlSX4v) */}
      <g filter="url(#traceDepthShadow)">
        {/* Core Underlying Paths (Perfect Original Base Vectors (Mirrored horizontally for correct S orientation)) */}
        
        {/* Upper S-Curve Ribbon */}
        <path
          id="upper-s-base"
          d="M 122,44 H 88 A 22,22 0 0,0 66,66 V 92 A 22,22 0 0,0 88,114 H 116 A 22,22 0 0,1 138,136 A 22,22 0 0,1 116,158 H 82"
          stroke="url(#skySwitchCyanGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.85"
        />

        {/* Lower S-Curve Ribbon (Perfect rotated twin, mirrored) */}
        <path
          id="lower-s-base"
          d="M 78,156 H 112 A 22,22 0 0,0 134,134 V 108 A 22,22 0 0,0 112,86 H 84 A 22,22 0 0,1 62,64 A 22,22 0 0,1 84,42 H 118"
          stroke="url(#skySwitchCyanGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.85"
        />

        {/* Horizontal left stem (mirrored from y=134 right side to y=66 left side) */}
        <path
          id="left-stem-base"
          d="M 79,66 H 42"
          stroke="url(#skySwitchCyanGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Horizontal right stem (mirrored from y=66 left side to y=134 right side) */}
        <path
          id="right-stem-base"
          d="M 121,134 H 158"
          stroke="url(#skySwitchCyanGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Hollow Circle contact pads with breathing intensity */}
        <motion.circle 
          cx="100" 
          cy="66" 
          r="11" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="5" 
          fill="none" 
          animate={{
            strokeWidth: [5, 6, 5],
            opacity: [0.85, 1, 0.85]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle 
          cx="100" 
          cy="134" 
          r="11" 
          stroke="url(#skySwitchCyanGrad)" 
          strokeWidth="5" 
          fill="none" 
          animate={{
            strokeWidth: [5, 6, 5],
            opacity: [0.85, 1, 0.85]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1
          }}
        />

        {/* Hologram core inner pins */}
        <circle cx="100" cy="66" r="3.2" fill="#38bdf8" opacity="0.9" />
        <circle cx="100" cy="134" r="3.2" fill="#38bdf8" opacity="0.9" />

        {/* --- DYNAMIC GLOWING MOTION CURRENT FLOWS (LASER ELECTRON STREAMS) --- */}
        
        {/* Upper S-Curve Current Pulse (mirrored) */}
        <motion.path
          d="M 122,44 H 88 A 22,22 0 0,0 66,66 V 92 A 22,22 0 0,0 88,114 H 116 A 22,22 0 0,1 138,136 A 22,22 0 0,1 116,158 H 82"
          stroke="#38bdf8"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ strokeDasharray: "40 220", strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -260 }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ filter: "drop-shadow(0 0 4px #38bdf8)", mixBlendMode: "screen" }}
        />

        {/* Lower S-Curve Current Pulse (mirrored) */}
        <motion.path
          d="M 78,156 H 112 A 22,22 0 0,0 134,134 V 108 A 22,22 0 0,0 112,86 H 84 A 22,22 0 0,1 62,64 A 22,22 0 0,1 84,42 H 118"
          stroke="#38bdf8"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ strokeDasharray: "40 220", strokeDashoffset: 130 }}
          animate={{ strokeDashoffset: -130 }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ filter: "drop-shadow(0 0 4px #38bdf8)", mixBlendMode: "screen" }}
        />

        {/* Left Stem Current Pulse (mirrored, y=66) */}
        <motion.path
          d="M 79,66 H 42"
          stroke="#38bdf8"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDasharray: "12 25", strokeDashoffset: -12 }}
          animate={{ strokeDashoffset: -49 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ filter: "drop-shadow(0 0 3px #38bdf8)", mixBlendMode: "screen" }}
        />

        {/* Right Stem Current Pulse (mirrored, y=134) */}
        <motion.path
          d="M 121,134 H 158"
          stroke="#38bdf8"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDasharray: "12 25", strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 37 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ filter: "drop-shadow(0 0 3px #38bdf8)", mixBlendMode: "screen" }}
        />
      </g>

      {/* --- PREMIUM 3D HIGHLIGHTS & MIRROR REFLECTION --- */}
      {/* Volumetric gloss capsule overlay */}
      <circle cx="100" cy="100" r="86" fill="url(#glassSphereGrad)" pointerEvents="none" />

      {/* 3D dynamic specular accent reflecting off the round bezel */}
      <path
        d="M 22,55 C 38,30 80,24 115,26"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.25"
        pointerEvents="none"
      />
    </svg>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center animate-fade-in"
      style={{ 
        width: size, 
        height: size,
        perspective: 1000
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
        }}
        animate={{
          scale: hovered ? 1.05 : 1,
          y: hovered ? -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-full h-full relative"
      >
        {/* Dynamic back-glow matching the tilt angle */}
        {hovered && (
          <motion.div 
            className="absolute -inset-2 rounded-full bg-sky-500/20 blur-md pointer-events-none z-0"
            style={{
              x: useTransform(x, [-0.5, 0.5], [-8, 8]),
              y: useTransform(y, [-0.5, 0.5], [-8, 8]),
            }}
          />
        )}
        
        {/* True Vector Graphics Markup */}
        <div className="relative z-10 w-full h-full">
          {logoContent}
        </div>
      </motion.div>
    </div>
  );
};
