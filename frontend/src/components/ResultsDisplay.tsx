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
  Layers
} from "lucide-react";
import { GeospatialStats, RiskAnalysisAiResponse } from "../types";

interface ResultsDisplayProps {
  stats: GeospatialStats | null;
  aiData: RiskAnalysisAiResponse | null;
  isLoading: boolean;
  tc: any;
  riskStyle: any;
  checkedRecommendations: Record<number, boolean>;
  toggleRecommendation: (idx: number) => void;
}

type ActiveTab = "metrics" | "ai_report" | "action_plan";

export default function ResultsDisplay({
  stats,
  aiData,
  isLoading,
  tc,
  riskStyle,
  checkedRecommendations,
  toggleRecommendation,
}: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("metrics");

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
          <p className="text-xs text-slate-300 leading-relaxed mt-1.5 max-w-3xl">
            {stats
              ? stats.isInsideZone
                ? `The selected site directly overlaps the active hazardous margin of the "${stats.nearestFloodZone?.name}" zone within the ${stats.nearestFloodZone?.region} region.`
                : `Target is situated outside major high-risk zones. (Proximity to closest critical zone: ${stats.distanceToNearestZoneKm.toFixed(1)} km).`
              : "Generate an analysis or select a floodplain preset from the vulnerability controls panel to begin."}
          </p>
        </div>
        
        {stats && (
          <div className="z-10 shrink-0 bg-slate-950/80 border border-slate-800/80 rounded-lg px-4 py-3 flex flex-col items-center justify-center text-center font-mono min-w-[120px]">
            <span className="text-[9px] text-slate-400 uppercase">Zonal Proximity</span>
            <span className={`text-sm font-black mt-0.5 ${riskStyle.text}`}>
              {stats.distanceToNearestZoneKm.toFixed(2)} km
            </span>
            <span className="text-[8px] text-slate-500 mt-0.5">to closest watershed</span>
          </div>
        )}
        
        <div className="absolute right-0 bottom-0 opacity-5 font-bold font-display text-8xl select-none translate-x-4 translate-y-4 pointer-events-none">
          RISK
        </div>
      </div>

      {/* 🧭 Modular Menu Tab Switcher */}
      <div className="flex bg-slate-950/90 p-1 rounded-xl border border-slate-800/80 gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold font-display tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "metrics"
              ? `bg-gradient-to-r ${tc.btnGradient} text-white shadow-md`
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Building className="w-4 h-4 shrink-0" />
          <span>Exposure & Assets</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_report")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold font-display tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "ai_report"
              ? `bg-gradient-to-r ${tc.btnGradient} text-white shadow-md`
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Generative AI Report</span>
        </button>

        <button
          onClick={() => setActiveTab("action_plan")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold font-display tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === "action_plan"
              ? `bg-gradient-to-r ${tc.btnGradient} text-white shadow-md`
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <ClipboardList className="w-4 h-4 shrink-0" />
          <span>Action Plan & Sources</span>
        </button>
      </div>

      {/* 📦 Tab Content Display Panels */}
      <div className="transition-all duration-300">
        
        {/* ================== TAB 1: EXPOSURE & ASSETS ================== */}
        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Vector metrics list */}
            <div className={`md:col-span-7 ${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex flex-col justify-between`}>
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

                  {/* Simulated Human Displacement - shown conditionally when simulation has displacement metrics */}
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
                ⚡ Estimations compiled dynamically relative to the target pinpoint.

              </div>
            </div>

            {/* Risk drivers panel */}
            <div className={`md:col-span-5 ${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex flex-col justify-between`}>
              <div>
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${tc.textAccent}`} />
                  Computed Risk Drivers
                </h3>
                
                <div className="space-y-2">
                  {stats ? (
                    stats.riskFactors.map((factor, idx) => (
                      <div key={idx} className="flex gap-2.5 p-2.5 rounded bg-slate-950/20 border border-slate-900/60 text-slate-300 text-[11px] leading-relaxed">
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
              </div>

              {stats && (
                <div className="mt-4 p-3 rounded bg-slate-950/40 border border-slate-900 text-[10.5px] text-slate-400 leading-normal">
                  💡 <b>Proximity Factor:</b> Saturation index increases dramatically near pre-determined regional flood lines.
                </div>
              )}
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
          </div>
        )}

      </div>
    </div>
  );
}
