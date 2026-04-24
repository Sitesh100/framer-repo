'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, ArrowLeftRight, Search, ChevronDown, ChevronUp,
  Wifi, Zap, Coffee, Tv, Wind, Star, Clock, CheckCircle2,
  ArrowLeft, ShieldCheck, Bus,
  SlidersHorizontal, ChevronRight,
} from 'lucide-react';
import Header from '@/components/shared/Header'; 
import BusDetailsModal from '@/components/search/BusDetailsModal';

// ── Types ─────────────────────────────────────────────────────
interface BusResult {
  id: number;
  operator: string;
  busType: string;
  layout: string;
  rating: number;
  reviews: number;
  departure: string;
  arrival: string;
  duration: string;
  marketPrice: number;
  ourPrice: number;
  availableSeats: number;
  singleSeats: number;
  amenities: string[];
  liveTracking: boolean;
  freeCancellation: boolean;
  isSleeper: boolean;
  isAC: boolean;
  boardingPoints: string[];
  droppingPoints: string[];
}

const busResults: BusResult[] = [
  {
    id: 1, operator: 'NueGo', busType: 'Electric A/C Seater', layout: '2+2',
    rating: 4.4, reviews: 230,
    departure: '05:30', arrival: '10:55', duration: '5h 25m',
    marketPrice: 850, ourPrice: 363,
    availableSeats: 7, singleSeats: 4,
    amenities: ['AC', 'WiFi', 'Charging', 'LiveTracking'],
    liveTracking: true, freeCancellation: true, isSleeper: false, isAC: true,
    boardingPoints: ['Jaipur Bus Stand', 'Sitapura', 'Tonk Road'],
    droppingPoints: ['Gurugram Sector 14', 'IFFCO Chowk', 'MG Road'],
  },
  {
    id: 2, operator: 'Zingbus Plus', busType: 'A/C Seater / Sleeper', layout: '2+1',
    rating: 4.5, reviews: 113,
    departure: '19:45', arrival: '01:40', duration: '5h 55m',
    marketPrice: 720, ourPrice: 409,
    availableSeats: 5, singleSeats: 2,
    amenities: ['AC', 'Charging', 'LiveTracking'],
    liveTracking: true, freeCancellation: false, isSleeper: true, isAC: true,
    boardingPoints: ['Jaipur Bus Stand', 'Durgapura'],
    droppingPoints: ['Gurugram Sector 29', 'Sohna Road'],
  },
  {
    id: 3, operator: 'Maharani Travels', busType: 'A/C Sleeper', layout: '2+1',
    rating: 4.3, reviews: 231,
    departure: '05:30', arrival: '09:10', duration: '3h 40m',
    marketPrice: 550, ourPrice: 289,
    availableSeats: 6, singleSeats: 7,
    amenities: ['AC', 'WiFi', 'LiveTracking'],
    liveTracking: true, freeCancellation: false, isSleeper: true, isAC: true,
    boardingPoints: ['Jaipur Central', 'Sindhi Camp'],
    droppingPoints: ['Gurugram Bus Stand', 'Sector 56'],
  },
  {
    id: 4, operator: 'RSRTC Express', busType: 'Non-AC Seater', layout: '2+3',
    rating: 3.1, reviews: 88,
    departure: '04:05', arrival: '08:55', duration: '4h 50m',
    marketPrice: 380, ourPrice: 229,
    availableSeats: 12, singleSeats: 3,
    amenities: [],
    liveTracking: false, freeCancellation: false, isSleeper: false, isAC: false,
    boardingPoints: ['Sindhi Camp Bus Stand'],
    droppingPoints: ['Gurugram Bus Stand'],
  },
  {
    id: 5, operator: 'Volvo Express', busType: 'Volvo A/C Multi-Axle Sleeper', layout: '2+2',
    rating: 4.6, reviews: 412,
    departure: '22:00', arrival: '04:15', duration: '6h 15m',
    marketPrice: 1400, ourPrice: 599,
    availableSeats: 3, singleSeats: 0,
    amenities: ['AC', 'WiFi', 'Charging', 'Meals', 'Entertainment'],
    liveTracking: true, freeCancellation: true, isSleeper: true, isAC: true,
    boardingPoints: ['Jaipur Central', 'Sindhi Camp', 'Tonk Road'],
    droppingPoints: ['Gurugram Sector 14', 'IFFCO Chowk', 'Cyber City'],
  },
  {
    id: 6, operator: 'Laxmi Holidays', busType: 'A/C Sleeper', layout: '2+1',
    rating: 4.2, reviews: 67,
    departure: '23:30', arrival: '05:30', duration: '6h 00m',
    marketPrice: 980, ourPrice: 503,
    availableSeats: 1, singleSeats: 0,
    amenities: ['AC', 'Charging'],
    liveTracking: false, freeCancellation: false, isSleeper: true, isAC: true,
    boardingPoints: ['Jaipur Bus Stand'],
    droppingPoints: ['Gurugram Sector 14'],
  },
];

const CITIES = [
  'Agartala (Tripura)', 'Agra (Uttar Pradesh)', 'Ahmedabad (Gujarat)', 'Aizawl (Mizoram)', 
  'Amritsar (Punjab)', 'Aurangabad (Maharashtra)', 'Ayodhya (Uttar Pradesh)', 'Bagdogra (West Bengal)', 
  'Bareilly (Uttar Pradesh)', 'Bathinda (Punjab)', 'Belagavi (Karnataka)', 'Bengaluru (Karnataka)', 
  'Bhopal (Madhya Pradesh)', 'Bhubaneswar (Odisha)', 'Bhuj (Gujarat)', 'Bidar (Karnataka)', 
  'Bikaner (Rajasthan)', 'Bilaspur (Chhattisgarh)', 'Chandigarh (Chandigarh)', 'Chennai (Tamil Nadu)', 
  'Coimbatore (Tamil Nadu)', 'Darbhanga (Bihar)', 'Dehradun (Uttarakhand)', 'Delhi (Delhi)', 
  'Deoghar (Jharkhand)', 'Dharamshala (Himachal Pradesh)', 'Dibrugarh (Assam)', 'Dimapur (Nagaland)', 
  'Durgapur (West Bengal)', 'Gaya (Bihar)', 'Goa (Goa)', 'Gorakhpur (Uttar Pradesh)', 
  'Guwahati (Assam)', 'Gwalior (Madhya Pradesh)', 'Hubballi (Karnataka)', 'Hyderabad (Telangana)', 
  'Imphal (Manipur)', 'Indore (Madhya Pradesh)', 'Itanagar (Arunachal Pradesh)', 'Jabalpur (Madhya Pradesh)', 
  'Jagdalpur (Chhattisgarh)', 'Jaipur (Rajasthan)', 'Jaisalmer (Rajasthan)', 'Jalgaon (Maharashtra)', 
  'Jammu (Jammu & Kashmir)', 'Jamnagar (Gujarat)', 'Jamshedpur (Jharkhand)', 'Jharsuguda (Odisha)', 
  'Jodhpur (Rajasthan)', 'Jorhat (Assam)', 'Kadapa (Andhra Pradesh)', 'Kalaburagi (Karnataka)', 
  'Kannur (Kerala)', 'Kanpur (Uttar Pradesh)', 'Khajuraho (Madhya Pradesh)', 'Kishangarh (Rajasthan)', 
  'Kochi (Kerala)', 'Kolhapur (Maharashtra)', 'Kolkata (West Bengal)', 'Kozhikode (Kerala)', 
  'Kullu (Himachal Pradesh)', 'Kurnool (Andhra Pradesh)', 'Kushinagar (Uttar Pradesh)', 'Leh (Ladakh)', 
  'Lucknow (Uttar Pradesh)', 'Ludhiana (Punjab)', 'Madurai (Tamil Nadu)', 'Mangaluru (Karnataka)', 
  'Mumbai (Maharashtra)', 'Mysuru (Karnataka)', 'Nagpur (Maharashtra)', 'Nanded (Maharashtra)', 
  'Nashik (Maharashtra)', 'Pakyong (Sikkim)', 'Pantnagar (Uttarakhand)', 'Pasighat (Arunachal Pradesh)', 
  'Patna (Bihar)', 'Pithoragarh (Uttarakhand)', 'Porbandar (Gujarat)', 'Port Blair (Andaman & Nicobar)', 
  'Prayagraj (Uttar Pradesh)', 'Puducherry (Puducherry)', 'Pune (Maharashtra)', 'Raipur (Chhattisgarh)', 
  'Rajahmundry (Andhra Pradesh)', 'Rajkot (Gujarat)', 'Ranchi (Jharkhand)', 'Rourkela (Odisha)', 
  'Salem (Tamil Nadu)', 'Shillong (Meghalaya)', 'Shimla (Himachal Pradesh)', 'Shirdi (Maharashtra)', 
  'Shivamogga (Karnataka)', 'Silchar (Assam)', 'Srinagar (Jammu & Kashmir)', 'Surat (Gujarat)', 
  'Tezpur (Assam)', 'Thiruvananthapuram (Kerala)', 'Thoothukudi (Tamil Nadu)', 'Tiruchirappalli (Tamil Nadu)', 
  'Tirupati (Andhra Pradesh)', 'Udaipur (Rajasthan)', 'Vadodara (Gujarat)', 'Varanasi (Uttar Pradesh)', 
  'Vijayawada (Andhra Pradesh)', 'Visakhapatnam (Andhra Pradesh)'
];

// ── City Autocomplete (Full Width & No Truncation) ────────────
function CityInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (v: string) => {
    onChange(v);
    const f = CITIES.filter(c => c.toLowerCase().includes(v.toLowerCase())).slice(0, 5);
    setSuggestions(f);
    setOpen(f.length > 0 && v.length > 0);
  };

  const handleSelect = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  const stateName = value.includes('(') ? value.split('(')[1]?.replace(')', '') : '';

  return (
    <div ref={ref} className="relative flex-1 min-w-0 w-full">
      <div className="flex flex-col px-4 py-2.5 h-full justify-center">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">{label}</span>
        <input
          type="text" value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Select city" autoComplete="off"
          className="bg-transparent outline-none text-[15px] font-bold text-slate-900 placeholder:text-gray-300 w-full leading-tight"
        />
        {stateName && <span className="text-[11px] text-gray-400 leading-tight block whitespace-nowrap overflow-visible">{stateName}</span>}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.12 }}
            className="absolute top-full left-0 w-max min-w-[280px] bg-white border border-blue-100 rounded-2xl shadow-2xl z-[200] overflow-hidden mt-2"
          >
            {suggestions.map((city, i) => {
              const [cn, st] = city.split(' (');
              return (
                <button
                  key={i}
                  onMouseDown={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{cn}</span>
                    {st && <span className="text-[11px] font-medium text-gray-500">({st}</span>}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Amenity pill ──────────────────────────────────────────────
function Amenity({ type }: { type: string }) {
  const map: Record<string, { icon: React.ReactNode; label: string }> = {
    AC: { icon: <Wind className="w-3 h-3" />, label: 'AC' },
    WiFi: { icon: <Wifi className="w-3 h-3" />, label: 'WiFi' },
    Charging: { icon: <Zap className="w-3 h-3" />, label: 'Charging' },
    Meals: { icon: <Coffee className="w-3 h-3" />, label: 'Meals' },
    Entertainment: { icon: <Tv className="w-3 h-3" />, label: 'TV' },
    LiveTracking: { icon: <MapPin className="w-3 h-3" />, label: 'Live Track' },
  };
  const item = map[type];
  if (!item) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
      {item.icon} {item.label}
    </span>
  );
}

// ── Bus Card ──────────────────────────────────────────────────
function BusCard({ bus, onBook }: { bus: BusResult; onBook: (b: BusResult) => void }) {
  const [expanded, setExpanded] = useState(false);
  const urgency = bus.availableSeats <= 3;

  return (
    <motion.div layout className="bg-white rounded-2xl border border-blue-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200">
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">{bus.operator}</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">{bus.busType} · {bus.layout}</p>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white text-xs font-bold flex-shrink-0 ml-3
                ${bus.rating >= 4.3 ? 'bg-blue-500' : bus.rating >= 3.5 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                <Star className="w-3 h-3 fill-white" /> {bus.rating}
                <span className="font-normal opacity-70 text-[10px]">({bus.reviews})</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 leading-none">{bus.departure}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Departs</div>
              </div>
              <div className="flex-1 flex items-center gap-1.5">
                <div className="h-px flex-1 bg-blue-200" />
                <div className="flex flex-col items-center">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] text-blue-400 whitespace-nowrap mt-0.5">{bus.duration}</span>
                </div>
                <div className="h-px flex-1 bg-blue-200" />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 leading-none">{bus.arrival}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Arrives</div>
              </div>
            </div>

            {/* Amenities */}
            {bus.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {bus.amenities.map(a => <Amenity key={a} type={a} />)}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {bus.freeCancellation && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-2.5 h-2.5" /> Free Cancellation
                </span>
              )}
              {bus.liveTracking && (
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  <MapPin className="w-2.5 h-2.5" /> Live Tracking
                </span>
              )}
              {bus.isSleeper && (
                <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">Sleeper</span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px self-stretch bg-blue-100" />

          {/* Right: price + CTA */}
          <div className="md:w-44 flex flex-row md:flex-col items-center md:items-end justify-center md:justify-between gap-3 pt-2">
            
            {/* Price */}
            <div className="text-right w-full md:w-auto">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-[12px] text-gray-400 line-through">₹{bus.marketPrice}</span>
                <span className="text-[10px] text-gray-400">elsewhere</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 leading-none">₹{bus.ourPrice}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">on Onlyy</div>
            </div>

            {/* Seat urgency */}
            <div className={`text-[11px] font-semibold text-right ${urgency ? 'text-rose-500' : 'text-gray-400'} hidden md:block`}>
              {urgency ? `⚡ Only ${bus.availableSeats} left!` : `${bus.availableSeats} seats`}
              {bus.singleSeats > 0 && <span className="text-blue-400 block">{bus.singleSeats} single</span>}
            </div>

            {/* CTA */}
            <button
              onClick={() => onBook(bus)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm whitespace-nowrap flex items-center gap-1.5 justify-center"
            >
              Select Seats <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <div className="border-t border-blue-50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-2.5 text-[12px] text-blue-500 hover:text-blue-700 font-semibold transition-colors hover:bg-blue-50"
        >
          <span className="flex gap-5">
            <span>Boarding & Dropping</span>
            <span>Reviews</span>
            <span>Cancellation</span>
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-blue-50"
          >
            <div className="p-5 grid md:grid-cols-2 gap-5 bg-blue-50/40">
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Boarding Points</p>
                <ul className="space-y-1.5">
                  {bus.boardingPoints.map(p => (
                    <li key={p} className="flex items-center gap-2 text-[12px] text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Dropping Points</p>
                <ul className="space-y-1.5">
                  {bus.droppingPoints.map(p => (
                    <li key={p} className="flex items-center gap-2 text-[12px] text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Seat Modal ────────────────────────────────────────────────
function SeatModal({
  bus,
  onClose,
  fromCity,
  toCity,
  travelDate,
}: {
  bus: BusResult;
  onClose: () => void;
  fromCity: string;
  toCity: string;
  travelDate: string;
}) {
  const discount = Math.max(0, Math.round(((bus.marketPrice - bus.ourPrice) / bus.marketPrice) * 100));

  return (
    <BusDetailsModal
      onClose={onClose}
      bus={{
        id: bus.id,
        name: bus.operator,
        rating: bus.rating,
        reviews: bus.reviews,
        departure: bus.departure,
        arrival: bus.arrival,
        duration: bus.duration,
        originalPrice: bus.marketPrice,
        discountedPrice: bus.ourPrice,
        discount,
        seats: bus.availableSeats,
        amenities: bus.amenities,
        bookingDate: travelDate,
        saleWindow: 'Limited offer',
        fromCity,
        toCity,
        boardingPoints: bus.boardingPoints,
        droppingPoints: bus.droppingPoints,
      }}
    />
  );
}

// ── Filter Sidebar ────────────────────────────────────────────
interface Filters {
  ac: boolean; sleeper: boolean; freeCancellation: boolean;
  liveTracking: boolean; singleSeats: boolean;
  morning: boolean; evening: boolean; night: boolean;
  minRating: number;
}

function FilterPanel({ filters, set }: { filters: Filters; set: (k: keyof Filters, v: boolean | number) => void }) {
  const Check = ({ label, k, count }: { label: string; k: keyof Filters; count?: number }) => (
    <label className="flex items-center justify-between py-2 cursor-pointer group select-none" onClick={() => set(k, !filters[k])}>
      <div className="flex items-center gap-2.5">
        <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
          ${filters[k] ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
          {filters[k] && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <span className="text-[13px] text-slate-700">{label}</span>
      </div>
      {count !== undefined && <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>}
    </label>
  );

  return (
    <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-blue-100 flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-blue-500" />
        <h2 className="font-bold text-slate-900 text-sm">Filters</h2>
      </div>
      <div className="p-4 divide-y divide-gray-100">
        <div className="pb-3">
          <Check label="AC" k="ac" count={5} />
          <Check label="Sleeper" k="sleeper" count={4} />
          <Check label="Free Cancellation" k="freeCancellation" count={2} />
          <Check label="Live Tracking" k="liveTracking" count={4} />
          <Check label="Single Seats" k="singleSeats" count={4} />
        </div>
        <div className="py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Departure time</p>
          <Check label="Morning (6am–12pm)" k="morning" />
          <Check label="Evening (6pm–midnight)" k="evening" />
          <Check label="Night (12am–6am)" k="night" />
        </div>
        <div className="pt-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Min rating</p>
          <div className="flex gap-1.5">
            {[3, 3.5, 4, 4.5].map(r => (
              <button key={r} onClick={() => set('minRating', filters.minRating === r ? 0 : r)}
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-colors
                  ${filters.minRating === r ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}>
                {r}+
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Search Results Page Content ───────────────────────────────
function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlFrom = searchParams.get('from');
  const urlTo = searchParams.get('to');
  const urlDate = searchParams.get('date');

  const [fromCity, setFromCity] = useState(urlFrom || 'Jaipur (Rajasthan)');
  const [toCity, setToCity] = useState(urlTo || 'Gurugram (Gurgaon)');
  const [date, setDate] = useState(urlDate || new Date().toISOString().split('T')[0]);
  
  const [selectedBus, setSelectedBus] = useState<BusResult | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'departure'>('price');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    ac: false, sleeper: false, freeCancellation: false,
    liveTracking: false, singleSeats: false,
    morning: false, evening: false, night: false,
    minRating: 0,
  });

  const setFilter = (k: keyof Filters, v: boolean | number) => setFilters(prev => ({ ...prev, [k]: v }));

  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getTomorrowDate = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; };
  const isToday = date === getTodayDate();
  const isTomorrow = date === getTomorrowDate();

  const filtered = busResults
    .filter(b => {
      if (filters.ac && !b.isAC) return false;
      if (filters.sleeper && !b.isSleeper) return false;
      if (filters.freeCancellation && !b.freeCancellation) return false;
      if (filters.liveTracking && !b.liveTracking) return false;
      if (filters.singleSeats && b.singleSeats === 0) return false;
      if (filters.minRating > 0 && b.rating < filters.minRating) return false;
      const h = parseInt(b.departure.split(':')[0]);
      if (filters.morning && !(h >= 6 && h < 12)) return false;
      if (filters.evening && !(h >= 18 && h < 24)) return false;
      if (filters.night && !(h >= 0 && h < 6)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.ourPrice - b.ourPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.departure.localeCompare(b.departure);
    });

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const fromName = fromCity.split(' (')[0];
  const toName = toCity.split(' (')[0];

  return (
    <>
      {!selectedBus && <Header />}

      {/* ── Sticky search bar ── 
          Removed white patch background.
          z-[1000] and top-4 perfectly overrides Navbar when scrolling down!
          mt-[90px] gives it initial margin below header.
      */}
      {!selectedBus && (
        <div className="sticky top-4 z-[1000] mt-[110px] mb-6 mt-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-stretch h-[60px] bg-white border border-blue-200 rounded-2xl shadow-xl shadow-blue-500/10">
              {/* From */}
              <div className="flex items-center flex-1 min-w-0 border-r border-blue-100">
                <Bus className="w-4 h-4 text-blue-300 ml-4 flex-shrink-0" />
                <CityInput label="From" value={fromCity} onChange={setFromCity} />
              </div>
              {/* Swap */}
              <button
                onClick={() => { const t = fromCity; setFromCity(toCity); setToCity(t); }}
                className="w-10 bg-blue-600 hover:bg-blue-700 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4 text-white" />
              </button>
              {/* To */}
              <div className="flex items-center flex-1 min-w-0 border-x border-blue-100">
                <MapPin className="w-4 h-4 text-blue-300 ml-4 flex-shrink-0" />
                <CityInput label="To" value={toCity} onChange={setToCity} />
              </div>
              {/* Date */}
              <div className="flex items-center gap-2 px-4 border-r border-blue-100 flex-shrink-0">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Date</p>
                  <div className="flex items-center gap-1.5">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="text-[13px] font-bold text-slate-900 bg-transparent outline-none" />
                    {isToday && <span className="text-[10px] text-gray-400">(Today)</span>}
                  </div>
                </div>
              </div>
              {/* Today/Tomorrow */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 border-r border-blue-100">
                <button onClick={() => setDate(getTodayDate())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isToday ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Today
                </button>
                <button onClick={() => setDate(getTomorrowDate())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isTomorrow ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Tomorrow
                </button>
              </div>
              {/* Search */}
              <button
                onClick={() => router.push(`/search?type=bus&from=${fromCity}&to=${toCity}&date=${date}`)}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 flex items-center justify-center gap-2 flex-shrink-0 transition-colors font-bold text-sm rounded-r-xl shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page body ─────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-blue-50/40 to-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* Route header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.push('/')}
              className="p-2 bg-white border border-blue-100 hover:border-blue-300 rounded-xl transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {fromName} <ChevronRight className="w-5 h-5 text-blue-400" /> {toName}
              </h1>
              <p className="text-sm text-gray-400">{filtered.length} buses · {displayDate}</p>
            </div>
          </div>

          <div className="flex gap-5">
            {/* Sidebar */}
            <div className="hidden md:block w-52 flex-shrink-0">
              <FilterPanel filters={filters} set={setFilter} />
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 bg-white border border-blue-100 rounded-xl p-1 shadow-sm overflow-x-auto">
                  {([
                    { key: 'price', label: 'Price' },
                    { key: 'rating', label: 'Rating' },
                    { key: 'departure', label: 'Departure' },
                  ] as const).map(s => (
                    <button key={s.key} onClick={() => setSortBy(s.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
                        ${sortBy === s.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-slate-900'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
                {/* Mobile filter toggle */}
                <button onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>

              {/* Mobile filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden md:hidden mb-4"
                  >
                    <FilterPanel filters={filters} set={setFilter} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bus list */}
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-blue-100">
                  <Bus className="w-12 h-12 mx-auto text-blue-200 mb-3" />
                  <p className="font-bold text-slate-700">No buses match your filters</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting the filters on the left</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((bus, idx) => (
                    <motion.div key={bus.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                      <BusCard bus={bus} onBook={setSelectedBus} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seat modal */}
      <AnimatePresence>
        {selectedBus && (
          <SeatModal
            bus={selectedBus}
            onClose={() => setSelectedBus(null)}
            fromCity={fromCity}
            toCity={toCity}
            travelDate={date}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Ensure the page doesn't break during build due to useSearchParams
export default function SearchResults() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">Loading results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
