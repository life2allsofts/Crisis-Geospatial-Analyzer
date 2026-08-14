import { useState, useEffect } from "react";
import { 
  Menu, 
  Palette, 
  Sun, 
  Moon, 
  Activity, 
  Clock, 
  ArrowLeft,
  Navigation,
  Sliders,
  User,
  BookOpen
} from "lucide-react";
import {
  GHANA_PRESETS,
  LocationPreset,
  GeospatialStats,
  AiRiskResponse,
  AnalyzeApiResponse,
  CLIMATE_SCENARIOS,
  EscapeRouteProfile,
  MapTileStyle
} from "./types";
import { 
  MapView, 
  ControlPanel, 
  ResultsDisplay, 
  AppLogo,
  DeveloperDrawer,
  GeospatialToolsDrawer,
  InteractiveUserGuide,
  NavigationMenuBar
} from "./components";
import { utm30NToLatLng } from "./utils/geoUtils";
import { fetchEscapeRoute } from "./utils/apiClient";

type AppTheme = "midnight" | "ocean" | "emerald" | "crimson" | "amber" | "light";

export default function App() {
  // Theme & Accessibility Dark Mode State
  const [theme, setTheme] = useState<AppTheme>("midnight");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

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

  // Safe Havens Layer Toggle (Crucial: Default to OFF as requested)
  const [showSafeHavens, setShowSafeHavens] = useState<boolean>(false);

  // Escape Route planning states
  const [selectedHavenId, setSelectedHavenId] = useState<string | null>(null);
  const [activeEscapeRoute, setActiveEscapeRoute] = useState<EscapeRouteProfile | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState<boolean>(false);

  // Checked recommendations UX tracker
  const [checkedRecommendations, setCheckedRecommendations] = useState<Record<number, boolean>>({});

  // Dual Hamburger Drawers (Left: Tools & Presets, Right: Developer & Settings)
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState<boolean>(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState<boolean>(false);

  // Floating Interactive User Guide state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Map Tile Style State (Dark, Satellite, Streets, Light)
  const [mapStyle, setMapStyle] = useState<MapTileStyle>("dark");

  // Active screen layout state: "map" | "metrics" | "ai_report" | "action_plan" | "safe_havens" | "escape_route" | "historical_timeline"
  const [activeScreen, setActiveScreen] = useState<string>("map");

  // Reset checked recommendations when ai data updates
  useEffect(() => {
    setCheckedRecommendations({});
  }, [aiData]);

  // Load backend health details on startup and run initial analysis
  useEffect(() => {
    fetchHealthStatus();
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

    setLatitude(transformed.lat);
    setLongitude(transformed.lng);
    setErrorMsg(null);

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

  // Theme Toggler
  const toggleTheme = () => {
    const list: AppTheme[] = ["midnight", "ocean", "emerald", "crimson", "amber", "light"];
    const nextIdx = (list.indexOf(theme) + 1) % list.length;
    const nextTheme = list[nextIdx];
    setTheme(nextTheme);
    setIsDarkMode(nextTheme !== "light");
  };

  // Dedicated Dark/Light Mode Switcher
  const toggleDarkMode = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      setTheme("light");
    } else {
      setIsDarkMode(true);
      setTheme("midnight");
    }
  };

  // Theme configuration properties mapper
  const getThemeClasses = (t: AppTheme) => {
    switch (t) {
      case "light":
        return {
          bg: "bg-slate-100 text-slate-900",
          navBg: "bg-white/90 border-slate-200 shadow-sm",
          cardBg: "bg-white border-slate-200 shadow-sm",
          badgeBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
          btnGradient: "from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 shadow-indigo-200",
          btnSecondary: "hover:border-indigo-300",
          hoverAccentText: "group-hover:text-indigo-600",
          accentBadge: "group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-700",
          textAccent: "text-indigo-600",
          sliderAccent: "accent-indigo-600",
          themeCircleColor: "bg-indigo-600"
        };
      case "ocean":
        return {
          bg: "bg-slate-950 text-slate-100",
          navBg: "bg-sky-950/60 border-sky-900/30",
          cardBg: "bg-sky-950/20 border-sky-900/30",
          badgeBg: "bg-sky-500/20 text-sky-400 border-sky-500/30",
          btnGradient: "from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-950/50",
          btnSecondary: "hover:border-sky-700/60",
          hoverAccentText: "group-hover:text-sky-400",
          accentBadge: "group-hover:bg-sky-950/30 group-hover:border-sky-800/30 group-hover:text-sky-400",
          textAccent: "text-sky-400",
          sliderAccent: "accent-sky-500",
          themeCircleColor: "bg-sky-500"
        };
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
          navBg: "bg-neutral-900/70 border-rose-900/30",
          cardBg: "bg-rose-950/10 border-rose-950/45",
          badgeBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
          btnGradient: "from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-950/50",
          btnSecondary: "hover:border-rose-700/65",
          hoverAccentText: "group-hover:text-rose-400",
          accentBadge: "group-hover:bg-rose-950/30 group-hover:border-rose-800/30 group-hover:text-rose-400",
          textAccent: "text-rose-400",
          sliderAccent: "accent-rose-500",
          themeCircleColor: "bg-rose-500"
        };
      case "amber":
        return {
          bg: "bg-stone-950 text-stone-100",
          navBg: "bg-zinc-900/70 border-amber-900/30",
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
          navBg: "bg-slate-900/80 border-slate-800",
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

  // Risk styling helper
  const getRiskStyles = (severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined) => {
    switch (severity) {
      case "CRITICAL":
        return {
          bg: isDarkMode ? "bg-red-950/40 border-red-700/60" : "bg-red-50 border-red-200",
          text: isDarkMode ? "text-red-400" : "text-red-700",
          border: isDarkMode ? "border-red-900/40" : "border-red-200",
          icon: "🔴"
        };
      case "HIGH":
        return {
          bg: isDarkMode ? "bg-orange-950/40 border-orange-700/60" : "bg-orange-50 border-orange-200",
          text: isDarkMode ? "text-orange-400" : "text-orange-700",
          border: isDarkMode ? "border-orange-900/40" : "border-orange-200",
          icon: "🟠"
        };
      case "MEDIUM":
        return {
          bg: isDarkMode ? "bg-yellow-950/30 border-yellow-700/40" : "bg-yellow-50 border-yellow-200",
          text: isDarkMode ? "text-yellow-400" : "text-yellow-700",
          border: isDarkMode ? "border-yellow-900/30" : "border-yellow-200",
          icon: "🟡"
        };
      default:
        return {
          bg: isDarkMode ? "bg-emerald-950/30 border-emerald-800/40" : "bg-emerald-50 border-emerald-200",
          text: isDarkMode ? "text-emerald-400" : "text-emerald-700",
          border: isDarkMode ? "border-emerald-900/30" : "border-emerald-200",
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
    <div className={`h-screen flex flex-col ${tc.bg} font-sans transition-colors duration-300 overflow-hidden`}>
      
      {/* 🚀 COMPACT & CUTE TOP HEADER (Dual Corner Hamburger Menus & Custom Logo) */}
      <header className={`border-b ${tc.navBg} shrink-0 sticky top-0 z-40 transition-colors duration-300 w-full`}>
        <div className="w-full px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
          
          {/* LEFT CORNER: Left Hamburger Menu (Tools, Presets, Controls) & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* 🍔 LEFT HAMBURGER MENU BUTTON */}
            <button
              onClick={() => {
                setIsLeftDrawerOpen(true);
                setIsRightDrawerOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
                isDarkMode 
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white' 
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
              title="Open Geospatial Tools & Presets Menu"
            >
              <Menu className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Custom App Logo & Title */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveScreen("map")}>
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                <AppLogo size={32} className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm font-black font-display tracking-tight text-white flex items-center gap-1.5 truncate">
                    <span className={isDarkMode ? "text-white" : "text-slate-900"}>CRISIS GEOSPATIAL</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${tc.badgeBg}`}>
                      GHANA v2.4.2
                    </span>
                  </h1>
                </div>
                <span className={`text-[10px] hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-sans`}>
                  Civil Defense Flood & Evacuation Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CORNER: Themes, Server Status, Guide Shortcut & Right Hamburger Menu */}
          <div className="flex items-center gap-2 text-xs font-mono">
            
            {/* Interactive Guide Shortcut button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-sans font-bold transition-all cursor-pointer shadow-sm ${
                isDarkMode 
                  ? 'border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300' 
                  : 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
              }`}
              title="Open Interactive Feature Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guide</span>
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-400' 
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Theme Palette Cycling */}
            <button
              onClick={toggleTheme}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white' 
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
              }`}
              title="Cycle Theme Colors"
            >
              <Palette className={`w-3.5 h-3.5 ${tc.textAccent}`} />
              <span className={`w-2 h-2 rounded-full ${tc.themeCircleColor}`} />
            </button>

            {/* Server Status Indicator */}
            {healthStatus ? (
              <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/20 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>STANDALONE</span>
              </div>
            )}

            {/* 🍔 RIGHT HAMBURGER MENU BUTTON (Developer details, Settings, Hotlines, Version) */}
            <button
              onClick={() => {
                setIsRightDrawerOpen(true);
                setIsLeftDrawerOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
                isDarkMode 
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white' 
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
              title="Open System Info, Developer Details & Support"
            >
              <Menu className="w-4 h-4 text-teal-400" />
            </button>

          </div>
        </div>
      </header>

      {/* 🧭 NAVIGATION MENU BAR DIRECTLY UNDER HEADER WITH 0 SPACE */}
      <NavigationMenuBar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        showSafeHavens={showSafeHavens}
        onToggleSafeHavens={() => setShowSafeHavens(!showSafeHavens)}
        selectedScenarioId={selectedScenarioId}
        onScenarioChange={handleScenarioChange}
        onPresetSelect={handlePresetSelect}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
        onOpenToolsDrawer={() => setIsLeftDrawerOpen(true)}
        tc={tc}
        isDarkMode={isDarkMode}
        stats={stats}
      />

      {/* 📱 MAIN WORKSPACE VIEW (Fill whole window, zero margin/padding on left, right, or below the map) */}
      {activeScreen === "map" ? (
        <main className="flex-1 w-full h-full p-0 m-0 relative overflow-hidden">
          <MapView
            latitude={latitude}
            longitude={longitude}
            bufferRadiusMeters={bufferRadius}
            stats={stats}
            onMapClick={handleMapClick}
            activeEscapeRoute={activeEscapeRoute}
            showSafeHavens={showSafeHavens}
            mapStyle={mapStyle}
            onMapStyleChange={setMapStyle}
            onSelectSafeHaven={(havenId) => {
              setSelectedHavenId(havenId);
              setActiveScreen("escape_route");
            }}
          />

          {/* Floating Execution Warning Alert if any */}
          {errorMsg && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] max-w-lg w-[90%] p-3 rounded-xl bg-red-950/90 border border-red-800 text-xs text-red-200 flex items-center justify-between shadow-2xl backdrop-blur-md">
              <div>⚠️ <b>Execution warning:</b> {errorMsg}</div>
              <button 
                onClick={() => setErrorMsg(null)}
                className="px-2 py-0.5 rounded bg-red-900/80 text-red-100 hover:bg-red-800 text-[10px] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </main>
      ) : (
        /* FOCUSED ANALYTICAL MODULE VIEWS */
        <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Sub-Screen Header with Return to Map Button */}
            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
              isDarkMode ? 'border-slate-800/80 bg-slate-900/70' : 'border-slate-200 bg-white'
            } shadow-md backdrop-blur-md`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveScreen("map")}
                  className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    isDarkMode 
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-750' 
                      : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Map</span>
                </button>
                <div className={`h-4 w-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`} />
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase">
                    Focused Analytical Module
                  </span>
                  <h2 className="text-xs sm:text-sm font-black font-display tracking-tight capitalize">
                    {activeScreen.replace("_", " ")} View
                  </h2>
                </div>
              </div>
              <div className={`hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-lg border ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <span>FOCAL POINT:</span>
                <span className="text-indigo-400 font-bold">{latitude.toFixed(4)}°N, {longitude.toFixed(4)}°W</span>
              </div>
            </div>

            {/* Detailed Results Display for Active Screen */}
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
        </main>
      )}

      {/* 🧭 LEFT HAMBURGER DRAWER: Geospatial Tools, Presets, UTM Converter & Scenarios */}
      <GeospatialToolsDrawer
        isOpen={isLeftDrawerOpen}
        onClose={() => setIsLeftDrawerOpen(false)}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
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
        selectedScenarioId={selectedScenarioId}
        onScenarioChange={handleScenarioChange}
        onPresetSelect={handlePresetSelect}
        onUTMConvertAndAnalyze={handleUTMProjection}
        onWGSAnalyze={executePipeline}
        isLoading={isLoading}
        tc={tc}
        isDarkMode={isDarkMode}
      />

      {/* 👤 RIGHT HAMBURGER DRAWER: Isaac Tetteh-Apotey Profile, App Version, Settings & Hotlines */}
      <DeveloperDrawer
        isOpen={isRightDrawerOpen}
        onClose={() => setIsRightDrawerOpen(false)}
        onOpenGuide={() => setIsGuideOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        tc={tc}
      />

      {/* 📘 FLOATING INTERACTIVE FEATURE GUIDE (Non-blocking: main screen and map stay visible and clickable) */}
      <InteractiveUserGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        isDarkMode={isDarkMode}
        onLoadPreset={handlePresetSelect}
        onConvertUTM={() => {
          setUtmEasting("239569");
          setUtmNorthing("614132");
          const transformed = utm30NToLatLng(239569, 614132);
          setLatInput(transformed.lat.toFixed(4).toString());
          setLngInput(transformed.lng.toFixed(4).toString());
          setLatitude(transformed.lat);
          setLongitude(transformed.lng);
          handleRunAnalysis(transformed.lat, transformed.lng, bufferRadius);
        }}
        onToggleSafeHavens={() => setShowSafeHavens(!showSafeHavens)}
        showSafeHavens={showSafeHavens}
        onSetScenario={handleScenarioChange}
        onNavigateScreen={(screen) => setActiveScreen(screen)}
      />

    </div>
  );
}
