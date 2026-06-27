import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Label,
} from "recharts";
import { 
  Shield, 
  MapPin, 
  Footprints, 
  AlertTriangle, 
  Compass, 
  Clock, 
  ArrowRight,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { EscapeRouteProfile, EscapeRoutePoint } from "../types";

interface EscapeRouteProps {
  route: EscapeRouteProfile | null;
  isLoading: boolean;
  tc: any;
  theme: string;
}

export default function EscapeRoute({ route, isLoading, tc, theme }: EscapeRouteProps) {
  if (isLoading) {
    return (
      <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-6 shadow-lg flex flex-col justify-center items-center min-h-[350px] animate-pulse`}>
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3"></div>
        <p className="text-xs text-slate-400 font-mono">Computing Escape Route Elevation Profile...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-8 shadow-lg text-center min-h-[300px] flex flex-col justify-center items-center gap-3`}>
        <div className="text-2xl">🗺️</div>
        <div className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
          Escape Route Elevation Mapper
        </div>
        <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
          Select a safe haven from the options on the left to map the escape route, calculate walk times, and generate a dynamic elevation profile.
        </p>
      </div>
    );
  }

  const chartData = route.profilePoints.map((pt, idx) => ({
    name: pt.label || `${pt.distanceKm} km`,
    distance: pt.distanceKm,
    elevation: pt.elevation,
    lat: pt.lat,
    lng: pt.lng,
    isHazard: pt.isHazardZone,
    label: pt.label,
    index: idx,
  }));

  // Identify low points or hazard points to render reference dots in the chart
  const referenceDots = chartData.filter((d) => d.label);

  const getAlertStyle = () => {
    if (route.hasHazardCrossing) {
      return "bg-red-950/20 border-red-900/40 text-red-300";
    }
    if (route.lowestElevation < 10) {
      return "bg-amber-950/20 border-amber-900/40 text-amber-300";
    }
    return "bg-emerald-950/20 border-emerald-900/40 text-emerald-300";
  };

  const getAlertIcon = () => {
    if (route.hasHazardCrossing || route.lowestElevation < 10) {
      return <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />;
    }
    return <Shield className="w-4 h-4 shrink-0 text-emerald-500" />;
  };

  // Set colors based on active theme
  const getGradientColors = () => {
    switch (theme) {
      case "emerald":
        return { stroke: "#10b981", fill: "url(#routeEmeraldGrad)" };
      case "crimson":
        return { stroke: "#f43f5e", fill: "url(#routeCrimsonGrad)" };
      case "amber":
        return { stroke: "#f59e0b", fill: "url(#routeAmberGrad)" };
      default:
        return { stroke: "#6366f1", fill: "url(#routeIndigoGrad)" };
    }
  };

  const colors = getGradientColors();

  return (
    <div className={`${tc.cardBg} border border-slate-800/85 rounded-xl p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200`}>
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800/40">
        <div>
          <span className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-wider block">
            Active Evacuation Plan
          </span>
          <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
            🏥 Escape Route: <span className={tc.textAccent}>{route.havenName}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="bg-slate-950/60 border border-slate-800 px-2 py-1 rounded text-slate-300 flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5 text-indigo-400" />
            📏 {route.totalDistanceKm} km
          </span>
          <span className="bg-slate-950/60 border border-slate-800 px-2 py-1 rounded text-slate-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            ⏱️ {route.estimatedWalkTimeMins} mins
          </span>
        </div>
      </div>

      {/* Origin -> Destination Breadcrumbs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-950/50 border border-slate-900 rounded-xl text-[10.5px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-950 shrink-0"></span>
          <div className="truncate">
            <span className="text-slate-500 font-mono uppercase text-[8.5px] block">Start Point</span>
            <span className="text-slate-200 font-mono font-medium">({route.startLat.toFixed(4)}, {route.startLng.toFixed(4)})</span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-850 pt-2.5 md:pt-0 md:pl-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-950 shrink-0 animate-pulse"></span>
          <div className="truncate">
            <span className="text-slate-500 font-mono uppercase text-[8.5px] block">Safe sanctuary</span>
            <span className="text-slate-200 font-mono font-medium">({route.havenLat.toFixed(4)}, {route.havenLng.toFixed(4)})</span>
          </div>
        </div>
      </div>

      {/* Elevation Profile Chart container */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          Elevation Profile Along Route (Southwest ➔ Northeast Cut)
        </h4>

        {/* Chart View */}
        <div className="h-[180px] w-full bg-slate-950/40 rounded-xl p-2 border border-slate-900">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="routeIndigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="routeEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="routeCrimsonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="routeAmberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis 
                dataKey="distance" 
                stroke="#475569" 
                fontSize={9} 
                fontFamily="JetBrains Mono, monospace"
                tickFormatter={(val) => `${val} km`}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={9} 
                fontFamily="JetBrains Mono, monospace"
                tickFormatter={(val) => `${val}m`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as any;
                    return (
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl font-mono text-[9.5px] leading-relaxed space-y-1">
                        <p className="text-slate-100 font-sans font-bold text-[10px]">
                          {data.label ? `📍 Waypoint: ${data.label}` : `Segment Point`}
                        </p>
                        <p className="text-slate-300">Distance: <b className="text-white">{data.distance.toFixed(2)} km</b></p>
                        <p className="text-slate-300">Elevation: <b className="text-white">{data.elevation} meters</b></p>
                        {data.isHazard && (
                          <p className="text-rose-400 font-bold">⚠️ Inside Inundation Zone</p>
                        )}
                        <p className="text-slate-500 text-[8.5px]">GPS: {data.lat}, {data.lng}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="elevation"
                stroke={colors.stroke}
                strokeWidth={2}
                fill={colors.fill}
                activeDot={{ r: 4 }}
              />
              {/* Highlight special waypoints such as Start, Haven, and Hazard Low Points */}
              {referenceDots.map((dot, idx) => {
                const isStart = dot.label === "Start";
                const isHaven = dot.label === "Haven";
                const fill = isStart ? "#6366f1" : isHaven ? "#10b981" : "#f59e0b";
                return (
                  <ReferenceDot
                    key={idx}
                    x={dot.distance}
                    y={dot.elevation}
                    r={4}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono px-1">
          <span className="flex items-center gap-1">🟢 Start point ({route.profilePoints[0].elevation}m)</span>
          <span className="flex items-center gap-1">🟡 Low target ({route.lowestElevation}m)</span>
          <span className="flex items-center gap-1">🔵 Haven Sanctuary ({route.profilePoints[route.profilePoints.length - 1].elevation}m)</span>
        </div>
      </div>

      {/* Dynamic Route Warning / Safety Status Card */}
      <div className={`p-3.5 border rounded-xl flex gap-3 text-[11px] leading-relaxed ${getAlertStyle()}`}>
        {getAlertIcon()}
        <div>
          <span className="font-bold block text-[10px] uppercase font-mono tracking-wider mb-0.5">
            Route Safety Bulletin
          </span>
          <p className="font-sans font-normal text-slate-300">
            {route.routeAlert}
          </p>
        </div>
      </div>
    </div>
  );
}
