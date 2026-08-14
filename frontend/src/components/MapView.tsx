import { useEffect, useRef, useState } from "react";
import { GeospatialStats, MapTileStyle } from "../types";

interface MapViewProps {
  latitude: number;
  longitude: number;
  bufferRadiusMeters: number;
  stats: GeospatialStats | null;
  onMapClick: (lat: number, lng: number) => void;
  activeEscapeRoute?: any | null;
  showSafeHavens?: boolean;
  onSelectSafeHaven?: (havenId: string) => void;
  mapStyle?: MapTileStyle;
  onMapStyleChange?: (style: MapTileStyle) => void;
}

// Coordinate list of all known floodplains to render reference overlays on startup!
const REFERENCE_HAZARDS = [
  { name: "Korle Lagoon Outlet & Odaw Basin", lat: 5.5414, lng: -0.2198, radiusM: 2500, severity: "CRITICAL" },
  { name: "Mallam & Gbawe Valley", lat: 5.5682, lng: -0.2854, radiusM: 1800, severity: "HIGH" },
  { name: "Alajo, Circle & Kaneshie Intersection", lat: 5.5891, lng: -0.2145, radiusM: 2000, severity: "CRITICAL" },
  { name: "Mepe Lower Volta Basin", lat: 5.9875, lng: 0.6120, radiusM: 4500, severity: "CRITICAL" },
  { name: "Sogakope Coastal Delta Buffer", lat: 5.9984, lng: 0.5968, radiusM: 3500, severity: "HIGH" },
  { name: "Aboabo Kumasi Drainage", lat: 6.6948, lng: -1.6144, radiusM: 1500, severity: "HIGH" },
  { name: "Tamale South Lowland Plains", lat: 9.3824, lng: -0.8354, radiusM: 3000, severity: "MEDIUM" },
  { name: "Tarkwa Gold Mining Valley", lat: 5.3014, lng: -2.0024, radiusM: 2500, severity: "HIGH" },
  { name: "Sekondi-Takoradi Coastal Storm Buffer", lat: 4.8871, lng: -1.7485, radiusM: 2000, severity: "HIGH" },
  { name: "Bolgatanga White Volta Floodplain", lat: 10.7856, lng: -0.8514, radiusM: 3500, severity: "CRITICAL" },
  { name: "Wa South Lowland Basin", lat: 9.8974, lng: -2.5085, radiusM: 2200, severity: "MEDIUM" },
  { name: "Cape Coast Coastal Erosion Belt", lat: 5.1053, lng: -1.2464, radiusM: 1800, severity: "HIGH" },
  { name: "Kasoa Akweley Drain Junction", lat: 5.5424, lng: -0.4215, radiusM: 2000, severity: "HIGH" },
  { name: "Koforidua Nsukwao Basin", lat: 6.0945, lng: -0.2591, radiusM: 1800, severity: "HIGH" },
  { name: "Buipe Black Volta Crossing", lat: 8.7845, lng: -1.5423, radiusM: 3200, severity: "HIGH" },
  { name: "Nkwanta River Siltation Zone", lat: 8.2575, lng: 0.5214, radiusM: 2000, severity: "MEDIUM" },
  { name: "Goaso Tano River Basin", lat: 6.8041, lng: -2.5183, radiusM: 2000, severity: "MEDIUM" }
];

// Map tile layer URLs
const TILE_LAYERS: Record<MapTileStyle, string> = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

export default function MapView({
  latitude,
  longitude,
  bufferRadiusMeters,
  stats,
  onMapClick,
  activeEscapeRoute,
  showSafeHavens = false,
  onSelectSafeHaven,
  mapStyle = "dark",
  onMapStyleChange
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const activePinRef = useRef<any>(null);
  const activeBufferCircleRef = useRef<any>(null);
  const hazardOverlaysRef = useRef<any[]>([]);
  const activeEscapeRouteLineRef = useRef<any>(null);
  const activeEscapeRouteHavenRef = useRef<any>(null);
  const activeEscapeRouteHazardsRef = useRef<any[]>([]);
  const safeHavenMarkersRef = useRef<any[]>([]);
  const [legendOpen, setLegendOpen] = useState(false);

  // Function to update map tiles dynamically
  const updateMapTiles = (style: MapTileStyle) => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    // Remove existing tile layer
    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch (e) {
        console.warn("Could not remove previous tile layer", e);
      }
    }

    // Add new tile layer
    const tileUrl = TILE_LAYERS[style] || TILE_LAYERS.dark;
    const attribution = style === "satellite" 
      ? '&copy; <a href="https://www.esri.com">Esri</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

    const subdomains = style === "satellite" ? [] : (style === "streets" ? ["a", "b", "c"] : ["a", "b", "c", "d"]);

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      subdomains,
      zIndex: 1
    }).addTo(map);

    if (newTileLayer.bringToBack) {
      newTileLayer.bringToBack();
    }
    
    tileLayerRef.current = newTileLayer;
  };

  // Sync with mapStyle prop when it changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMapTiles(mapStyle);
    }
  }, [mapStyle]);

  useEffect(() => {
    // 1. Double check if Leaflet L is loaded via CDN inside index.html
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    // 2. Initialize map if not yet created. Standard center covers active target.
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude || 5.5560, longitude || -0.1969],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Default style
      const subdomains = mapStyle === "satellite" ? [] : (mapStyle === "streets" ? ["a", "b", "c"] : ["a", "b", "c", "d"]);
      const initialTileLayer = L.tileLayer(TILE_LAYERS[mapStyle], {
        attribution: mapStyle === "satellite"
          ? '&copy; <a href="https://www.esri.com">Esri</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains,
        zIndex: 1
      }).addTo(map);
      
      if (initialTileLayer.bringToBack) {
        initialTileLayer.bringToBack();
      }
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

    // 4. Remove stale target markers and previous routing layers
    if (activePinRef.current) {
      map.removeLayer(activePinRef.current);
    }
    if (activeBufferCircleRef.current) {
      map.removeLayer(activeBufferCircleRef.current);
    }
    if (activeEscapeRouteLineRef.current) {
      map.removeLayer(activeEscapeRouteLineRef.current);
      activeEscapeRouteLineRef.current = null;
    }
    if (activeEscapeRouteHavenRef.current) {
      map.removeLayer(activeEscapeRouteHavenRef.current);
      activeEscapeRouteHavenRef.current = null;
    }
    if (activeEscapeRouteHazardsRef.current && activeEscapeRouteHazardsRef.current.length > 0) {
      activeEscapeRouteHazardsRef.current.forEach((layer) => map.removeLayer(layer));
      activeEscapeRouteHazardsRef.current = [];
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

    // 6. Draw escape route if present AND showSafeHavens is toggled ON
    if (showSafeHavens && activeEscapeRoute && activeEscapeRoute.profilePoints && activeEscapeRoute.profilePoints.length > 1) {
      const points = activeEscapeRoute.profilePoints.map((p: any) => [p.lat, p.lng]);
      const group = L.layerGroup().addTo(map);
      activeEscapeRouteLineRef.current = group;

      const profilePts = activeEscapeRoute.profilePoints;
      for (let i = 1; i < profilePts.length; i++) {
        const pt1 = profilePts[i - 1];
        const pt2 = profilePts[i];
        
        const inHazard = pt1.isHazardZone || pt2.isHazardZone;
        const color = inHazard ? "#ef4444" : "#10b981"; // Red for hazard, Emerald for secure
        const weight = inHazard ? 5 : 4.5;
        const dashArray = inHazard ? "3, 6" : "6, 6";

        L.polyline([[pt1.lat, pt1.lng], [pt2.lat, pt2.lng]], {
          color: color,
          weight: weight,
          dashArray: dashArray,
          opacity: 0.95,
        }).addTo(group);
      }

      // Add a clean sanctuary target icon
      const havenIconHtml = `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-7 w-7 rounded-full bg-emerald-500/30 opacity-75 animate-pulse"></span>
          <span class="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] shadow-lg">🏟️</span>
        </div>
      `;
      const havenIcon = L.divIcon({
        html: havenIconHtml,
        className: "custom-leaflet-haven-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      activeEscapeRouteHavenRef.current = L.marker([activeEscapeRoute.havenLat, activeEscapeRoute.havenLng], { icon: havenIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-slate-900 font-sans leading-tight">
            <strong class="font-bold text-slate-700 block text-xs">DESTINATION SANCTUARY</strong>
            <span class="text-xs font-semibold text-emerald-600 block mt-0.5">${activeEscapeRoute.havenName}</span>
            <div class="mt-1 text-[11px] text-slate-500">Distance: <b>${activeEscapeRoute.totalDistanceKm} km</b> • Est. Walk: <b>${activeEscapeRoute.estimatedWalkTimeMins} mins</b></div>
          </div>
        `);

      // Highlight hazards and warning spots along the escape path
      activeEscapeRoute.profilePoints.forEach((pt: any) => {
        if (pt.label && pt.label.includes("⚠️")) {
          const hazardIconHtml = `
            <div class="relative flex items-center justify-center">
              <span class="absolute inline-flex h-5 w-5 rounded-full bg-amber-500/30 opacity-75 animate-ping"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white flex items-center justify-center text-[9px] font-bold text-slate-950 shadow-md">⚠️</span>
            </div>
          `;
          const hazardIcon = L.divIcon({
            html: hazardIconHtml,
            className: "custom-leaflet-hazard-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          const marker = L.marker([pt.lat, pt.lng], { icon: hazardIcon })
            .addTo(map)
            .bindPopup(`
              <div class="text-slate-900 font-sans leading-tight">
                <strong class="font-bold text-amber-600 block">ROUTE LOW POINT</strong>
                <span class="text-xs text-slate-500 font-mono">${pt.elevation}m elevation</span>
                <div class="mt-1 text-xs text-slate-600">${pt.zoneName || "Low-elevation sector prone to pooling."}</div>
              </div>
            `);
          activeEscapeRouteHazardsRef.current.push(marker);
        }
      });
      
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Clear existing safe haven markers
    if (safeHavenMarkersRef.current && safeHavenMarkersRef.current.length > 0) {
      safeHavenMarkersRef.current.forEach((m) => map.removeLayer(m));
      safeHavenMarkersRef.current = [];
    }

    // 7. Render Safe Havens if toggled ON
    if (showSafeHavens && stats?.safeHavens && stats.safeHavens.length > 0) {
      stats.safeHavens.forEach((haven: any, idx: number) => {
        const havenHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <span class="absolute inline-flex h-6 w-6 rounded-full bg-emerald-400/30 opacity-75 animate-ping"></span>
            <span class="relative inline-flex rounded-full h-5 w-5 bg-emerald-600 border-2 border-white shadow-md text-white font-bold text-[9px] items-center justify-center">
              ${idx + 1}
            </span>
          </div>
        `;
        const havenIcon = L.divIcon({
          html: havenHtml,
          className: "custom-safe-haven-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const havenMarker = L.marker([haven.lat, haven.lng], { icon: havenIcon })
          .addTo(map)
          .bindPopup(`
            <div class="text-slate-900 font-sans leading-tight min-w-[160px]">
              <span class="text-[9px] font-bold font-mono uppercase text-emerald-600 block">🏥 SAFE HAVEN #${idx + 1}</span>
              <strong class="font-bold text-slate-900 block text-xs mt-0.5">${haven.name}</strong>
              <div class="text-[10px] text-slate-500 font-mono mt-0.5">${haven.district || ""} • ${haven.region || ""}</div>
              <div class="mt-1.5 pt-1.5 border-t border-slate-200 grid grid-cols-2 gap-1 text-[10px]">
                <div>Distance: <b>${haven.distanceKm} km</b></div>
                <div>Elevation: <b>${haven.elevation || "High"}m</b></div>
                <div>Capacity: <b>${(haven.capacity || 0).toLocaleString()}</b></div>
                <div>Type: <b>${haven.type}</b></div>
              </div>
              <div class="mt-1 text-[9.5px] text-slate-600 font-mono">📞 ${haven.contact}</div>
            </div>
          `);

        havenMarker.on("click", () => {
          if (onSelectSafeHaven) {
            onSelectSafeHaven(haven.id);
          }
        });

        safeHavenMarkersRef.current.push(havenMarker);
      });
    }

  }, [latitude, longitude, bufferRadiusMeters, stats, activeEscapeRoute, showSafeHavens]);

  const toggleLegend = () => {
    setLegendOpen(!legendOpen);
  };

  // Responsive map resizing
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px] border-0 rounded-none overflow-hidden bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" id="geospatial-visualizer-canvas" />
      
      {/* ===== BOTTOM RIGHT HAZARD LEGEND (Compact, crisp, z-[400] to prevent ghosting) ===== */}
      <div className="absolute bottom-3 right-3 z-[400] max-w-[calc(100%-1.5rem)]">
        <div className="bg-slate-950 border border-slate-700 rounded-lg shadow-xl w-[130px] sm:w-[145px] overflow-hidden transition-all duration-300">
          {/* Legend Header - Always Visible */}
          <div
            onClick={toggleLegend}
            className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-slate-900 transition-colors select-none"
          >
            <span className="text-slate-300 font-semibold uppercase tracking-wider text-[9px]">🗺️ Hazard Legend</span>
            <span className={`text-slate-400 text-xs transition-transform duration-300 ${legendOpen ? 'rotate-180' : 'rotate-0'}`}>
              ▼
            </span>
          </div>

          {/* Legend Items - Collapsible */}
          <div className={`transition-all duration-300 overflow-hidden ${legendOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2 py-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">Critical</span>
              </div>
              <div className="flex items-center gap-2 py-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f97316] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">High</span>
              </div>
              <div className="flex items-center gap-2 py-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#eab308] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">Medium</span>
              </div>
              <div className="flex items-center gap-2 py-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-white/20 flex-shrink-0" />
                <span className="text-slate-300 text-[9.5px]">Low</span>
              </div>
              <div className="mt-1.5 pt-1 border-t border-slate-800 text-[8px] text-slate-400 text-center font-mono">
                Click map to relocate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
