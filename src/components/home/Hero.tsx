'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import {
  Plane,
  Building2,
  Bus,
  Search,
  Calendar,
  ArrowLeftRight,
  Users,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@/components/ui/date-picker';

import bgFlights from '@/app/assets/santoroni.jpg';
import bgHotels from '@/app/assets/bali.jpg';
import bgBus from '@/app/assets/paris.jpg';

// ── City / Airport Data ──────────────────────────────────────
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
  'Vijayawada (Andhra Pradesh)', 'Visakhapatnam (Andhra Pradesh)',
];

const FLIGHT_LOCATIONS = [
  { city: 'Delhi', country: 'India', airport: 'Indira Gandhi International Airport', code: 'DEL' },
  { city: 'Mumbai', country: 'India', airport: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM' },
  { city: 'Bengaluru', country: 'India', airport: 'Kempegowda International Airport', code: 'BLR' },
  { city: 'Hyderabad', country: 'India', airport: 'Rajiv Gandhi International Airport', code: 'HYD' },
  { city: 'Chennai', country: 'India', airport: 'Chennai International Airport', code: 'MAA' },
  { city: 'Kolkata', country: 'India', airport: 'Netaji Subhas Chandra Bose International Airport', code: 'CCU' },
  { city: 'Goa', country: 'India', airport: 'Manohar International Airport', code: 'GOX' },
  { city: 'Patna', country: 'India', airport: 'Jay Prakash Narayan International Airport', code: 'PAT' },
  { city: 'Dubai', country: 'UAE', airport: 'Dubai International Airport', code: 'DXB' },
  { city: 'Singapore', country: 'Singapore', airport: 'Changi Airport', code: 'SIN' },
  { city: 'London', country: 'United Kingdom', airport: 'Heathrow Airport', code: 'LHR' },
  { city: 'Paris', country: 'France', airport: 'Charles de Gaulle Airport', code: 'CDG' },
  { city: 'New York', country: 'United States', airport: 'John F. Kennedy International Airport', code: 'JFK' },
];

interface SuggestionItem {
  value: string;
  title: string;
  subtitle: string;
}

// ── Field Wrapper (white pill containing label + input) ──────
interface FieldProps {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}
function Field({ label, children, onClick }: FieldProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl px-4 py-3 h-[64px] flex flex-col justify-center cursor-text hover:shadow-md transition-shadow duration-200 w-full"
    >
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-1">
        {label}
      </span>
      {children}
    </div>
  );
}

// ── City Autocomplete ──────────────────────────────────────
interface CityInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  mode?: 'bus' | 'flights' | 'hotels';
}
function CityField({ label, value, onChange, placeholder = 'Select city', mode = 'bus' }: CityInputProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getSuggestions = (query: string): SuggestionItem[] => {
    const q = query.trim().toLowerCase();
    if (mode === 'flights') {
      return FLIGHT_LOCATIONS.filter((item) =>
        !q ||
        item.city.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.airport.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
      )
        .slice(0, 6)
        .map((item) => ({
          value: `${item.city} (${item.code})`,
          title: `${item.city} (${item.code})`,
          subtitle: `${item.airport}, ${item.country}`,
        }));
    }
    return CITIES.filter((c) => c.toLowerCase().includes(q))
      .slice(0, 6)
      .map((city) => {
        const [cityName, statePart] = city.split(' (');
        return { value: city, title: cityName, subtitle: statePart ? statePart.replace(')', '') : '' };
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    const filtered = getSuggestions(val);
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0 && (mode === 'flights' || val.trim().length > 0));
  };

  const handleSelect = (item: SuggestionItem) => {
    onChange(item.value);
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        onClick={() => inputRef.current?.focus()}
        className="bg-white rounded-xl px-4 py-3 h-[64px] flex flex-col justify-center cursor-text hover:shadow-md transition-shadow duration-200"
      >
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-1">
          {label}
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => {
            const filtered = getSuggestions(value);
            setSuggestions(filtered);
            if (filtered.length > 0) setShowDropdown(true);
          }}
          autoComplete="off"
          className="bg-transparent outline-none text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 w-full leading-tight"
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 min-w-[320px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden mt-2"
          >
            {suggestions.map((item, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onMouseDown={() => handleSelect(item)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-100 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 truncate">{item.title}</span>
                  {item.subtitle && <span className="text-[12px] text-slate-500 truncate">{item.subtitle}</span>}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Tabs Data ─────────────────────────────────────────────
const TABS = [
  { id: 'flights', label: 'Flights', icon: Plane, bg: bgFlights as StaticImageData, headline: 'The best flight offers\nfrom anywhere, to everywhere' },
  { id: 'hotels', label: 'Hotels', icon: Building2, bg: bgHotels as StaticImageData, headline: 'Find the right\nplace to stay' },
  { id: 'bus', label: 'Bus', icon: Bus, bg: bgBus as StaticImageData, headline: 'Book your bus tickets\nin seconds' },
];

// ── Hero Component ───────────────────────────────────────
const todayISO = () => new Date().toISOString().split('T')[0];
const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const Hero = () => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'bus'>('flights');
  const [tripType, setTripType] = useState<'return' | 'oneway'>('return');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState(() => todayISO());
  const [returnDate, setReturnDate] = useState('');
  const [hotelDest, setHotelDest] = useState('');
  const [checkIn, setCheckIn] = useState(() => todayISO());
  const [checkOut, setCheckOut] = useState(() => tomorrowISO());
  const [showTripDropdown, setShowTripDropdown] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (activeTab === 'hotels') {
      if (hotelDest && checkIn) {
        const params = new URLSearchParams({
          type: 'hotels',
          destination: hotelDest,
          checkin: checkIn,
          checkout: checkOut,
        });
        router.push(`/search?${params.toString()}`);
      }
      return;
    }
    if (fromCity && toCity && departDate) {
      const params = new URLSearchParams({ type: activeTab, from: fromCity, to: toCity, date: departDate });
      if (activeTab === 'flights' && tripType === 'return' && returnDate) params.set('return', returnDate);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleSwap = () => {
    const t = fromCity;
    setFromCity(toCity);
    setToCity(t);
  };

  const activeTabData = TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="relative w-full overflow-hidden bg-[#0B1F3A]">
      {/* Background Image Layer — all images stacked, opacity-driven for crossfade */}
      <div className="absolute inset-0">
        {TABS.map((tab) => (
          <motion.div
            key={tab.id}
            initial={false}
            animate={{ opacity: activeTab === tab.id ? 1 : 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0 will-change-[opacity]"
          >
            <Image
              src={tab.bg}
              alt=""
              fill
              priority={tab.id === 'flights'}
              className="object-cover object-center"
              placeholder="blur"
            />
          </motion.div>
        ))}
        {/* Gradient overlay matching Skyscanner — sits above all images */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/95 via-[#0B1F3A]/55 to-[#0B1F3A]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/70 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top dark fill behind floating header */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-[#0B1F3A]" />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-32 sm:pt-36 pb-20 sm:pb-28 lg:pb-32 min-h-[680px] flex flex-col justify-center">

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10"
        >
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  active ? 'text-white' : 'text-white/85 hover:text-white border border-white/30'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-tab"
                    className="absolute inset-0 rounded-full bg-[#0770e3] shadow-lg shadow-[#0770e3]/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 w-4 h-4" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Headline */}
        <motion.h1
          key={activeTab + '-headline'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8 sm:mb-10 max-w-3xl whitespace-pre-line tracking-tight"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}
        >
          {activeTabData.headline}
        </motion.h1>

        {/* Search Container */}
        <motion.div
          key={activeTab + '-form'}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#0B1F3A]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl ring-1 ring-white/10"
          >
            {/* Top row (trip type for flights) */}
            {activeTab === 'flights' && (
              <div className="relative flex items-center gap-2 mb-3 sm:mb-4">
                <button
                  onClick={() => setShowTripDropdown(!showTripDropdown)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  {tripType === 'return' ? 'Return' : 'One way'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTripDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showTripDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-30 min-w-[160px]"
                    >
                      {(['return', 'oneway'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => { setTripType(t); setShowTripDropdown(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors ${
                            tripType === t ? 'text-[#0770e3] bg-blue-50' : 'text-slate-700'
                          }`}
                        >
                          {t === 'return' ? 'Return' : 'One way'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── FLIGHTS / BUS Grid ── */}
            {(activeTab === 'flights' || activeTab === 'bus') && (
              <>
                <div
                  className={`grid gap-2 sm:gap-3 ${
                    activeTab === 'flights'
                      ? tripType === 'return'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_1fr_auto]'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr_1fr_auto]'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr_auto]'
                  }`}
                >
                  {/* From + Swap */}
                  <div className="relative">
                    <CityField
                      label="From"
                      value={fromCity}
                      onChange={setFromCity}
                      placeholder={activeTab === 'flights' ? 'Country, city or airport' : 'Origin city'}
                      mode={activeTab === 'flights' ? 'flights' : 'bus'}
                    />
                    {/* Swap button — sits on the edge between From and To on large screens */}
                    <button
                      onClick={handleSwap}
                      className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border-2 border-slate-200 items-center justify-center hover:border-[#0770e3] hover:text-[#0770e3] hover:rotate-180 transition-all duration-300 shadow-md"
                      aria-label="Swap"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* To */}
                  <CityField
                    label="To"
                    value={toCity}
                    onChange={setToCity}
                    placeholder={activeTab === 'flights' ? 'Country, city or airport' : 'Destination city'}
                    mode={activeTab === 'flights' ? 'flights' : 'bus'}
                  />

                  {/* Depart */}
                  <Field label="Depart">
                    <DatePicker value={departDate} onChange={setDepartDate} placeholder="Add date" />
                  </Field>

                  {/* Return (flights + return mode) */}
                  {activeTab === 'flights' && tripType === 'return' && (
                    <Field label="Return">
                      <DatePicker
                        value={returnDate}
                        onChange={setReturnDate}
                        placeholder="Add date"
                        minDate={departDate ? new Date(departDate) : undefined}
                      />
                    </Field>
                  )}

                  {/* Travellers (flights only) */}
                  {activeTab === 'flights' && (
                    <Field label="Travellers & class">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-[15px] font-semibold text-slate-900 truncate">1 Adult, Economy</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
                      </div>
                    </Field>
                  )}

                  {/* Search Button */}
                  <motion.button
                    onClick={handleSearch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-[64px] bg-[#0770e3] hover:bg-[#0561c7] text-white px-6 lg:px-8 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-colors shadow-lg shadow-[#0770e3]/30"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </motion.button>
                </div>

                {/* Mobile swap button (below From) */}
                <div className="flex lg:hidden justify-center my-1">
                  <button
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label="Swap"
                  >
                    <ArrowLeftRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>

                {/* Sub options */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 px-1">
                  <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer hover:text-white">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#0770e3]" />
                    Add nearby airports
                  </label>
                  {activeTab === 'flights' && (
                    <>
                      <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer hover:text-white">
                        <input type="checkbox" className="w-4 h-4 rounded accent-[#0770e3]" />
                        Direct flights
                      </label>
                      <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer hover:text-white">
                        <input type="checkbox" className="w-4 h-4 rounded accent-[#0770e3]" defaultChecked />
                        Add a hotel
                      </label>
                    </>
                  )}
                </div>
              </>
            )}

            {/* ── HOTELS Grid ── */}
            {activeTab === 'hotels' && (
              <>
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_0.9fr_1fr_auto]">
                  <CityField
                    label="Destination"
                    value={hotelDest}
                    onChange={setHotelDest}
                    placeholder="City or hotel name"
                    mode="hotels"
                  />

                  <Field label="Check-in">
                    <DatePicker value={checkIn} onChange={setCheckIn} placeholder="Add date" />
                  </Field>

                  <Field label="Check-out">
                    <DatePicker
                      value={checkOut}
                      onChange={setCheckOut}
                      placeholder="Add date"
                      minDate={checkIn ? new Date(checkIn) : undefined}
                    />
                  </Field>

                  <Field label="Guests & rooms">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-[15px] font-semibold text-slate-900 truncate">2 adults, 1 room</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
                    </div>
                  </Field>

                  <motion.button
                    onClick={handleSearch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-[64px] bg-[#0770e3] hover:bg-[#0561c7] text-white px-6 lg:px-8 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-colors shadow-lg shadow-[#0770e3]/30"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 px-1">
                  <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer hover:text-white">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#0770e3]" />
                    Free cancellation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer hover:text-white">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#0770e3]" />
                    4 stars +
                  </label>
                </div>
              </>
            )}
          </motion.div>

      </div>

      {/* Bottom curved divider — Skyscanner-style scallop */}
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px text-white"
        width="120"
        height="36"
        viewBox="0 0 120 36"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0 36 C 30 36, 30 0, 60 0 C 90 0, 90 36, 120 36 Z" />
      </svg>
    </section>
  );
};

export default Hero;
