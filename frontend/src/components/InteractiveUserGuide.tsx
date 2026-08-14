import React, { useState } from "react";
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  MapPin, 
  Compass, 
  ShieldAlert, 
  Waves, 
  FileDown, 
  Minimize2, 
  Maximize2,
  CheckCircle2
} from "lucide-react";
import { GHANA_PRESETS } from "../types";

interface InteractiveUserGuideProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onLoadPreset: (preset: any) => void;
  onConvertUTM: () => void;
  onToggleSafeHavens: () => void;
  showSafeHavens: boolean;
  onSetScenario: (scenarioId: string) => void;
  onNavigateScreen: (screen: string) => void;
}

export default function InteractiveUserGuide({
  isOpen,
  onClose,
  isDarkMode,
  onLoadPreset,
  onConvertUTM,
  onToggleSafeHavens,
  showSafeHavens,
  onSetScenario,
  onNavigateScreen
}: InteractiveUserGuideProps) {
  const [step, setStep] = useState<number>(1);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const totalSteps = 5;

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-40 max-w-[420px] w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-950/95 border-indigo-500/40 text-slate-100 shadow-indigo-950/50' 
        : 'bg-white/95 border-indigo-200 text-slate-900 shadow-xl'
    } backdrop-blur-xl animate-in slide-in-from-bottom-5`}>
      
      {/* Guide Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-black font-display uppercase tracking-wider">
              Interactive Feature Guide
            </h4>
            <span className="text-[9.5px] text-slate-400 font-mono">
              Step {step} of {totalSteps} • Non-blocking walkthrough
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title={isMinimized ? "Expand Guide" : "Minimize Guide"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Close Guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-5 gap-1 px-4 pt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            onClick={() => setStep(i + 1)}
            className={`h-1 rounded-full cursor-pointer transition-all ${
              i + 1 <= step ? 'bg-indigo-500' : isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {!isMinimized && (
        <div className="p-4 space-y-3.5 text-xs">
          
          {/* STEP 1: COORDINATES & MAP PINPOINTING */}
          {step === 1 && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <MapPin className="w-4 h-4" />
                <span>1. Pinpoint Location on the Live Map</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Click anywhere on the Leaflet map to set your GPS coordinate target, or load predefined Ghana flood hazard hotspots from the navigation bar.
              </p>
              
              <div className={`p-2.5 rounded-lg border text-[11px] ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                💡 <b>Try it now:</b> Click the quick action below to immediately load Accra's vulnerable Odaw River Basin on the map!
              </div>

              <button
                onClick={() => {
                  onLoadPreset(GHANA_PRESETS[1]); // Odaw River Basin
                  onNavigateScreen("map");
                }}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <span>⚡ Load "Odaw River Basin" & Update Map</span>
              </button>
            </div>
          )}

          {/* STEP 2: UTM-30N GHANA NATIONAL GRID CONVERTER */}
          {step === 2 && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>2. Ghana Grid UTM-30N Converter</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Surveyors & engineers can input official Ghana National Grid metrics (Easting & Northing in meters). The geodetic pipeline converts them to WGS-84 coordinates on the fly.
              </p>

              <div className={`p-2.5 rounded-lg border text-[11px] ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                💡 <b>Try it now:</b> Run the converter for Weija Dam spillway sector (Easting: 239569m, Northing: 614132m).
              </div>

              <button
                onClick={() => {
                  onConvertUTM();
                  onNavigateScreen("map");
                }}
                className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <span>⚡ Convert Weija Dam Grid & Run Telemetry</span>
              </button>
            </div>
          )}

          {/* STEP 3: SAFE HAVENS & EVACUATION PATH */}
          {step === 3 && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>3. Safe Havens Toggle & Evacuation Routing</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Safe havens are hidden by default to keep your map uncluttered. Toggle the <b>Safe Havens</b> switch in the navigation bar to see high-ground sanctuaries!
              </p>

              <div className={`p-2.5 rounded-lg border text-[11px] ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                🏥 The algorithm computes 5 nearest shelters weighted by <b>60% Proximity + 40% Elevation Height Safety</b>, with same-district prioritization.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onToggleSafeHavens();
                  }}
                  className={`py-2 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    showSafeHavens
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>{showSafeHavens ? "✅ Havens Visible" : "🔘 Toggle Havens ON"}</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateScreen("escape_route");
                  }}
                  className="py-2 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>View Elevation Path</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CLIMATE HAZARD SCENARIOS */}
          {step === 4 && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Waves className="w-4 h-4" />
                <span>4. Climate Scenarios & Buffer Simulation</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Simulate different hydrological conditions: Baseline dry conditions, 10-Year Monsoon, 50-Year Torrential storm, or catastrophic Akosombo/Weija Dam Spillway Surge (+120% rainfall load).
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onSetScenario("torrential_50yr");
                  }}
                  className="py-2 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>🌧️ 50-Yr Torrential (+60%)</span>
                </button>
                <button
                  onClick={() => {
                    onSetScenario("dam_spillway_surge");
                  }}
                  className="py-2 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>🌊 Dam Spillway Surge</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: AI REPORT & PDF EXPORT */}
          {step === 5 && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5. AI Hazard Reasoning & PDF Dispatch</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Review the Gemini RAG assessment with scientific hydrological citations, interact with safety checklist items, and export an official Disaster Management Bulletin in formatted PDF.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onNavigateScreen("ai_report");
                  }}
                  className="py-2 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Risk Report</span>
                </button>
                <button
                  onClick={() => {
                    onNavigateScreen("action_plan");
                  }}
                  className="py-2 px-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Action Protocols</span>
                </button>
              </div>
            </div>
          )}

          {/* Guide Controls Footer */}
          <div className="pt-2 border-t flex items-center justify-between border-slate-800/40">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                step === 1
                  ? 'opacity-40 cursor-not-allowed text-slate-500'
                  : isDarkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="text-[10px] font-mono text-slate-400 font-bold">
              {step}/{totalSteps}
            </span>

            {step < totalSteps ? (
              <button
                onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Done ✓
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
