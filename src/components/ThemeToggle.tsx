import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { playRelayClick, playTechBeep } from "../utils/audio";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === "dark";

  const handleToggleClick = () => {
    // Elegant sound feedback matching the switch action
    if (isDark) {
      playRelayClick("open");
      playTechBeep(650, 0.04);
    } else {
      playRelayClick("close");
      playTechBeep(850, 0.04);
    }
    onToggle();
  };

  return (
    <div 
      className="fixed right-5 top-[55%] -translate-y-1/2 z-50 flex flex-col items-center gap-2 group"
      id="theme-toggle-container"
    >
      {/* Floating aerospace label */}
      <div 
        className={`pointer-events-none transform translate-x-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out absolute right-14 py-1 px-2.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap shadow-xl ${
          isDark 
            ? "bg-slate-950/90 border-slate-800 text-cyan-400" 
            : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50"
        }`}
      >
        System Theme: {theme}
      </div>

      {/* Industrial switch console */}
      <div 
        onClick={handleToggleClick}
        className={`relative w-11 h-24 rounded-full border p-1 cursor-pointer select-none transition-all duration-500 shadow-2xl flex flex-col justify-between items-center ${
          isDark 
            ? "bg-slate-950/90 border-slate-800/80 shadow-black/80" 
            : "bg-slate-100/95 border-slate-300/90 shadow-slate-300/40"
        }`}
      >
        {/* Inner track recess */}
        <div className="absolute inset-1 rounded-full pointer-events-none bg-black/20" />

        {/* Icon: Sun (Light) at the top */}
        <div className={`relative z-10 w-7 h-7 flex items-center justify-center transition-colors duration-300 ${isDark ? "text-slate-600 hover:text-slate-400" : "text-amber-500"}`}>
          <Sun size={15} className={`w-3.5 h-3.5 ${!isDark ? "animate-spin-slow" : ""}`} />
        </div>

        {/* Icon: Moon (Dark) at the bottom */}
        <div className={`relative z-10 w-7 h-7 flex items-center justify-center transition-colors duration-300 ${isDark ? "text-cyan-400" : "text-slate-400 hover:text-slate-600"}`}>
          <Moon size={14} className="w-3.5 h-3.5" />
        </div>

        {/* Advanced tactile sliding armature thumb */}
        <motion.div
          animate={{
            y: isDark ? 42 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
          }}
          className={`absolute left-[5px] top-[5px] w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-350 shadow-md ${
            isDark 
              ? "bg-slate-900 border-slate-700 shadow-black/80 text-cyan-400" 
              : "bg-gradient-to-b from-amber-400 to-amber-500 border-amber-300 text-slate-950 shadow-amber-500/30"
          }`}
        >
          {/* Subtle concentric details on the physical dial */}
          <div className={`absolute inset-0.5 rounded-full border border-dashed opacity-25 ${isDark ? "border-cyan-400 animate-spin-slow" : "border-white animate-spin-slow"}`} />
          {isDark ? <Moon size={11} className="relative z-10" /> : <Sun size={12} className="relative z-10" />}
        </motion.div>
      </div>

      {/* Decorative calibration markers next to the slider */}
      <div className="flex flex-col gap-1 items-center opacity-30 group-hover:opacity-60 transition-opacity duration-300">
        <span className="w-1.5 h-[1px] bg-cyan-500 rounded" />
        <span className="w-3.5 h-[1px] bg-cyan-500 rounded" />
        <span className="w-1.5 h-[1px] bg-cyan-500 rounded" />
      </div>
    </div>
  );
};
