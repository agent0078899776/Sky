import React from "react";
import { WHY_SKY_SWITCH } from "../data";
import { Award, Compass, Zap, CheckCircle2, ShieldEllipsis } from "lucide-react";

export const AboutUs: React.FC = () => {
  return (
    <div className="space-y-16 pb-12">
      {/* Mini banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0d1527] border border-slate-800 p-8 sm:p-12 shadow-2xl flex items-center min-h-[250px]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-widest">Company Overview</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">Our Aerospace Heritage</h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Delivering the gold standard in sealed switching physics. From layout blueprint designs to ultimate physical qualification tests, we engineer safety.
          </p>
        </div>
      </div>

      {/* Corporate Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0d1527]/50 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="inline-flex p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Compass size={24} />
          </div>
          <h3 className="text-xl font-bold text-white font-display">Our Mission</h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            To provide aerospace, defense, and heavy transport industries with the highest quality hermetically sealed relays and contactors that deliver unmatched reliability in extreme operating conditions.
          </p>
        </div>

        <div className="bg-[#0d1527]/50 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="inline-flex p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold text-white font-display">Our Vision</h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            To be the global pioneer of solid state and mechanical switching integrations, continually narrowing failure boundaries via state-of-the-art materials science and laser welds.
          </p>
        </div>
      </div>

      {/* Production & Lab Testing description */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-display text-white text-center">Quality Assurance Laboratory</h3>
        <p className="text-slate-400 text-sm sm:text-base text-center max-w-2xl mx-auto">
          We maintain rigorous physical evaluation tests on site, replicating seismic vibration, deep isolation vacuums, chemical corrosion, and heavy electrical arcs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <CheckCircle2 className="text-green-400" size={18} />
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono">MIL-STD-202 Tested</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Standardized environmental evaluation guidelines of electronics.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <Zap className="text-amber-400" size={18} />
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono">10,000V Isolation vacuum</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Full atmospheric vacuum seal preventing electrical arcing.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <ShieldEllipsis className="text-blue-400" size={18} />
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono">Laser seal inspection</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Infrared spectrometer checks of housing seals on 100% of lots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
