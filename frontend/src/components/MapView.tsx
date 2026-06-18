import { useEffect, useRef } from "react";
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

export default function MapView({
  latitude,
  longitude,
  bufferRadiusMeters,
  stats,
  onMapClick
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const activePinRef = useRef<any>(null);
  const activeBufferCircleRef = useRef<any>(null);
  const hazardOverlaysRef = useRef<any[]>([]);

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

      // CartoDB Dark Matter - Stunning midnight/tactical visual design
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        }
      ).addTo(map);

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

  return (
    <div className="relative w-full h-[320px] md:h-full min-h-[300px] border border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" id="geospatial-visualizer-canvas" />
      
      {/* Absolute floating map legend indicating status colors */}
      <div className="absolute bottom-4 right-4 z-[999] bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 text-[11px] font-sans flex flex-col gap-1.5 shadow-xl max-w-[200px]">
        <div className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-1">Hazard Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] border border-white/20" />
          <span className="text-slate-200">Critical Watershed Hazard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f97316] border border-white/20" />
          <span className="text-slate-200">High Coastal/River Spill</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eab308] border border-white/20" />
          <span className="text-slate-200">Medium Lowlands / Urban</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981] border border-white/20" />
          <span className="text-slate-200">Low-Risk Elevated Ground</span>
        </div>
        <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-slate-400 text-center font-mono">
          Click map to relocate pin
        </div>
      </div>
    </div>
  );
}
