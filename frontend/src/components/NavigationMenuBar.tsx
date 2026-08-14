import React, { useState, useRef, useEffect } from "react";
import { 
  Globe, 
  Building, 
  Sparkles, 
  ClipboardList, 
  ShieldAlert, 
  Compass, 
  Layers, 
  Shield, 
  Waves, 
  CloudRain, 
  ChevronDown, 
  Check, 
  Sliders, 
  Zap,
  Activity
} from "lucide-react";
import { GHANA_PRESETS, CLIMATE_SCENARIOS, LocationPreset } from "../types";

interface NavigationMenuBarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  showSafeHavens: boolean;
  onToggleSafeHavens: () => void;
  selectedScenarioId: string;
  onScenarioChange: (scenarioId: string) => void;
  onPresetSelect: (preset: LocationPreset) => void;
  tc: any;
  isDarkMode: boolean;
  stats?: any;
}

export default function NavigationMenuBar({
  activeScreen,
  setActiveScreen,
  showSafeHavens,
  onToggleSafeHavens,
  selectedScenarioId,
  onScenarioChange,
  onPresetSelect,
  tc,
  isDarkMode,
  stats
}: NavigationMenuBarProps) {
  const [presetsDropdownOpen, setPresetsDropdownOpen] = useState(false);
  const [scenariosDropdownOpen, setScenariosDropdownOpen] = useState(false);
  
  const presetsRef = useRef<HTMLDivElement>(null);
  const scenariosRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(event.target as Node)) {
        setPresetsDropdownOpen(false);
      }
      if (scenariosRef.current && !scenariosRef.current.contains(event.target as Node)) {
        setScenariosDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navTabs = [
    { id: "map", label: "Interactive Map", icon: <Globe className="w-3.5 h-3.5" />, badge: null },
    { id: "metrics", label: "Exposure & Assets", icon: <Building className="w-3.5 h-3.5" />, badge: stats?.exposedStructuresCount ? `${stats.exposedStructuresCount.toLocaleString()} units` : null },
    { id: "ai_report", label: "AI RAG Report", icon: <Sparkles className="w-3.5 h-3.5" />, badge: "Gemini" },
    { id: "action_plan", label: "Action Protocols", icon: <ClipboardList className="w-3.5 h-3.5" />, badge: null },
    { id: "safe_havens", label: "Safe Havens", icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: stats?.safeHavens?.length ? `${stats.safeHavens.length} nearby` : null },
    { id: "escape_route", label: "Escape Route", icon: <Compass className="w-3.5 h-3.5" />, badge: "Elevation" },
    { id: "historical_timeline", label: "Flood Archive", icon: <Layers className="w-3.5 h-3.5" />, badge: "1968-2024" }
  ];

  const currentScenario = CLIMATE_SCENARIOS.find(s => s.id === selectedScenarioId) || CLIMATE_SCENARIOS[0];

  return (
    <div className={`border-b ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md sticky top-[65px] z-30 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar">
          
          {/* LEFT: PRIMARY FEATURE NAVIGATION TABS */}
          <div className="flex items-center gap-1 shrink-0">
            {navTabs.map((tab) => {
              const isActive = activeScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? `bg-indigo-600 text-white shadow-md font-bold`
                      : `${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/70' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-slate-400"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-200 text-indigo-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: CONTROLS & TOGGLES (SAFE HAVENS, PRESETS, SCENARIOS) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            
            {/* 🏥 SAFE HAVENS TOGGLE (Crucial Requirement: Safe havens not shown by default, toggle on nav bar) */}
            <button
              onClick={onToggleSafeHavens}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                showSafeHavens
                  ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-bold hover:bg-emerald-600/30'
                  : `${isDarkMode ? 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`
              }`}
              title="Toggle Safe Havens visibility on Map"
            >
              <Shield className={`w-3.5 h-3.5 ${showSafeHavens ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden xs:inline">Safe Havens:</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                showSafeHavens ? 'bg-emerald-500 text-white shadow' : isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-200 text-slate-700'
              }`}>
                {showSafeHavens ? "ON" : "OFF"}
              </span>
            </button>

            {/* 🎯 PRESETS DROPDOWN */}
            <div className="relative" ref={presetsRef}>
              <button
                onClick={() => {
                  setPresetsDropdownOpen(!presetsDropdownOpen);
                  setScenariosDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  presetsDropdownOpen
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-950/30'
                    : `${isDarkMode ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-200'}`
                }`}
              >
                <Waves className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Presets</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${presetsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {presetsDropdownOpen && (
                <div className={`absolute right-0 top-full mt-1.5 w-64 rounded-xl border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDarkMode ? 'bg-slate-950/95 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
                } backdrop-blur-xl max-h-72 overflow-y-auto`}>
                  <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase text-slate-400 border-b border-slate-800/40 mb-1">
                    Select Ghana Floodplain Hotspot
                  </div>
                  {GHANA_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        onPresetSelect(preset);
                        setPresetsDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-900 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{preset.name}</div>
                        <div className="text-[10px] text-slate-500">{preset.region}</div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-bold">
                        {preset.dangerLevel}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 🌧️ SCENARIOS DROPDOWN */}
            <div className="relative" ref={scenariosRef}>
              <button
                onClick={() => {
                  setScenariosDropdownOpen(!scenariosDropdownOpen);
                  setPresetsDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  scenariosDropdownOpen
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-950/30'
                    : `${isDarkMode ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-200'}`
                }`}
              >
                <CloudRain className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden md:inline font-mono text-[11px] font-semibold">{currentScenario.name.split(" ")[0]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${scenariosDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {scenariosDropdownOpen && (
                <div className={`absolute right-0 top-full mt-1.5 w-72 rounded-xl border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDarkMode ? 'bg-slate-950/95 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
                } backdrop-blur-xl`}>
                  <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase text-slate-400 border-b border-slate-800/40 mb-1">
                    Simulate Climate Scenario
                  </div>
                  {CLIMATE_SCENARIOS.map((sc) => {
                    const isSelected = sc.id === selectedScenarioId;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => {
                          onScenarioChange(sc.id);
                          setScenariosDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                            : isDarkMode ? 'hover:bg-slate-900 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            {sc.name}
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                            {sc.description}
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 shrink-0 font-bold">
                          +{Math.round((sc.rainfallFactor - 1) * 100)}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
