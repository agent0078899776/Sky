import React, { useState, useMemo } from "react";
import { CATALOG_CATEGORIES } from "../data";
import { ProductRec } from "../types";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Settings, 
  Zap, 
  HelpCircle, 
  CornerDownRight, 
  Eye, 
  Shuffle, 
  RefreshCw,
  Search,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playTechBeep, playRelayClick } from "../utils/audio";

interface SmartWizardProps {
  onSelectProduct: (product: ProductRec) => void;
  comparedModels: Record<string, boolean>;
  onToggleCompare: (modelId: string) => void;
  onCloseWizard?: () => void;
}

export const SmartWizard: React.FC<SmartWizardProps> = ({
  onSelectProduct,
  comparedModels,
  onToggleCompare,
  onCloseWizard,
}) => {
  const [step, setStep] = useState(1);
  
  // Selection States
  const [category, setCategory] = useState<string>("all");
  const [contactForm, setContactForm] = useState<string>("all");
  const [currentLoad, setCurrentLoad] = useState<string>("all");
  const [tempRange, setTempRange] = useState<string>("all");

  const stepsList = [
    { id: 1, name: "Classification", desc: "Product Line Type", icon: Layers },
    { id: 2, name: "Contact Poles", desc: "Internal Terminal Set", icon: Settings },
    { id: 3, name: "Load Current", desc: "Rating Capacity", icon: Zap },
    { id: 4, name: "Environment", desc: "Thermal Tolerance", icon: Thermometer },
    { id: 5, name: "Matches", desc: "Optimized Products", icon: ShieldCheck },
  ];

  // Helper to resolve base paths correctly for image tags
  const resolveImagePath = (src: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
      return src; 
    }
    const base = (import.meta as any).env?.BASE_URL || "/Sky/";
    const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    return `${cleanBase}${cleanSrc}`;
  };

  // Live filter generator
  const filteredProducts = useMemo(() => {
    const list: ProductRec[] = [];
    CATALOG_CATEGORIES.forEach(cat => {
      // Step 1: Filter on category
      if (category !== "all" && cat.id !== category) {
        return;
      }

      cat.products.forEach(p => {
        // Step 2: Contact poles/configuration filter
        if (contactForm !== "all") {
          const formText = (p.contactForm || p.outputGroups || "").toLowerCase();
          if (contactForm === "1pdt") {
            if (!formText.includes("1") && !formText.includes("spst") && !formText.includes("1pd") && !formText.includes("single channel")) return;
          } else if (contactForm === "2pdt") {
            if (!formText.includes("2") && !formText.includes("dpdt") && !formText.includes("2pd") && !formText.includes("dual channel") && !formText.includes("two channel")) return;
          } else if (contactForm === "4pdt") {
            if (!formText.includes("4") && !formText.includes("4pdt") && !formText.includes("4pd")) return;
          }
        }

        // Step 3: Current load threshold detection
        if (currentLoad !== "all") {
          const loadText = (p.contactLoad || p.outputCurrent || "").toLowerCase();
          const currentMatch = loadText.match(/(\d+(?:\.\d+)?)\s*a/);
          let val = 1.0;
          if (currentMatch) {
            val = parseFloat(currentMatch[1]);
          } else {
            const outCurrentMatch = (p.outputCurrent || "").match(/(\d+(?:\.\d+)?)\s*(?:a|ma)/i);
            if (outCurrentMatch) {
              val = parseFloat(outCurrentMatch[1]);
              if ((p.outputCurrent || "").toLowerCase().includes("ma")) val /= 1000;
            }
          }

          if (currentLoad === "low") {
            if (val > 1.5) return;
          } else if (currentLoad === "medium") {
            if (val <= 1.5 || val > 5) return;
          } else if (currentLoad === "high") {
            if (val <= 5) return;
          }
        }

        // Step 4: Temperature extremes range filter
        if (tempRange !== "all") {
          const tempText = (p.tempRange || "").toLowerCase();
          const isWide = tempText.includes("-65") || tempText.includes("125") || tempText.includes("150");
          if (tempRange === "wide") {
            if (!isWide) return;
          } else if (tempRange === "standard") {
            if (isWide) return;
          }
        }

        list.push(p);
      });
    });
    return list;
  }, [category, contactForm, currentLoad, tempRange]);

  const handleOptionClick = (type: string, value: string) => {
    playTechBeep(650, 0.04);
    if (type === "category") setCategory(value);
    if (type === "contactForm") setContactForm(value);
    if (type === "currentLoad") setCurrentLoad(value);
    if (type === "tempRange") setTempRange(value);
  };

  const handleNextStep = () => {
    playRelayClick("close");
    if (step < 5) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    playRelayClick("open");
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const resetWizard = () => {
    playRelayClick("open");
    setCategory("all");
    setContactForm("all");
    setCurrentLoad("all");
    setTempRange("all");
    setStep(1);
  };

  return (
    <div className="bg-[#0b1021] border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-850 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/35 rounded-full text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
              <Sparkles size={11} className="animate-pulse" /> Smart Interactive Assistant
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            Smart Parametric Wizard
          </h3>
          <p className="text-xs text-slate-400">
            Interactive diagnostic selection flow matching military-grade specs to your schema parameters.
          </p>
        </div>

        <button
          onClick={resetWizard}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-lg text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-all cursor-pointer font-mono"
        >
          <RefreshCw size={12} /> RESET PARAMS
        </button>
      </div>

      {/* Steps Indicator Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-4 mb-7 relative z-10 w-full overflow-hidden">
        {stepsList.map((s, idx) => {
          const StepIcon = s.icon;
          const isActive = step === s.id;
          const isCompleted = step > s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                if (s.id <= step || isCompleted) {
                  playTechBeep(500 + s.id * 50, 0.03);
                  setStep(s.id);
                }
              }}
              disabled={s.id > step && !isCompleted}
              className={`flex flex-col items-center text-center p-2 rounded-xl transition-all border ${
                isActive 
                  ? "bg-slate-900/90 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-cyan-400" 
                  : isCompleted 
                    ? "bg-slate-950/40 border-slate-800/80 text-slate-500 hover:text-slate-300"
                    : "bg-slate-950/25 border-transparent text-slate-700"
              }`}
            >
              <div className={`p-1.5 rounded-lg flex items-center justify-center mb-1.5 ${
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400" 
                  : isCompleted 
                    ? "bg-cyan-950/10 text-cyan-600" 
                    : "bg-slate-900/60 text-slate-700"
              }`}>
                {isCompleted ? <Check size={14} className="stroke-[3]" /> : <StepIcon size={14} />}
              </div>
              <span className="text-[10px] sm:text-xs font-bold leading-none hidden sm:block">Step {s.id}</span>
              <span className="text-[9px] text-slate-500 hidden md:block mt-0.5 whitespace-nowrap">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main interactive area with transition animations */}
      <div className="bg-[#0b1226]/80 p-5 rounded-2xl border border-slate-850/80 min-h-[290px] flex flex-col justify-between relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col justify-center"
          >
            {/* STEP 1: Classification */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-widest">
                    STEP 01 // Select Core Classification
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Choose the electromagnetic insulation type or active switching solid-state family ideal for your schema.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-h-[350px] overflow-y-auto pr-1">
                  {[
                    { id: "all", title: "Comprehensive Lineup", desc: "No specific category filter. Search across all electromagnetic and semiconductor lines." },
                    { id: "sealed_electromagnetic", title: "Sealed Electromagnetic Relays", desc: "Hermetic high-reliability relays for aviation, spaceflight platforms & military environments." },
                    { id: "sealed_magnetic_holding", title: "Sealed Magnetic Holding Relays", desc: "Zero standby consumption. Magnetic hold state stays secure without excitation active." },
                    { id: "radio_frequency", title: "Radio Frequency Relays", desc: "RF coaxial switches designed for high-frequency signal integrity and minimal isolation coupling loss." },
                    { id: "contactors", title: "Heavy Duty Contactors", desc: "High-power and heavy-current switching contactors for extreme mechanical power routing." },
                    { id: "solid_state", title: "Solid State Relays", desc: "Traditional semiconductor isolated switches with high-speed bounce-free execution." },
                    { id: "metal_solid_state", title: "Metal Encapsulated SSRs", desc: "Heavy industrial/aerospace grade metallic-cased heat-sinkable solid state relays." },
                    { id: "plastic_photorelay", title: "Plastic PhotoMOS Relays", desc: "Miniature semiconductor PhotoMOS optorelays in DIP/SMD plastic housings." },
                    { id: "time_relays", title: "Precision Time Relays", desc: "Hermetically sealed military delay timers with high-accuracy calibration." },
                    { id: "sealed_optocouplers", title: "Sealed Optocouplers", desc: "Ceramic multi-channel high isolation optoelectronic signal isolators." }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick("category", opt.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        category === opt.id 
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-[inset_0_0_12px_rgba(6,182,212,0.06)]"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          category === opt.id ? "border-cyan-400 bg-cyan-500/20" : "border-slate-600 bg-slate-950"
                        }`}>
                          {category === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        </div>
                        <span className="font-bold font-sans text-sm">{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal pl-5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Pole Count & Structure */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-widest">
                    STEP 02 // Contact Pole Configuration
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Determine structural contact groups or total isolated output groups needed on the relay receiver.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    { id: "all", title: "Any Contact Groups", desc: "Allow any configuration matching our products catalogue metrics." },
                    { id: "1pdt", title: "1 Group / 1PDT / SPST", desc: "A single set of isolated contacts (1 Switch pole, single/double throw)." },
                    { id: "2pdt", title: "2 Groups / 2PDT / DPDT", desc: "Double pole sets. Handles two independent lines in parallel." },
                    { id: "4pdt", title: "4 Groups / 4PDT / 4PDT", desc: "Four fully isolated contact poles. Heavy multicircuit terminal relays." }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick("contactForm", opt.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        contactForm === opt.id 
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-[inset_0_0_12px_rgba(6,182,212,0.06)]"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          contactForm === opt.id ? "border-cyan-400 bg-cyan-500/20" : "border-slate-600 bg-slate-950"
                        }`}>
                          {contactForm === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        </div>
                        <span className="font-bold font-sans text-sm">{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal pl-5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Load Rating Threshold */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-widest">
                    STEP 03 // Continuous Target Load Current
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Specify the peak current flow capacity your circuits force through the relay nodes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    { id: "all", title: "Any Electrical Load Capacity", desc: "Pass models regardless of output current rating bounds." },
                    { id: "low", title: "Low Current / Signal Level (<= 1.5A)", desc: "Optimized for dry-circuit or lightweight signal paths. Precision control." },
                    { id: "medium", title: "Medium Rating (1.6A ~ 5A)", desc: "General-purpose power lines, mid-range industrial control loads." },
                    { id: "high", title: "High Power Capacity (> 5A)", desc: "Heavy mechanical actuators, massive current solenoids up to 25A maximum load capacity." }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick("currentLoad", opt.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        currentLoad === opt.id 
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-[inset_0_0_12px_rgba(6,182,212,0.06)]"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          currentLoad === opt.id ? "border-cyan-400 bg-cyan-500/20" : "border-slate-600 bg-slate-950"
                        }`}>
                          {currentLoad === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        </div>
                        <span className="font-bold font-sans text-sm">{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal pl-5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Extreme Temp class */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-widest">
                    STEP 04 // Environment Temp Extremes
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Select the required thermal rating class suited for the physical environment of deployment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    { id: "all", title: "Any Temperature Bounds", desc: "Accepts any temperature range standard or heavy high-reliability model." },
                    { id: "wide", title: "Wide Military Standard (-65°C to +125°C)", desc: "True extreme durability military-grade tolerances. Suited for cryogenic or extreme spaceflight vacuum." },
                    { id: "standard", title: "Standard Operational Temp (-55°C to +85°C)", desc: "Extended industrial or ground combat systems. Fully optimized for high endurance." }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick("tempRange", opt.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        tempRange === opt.id 
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-[inset_0_0_12px_rgba(6,182,212,0.06)]"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          tempRange === opt.id ? "border-cyan-400 bg-cyan-500/20" : "border-slate-600 bg-slate-950"
                        }`}>
                          {tempRange === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        </div>
                        <span className="font-bold font-sans text-sm">{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal pl-5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Matches results panel */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pointer-events-none">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> Parametric Recommendations
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Matched {filteredProducts.length} high-density military components matching your custom inputs safely.
                    </p>
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto pr-1 border border-slate-850 bg-slate-950/40 rounded-xl divide-y divide-slate-850 divide-dashed select-text">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-10">
                      <HelpCircle size={32} className="mx-auto text-slate-600 mb-2" />
                      <p className="text-slate-300 font-semibold text-xs">No matching components found for this combination</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">
                        Please click components or clear parameters above to expand parameters tolerance.
                      </p>
                    </div>
                  ) : (
                    filteredProducts.map((p) => {
                      const isCompared = comparedModels[p.model] || false;
                      return (
                        <div key={p.model} className="p-3 hover:bg-slate-900/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-extrabold text-cyan-400">{p.model}</span>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {p.contactForm || p.outputGroups || "Multiple Output"}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] md:text-xs text-slate-400">
                              <p className="truncate"><strong className="text-slate-500 font-normal">Package:</strong> {p.packageStyle || p.dimensions}</p>
                              <p className="truncate"><strong className="text-slate-500 font-normal">Cross-Ref:</strong> {p.benchmarking ||"—"}</p>
                              <p className="truncate"><strong className="text-slate-500 font-normal">Load:</strong> {p.contactLoad || p.outputCurrent || "Signal"}</p>
                              <p className="truncate"><strong className="text-slate-500 font-normal">Temp:</strong> {p.tempRange || "Standard"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {/* Comparison selector toggle */}
                            <button
                              onClick={() => {
                                playTechBeep(800, 0.05);
                                onToggleCompare(p.model);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                                isCompared 
                                  ? "bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/35"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                              }`}
                            >
                              <Shuffle size={12} />
                              {isCompared ? "Selected" : "Compare"}
                            </button>

                            {/* Detailed Specsheet view trigger */}
                            <button
                              onClick={() => {
                                playTechBeep(1000, 0.06);
                                onSelectProduct(p);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1"
                            >
                              <Eye size={12} /> View Specs
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dynamic lower counter and control buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-850/60">
          <div className="flex items-center gap-2 text-slate-400">
            <Sliders size={13} className="text-slate-500" />
            <span className="text-xs font-mono">
              STATUS // <span className="text-cyan-400 font-extrabold">{filteredProducts.length}</span> MATCHES IN MATRIX
            </span>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={handlePrevStep}
                className="px-3.5 py-1.8 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}

            {step < 5 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={resetWizard}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1 cursor-pointer"
              >
                Run Again <RefreshCw size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
