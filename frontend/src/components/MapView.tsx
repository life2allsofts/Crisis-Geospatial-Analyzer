import { useEffect, useRef, useState } from "react";
import { GeospatialStats } from "../types";

interface MapViewProps {
  latitude: number;
  longitude: number;
  bufferRadiusMeters: number;
  stats: GeospatialStats | null;
  onMapClick: (lat: number, lng: number) => void;
}

// Coordinate list of all known floodplains to render reference overlays on startup!
const REFERENCE_HAZARDS = [
  { name: "Korle Lagoon Outlet & Odaw Basin", lat: 5.5414, lng: -0.2198, radiusM: 2500, severity: "CRITICAL" },
  { name: "Mallam & Gbawe Valley", lat: 5.5682, lng: -0.2854, radiusM: 1800, severity: "HIGH" },
  { name: "Alajo, Circle & Kaneshie Intersection", lat: 5.5891, lng: -0.2145, radiusM: 2000, severity: "CRITICAL" },
  { name: "Mepe Lower Volta Basin", lat: 5.9875, lng: 0.6120, radiusM: 4500, severity: "CRITICAL" },
  { name: "Sogakope Coastal Delta Buffer", lat: 5.9984, lng: 0.5968, radiusM: 3500, severity: "HIGH" },
  { name: "Aboabo Kumasi Drainage", lat: 6.6948, lng: -1.6144, radiusM: 1500, severity: "HIGH" },
  { name: "Tamale South Lowland Plains", lat: 9.3824, lng: -0.8354, radiusM: 3000, severity: "MEDIUM" }
];

// Map tile layer URLs
const TILE_LAYERS = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

const MAP_STYLES = [
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "light", label: "Light", icon: "☀️" },
  { id: "satellite", label: "Satellite", icon: "🛰️" },
  { id: "streets", label: "Streets", icon: "🗺️" }
] as const;

export default function MapView({
  latitude,
  longitude,
  bufferRadiusMeters,
  stats,
  onMapClick
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const activePinRef = useRef<any>(null);
  const activeBufferCircleRef = useRef<any>(null);
  const hazardOverlaysRef = useRef<any[]>([]);
  const [legendOpen, setLegendOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState<"dark" | "light" | "satellite" | "streets">("dark");

  // Function to update map tiles dynamically
  const updateMapTiles = (style: "dark" | "light" | "satellite" | "streets") => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    // Remove existing tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Add new tile layer
    const tileUrl = TILE_LAYERS[style];
    const attribution = style === "satellite" 
      ? '&copy; <a href="https://www.esri.com">Esri</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19
    }).addTo(map);
    
    tileLayerRef.current = newTileLayer;
    setMapStyle(style);
  };

  useEffect(() => {
    // 1. Double check if Leaflet L is loaded via CDN inside index.html
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    // 2. Initialize map if not yet created. Standard center covers whole Ghana.
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [7.9465, -1.0232],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Default style
      const initialTileLayer = L.tileLayer(TILE_LAYERS[mapStyle], {
        attribution: mapStyle === "satellite"
          ? '&copy; <a href="https://www.esri.com">Esri</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(map);
      tileLayerRef.current = initialTileLayer;

      // Event listener: clicking custom map updates position inputs
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        onMapClick(parseFloat(lat.toFixed(4)), parseFloat(lng.toFixed(4)));
      });

      mapInstanceRef.current = map;

      // Draw permanent hazard overlays representing our dataset zones
      REFERENCE_HAZARDS.forEach((hz) => {
        const color = hz.severity === "CRITICAL" ? "#ef4444" : hz.severity === "HIGH" ? "#ea580c" : "#f59e0b";
        const circle = L.circle([hz.lat, hz.lng], {
          radius: hz.radiusM,
          color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.12,
          dashArray: "3, 6"
        })
          .addTo(map)
          .bindPopup(
            `<div class="text-slate-900 font-sans">
              <strong class="text-red-600 block font-semibold">${hz.name}</strong>
              <span class="text-xs text-slate-500 font-mono">Topographical hazard zones</span>
              <div class="mt-1 text-xs">Evaluated rating: <b class="font-bold text-orange-600">${hz.severity}</b></div>
             </div>`
          );
        hazardOverlaysRef.current.push(circle);
      });
    }

    const map = mapInstanceRef.current;

    // 3. Keep viewport updated to targeted coordinates
    map.setView([latitude, longitude], map.getZoom() < 10 ? 12 : map.getZoom());

    // 4. Remove stale target markers
    if (activePinRef.current) {
      map.removeLayer(activePinRef.current);
    }
    if (activeBufferCircleRef.current) {
      map.removeLayer(activeBufferCircleRef.current);
    }

    // 5. Stylize active buffer ring depending on calculated hazards
    let mainColor = "#3b82f6"; // Default blue
    if (stats) {
      const risk = stats.evaluatedSeverity;
      if (risk === "CRITICAL") mainColor = "#ef4444";
      else if (risk === "HIGH") mainColor = "#f97316";
      else if (risk === "MEDIUM") mainColor = "#eab308";
      else mainColor = "#10b981";
    }

    // Draw active user targeting ring
    activeBufferCircleRef.current = L.circle([latitude, longitude], {
      color: mainColor,
      weight: 2,
      fillColor: mainColor,
      fillOpacity: 0.2,
      radius: bufferRadiusMeters
    }).addTo(map);

    // Render active coordinates target pin
    const pulsingMarkerHtml = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75" style="background-color: ${mainColor}"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 border border-white" style="background-color: ${mainColor}"></span>
      </div>
    `;

    const customIcon = L.divIcon({
      html: pulsingMarkerHtml,
      className: "custom-leaflet-pulsing-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    activePinRef.current = L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<div class="text-slate-900 font-sans leading-tight">
          <strong class="font-bold text-slate-700 block">TARGET PINPOINT</strong>
          <span class="text-xs text-slate-500 font-mono">${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°W</span>
          <div class="mt-1 text-xs">Buffer radius: <b>${(bufferRadiusMeters / 1000).toFixed(1)} km</b></div>
        </div>`
      );

  }, [latitude, longitude, bufferRadiusMeters, stats]);

  const toggleLegend = () => {
    setLegendOpen(!legendOpen);
  };

  const toggleControls = () => {
    setControlsOpen(!controlsOpen);
  };

  const handleStyleChange = (style: "dark" | "light" | "satellite" | "streets") => {
    updateMapTiles(style);
    setControlsOpen(false);
  };

  return (
    <div className="relative w-full h-[320px] md:h-full min-h-[300px] border border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" id="geospatial-visualizer-canvas" />
      
      {/* ===== BOTTOM RIGHT CONTROLS GROUP ===== */}
      <div className="absolute bottom-4 right-4 z-[999] flex items-end gap-2 max-w-[calc(100%-2rem)]">
        
        {/* Map Style Controls - Placed at the left of the hazard legend */}
        <div className="relative">
          {/* Controls Toggle Button */}
          <button
            onClick={toggleControls}
            className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/90 transition-all shadow-xl flex items-center gap-1.5 text-[10px] font-medium cursor-pointer"
            title="Map Style"
          >
            <span>{MAP_STYLES.find(s => s.id === mapStyle)?.icon || "🗺️"}</span>
            <span className="hidden sm:inline">{MAP_STYLES.find(s => s.id === mapStyle)?.label || "Style"}</span>
            <span className={`text-slate-500 text-[8px] transition-transform duration-300 ${controlsOpen ? 'rotate-180' : 'rotate-0'}`}>
              ▼
            </span>
          </button>

          {/* Controls Dropdown - Opens upward above the button */}
          {controlsOpen && (
            <div className="absolute bottom-full left-0 mb-1.5 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-1 shadow-xl flex flex-col min-w-[100px] animate-in fade-in slide-in-from-bottom-2 duration-150">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleChange(style.id)}
                  className={`px-2.5 py-1.5 rounded-md flex items-center gap-2 text-[10px] text-left w-full transition-all cursor-pointer ${
                    mapStyle === style.id 
                      ? "bg-slate-700 text-white font-medium" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== HAZARD LEGEND - Collapsible by default ===== */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg shadow-xl w-[135px] sm:w-[150px] overflow-hidden transition-all duration-300">
          {/* Legend Header - Always Visible */}
          <div
            onClick={toggleLegend}
            className="flex items-center justify-between px-2.5 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors select-none"
          >
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">🗺️ Legend</span>
            <span className={`text-slate-400 text-xs transition-transform duration-300 ${legendOpen ? 'rotate-180' : 'rotate-0'}`}>
              ▼
            </span>
          </div>

          {/* Legend Items - Collapsible */}
          <div className={`transition-all duration-300 overflow-hidden ${legendOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-800/50">
              <div className="flex items-center gap-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">Critical</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f97316] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">High</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#eab308] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">Medium</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">Low</span>
              </div>
              <div className="mt-2 pt-1 border-t border-slate-800/50 text-[8px] text-slate-500 text-center font-mono">
                Click map to relocate
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
