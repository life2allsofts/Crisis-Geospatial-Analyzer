import { useState, useTransition } from "react";
import { Settings, RefreshCw, Navigation, Waves, Shield } from "lucide-react";
import { GHANA_PRESETS } from "../types";

interface ControlPanelProps {
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
  isLoading: boolean;
  tc: any; // Theme classes
  onPresetSelect: (preset: any) => void;
  onUTMConvertAndAnalyze: () => void;
  onWGSAnalyze: () => void;
}

export default function ControlPanel({
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
  isLoading,
  tc,
  onPresetSelect,
  onUTMConvertAndAnalyze,
  onWGSAnalyze,
}: ControlPanelProps) {
  const [, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      {/* Target Ghana Floodplains Presets */}
      <div className={`${tc.cardBg} border border-slate-800/80 rounded-xl p-5 shadow-lg transition-all`}>
        <h2 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Waves className={`w-4 h-4 ${tc.textAccent}`} />
          Target Ghana Floodplains
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {GHANA_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => startTransition(() => onPresetSelect(preset))}
              className={`group text-left p-3 rounded-lg border border-slate-800/80 ${tc.btnSecondary} bg-slate-950/40 hover:bg-slate-950/80 transition-all flex justify-between items-center`}
            >
              <div>
                <div className={`text-xs font-semibold text-slate-200 transition-colors ${tc.hoverAccentText}`}>
                  {preset.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{preset.region}</div>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-855 text-slate-400 transition-all ${tc.accentBadge}`}>
                {preset.dangerLevel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Geohazard Parameters Form */}
      <div className={`${tc.cardBg} border border-slate-800/80 rounded-xl p-5 shadow-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            Vulnerability Controls
          </h2>
          <div className="flex bg-slate-950/85 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setInputMode("wgs84")}
              className={`px-3 py-1 rounded text-[10px] font-mono uppercase font-semibold transition-all ${
                inputMode === "wgs84" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              WGS-84
            </button>
            <button
              onClick={() => setInputMode("utm30n")}
              className={`px-3 py-1 rounded text-[10px] font-mono uppercase font-semibold transition-all ${
                inputMode === "utm30n" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              UTM-30N
            </button>
          </div>
        </div>

        {/* Form Inputs based on Coordinate Systems */}
        {inputMode === "wgs84" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="5.5560"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="-0.1963"
                />
              </div>
            </div>

            <button
              onClick={onWGSAnalyze}
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg bg-gradient-to-r ${tc.btnGradient} text-white font-semibold text-xs transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50`}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              {isLoading ? "Running GIS Engines..." : "Analyze Geographic Site"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-3 rounded-lg text-[11px] leading-relaxed border ${tc.badgeBg}`}>
              🌍 Converts **Ghana GTM / Transverse Mercator Grid** projections directly to standard geographic indices. Use UTM Zone 30N coordinates.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Easting (X)</label>
                <input
                  type="number"
                  value={easting}
                  onChange={(e) => setEasting(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="1199601.62"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Northing (Y)</label>
                <input
                  type="number"
                  value={northing}
                  onChange={(e) => setNorthing(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="333506.56"
                />
              </div>
            </div>

            <button
              onClick={onUTMConvertAndAnalyze}
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg bg-gradient-to-r ${tc.btnGradient} text-white font-semibold text-xs transition-colors flex justify-center items-center gap-2 cursor-pointer`}
            >
              <Navigation className="w-4 h-4" />
              Convert Grid & Analyze
            </button>
          </div>
        )}

        {/* Radius control */}
        <div className="mt-5 pt-5 border-t border-slate-800/90">
          <div className="flex justify-between items-center text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
            <span>Exposure Buffer Radius</span>
            <span className={`px-1.5 py-0.5 rounded border font-mono ${tc.badgeBg}`}>
              {(bufferRadius / 1000).toFixed(1)} km
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={bufferRadius}
            onChange={(e) => setBufferRadius(parseInt(e.target.value))}
            className={`w-full ${tc.sliderAccent} h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer`}
          />
          <div className="flex justify-between text-[9px] text-slate-505 font-mono mt-1">
            <span>500m</span>
            <span>5.0km</span>
            <span>10.0km</span>
          </div>
        </div>
      </div>

      {/* Security Info Card */}
      <div className={`p-4 rounded-xl border bg-slate-900/40 text-xs leading-relaxed text-slate-400 border-slate-800/80`}>
        <strong className="text-slate-200 flex items-center gap-1 mb-1 font-semibold uppercase text-[10px] tracking-wider">
          <Shield className={`w-3.5 h-3.5 ${tc.textAccent}`} />
          Security & Data Integrity
        </strong>
        All geospatial zonal statistics are compiled directly inside clean sandbox Node containers. Heavy secret tokens and Gemini pipelines remain nested securely in Express API layers to shield sensitive access credentials from browser leaks.
      </div>
    </div>
  );
}
