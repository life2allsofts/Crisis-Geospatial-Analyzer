import { useState, useEffect } from "react";
import { Globe, Clock, Palette, Menu, X, BookOpen, Building, Sparkles, ClipboardList, ShieldAlert, Compass, Layers, ArrowLeft } from "lucide-react";
import {
  GHANA_PRESETS,
  LocationPreset,
  GeospatialStats,
  AiRiskResponse,
  AnalyzeApiResponse,
  CLIMATE_SCENARIOS,
  ClimateScenarioInfo,
  EscapeRouteProfile
} from "./types";
import { MapView, ControlPanel, ResultsDisplay } from "./components";
import { utm30NToLatLng, isCoordinateInGhana } from "./utils/geoUtils";
import { fetchEscapeRoute } from "./utils/apiClient";

type AppTheme = "midnight" | "emerald" | "crimson" | "amber";

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<AppTheme>("midnight");

  // Primary geographic configuration state
  const [inputMode, setInputMode] = useState<"wgs84" | "utm30n">("wgs84");
  const [latInput, setLatInput] = useState<string>("5.5891");
  const [lngInput, setLngInput] = useState<string>("-0.2145");
  const [utmEasting, setUtmEasting] = useState<string>("255146");
  const [utmNorthing, setUtmNorthing] = useState<string>("617942");

  const [bufferRadius, setBufferRadius] = useState<number>(2000); // meters

  // Active simulated climate scenario ID
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("baseline");

  // Realized state values passed to Map and Services
  const [latitude, setLatitude] = useState<number>(5.5891);
  const [longitude, setLongitude] = useState<number>(-0.2145);

  // Pipeline status and responses
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<GeospatialStats | null>(null);
  const [aiData, setAiData] = useState<AiRiskResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // Escape Route planning states
  const [selectedHavenId, setSelectedHavenId] = useState<string | null>(null);
  const [activeEscapeRoute, setActiveEscapeRoute] = useState<EscapeRouteProfile | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState<boolean>(false);

  // Checked recommendations UX tracker
  const [checkedRecommendations, setCheckedRecommendations] = useState<Record<number, boolean>>({});

  // Hamburger dropdown & walkthrough guide states
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<number>(1);

  // Active screen layout state: "map" | "metrics" | "ai_report" | "action_plan" | "safe_havens" | "escape_route" | "historical_timeline"
  const [activeScreen, setActiveScreen] = useState<string>("map");

  // Reset checked recommendations when ai data updates
  useEffect(() => {
    setCheckedRecommendations({});
  }, [aiData]);

  // Load backend health details on startup
  useEffect(() => {
    fetchHealthStatus();
    // Run initial analysis for Accra Circle confluence under baseline
    handleRunAnalysis(5.5891, -0.2145, 2000, "baseline");
  }, []);

  // Automatically select the nearest safe haven when new analysis results (stats) are loaded
  useEffect(() => {
    if (stats?.safeHavens && stats.safeHavens.length > 0) {
      setSelectedHavenId(stats.safeHavens[0].id);
    } else {
      setSelectedHavenId(null);
      setActiveEscapeRoute(null);
    }
  }, [stats]);

  // Fetch escape route details whenever start position or targeted safe haven changes
  useEffect(() => {
    if (selectedHavenId && latitude && longitude) {
      const loadRoute = async () => {
        setIsRouteLoading(true);
        try {
          const res = await fetchEscapeRoute(latitude, longitude, selectedHavenId);
          if (res.success) {
            setActiveEscapeRoute(res.routeProfile);
          } else {
            setActiveEscapeRoute(null);
          }
        } catch (e) {
          console.error("Error loading escape route:", e);
          setActiveEscapeRoute(null);
        } finally {
          setIsRouteLoading(false);
        }
      };
      loadRoute();
    } else {
      setActiveEscapeRoute(null);
    }
  }, [selectedHavenId, latitude, longitude]);


  const fetchHealthStatus = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthStatus(data);
    } catch (e) {
      console.warn("Backend health diagnostics unreachable:", e);
    }
  };

  // Triggers coordinate conversion from Ghana National Grid
  const handleUTMProjection = () => {
    const east = parseFloat(utmEasting);
    const north = parseFloat(utmNorthing);

    if (isNaN(east) || isNaN(north)) {
      setErrorMsg("Easting and Northing values must be valid whole meters.");
      return;
    }

    const transformed = utm30NToLatLng(east, north);
    setLatInput(transformed.lat.toFixed(4).toString());
    setLngInput(transformed.lng.toFixed(4).toString());
    setInputMode("wgs84");

    // Immediately set actual coordinate states
    setLatitude(transformed.lat);
    setLongitude(transformed.lng);
    setErrorMsg(null);

    // Automatically trigger analysis
    handleRunAnalysis(transformed.lat, transformed.lng, bufferRadius);
  };

  const executePipeline = () => {
    setErrorMsg(null);
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setErrorMsg("Invalid Latitude. Must be between -90 and 90.");
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setErrorMsg("Invalid Longitude. Must be between -180 and 180.");
      return;
    }

    setLatitude(lat);
    setLongitude(lng);
    handleRunAnalysis(lat, lng, bufferRadius);
  };

  const handleScenarioChange = (newScenarioId: string) => {
    setSelectedScenarioId(newScenarioId);
    handleRunAnalysis(latitude, longitude, bufferRadius, newScenarioId);
  };

  const handleRunAnalysis = async (lat: number, lng: number, radius: number, scenarioId: string = selectedScenarioId) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          bufferRadius: radius,
          scenarioId
        })
      });

      if (!response.ok) {
        throw new Error("Geospatial calculations failed on backend cluster.");
      }

      const resJson: AnalyzeApiResponse = await response.json();
      if (resJson.success) {
        setStats(resJson.analysis);
        setAiData(resJson.ai);
      } else {
        throw new Error("Internal error executing algorithm.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to contact analysis server.");
    } finally {
      setIsLoading(false);
    }
  };


  // Updates parameters immediately when clicking a preset
  const handlePresetSelect = (preset: LocationPreset) => {
    setLatInput(preset.lat.toString());
    setLngInput(preset.lng.toString());
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setBufferRadius(preset.bufferRadius);
    setInputMode("wgs84");
    handleRunAnalysis(preset.lat, preset.lng, preset.bufferRadius);
  };

  // Relocates target when clicking the Leaflet map
  const handleMapClick = (lat: number, lng: number) => {
    setLatInput(lat.toFixed(4).toString());
    setLngInput(lng.toFixed(4).toString());
    setLatitude(lat);
    setLongitude(lng);
    handleRunAnalysis(lat, lng, bufferRadius);
  };

  // Loop themes
  const toggleTheme = () => {
    const list: AppTheme[] = ["midnight", "emerald", "crimson", "amber"];
    const nextIdx = (list.indexOf(theme) + 1) % list.length;
    setTheme(list[nextIdx]);
  };

  // Theme configuration properties mapper
  const getThemeClasses = (t: AppTheme) => {
    switch (t) {
      case "emerald":
        return {
          bg: "bg-emerald-950/30 text-stone-100",
          navBg: "bg-stone-900/70 border-emerald-900/30",
          cardBg: "bg-emerald-950/20 border-emerald-900/30",
          badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          btnGradient: "from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-950/50",
          btnSecondary: "hover:border-emerald-700/60",
          hoverAccentText: "group-hover:text-emerald-400",
          accentBadge: "group-hover:bg-emerald-950/30 group-hover:border-emerald-800/30 group-hover:text-emerald-400",
          textAccent: "text-emerald-400",
          sliderAccent: "accent-emerald-500",
          themeCircleColor: "bg-emerald-500"
        };
      case "crimson":
        return {
          bg: "bg-slate-950 text-slate-100",
          navBg: "bg-neutral-905/70 border-rose-900/30",
          cardBg: "bg-rose-950/10 border-rose-950/45",
          badgeBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
          btnGradient: "from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-950/50",
          btnSecondary: "hover:border-rose-700/65",
          hoverAccentText: "group-hover:text-rose-400",
          accentBadge: "group-hover:bg-rose-950/30 group-hover:border-rose-850/30 group-hover:text-rose-400",
          textAccent: "text-rose-400",
          sliderAccent: "accent-rose-500",
          themeCircleColor: "bg-rose-500"
        };
      case "amber":
        return {
          bg: "bg-stone-950 text-stone-100",
          navBg: "bg-zinc-905/70 border-amber-900/30",
          cardBg: "bg-amber-950/10 border-amber-950/35",
          badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          btnGradient: "from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-amber-950/50",
          btnSecondary: "hover:border-amber-700/60",
          hoverAccentText: "group-hover:text-amber-400",
          accentBadge: "group-hover:bg-amber-950/30 group-hover:border-amber-800/30 group-hover:text-amber-400",
          textAccent: "text-amber-400",
          sliderAccent: "accent-amber-500",
          themeCircleColor: "bg-amber-500"
        };
      default: // midnight
        return {
          bg: "bg-slate-950 text-slate-100",
          navBg: "bg-slate-900/60 border-slate-800",
          cardBg: "bg-slate-900/80 border-slate-800",
          badgeBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/35",
          btnGradient: "from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 shadow-indigo-900/30",
          btnSecondary: "hover:border-slate-700",
          hoverAccentText: "group-hover:text-indigo-400",
          accentBadge: "group-hover:bg-indigo-950/20 group-hover:border-indigo-800/30 group-hover:text-indigo-400",
          textAccent: "text-indigo-400",
          sliderAccent: "accent-indigo-500",
          themeCircleColor: "bg-indigo-500"
        };
    }
  };

  const tc = getThemeClasses(theme);

  // Risk coloring scheme helper
  const getRiskStyles = (severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined) => {
    switch (severity) {
      case "CRITICAL":
        return {
          bg: "bg-red-950/40 border-red-700/60",
          text: "text-red-400",
          border: "border-red-900/40",
          icon: "🔴"
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/40 border-orange-700/60",
          text: "text-orange-400",
          border: "border-orange-900/40",
          icon: "🟠"
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-950/30 border-yellow-700/40",
          text: "text-yellow-400",
          border: "border-yellow-900/30",
          icon: "🟡"
        };
      default:
        return {
          bg: "bg-emerald-950/30 border-emerald-800/40",
          text: "text-emerald-400",
          border: "border-emerald-900/30",
          icon: "🟢"
        };
    }
  };

  const riskStyle = getRiskStyles(stats?.evaluatedSeverity);

  const toggleRecommendation = (idx: number) => {
    setCheckedRecommendations((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className={`min-h-screen ${tc.bg} font-sans pb-12 transition-colors duration-350`}>
      {/* 🚀 HUD Top-Bar Command Station */}
      <nav className={`border-b ${tc.navBg} backdrop-blur-md sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tc.btnGradient} flex items-center justify-center shadow-md transition-all`}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
                CRISIS GEOSPATIAL ANALYZER
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all ${tc.badgeBg}`}>
                  GHANA HYDRO v1.0
                </span>
              </h1>
              <p className="text-xs text-slate-400">Flood Exposure Intelligence and RAG-based Risk Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* 🎨 Theme Toggler - Circular Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group shadow-sm"
              title="Toggle system theme"
            >
              <Palette className={`w-3.5 h-3.5 ${tc.textAccent} transition-colors`} />
              <span className="uppercase text-[9px] font-bold tracking-wider">Theme:</span>
              <span className={`w-2 h-2 rounded-full ${tc.themeCircleColor} inline-block shadow`} />
              <span className="capitalize text-[10px]">{theme}</span>
            </button>

            {healthStatus ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>SERVER ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>LOCAL SIMULATOR</span>
              </div>
            )}
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleTimeString()} (GMT)</span>
            </div>

            {/* 🍔 Hamburger menu button with side sliding drawer */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center justify-center p-2 rounded-lg border border-slate-700/60 bg-slate-900/85 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm focus:outline-none"
                title="Open Emergency Command Center"
              >
                <Menu className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <>
                  {/* Sliding Backdrop Overlay */}
                  <div 
                    className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-40 animate-in fade-in duration-200" 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  
                  {/* Slide-out Drawer Panel */}
                  <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-slate-950 border-l border-slate-900 z-50 shadow-2xl flex flex-col justify-between h-full animate-in slide-in-from-right duration-250">
                    
                    {/* Drawer Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                      
                      {/* Drawer Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                        <div>
                          <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase">
                            Emergency Command Center
                          </span>
                          <h3 className="text-base font-black font-display tracking-tight text-white mt-0.5">
                            GHANA HYDRO v1.0
                          </h3>
                        </div>
                        <button
                          onClick={() => setIsMenuOpen(false)}
                          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Section 1: ACTIVE CRITICAL SCREENS */}
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">
                          Active Simulations & Tools
                        </span>
                        
                        <div className="space-y-2">
                          {[
                            {
                              id: "map",
                              name: "Interactive Flood Map",
                              desc: "Set coordinates, custom buffer zones and simulation presets.",
                              icon: <Globe className="w-4 h-4 shrink-0" />
                            },
                            {
                              id: "metrics",
                              name: "Exposure & Assets",
                              desc: "Exposed residents density, structure units, and slope aspect.",
                              icon: <Building className="w-4 h-4 shrink-0" />
                            },
                            {
                              id: "ai_report",
                              name: "Generative AI Report",
                              desc: "Deep RAG-based geological hazards assessments by Gemini LLMs.",
                              icon: <Sparkles className="w-4 h-4 shrink-0" />
                            },
                            {
                              id: "action_plan",
                              name: "Action Plan & Citations",
                              desc: "Safety mitigation protocols and official scientific sources.",
                              icon: <ClipboardList className="w-4 h-4 shrink-0" />
                            },
                            {
                              id: "safe_havens",
                              name: "Emergency Safe Havens",
                              desc: "Calculate closest high-altitude sanctuaries and contact numbers.",
                              icon: <ShieldAlert className="w-4 h-4 shrink-0" />
                            },
                            {
                              id: "escape_route",
                              name: "Escape Route Profile",
                              desc: "Walking path cross-sections, walk times and hazard crossings.",
                              icon: <Compass className="w-4 h-4 shrink-0" />
                            },
                            {
                              id: "historical_timeline",
                              name: "Historical Inundations",
                              desc: "Recorded multi-decade flood inundation cycles of Accra.",
                              icon: <Layers className="w-4 h-4 shrink-0" />
                            }
                          ].map((item) => {
                            const isSelected = activeScreen === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setActiveScreen(item.id);
                                  setIsMenuOpen(false);
                                }}
                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                                  isSelected
                                    ? `bg-indigo-950/30 border-indigo-500/30 text-white`
                                    : "bg-slate-900/30 border-slate-900 hover:bg-slate-900/60 hover:border-slate-800 text-slate-300 hover:text-white"
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${
                                  isSelected ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" : "bg-slate-950/50 border-slate-800 text-slate-400 group-hover:text-slate-200"
                                }`}>
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold font-display tracking-tight block">
                                      {item.name}
                                    </span>
                                    {isSelected && (
                                      <span className="text-[8px] bg-indigo-500 text-white font-bold px-1.5 py-0.2 rounded uppercase font-mono tracking-wider">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300 leading-normal block mt-1">
                                    {item.desc}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 2: SYSTEM GUIDES */}
                      <div className="space-y-3 pt-4 border-t border-slate-900">
                        <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase block">
                          System Actions & Info
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setIsGuideOpen(true);
                              setIsMenuOpen(false);
                              setGuideStep(1);
                            }}
                            className="text-left px-3 py-2.5 bg-slate-900/40 hover:bg-slate-900 hover:text-white border border-slate-900 hover:border-slate-800 text-slate-300 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer font-sans font-semibold"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                            Walkthrough Guide
                          </button>
                          
                          <button
                            onClick={() => {
                              toggleTheme();
                              setIsMenuOpen(false);
                            }}
                            className="text-left px-3 py-2.5 bg-slate-900/40 hover:bg-slate-900 hover:text-white border border-slate-900 hover:border-slate-800 text-slate-300 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer font-sans font-semibold"
                          >
                            <Palette className="w-3.5 h-3.5 text-indigo-400" />
                            Cycle Theme ({theme})
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Drawer Footer */}
                    <div className="p-5 border-t border-slate-900 bg-slate-950">
                      <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl space-y-1">
                        <span className="text-[8.5px] font-bold font-mono tracking-wider text-slate-500 uppercase block">
                          📞 National Rescue Hotline
                        </span>
                        <span className="text-xs font-bold text-rose-400 font-mono block">
                          NADMO 24/7 Helpline: 0299 350030
                        </span>
                        <span className="text-[9px] text-slate-400 leading-relaxed block font-sans">
                          In case of active flooding, call emergency services immediately.
                        </span>
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeScreen === "map" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ==================== LEFT CONTROL COLUMN ==================== */}
            <div className="lg:col-span-4">
              <ControlPanel
                inputMode={inputMode}
                setInputMode={setInputMode}
                latInput={latInput}
                setLatInput={setLatInput}
                lngInput={lngInput}
                setLngInput={setLngInput}
                easting={utmEasting}
                setEasting={setUtmEasting}
                northing={utmNorthing}
                setNorthing={setUtmNorthing}
                bufferRadius={bufferRadius}
                setBufferRadius={setBufferRadius}
                isLoading={isLoading}
                tc={tc}
                onPresetSelect={handlePresetSelect}
                onUTMConvertAndAnalyze={handleUTMProjection}
                onWGSAnalyze={executePipeline}
                selectedScenarioId={selectedScenarioId}
                onScenarioChange={handleScenarioChange}
              />
            </div>


            {/* ==================== CENTER & RIGHT VISUALIZER ==================== */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* 🗺️ Big Interactive Geographic Mapping Canvas */}
              <div className="h-[400px]">
                <MapView
                  latitude={latitude}
                  longitude={longitude}
                  bufferRadiusMeters={bufferRadius}
                  stats={stats}
                  onMapClick={handleMapClick}
                  activeEscapeRoute={activeEscapeRoute}
                />
              </div>

              {errorMsg && (
                <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200">
                  ⚠️ <b>Execution warning:</b> {errorMsg}
                </div>
              )}

              {/* ================= STATE RESULTS DISPLAY ================= */}
              <ResultsDisplay
                stats={stats}
                aiData={aiData}
                isLoading={isLoading}
                tc={tc}
                riskStyle={riskStyle}
                checkedRecommendations={checkedRecommendations}
                toggleRecommendation={toggleRecommendation}
                theme={theme}
                selectedHavenId={selectedHavenId}
                setSelectedHavenId={setSelectedHavenId}
                activeEscapeRoute={activeEscapeRoute}
                isRouteLoading={isRouteLoading}
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
                onlyShowBanner={true}
              />

            </div>

          </div>
        ) : (
          <div className="space-y-6">
            {/* 🔙 Beautiful Screen Header Navigation Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800/85 bg-slate-900/60 shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveScreen("map")}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Map</span>
                </button>
                <div className="h-4 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase">
                    Focused Analytical Screen
                  </span>
                  <h2 className="text-sm font-black font-display tracking-tight text-white capitalize">
                    {activeScreen.replace("_", " ")} View
                  </h2>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-850">
                <span>COORD:</span>
                <span className="text-indigo-400 font-bold">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
              </div>
            </div>

            {/* Large full-width results display of focused feature */}
            <div className="p-1 rounded-xl bg-slate-950/10 border border-slate-900/20">
              <ResultsDisplay
                stats={stats}
                aiData={aiData}
                isLoading={isLoading}
                tc={tc}
                riskStyle={riskStyle}
                checkedRecommendations={checkedRecommendations}
                toggleRecommendation={toggleRecommendation}
                theme={theme}
                selectedHavenId={selectedHavenId}
                setSelectedHavenId={setSelectedHavenId}
                activeEscapeRoute={activeEscapeRoute}
                isRouteLoading={isRouteLoading}
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
                onlyShowBanner={false}
              />
            </div>
          </div>
        )}
      </main>

      {/* 📘 Interactive Step-by-Step Walkthrough Assessment Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Transparent click backdrop overlay to close modal */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsGuideOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            
            {/* Header section with titles */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className={`w-4 h-4 ${tc.textAccent}`} />
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-200">
                  Interactive Platform Guide
                </h3>
              </div>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-all font-sans cursor-pointer focus:outline-none"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Dynamic Step-tracker badges info and line items timeline */}
            <div className="bg-slate-950 px-5 py-2.5 flex items-center justify-between text-[10px] font-mono border-b border-slate-800/40">
              <span className="text-slate-400">Step {guideStep} of 3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1.5 rounded transition-all duration-300 ${
                      step === guideStep ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Wizard step specific body panels */}
            <div className="p-6 text-xs min-h-[300px] max-h-[350px] overflow-y-auto space-y-4 text-slate-300">
              {guideStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    📍 1. Inputting Coordinates
                  </h4>
                  <p className="leading-relaxed">
                    Set geographic points within Ghana bounds to calculate physical distances to primary hydrological planes dynamically.
                  </p>
                  <div className="space-y-2 mt-4">
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 leading-relaxed text-[11px]">
                      <strong className="text-slate-200 block mb-0.5">🎮 Interactive Map Click</strong>
                      Position your pointer anywhere on the interactive Leaflet map and mouse-click. Standard GPS coordinates are configured instantly.
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 leading-relaxed text-[11px]">
                      <strong className="text-slate-200 block mb-0.5">📂 Target Ghana Presets</strong>
                      Click predefined hotspots under the presets menu (e.g., Akosombo Spillways, Odaw Plain) to load coordinates directly.
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 leading-relaxed text-[11px]">
                      <strong className="text-slate-200 block mb-0.5">✏️ Manual Input</strong>
                      Input WGS-84 coordinate parameters (Lat/Lng) inside the form fields and fire calculation routines.
                    </div>
                  </div>

                  {/* interactive quick click demo inside the guide */}
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        handlePresetSelect(GHANA_PRESETS[1]); // Odaw River Basin
                        setIsGuideOpen(false);
                      }}
                      className="w-full py-2.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-slate-950 text-indigo-400 font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      ⚡ Try Quick Demo: Load "Odaw River Basin" & Exit
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    🌐 2. Transverse Mercator (UTM-30N) Converter
                  </h4>
                  <p className="leading-relaxed">
                    Convert Ghanaian local survey grid parameters (national grid in meters) directly to generic geographic GPS lat/lng degrees.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-[11px] pl-1 text-slate-300">
                    <li>
                      Toggle the <span className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-200">UTM-30N</span> switch on the Vulnerability Controls panel.
                    </li>
                    <li>
                      Input the local grid metrics in meters in both **Easting (X)** and **Northing (Y)** parameter fields.
                    </li>
                    <li>
                      Click **Convert Grid & Analyze** to execute the projection scripts.
                    </li>
                    <li>
                      The coordinates convert immediately, the map focal pointer pivots, and backend GIS calculators process physical exposures.
                    </li>
                  </ol>

                  {/* UTM Simulation button inside guide */}
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        setUtmEasting("239569");
                        setUtmNorthing("614132");
                        setInputMode("utm30n");
                        const transformed = utm30NToLatLng(239569, 614132);
                        setLatInput(transformed.lat.toFixed(4).toString());
                        setLngInput(transformed.lng.toFixed(4).toString());
                        setInputMode("wgs84");
                        setLatitude(transformed.lat);
                        setLongitude(transformed.lng);
                        handleRunAnalysis(transformed.lat, transformed.lng, bufferRadius);
                        setIsGuideOpen(false);
                      }}
                      className="w-full py-2.5 rounded-lg border border-teal-500/20 bg-teal-500/10 hover:bg-slate-950 text-teal-400 font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      ⚡ Try Quick Demo: Convert "Weija Dam" UTM Coordinates & Exit
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 3 && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    📈 3. Interpreting Assessment Results
                  </h4>
                  <p className="leading-relaxed">
                    Understand the generated outputs from the geospatial algorithms and Gemini reasoning.
                  </p>
                  
                  <div className="space-y-3 mt-4 text-[11px]">
                    <div className="flex gap-2.5 items-start">
                      <span className="text-sm shrink-0">🚨</span>
                      <div>
                        <strong className="text-slate-100 block">Vulnerability Evaluation badge</strong>
                        Displays Threat rating levels from `LOW` to `CRITICAL` indicating exact physical distance offsets to river spillways or catchments.
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-sm shrink-0">🏘️</span>
                      <div>
                        <strong className="text-slate-100 block">Hydrological Elements Exposures</strong>
                        Estimates resident counts computed directly on high-resolution WorldPop population density models and structural asset counts on OpenStreetMap datasets.
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-sm shrink-0">🤖</span>
                      <div>
                        <strong className="text-slate-100 block">Gemini RAG Reasoning</strong>
                        Combines topological distance statistics with regional rainfall histories, building buffer zones, and water basins to deliver precise, tailored scientific assessments.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer nav indicators */}
            <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center">
              {guideStep > 1 ? (
                <button 
                  onClick={() => setGuideStep(p => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-semibold text-xs hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}

              {guideStep < 3 ? (
                <button 
                  onClick={() => setGuideStep(p => p + 1)}
                  className={`px-3.5 py-1.5 rounded-lg bg-gradient-to-r ${tc.btnGradient} text-white font-semibold text-xs transition-all cursor-pointer`}
                >
                  Next Step →
                </button>
              ) : (
                <button 
                  onClick={() => setIsGuideOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Finish Guide
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
