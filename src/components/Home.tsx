import React, { useState, useEffect, useRef } from "react";
import { WHY_SKY_SWITCH, APPLICATION_AREAS } from "../data";
import { ArrowRight, Star, Shield, HardDrive, Compass, Mail, Award, CheckCircle2, Zap, ShieldEllipsis, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RussianJet } from "./RussianJet";
import { FeedbackRequestForm } from "./FeedbackRequestForm";

interface HomeProps {
  onNavigateToCatalog: () => void;
  onNavigateToContact: () => void;
  contactFormSelectedModels: string[];
}

export const Home: React.FC<HomeProps> = ({
  onNavigateToCatalog,
  onNavigateToContact,
  contactFormSelectedModels,
}) => {
  // Scroll monitoring states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeScroll, setActiveScroll] = useState(false);
  const [tilt, setTilt] = useState(0);

  // States to keep track of sections entered
  const [unlockedAbout, setUnlockedAbout] = useState(false);
  const [unlockedApps, setUnlockedApps] = useState(false);
  const [unlockedContact, setUnlockedContact] = useState(false);

  // Refs for scroll elements
  const aboutRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? currentScrollY / docHeight : 0;
      setScrollProgress(progress);

      // Determine scrolling direction and speed to compute aerodynamic roll tilt
      const diff = currentScrollY - lastScrollY;
      const calculatedTilt = Math.min(Math.max(diff * 0.45, -25), 25);
      setTilt(calculatedTilt);
      setActiveScroll(true);

      lastScrollY = currentScrollY;

      // Stop accelerating thrusters after 150ms of quiet scroll status
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setActiveScroll(false);
        setTilt(0);
      }, 150);

      // Check section trigger boundary crossings (simple and highly reliable)
      const buffer = window.innerHeight * 0.7;
      if (aboutRef.current && currentScrollY + buffer > aboutRef.current.offsetTop) {
        setUnlockedAbout(true);
      }
      if (appsRef.current && currentScrollY + buffer > appsRef.current.offsetTop) {
        setUnlockedApps(true);
      }
      if (contactRef.current && currentScrollY + buffer > contactRef.current.offsetTop) {
        setUnlockedContact(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once to set initial values
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="relative space-y-24 pb-16">

      {/* =========================================================
          SECTION 0: THE CYBERNETIC HERO AREA
          ========================================================= */}
      <div id="hero-section" className="relative rounded-3xl overflow-hidden min-h-[520px] sm:min-h-[640px] flex items-center bg-[#0a0f1d] border border-slate-800 shadow-2xl">
        {/* Background blueprint elements */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-2c1b8d2c9c3d"
            alt="Aerospace defense manufacturing cleanroom grid"
            className="w-full h-full object-cover object-center opacity-15 filter grayscale"
          />
          {/* Blueprint schematic grid mask overlay */}
          <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#060a14] via-[#0a0f1d]/90 to-transparent" />
        </div>

        {/* Content Column */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-20 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-semibold text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20 shadow-inner">
              <Shield size={12} className="text-cyan-400" /> MIL-STD Hermetically Sealed Relays
            </span>
            <h1 className="text-4xl sm:text-6.5xl font-extrabold font-display tracking-tight text-white leading-[1.05]">
              Fail-Safe Sealing <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                For Tactical Control & Heavy Load
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
              Supplying ultimate high-reliability hermetic electromagnetic, solid state, and RF coaxial switching systems for high-G aviation telemetry, extreme seismic rail controls, and marine defense.
            </p>
          </motion.div>

          {/* Quick CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={onNavigateToCatalog}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              Explore Component Matrix <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("quotation-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#16223f] hover:bg-[#1a2b52] text-white font-semibold rounded-xl border border-slate-700/60 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Mail size={16} className="text-cyan-400" /> Request Custom Quotation
            </button>
          </motion.div>

          {/* Real specs stat ticker */}
          <div className="pt-10 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto backdrop-blur-sm bg-slate-950/20 rounded-2xl p-4">
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-extrabold font-display text-white">MIL-STD-202</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-1">Class Certified</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-lg sm:text-2xl font-extrabold font-display text-white">&lt;0.5ms</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-1">Bounce Timing</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-lg sm:text-2xl font-extrabold font-display text-white">600A</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-1">Max Power Conduction</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-lg sm:text-2xl font-extrabold font-display text-white">100%</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-1">Vacuum Laser Audited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tactical Avionics Telemetry Sidebar (Fixed on the left as shown in the screenshot) */}
      <div className="hidden md:flex fixed left-5 lg:left-[5%] xl:left-[8%] top-[28%] flex-col items-center gap-4 z-20 pointer-events-none select-none w-44">
        <div className="relative w-full flex flex-col items-center gap-4">
          {/* Tactical trajectory guide dashed line */}
          <div className="absolute top-[-500px] bottom-[-500px] w-[2px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/35 to-cyan-500/0 dash-line z-0" />

          {/* Dynamic Glowing Combat Radar Target indicator */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Su-57 Vector Jet representation */}
            <RussianJet rotation={tilt} activeScroll={activeScroll} />

            {/* Wingtip vortex vapors */}
            <div 
              className={`absolute left-[-15px] top-6 w-[2px] bg-gradient-to-t from-cyan-400/40 to-cyan-400/0 transition-all duration-300 ${
                activeScroll ? "h-40 opacity-100" : "h-12 opacity-30"
              }`} 
            />
            <div 
              className={`absolute right-[-14px] top-6 w-[2px] bg-gradient-to-t from-cyan-400/40 to-cyan-400/0 transition-all duration-300 ${
                activeScroll ? "h-40 opacity-100" : "h-12 opacity-30"
              }`} 
            />
          </div>

          {/* Tactical Avionics Pilot HUD Card */}
          <div 
            className="bg-[#0b0f1d]/90 border border-cyan-500/30 rounded-xl p-3 font-mono text-[10px] text-cyan-400 space-y-1.5 backdrop-blur-md shadow-xl w-36 z-10 transition-all duration-300 pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1">
              <span className="font-extrabold tracking-wider flex items-center gap-1">
                <Navigation size={8} className="animate-pulse" /> TELEMETRY
              </span>
              <span className="text-[8px] bg-cyan-950 px-1 py-0.5 rounded text-cyan-300 shrink-0">
                {activeScroll ? "ACTIVE" : "CRUISE"}
              </span>
            </div>
            <div className="space-y-0.5 text-slate-300">
              <p className="flex justify-between">
                <span>MODEL:</span> 
                <span className="text-cyan-400 font-bold">SU-57 FELON</span>
              </p>
              <p className="flex justify-between">
                <span>ALTITUDE:</span> 
                <span className="text-white font-semibold">{(3500 + scrollProgress * 6500).toFixed(0)}m</span>
              </p>
              <p className="flex justify-between">
                <span>THRUST:</span> 
                <span className={activeScroll ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  {activeScroll ? "MACH 1.85" : "MACH 0.85"}
                </span>
              </p>
              <p className="flex justify-between">
                <span>PROGRESS:</span> 
                <span className="text-cyan-400 font-bold">{Math.round(scrollProgress * 100)}%</span>
              </p>
            </div>
            <div className="border-t border-cyan-500/10 pt-1 text-[8px] text-slate-400 font-bold">
              <span className="text-amber-400 font-bold">LOC SEC:</span>{" "}
              {scrollProgress < 0.22 
                ? "HERMETIC_HER" 
                : scrollProgress < 0.52 
                ? "ENV_SEAL_QA" 
                : scrollProgress < 0.85 
                ? "MISSION_DEP" 
                : "QUOTE_SYSTEM"
              }
            </div>
          </div>
        </div>
      </div>

      {/* Centered Content Columns */}
      <div className="max-w-4xl mx-auto w-full px-4 space-y-24">

          {/* =========================================================
              SECTION 1: OUR AEROSPACE HERITAGE / ABOUT US (REVEALING EFFECT)
              ========================================================= */}
          <div 
            id="about-section" 
            ref={aboutRef}
            className={`relative transition-all duration-1000 ease-out w-full max-w-full ${
              unlockedAbout ? "opacity-100 translate-y-0" : "opacity-30 translate-y-12"
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#0d1527] border border-slate-800/90 p-8 sm:p-12 shadow-2xl">
              {/* Abstract glowing scanner beam effect simulating target acquire */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
              
              {/* Interactive Radar Vector Sweep graphic when unlocked */}
              <AnimatePresence>
                {unlockedAbout && (
                  <motion.div 
                    initial={{ top: "0%", opacity: 0.5 }}
                    animate={{ top: "100%", opacity: 0 }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_#06b6d4] pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="max-w-4xl space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono tracking-widest text-sm uppercase font-bold">
                  <span>TARGET ACQUIRED: ABOUT PROFILE</span>
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Sealed Switching Physics Designed for Severe Climates
                </h2>
                <p className="text-slate-300 text-sm sm:text-lg leading-relaxed">
                  SkySwitch standing at the leading edge of precision seal science. We specialize in the complete R&D, design layout drafting, laser welding, and dynamic physical qualification of aerospace electromagnetic components. Our products strictly comply with premium aviation limits to guarantee continuous operations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {/* Mission */}
                <div className="bg-[#111c34]/40 border border-slate-800 rounded-xl p-6 hover:bg-[#111c34]/70 transition-all duration-300">
                  <div className="inline-flex p-3 bg-cyan-500/10 text-cyan-400 rounded-lg mb-4">
                    <Compass size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mb-2">Our Avionics Mission</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    To equip aviation, defense arrays, space vehicles, and automated railways with hermetically shielded power controllers and micro-MOS solid state switches that prevent any atmospheric arcing or structural bounce failure under stressful G-shocks.
                  </p>
                </div>

                {/* Vision */}
                <div className="bg-[#111c34]/40 border border-slate-800 rounded-xl p-6 hover:bg-[#111c34]/70 transition-all duration-300">
                  <div className="inline-flex p-3 bg-cyan-500/10 text-cyan-400 rounded-lg mb-4">
                    <Award size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mb-2">Our Vision Parameters</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Fulfilling zero-dropout, high-voltage switching via ongoing upgrades in ceramic metallization, infrared telemetry analysis, vacuum purification, and ultimate hermetic quality auditing at our professional state laboratories.
                  </p>
                </div>
              </div>

              {/* Environmental Laboratories specs */}
              <div className="border-t border-slate-800/80 mt-12 pt-10 space-y-6">
                <h3 className="text-xl font-bold font-display text-white text-center">Quality Assurance Laboratories</h3>
                <p className="text-slate-400 text-xs sm:text-sm text-center max-w-2xl mx-auto leading-relaxed">
                  We manage rigorous climate and physical evaluation protocols internally. Each production batch undergoes complete examinations replicating deep outer space vacuum, severe chemical corrosion, and seismic tremors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2 text-center sm:text-left">
                    <CheckCircle2 className="text-green-400 mx-auto sm:mx-0" size={20} />
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono">MIL-STD-202 GUIDED</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Compliance with the gold standard for solid electronic testing.
                    </p>
                  </div>
                  
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2 text-center sm:text-left">
                    <Zap className="text-amber-400 mx-auto sm:mx-0" size={20} />
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono">10,000V VACUUM ISO</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Complete atmospheric exhaustion preventing high-frequency interference.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2 text-center sm:text-left">
                    <ShieldEllipsis className="text-blue-400 mx-auto sm:mx-0" size={20} />
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono">LASER SEAL INSPECTED</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Full automatic laser leak measurements on 100% of manufactured lots.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION 2: MISSION-CRITICAL APPLICATIONS (REVEALING EFFECT)
              ========================================================= */}
          <div 
            id="applications-section" 
            ref={appsRef}
            className={`relative transition-all duration-1000 ease-out w-full max-w-full ${
              unlockedApps ? "opacity-100 translate-y-0" : "opacity-30 translate-y-12"
            }`}
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0d1527] to-[#0a0f1d] border border-slate-800/95 p-8 sm:p-12 shadow-inner">
              
              {/* Scanning radar line */}
              <AnimatePresence>
                {unlockedApps && (
                  <motion.div 
                    initial={{ top: "0%", opacity: 0.5 }}
                    animate={{ top: "100%", opacity: 0 }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_#06b6d4] pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" /> GLOBAL DEPLOYMENTS
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Standard Application Environments
                </h2>
                <p className="text-slate-400 text-xs sm:text-base">
                  Engineered to endure severe climates, shock profiles, and radio-frequency barriers without dropping loops.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                {APPLICATION_AREAS.map((area, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-[#111c34]/30 border border-slate-800 rounded-2xl p-5 hover:bg-[#111c34]/70 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-md overflow-hidden hover:border-cyan-500/20"
                  >
                    {/* Visual number designators */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-blue-500/10 text-cyan-400 text-xs font-mono font-bold rounded">
                          0{idx + 1}
                        </span>
                        <h4 className="text-white text-base sm:text-lg font-bold font-display">{area.title}</h4>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{area.description}</p>
                    </div>
                    
                    {/* Physical component photo display */}
                    <div className="relative h-32 rounded-xl overflow-hidden border border-slate-800">
                      <img
                        src={area.image}
                        alt={area.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter brightness-[0.6] group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION 3: QUOTE SYSTEM REQUEST DESK (REVEALING EFFECT)
              ========================================================= */}
          <div 
            id="quotation-section" 
            ref={contactRef}
            className={`relative transition-all duration-1000 ease-out w-full max-w-full ${
              unlockedContact ? "opacity-100 translate-y-0" : "opacity-30 translate-y-12"
            }`}
          >
            <div className="relative rounded-3xl overflow-hidden bg-[#0d1527] border border-slate-800/90 shadow-2xl p-1">
              {/* Static warning bar */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-cyan-900/20 to-transparent px-6 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <span className="h-2 w-2 bg-green-500 rounded-full inline-block animate-pulse" /> QUOTE SYSTEM LIVE
                </span>
                <span className="opacity-60 hidden sm:inline">SECURE TRANS_FEED DESK — FORMSPREE ACTIVE</span>
              </div>

              <div className="p-4 sm:p-8 bg-slate-950/40">
                {/* Directly Render the Technical specs & quotations form */}
                <FeedbackRequestForm initialSelectedModels={contactFormSelectedModels} />
              </div>
            </div>
          </div>

      </div>

    </div>
  );
};
