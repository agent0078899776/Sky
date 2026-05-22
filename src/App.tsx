import { useState } from "react";
import { Home } from "./components/Home";
import { Catalog } from "./components/Catalog";
import { AboutUs } from "./components/AboutUs";
import { FeedbackRequestForm } from "./components/FeedbackRequestForm";
import { HardDrive, HelpCircle, Mail, Phone, ExternalLink, ShieldAlert, Cpu } from "lucide-react";

type ActiveTab = "home" | "catalog" | "about" | "contact";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [contactFormSelectedModels, setContactFormSelectedModels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectedRequestProducts = (models: string[]) => {
    setContactFormSelectedModels(models);
    setActiveTab("contact");
    // Scroll smoothly to coordinate
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleHeroNavigateToCatalog = () => {
    setActiveTab("catalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeroNavigateToContact = () => {
    setActiveTab("contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-300 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900">
      {/* Sleek corporate Header */}
      <header className="sticky top-0 z-30 bg-[#060a14]/80 backdrop-blur-xl border-b border-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand Brand mark */}
          <button 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 hover:opacity-90 transition-all text-left focus:outline-none"
          >
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/10 text-slate-950">
              <Cpu size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-white text-lg sm:text-xl font-extrabold font-display tracking-tight leading-none">
                SkySwitch
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase mt-1">
                Technologies
              </p>
            </div>
          </button>

          {/* Navigation selectors */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-900">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-2 font-display text-xs font-semibold rounded-lg transition-all ${
                activeTab === "home" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Enterprise Home
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-2 font-display text-xs font-semibold rounded-lg transition-all ${
                activeTab === "catalog" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Component Explorer
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-2 font-display text-xs font-semibold rounded-lg transition-all ${
                activeTab === "about" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Organization Profile
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-2 font-display text-xs font-semibold rounded-lg transition-all ${
                activeTab === "contact" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Quotation Desk
            </button>
          </nav>

          {/* CTA header button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setContactFormSelectedModels([]);
                setActiveTab("contact");
              }}
              className="px-4.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 text-xs font-extrabold rounded-lg shadow-sm transition-all focus:outline-none"
            >
              Request Offer
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation ribbon */}
        <div className="md:hidden bg-slate-950 border-t border-slate-900 py-2.5 px-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-[340px]">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                activeTab === "home" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab("catalog");
                setSearchQuery("");
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                activeTab === "catalog" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Component Explorer
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                activeTab === "about" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                activeTab === "contact" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Quotation Desk
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 min-h-[70vh]">
        {activeTab === "home" && (
          <Home
            onNavigateToCatalog={handleHeroNavigateToCatalog}
            onNavigateToContact={handleHeroNavigateToContact}
          />
        )}

        {activeTab === "catalog" && (
          <Catalog
            onSelectedRequestProducts={handleSelectedRequestProducts}
            activeSearchQuery={searchQuery}
            setActiveSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === "about" && <AboutUs />}

        {activeTab === "contact" && (
          <FeedbackRequestForm initialSelectedModels={contactFormSelectedModels} />
        )}
      </main>

      {/* Corporate Solid Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-12 border-b border-slate-900">
            
            {/* Logo description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#16223f] p-2 rounded-xl text-cyan-400">
                  <Cpu size={16} />
                </div>
                <span className="text-white text-base font-extrabold font-display">SkySwitch Technologies</span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm">
                SkySwitch stands at the forefront of sealed switching infrastructure. Supporting critical aerospace, defense, marine, and high-frequency arrays since 2026.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-cyan-400">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full inline-block" /> QA Lab Operational
                </span>
                <span>•</span>
                <span>Active UTC: 2026-05-22</span>
              </div>
            </div>

            {/* Links Block */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Component Navigator</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery(""); }} className="hover:text-white transition-colors">
                    Electromagnetic Relays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("latching"); }} className="hover:text-white transition-colors">
                    Magnetic Holding Latching
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("radio"); }} className="hover:text-white transition-colors">
                    RF Coaxial Switches
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("contactor"); }} className="hover:text-white transition-colors">
                    Heavy Duty Power Contactors
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("solid"); }} className="hover:text-white transition-colors">
                    Optoelectronic Solid State
                  </button>
                </li>
              </ul>
            </div>

            {/* Corporate Profile Block */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Corporate Portal</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">
                    Enterprise Home
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("about")} className="hover:text-white transition-colors">
                    Organization Mission
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("contact")} className="hover:text-white transition-colors">
                    Request Custom Quote
                  </button>
                </li>
              </ul>
            </div>

            {/* Direct Contact desk */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Direct Technical Contacts</h4>
              <div className="space-y-2 text-xs">
                <a href="mailto:dent@aerospace-co.com" className="block hover:text-white transition-colors font-mono tracking-wide">
                  nskraynov007@gmail.com
                </a>
                <span className="block text-[#64748b] leading-tight text-[11px]">
                  Send design briefs directly to our engineering coordinators.
                </span>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 SkySwitch Technologies. High-Reliability hermetic sealed systems. All Rights Reserved.</p>
            <div className="flex items-center gap-4 text-slate-500 text-[10px]">
              <a href="#" className="hover:text-slate-400">Security Parameters</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-400">Class MIL-STD compliance docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
