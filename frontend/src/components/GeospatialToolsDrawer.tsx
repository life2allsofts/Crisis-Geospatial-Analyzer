import React from "react";
import { 
  X, 
  Globe, 
  Building, 
  Sparkles, 
  ClipboardList, 
  ShieldAlert, 
  Compass, 
  Layers, 
  Navigation, 
  Waves, 
  Settings as ControlsIcon,
  Zap,
  Sliders
} from "lucide-react";
import { GHANA_PRESETS, CLIMATE_SCENARIOS, LocationPreset } from "../types";

interface GeospatialToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  // Coordinate controls
  inputMode: "wgs84" | "utm30n";
  setInputMode: (mode: "wgs84" | "utm30n") => void;
  latInput: string;
  setLatInput: (val: string) => void;
  lngInput: string;
  setLngInput: (val: string) => void;
  easting: string;
  setEasting: (val: string) => void;
  northing: string;
  setNorthing: (val: string) => void;
  bufferRadius: number;
  setBufferRadius: (val: number) => void;
  selectedScenarioId: string;
  onScenarioChange: (id: string) => void;
  onPresetSelect: (preset: LocationPreset) => void;
  onUTMConvertAndAnalyze: () => void;
  onWGSAnalyze: () => void;
  isLoading: boolean;
  tc: any;
  isDarkMode: boolean;
}

export default function GeospatialToolsDrawer({
  isOpen,
  onClose,
  activeScreen,
  setActiveScreen,
  inputMode,
  setInputMode,
  latInput,
  setLatInput,
  lngInput,
  setLngInput,
  easting,
  setEasting,
  northing,
  setNorthing,
  bufferRadius,
  setBufferRadius,
  selectedScenarioId,
  onScenarioChange,
  onPresetSelect,
  onUTMConvertAndAnalyze,
  onWGSAnalyze,
  isLoading,
  tc,
  isDarkMode
}: GeospatialToolsDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Soft translucent backdrop for non-intrusive focus */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Floating Left Slide-Over Panel */}
      <div className={`fixed top-0 left-0 bottom-0 w-full sm:w-[400px] max-w-full ${isDarkMode ? 'bg-slate-950/95 text-slate-100 border-slate-800/80' : 'bg-white/95 text-slate-900 border-slate-200'} backdrop-blur-xl border-r z-50 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250`}>
        
        {/* Drawer Header */}
        <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-slate-900 bg-slate-950/70' : 'border-slate-200 bg-slate-50/70'} flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black font-display tracking-tight">
                Geospatial Tools & Presets
              </h3>
              <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-sans`}>
                Simulations, Grid Converters & Hotspots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white' 
                : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Tool Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* SECTION 1: ANALYTICAL SCREENS NAVIGATION */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
              📊 Jump to Analytical Views
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "map", name: "Interactive Flood Map", desc: "Interactive leaflet map & radius buffer", icon: <Globe className="w-4 h-4" /> },
                { id: "metrics", name: "Exposure & Population Assets", desc: "WorldPop density & structure tallies", icon: <Building className="w-4 h-4" /> },
                { id: "ai_report", name: "Generative AI Report", desc: "Gemini RAG hydrological risk reasoning", icon: <Sparkles className="w-4 h-4" /> },
                { id: "action_plan", name: "Action Plan & Mitigation", desc: "NADMO emergency protocols & citations", icon: <ClipboardList className="w-4 h-4" /> },
                { id: "safe_havens", name: "Safe Havens Directory", desc: "5 closest high-ground sanctuaries", icon: <ShieldAlert className="w-4 h-4" /> },
                { id: "escape_route", name: "Escape Route Profile", desc: "Evacuation cross-section elevation", icon: <Compass className="w-4 h-4" /> },
                { id: "historical_timeline", name: "Historical Inundations", desc: "Accra multi-decade flood archive", icon: <Layers className="w-4 h-4" /> }
              ].map((item) => {
                const isSelected = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveScreen(item.id);
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                        : `${isDarkMode ? 'bg-slate-900/40 border-slate-850 hover:bg-slate-900 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900'}`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`${isSelected ? 'text-indigo-400' : 'text-slate-400'}`}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="text-xs font-semibold">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: VULNERABILITY COORDINATES & UTM-30N */}
          <div className={`p-4 rounded-xl border space-y-3.5 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between border-b pb-2.5 border-slate-800/40">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <ControlsIcon className="w-3.5 h-3.5 text-indigo-400" />
                Vulnerability Controls
              </span>
              <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                <button
                  onClick={() => setInputMode("wgs84")}
                  className={`px-2 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                    inputMode === "wgs84" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  WGS84
                </button>
                <button
                  onClick={() => setInputMode("utm30n")}
                  className={`px-2 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                    inputMode === "utm30n" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  UTM-30N
                </button>
              </div>
            </div>

            {inputMode === "wgs84" ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Latitude (°N)</label>
                    <input
                      type="text"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                      className={`w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                      }`}
                      placeholder="5.5891"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Longitude (°W)</label>
                    <input
                      type="text"
                      value={lngInput}
                      onChange={(e) => setLngInput(e.target.value)}
                      className={`w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                      }`}
                      placeholder="-0.2145"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    onWGSAnalyze();
                    onClose();
                  }}
                  disabled={isLoading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isLoading ? "Analyzing Coordinates..." : "Analyze WGS-84 Point"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Easting (X meters)</label>
                    <input
                      type="text"
                      value={easting}
                      onChange={(e) => setEasting(e.target.value)}
                      className={`w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                      }`}
                      placeholder="255146"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Northing (Y meters)</label>
                    <input
                      type="text"
                      value={northing}
                      onChange={(e) => setNorthing(e.target.value)}
                      className={`w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                      }`}
                      placeholder="617942"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUTMConvertAndAnalyze();
                    onClose();
                  }}
                  disabled={isLoading}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isLoading ? "Converting Grid..." : "Convert Grid & Analyze"}</span>
                </button>
              </div>
            )}

            {/* Buffer Radius Range Slider */}
            <div className="pt-2 border-t border-slate-800/40 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Buffer Radius:</span>
                <span className="font-mono font-bold text-indigo-400">{(bufferRadius / 1000).toFixed(1)} km ({bufferRadius}m)</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={bufferRadius}
                onChange={(e) => setBufferRadius(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* SECTION 3: CLIMATE HAZARD SCENARIOS */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
              🌧️ Climate Hazard Scenario
            </span>
            <div className="space-y-1.5">
              {CLIMATE_SCENARIOS.map((sc) => {
                const isSelected = selectedScenarioId === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      onScenarioChange(sc.id);
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500 text-white"
                        : `${isDarkMode ? 'bg-slate-900/40 border-slate-850 hover:bg-slate-900 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="font-bold">{sc.name}</strong>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold">
                        +{Math.round((sc.rainfallFactor - 1) * 100)}% Rain
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{sc.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: TARGET GHANA FLOODPLAINS PRESETS */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
              🎯 Ghana Floodplain Presets
            </span>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {GHANA_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    onPresetSelect(preset);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                    isDarkMode 
                      ? 'bg-slate-900/40 border-slate-850 hover:border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white' 
                      : 'bg-slate-100 border-slate-200 hover:border-slate-300 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{preset.name}</div>
                    <div className="text-[10px] text-slate-500">{preset.region}</div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                    {preset.dangerLevel}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-900 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'} text-[10px] font-mono text-center`}>
          NADMO Disaster Telemetry Sync • Ghana National Grid
        </div>

      </div>
    </>
  );
}
