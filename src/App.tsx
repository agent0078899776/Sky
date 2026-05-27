import { useState } from "react";
import { Home } from "./components/Home";
import { Catalog } from "./components/Catalog";
import { AboutUs } from "./components/AboutUs";
import { FeedbackRequestForm } from "./components/FeedbackRequestForm";
import { HardDrive, HelpCircle, Mail, Phone, ExternalLink, ShieldAlert } from "lucide-react";
import { SkySwitchLogo } from "./components/SkySwitchLogo";
import { BackgroundPulses } from "./components/BackgroundPulses";
import { playTechBeep, playRelayClick } from "./utils/audio";
import { ThemeToggle } from "./components/ThemeToggle";
import { SoundToggle } from "./components/SoundToggle";

type ActiveTab = "home" | "catalog" | "about" | "contact";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      return (localStorage.getItem("theme") as "dark" | "light") || "dark";
    } catch {
      return "dark";
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("audio_muted") === "true";
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [contactFormSelectedModels, setContactFormSelectedModels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollSection = (id: string) => {
    setActiveTab("home");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 150);
  };

  const handleSelectedRequestProducts = (models: string[]) => {
    setContactFormSelectedModels(models);
    playRelayClick("close");
    scrollSection("quotation-section");
  };

  const handleHeroNavigateToCatalog = () => {
    playTechBeep(1000, 0.05);
    setActiveTab("catalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeroNavigateToContact = () => {
    playRelayClick("close");
    scrollSection("quotation-section");
  };

  return (
    <div className={`relative min-h-screen bg-[#060a14] text-slate-300 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900 overflow-x-hidden ${theme === "light" ? "light-theme" : ""}`}>
      <BackgroundPulses />
      
      {/* Tactical Sound Feedback Toggle */}
      <SoundToggle
        theme={theme}
        isMuted={isMuted}
        onToggle={setIsMuted}
      />
      
      {/* Tactical Theme Toggle Switcher */}
      <ThemeToggle 
        theme={theme} 
        onToggle={() => {
          setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            try {
              localStorage.setItem("theme", next);
            } catch (e) {
              console.warn("Storage failed:", e);
            }
            return next;
          });
        }} 
      />
      {/* Sleek corporate Header */}
      <header className="sticky top-0 z-30 bg-[#060a14]/80 backdrop-blur-xl border-b border-slate-900 shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand Brand mark */}
          <button 
            onClick={() => {
              playTechBeep(800, 0.06);
              scrollSection("hero-section");
            }}
            className="flex items-center gap-3 hover:opacity-90 transition-all text-left focus:outline-none cursor-pointer group"
          >
            <SkySwitchLogo size={46} interactive={false} />
            <div>
              <h1 className="text-white text-xl sm:text-2xl font-extrabold font-display tracking-tight leading-none group-hover:text-cyan-400 transition-colors">
                SkySwitch
              </h1>
              <p className="text-xs sm:text-sm text-cyan-400 font-mono tracking-widest uppercase mt-1">
                Technologies
              </p>
            </div>
          </button>

          {/* Navigation selectors */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-900">
            <button
              onClick={() => {
                playTechBeep(900, 0.05);
                scrollSection("hero-section");
              }}
              className={`px-4 py-2 font-display text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "home" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Enterprise Home
            </button>
            <button
              onClick={() => {
                playTechBeep(1000, 0.05);
                setActiveTab("catalog");
              }}
              className={`px-4 py-2 font-display text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "catalog" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Component Explorer
            </button>
            <button
              onClick={() => {
                playTechBeep(1100, 0.05);
                scrollSection("about-section");
              }}
              className="px-4 py-2 font-display text-sm font-semibold rounded-lg transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              Organization Profile
            </button>
            <button
              onClick={() => {
                playTechBeep(1200, 0.05);
                scrollSection("quotation-section");
              }}
              className="px-4 py-2 font-display text-sm font-semibold rounded-lg transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              Quotation Desk
            </button>
          </nav>

          {/* CTA header button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playRelayClick("close");
                setContactFormSelectedModels([]);
                scrollSection("quotation-section");
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 text-sm font-extrabold rounded-lg shadow-sm transition-all focus:outline-none cursor-pointer"
            >
              Request Offer
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation ribbon */}
        <div className="md:hidden bg-slate-950 border-t border-slate-900 py-2.5 px-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-[340px]">
            <button
              onClick={() => {
                playTechBeep(900, 0.05);
                scrollSection("hero-section");
              }}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                activeTab === "home" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                playTechBeep(1000, 0.05);
                setActiveTab("catalog");
                setSearchQuery("");
              }}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                activeTab === "catalog" ? "bg-[#16223f] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Component Explorer
            </button>
            <button
              onClick={() => {
                playTechBeep(1100, 0.05);
                scrollSection("about-section");
              }}
              className="px-3.5 py-2 text-sm font-semibold rounded-lg shrink-0 transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              Profile
            </button>
            <button
              onClick={() => {
                playTechBeep(1200, 0.05);
                scrollSection("quotation-section");
              }}
              className="px-3.5 py-2 text-sm font-semibold rounded-lg shrink-0 transition-all text-slate-400 hover:text-white cursor-pointer font-sans"
            >
              Quotation Desk
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Layout Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 min-h-[70vh]">
        {activeTab === "home" && (
          <Home
            onNavigateToCatalog={handleHeroNavigateToCatalog}
            onNavigateToContact={handleHeroNavigateToContact}
            contactFormSelectedModels={contactFormSelectedModels}
          />
        )}

        {activeTab === "catalog" && (
          <Catalog
            onSelectedRequestProducts={handleSelectedRequestProducts}
            activeSearchQuery={searchQuery}
            setActiveSearchQuery={setSearchQuery}
          />
        )}
      </main>

      {/* Corporate Solid Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-350 text-base mt-12 py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-12 border-b border-slate-900">
            
            {/* Logo description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <SkySwitchLogo size={42} interactive={false} />
                <span className="text-white text-lg sm:text-xl font-extrabold font-display">SkySwitch Technologies</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm text-slate-400">
                SkySwitch stands at the forefront of sealed switching infrastructure. Supporting critical aerospace, defense, marine, and high-frequency arrays since 2026.
              </p>
              <div className="flex items-center gap-4 text-sm font-mono text-cyan-400">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full inline-block animate-pulse" /> QA Lab Operational
                </span>
                <span>•</span>
                <span>Active UTC: 2026-05-22</span>
              </div>
            </div>

            {/* Links Block */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono">Component Navigator</h4>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Sealed Electromagnetic"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Sealed Electromagnetic Relays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Sealed Magnetic Holding"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Sealed Magnetic Holding Relays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Radio Frequency"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Radio Frequency Relays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Contactors"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Contactors
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Solid State Relays"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Solid State Relays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Metal encapsulated"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Metal Encapsulated Solid State Relays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Plastic photorelays"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Plastic Photorelays (PhotoMOS)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Time Relays"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Time Relays
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSearchQuery("Sealed Optocouplers"); }} className="hover:text-white transition-colors text-slate-400 text-left">
                    Sealed Optocouplers
                  </button>
                </li>
              </ul>
            </div>

            {/* Corporate Profile Block */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono">Corporate Portal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setActiveTab("home")} className="hover:text-white transition-colors text-slate-400">
                    Enterprise Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollSection("about-section")} className="hover:text-white transition-colors text-slate-400">
                    Organization Mission
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollSection("quotation-section")} className="hover:text-white transition-colors text-slate-400">
                    Request Custom Quote
                  </button>
                </li>
              </ul>
            </div>

            {/* Direct Contact desk */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-wider font-mono">Direct Technical Contacts</h4>
              <div className="space-y-2 text-sm">
                <a href="mailto:nskraynov007@gmail.com" className="block text-cyan-400 hover:text-cyan-300 transition-colors font-mono tracking-wide text-sm">
                  nskraynov007@gmail.com
                </a>
                <span className="block text-[#64748b] leading-tight text-xs">
                  Send design briefs directly to our engineering coordinators.
                </span>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© 2026 SkySwitch Technologies. High-Reliability hermetic sealed systems. All Rights Reserved.</p>
            <div className="flex items-center gap-4 text-slate-500 text-xs">
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
