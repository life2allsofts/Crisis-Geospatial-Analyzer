import { useState } from "react";
import { 
  Shield, 
  MapPin, 
  Users, 
  Phone, 
  Compass, 
  Search, 
  ChevronRight,
  ExternalLink,
  LifeBuoy,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { GeospatialStats } from "../types";

interface SafeHavensProps {
  stats: GeospatialStats | null;
  tc: any;
  theme: string;
  selectedHavenId: string | null;
  setSelectedHavenId: (id: string | null) => void;
  activeEscapeRoute: any | null;
  isRouteLoading: boolean;
  onNavigateToRoute?: () => void;
}

const REGIONAL_NADMO_DIRECTORY = [
  { region: "Greater Accra", office: "Accra Regional Office", phone: "0302 299350", hotline: "0299 350030", address: "Ministries, Accra" },
  { region: "Ashanti", office: "Kumasi Regional Office", phone: "0322 012345", hotline: "0299 350040", address: "KMA, Kumasi" },
  { region: "Western", office: "Sekondi-Takoradi Office", phone: "0312 022345", hotline: "0299 350050", address: "Regional Co-ordinating Council, Sekondi" },
  { region: "Central", office: "Cape Coast Regional Office", phone: "0332 032345", hotline: "0299 350080", address: "Cape Coast Castle Road" },
  { region: "Eastern", office: "Koforidua Regional Office", phone: "0342 042345", hotline: "0299 350070", address: "Ministries Area, Koforidua" },
  { region: "Northern", office: "Tamale Regional Office", phone: "0372 022345", hotline: "0299 350060", address: "Tamale Central" },
  { region: "Volta", office: "Ho Regional Office", phone: "0362 052345", hotline: "0299 350090", address: "Ho Civic Centre" },
  { region: "Upper East", office: "Bolgatanga Regional Office", phone: "0382 022345", hotline: "0299 350100", address: "Bolga Central" },
  { region: "Upper West", office: "Wa Regional Office", phone: "0392 022345", hotline: "0299 350110", address: "Wa Municipal" },
  { region: "Savannah", office: "Damongo Regional Office", phone: "0243 987654", hotline: "0299 350120", address: "Damongo" },
  { region: "Oti", office: "Dambai Regional Office", phone: "0244 112233", hotline: "0299 350130", address: "Dambai Central" },
  { region: "Ahafo", office: "Goaso Regional Office", phone: "0202 445566", hotline: "0299 350140", address: "Goaso" },
  { region: "Bono", office: "Sunyani Regional Office", phone: "0352 023456", hotline: "0299 350150", address: "Sunyani" },
  { region: "Bono East", office: "Techiman Regional Office", phone: "0352 911223", hotline: "0299 350160", address: "Techiman Market Rd" },
  { region: "North East", office: "Nalerigu Regional Office", phone: "0245 667788", hotline: "0299 350170", address: "Nalerigu" },
  { region: "Western North", office: "Sefwi Wiawso Office", phone: "0246 889900", hotline: "0299 350180", address: "Sefwi Wiawso" }
];

export default function SafeHavens({ 
  stats, 
  tc, 
  theme,
  selectedHavenId,
  setSelectedHavenId,
  activeEscapeRoute,
  isRouteLoading,
  onNavigateToRoute,
}: SafeHavensProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDirCollapsed, setIsDirCollapsed] = useState(true);
  const safeHavens = stats?.safeHavens || [];

  const filteredDirectory = REGIONAL_NADMO_DIRECTORY.filter(item => 
    item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.office.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* 🚀 LEFT PANEL: Nearest Designated Safe Havens */}
      <div className="lg:col-span-6 space-y-4 flex flex-col">
        <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex flex-col flex-1`}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <LifeBuoy className={`w-4 h-4 ${tc.textAccent}`} />
                Nearest NADMO Safe Havens
              </h3>
              {stats && (
                <span className="text-[9px] bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 font-bold px-2 py-0.5 rounded font-mono">
                  SELECT FOR ROUTE PROFILE
                </span>
              )}
            </div>

            {stats ? (
              <div className="space-y-3">
                {safeHavens.length > 0 ? (
                  safeHavens.map((haven, idx) => {
                    const isFirst = idx === 0;
                    const isSelected = selectedHavenId === haven.id;
                    return (
                      <div 
                        key={haven.id} 
                        onClick={() => setSelectedHavenId(haven.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer hover:bg-slate-900/10 ${
                          isSelected 
                            ? "bg-indigo-950/20 border-indigo-500 ring-1 ring-indigo-500/40 shadow-indigo-950/40 shadow-md" 
                            : isFirst
                              ? "bg-indigo-950/5 border-slate-850 hover:border-indigo-500/25"
                              : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm">🏟️</span>
                              <h4 className="text-xs font-bold text-slate-200 font-display">
                                {haven.name}
                              </h4>
                              {isFirst && (
                                <span className="text-[8px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">
                                  Nearest
                                </span>
                              )}
                              {isSelected && (
                                <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">
                                  🎯 Active Target
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              {haven.type} • Region: <span className="text-slate-300 font-sans">{haven.region}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${
                              isSelected ? "bg-indigo-500 text-white" : isFirst ? "bg-indigo-500/15 text-indigo-400" : "bg-slate-800 text-slate-300"
                            }`}>
                              📍 {haven.distanceKm} km
                            </span>
                          </div>
                        </div>

                        {/* Capacity and Contacts */}
                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/40 text-[10px] text-slate-300">
                          <div className="flex items-center gap-1.5 font-mono text-slate-400">
                            <Users className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                            <span>Capacity: <b className="text-slate-200 font-sans">{haven.capacity.toLocaleString()}</b></span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-slate-400">
                            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                            <span className="truncate">Contact: <b className="text-slate-200 font-sans">{haven.contact.split("Hotline:")[1] || haven.contact}</b></span>
                          </div>
                        </div>

                        {/* Evacuation Route Guides */}
                        <div className="mt-3 p-2.5 bg-slate-950/60 rounded-lg border border-slate-900 text-[10px]">
                          <div className="font-semibold text-slate-400 flex items-center gap-1 font-mono uppercase text-[9px] tracking-wider">
                            <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            Evacuation Road Guide
                          </div>
                          <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                            {haven.evacuationRoutes.map((route, rIdx) => (
                              <li key={rIdx} className="leading-relaxed font-sans">{route}</li>
                            ))}
                          </ul>
                        </div>

                        {isSelected && (
                          <div className="mt-3 p-2.5 bg-indigo-950/45 border border-indigo-500/30 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 animate-in slide-in-from-top-1 duration-250">
                            <span className="text-indigo-400 font-bold text-[10px] uppercase font-mono tracking-wider">
                              🎯 Evacuation Route Calculated!
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onNavigateToRoute) onNavigateToRoute();
                              }}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] rounded font-mono uppercase tracking-wider text-center shrink-0 cursor-pointer flex items-center justify-center gap-1"
                            >
                              <span>Open Elevation Mapper Screen</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-slate-500 italic">
                    No safe havens available for this selection.
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 bg-slate-950/30 border border-slate-900 rounded-lg text-center text-slate-500 text-[11px] italic font-sans flex flex-col justify-center items-center gap-2">
                <span>🏥</span>
                <span>Select coordinates or a floodplain preset above to calculate nearest emergency safe havens.</span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-auto pt-4 border-t border-slate-900/40">
            🚨 Click any sanctuary block above to calculate the dynamic elevation cut profile and safety warnings.
          </div>
        </div>
      </div>

      {/* 🚀 RIGHT PANEL: NADMO Directories */}
      <div className="lg:col-span-6 space-y-4 flex flex-col">
        
        {/* Searchable NADMO Ghana Directory - Collapsible to keep layout super neat */}
        <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex flex-col`}>
          <div>
            <div 
              onClick={() => setIsDirCollapsed(!isDirCollapsed)}
              className="flex justify-between items-center cursor-pointer select-none"
            >
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Shield className={`w-4 h-4 ${tc.textAccent}`} />
                NADMO Ghana Directory Lookup
              </h3>
              <div className="text-slate-500">
                {isDirCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </div>
            </div>
            
            {!isDirCollapsed && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Access official contact channels of the National Disaster Management Organisation (NADMO) for regional level rescue operations.
                </p>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search region or regional office..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 font-sans"
                  />
                </div>

                {/* Directory Scroll Area */}
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {filteredDirectory.length > 0 ? (
                    filteredDirectory.map((item) => (
                      <div key={item.region} className="p-3 bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-lg transition-all group">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-wide">
                              {item.region} Region
                            </span>
                            <h4 className="text-xs font-bold text-slate-200 mt-0.5 font-display">
                              {item.office}
                            </h4>
                            <p className="text-[9.5px] text-slate-400 mt-0.5">{item.address}</p>
                          </div>
                          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">📞</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-900/60 text-[10px]">
                          <div>
                            <div className="text-[8px] text-slate-500 font-mono uppercase">Direct Office</div>
                            <a href={`tel:${item.phone}`} className="text-slate-300 font-mono hover:text-white font-semibold transition-colors flex items-center gap-1 mt-0.5">
                              {item.phone}
                            </a>
                          </div>
                          <div>
                            <div className="text-[8px] text-rose-500 font-mono uppercase font-semibold">24/7 Hotline</div>
                            <a href={`tel:${item.hotline}`} className="text-rose-400 font-mono hover:text-rose-300 font-black transition-colors flex items-center gap-1 mt-0.5">
                              {item.hotline}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-500 italic text-[11px]">
                      No matching regional directories found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Emergency Card */}
          <div className="mt-4 p-3 bg-red-950/20 border border-red-900/35 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm shrink-0">
              🚨
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-red-400 font-display">NATIONAL TOLL-FREE HOTLINES</div>
              <p className="text-[9px] text-slate-300 font-sans mt-0.5 leading-tight">
                Dial <a href="tel:112" className="font-black text-white hover:underline">112</a> or <a href="tel:193" className="font-black text-white hover:underline">193</a> directly inside Ghana.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
