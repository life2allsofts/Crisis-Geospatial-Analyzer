import { 
  Building,
  FileText,
  RefreshCw,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  BookOpen
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

export default function ResultsDisplay({
  stats,
  aiData,
  isLoading,
  tc,
  riskStyle,
  checkedRecommendations,
  toggleRecommendation,
}: ResultsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      {/* Dynamic Calculated Human & Infrastructure Footprint Indicators */}
      <div className="md:col-span-5 flex flex-col gap-6">
        
        {/* Dynamic Risk Rating Panel */}
        <div className={`p-5 rounded-xl border ${riskStyle.border} ${riskStyle.bg} flex flex-col justify-between h-[150px] shadow-lg relative overflow-hidden transition-all duration-300`}>
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">
                Vulnerability Evaluation
              </span>
              <h3 className={`text-2xl font-black font-display tracking-tight mt-0.5 ${riskStyle.text}`}>
                {stats ? stats.evaluatedSeverity : "NO SPECIFIED SITE"}
              </h3>
            </div>
            <span className="text-2xl">{riskStyle.icon}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-normal max-w-[280px] z-10">
            {stats
              ? stats.isInsideZone
                ? `The target point sits inside the active risk margin of "${stats.nearestFloodZone?.name}".`
                : `Target is located outside critical zones (Distance to nearest: ${stats.distanceToNearestZoneKm.toFixed(1)} km).`
              : "Generate analysis to determine geographic risks."}
          </p>
          <div className="absolute right-0 bottom-0 opacity-10 font-bold font-display text-7xl select-none translate-x-3 translate-y-3">
            RISK
          </div>
        </div>

        {/* Vector exposure statistics list */}
        <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg`}>
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <Building className={`w-4 h-4 ${tc.textAccent}`} />
            Hydrological Elements Exposed
          </h3>
          
          <div className="space-y-4">
            {/* People count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded border text-indigo-400 flex items-center justify-center font-semibold text-sm ${tc.badgeBg}`}>
                  🧑‍🤝‍🧑
                </div>
                <div>
                  <div className="text-[11px] text-slate-200 font-semibold leading-none">Exposed Residents</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 font-mono">WorldPop Estimator</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {stats ? stats.estimatedPeopleExposed.toLocaleString() : "—"}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  {stats ? `${stats.estimatedPopulationDensity}/km²` : "—"}
                </div>
              </div>
            </div>

            {/* Infrastructure footprints */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded border text-indigo-400 flex items-center justify-center font-semibold text-sm ${tc.badgeBg}`}>
                  🏠
                </div>
                <div>
                  <div className="text-[11px] text-slate-200 font-semibold leading-none">Structural Assets</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 font-mono">OSM Footprints Match</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {stats ? stats.estimatedBuildingsExposed.toLocaleString() : "—"}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">estimated units</div>
              </div>
            </div>

            {/* Road index */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded border text-indigo-400 flex items-center justify-center font-semibold text-sm ${tc.badgeBg}`}>
                  🛣️
                </div>
                <div>
                  <div className="text-[11px] text-slate-200 font-semibold leading-none">Exposed Roads Network</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Zonal Line Intersect</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {stats ? `${stats.estimatedRoadsExposedKm} km` : "—"}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">Grid 30N aligned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk factors panel */}
        <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg`}>
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-3">
            Computed Risk Drivers
          </h3>
          <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
            {stats ? (
              stats.riskFactors.map((factor, idx) => (
                <li key={idx} className="flex gap-1.5 items-start">
                  <span className={`inline-block font-mono shrink-0 ${tc.textAccent}`}>▪</span>
                  <span>{factor}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No evaluated markers compiled yet. Clear coordinates form above.</li>
            )}
          </ul>
        </div>
      </div>

      {/* RAG Generative Intelligence Analysis Report Card */}
      <div className="md:col-span-7 flex flex-col gap-6">
        
        {/* Generative AI report panel */}
        <div className={`${tc.cardBg} border border-slate-800/80 rounded-xl overflow-hidden shadow-lg flex-1 flex flex-col`}>
          <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/40 flex justify-between items-center shrink-0">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className={`w-4 h-4 ${tc.textAccent}`} />
              Generative Intelligence Report
            </h3>
            <span className={`text-[9px] font-mono border px-2 py-0.5 rounded uppercase ${tc.badgeBg}`}>
              Gemini RAG Reasoning
            </span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto max-h-[360px] text-xs leading-relaxed space-y-4 font-sans">
            {isLoading ? (
              <div className="py-12 flex flex-col justify-center items-center gap-2">
                <RefreshCw className={`w-6 h-6 animate-spin ${tc.textAccent}`} />
                <span className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">
                  Consolidating Geographic Context...
                </span>
              </div>
            ) : aiData ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border leading-relaxed ${tc.cardBg}`}>
                  <strong className="text-white block font-semibold mb-1 text-[11px] uppercase tracking-wider">Summary Statement</strong>
                  <p className="text-slate-200">{aiData.summary}</p>
                </div>

                <div>
                  <strong className="text-white block font-semibold mb-1 text-[11.5px] uppercase tracking-wider">Scientific Justification & Local Dynamics</strong>
                  <p className="text-slate-300 leading-relaxed">{aiData.reasoning}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 italic font-sans">
                Awaiting geospatial coordinates telemetry to prompt generative LLM analysis layers.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MITIGATION PLAN CHECKLIST & HISTORIC SOURCES ATTRIBUTION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2 col-span-12">
        
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
    </div>
  );
}
