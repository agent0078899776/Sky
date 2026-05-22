import React, { useState, useEffect } from "react";
import { Mail, User, Terminal, Send, CheckCircle, X } from "lucide-react";
import { CATALOG_CATEGORIES } from "../data";

interface FeedbackRequestFormProps {
  initialSelectedModels: string[];
}

export const FeedbackRequestForm: React.FC<FeedbackRequestFormProps> = ({
  initialSelectedModels,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [searchModelQuery, setSearchModelQuery] = useState("");

  useEffect(() => {
    if (initialSelectedModels && initialSelectedModels.length > 0) {
      setSelectedModels(initialSelectedModels);
    }
  }, [initialSelectedModels]);

  // Extract all existing models for autocompleting selectors
  const allAvailableModels = CATALOG_CATEGORIES.flatMap((c) => c.products.map((p) => p.model));

  const filteredDatalist = allAvailableModels.filter(
    (m) =>
      m.toLowerCase().includes(searchModelQuery.toLowerCase()) &&
      !selectedModels.includes(m)
  );

  const addModelToSelection = (model: string) => {
    if (!selectedModels.includes(model)) {
      setSelectedModels([...selectedModels, model]);
    }
    setSearchModelQuery("");
  };

  const removeModelFromSelection = (model: string) => {
    setSelectedModels(selectedModels.filter((m) => m !== model));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate sending progress
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setSelectedModels([]);
    }, 1200);
  };

  return (
    <div className="relative bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden max-w-3xl mx-auto">
      {status === "success" ? (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto h-16 w-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={36} />
          </div>
          <h3 className="text-2xl font-bold font-display text-white">Quotation Request Received</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for contacting SkySwitch Technologies. Our engineering sales group is processing your request and will follow up with full datasheets and pricing within 24 hours.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 px-6 py-2.5 bg-[#16223f] hover:bg-[#1a2b52] text-white text-xs font-semibold rounded-xl transition-all border border-slate-700/60"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
              Quotation Desk (Formspree Integrated)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              Request Technical Offer & Specifications
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Our engineering support team can provide solid models, 3D CAD step files, detailed chemical sealing tests, and quantity discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
                Your Professional Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Dent"
                  className="w-full bg-[#16223f] text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-cyan-500 text-sm transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dent@aerospace-co.com"
                  className="w-full bg-[#16223f] text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-cyan-500 text-sm transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Connected Models Selectors */}
          <div className="space-y-3 bg-[#060a14] p-4 rounded-2xl border border-slate-800">
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
              Associated Product Models (Optional)
            </label>
            <p className="text-slate-400 text-[10px] sm:text-xs">
              Models checked in the Component Explorer are automatically included below. You can append more as needed.
            </p>

            {/* Selected models badges list */}
            {selectedModels.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1 pb-2">
                {selectedModels.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold bg-[#16223f] text-cyan-400 rounded-lg border border-cyan-400/20 shadow-sm"
                  >
                    {m}
                    <button
                      type="button"
                      onClick={() => removeModelFromSelection(m)}
                      className="text-slate-500 hover:text-red-400 p-0.5 focus:outline-none"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-xs py-1 italic">No models selected currently. Quote applies to primary request description.</div>
            )}

            {/* Interactive Model Autocomplete Input */}
            <div className="relative max-w-sm">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                value={searchModelQuery}
                onChange={(e) => setSearchModelQuery(e.target.value)}
                placeholder="Type and check to append models..."
                className="w-full bg-[#16223f]/80 text-white placeholder-slate-600 pl-9 pr-4 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs transition-all font-mono"
              />
              {searchModelQuery && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#16223f] border border-slate-700/80 rounded-xl max-h-40 overflow-y-auto z-10 shadow-xl divide-y divide-slate-800">
                  {filteredDatalist.length === 0 ? (
                    <div className="p-2 text-slate-400 text-xs italic">No matching model found</div>
                  ) : (
                    filteredDatalist.map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => addModelToSelection(m)}
                        className="w-full text-left px-3 py-2 text-xs font-mono text-cyan-400 hover:bg-slate-800 transition-colors flex items-center justify-between"
                      >
                        <span>{m}</span>
                        <span className="text-[10px] text-slate-500 italic">Click to append</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Custom specifications / message text area */}
          <div className="space-y-2">
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
              Your Requirements / Specification Details
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe physical requirements, G-forces tolerances, required certification forms, quantities, or reference designs..."
              className="w-full bg-[#16223f] text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-700/60 focus:outline-none focus:border-cyan-500 text-sm transition-all shadow-inner leading-relaxed resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing quotation request...
              </>
            ) : (
              <>
                <Send size={16} /> Submit Technical Request
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
