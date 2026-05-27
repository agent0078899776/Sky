import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { playTechBeep, playRelayClick, getMuteState, setMuteState } from "../utils/audio";

interface SoundToggleProps {
  theme: "dark" | "light";
  isMuted: boolean;
  onToggle: (muted: boolean) => void;
  variant?: "floating" | "inline";
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ 
  theme, 
  isMuted, 
  onToggle,
  variant = "floating"
}) => {
  const isDark = theme === "dark";

  const handleToggleClick = () => {
    const nextMutedState = !isMuted;
    
    // Set state first
    onToggle(nextMutedState);
    setMuteState(nextMutedState);

    // Play click sound if we just unmuted
    if (!nextMutedState) {
      setTimeout(() => {
        playRelayClick("close");
        playTechBeep(900, 0.05);
      }, 50);
    }
  };

  const buttonElement = (
    <button 
      onClick={handleToggleClick}
      className={`relative w-11 h-11 rounded-full border cursor-pointer select-none transition-all duration-500 shadow-2xl flex items-center justify-center group/btn focus:outline-none ${
        isDark 
          ? "bg-slate-950/90 border-slate-850 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] shadow-black/85" 
          : "bg-white/95 border-slate-300/90 hover:border-amber-400/80 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] shadow-slate-300/40"
      }`}
      title={isMuted ? "Enable sound effects" : "Mute sound effects"}
    >
      {/* Decorative dynamic concentric wave on hover (if sound is active) */}
      {!isMuted && (
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping group-hover/btn:animate-ping opacity-40 pointer-events-none" />
      )}

      {/* Center icon rendering */}
      <div className={`relative z-10 transition-transform duration-300 group-hover/btn:scale-110 ${
        isMuted 
          ? "text-slate-500 hover:text-slate-400" 
          : isDark ? "text-cyan-400" : "text-amber-500"
      }`}>
        {isMuted ? (
          <VolumeX size={16} className="transition-all duration-300" />
        ) : (
          <Volume2 size={16} className="transition-all duration-300" />
        )}
      </div>

      {/* Physical calibration mark index */}
      <div className={`absolute top-0 w-1 h-1 rounded-full border transition-colors duration-300 ${
        isMuted 
          ? "bg-red-500 border-red-600/30 shadow-[0_0_5px_rgba(239,68,68,0.5)]" 
          : isDark ? "bg-emerald-400 border-emerald-500/20 shadow-[0_0_5px_rgba(52,211,153,0.5)]" : "bg-amber-400 border-amber-500/20 shadow-[0_0_5px_rgba(245,158,11,0.5)]"
      }`} style={{ transform: "translateY(-2px)" }} />
    </button>
  );

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2" id="sound-toggle-inline">
        <span className="text-xs font-mono font-medium text-slate-400 tracking-wider">
          {isMuted ? "SOUND: OFF" : "SOUND: ON"}
        </span>
        {buttonElement}
      </div>
    );
  }

  return (
    <div 
      className="hidden md:flex fixed right-5 top-[42%] -translate-y-1/2 z-50 flex-col items-center gap-2 group"
      id="sound-toggle-container"
    >
      {/* Dynamic aerospace status label */}
      <div 
        className={`pointer-events-none transform translate-x-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out absolute right-14 py-1 px-2.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap shadow-xl ${
          isDark 
            ? "bg-slate-950/90 border-slate-800 text-cyan-400" 
            : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50"
        }`}
      >
        Acoustic Feed: {isMuted ? "MUTED" : "ON"}
      </div>

      {/* Industrial Circular Switch */}
      {buttonElement}

      {/* Connection indicator */}
      <div className={`w-[1px] h-4 border-l border-dashed transition-colors duration-300 ${
        isDark ? "border-slate-800" : "border-slate-300"
      }`} />
    </div>
  );
};
