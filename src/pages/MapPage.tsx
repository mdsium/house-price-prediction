import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Tooltip, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_THANA_MAP, SAMPLE_HOUSE_DATA, THANA_CENTERS } from '../services/constants';
import { cn } from '../lib/utils';
import { 
  Building2, 
  ChevronRight, 
  GraduationCap, 
  Hospital, 
  Info, 
  Map as MapIcon, 
  Search, 
  ShoppingCart, 
  Store, 
  X,
  Filter,
  Layers,
  MapPin,
  Menu,
  BarChart3
} from 'lucide-react';

// Custom Icons using Lucide and DivIcon
const createCustomIcon = (color: string, IconSVG: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; padding: 8px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        ${IconSVG}
      </svg>
    </div>`,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const Icons = {
  property: createCustomIcon('#4338ca', '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>'),
  school: createCustomIcon('#8b5cf6', '<path d="M22 10v6M2 10l10-5 10 5-10 5L2 10z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>'),
  hospital: createCustomIcon('#ef4444', '<path d="M19 14c1.49 0 2.87.47 4 1.26V8c0-1.1-.9-2-2-2h-4V3c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h4.5M16 11V7l-2-2h-4l-2 2v4M12 13v8M9 17h6"></path>'),
  market: createCustomIcon('#f59e0b', '<path d="M3 3h18v18H3zM12 8v8M8 12h8"></path><path d="M3 9h18M3 15h18"></path>')
};

// Fetch Thana Boundary (Nominatim API)
const fetchThanaBoundary = async (thana: string, city: string, signal?: AbortSignal) => {
  const cleanThana = thana.split('-')[0].trim(); // Normalize names like Gulshan-1 to Gulshan 
  const queries = [
    `${cleanThana}, ${city}, Bangladesh`,
    `${cleanThana}, Bangladesh`
  ];

  for (const query of queries) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&polygon_geojson=1&format=json`;
    try {
      const response = await fetch(url, { 
        signal, 
        headers: { 
          'Accept-Language': 'en',
          'User-Agent': 'HouseValuator-App'
        } 
      });
      const data = await response.json();
      if (data && data.length > 0) {
        const boundaryResult = data.find((item: any) => item.geojson && (item.geojson.type === 'Polygon' || item.geojson.type === 'MultiPolygon'));
        if (boundaryResult) {
          return boundaryResult.geojson;
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return null;
      console.error(`Failed to fetch boundary for query "${query}":`, error);
    }
  }
  return null;
};

// Real-world POI Data Fetcher (Overpass API)
const fetchNearbyPOIs = async (lat: number, lng: number, types: { school: boolean, hospital: boolean, market: boolean }, signal?: AbortSignal) => {
  const categories = [];
  if (types.school) categories.push(`node["amenity"~"school|university"](around:2000,${lat},${lng});`);
  if (types.hospital) categories.push(`node["amenity"~"hospital|clinic"](around:2000,${lat},${lng});`);
  if (types.market) categories.push(`node["shop"~"supermarket|mall|clothes"](around:2000,${lat},${lng});`);

  if (categories.length === 0) return [];

  const query = `[out:json][timeout:10];(${categories.join('')});out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, { signal });
    const data = await response.json();
    return data.elements.map((el: any) => ({
      id: el.id.toString(),
      type: el.tags.amenity === 'school' || el.tags.amenity === 'university' ? 'school' : 
            el.tags.amenity === 'hospital' || el.tags.amenity === 'clinic' ? 'hospital' : 'market',
      name: el.tags.name || "Unnamed Facility",
      lat: el.lat,
      lng: el.lon,
      details: el.tags.description || `${el.tags.amenity || el.tags.shop || 'Commercial'} infrastructure.`
    }));
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error("Failed to fetch POIs:", error);
    }
    return [];
  }
};

const cityCenters: Record<string, { lat: number, lng: number }> = {
  'Dhaka': { lat: 23.7771, lng: 90.4130 },
  'Chattogram': { lat: 22.3275, lng: 91.8123 },
  'Rajshahi': { lat: 24.3685, lng: 88.6111 },
  'Sylhet': { lat: 24.8949, lng: 91.8687 }
};

// View controller to smooth pan the map
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  const [selectedThana, setSelectedThana] = useState('Gulshan-1');
  const [thanaSearchQuery, setThanaSearchQuery] = useState('');
  const [showSchools, setShowSchools] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [showMarkets, setShowMarkets] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.7771, 90.4130]);
  const [zoom, setZoom] = useState(13);
  const [pois, setPois] = useState<any[]>([]);
  const [isLoadingPois, setIsLoadingPois] = useState(false);
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState<any>(null);
  const [isBoundaryLoading, setIsBoundaryLoading] = useState(false);

  // Filter properties based on city and thana
  const filteredHouses = SAMPLE_HOUSE_DATA.filter(h => h.city === selectedCity && h.thana === selectedThana);
  
  // Center map based on selected thana or city center
  useEffect(() => {
    if (THANA_CENTERS[selectedThana]) {
      setMapCenter([THANA_CENTERS[selectedThana].lat, THANA_CENTERS[selectedThana].lng]);
      setZoom(14);
    } else if (filteredHouses.length > 0 && filteredHouses[0].lat && filteredHouses[0].lng) {
      setMapCenter([filteredHouses[0].lat, filteredHouses[0].lng]);
      setZoom(14);
    } else {
      const center = cityCenters[selectedCity] || cityCenters['Dhaka'];
      setMapCenter([center.lat, center.lng]);
      setZoom(13);
    }
  }, [selectedCity, selectedThana]);

  // Fetch POIs dynamically with debouncing and abortion
  useEffect(() => {
    const controller = new AbortController();
    
    const updatePOIs = async () => {
      if (!showSchools && !showHospitals && !showMarkets) {
        setPois([]);
        return;
      }

      setIsLoadingPois(true);
      const fetched = await fetchNearbyPOIs(mapCenter[0], mapCenter[1], {
        school: showSchools,
        hospital: showHospitals,
        market: showMarkets
      }, controller.signal);
      
      if (!controller.signal.aborted) {
        setPois(fetched);
        setIsLoadingPois(false);
      }
    };

    const timeoutId = setTimeout(updatePOIs, 600); // Debounce
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [mapCenter, showSchools, showHospitals, showMarkets]);

  // Fetch Boundary
  useEffect(() => {
    const controller = new AbortController();
    
    const updateBoundary = async () => {
      setBoundaryGeoJSON(null); 
      setIsBoundaryLoading(true);
      const geojson = await fetchThanaBoundary(selectedThana, selectedCity, controller.signal);
      if (!controller.signal.aborted) {
        setBoundaryGeoJSON(geojson);
        setIsBoundaryLoading(false);
      }
    };

    updateBoundary();

    return () => {
      controller.abort();
    };
  }, [selectedCity, selectedThana]);

  const categories = [
    { id: 'schools', label: 'Schools & Uni', icon: GraduationCap, active: showSchools, setter: setShowSchools, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'hospitals', label: 'Hospitals', icon: Hospital, active: showHospitals, setter: setShowHospitals, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'markets', label: 'Markets', icon: Store, active: showMarkets, setter: setShowMarkets, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-64px)] flex flex-row overflow-hidden bg-slate-50 relative"
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1010] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: typeof window !== 'undefined' && window.innerWidth < 1024 
            ? (isSidebarOpen ? 0 : -400) 
            : 0 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 w-[85vw] sm:w-96 bg-white border-r border-slate-200 overflow-y-auto z-[1020] lg:z-[1002] flex flex-col shadow-2xl lg:shadow-none lg:translate-x-0",
          !isSidebarOpen && "pointer-events-none lg:pointer-events-auto"
        )}
      >
        {/* Header Section */}
        <div className="p-6 lg:p-8 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                <MapIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter leading-none">Market Map</h1>
                <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-[0.2em] mt-1">v4.2 Intelligence</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 font-mono">
                <Search className="w-3 h-3" />
                Primary Market
              </label>
              <div className="relative group">
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedThana(CITY_THANA_MAP[e.target.value][0]);
                  }}
                  className="w-full pl-5 pr-10 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 appearance-none text-sm cursor-pointer shadow-sm group-hover:border-slate-300"
                >
                  {Object.keys(CITY_THANA_MAP).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  Sub-Market Sector
                </div>
                {thanaSearchQuery && (
                  <button 
                    onClick={() => setThanaSearchQuery('')}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors lowercase tracking-normal font-bold"
                  >
                    clear
                  </button>
                )}
              </label>

              <div className="relative group/search">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Seach Thanas..."
                  value={thanaSearchQuery}
                  onChange={(e) => setThanaSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-[1.2rem] border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 text-sm shadow-sm placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>

              <div className="flex flex-wrap gap-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar py-1">
                {CITY_THANA_MAP[selectedCity]
                  .filter(thana => thana.toLowerCase().includes(thanaSearchQuery.toLowerCase()))
                  .map(thana => (
                  <button
                    key={thana}
                    type="button"
                    onClick={() => setSelectedThana(thana)}
                    className={cn(
                      "relative px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 border overflow-hidden",
                      selectedThana === thana
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.5)] translate-y-[-2px] ring-2 ring-indigo-600/20 ring-offset-1"
                        : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 shadow-sm"
                    )}
                  >
                    {selectedThana === thana && (
                      <span className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {selectedThana === thana && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />}
                      {thana}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-12 pb-24">
          {/* Layers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Infrastructural Layers</label>
              <div className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase">Active: {categories.filter(c => c.active).length}</div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => cat.setter(!cat.active)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group cursor-pointer relative z-40",
                    cat.active 
                      ? `${cat.bg} border-indigo-200 shadow-md -translate-y-0.5` 
                      : "bg-white border-slate-100 opacity-70 hover:opacity-100 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-4 pointer-events-none">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all", 
                      cat.active ? `${cat.bg} ${cat.color} border border-white shadow-sm scale-110` : "bg-slate-50 text-slate-400"
                    )}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className={cn("text-xs font-black uppercase tracking-tight block", cat.active ? "text-indigo-900" : "text-slate-500")}>
                        {cat.label}
                      </span>
                      {cat.active && (
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5 block">
                          POI Visible
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-all pointer-events-none",
                    cat.active ? "bg-indigo-600 shadow-inner" : "border-2 border-slate-100 group-hover:border-slate-200"
                  )}>
                    {cat.active && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Spatial Intelligence Card */}
          <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group mt-auto">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 scale-150">
               <Layers className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 font-mono">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  Model Confidence
                </h4>
                <div className="px-2 py-0.5 bg-indigo-500/20 rounded text-[9px] font-black text-indigo-300 tracking-widest uppercase">98.5%</div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Our spatial engine analyzes real-time proximity to commercial hubs, educational zones, and emergency facilities to derive high-fidelity pricing logic.
              </p>
              <div className="pt-2">
                <button 
                  type="button" 
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Export Intelligence
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Map Area */}
      <main className="flex-1 relative z-10 bg-slate-200">
        <MapContainer 
          center={mapCenter} 
          zoom={zoom} 
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          <ChangeView center={mapCenter} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Thana Boundary Overlay */}
          {boundaryGeoJSON && (
            <GeoJSON 
              key={`${selectedCity}-${selectedThana}`}
              data={boundaryGeoJSON}
              pathOptions={{
                color: '#6366f1',
                weight: 4,
                opacity: 0.8,
                fillColor: '#4f46e5',
                fillOpacity: 0.15,
                dashArray: '8, 12',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          )}

          {/* Property Markers */}
          {filteredHouses.map((house, idx) => (
            <Marker 
              key={`house-${idx}`} 
              position={[house.lat!, house.lng!]}
              icon={Icons.property}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">{house.thana}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{house.city}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Value</span>
                      <span className="text-lg font-black text-indigo-600 tracking-tighter">৳{(house.price / 10000000).toFixed(2)}Cr</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{house.area_sqft} SQFT</span>
                      <span>৳{(house.price / house.area_sqft).toFixed(0)} / FT</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* POI Markers */}
          {pois.map((poi) => (
            <Marker 
              key={poi.id} 
              position={[poi.lat, poi.lng]}
              icon={poi.type === 'school' ? Icons.school : poi.type === 'hospital' ? Icons.hospital : Icons.market}
            >
              <Tooltip permanent direction="top" offset={[0, -20]} className="custom-tooltip">
                <span className="font-black text-[10px] uppercase tracking-tighter text-slate-900">{poi.name}</span>
              </Tooltip>
              <Popup>
                <div className="p-1">
                  <div className="flex items-center gap-2 mb-2">
                    {poi.type === 'school' ? <GraduationCap className="w-4 h-4 text-violet-600" /> : poi.type === 'hospital' ? <Hospital className="w-4 h-4 text-red-600" /> : <Store className="w-4 h-4 text-amber-600" />}
                    <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{poi.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{poi.details}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Controls */}
        <div className="absolute top-4 lg:top-8 left-4 lg:left-8 z-[1001] flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
          >
            <Menu className="w-4 h-4" />
            Filters
          </button>
          <div className="bg-white/90 backdrop-blur-xl px-4 lg:px-6 py-3 lg:py-4 rounded-[1.2rem] lg:rounded-[1.5rem] border border-slate-200/50 shadow-2xl flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isLoadingPois ? "bg-amber-500" : "bg-green-500"
              )} />
              <span className="text-[9px] lg:text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                {isLoadingPois || isBoundaryLoading ? "Syncing..." : "Live Feed"}
              </span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="text-[9px] lg:text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
               <span className="hidden sm:inline">{filteredHouses.length} Assets in {selectedThana}</span>
               <span className="sm:hidden">{filteredHouses.length} Assets</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .leaflet-container {
          background-color: #f1f5f9;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 24px;
          padding: 8px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .leaflet-div-icon {
          background: transparent;
          border: none;
        }
        .custom-tooltip {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        }
        .custom-tooltip:before {
          border-top-color: white !important;
        }
      `}</style>
    </motion.div>
  );
}
