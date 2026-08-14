import React, { useState } from "react";
import { 
  X, 
  ExternalLink, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award, 
  BookOpen, 
  PhoneCall, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Palette, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  FileText 
} from "lucide-react";
import AppLogo from "./AppLogo";

interface DeveloperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGuide: () => void;
  theme: string;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  tc: any;
}

export default function DeveloperDrawer({
  isOpen,
  onClose,
  onOpenGuide,
  theme,
  onToggleTheme,
  isDarkMode,
  onToggleDarkMode,
  tc
}: DeveloperDrawerProps) {
  const [activeTab, setActiveTab] = useState<"developer" | "settings" | "support">("developer");

  if (!isOpen) return null;

  return (
    <>
      {/* Non-blocking soft backdrop so user can still clearly see map & main screen */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Floating Right Slide-Over Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] max-w-full ${isDarkMode ? 'bg-slate-950/95 text-slate-100 border-slate-800/80' : 'bg-white/95 text-slate-900 border-slate-200'} backdrop-blur-xl border-l z-50 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250`}>
        
        {/* Drawer Header */}
        <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-slate-900 bg-slate-950/70' : 'border-slate-200 bg-slate-50/70'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <AppLogo size={32} className="w-8 h-8 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black font-display tracking-tight">
                  Civil Defense System
                </h3>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${tc.badgeBg}`}>
                  v2.4.0
                </span>
              </div>
              <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-sans`}>
                Ghana Flood Hazard & Evacuation Intelligence
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

        {/* Tab Selector inside Drawer */}
        <div className={`px-5 py-2 border-b grid grid-cols-3 gap-1 ${isDarkMode ? 'border-slate-900 bg-slate-950/40' : 'border-slate-200 bg-slate-100/40'}`}>
          <button
            onClick={() => setActiveTab("developer")}
            className={`py-1.5 text-xs font-bold font-sans rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "developer"
                ? `${isDarkMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md'}`
                : `${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-1.5 text-xs font-bold font-sans rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "settings"
                ? `${isDarkMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md'}`
                : `${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveTab("support")}
            className={`py-1.5 text-xs font-bold font-sans rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "support"
                ? `${isDarkMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md'}`
                : `${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Hotlines</span>
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB 1: DEVELOPER PROFILE (ISAAC TETTEH-APOTEY) */}
          {activeTab === "developer" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Profile Card Header */}
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black font-display tracking-tight">
                        ISAAC TETTEH-APOTEY
                      </h4>
                    </div>
                    <p className="text-xs font-medium text-indigo-400 font-mono mt-0.5">
                      life2allsofts · he/him
                    </p>
                    <p className={`text-xs mt-1.5 font-sans leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <strong>Geomatics Engineer → Software Engineer</strong> | AI & Flutter Developer
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/40 flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" /> Ghana (UTC +01:00)
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-amber-400" /> Freelancer / Engineer
                  </span>
                </div>
              </div>

              {/* Developer Quote */}
              <div className={`p-3 rounded-lg border italic text-xs leading-relaxed ${isDarkMode ? 'bg-indigo-950/20 border-indigo-900/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'}`}>
                "From surveyor to software engineer — building tools for the industry I know best."
              </div>

              {/* Contact & Social Links */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
                  Connect & Links
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="mailto:life2allsofts@gmail.com"
                    className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                      isDarkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">life2allsofts@gmail.com</span>
                  </a>

                  <a
                    href="https://tetteh-apotey.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                      isDarkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <ExternalLink className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Portfolio Website</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Live</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/isaac-tetteh-apotey-67408b89"
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                      isDarkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">LinkedIn: isaac-tetteh-apotey</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>

                  <a
                    href="https://github.com/WisdomWord-GH"
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                      isDarkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">GitHub: @WisdomWord-GH</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* Featured Projects */}
              <div className="space-y-2 pt-2 border-t border-slate-800/40">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
                  🚀 Featured Projects & Innovations
                </span>
                
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-indigo-400">AI Ghana Grid Converter</strong>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Python · Flask · ML</span>
                    </div>
                    <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      3 AI models, 96 unit tests for high-precision national survey grid conversions.
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-teal-400">ITA-Gh-Surveyor GPS</strong>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">Flutter · GIS</span>
                    </div>
                    <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Professional cadastral & topo surveying suite with KML/DXF polygon export.
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-amber-400">Where In The Bible AI</strong>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">React · DeepSeek</span>
                    </div>
                    <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Semantic AI-powered scripture discovery & topical indexing assistant.
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-rose-400">Where In The Law</strong>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Flutter</span>
                    </div>
                    <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Comprehensive Ghana legal reference & constitution indexing application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education & Credentials */}
              <div className="space-y-2 pt-2 border-t border-slate-800/40">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
                  🎓 Education & Professional Accreditations
                </span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-200">M.S. Software Engineering</strong>
                      <span className="text-[11px] text-slate-400">Quantic School of Business & Technology (2026)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-200">B.S. Geomatic Engineering</strong>
                      <span className="text-[11px] text-slate-400">Kwame Nkrumah Univ. of Science and Technology (KNUST, 2015)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-200">HND Surveying & Mapping</strong>
                      <span className="text-[11px] text-slate-400">Ghana School of Surveying and Mapping (GSSM, 2010)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-200">GhIS Member (15+ Years Geomatics Experience)</strong>
                      <span className="text-[11px] text-slate-400">Ghana Institution of Surveyors</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SYSTEM SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
                Visual & Accessibility Preferences
              </span>

              {/* Dark / Light Mode Toggle */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <div>
                    <strong className="text-xs font-bold block">
                      {isDarkMode ? "Dark Mode" : "Light Mode"}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      High contrast styling for day or night use
                    </span>
                  </div>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {isDarkMode ? "Switch to Light" : "Switch to Dark"}
                </button>
              </div>

              {/* Color Theme Selector */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-2">
                    <Palette className={`w-4 h-4 ${tc.textAccent}`} />
                    Active Theme Palette
                  </span>
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                    {theme}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: "midnight", label: "Midnight Slate", color: "bg-indigo-500" },
                    { id: "emerald", label: "Emerald Earth", color: "bg-emerald-500" },
                    { id: "crimson", label: "Crimson Alert", color: "bg-rose-500" },
                    { id: "amber", label: "Amber Hazard", color: "bg-amber-500" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={onToggleTheme}
                      className={`p-2.5 rounded-lg border text-left text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        theme === t.id
                          ? 'border-indigo-500 bg-indigo-950/30 text-white'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${t.color} shrink-0`} />
                      <span className="truncate">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* App Specs */}
              <div className={`p-4 rounded-xl border space-y-2 text-xs ${isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Application Architecture:</span>
                  <span className="font-mono font-bold">React 18 + Express + Gemini</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Geodetic Engine:</span>
                  <span className="font-mono font-bold">Ghana Transverse Mercator (UTM 30N)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Digital Elevation Model:</span>
                  <span className="font-mono font-bold">Hydro-Enriched Bilinear Topo DEM</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: EMERGENCY HOTLINES & SUPPORT */}
          {activeTab === "support" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase block">
                Ghana National Emergency Dispatch Hotlines
              </span>

              <div className="space-y-2.5">
                {[
                  {
                    agency: "National Disaster Management Organisation (NADMO)",
                    lines: ["0299 350030", "0302 772926", "193"],
                    desc: "24/7 Flood rescue coordination, relief distribution, and haven allocation.",
                    badge: "Disaster HQ",
                    color: "text-rose-400"
                  },
                  {
                    agency: "Ghana National Fire & Rescue Service",
                    lines: ["192", "0302 772446"],
                    desc: "Swift-water extraction, boat rescue, and emergency building evacuation.",
                    badge: "Fire / Extraction",
                    color: "text-amber-400"
                  },
                  {
                    agency: "National Ambulance Service (NAS)",
                    lines: ["193", "112"],
                    desc: "Emergency triage, trauma response, and medical hospital transport.",
                    badge: "Medical",
                    color: "text-teal-400"
                  },
                  {
                    agency: "Ghana Police Emergency Dispatch",
                    lines: ["191", "18555", "112"],
                    desc: "Civil security, road blockage enforcement, and community crowd protection.",
                    badge: "Security",
                    color: "text-indigo-400"
                  },
                  {
                    agency: "Ghana Meteorological Agency (GMet)",
                    lines: ["0302 777172"],
                    desc: "Live radar monsoon tracking, precipitation warnings, and cyclone bulletins.",
                    badge: "Weather Radar",
                    color: "text-sky-400"
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border ${
                      isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <strong className={`text-xs font-bold block ${item.color}`}>
                          {item.agency}
                        </strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.lines.map((l, i) => (
                            <a
                              key={i}
                              href={`tel:${l.replace(/\s/g, "")}`}
                              className="text-xs font-mono font-black text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1"
                            >
                              📞 {l}
                            </a>
                          ))}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer: Interactive Guide Launcher button */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={() => {
              onClose();
              onOpenGuide();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Launch Interactive Feature Guide</span>
          </button>
        </div>

      </div>
    </>
  );
}
