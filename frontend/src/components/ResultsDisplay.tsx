import { useState } from "react";
import { 
  Building,
  FileText,
  RefreshCw,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ShieldAlert,
  Sparkles,
  ClipboardList,
  Layers,
  Compass,
  ArrowLeft
} from "lucide-react";
import { GeospatialStats, RiskAnalysisAiResponse } from "../types";
import SafeHavens from "./SafeHavens";
import TimelineChart from "./TimelineChart";
import EscapeRoute from "./EscapeRoute";
import MapView from "./MapView";
import { generateDisasterBulletinPdf } from "../utils/pdfGenerator";

interface ResultsDisplayProps {
  stats: GeospatialStats | null;
  aiData: RiskAnalysisAiResponse | null;
  isLoading: boolean;
  tc: any;
  riskStyle: any;
  checkedRecommendations: Record<number, boolean>;
  toggleRecommendation: (idx: number) => void;
  theme: string;
  selectedHavenId: string | null;
  setSelectedHavenId: (id: string | null) => void;
  activeEscapeRoute: any | null;
  isRouteLoading: boolean;
  activeScreen: string;
  setActiveScreen: (screen: any) => void;
  onlyShowBanner?: boolean;
}

export default function ResultsDisplay({
  stats,
  aiData,
  isLoading,
  tc,
  riskStyle,
  checkedRecommendations,
  toggleRecommendation,
  theme,
  selectedHavenId,
  setSelectedHavenId,
  activeEscapeRoute,
  isRouteLoading,
  activeScreen,
  setActiveScreen,
  onlyShowBanner = false,
}: ResultsDisplayProps) {
  const activeTab = activeScreen;

  return (
    <div className="space-y-6">
      
      {/* 🔔 Standard Highlight: Quick Threat Indicator & Summary */}
      <div className={`p-5 rounded-xl border ${riskStyle.border} ${riskStyle.bg} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg relative overflow-hidden transition-all duration-300`}>
        <div className="z-10 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">
              Vulnerability Evaluation Center
            </span>
            <span className="text-sm">{riskStyle.icon}</span>
          </div>
          <h3 className={`text-xl md:text-2xl font-black font-display tracking-tight mt-1 ${riskStyle.text}`}>
            {stats ? `${stats.evaluatedSeverity} RISK HAZARD LEVEL` : "AWAITING TELEMETRY ANALYSIS"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-1.5 max-w-3xl font-sans">
            {stats
              ? stats.isInsideZone
                ? `The selected site directly overlaps the active hazardous margin of the "${stats.nearestFloodZone?.name}" zone within the ${stats.nearestFloodZone?.region} region.`
                : `Target is situated outside major high-risk zones. (Proximity to closest critical zone: ${stats.distanceToNearestZoneKm.toFixed(1)} km).`
              : "Generate an analysis or select a floodplain preset from the vulnerability controls panel to begin."}
          </p>
        </div>
        
        {stats && (
          <div className="z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="shrink-0 bg-slate-950/80 border border-slate-800/80 rounded-lg px-4 py-3 flex flex-col items-center justify-center text-center font-mono min-w-[120px]">
              <span className="text-[9px] text-slate-400 uppercase font-mono">Zonal Proximity</span>
              <span className={`text-sm font-black mt-0.5 ${riskStyle.text}`}>
                {stats.distanceToNearestZoneKm.toFixed(2)} km
              </span>
              <span className="text-[8px] text-slate-500 mt-0.5">to closest watershed</span>
            </div>

            <button
              onClick={() => generateDisasterBulletinPdf(stats, aiData)}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] font-sans shrink-0 border border-indigo-500/30 cursor-pointer"
              title="Export high-fidelity civil protection report for the current coordinate selection"
            >
              <FileText className="w-4 h-4" />
              <span>Download NADMO Bulletin (PDF)</span>
            </button>
          </div>
        )}
        
        <div className="absolute right-0 bottom-0 opacity-5 font-bold font-display text-8xl select-none translate-x-4 translate-y-4 pointer-events-none">
          RISK
        </div>
      </div>

      {onlyShowBanner ? (
        <div className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-2">
              {/* 1. Exposure & Assets */}
              <div 
                onClick={() => setActiveScreen && setActiveScreen("metrics")}
                className="p-4 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/85 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 font-display flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="text-base">🏘️</span>
                    Exposure & Assets
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-normal font-sans">
                    View estimated exposed residents, OSM building footprints, affected roads, and terrain aspect profiles.
                  </p>
                </div>
                <span className={`text-[10px] font-bold font-mono mt-3 inline-flex items-center gap-1 ${tc.textAccent} group-hover:underline`}>
                  Open Screen →
                </span>
              </div>

              {/* 2. Generative AI Report */}
              <div 
                onClick={() => setActiveScreen && setActiveScreen("ai_report")}
                className="p-4 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/85 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 font-display flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="text-base">🤖</span>
                    Generative AI Report
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-normal font-sans">
                    Read full RAG-based risk ratings, local geology comments, and computed flood mitigation drivers.
                  </p>
                </div>
                <span className={`text-[10px] font-bold font-mono mt-3 inline-flex items-center gap-1 ${tc.textAccent} group-hover:underline`}>
                  Open Screen →
                </span>
              </div>

              {/* 3. Action Plan & Sources */}
              <div 
                onClick={() => setActiveScreen && setActiveScreen("action_plan")}
                className="p-4 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/85 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 font-display flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="text-base">📋</span>
                    Action Plan & Sources
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-normal font-sans">
                    Formulate active safety checklists, risk mitigation steps, and official scientific sources.
                  </p>
                </div>
                <span className={`text-[10px] font-bold font-mono mt-3 inline-flex items-center gap-1 ${tc.textAccent} group-hover:underline`}>
                  Open Screen →
                </span>
              </div>

              {/* 4. Safe Havens & NADMO */}
              <div 
                onClick={() => setActiveScreen && setActiveScreen("safe_havens")}
                className="p-4 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/85 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 font-display flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="text-base">🏥</span>
                    Safe Havens & NADMO
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-normal font-sans">
                    Calculate nearest high-elevation NADMO safe havens and plan your custom evacuation routes.
                  </p>
                </div>
                <span className={`text-[10px] font-bold font-mono mt-3 inline-flex items-center gap-1 ${tc.textAccent} group-hover:underline`}>
                  Open Screen →
                </span>
              </div>

              {/* 5. Historical Timeline */}
              <div 
                onClick={() => setActiveScreen && setActiveScreen("historical_timeline")}
                className="p-4 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/85 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 font-display flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="text-base">📊</span>
                    Historical Timeline
                  </h4>
                  <p className="text-[10.5px] text-slate-400 mt-2 leading-normal font-sans">
                    Review Accra's multi-decade historical flood inundation cycles and major event logs.
                  </p>
                </div>
                <span className={`text-[10px] font-bold font-mono mt-3 inline-flex items-center gap-1 ${tc.textAccent} group-hover:underline`}>
                  Open Screen →
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* 📦 Tab Content Display Panels */}
          <div className="transition-all duration-300">
        
        {/* ================== TAB 1: EXPOSURE & ASSETS ================== */}
        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            
            {/* 📋 Left Column: Assets Exposure & Risk Drivers */}
            <div className="lg:col-span-6 space-y-6 flex flex-col">
              
              {/* Hydrological Elements Exposed Card */}
              <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex flex-col justify-between flex-1`}>
                <div>
                  <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                    <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Building className={`w-4 h-4 ${tc.textAccent}`} />
                      Hydrological Elements Exposed
                    </h3>
                    {stats && stats.selectedScenario && stats.selectedScenario.id !== "baseline" && (
                      <span className="text-[9px] bg-orange-950/60 border border-orange-900/40 text-orange-400 font-bold px-2 py-0.5 rounded font-mono animate-pulse">
                        SIMULATING: {stats.selectedScenario.name.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {/* People count */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-900/60">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg border text-indigo-400 flex items-center justify-center font-semibold text-sm ${tc.badgeBg}`}>
                          🧑‍🤝‍🧑
                        </div>
                        <div>
                          <div className="text-[11.5px] text-slate-200 font-semibold leading-none">
                            {stats && stats.selectedScenario && stats.selectedScenario.id !== "baseline" ? "Simulated Exposed Residents" : "Exposed Residents"}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-1 font-mono">WorldPop Grid Estimator</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-white">
                          {stats ? stats.estimatedPeopleExposed.toLocaleString() : "—"}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                          {stats ? `${stats.estimatedPopulationDensity}/km²` : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Infrastructure footprints */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-900/60">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg border text-indigo-400 flex items-center justify-center font-semibold text-sm ${tc.badgeBg}`}>
                          🏠
                        </div>
                        <div>
                          <div className="text-[11.5px] text-slate-200 font-semibold leading-none">
                            {stats && stats.selectedScenario && stats.selectedScenario.id !== "baseline" ? "Simulated Structural Assets" : "Structural Assets"}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-1 font-mono">OSM Footprints Match</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-white">
                          {stats ? stats.estimatedBuildingsExposed.toLocaleString() : "—"}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">estimated units</div>
                      </div>
                    </div>

                    {/* Road index */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-900/60">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg border text-indigo-400 flex items-center justify-center font-semibold text-sm ${tc.badgeBg}`}>
                          🛣️
                        </div>
                        <div>
                          <div className="text-[11.5px] text-slate-200 font-semibold leading-none">
                            {stats && stats.selectedScenario && stats.selectedScenario.id !== "baseline" ? "Simulated Exposed Roads" : "Exposed Roads Network"}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-1 font-mono">Zonal Line Intersect</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-white">
                          {stats ? `${stats.estimatedRoadsExposedKm} km` : "—"}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">Grid 30N aligned</div>
                      </div>
                    </div>

                    {/* Simulated Human Displacement */}
                    {stats && stats.selectedScenario && stats.selectedScenario.id !== "baseline" && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-orange-950/20 border border-orange-900/35 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-orange-850 bg-orange-950/50 text-orange-400 flex items-center justify-center font-semibold text-sm">
                            🛟
                          </div>
                          <div>
                            <div className="text-[11.5px] text-orange-300 font-semibold leading-none">Projected Evacuees</div>
                            <div className="text-[9px] text-orange-400/80 mt-1 font-mono">Displacement factor {stats.selectedScenario.displacementCoef}x</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold font-mono text-orange-400">
                            {stats.estimatedDisplacedPeople ? stats.estimatedDisplacedPeople.toLocaleString() : "—"}
                          </div>
                          <div className="text-[9px] text-orange-500/80 font-mono mt-0.5">projected displacement</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/40">
                  ⚡ Estimations compiled dynamically relative to the target buffer.
                </div>
              </div>

              {/* Risk Drivers Card */}
              <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg`}>
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${tc.textAccent}`} />
                  Computed Risk Drivers
                </h3>
                
                <div className="space-y-2">
                  {stats ? (
                    stats.riskFactors.map((factor, idx) => (
                      <div key={idx} className="flex gap-2.5 p-2.5 rounded bg-slate-950/20 border border-slate-900/60 text-slate-300 text-[11px] leading-relaxed animate-in fade-in duration-250" style={{ animationDelay: `${idx * 40}ms` }}>
                        <span className={`font-mono text-xs select-none ${tc.textAccent}`}>▪</span>
                        <span>{factor}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-[11px] py-4 text-center">
                      No evaluated risk markers compiled yet. Use coordinates form above.
                    </div>
                  )}
                </div>

                {stats && (
                  <div className="mt-4 p-3 rounded bg-slate-950/40 border border-slate-900 text-[10.5px] text-slate-400 leading-normal">
                    💡 <b>Proximity Factor:</b> Saturation index increases dramatically near pre-determined regional flood lines.
                  </div>
                )}
              </div>

            </div>

            {/* ⛰️ Right Column: Dynamic Elevation & Terrain Index */}
            <div className="lg:col-span-6 space-y-6 flex flex-col">
              
              <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex flex-col justify-between flex-1`}>
                <div>
                  <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="text-sm">⛰️</span>
                    Terrain & Slope Intelligence
                  </h3>

                  {/* 2x2 Numeric Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800/80 transition-colors">
                      <span className="text-[9px] text-slate-400 font-mono block uppercase">Center Elevation</span>
                      <span className="text-base font-bold font-mono text-white mt-1 inline-block">
                        {stats ? `${stats.elevationProfile.pointElevation} m` : "—"}
                      </span>
                      <span className="text-[8px] text-slate-500 block leading-none mt-1 uppercase font-mono">above sea level</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800/80 transition-colors">
                      <span className="text-[9px] text-slate-400 font-mono block uppercase">Slope Gradient</span>
                      <span className={`text-base font-bold font-mono mt-1 inline-block ${stats && stats.elevationProfile.slopePercent > 8 ? "text-orange-400" : "text-white"}`}>
                        {stats ? `${stats.elevationProfile.slopePercent}%` : "—"}
                      </span>
                      <span className="text-[8px] text-slate-500 block leading-none mt-1 uppercase font-mono">
                        {stats ? `${stats.elevationProfile.slope.toFixed(1)}° inclination` : "flat terrain"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800/80 transition-colors">
                      <span className="text-[9px] text-slate-400 font-mono block uppercase">Slope Aspect (Heading)</span>
                      <span className="text-base font-bold font-mono text-white mt-1 inline-block">
                        {stats ? stats.elevationProfile.aspectDirection : "—"}
                      </span>
                      <span className="text-[8px] text-slate-500 block leading-none mt-1 uppercase font-mono">
                        {stats ? `${stats.elevationProfile.aspect}° aspect` : "no direction"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-900/60 hover:border-slate-800/80 transition-colors">
                      <span className="text-[9px] text-slate-400 font-mono block uppercase">Buffer Profile Span</span>
                      <span className="text-[11px] font-bold font-mono text-white mt-1.5 block leading-tight">
                        {stats ? `Min ${stats.elevationProfile.minElevation}m / Max ${stats.elevationProfile.maxElevation}m` : "—"}
                      </span>
                      <span className="text-[8px] text-slate-500 block leading-none mt-1 uppercase font-mono">
                        {stats ? `Mean: ${stats.elevationProfile.meanElevation}m` : "terrain variance"}
                      </span>
                    </div>
                  </div>

                  {/* SVG Elevation Profile Chart */}
                  {stats ? (() => {
                    const pts = stats.elevationProfile.profilePoints;
                    const elevations = pts.map(p => p.elevation);
                    const minE = Math.min(...elevations);
                    const maxE = Math.max(...elevations);
                    const elevSpan = (maxE - minE) || 10;
                    const yMin = Math.max(0, minE - elevSpan * 0.15);
                    const yMax = maxE + elevSpan * 0.15;
                    const ySpan = yMax - yMin;

                    const width = 500;
                    const height = 155;
                    const paddingLeft = 40;
                    const paddingRight = 15;
                    const paddingTop = 15;
                    const paddingBottom = 22;
                    const chartWidth = width - paddingLeft - paddingRight;
                    const chartHeight = height - paddingTop - paddingBottom;

                    // Generate SVG points
                    const pathPoints = pts.map((p, i) => {
                      const x = paddingLeft + (i / (pts.length - 1)) * chartWidth;
                      const pctY = (p.elevation - yMin) / ySpan;
                      const y = paddingTop + (1 - pctY) * chartHeight;
                      return { x, y, elevation: p.elevation, dist: p.distanceKm };
                    });

                    const pathData = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
                    const areaData = `${pathData} L ${(paddingLeft + chartWidth).toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} L ${paddingLeft.toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} Z`;

                    const centerIdx = Math.floor(pts.length / 2);
                    const centerPt = pathPoints[centerIdx];

                    // Grid line elevations
                    const gridLines = [
                      { elev: yMax, y: paddingTop },
                      { elev: yMin + ySpan / 2, y: paddingTop + chartHeight / 2 },
                      { elev: yMin, y: paddingTop + chartHeight }
                    ];

                    // Get color token based on active theme
                    let themeColor = '#6366f1'; // midnight indigo
                    if (theme === 'emerald') themeColor = '#10b981';
                    else if (theme === 'crimson') themeColor = '#f43f5e';
                    else if (theme === 'amber') themeColor = '#f59e0b';

                    return (
                      <div className="bg-slate-950/60 border border-slate-900/80 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1.5 text-[9px] font-mono tracking-wider text-slate-400">
                          <span>📈 TRANS-SECTION ELEVATION SPLINE (SW ➔ NE)</span>
                          <span className={tc.textAccent}>Relief: {elevSpan.toFixed(0)}m</span>
                        </div>
                        <div className="relative w-full overflow-hidden" style={{ height: "155px" }}>
                          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={themeColor} stopOpacity="0.35" />
                                <stop offset="100%" stopColor={themeColor} stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Horizontal grid guide lines */}
                            {gridLines.map((line, idx) => (
                              <g key={idx} className="opacity-30">
                                <line 
                                  x1={paddingLeft} 
                                  y1={line.y} 
                                  x2={width - paddingRight} 
                                  y2={line.y} 
                                  stroke="#334155" 
                                  strokeWidth="1" 
                                  strokeDasharray="3,3" 
                                />
                                <text 
                                  x={paddingLeft - 6} 
                                  y={line.y + 3} 
                                  textAnchor="end" 
                                  fill="#94a3b8" 
                                  className="text-[8.5px] font-mono"
                                >
                                  {Math.round(line.elev)}m
                                </text>
                              </g>
                            ))}

                            {/* Center location marker line axis */}
                            <line
                              x1={centerPt.x}
                              y1={paddingTop}
                              x2={centerPt.x}
                              y2={paddingTop + chartHeight}
                              stroke="#475569"
                              strokeWidth="1.2"
                              strokeDasharray="2,2"
                              className="opacity-40"
                            />

                            {/* Area fill path */}
                            <path d={areaData} fill="url(#elevationGrad)" />

                            {/* Spline curve stroke */}
                            <path 
                              d={pathData} 
                              fill="none" 
                              stroke={themeColor} 
                              strokeWidth="2.2" 
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Center core pinpoint beacon */}
                            <g className="animate-pulse">
                              <circle
                                cx={centerPt.x}
                                cy={centerPt.y}
                                r="5.5"
                                fill="#ffffff"
                                stroke={themeColor}
                                strokeWidth="2.5"
                              />
                            </g>

                            {/* Borders */}
                            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + chartHeight} stroke="#1e293b" strokeWidth="1" />
                            <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} stroke="#1e293b" strokeWidth="1" />

                            {/* X Axis Labels */}
                            <text x={paddingLeft} y={height - 2} textAnchor="start" fill="#475569" className="text-[8.5px] font-mono">
                              -{stats.bufferRadiusKm.toFixed(1)} km
                            </text>
                            <text x={centerPt.x} y={height - 2} textAnchor="middle" fill="#94a3b8" className="text-[8.5px] font-mono font-semibold">
                              Center Pivot
                            </text>
                            <text x={width - paddingRight} y={height - 2} textAnchor="end" fill="#475569" className="text-[8.5px] font-mono">
                              +{stats.bufferRadiusKm.toFixed(1)} km
                            </text>
                          </svg>
                        </div>
                        <p className="text-[8px] text-slate-500 mt-1 font-mono leading-none text-center">
                          ℹ️ Topography elevation spline sampled linearly along diagonal buffer radius.
                        </p>
                      </div>
                    );
                  })() : (
                    <div className="py-16 bg-slate-950/30 border border-slate-900 rounded-lg text-center text-slate-500 text-[11px] italic font-sans flex flex-col justify-center items-center gap-2">
                      <span>⛰️</span>
                      <span>Select coordinates or preset above to assemble high-fidelity elevation profiles.</span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/40">
                  ⚡ Powered by Shuttle Radar Topography Mission (SRTM) 30m Digital Elevation Model.
                </div>
              </div>

            </div>

            {/* 🔗 Interactive Next Screen Navigation Alert */}
            <div className="lg:col-span-12 p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
              <div>
                <span className="text-xs font-bold text-indigo-400 font-display uppercase tracking-wider block">
                  👉 Physical Metrics Analysed!
                </span>
                <span className="text-[11px] text-slate-300 leading-relaxed mt-1 block font-sans">
                  To see how these physical metrics translate into a full RAG-based hydrological risk rating and safety comment, click to open the Generative AI Assessment screen.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveScreen("map")}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Map</span>
                </button>
                <button
                  onClick={() => setActiveScreen("ai_report")}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open Generative AI Report</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}


        {/* ================== TAB 2: GENERATIVE AI REPORT ================== */}
        {activeTab === "ai_report" && (
          <div className="animate-in fade-in duration-200">
            <div className={`${tc.cardBg} border border-slate-800/80 rounded-xl overflow-hidden shadow-lg flex flex-col`}>
              <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/40 flex justify-between items-center">
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${tc.textAccent}`} />
                  Generative Intelligence Report
                </h3>
                <span className={`text-[9px] font-mono border px-2 py-0.5 rounded uppercase ${tc.badgeBg}`}>
                  Gemini RAG Reasoning
                </span>
              </div>

              <div className="p-5 text-xs leading-relaxed space-y-5 font-sans">
                {isLoading ? (
                  <div className="py-16 flex flex-col justify-center items-center gap-3">
                    <RefreshCw className={`w-7 h-7 animate-spin ${tc.textAccent}`} />
                    <span className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">
                      Consolidating Geographic Context with Gemini...
                    </span>
                  </div>
                ) : aiData ? (
                  <div className="space-y-5">
                    <div className={`p-4 rounded-xl border leading-relaxed bg-slate-950/40 border-slate-800/50`}>
                      <strong className={`block font-semibold mb-1 text-[11px] uppercase tracking-wider ${tc.textAccent}`}>
                        Summary Statement
                      </strong>
                      <p className="text-slate-200 font-sans leading-relaxed text-sm">{aiData.summary}</p>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-white block font-semibold text-[11.5px] uppercase tracking-wider">
                        Scientific Justification & Local Dynamics
                      </strong>
                      <p className="text-slate-300 leading-relaxed text-sm font-sans">{aiData.reasoning}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-400 italic font-sans">
                    Awaiting geospatial coordinates telemetry to prompt generative LLM analysis layers.
                  </div>
                )}
              </div>
            </div>

            {/* 🔗 Interactive Next Screen Navigation Alert */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 font-display uppercase tracking-wider block">
                  👉 AI Analysis Review Complete!
                </span>
                <span className="text-[11px] text-slate-300 leading-relaxed mt-1 block font-sans">
                  To formulate and track active safety protocols, checklists, and view official scientific source attributions, open the Action Plan screen.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveScreen("map")}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Map</span>
                </button>
                <button
                  onClick={() => setActiveScreen("action_plan")}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open Action Plan & Sources</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================== TAB 3: ACTION PLAN & SOURCES ================== */}
        {activeTab === "action_plan" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* RECOMMENDED MITIGATION STEPS */}
            <div className={`md:col-span-6 ${tc.cardBg} border border-slate-800/80 rounded-xl p-5 shadow-lg`}>
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <HeartHandshake className={`w-4 h-4 ${tc.textAccent}`} />
                Hydrological Action Recommendations
              </h3>
              
              <div className="space-y-2.5">
                {(aiData?.recommendations || [
                  "Improve drainage network capacity and carry out regular desiltation cycles in low-lying segments.",
                  "Implement real-time water level meters in nearest stream channels connected to local early warning centers.",
                  "Strictly enforce building buffer zones bordering natural water courses.",
                  "Run emergency community evacuation drills aligned with NADMO safe-haven maps."
                ]).map((rec, index) => (
                  <div
                    key={index}
                    onClick={() => toggleRecommendation(index)}
                    className={`flex gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      checkedRecommendations[index]
                        ? "bg-emerald-950/20 border-emerald-500/20 text-slate-300"
                        : "bg-slate-950/20 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <CheckCircle2
                        className={`w-4 h-4 transition-all ${
                          checkedRecommendations[index] ? "text-emerald-400 fill-emerald-950/40" : "text-slate-500"
                        }`}
                      />
                    </div>
                    <div className="text-[11px] leading-relaxed select-none">{rec}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SCIENTIFIC SOURCE ATTRIBUTIONS */}
            <div className={`md:col-span-6 ${tc.cardBg} border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between`}>
              <div>
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <BookOpen className={`w-4 h-4 ${tc.textAccent}`} />
                  Scientific Data Sources & Attribution
                </h3>
                
                <div className="space-y-3">
                  {(aiData?.citations || [
                    {
                      name: "Ghana Hydrological Authority",
                      dataset: "National Flood Vulnerability Mapping (2024)",
                      attribution: "Ghana Hydrological Authority, Government of Ghana",
                      link: "https://www.hydrological.gov.gh/"
                    },
                    {
                      name: "WorldPop",
                      dataset: "Ghana Population Density Grid (100m resolution, 2023)",
                      attribution: "WorldPop Project, University of Southampton",
                      link: "https://www.worldpop.org/"
                    }
                  ]).map((cite, index) => (
                    <div key={index} className="p-3 bg-slate-950/30 border border-slate-800/70 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-200">{cite.name}</span>
                        {cite.link && (
                          <a
                            href={cite.link}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-[10px] hover:underline flex items-center gap-0.5 font-mono ${tc.textAccent}`}
                          >
                            View Portal <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">Dataset: {cite.dataset}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Attribution: {cite.attribution}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🔗 Interactive Next Screen Navigation Alert */}
            <div className="md:col-span-12 p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
              <div>
                <span className="text-xs font-bold text-indigo-400 font-display uppercase tracking-wider block">
                  👉 Safety Recommendations Verified!
                </span>
                <span className="text-[11px] text-slate-300 leading-relaxed mt-1 block font-sans">
                  Ready to map a physical escape route to safety? Open the Safe Havens screen to list the closest shelter locations, capacities, and NADMO responder directory.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveScreen("map")}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Map</span>
                </button>
                <button
                  onClick={() => setActiveScreen("safe_havens")}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Find Safe Havens</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================== TAB 4: SAFE HAVENS & NADMO EMERGENCY DIRECTORY ================== */}
        {activeTab === "safe_havens" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <SafeHavens 
              stats={stats} 
              tc={tc} 
              theme={theme} 
              selectedHavenId={selectedHavenId}
              setSelectedHavenId={setSelectedHavenId}
              activeEscapeRoute={activeEscapeRoute}
              isRouteLoading={isRouteLoading}
              onNavigateToRoute={() => setActiveScreen("escape_route")}
            />
            
            {/* 🔗 Interactive Next Screen Navigation Alert */}
            <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 font-display uppercase tracking-wider block">
                  👉 Safe Haven Target Selected!
                </span>
                <span className="text-[11px] text-slate-300 leading-relaxed mt-1 block font-sans">
                  Ready to map the street-by-street walking path, estimated travel times, and high-precision elevation cross-section? Open the Active Escape Route Mapper screen.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveScreen("map")}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Map</span>
                </button>
                <button
                  onClick={() => setActiveScreen("escape_route")}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open Escape Route Mapper</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================== TAB: ESCAPE ROUTE PROFILE ================== */}
        {activeTab === "escape_route" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* LEFT COLUMN: Map View + Safe Havens Directory List */}
            <div className="lg:col-span-5 space-y-4 flex flex-col">
              {/* Map view container */}
              <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase">
                    🗺️ EVACUATION ROUTE MAP
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono bg-slate-950/40 px-2 py-0.5 rounded border border-slate-850">
                    Targeted Path
                  </span>
                </div>
                <div className="h-[260px] rounded-lg overflow-hidden border border-slate-900 shadow-inner relative">
                  {stats ? (
                    <MapView
                      latitude={stats.latitude}
                      longitude={stats.longitude}
                      bufferRadiusMeters={stats.bufferRadiusKm * 1000}
                      stats={stats}
                      onMapClick={() => {}}
                      activeEscapeRoute={activeEscapeRoute}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-950/60 flex items-center justify-center text-slate-500 font-mono text-xs">
                      Awaiting coordinates telemetry...
                    </div>
                  )}
                </div>
              </div>

              {/* Safe Havens List */}
              <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-4 shadow-lg flex-1 flex flex-col`}>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-900">
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    🏥 Recommended Safe Havens
                  </h4>
                  <span className="text-[9px] text-slate-500 font-mono">Select target to map route</span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {stats?.safeHavens && stats.safeHavens.length > 0 ? (
                    stats.safeHavens.map((haven, idx) => {
                      const isSelected = selectedHavenId === haven.id;
                      return (
                        <div
                          key={haven.id}
                          onClick={() => setSelectedHavenId(haven.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected
                              ? "bg-indigo-950/20 border-indigo-500 shadow-indigo-950/40 shadow"
                              : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[11px] font-bold text-slate-200 block">
                                {idx + 1}. {haven.name}
                              </span>
                              <span className="text-[9.5px] text-slate-400 font-mono block mt-1">
                                {haven.type} • Cap: {haven.capacity.toLocaleString()}
                              </span>
                            </div>
                            <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded ${
                              isSelected ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-300"
                            } shrink-0`}>
                              {haven.distanceKm} km
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-slate-500 text-xs italic py-8">
                      No safe havens computed yet. Please select coordinates on the map.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Elevation Profile Chart + Warnings + Rescue Details */}
            <div className="lg:col-span-7 space-y-4">
              <EscapeRoute 
                route={activeEscapeRoute} 
                isLoading={isRouteLoading} 
                tc={tc} 
                theme={theme} 
              />

              {/* NADMO Emergency Hotline details at the bottom of the right column */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-bold font-mono tracking-wider text-indigo-400 uppercase block">
                  📞 National Rescue Hotline & Support
                </span>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                  <div>
                    <span className="text-sm font-black text-rose-400 font-mono block">
                      Emergency Line: 193 / 112
                    </span>
                    <span className="text-xs font-bold text-slate-300 font-mono block mt-0.5">
                      NADMO HQ: 0299 350030
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 leading-relaxed max-w-xs font-sans block sm:text-right">
                    In case of active flooding, call the emergency line or contact local NADMO offices immediately.
                  </span>
                </div>
              </div>

              {/* 🔗 Interactive Next Screen Navigation Alert */}
              <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 font-display uppercase tracking-wider block">
                    👉 Evacuation Profile Plotted!
                  </span>
                  <span className="text-[11px] text-slate-300 leading-relaxed mt-1 block font-sans">
                    Concerned about multi-decade riverine flood histories in this exact sector? Open the Historical Flooding Timeline to review major flood events in Ghana.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveScreen("map")}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-300 font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Map</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen("historical_timeline")}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Open Historical Timeline</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================== TAB 5: HISTORICAL FLOODING TIMELINE CHART ================== */}
        {activeTab === "historical_timeline" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <TimelineChart tc={tc} theme={theme} />

            {/* 🔗 Interactive Back Screen Navigation Alert */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-300 font-display uppercase tracking-wider block">
                  👉 Regional Context Verified!
                </span>
                <span className="text-[11px] text-slate-400 leading-relaxed mt-1 block font-sans">
                  Ready to run a new simulation or modify active coordinate parameters? Return to the main Interactive Flood Map screen.
                </span>
              </div>
              <button
                onClick={() => setActiveScreen("map")}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-750 text-slate-300 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                <span>Return to Interactive Map</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
      </div>
      )}

    </div>
  );
}
