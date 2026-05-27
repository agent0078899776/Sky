import React, { useState, useMemo } from "react";
import { CATALOG_CATEGORIES } from "../data";
import { ProductRec, CatalogCategory } from "../types";
import { Search, ChevronDown, ChevronRight, X, Shuffle, CheckCircle, ZoomIn, ZoomOut, Zap, Eye, HelpCircle, CornerDownRight, Sliders, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playRelayClick, playTechBeep, playSparkCrackle, setCoilHumActive } from "../utils/audio";
import { SmartWizard } from "./SmartWizard";

// ==========================================
// НАСТРОЙКА РАЗМЕРА ИЗОБРАЖЕНИЯ РЕЛЕ В VIEW SPECS
// Вы можете быстро изменить это число (в пикселях), чтобы настроить размер картинок реле в спецификациях.
// Например: 150, 180, 220, 300 и т.д. Меньше значение — картинка чётче, больше значение — картинка крупнее.
export const VIEW_SPECS_PHOTO_SIZE = 180;
// ==========================================

// Helper to separate physical dimensions from mounting description
const formatDimensions = (dimStr: string) => {
  if (!dimStr) return { size: "", desc: "" };
  const cleaned = dimStr.replace(/\s*x\s*/gi, "x");
  const match = cleaned.match(/^([^\d\s]*\s*\d+(?:\.\d+)?x\d+(?:\.\d+)?(?:x\d+(?:\.\d+)?)?)\s*(.*)$/i);
  if (match) {
    return {
      size: match[1].trim(),
      desc: match[2].trim()
    };
  }
  return { size: "", desc: cleaned };
};
const renderDimValue = (val: string) => {
  if (!val) return "";
  const parts = val.split(/(x)/i);
  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === "x") {
          return (
            <span key={index} className="font-light text-slate-400/80 mx-[1px] select-none text-[11px] inline-block">
              x
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};
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
const getPossibleSchematics = (product: ProductRec): string[] => {
  const model = product.model;
  const list: string[] = [];

  // 1. If product explicitly has a schematic property
  if (product.schematic) {
    list.push(product.schematic);
  }

  // 2. The exact model name itself
  list.push(model);

  // 3. For multiple-word/slash models (e.g. "BC3223 / BC5223")
  if (model.includes("/")) {
    const parts = model.split("/").map(s => s.trim());
    parts.forEach(p => {
      if (p && !list.includes(p)) list.push(p);
    });
  }

  // Plastic photorelay (BCY, BCV, BCW, BCS, etc.)
  const photoMatch = model.match(/^(BC[YVWS]\d{3})/i);
  if (photoMatch) {
    const core = photoMatch[1].toUpperCase();
    if (!list.includes(core)) {
      list.push(core);
    }
  }

  // Electro-magnetic relays (e.g., matching digit then J, ending with A or H)
  const electroMatch = model.match(/^(\d+J\w+?[AH])/i);
  if (electroMatch) {
    const core = electroMatch[1].toUpperCase();
    if (!list.includes(core)) {
      list.push(core);
    }
  }

  // Fallback: strip standard trailing prefixes
  const strippedGeneric = model.replace(/(?:FGD|AFD|FGD|FG|FD|GD|AD|AD1|D|G|T|I)$/i, "");
  if (strippedGeneric && strippedGeneric !== model && !list.includes(strippedGeneric)) {
    list.push(strippedGeneric);
  }

  return list;
};

const getSchematicUrls = (product: ProductRec): string[] => {
  const names = getPossibleSchematics(product);
  const urls: string[] = [];
  for (const name of names) {
    urls.push(resolveImagePath(`/schematics/${name}.webp`));
    urls.push(resolveImagePath(`/schematic/${name}.webp`));
  }
  return urls;
};
// Helper to separate contact rating from electrical life cycles
const formatContactLoad = (loadStr: string) => {
  const match = loadStr.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      load: match[1].trim(),
      life: match[2].trim()
    };
  }
  return { load: loadStr, life: "" };
};

// Helper to render contact loads cleanly and handle both single and multiple load/life mappings
const renderContactLoadHelper = (loadStr: string, textClass = "text-sm", alignment = "items-center text-center", textColorClass = "text-slate-200") => {
  if (!loadStr) return null;

  const parts = loadStr.split(/\s*\|\s*/);
  const parsedParts = parts.map((part) => {
    const pMatch = part.match(/^(.*?)\s*\((.*?)\)$/);
    if (pMatch) {
      return {
        load: pMatch[1].trim(),
        life: pMatch[2].trim()
      };
    }
    return {
      load: part.trim(),
      life: null
    };
  });

  const onlyLastHasLife = parsedParts.length > 1 && parsedParts[parsedParts.length - 1].life !== null && parsedParts.slice(0, -1).every(p => p.life === null);

  if (onlyLastHasLife) {
    const commonLife = parsedParts[parsedParts.length - 1].life;
    return (
      <div className={`flex flex-col gap-0.5 ${alignment} max-w-full leading-tight`}>
        {parsedParts.map((p, idx) => (
          <span key={idx} className={`font-sans ${textClass} ${textColorClass} font-semibold block`}>
            {p.load}
          </span>
        ))}
        <span className="text-xs text-slate-400 mt-1 font-mono leading-tight block">({commonLife})</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${alignment} max-w-full`}>
      {parsedParts.map((p, idx) => (
        <div key={idx} className={`flex flex-col gap-0.5 ${alignment} leading-tight`}>
          <span className={`font-sans ${textClass} ${textColorClass} font-semibold block`}>
            {p.load}
          </span>
          {p.life && (
            <span className="text-xs text-slate-400 mt-0.5 font-mono leading-tight block">({p.life})</span>
          )}
        </div>
      ))}
    </div>
  );
};

// Helper to strip parentheses and descriptions from Contact Form
const cleanContactForm = (formStr: string) => {
  return formStr.replace(/\s*\([^)]*\)/g, "").trim();
};

// Helper to render temperature range with support for splitting "Class: range" and multiclass delimiters into multiple lines
const renderTempRange = (tempStr: string, textColorClass = "text-slate-200") => {
  if (!tempStr) return null;
  
  // Split by '|' to separate multiple classifications or groups nicely
  const segments = tempStr.split(/\s*\|\s*/);
  
  return (
    <div className="flex flex-col gap-1 items-center text-center">
      {segments.map((segment, sIdx) => {
        if (segment.includes(":")) {
          const parts = segment.split(":");
          const label = parts[0].trim();
          const val = parts.slice(1).join(":").trim();
          return (
            <div key={sIdx} className="flex flex-col items-center">
              <span className="text-[10px] tracking-wider text-slate-400 font-sans uppercase font-bold">{label}:</span>
              <span className={`font-mono text-xs ${textColorClass} font-semibold whitespace-nowrap`}>{val}</span>
            </div>
          );
        }
        return (
          <span key={sIdx} className={`font-mono text-xs ${textColorClass} font-semibold whitespace-nowrap block w-full`}>
            {segment}
          </span>
        );
      })}
    </div>
  );
};

// Helper to detect if a specific cell value is a mismatch (an outlier / different from the majority) among compared cells.
// If all values are identical, no cells are mismatching.
// If there is a majority baseline, only non-majority values are mismatching.
// If there is no majority (all are unique), all are mismatching.
const isCellValMismatch = (val: string, allVals: string[]) => {
  const cleanVals = allVals.map(v => (v || "").trim().toLowerCase());
  const cleanVal = (val || "").trim().toLowerCase();
  
  const uniqueVals = new Set(cleanVals);
  if (uniqueVals.size <= 1) return false;

  const freqs: Record<string, number> = {};
  cleanVals.forEach((v) => {
    freqs[v] = (freqs[v] || 0) + 1;
  });

  const maxFreq = Math.max(...Object.values(freqs));
  if (maxFreq > 1) {
    return freqs[cleanVal] < maxFreq;
  }
  return true;
};

interface CatalogProps {
  onSelectedRequestProducts: (models: string[]) => void;
  activeSearchQuery: string;
  setActiveSearchQuery: (q: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  onSelectedRequestProducts,
  activeSearchQuery,
  setActiveSearchQuery,
}) => {
  // Collapsed categories state. Initially let categories be collapsed by default
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  // Toggles the high-density parametric smart wizard view
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  // Selected models for comparison
  const [comparedModels, setComparedModels] = useState<Record<string, boolean>>({});
  // Active selected product for Spec Modal Detailed View
  const [activeSpecProduct, setActiveSpecProduct] = useState<ProductRec | null>(null);
  // Active compare modal trigger
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  // Simulation armature state for active spec preview
  const [simulatedCoilOn, setSimulatedCoilOn] = useState(false);
  // Schematic Zoom scale
  const [zoomScale, setZoomScale] = useState(1);
  // Schematic drag position
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [touchStartScale, setTouchStartScale] = useState<number>(1);
  const [specViewTab, setSpecViewTab] = useState<"photo" | "schematic" | "stress">("photo");
  const [photoAttempt, setPhotoAttempt] = useState<Record<string, "local" | "fallback" | "failed">>({});
  const [schematicUrlIndex, setSchematicUrlIndex] = useState<Record<string, number>>({});

  // Interactive Stress Simulator variables
  const [stressCurrentPct, setStressCurrentPct] = useState(100);
  const [stressVoltagePct, setStressVoltagePct] = useState(100);
  const [stressTemp, setStressTemp] = useState(25);
  const [stressVibe, setStressVibe] = useState(10);

  // Cyclic automated test counters
  const [isCyclicTesting, setIsCyclicTesting] = useState(false);
  const [cyclicCounter, setCyclicCounter] = useState(0);
  const [cyclicFailures, setCyclicFailures] = useState(0);
  const [cyclicWelds, setCyclicWelds] = useState(0);
  const [simRelayActive, setSimRelayActive] = useState(false);

  // Monitor spec sheet opening/closing to play auditory transitions
  const prevActiveProductRef = React.useRef<ProductRec | null>(null);
  React.useEffect(() => {
    if (activeSpecProduct && !prevActiveProductRef.current) {
      playRelayClick("close");
    } else if (!activeSpecProduct && prevActiveProductRef.current) {
      playRelayClick("open");
      setCoilHumActive(false);
    }
    prevActiveProductRef.current = activeSpecProduct;
  }, [activeSpecProduct]);

  // Parse active specs limits
  const parsedLimits = useMemo(() => {
    if (!activeSpecProduct) return { maxCurrent: 2, maxVoltage: 28, minTemp: -55, maxTemp: 85, defaultLife: 100000 };

    let maxCurrent = 2;
    let maxVoltage = 28;
    let minTemp = -55;
    let maxTemp = 85;
    let defaultLife = 100000;

    // Current detection
    const loadText = activeSpecProduct.contactLoad || activeSpecProduct.outputCurrent || "";
    const currentMatch = loadText.match(/(\d+(?:\.\d+)?)\s*A/i);
    if (currentMatch) {
      maxCurrent = parseFloat(currentMatch[1]);
    } else {
      const outCurrentMatch = (activeSpecProduct.outputCurrent || "").match(/(\d+(?:\.\d+)?)\s*(?:A|mA)/i);
      if (outCurrentMatch) {
        maxCurrent = parseFloat(outCurrentMatch[1]);
        if (activeSpecProduct.outputCurrent?.toLowerCase().includes("ma")) {
          maxCurrent /= 1000;
        }
      }
    }

    // Voltage detection
    const voltageMatch = loadText.match(/(\d+(?:\.\d+)?)\s*V/i);
    if (voltageMatch) {
      maxVoltage = parseFloat(voltageMatch[1]);
    } else {
      const outVoltMatch = (activeSpecProduct.outputVoltage || "").match(/(\d+(?:\.\d+)?)\s*V/i);
      if (outVoltMatch) {
        maxVoltage = parseFloat(outVoltMatch[1]);
      }
    }

    // Temperature detection
    const tempText = activeSpecProduct.tempRange || "";
    const tempMatch = tempText.match(/(-?\d+)\s*(?:~|to)\s*(-?\d+)/);
    if (tempMatch) {
      minTemp = parseInt(tempMatch[1], 10);
      maxTemp = parseInt(tempMatch[2], 10);
    }

    // Default design life
    const lifeMatch = loadText.match(/([\d,]+)\s*cycles/i);
    if (lifeMatch) {
      defaultLife = parseInt(lifeMatch[1].replace(/,/g, ""), 10);
    }

    return { maxCurrent, maxVoltage, minTemp, maxTemp, defaultLife };
  }, [activeSpecProduct]);

  // Toggle category fold
  const toggleCategory = (catId: string) => {
    playTechBeep(600, 0.035);
    setCollapsedCategories((prev) => {
      const currentVal = prev[catId] ?? true;
      return {
        ...prev,
        [catId]: !currentVal,
      };
    });
  };

  // Toggle model comparison selection
  const toggleModelCompare = (modelId: string) => {
    const nextCheck = !comparedModels[modelId];
    playRelayClick(nextCheck ? "close" : "open");
    setComparedModels((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));
  };

  // Clear all checked models
  const clearAllComparison = () => {
    setComparedModels({});
  };

  // Filters computed based on search queries
  const filteredCategories = useMemo(() => {
    if (!activeSearchQuery.trim()) return CATALOG_CATEGORIES;
    const query = activeSearchQuery.toLowerCase().trim();

    return CATALOG_CATEGORIES.map((category) => {
      const matchCategoryName = category.name.toLowerCase().includes(query) || category.subheading?.toLowerCase().includes(query);
      const filteredProducts = category.products.filter((p) => {
        return (
          (p.model || "").toLowerCase().includes(query) ||
          (p.contactForm || p.outputGroups || "").toLowerCase().includes(query) ||
          (p.benchmarking || "").toLowerCase().includes(query) ||
          (p.tempRange || p.outputVoltage || "").toLowerCase().includes(query) ||
          (p.contactLoad || p.outputCurrent || "").toLowerCase().includes(query) ||
          (p.dimensions || p.packageStyle || "").toLowerCase().includes(query)
        );
      });

      if (matchCategoryName) {
        return category; // return all products of matching category
      }

      return {
        ...category,
        products: filteredProducts,
      };
    }).filter((category) => category.products.length > 0);
  }, [activeSearchQuery]);

  // Selected products details list for Comparison Grid
  const selectedProductsForComparison = useMemo(() => {
    const list: ProductRec[] = [];
    CATALOG_CATEGORIES.forEach((cat) => {
      cat.products.forEach((p) => {
        if (comparedModels[p.model]) {
          list.push(p);
        }
      });
    });
    return list;
  }, [comparedModels]);

  // Detect which spec fields carry mismatching indices across selected items
  const mismatchKeys = useMemo(() => {
    const mismatches: Record<string, boolean> = {};

    if (selectedProductsForComparison.length < 2) return mismatches;

    const uniqueDimensions = new Set(selectedProductsForComparison.map((p) => p.packageStyle || p.dimensions || ""));
    const uniqueTempRange = new Set(selectedProductsForComparison.map((p) => p.outputVoltage || p.tempRange || ""));
    const uniqueContactForm = new Set(selectedProductsForComparison.map((p) => p.outputGroups || p.contactForm || ""));
    const uniqueVibration = new Set(selectedProductsForComparison.map((p) => p.onResistance || p.vibration || ""));
    const uniqueContactLoad = new Set(selectedProductsForComparison.map((p) => p.outputCurrent || p.contactLoad || ""));
    const uniqueBenchmarking = new Set(selectedProductsForComparison.map((p) => p.benchmarking || ""));

    if (uniqueDimensions.size > 1) mismatches["dimensions"] = true;
    if (uniqueTempRange.size > 1) mismatches["tempRange"] = true;
    if (uniqueContactForm.size > 1) mismatches["contactForm"] = true;
    if (uniqueVibration.size > 1) mismatches["vibration"] = true;
    if (uniqueContactLoad.size > 1) mismatches["contactLoad"] = true;
    if (uniqueBenchmarking.size > 1) mismatches["benchmarking"] = true;

    return mismatches;
  }, [selectedProductsForComparison]);

   const handleSchematicMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - dragPos.x, y: e.clientY - dragPos.y });
  };

  const handleSchematicMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleSchematicMouseUp = () => {
    setIsDragging(false);
  };

  const handleSchematicTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - dragPos.x, y: touch.clientY - dragPos.y });
      setTouchStartDist(null);
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      setTouchStartDist(dist);
      setTouchStartScale(zoomScale);
      setIsDragging(false);
    }
  };

  const handleSchematicTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setDragPos({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartDist !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / touchStartDist;
      const newScale = Math.max(0.5, Math.min(2.5, touchStartScale * ratio));
      setZoomScale(newScale);
    }
  };

  const handleSchematicTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setTouchStartDist(null);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - dragPos.x, y: touch.clientY - dragPos.y });
      setTouchStartDist(null);
    }
  };

  const resetZoomAndDrag = () => {
    setZoomScale(1);
    setDragPos({ x: 0, y: 0 });
    setTouchStartDist(null);
    setTouchStartScale(1);
    setSimulatedCoilOn(false);
    setSpecViewTab("photo");
    setStressCurrentPct(100);
    setStressVoltagePct(100);
    setStressTemp(25);
    setStressVibe(10);
    setIsCyclicTesting(false);
    setCyclicCounter(0);
    setCyclicFailures(0);
    setCyclicWelds(0);
    setSimRelayActive(false);
  };

  // Automated endurance cyclic testing engine
  React.useEffect(() => {
    let timer: any = null;
    if (isCyclicTesting && activeSpecProduct) {
      // Turn on louder cyclic solenoid background hum (120Hz induction)
      setCoilHumActive(true, 120);

      const stressRatioCurrent = stressCurrentPct / 100;
      const stressRatioVoltage = stressVoltagePct / 100;
      const isOverCurrent = stressCurrentPct > 100;
      const isOverVoltage = stressVoltagePct > 100;
      const isOverTemp = stressTemp > parsedLimits.maxTemp || stressTemp < parsedLimits.minTemp;
      const isOverVibe = stressVibe > 15;

      timer = setInterval(() => {
        setSimRelayActive((prev) => {
          const nextVal = !prev;
          playRelayClick(nextVal ? "close" : "open");
          return nextVal;
        });
        setCyclicCounter((prev) => prev + 1);

        // Probability of micro-arcs/contact jitter per switch cycle
        let failChance = 0.005;
        if (isOverCurrent) failChance += (stressRatioCurrent - 1) * 0.25;
        if (isOverVoltage) failChance += (stressRatioVoltage - 1) * 0.2;
        if (isOverTemp) failChance += 0.08;
        if (isOverVibe) failChance += (stressVibe - 15) * 0.015;

        if (Math.random() < failChance) {
          setCyclicFailures((prev) => prev + 1);
          playSparkCrackle();
        }

        // Hard weld risk (heavy overloads)
        let weldChance = 0;
        if (stressRatioCurrent >= 1.5 && stressRatioVoltage >= 1.29) {
          weldChance = 0.06;
        } else if (stressRatioCurrent >= 1.5) {
          weldChance = 0.035;
        }

        if (weldChance > 0 && Math.random() < weldChance) {
          setCyclicWelds((prev) => prev + 1);
          setIsCyclicTesting(false); // Contacts fuse/weld - stops test
          setSimRelayActive(true); // Permanently locked closed
          playSparkCrackle();
          playRelayClick("close");
        }
      }, 100); // 100ms switch rate
    } else {
      setSimRelayActive(false);
      setCoilHumActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCyclicTesting, activeSpecProduct, stressCurrentPct, stressVoltagePct, stressTemp, stressVibe, parsedLimits]);

  const currentModel = activeSpecProduct?.model || "";
  const currentPhotoStage = photoAttempt[currentModel] || "local";

  let productPhotoUrl = "";
  if (currentPhotoStage === "local") {
    productPhotoUrl = resolveImagePath(`/images/${currentModel}.webp`);
  } else if (currentPhotoStage === "fallback") {
    productPhotoUrl = resolveImagePath(activeSpecProduct?.image || "");
  }

  const isPhotoAvailable = activeSpecProduct ? (currentPhotoStage !== "failed" && (currentPhotoStage !== "fallback" || !!activeSpecProduct.image)) : false;

  const schematicUrls = activeSpecProduct ? getSchematicUrls(activeSpecProduct) : [];
  const currentSchematicUrlIdx = schematicUrlIndex[currentModel] || 0;
  const isSchematicImageAvailable = activeSpecProduct ? (currentSchematicUrlIdx < schematicUrls.length) : false;
  const schematicUrl = isSchematicImageAvailable ? schematicUrls[currentSchematicUrlIdx] : "";

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="relative bg-[#0d1527] border border-slate-800 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-400/10 rounded-full">
            <Shuffle size={12} /> Live Interactive Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            High-Performance Component Explorer
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Search our extensive catalog of mil-std relays, latching mechanisms, RF switches, and solid-state MOSFET contactors. Compare metrics and view dynamic schematic simulations instantly.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
            {/* Search box block */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={activeSearchQuery}
                onChange={(e) => setActiveSearchQuery(e.target.value)}
                placeholder="Filter by model, contact load, benchmark cross-reference, packaging..."
                className="w-full bg-[#16223f]/80 text-white placeholder-slate-400 pl-11 pr-10 py-3 rounded-xl border border-slate-700/60 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all shadow-inner"
              />
              {activeSearchQuery && (
                <button
                  onClick={() => setActiveSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Smart Wizard Toggle Button */}
            <button
              onClick={() => {
                playTechBeep(850, 0.05);
                setIsWizardOpen(prev => !prev);
              }}
              className={`px-5 py-3 rounded-xl font-bold font-display text-sm transition-all flex items-center justify-center gap-2 border shadow-sm shrink-0 cursor-pointer ${
                isWizardOpen 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "bg-[#111a30] hover:bg-[#16223f] border-slate-700 text-slate-350 hover:text-white hover:border-slate-600"
              }`}
            >
              <Sparkles size={16} className={isWizardOpen ? "animate-pulse" : ""} />
              {isWizardOpen ? "Hide Filter Wizard" : "Smart Parametric Wizard"}
            </button>
          </div>
        </div>
      </div>

      {/* Smart Parametric Wizard Block */}
      <AnimatePresence>
        {isWizardOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <SmartWizard
              onSelectProduct={setActiveSpecProduct}
              comparedModels={comparedModels}
              onToggleCompare={toggleModelCompare}
              onCloseWizard={() => setIsWizardOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories listing */}
      <div className="space-y-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-[#0d1527] border border-slate-800/80 rounded-2xl max-w-xl mx-auto">
            <HelpCircle size={48} className="mx-auto text-slate-500 mb-3" />
            <p className="text-white font-medium">No results match your parameters</p>
            <p className="text-slate-400 text-xs mt-1">Please try modifying your keywords or clear your query.</p>
            <button
              onClick={() => setActiveSearchQuery("")}
              className="mt-4 px-4 py-2 bg-blue-600/30 text-blue-400 hover:bg-blue-600/50 hover:text-white rounded-lg text-xs font-semibold transition-all border border-blue-500/30"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isFolded = collapsedCategories[category.id] ?? (activeSearchQuery.trim() ? false : true);
            return (
              <div
                key={category.id}
                className="bg-[#0d1527] border border-slate-800/90 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-700/60"
              >
                {/* Accordion header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-900/60 to-transparent hover:from-slate-900/95 transition-all text-left"
                >
                  <div className="space-y-1 pr-4">
                    <h3 className="text-lg font-bold font-display text-white tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                      {category.name}
                      <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 font-mono rounded-full font-normal">
                        {category.products.length} models
                      </span>
                    </h3>
                    {category.subheading && (
                      <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                        {category.subheading}
                      </p>
                    )}
                  </div>
                  <div className="text-slate-400 bg-slate-800 p-1.5 rounded-lg shrink-0">
                    {isFolded ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Products Table Wrapper */}
                <AnimatePresence initial={false}>
                  {!isFolded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-x-auto border-t border-slate-800/80"
                    >
                      <table className={`w-full text-left border-collapse table-fixed ${category.id === "plastic_photorelay" || category.id === "time_relays" || category.id === "sealed_optocouplers" ? "min-w-[1240px]" : "min-w-[1100px]"}`}>
                        <thead>
                          {category.id === "plastic_photorelay" ? (
                            <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-300 text-sm font-semibold tracking-wider">
                              <th className="py-3.5 px-3 w-[160px] text-center align-middle">Model</th>
                              <th className="py-3.5 px-3 w-[110px] text-center align-middle">Package</th>
                              <th className="py-3.5 px-3 w-[130px] text-center align-middle">Product Image</th>
                              <th className="py-3.5 px-3 w-[160px] text-center align-middle">Number of Output Groups</th>
                              <th className="py-3.5 px-3 w-[180px] text-center align-middle">Output Voltage / Transient Voltage</th>
                              <th className="py-3.5 px-3 w-[120px] text-center align-middle">Output Current</th>
                              <th className="py-3.5 px-3 w-[120px] text-center align-middle">On-Resistance</th>
                              <th className="py-3.5 px-3 w-[225px] text-center align-middle">Panasonic and Omron Benchmarking Models</th>
                              <th className="py-3.5 px-1.5 text-center w-[95px] align-middle">Action</th>
                            </tr>
                          ) : category.id === "time_relays" ? (
                            <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-300 text-sm font-semibold tracking-wider">
                              <th className="py-3.5 px-3 w-[150px] text-center align-middle">Product Model</th>
                              <th className="py-3.5 px-3 w-[120px] text-center align-middle">Product Picture</th>
                              <th className="py-3.5 px-3 w-[180px] text-center align-middle">Dimensions (mm) and Package</th>
                              <th className="py-3.5 px-3 w-[130px] text-center align-middle">Temperature Range (℃)</th>
                              <th className="py-3.5 px-3 w-[110px] text-center align-middle">Number of Output Groups</th>
                              <th className="py-3.5 px-3 w-[230px] text-center align-middle">Vibration</th>
                              <th className="py-3.5 px-3 w-[170px] text-center align-middle">Contact Load and Lifetime</th>
                              <th className="py-3.5 px-3 w-[125px] text-center align-middle">Benchmarking Model</th>
                              <th className="py-3.5 px-1.5 text-center w-[95px] align-middle">Action</th>
                            </tr>
                          ) : category.id === "sealed_optocouplers" ? (
                            <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-300 text-sm font-semibold tracking-wider">
                              <th className="py-3.5 px-3 w-[150px] text-center align-middle">Product Model</th>
                              <th className="py-3.5 px-3 w-[120px] text-center align-middle">Product Picture</th>
                              <th className="py-3.5 px-3 w-[180px] text-center align-middle">Dimensions (mm) and Package</th>
                              <th className="py-3.5 px-3 w-[130px] text-center align-middle">Temperature Range (℃)</th>
                              <th className="py-3.5 px-3 w-[110px] text-center align-middle">Number of Output Groups</th>
                              <th className="py-3.5 px-3 w-[200px] text-center align-middle">Vibration</th>
                              <th className="py-3.5 px-3 w-[200px] text-center align-middle">Main Parameters</th>
                              <th className="py-3.5 px-3 w-[125px] text-center align-middle">Benchmarking Model</th>
                              <th className="py-3.5 px-1.5 text-center w-[95px] align-middle">Action</th>
                            </tr>
                          ) : (
                            <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-300 text-sm font-semibold tracking-wider">
                              <th className="py-3.5 px-1.5 w-[36px] text-center align-middle" title="Compare">
                                <Shuffle size={12} className="mx-auto opacity-80" />
                              </th>
                              <th className="py-3.5 px-3 w-[115px] text-center align-middle">Product Model</th>
                              <th className="py-3.5 px-3 w-[130px] text-center align-middle">Dimensions (mm)</th>
                              <th className="py-3.5 px-3 w-[110px] text-center align-middle">Temperature range (℃)</th>
                              <th className="py-3.5 px-3 w-[130px] text-center align-middle">Contact Form</th>
                              <th className="py-3.5 px-3 w-[200px] text-center align-middle">Vibration</th>
                              <th className="py-3.5 px-3 w-[155px] text-center align-middle">Contact Load & Lifetime</th>
                              <th className="py-3.5 px-3 w-[115px] text-center align-middle">Benchmarking Model</th>
                              <th className="py-3.5 px-1.5 text-center w-[90px] align-middle">Action</th>
                            </tr>
                          )}
                        </thead>
                        <tbody className="divide-y divide-slate-800/30 text-sm">
                          {(() => {
                            // Dynamic image grouping helper for photoMOS relays based on image path
                            const imageSpans: { [key: number]: number } = {};
                            let currentIdx = 0;
                            while (currentIdx < category.products.length) {
                              const img = category.products[currentIdx].image;
                              let count = 1;
                              while (
                                currentIdx + count < category.products.length &&
                                category.products[currentIdx + count].image === img
                              ) {
                                count++;
                              }
                              imageSpans[currentIdx] = count;
                              currentIdx += count;
                            }
                            
                            
                            
                            

                            return category.products.map((p, pIdx) => {
                              const isChecked = comparedModels[p.model] || false;
                              
                              if (category.id === "plastic_photorelay") {
                                return (
                                  <tr
                                    key={p.model}
                                    className={`group hover:bg-slate-800/30 transition-all ${
                                      isChecked ? "bg-cyan-950/20" : pIdx % 2 === 0 ? "bg-slate-900/10" : "bg-slate-900/20"
                                    }`}
                                  >
                                    {/* Model identifier with internal checkbox */}
                                    <td className="py-3.5 px-3 align-middle text-left">
                                      <div className="flex items-center gap-3 justify-start pl-1">
                                        <label className="relative inline-flex items-center justify-center cursor-pointer h-5 w-5 shrink-0">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleModelCompare(p.model)}
                                            className="sr-only peer"
                                          />
                                          <div className="w-4.5 h-4.5 border border-slate-600 rounded bg-slate-940 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                                            {isChecked && <div className="w-1.5 h-2 border-r-2 border-b-2 border-black rotate-45 transform -translate-y-[1px]" />}
                                          </div>
                                        </label>
                                        <span className="font-mono font-bold text-cyan-400 select-all whitespace-normal break-words leading-tight text-sm">
                                          {p.model}
                                        </span>
                                      </div>
                                    </td>

                                    {/* Package */}
                                    <td className="py-3.5 px-3 text-slate-300 font-mono text-center align-middle">
                                      {renderDimValue(p.packageStyle || (p.dimensions ? p.dimensions.replace(/\s*x\s*/gi, "x") : ""))}
                                    </td>

                                    {/* Dynamic RowSpan Product Images */}
                                    {imageSpans[pIdx] !== undefined && (
                                      <td rowSpan={imageSpans[pIdx]} className="py-2 px-1.5 text-center align-middle border-x border-slate-850/80 bg-slate-950/20">
                                        <div 
                                          className="flex flex-col items-center justify-center bg-slate-900/60 p-2 rounded-lg border border-slate-800 shadow-inner max-w-[110px] mx-auto" 
                                          style={{ 
                                            height: `${Math.min(350, imageSpans[pIdx] * 52)}px`, 
                                            minHeight: '80px', 
                                            maxHeight: `${imageSpans[pIdx] * 62}px` 
                                          }}
                                        >
                                          <img
                                            src={resolveImagePath(p.image)}
                                            alt={`${p.packageStyle || p.dimensions} package photorelays representation`}
                                            referrerPolicy="no-referrer"
                                            className="object-contain w-full h-full max-h-[90%]"
                                          />
                                        </div>
                                      </td>
                                    )}

                                    {/* Number of Output Groups */}
                                    <td className="py-3.5 px-3 text-slate-300 text-center font-semibold align-middle">
                                      {p.outputGroups || p.contactForm}
                                    </td>

                                    {/* Output voltage / Transient voltage */}
                                    <td className="py-3.5 px-3 text-slate-300 text-center font-semibold align-middle">
                                      {p.outputVoltage || p.tempRange}
                                    </td>

                                    {/* Output Current */}
                                    <td className="py-3.5 px-3 text-slate-300 text-center font-semibold align-middle">
                                      {p.outputCurrent || p.contactLoad}
                                    </td>

                                    {/* On-Resistance */}
                                    <td className="py-3.5 px-3 text-slate-300 text-center font-semibold align-middle">
                                      {p.onResistance || p.vibration}
                                    </td>

                                    {/* Panasonic & Omron Benchmarking */}
                                    <td className="py-3.5 px-3 text-slate-300 text-center font-sans italic align-middle">
                                      {p.benchmarking}
                                    </td>

                                    {/* Specs Action Button */}
                                    <td className="py-3.5 px-1.5 text-center align-middle">
                                      <button
                                        onClick={() => {
                                          setActiveSpecProduct(p);
                                          resetZoomAndDrag();
                                        }}
                                        className="inline-flex items-center justify-center w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-semibold tracking-wide transition-all shadow-md active:scale-95 whitespace-nowrap"
                                      >
                                        View Specs
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }

                              if (category.id === "time_relays") {
                                return (
                                  <tr
                                    key={p.model}
                                    className={`group hover:bg-slate-800/30 transition-all ${
                                      isChecked ? "bg-cyan-950/20" : pIdx % 2 === 0 ? "bg-slate-900/10" : "bg-slate-900/20"
                                    }`}
                                  >
                                    {/* Product Model Column with Checkbox inside */}
                                    <td className="py-3.5 px-3 align-middle text-left font-mono font-bold text-cyan-400">
                                      <div className="flex items-center gap-3 justify-start pl-1">
                                        <label className="relative inline-flex items-center justify-center cursor-pointer h-5 w-5 shrink-0">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleModelCompare(p.model)}
                                            className="sr-only peer"
                                          />
                                          <div className="w-4.5 h-4.5 border border-slate-600 rounded bg-slate-950 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                                            {isChecked && <div className="w-1.5 h-2 border-r-2 border-b-2 border-black rotate-45 transform -translate-y-[1px]" />}
                                          </div>
                                        </label>
                                        <span className="text-sm select-all whitespace-normal break-words leading-tight">{p.model}</span>
                                      </div>
                                    </td>

                                    {/* Product Picture Column */}
                                    <td className="py-2.5 px-2 text-center align-middle">
                                      {p.image && (
                                        <div className="h-14 w-14 rounded-lg bg-slate-900 border border-slate-800 shadow-inner overflow-hidden flex items-center justify-center mx-auto p-1 hover:scale-105 transition-transform duration-200">
                                          <img
                                            src={resolveImagePath(p.image)}
                                            alt={`${p.model} photo`}
                                            referrerPolicy="no-referrer"
                                            className="object-contain h-full w-full"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* Dimensions and Package */}
                                    <td className="py-3.5 px-3 align-middle text-center">
                                      {(() => {
                                        const { size, desc } = formatDimensions(p.dimensions || "");
                                        return (
                                          <div className="flex flex-col items-center text-center">
                                            <span className="font-mono font-bold text-white text-sm whitespace-nowrap">{renderDimValue(size || p.dimensions)}</span>
                                            {size && <span className="text-xs text-slate-400 mt-0.5 leading-tight font-sans max-w-full block">{desc}</span>}
                                          </div>
                                        );
                                      })()}
                                    </td>

                                    {/* Temperature range (℃) */}
                                    <td className="py-3.5 px-3 text-slate-300 align-middle text-center">
                                      {renderTempRange(p.tempRange || "")}
                                    </td>

                                    {/* Number of Output Groups */}
                                    <td className="py-3.5 px-3 text-slate-200 text-sm font-semibold whitespace-nowrap align-middle text-center font-mono">
                                      {p.contactForm}
                                    </td>

                                    {/* Vibration */}
                                    <td className="py-3.5 px-3 align-middle text-center">
                                      <div className="flex flex-col gap-1 items-center text-center max-w-full">
                                        {(p.vibration || "").split(/\s*\|\s*/).map((vPart, idx) => (
                                          <span key={idx} className="text-xs sm:text-xs text-slate-300 leading-tight font-sans block">
                                            {vPart}
                                          </span>
                                        ))}
                                      </div>
                                    </td>

                                    {/* Contact Load and Lifetime */}
                                    <td className="py-3.5 px-3 text-slate-300 align-middle text-center">
                                      {renderContactLoadHelper(p.contactLoad || "")}
                                    </td>

                                    {/* Benchmarking Model */}
                                    <td className="py-3.5 px-3 text-slate-300 text-center font-sans italic align-middle">
                                      {p.benchmarking}
                                    </td>

                                    {/* Specs Action Button */}
                                    <td className="py-3.5 px-1.5 text-center align-middle">
                                      <button
                                        onClick={() => {
                                          setActiveSpecProduct(p);
                                          resetZoomAndDrag();
                                        }}
                                        className="inline-flex items-center justify-center w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-semibold tracking-wide transition-all shadow-md active:scale-95 whitespace-nowrap"
                                      >
                                        View Specs
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }

                              if (category.id === "sealed_optocouplers") {
                                return (
                                  <tr
                                    key={p.model}
                                    className={`group hover:bg-slate-800/30 transition-all ${
                                      isChecked ? "bg-cyan-950/20" : pIdx % 2 === 0 ? "bg-slate-900/10" : "bg-slate-900/20"
                                    }`}
                                  >
                                    {/* Product Model Column with Checkbox inside */}
                                    <td className="py-3.5 px-3 align-middle text-left font-mono font-bold text-cyan-400">
                                      <div className="flex items-center gap-3 justify-start pl-1">
                                        <label className="relative inline-flex items-center justify-center cursor-pointer h-5 w-5 shrink-0">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleModelCompare(p.model)}
                                            className="sr-only peer"
                                          />
                                          <div className="w-4.5 h-4.5 border border-slate-600 rounded bg-slate-950 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                                            {isChecked && <div className="w-1.5 h-2 border-r-2 border-b-2 border-black rotate-45 transform -translate-y-[1px]" />}
                                          </div>
                                        </label>
                                        <span className="text-sm select-all whitespace-normal break-words leading-tight">{p.model}</span>
                                      </div>
                                    </td>

                                    {/* Product Picture Column */}
                                    <td className="py-2.5 px-2 text-center align-middle">
                                      {p.image && (
                                        <div className="h-14 w-14 rounded-lg bg-slate-900 border border-slate-800 shadow-inner overflow-hidden flex items-center justify-center mx-auto p-1 hover:scale-105 transition-transform duration-200">
                                          <img
                                            src={resolveImagePath(p.image)}
                                            alt={`${p.model} photo`}
                                            referrerPolicy="no-referrer"
                                            className="object-contain h-full w-full"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* Dimensions and Package */}
                                    <td className="py-3.5 px-3 align-middle text-center">
                                      {(() => {
                                        const { size, desc } = formatDimensions(p.dimensions || "");
                                        return (
                                          <div className="flex flex-col items-center text-center">
                                            <span className="font-mono font-bold text-white text-sm whitespace-nowrap">{renderDimValue(size || p.dimensions)}</span>
                                            {size && <span className="text-xs text-slate-400 mt-0.5 leading-tight font-sans max-w-full block">{desc}</span>}
                                          </div>
                                        );
                                      })()}
                                    </td>

                                    {/* Temperature range (℃) */}
                                    <td className="py-3.5 px-3 text-slate-300 align-middle text-center">
                                      {renderTempRange(p.tempRange || "")}
                                    </td>

                                    {/* Number of Output Groups */}
                                    <td className="py-3.5 px-3 text-slate-200 text-sm font-semibold whitespace-nowrap align-middle text-center font-mono">
                                      {p.contactForm}
                                    </td>

                                    {/* Vibration */}
                                    <td className="py-3.5 px-3 align-middle text-center">
                                      <div className="flex flex-col gap-1 items-center text-center max-w-full">
                                        {(p.vibration || "").split(/\s*\|\s*/).map((vPart, idx) => (
                                          <span key={idx} className="text-xs sm:text-xs text-slate-300 leading-tight font-sans block">
                                            {vPart}
                                          </span>
                                        ))}
                                      </div>
                                    </td>

                                    {/* Main Parameters */}
                                    <td className="py-3.5 px-3 text-slate-300 align-middle text-center">
                                      <div className="flex flex-col gap-1 items-center text-center max-w-full leading-tight">
                                        {(p.contactLoad || "").split(/\s*;\s*/).map((paramPart, idx) => (
                                          <span key={idx} className="font-sans text-xs text-slate-100 font-medium block">
                                            {paramPart}
                                          </span>
                                        ))}
                                      </div>
                                    </td>

                                    {/* Benchmarking Model */}
                                    <td className="py-3.5 px-3 text-slate-300 text-center font-sans italic align-middle">
                                      {p.benchmarking}
                                    </td>

                                    {/* Specs Action Button */}
                                    <td className="py-3.5 px-1.5 text-center align-middle">
                                      <button
                                        onClick={() => {
                                          setActiveSpecProduct(p);
                                          resetZoomAndDrag();
                                        }}
                                        className="inline-flex items-center justify-center w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-semibold tracking-wide transition-all shadow-md active:scale-95 whitespace-nowrap"
                                      >
                                        View Specs
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }

                              // Standard row layout
                              return (
                                <tr
                                  key={p.model}
                                  className={`group hover:bg-slate-800/30 transition-all ${
                                    isChecked ? "bg-cyan-950/20" : pIdx % 2 === 0 ? "bg-slate-900/10" : "bg-slate-900/20"
                                  }`}
                                >
                                  {/* Checkbox Selector  */}
                                  <td className="py-3.5 px-1.5 text-center align-middle">
                                    <label className="relative inline-flex items-center justify-center cursor-pointer h-5 w-5 mx-auto">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleModelCompare(p.model)}
                                        className="sr-only peer"
                                      />
                                      <div className="w-4.5 h-4.5 border border-slate-600 rounded bg-slate-950 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                                        {isChecked && <div className="w-1.5 h-2 border-r-2 border-b-2 border-black rotate-45 transform -translate-y-[1px]" />}
                                      </div>
                                    </label>
                                  </td>

                                  {/* Model identifier */}
                                  <td className="py-3.5 px-3 font-mono font-bold text-cyan-400 select-all align-middle">
                                    <div className="flex items-center justify-center gap-1.5">
                                      {p.image && (
                                        <div className="h-8 w-8 rounded bg-slate-900 border border-slate-850 overflow-hidden flex items-center justify-center shrink-0">
                                          <img
                                            src={resolveImagePath(p.image)}
                                            alt={p.model}
                                            referrerPolicy="no-referrer"
                                            className="object-cover h-full w-full"
                                          />
                                        </div>
                                      )}
                                      <span className="text-sm">{p.model}</span>
                                    </div>
                                  </td>

                                  {/* Package designators */}
                                  <td className="py-3.5 px-3 align-middle text-center">
                                    {(() => {
                                      const { size, desc } = formatDimensions(p.dimensions);
                                      return (
                                        <div className="flex flex-col items-center text-center">
                                          <span className="font-mono font-bold text-white text-sm whitespace-nowrap">{renderDimValue(size || (p.dimensions ? p.dimensions.replace(/\s*x\s*/gi, "x") : ""))}</span>
                                          {size && <span className="text-xs text-slate-400 mt-0.5 leading-tight font-sans max-w-full block">{desc}</span>}
                                        </div>
                                      );
                                    })()}
                                  </td>

                                  {/* Heat specs */}
                                  <td className="py-3.5 px-3 text-slate-300 align-middle text-center">
                                    {renderTempRange(p.tempRange)}
                                  </td>

                                  {/* Contact configuration */}
                                  <td className="py-3.5 px-3 text-slate-200 text-xs md:text-sm font-semibold align-middle text-center leading-normal">
                                    <div className="flex flex-col gap-0.5 justify-center items-center">
                                      {cleanContactForm(p.contactForm).split(/,\s*/).map((part, pIdx) => (
                                        <span key={pIdx} className="block whitespace-nowrap">
                                          {part}
                                        </span>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Shocks & Vibration */}
                                  <td className="py-3.5 px-3 align-middle text-center">
                                    <div className="flex flex-col gap-1 items-center text-center max-w-full">
                                      {p.vibration.split(/\s*\|\s*/).map((vPart, idx) => (
                                        <span key={idx} className="text-xs sm:text-sm text-slate-300 leading-tight font-sans block">
                                          {vPart}
                                        </span>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Rated power profile */}
                                  <td className="py-3.5 px-3 align-middle text-center">
                                    {renderContactLoadHelper(p.contactLoad)}
                                  </td>

                                  {/* Benchmarking crosses */}
                                  <td className="py-3.5 px-3 text-slate-300 text-sm italic font-sans align-middle text-center" title={p.benchmarking}>
                                    {p.benchmarking}
                                  </td>

                                  {/* Expand Details View */}
                                  <td className="py-3.5 px-1.5 text-center align-middle">
                                    <button
                                      onClick={() => {
                                        setActiveSpecProduct(p);
                                        resetZoomAndDrag();
                                      }}
                                      className="inline-flex items-center justify-center w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-semibold tracking-wide transition-all shadow-md active:scale-95 whitespace-nowrap"
                                    >
                                      View Specs
                                    </button>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Floating comparison drawer */}
      <AnimatePresence>
        {selectedProductsForComparison.length > 0 && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[#000_0px_10px_30px]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400 text-sm hidden sm:block">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold flex items-center gap-1.5">
                  Comparison Stack:{" "}
                  <span className="px-2 py-0.5 bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-full">
                    {selectedProductsForComparison.length}
                  </span>
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5 max-w-[280px] sm:max-w-md truncate">
                  {selectedProductsForComparison.map((p) => p.model).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={clearAllComparison}
                className="w-1/2 sm:w-auto px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Clear Stack
              </button>
              <button
                onClick={() => setIsCompareOpen(true)}
                className="w-1/2 sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10"
              >
                <Shuffle size={14} /> Compare Metrics
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl bg-[#0d1527] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Close pin */}
              <button
                onClick={() => setIsCompareOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800/80 rounded-xl transition-all"
              >
                <X size={20} />
              </button>

              <div className="p-4 sm:p-6 border-b border-slate-800">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-cyan-400/10 text-cyan-400 text-xs font-semibold rounded-full mb-1">
                  Comparing {selectedProductsForComparison.length} Models
                </span>
                <h3 className="text-xl font-bold font-display text-white">Side-by-Side Parametric Matrix</h3>
                <p className="text-slate-400 text-xs mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>Parameters carrying differences are automatically highlighted in <span className="text-amber-400 font-semibold bg-amber-500/10 px-1 py-0.5 rounded">amber</span> to ease cross-referencing.</span>
                  <span className="inline-block sm:hidden text-cyan-400 animate-pulse font-medium">📱 Swipe table horizontally left & right</span>
                </p>
              </div>

              {/* Param table */}
              <div className="overflow-auto flex-1 p-4 sm:p-6 scrollbar-thin">
                {(() => {
                  const isComparingPhotoRelays = selectedProductsForComparison.length > 0 && selectedProductsForComparison.every(
                    (p) => CATALOG_CATEGORIES.find(c => c.products.some(pr => pr.model === p.model))?.id === "plastic_photorelay"
                  );

                  // Collect value lists for individual cell-level mismatch detection
                  const allDimensionsVals = selectedProductsForComparison.map((p) => p.packageStyle || p.dimensions || "");
                  const allTempRangeVals = selectedProductsForComparison.map((p) => p.outputVoltage || p.tempRange || "");
                  const allContactFormVals = selectedProductsForComparison.map((p) => 
                    isComparingPhotoRelays ? (p.outputGroups || p.contactForm || "") : cleanContactForm(p.contactForm || "")
                  );
                  const allVibrationVals = selectedProductsForComparison.map((p) => p.onResistance || p.vibration || "");
                  const allContactLoadVals = selectedProductsForComparison.map((p) => p.outputCurrent || p.contactLoad || "");
                  const allBenchmarkingVals = selectedProductsForComparison.map((p) => p.benchmarking || "");

                  // Calculate a robust minimum width so items are never squashed into columns under 150px
                  const tableMinWidth = 130 + (selectedProductsForComparison.length * 160);

                  return (
                    <table 
                      className="w-full border-collapse border border-slate-800/90 font-sans text-xs sm:text-sm table-fixed"
                      style={{ minWidth: `${tableMinWidth}px` }}
                    >
                      <thead>
                        <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono tracking-wider text-[10px] sm:text-xs uppercase">
                          <th className="p-2 sm:p-4 border-r border-slate-800 text-center align-middle w-[130px] sm:w-[180px] min-w-[130px] sm:min-w-[180px]">Parameters</th>
                          {selectedProductsForComparison.map((p) => {
                            return (
                              <th
                                key={p.model}
                                className="p-2 sm:p-4 border-r border-slate-800 text-cyan-400 font-bold font-mono text-xs sm:text-sm text-center align-middle w-[160px] sm:w-[220px] min-w-[160px] sm:min-w-[220px]"
                              >
                                {p.model}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {/* Package */}
                        <tr className={mismatchKeys.dimensions ? "bg-amber-500/[0.04]" : "hover:bg-slate-900/30"}>
                          <td className="p-2 sm:p-4 border-r border-slate-800 font-semibold text-slate-400 text-center align-middle">
                            {isComparingPhotoRelays ? "Package Style" : "Package & Dimensions"}
                          </td>
                          {selectedProductsForComparison.map((p) => {
                            const val = p.packageStyle || p.dimensions || "";
                            const isMismatched = isCellValMismatch(val, allDimensionsVals);
                            return (
                              <td
                                key={p.model}
                                className={`p-2 sm:p-4 border-r border-slate-800 font-mono leading-relaxed text-center align-middle ${
                                  isMismatched ? "text-amber-400 font-bold" : "text-white"
                                }`}
                              >
                                {renderDimValue(p.packageStyle || (p.dimensions ? p.dimensions.replace(/\s*x\s*/gi, "x") : ""))}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Temp range / Output Voltage */}
                        <tr className={mismatchKeys.tempRange ? "bg-amber-500/[0.04]" : "hover:bg-slate-900/30"}>
                          <td className="p-2 sm:p-4 border-r border-slate-800 font-semibold text-slate-400 text-center align-middle">
                            {isComparingPhotoRelays ? "Output Voltage / Transient Voltage" : "Operating Temperature"}
                          </td>
                          {selectedProductsForComparison.map((p) => {
                            const val = p.outputVoltage || p.tempRange || "";
                            const isMismatched = isCellValMismatch(val, allTempRangeVals);
                            return (
                              <td
                                key={p.model}
                                className={`p-2 sm:p-4 border-r border-slate-800 text-center align-middle ${
                                  isMismatched ? "text-amber-400 font-bold" : "text-white"
                                }`}
                              >
                                {isComparingPhotoRelays ? (
                                  <span className={`font-mono font-bold text-center block text-xs sm:text-sm ${isMismatched ? "text-amber-400 font-bold" : "text-white"}`}>{p.outputVoltage || p.tempRange}</span>
                                ) : (
                                  renderTempRange(p.tempRange || "", isMismatched ? "text-amber-400 font-bold" : "text-slate-200")
                                )}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Contact Form / Groups */}
                        <tr className={mismatchKeys.contactForm ? "bg-amber-500/[0.04]" : "hover:bg-slate-900/30"}>
                          <td className="p-2 sm:p-4 border-r border-slate-800 font-semibold text-slate-400 text-center align-middle">
                            {isComparingPhotoRelays ? "Number of Output Groups" : "Contact Configuration"}
                          </td>
                          {selectedProductsForComparison.map((p) => {
                            const val = isComparingPhotoRelays ? (p.outputGroups || p.contactForm || "") : cleanContactForm(p.contactForm || "");
                            const isMismatched = isCellValMismatch(val, allContactFormVals);
                            return (
                              <td
                                key={p.model}
                                className={`p-2 sm:p-4 border-r border-slate-800 font-semibold text-center align-middle ${
                                  isMismatched ? "text-amber-400 font-bold" : "text-white"
                                }`}
                              >
                                {isComparingPhotoRelays ? (p.outputGroups || p.contactForm) : cleanContactForm(p.contactForm || "")}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Vibration / On-Resistance */}
                        <tr className={mismatchKeys.vibration ? "bg-amber-500/[0.04]" : "hover:bg-slate-900/30"}>
                          <td className="p-2 sm:p-4 border-r border-slate-800 font-semibold text-slate-400 text-center align-middle">
                            {isComparingPhotoRelays ? "On-Resistance" : "Vibration Tolerance"}
                          </td>
                          {selectedProductsForComparison.map((p) => {
                            const val = p.onResistance || p.vibration || "";
                            const isMismatched = isCellValMismatch(val, allVibrationVals);
                            return (
                              <td
                                key={p.model}
                                className={`p-2 sm:p-4 border-r border-slate-800 leading-relaxed text-center align-middle ${
                                  isMismatched ? "text-amber-400 font-bold" : "text-slate-350"
                                }`}
                              >
                                <div className="flex flex-col items-center justify-center text-center gap-1">
                                  {(p.onResistance || p.vibration || "").split(/\s*\|\s*/).map((vPart, idx) => (
                                    <span key={idx} className="block text-[11px] sm:text-xs leading-tight">
                                      {vPart}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            );
                          })}
                        </tr>

                        {/* Load rating / Output Current */}
                        <tr className={mismatchKeys.contactLoad ? "bg-amber-500/[0.04]" : "hover:bg-slate-900/30"}>
                          <td className="p-2 sm:p-4 border-r border-slate-800 font-semibold text-slate-400 text-center align-middle">
                            {isComparingPhotoRelays ? "Output Current" : "Contact Rating & Life"}
                          </td>
                          {selectedProductsForComparison.map((p) => {
                            const val = p.outputCurrent || p.contactLoad || "";
                            const isMismatched = isCellValMismatch(val, allContactLoadVals);
                            return (
                              <td
                                key={p.model}
                                className={`p-2 sm:p-4 border-r border-slate-800 text-center align-middle ${
                                  isMismatched ? "text-amber-400 font-bold" : "text-white"
                                }`}
                              >
                                {isComparingPhotoRelays ? (
                                  <span className={`font-semibold block ${isMismatched ? "text-amber-400" : "text-white"}`}>{p.outputCurrent || p.contactLoad}</span>
                                ) : (
                                  renderContactLoadHelper(
                                    p.outputCurrent || p.contactLoad || "",
                                    "text-xs sm:text-sm",
                                    "items-center text-center",
                                    isMismatched ? "text-amber-400 font-bold" : "text-slate-200"
                                  )
                                )}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Benchmarking Crosses */}
                        <tr className={mismatchKeys.benchmarking ? "bg-amber-500/[0.04]" : "hover:bg-slate-900/30"}>
                          <td className="p-2 sm:p-4 border-r border-slate-800 font-semibold text-slate-400 text-center align-middle">
                            {isComparingPhotoRelays ? "Panasonic and Omron Benchmarking Models" : "Cross-reference Analogs"}
                          </td>
                          {selectedProductsForComparison.map((p) => {
                            const val = p.benchmarking || "";
                            const isMismatched = isCellValMismatch(val, allBenchmarkingVals);
                            return (
                              <td
                                key={p.model}
                                className={`p-2 sm:p-4 border-r border-slate-800 italic text-center align-middle ${
                                  isMismatched ? "text-amber-400 font-bold" : "text-slate-300"
                                }`}
                              >
                                {p.benchmarking}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              {/* Actions Footer */}
              <div className="p-6 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Close Parametric Matrix
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const list = selectedProductsForComparison.map((p) => p.model);
                      onSelectedRequestProducts(list);
                      setIsCompareOpen(false);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                  >
                    Request Quotation for all ({selectedProductsForComparison.length})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Tech Specifications & Interactive Simulation Modal */}
      <AnimatePresence>
        {activeSpecProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#0d1527] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Close pin */}
              <button
                onClick={() => setActiveSpecProduct(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800/80 rounded-xl z-10 transition-all shadow-md"
              >
                <X size={20} />
              </button>

              <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-16 sm:pr-20">
                <div>
                  <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded font-bold font-mono">
                    Specifications Details
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
                    {activeSpecProduct.model}
                    <span className="text-sm text-slate-400 font-mono font-normal">({activeSpecProduct.outputGroups || activeSpecProduct.contactForm})</span>
                  </h3>
                </div>
              </div>

              {/* Specs detailed columns + simulation container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
                {/* Tech parameter checklist */}
                <div className="lg:col-span-5 p-6 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
                  {(() => {
                    const isPhotoRelay = CATALOG_CATEGORIES.find(c => c.products.some(pr => pr.model === activeSpecProduct.model))?.id === "plastic_photorelay";
                    return (
                      <>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono text-slate-400 text-center mb-4">Product Attributes</h4>
                        <div className="divide-y divide-slate-800/60 w-full max-w-sm mx-auto">
                          <div className="py-3 flex flex-col items-center justify-center text-center gap-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              {isPhotoRelay ? "Package" : "Housing details"}
                            </div>
                            <div className="text-xs text-white leading-relaxed font-semibold">{renderDimValue(activeSpecProduct.packageStyle || (activeSpecProduct.dimensions ? activeSpecProduct.dimensions.replace(/\s*x\s*/gi, "x") : ""))}</div>
                          </div>
                          <div className="py-3 flex flex-col items-center justify-center text-center gap-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              {isPhotoRelay ? "Output Voltage / Transient Voltage" : "Temp Range"}
                            </div>
                            <div className="text-xs text-white font-mono font-medium">{activeSpecProduct.outputVoltage || activeSpecProduct.tempRange}</div>
                          </div>
                          <div className="py-3 flex flex-col items-center justify-center text-center gap-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              {isPhotoRelay ? "Number of Output Groups" : "Contact Form"}
                            </div>
                            <div className="text-xs text-cyan-400 font-bold tracking-wide">{activeSpecProduct.outputGroups || activeSpecProduct.contactForm}</div>
                          </div>
                          <div className="py-3 flex flex-col items-center justify-center text-center gap-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              {isPhotoRelay ? "On-Resistance" : "Vibration"}
                            </div>
                            <div className="text-xs text-slate-300 leading-normal font-medium text-center">
                              {(activeSpecProduct.onResistance || activeSpecProduct.vibration || "").split(/\s*\|\s*/).map((v, idx) => (
                                <span key={idx} className="block">{v}</span>
                              ))}
                            </div>
                          </div>
                          <div className="py-3 flex flex-col items-center justify-center text-center gap-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              {isPhotoRelay ? "Output Current" : "Load profile"}
                            </div>
                            {isPhotoRelay ? (
                              <div className="text-xs text-white font-mono font-medium">{activeSpecProduct.outputCurrent || activeSpecProduct.contactLoad}</div>
                            ) : (
                              renderContactLoadHelper(activeSpecProduct.contactLoad || "", "text-xs")
                            )}
                          </div>
                          <div className="py-3 flex flex-col items-center justify-center text-center gap-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              {isPhotoRelay ? "Panasonic and Omron Benchmarking Models" : "Benchmark Cross"}
                            </div>
                            <div className="text-xs text-slate-300 italic font-medium">{activeSpecProduct.benchmarking}</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Dynamic SVG Schematic Drawing Area */}
                <div className="lg:col-span-7 bg-[#060a14] p-6 flex flex-col justify-between min-h-[480px]">
                  {/* Mode Selector Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => {
                          playTechBeep(1000, 0.05);
                          setSpecViewTab("photo");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          specViewTab === "photo" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Eye size={13} />
                        Component Photo
                      </button>
                      <button
                        onClick={() => {
                          playTechBeep(1100, 0.05);
                          setSpecViewTab("schematic");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          specViewTab === "schematic" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Zap size={13} />
                        Internal Schematic
                      </button>
                      <button
                        onClick={() => {
                          playTechBeep(1200, 0.05);
                          setSpecViewTab("stress");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          specViewTab === "stress" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Shuffle size={13} />
                        Stress Simulator
                      </button>
                    </div>

                    {specViewTab === "schematic" && (
                      <div className="flex items-center gap-1.5 bg-[#0d1527] p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.1))}
                          className="p-1 hover:bg-[#16223f] text-slate-300 rounded transition-colors"
                          title="Zoom out"
                        >
                          <ZoomOut size={14} />
                        </button>
                        <span className="text-[11px] font-mono text-slate-400 px-1">{Math.round(zoomScale * 100)}%</span>
                        <button
                          onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.1))}
                          className="p-1 hover:bg-[#16223f] text-slate-300 rounded transition-colors"
                          title="Zoom in"
                        >
                          <ZoomIn size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setZoomScale(1);
                            setDragPos({ x: 0, y: 0 });
                          }}
                          className="p-1 text-[10px] font-mono hover:bg-[#16223f] text-slate-400 rounded transition-all px-1.5"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rendering SVG depending on active component logic */}
                  {specViewTab === "photo" ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 min-h-[300px]">
                      {isPhotoAvailable ? (
                        <div 
                          className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center shadow-lg bg-slate-900 border border-slate-800 p-4 transition-all duration-300"
                          style={{
                            maxWidth: `${VIEW_SPECS_PHOTO_SIZE}px`,
                            maxHeight: `${VIEW_SPECS_PHOTO_SIZE}px`
                          }}
                        >
                          <img
                            src={productPhotoUrl}
                            alt={`${activeSpecProduct.model} components view`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain transition-transform duration-300 hover:scale-110 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                            onError={() => {
                              setPhotoAttempt((prev) => {
                                const stage = prev[currentModel] || "local";
                                if (stage === "local") {
                                  return { ...prev, [currentModel]: "fallback" };
                                } else {
                                  return { ...prev, [currentModel]: "failed" };
                                }
                              });
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-slate-500 text-xs text-center py-12">
                          No physical product photo available of this components package.
                        </div>
                      )}
                      
                      {activeSpecProduct.benchmarking && (
                        <p className="text-[10px] text-slate-400 mt-4 text-center italic font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800 leading-normal max-w-md">
                          Cross-reference analogue configuration: {activeSpecProduct.benchmarking}
                        </p>
                      )}
                    </div>
                  ) : specViewTab === "schematic" ? (
                    <div
                      onMouseDown={handleSchematicMouseDown}
                      onMouseMove={handleSchematicMouseMove}
                      onMouseUp={handleSchematicMouseUp}
                      onMouseLeave={handleSchematicMouseUp}
                      onTouchStart={handleSchematicTouchStart}
                      onTouchMove={handleSchematicTouchMove}
                      onTouchEnd={handleSchematicTouchEnd}
                      className="relative flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl overflow-hidden flex items-center justify-center cursor-move font-mono text-xs text-slate-500 touch-none select-none"
                    >
                      <div
                        style={{
                          transform: `translate(${dragPos.x}px, ${dragPos.y}px) scale(${zoomScale})`,
                          transition: (isDragging || touchStartDist !== null) ? "none" : "transform 0.15s ease-out",
                        }}
                        className="origin-center flex items-center justify-center"
                      >
                        {activeSpecProduct && isSchematicImageAvailable ? (
                          <div className="relative max-w-full max-h-[380px] rounded-lg overflow-hidden flex items-center justify-center bg-slate-950 p-2">
                            <img
                              src={schematicUrl}
                              alt={`${currentModel} internal schematic`}
                              referrerPolicy="no-referrer"
                              className="max-h-[380px] max-w-full object-contain select-none pointer-events-none"
                              onError={() => {
                                setSchematicUrlIndex((prev) => ({
                                  ...prev,
                                  [currentModel]: (prev[currentModel] || 0) + 1,
                                }));
                              }}
                            />
                          </div>
                        ) : (
                          /* Let's render the exact Relay state inside vector blocks */
                          <svg width="220" height="220" viewBox="0 0 220 220" className="select-none">
                            {/* Box layout */}
                            <rect x="10" y="10" width="200" height="200" rx="10" fill="#0d1527" stroke="#1e293b" strokeWidth="2" />
                            <line x1="10" x2="210" y1="50" y2="50" stroke="#1e293b" strokeDasharray="3 3" />
                            <text x="110" y="32" fill="#94a3b8" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                              INTERNAL SPEC SCHEMA
                            </text>

                            {/* If solid state / Mos relay */}
                            {(activeSpecProduct.model.includes("JG") || activeSpecProduct.model.startsWith("BC") || activeSpecProduct.model.startsWith("5GH")) ? (
                              <g>
                                {/* LED emitter side */}
                                <circle cx="50" cy="110" r="16" fill={simulatedCoilOn ? "#0e7490" : "#1e293b"} stroke="#0891b2" strokeWidth="2" />
                                {/* Diode triangle */}
                                <path d="M42,118 L58,110 L42,102 Z" fill="#fff" />
                                <line x1="58" y1="102" x2="58" y2="118" stroke="#fff" strokeWidth="2" />
                                {/* Optical Coupling waves */}
                                <g className={simulatedCoilOn ? "animate-pulse" : "opacity-30"}>
                                  <path d="M 80,102 Q 88,110 80,118" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="2 2" />
                                  <path d="M 94,102 Q 102,110 94,118" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="2 2" />
                                </g>
                                {/* MOSFET output channels */}
                                <rect
                                  x="120"
                                  y="90"
                                  width="50"
                                  height="40"
                                  rx="4"
                                  fill={simulatedCoilOn ? "#0284c7" : "#1e293b"}
                                  stroke="#0284c7"
                                  strokeWidth="2"
                                  className="transition-colors duration-300"
                                />
                                {/* Output switch status wire */}
                                <circle cx="145" cy="110" r="5" fill={simulatedCoilOn ? "#22c55e" : "#e2e8f0"} />
                                <text x="145" y="145" fill="#e2e8f0" textAnchor="middle" fontSize="9" fontFamily="monospace">
                                  {simulatedCoilOn ? "MOS CONDUCTING" : "MOS CUTOFF"}
                                </text>

                                {/* Pins text */}
                                <text x="25" y="113" fill="#64748b" fontSize="8">1</text>
                                <text x="180" y="113" fill="#64748b" fontSize="8">2</text>
                              </g>
                            ) : activeSpecProduct.model.includes("11JP") ? (
                              /* RF Switches / High isolation paths */
                              <g>
                                {/* Ground shielding plane */}
                                <rect x="40" y="80" width="140" height="70" rx="6" fill="#16223f" stroke="#334155" />
                                <text x="110" y="95" fill="#38bdf8" textAnchor="middle" fontSize="8" fontWeight="bold">50Ω COAX SWITCH</text>

                                {/* RF input lines */}
                                <line x1="30" y1="120" x2="70" y2="120" stroke="#f43f5e" strokeWidth="3" />
                                <circle cx="30" cy="120" r="4" fill="#f43f5e" />
                                <text x="30" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle">IN</text>

                                {/* Swivelling RF armature */}
                                <g transform={`rotate(${simulatedCoilOn ? 25 : 0}, 70, 120)`} className="transition-transform duration-300">
                                  <line x1="70" y1="120" x2="140" y2="120" stroke="#22c55e" strokeWidth="3" />
                                  <circle cx="140" cy="120" r="4" fill="#22c55e" />
                                </g>

                                {/* Output ports */}
                                <line x1="140" y1="120" x2="190" y2="120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
                                <circle cx="190" cy="120" r="4" fill="#38bdf8" />
                                <text x="190" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle">OUT A</text>

                                <line x1="140" y1="145" x2="190" y2="145" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
                                <circle cx="190" cy="145" r="4" fill="#38bdf8" />
                                <text x="190" y="160" fill="#94a3b8" fontSize="8" textAnchor="middle">OUT B</text>

                                <g className="opacity-90">
                                  <text x="110" y="165" fill="#f43f5e" fontSize="8" textAnchor="middle" fontWeight="bold">
                                    {simulatedCoilOn ? "ISOLATION B: >50dB" : "ISOLATION A: >50dB"}
                                  </text>
                                </g>
                              </g>
                            ) : (
                              /* Standard Coil Relay / Contactor configuration */
                              <g>
                                {/* Coil component */}
                                <g transform="translate(45, 95)">
                                  <rect x="0" y="0" width="30" height="50" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                  <path d="M 0,10 L 30,15 M 0,20 L 30,25 M 0,30 L 30,35 M 0,40 L 30,45" stroke="#f59e0b" strokeWidth="1.5" />
                                  <text x="15" y="-5" fill="#64748b" fontSize="8" textAnchor="middle">COIL</text>
                                  {simulatedCoilOn && (
                                    <circle cx="15" cy="25" r="8" fill="#eab308" className="animate-ping opacity-25" />
                                  )}
                                </g>

                                {/* Connection coil wires to inputs */}
                                <line x1="25" y1="105" x2="45" y2="105" stroke="#64748b" strokeWidth="1.5" />
                                <line x1="25" y1="135" x2="45" y2="135" stroke="#64748b" strokeWidth="1.5" />
                                <circle cx="25" cy="105" r="3" fill="#64748b" />
                                <circle cx="25" cy="135" r="3" fill="#64748b" />
                                <text x="18" y="108" fill="#94a3b8" fontSize="8">X1</text>
                                <text x="18" y="138" fill="#94a3b8" fontSize="8">X2</text>

                                {/* Armature linkage dashed line */}
                                <line
                                  x1="75"
                                  y1="120"
                                  x2="135"
                                  y2="120"
                                  stroke={simulatedCoilOn ? "#eab308" : "#475569"}
                                  strokeWidth="1.5"
                                  strokeDasharray="3 3"
                                />

                                {/* Switch Armature Logic */}
                                <circle cx="135" cy="120" r="3" fill="#3b82f6" />
                                {/* Swing arm */}
                                <g
                                  transform={`rotate(${simulatedCoilOn ? 18 : 0}, 135, 120)`}
                                  className="transition-transform duration-300 origin-[135px_120px]"
                                >
                                  <line x1="135" y1="120" x2="175" y2="120" stroke="#f1f5f9" strokeWidth="3" />
                                  <circle cx="175" cy="120" r="4" fill="#f1f5f9" />
                                </g>

                                {/* NC Terminal */}
                                <circle cx="175" cy="105" r="4.5" fill={simulatedCoilOn ? "#1e293b" : "#22c55e"} stroke="#475569" />
                                <line x1="175" y1="105" x2="195" y2="105" stroke="#64748b" strokeWidth="1.5" />
                                <text x="188" y="100" fill="#94a3b8" fontSize="8">NC</text>

                                {/* NO Terminal */}
                                <circle cx="179" cy="132" r="4.5" fill={simulatedCoilOn ? "#22c55e" : "#1e293b"} stroke="#475569" />
                                <line x1="179" y1="132" x2="195" y2="132" stroke="#64748b" strokeWidth="1.5" />
                                <text x="188" y="142" fill="#94a3b8" fontSize="8">NO</text>

                                {/* COM Terminal */}
                                <line x1="115" y1="120" x2="135" y2="120" stroke="#64748b" strokeWidth="1.5" />
                                <circle cx="115" cy="120" r="3" fill="#64748b" />
                                <text x="115" y="112" fill="#94a3b8" fontSize="8">COM</text>
                              </g>
                            )}
                          </svg>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between p-5 bg-[#0a0f1d] border border-slate-800 rounded-xl relative overflow-visible md:overflow-hidden font-sans text-slate-200 h-auto md:min-h-[420px]">
                      {/* Stress Tester Widget */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {/* Sliders Area */}
                        <div className="space-y-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                          <h5 className="text-[11px] font-bold tracking-wider text-cyan-400 font-mono uppercase flex items-center gap-1">
                            <Zap size={11} /> Load Configuration
                          </h5>
                          
                          {/* Current Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Load Current:</span>
                              <span className={stressCurrentPct > 120 ? "text-red-400 font-bold" : stressCurrentPct > 100 ? "text-yellow-400 font-semibold" : "text-emerald-400"}>
                                {((stressCurrentPct / 100) * parsedLimits.maxCurrent).toFixed(2)} A ({stressCurrentPct}%)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="175"
                              value={stressCurrentPct}
                              onChange={(e) => setStressCurrentPct(parseInt(e.target.value, 10))}
                              className="w-full h-1 bg-[#16223f] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>Min (0.1x)</span>
                              <span>Nominal ({parsedLimits.maxCurrent}A)</span>
                              <span>Overload (1.75x)</span>
                            </div>
                          </div>

                          {/* Voltage Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Path Voltage:</span>
                              <span className={stressVoltagePct > 120 ? "text-rose-400 font-bold" : stressVoltagePct > 100 ? "text-amber-400 font-semibold" : "text-emerald-400"}>
                                {((stressVoltagePct / 100) * parsedLimits.maxVoltage).toFixed(1)} V ({stressVoltagePct}%)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="175"
                              value={stressVoltagePct}
                              onChange={(e) => setStressVoltagePct(parseInt(e.target.value, 10))}
                              className="w-full h-1 bg-[#16223f] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>Min</span>
                              <span>Nominal ({parsedLimits.maxVoltage}V)</span>
                              <span>Overload</span>
                            </div>
                          </div>

                          {/* Temperature Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Ambient Temp:</span>
                              <span className={(stressTemp > parsedLimits.maxTemp || stressTemp < parsedLimits.minTemp) ? "text-red-400 font-bold" : "text-emerald-400"}>
                                {stressTemp} °C
                              </span>
                            </div>
                            <input
                              type="range"
                              min="-75"
                              max="150"
                              value={stressTemp}
                              onChange={(e) => setStressTemp(parseInt(e.target.value, 10))}
                              className="w-full h-1 bg-[#16223f] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>Extreme Cold (-75°C)</span>
                              <span>Room (25°C)</span>
                              <span>Extreme Heat (150°C)</span>
                            </div>
                          </div>

                          {/* Vibration Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Mechanical Vibration:</span>
                              <span className={stressVibe > 25 ? "text-red-400 font-bold" : stressVibe > 15 ? "text-yellow-400 font-semibold" : "text-emerald-400"}>
                                {stressVibe} G
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="45"
                              value={stressVibe}
                              onChange={(e) => setStressVibe(parseInt(e.target.value, 10))}
                              className="w-full h-1 bg-[#16223f] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>0G (Static)</span>
                              <span>15G (MIL standard)</span>
                              <span>45G (Shock bounds)</span>
                            </div>
                          </div>
                        </div>

                        {/* Diagnostics & Display Results Area */}
                        <div className="space-y-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                          <div className="space-y-3">
                            <h5 className="text-[11px] font-bold tracking-wider text-cyan-400 font-mono uppercase flex items-center gap-1">
                              <Eye size={11} /> Real-time Diagnostics
                            </h5>

                            {/* Status State Badge */}
                            <div className="flex items-center gap-2 bg-[#060a14] p-2.5 rounded-lg border border-slate-800 shadow-inner">
                              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Relay State:</span>
                              {cyclicWelds > 0 ? (
                                <span className="text-xs font-mono font-bold text-red-500 animate-pulse flex items-center gap-1">
                                  ● 💀 FAULT: CONTACTS WELDED
                                </span>
                              ) : (stressCurrentPct > 125 || stressVoltagePct > 125) ? (
                                <span className="text-xs font-mono font-bold text-rose-400 animate-pulse flex items-center gap-1">
                                  ● ⚠️ EXTREME OVERLOAD LIMIT
                                </span>
                              ) : (stressCurrentPct > 100 || stressVoltagePct > 100 || stressTemp > parsedLimits.maxTemp || stressTemp < parsedLimits.minTemp) ? (
                                <span className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1">
                                  ● 🟡 HIGH COMPONENT DEGRADATION
                                </span>
                              ) : (
                                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                                  ● 🟢 NOMINAL AEROSPACE RUN
                                </span>
                              )}
                            </div>

                            {/* Self-Heating and Expected Lifetime Stats */}
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div className="bg-[#060a14] p-2 rounded-lg border border-slate-850">
                                <p className="text-slate-500 text-[9px] uppercase tracking-wider">Joule Heating</p>
                                <p className="text-slate-200 mt-0.5 font-bold">
                                  +{( (stressCurrentPct/100) * (parsedLimits.maxCurrent) * (stressCurrentPct/100) * (parsedLimits.maxCurrent) * 0.15 ).toFixed(2)}°C
                                </p>
                              </div>
                              <div className="bg-[#060a14] p-2 rounded-lg border border-slate-850">
                                <p className="text-slate-500 text-[9px] uppercase tracking-wider">Est. MTBF Life</p>
                                <p className="text-cyan-400 mt-0.5 font-bold">
                                  {(() => {
                                    let factor = 1.0;
                                    if (stressCurrentPct > 100) factor *= Math.pow(stressCurrentPct/100, 3.5);
                                    if (stressVoltagePct > 100) factor *= Math.pow(stressVoltagePct/100, 2.5);
                                    if (stressTemp > parsedLimits.maxTemp) factor *= 2.2;
                                    if (stressTemp < parsedLimits.minTemp) factor *= 1.4;
                                    if (stressVibe > 15) factor *= 1.8;
                                    const expected = Math.max(12, Math.round(parsedLimits.defaultLife / factor));
                                    return expected.toLocaleString() + " cycles";
                                  })()}
                                </p>
                              </div>
                            </div>

                            {/* Miniature Oscilloscope Visualizer */}
                            <div className="h-16 bg-[#040811] rounded-lg border border-slate-800 shadow-inner overflow-hidden relative flex flex-col justify-center">
                              <div className="absolute top-1 left-2 text-[8px] text-emerald-500/80 font-mono font-bold flex items-center gap-1">
                                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" /> SIGNAL INTEGRITY OSCILLOSCOPE
                              </div>
                              <svg viewBox="0 0 300 40" className="w-full h-8" preserveAspectRatio="none">
                                <defs>
                                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.08" />
                                  </pattern>
                                </defs>
                                <rect width="300" height="40" fill="url(#grid)" />
                                {cyclicWelds > 0 ? (
                                  /* Permanent active high flatline (welded closed) */
                                  <line x1="0" y1="12" x2="300" y2="12" stroke="#ef4444" strokeWidth="1.5" />
                                ) : !isCyclicTesting ? (
                                  /* Perfect stationary line status */
                                  <path d="M 0,30 L 120,30 L 120,15 L 180,15 L 180,30 L 300,30" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                                ) : (
                                  /* Heavy fluctuating active square wave */
                                  <motion.path
                                    animate={{
                                      d: [
                                        `M 0,30 L 20,30 L 20,${15 + (stressVibe > 15 ? Math.random() * 6 - 3 : 0)} L 60,${15 + (stressVibe > 15 ? Math.random() * 6 - 3 : 0)} L 60,30 L 100,30 L 100,15 L 140,15 L 140,30 L 180,30 L 180,15 L 220,15 L 220,30 L 260,30 L 260,15 L 300,15`,
                                        `M 0,15 L 40,15 L 40,30 L 80,30 L 80,${15 + (stressVibe > 15 ? Math.random() * 6 - 3 : 0)} L 120,${15 + (stressVibe > 15 ? Math.random() * 6 - 3 : 0)} L 120,30 L 160,30 L 160,15 L 200,15 L 200,30 L 240,30 L 240,15 L 280,15 L 280,30 L 300,30`
                                      ]
                                    }}
                                    transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                                    fill="none"
                                    stroke={stressCurrentPct > 120 ? "#eab308" : "#22c55e"}
                                    strokeWidth="1.5"
                                  />
                                )}
                              </svg>
                            </div>
                          </div>

                          {/* Cyclic Test Dashboard Section */}
                          <div className="bg-[#060a14] p-3 rounded-lg border border-slate-800 space-y-2">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>Cycles Tested: <strong className="text-white">{cyclicCounter.toLocaleString()}</strong></span>
                              <span>Micro-Arcs: <strong className="text-amber-400">{cyclicFailures.toLocaleString()}</strong></span>
                              <span>Structural Welds: <strong className={cyclicWelds > 0 ? "text-red-500 font-bold" : "text-white"}>{cyclicWelds}</strong></span>
                            </div>

                            {cyclicWelds > 0 ? (
                              <button
                                onClick={() => {
                                  setCyclicCounter(0);
                                  setCyclicFailures(0);
                                  setCyclicWelds(0);
                                  setIsCyclicTesting(false);
                                  setSimRelayActive(false);
                                }}
                                className="w-full text-center py-2 bg-red-950/50 hover:bg-red-900/60 border border-red-800/80 rounded-xl text-xs font-mono font-bold text-red-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                💀 CONTACTS FUSED CLOSED. CLICK TO RESET CORES.
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const nextState = !isCyclicTesting;
                                  setIsCyclicTesting(nextState);
                                  playTechBeep(nextState ? 1300 : 900, 0.07);
                                }}
                                className={`w-full text-center py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  isCyclicTesting
                                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg animate-pulse"
                                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                                }`}
                              >
                                {isCyclicTesting ? "🛑 STOP CYCLIC ENDURANCE SIMULATOR" : "⚡ RUN AUTOMATED CYCLIC ENDURANCE TEST (10Hz)"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Sim Controllers */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-[10px] text-slate-500 font-mono">
                      {specViewTab === "schematic"
                        ? "Drag canvas to pan drawing area. Use plus / minus to scale."
                        : "High-resolution package physical outline. Click 'Internal Schematic' to check active circuitry."}
                    </p>
                    <button
                      onClick={() => {
                        const list = [activeSpecProduct.model];
                        onSelectedRequestProducts(list);
                        setActiveSpecProduct(null);
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      Request Offer for {activeSpecProduct.model}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
