import { useState, useEffect } from "react";
import { 
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { 
  Calendar, 
  Filter, 
  MapPin, 
  Skull, 
  Users, 
  AlertTriangle,
  Info,
  Clock,
  BookOpen
} from "lucide-react";
import { HistoricalFloodEvent } from "../types";

interface TimelineChartProps {
  tc: any;
  theme: string;
}

const GHANA_REGIONS = [
  "All Regions",
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "North East",
  "Savannah"
];

export default function TimelineChart({ tc, theme }: TimelineChartProps) {
  const [events, setEvents] = useState<HistoricalFloodEvent[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [startYear, setStartYear] = useState(2015);
  const [endYear, setEndYear] = useState(2025);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalFloodEvent | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const regionParam = selectedRegion === "All Regions" ? "all" : selectedRegion;
        const res = await fetch(`/api/historical-events?region=${encodeURIComponent(regionParam)}&startYear=${startYear}&endYear=${endYear}`);
        const data = await res.json();
        if (data.success) {
          setEvents(data.events || []);
          if (data.events && data.events.length > 0) {
            // Find a high-impact event to pre-select
            const sorted = [...data.events].sort((a, b) => b.peopleDisplaced - a.peopleDisplaced);
            setSelectedEvent(sorted[0]);
          } else {
            setSelectedEvent(null);
          }
        }
      } catch (err) {
        console.error("Failed to load historical flood events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [selectedRegion, startYear, endYear]);

  // Aggregate year-by-year metrics for the Recharts graph
  const yearsRange = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const chartData = yearsRange.map(year => {
    const yearEvents = events.filter(e => e.year === year);
    const displaced = yearEvents.reduce((sum, e) => sum + e.peopleDisplaced, 0);
    const deaths = yearEvents.reduce((sum, e) => sum + (e.deaths || 0), 0);
    return {
      year,
      displaced,
      deaths,
      eventsCount: yearEvents.length,
      eventNameString: yearEvents.map(e => e.eventName).join(", ") || "No significant recorded events"
    };
  });

  // Custom Tooltip component for Recharts
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-xl text-[11px] max-w-xs font-sans">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Year {data.year}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4 text-indigo-400">
              <span className="flex items-center gap-1">👥 Displaced:</span>
              <span className="font-bold font-mono">{data.displaced.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-4 text-rose-400">
              <span className="flex items-center gap-1">💀 Fatalities:</span>
              <span className="font-bold font-mono">{data.deaths.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-4 text-slate-400">
              <span>⚡ Events recorded:</span>
              <span className="font-bold font-mono">{data.eventsCount}</span>
            </div>
          </div>
          {data.eventsCount > 0 && (
            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 italic">
              <b>Peak:</b> {data.eventNameString}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* 📊 TOP CONTROLS & FILTER BAR */}
      <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-4 shadow-md`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Filter Left: Region */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                Geographical Filter
              </div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 font-sans font-medium focus:outline-none focus:border-slate-700"
              >
                {GHANA_REGIONS.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Right: Year Range Slider */}
          <div className="flex items-center gap-4 flex-1 max-w-md min-w-[240px]">
            <div className="text-right">
              <div className="text-[9px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                Temporal Boundary
              </div>
              <div className="text-xs font-bold text-slate-300 font-mono">
                {startYear} – {endYear}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <select
                value={startYear}
                onChange={(e) => setStartYear(Math.min(parseInt(e.target.value), endYear))}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-md px-2 py-1 font-mono"
              >
                {Array.from({ length: 11 }, (_, i) => 2015 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="text-slate-600 text-xs font-mono">to</span>
              <select
                value={endYear}
                onChange={(e) => setEndYear(Math.max(parseInt(e.target.value), startYear))}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-md px-2 py-1 font-mono"
              >
                {Array.from({ length: 11 }, (_, i) => 2015 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Direct Metric Counter */}
          <div className="text-right">
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-400 font-bold px-2 py-1 rounded font-mono">
              {events.length} HIGH-IMPACT EVENTS RECORDED
            </span>
          </div>

        </div>
      </div>

      {/* 📊 MAIN GRID: CHART & DETAILED SELECTED VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPONENT: Recharts Timeline Chart */}
        <div className="lg:col-span-8 flex flex-col">
          <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex-1 flex flex-col`}>
            <div className="mb-4">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className={`w-4 h-4 ${tc.textAccent}`} />
                Historical Inundation & Casualty Severity Trend (2015 - 2025)
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                Displays the correlation of historical displacees (bars, left axis) vs. human casualties (line, right axis). Hover on datapoints to view details.
              </p>
            </div>

            {loading ? (
              <div className="h-[280px] flex items-center justify-center text-slate-500 font-mono text-xs">
                Analyzing historical databases...
              </div>
            ) : events.length === 0 ? (
              <div className="h-[280px] flex flex-col items-center justify-center text-slate-500 text-xs italic gap-2 bg-slate-950/20 border border-slate-900 rounded-lg">
                <span>⚠️</span>
                <span>No major disaster events recorded within this time window or region.</span>
              </div>
            ) : (
              <div className="h-[280px] w-full font-mono text-[10px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke="#475569" 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#6366f1" 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#f43f5e" 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#334155', opacity: 0.15 }} />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle" 
                      iconSize={6}
                      wrapperStyle={{ paddingBottom: '10px' }}
                    />
                    <Bar 
                      yAxisId="left" 
                      name="Displaced People (Pop)" 
                      dataKey="displaced" 
                      fill="url(#displacedColor)" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={32}
                    />
                    <Line 
                      yAxisId="right" 
                      name="Fatalities (Count)" 
                      type="monotone" 
                      dataKey="deaths" 
                      stroke="#f43f5e" 
                      strokeWidth={2} 
                      dot={{ r: 4, stroke: "#991b1b", strokeWidth: 1.5, fill: "#f43f5e" }}
                      activeDot={{ r: 6 }}
                    />

                    {/* Gradients definition */}
                    <defs>
                      <linearGradient id="displacedColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.85}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex items-center gap-1.5 mt-4 p-2 bg-slate-950/40 border border-slate-900 rounded-lg text-[9.5px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span><b>Return Period insight:</b> Large magnitude events (e.g., 2015, 2023) exhibit return intervals of 5-8 years inside urban basins.</span>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: Focused event detailed inspect card */}
        <div className="lg:col-span-4 flex flex-col">
          <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg flex-1 flex flex-col`}>
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Historical Dossier
            </h3>

            {selectedEvent ? (
              <div className="space-y-4 flex flex-col flex-grow">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold font-mono bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                      YEAR {selectedEvent.year}
                    </span>
                    <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded ${
                      selectedEvent.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-400"
                        : selectedEvent.severity === "HIGH"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-indigo-500/25 text-indigo-300"
                    }`}>
                      {selectedEvent.severity} SEVERITY
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-200 mt-2 font-display leading-tight">
                    {selectedEvent.eventName}
                  </h4>
                  <div className="text-[10.5px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    Regions: {selectedEvent.regions.join(", ")}
                  </div>
                </div>

                {/* Statistics Box */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-center">
                  <div>
                    <div className="text-[8.5px] text-slate-500 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      Displaced
                    </div>
                    <div className="text-sm font-black font-mono text-indigo-400 mt-1">
                      {selectedEvent.peopleDisplaced.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[8.5px] text-slate-500 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                      <Skull className="w-3 h-3 text-slate-500" />
                      Fatalities
                    </div>
                    <div className="text-sm font-black font-mono text-rose-400 mt-1">
                      {selectedEvent.deaths !== undefined ? selectedEvent.deaths.toLocaleString() : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Breakdown details */}
                <div className="space-y-3.5 text-[10px] leading-relaxed flex-grow">
                  <div>
                    <span className="font-bold font-mono uppercase text-slate-500 text-[8.5px] tracking-wider block">Disaster Trigger:</span>
                    <span className="text-slate-300 mt-0.5 block">{selectedEvent.trigger}</span>
                  </div>

                  <div>
                    <span className="font-bold font-mono uppercase text-slate-500 text-[8.5px] tracking-wider block">Property Damage & Impact:</span>
                    <span className="text-slate-300 mt-0.5 block">{selectedEvent.propertyDamage}</span>
                  </div>

                  <div>
                    <span className="font-bold font-mono uppercase text-slate-500 text-[8.5px] tracking-wider block">Description Breakdown:</span>
                    <span className="text-slate-400 mt-0.5 block leading-relaxed">{selectedEvent.description}</span>
                  </div>
                </div>

                {/* Metadata source */}
                <div className="pt-3 border-t border-slate-900/40 text-[9.5px] text-slate-500 font-mono">
                  Source: {selectedEvent.source}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs italic font-sans flex-1 flex flex-col justify-center items-center">
                Select an event from the roster below to view detailed breakdown records.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 📋 INDIVIDUAL EVENTS DIRECT ROSTER GRID */}
      <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-indigo-400" />
            Historic Catastrophe Log Registry
          </h3>
          <span className="text-[9px] font-mono text-slate-500">
            Showing {events.length} historical logs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {events.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-950/15 border-indigo-500/40 ring-1 ring-indigo-500/30"
                    : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[9.5px] font-mono text-indigo-400 font-bold">
                      {event.year} Flood
                    </span>
                    <span className={`text-[8.5px] font-bold font-mono px-1.5 rounded ${
                      event.severity === "CRITICAL"
                        ? "bg-red-950/80 text-red-400"
                        : event.severity === "HIGH"
                        ? "bg-amber-950/80 text-amber-400"
                        : "bg-slate-900 text-slate-300"
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                  <h4 className="text-[11.5px] font-bold text-slate-200 mt-1 font-display group-hover:text-indigo-400 transition-colors leading-snug">
                    {event.eventName}
                  </h4>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                  <span>👤 {event.peopleDisplaced.toLocaleString()} displaced</span>
                  <span className="text-[9px] text-indigo-500 font-bold group-hover:translate-x-0.5 transition-transform">
                    Inspect ➔
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
