import React from "react";
import { WHY_SKY_SWITCH, APPLICATION_AREAS } from "../data";
import { ArrowRight, Star, Shield, HardDrive, Compass, Mail } from "lucide-react";
import { motion } from "motion/react";

interface HomeProps {
  onNavigateToCatalog: () => void;
  onNavigateToContact: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToCatalog, onNavigateToContact }) => {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center bg-[#0a0f1d] border border-slate-800 shadow-2xl">
        {/* Background Image with elegant overlay gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-2c1b8d2c9c3d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80"
            alt="Aerospace electronics assembly background"
            className="w-full h-full object-cover object-center opacity-25 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#060a14] via-[#0a0f1d]/90 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-16 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
              <Shield size={12} className="text-cyan-400" /> Hermetically Sealed Assemblies
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-white leading-[1.1]">
              High-Reliability <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Sealed Relays & Contactors
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
              Engineering extreme environmental switching systems for critical aviation, aerospace telemetry, railway signalling, and defense applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={onNavigateToCatalog}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm"
            >
              Explore Full Catalog <ArrowRight size={16} />
            </button>
            <button
              onClick={onNavigateToContact}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#16223f] hover:bg-[#1a2b52] text-white font-semibold rounded-xl border border-slate-700/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm"
            >
              <Mail size={16} className="text-cyan-400" /> Request Custom Offer
            </button>
          </motion.div>

          {/* Quick Stats list */}
          <div className="pt-8 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-extrabold font-display text-white">MIL-STD</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono mt-0.5">Specifications Certified</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-xl sm:text-3xl font-extrabold font-display text-white">&lt;0.5ms</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono mt-0.5">Bounce Timing</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-xl sm:text-3xl font-extrabold font-display text-white">600A</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono mt-0.5">Peak Conduction load</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-xl sm:text-3xl font-extrabold font-display text-white">100%</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono mt-0.5">Hermetic Quality Tested</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest font-mono">
            Professional Engineering
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Sealing Technology Designed for Extreme Operating Conditions
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            SkySwitch Technologies specializes in the active development and local manufacture of highly reliable sealed relays and contactors. Our products strictly comply with military and aerospace parameters, serving failure-proof loops internationally.
          </p>

          <div className="space-y-4 pt-2">
            {WHY_SKY_SWITCH.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-[#0d1527] border border-slate-800/80 rounded-xl">
                <div className="bg-blue-600/10 p-2.5 h-10 w-10 text-cyan-400 rounded-lg flex items-center justify-center shrink-0">
                  {idx === 0 ? <Shield size={18} /> : idx === 1 ? <Star size={18} /> : <HardDrive size={18} />}
                </div>
                <div>
                  <h4 className="text-white text-base font-bold font-display">{item.title}</h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery grid of images */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1581092160607-2c1b8d2c9c3d"
                alt="Production facility"
                className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex items-end">
                <p className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Clean-Room Assembly</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[1/1] group border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Product testing"
                className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex items-end">
                <p className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Parametric Evaluation</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="relative rounded-2xl overflow-hidden aspect-[1/1] group border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1563770660941-20978e870e26"
                alt="Aviation assembly"
                className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex items-end">
                <p className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Military Calibration</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1544256718-3bcf237f3974"
                alt="Research and design"
                className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex items-end">
                <p className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Engineering R&D</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications list section */}
      <div id="applications" className="space-y-8 bg-gradient-to-b from-[#0d1527] to-[#0a0f1d] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-inner">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-sm font-bold text-cyan-400 lg:text-base uppercase tracking-widest font-mono">Mission Critical Deployments</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">Standard Application Categories</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Proven performance on demanding landscapes, preserving signal switching integrity without dropouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {APPLICATION_AREAS.map((area, idx) => (
            <div
              key={idx}
              className="bg-[#16223f]/40 border border-slate-800 rounded-2xl p-5 hover:bg-[#16223f]/80 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-cyan-400 text-sm font-mono font-bold rounded">0{idx + 1}</span>
                  <h4 className="text-white text-lg font-bold font-display">{area.title}</h4>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{area.description}</p>
              </div>
              <div className="relative h-32 rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={area.image}
                  alt={area.title}
                  className="w-full h-full object-cover filter brightness-[0.7]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
