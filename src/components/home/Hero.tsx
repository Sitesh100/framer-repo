'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Plane, 
  FileCheck, 
  Building2, 
  MapPin, 
  Calendar,
  Search,
  Star,
  TrendingDown,
  Shield,
  Clock,
  Bus,
  ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import testimonial1 from '@/app/assets/testimonial-1.jpg';
import testimonial2 from '@/app/assets/testimonial-2.jpg';
import testimonial3 from '@/app/assets/testimonial-3.jpg';

// ── 100+ Indian Cities ────────
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

const tabs = [
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'visa', label: 'Visa', icon: FileCheck },
];

const popularDestinations = [
  { city: 'Paris', country: 'France', price: '$299', image: '🗼' },
  { city: 'Tokyo', country: 'Japan', price: '$549', image: '🗾' },
  { city: 'Dubai', country: 'UAE', price: '$399', image: '🏙️' },
  { city: 'Bali', country: 'Indonesia', price: '$449', image: '🏝️' },
];

// ── City Autocomplete Input (Dropdown Width Fix + State Name Visibility) ──
interface CityInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon: React.ElementType; 
  mode?: 'bus' | 'flights';
}

function CityInput({
  label,
  value,
  onChange,
  placeholder = 'Select city',
  icon: Icon,
  mode = 'bus',
}: CityInputProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const getSuggestions = (query: string): SuggestionItem[] => {
    const q = query.trim().toLowerCase();
    if (mode === 'flights') {
      return FLIGHT_LOCATIONS.filter((item) => {
        if (!q) return true;
        return (
          item.city.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.airport.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q)
        );
      })
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
        const state = statePart ? statePart.replace(')', '') : '';
        return {
          value: city,
          title: cityName,
          subtitle: state,
        };
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

  const selectedItem = getSuggestions(value).find((s) => s.value === value);
  const stateName = mode === 'flights'
    ? selectedItem?.subtitle || ''
    : value.includes('(') ? value.split('(')[1]?.replace(')', '') : '';

  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-0 w-full">
      <div className="flex flex-col px-4 py-2.5 h-full justify-center">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">{label}</span>
        <input
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
          className="bg-transparent outline-none text-[15px] font-bold text-slate-900 placeholder:text-gray-300 w-full leading-tight"
        />
        {/* Removed 'truncate' so state name shows fully inside the input */}
        {stateName && <span className="text-[11px] text-gray-400 leading-tight block whitespace-nowrap overflow-visible">{stateName}</span>}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            // Fix: w-max & min-w-[280px] added so it takes full length to show big city/state names
            className="absolute top-full left-0 w-max min-w-[280px] bg-white border border-blue-100 rounded-2xl shadow-2xl z-[100] overflow-hidden mt-2"
          >
            {suggestions.map((item, idx) => {
              return (
                <button
                  key={idx}
                  onMouseDown={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-0"
                >
                  <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {/* Fix: flex-col makes the state name go to the next line automatically for better visibility */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{item.title}</span>
                    {item.subtitle && <span className="text-[11px] font-medium text-gray-500">{item.subtitle}</span>}
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

// ── Hero ──────────────────────────────────────────────────────
const Hero = () => {
  const [activeTab, setActiveTab] = useState('bus');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [selectedDateType, setSelectedDateType] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const router = useRouter();

  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleTodayClick = () => { setDepartDate(getTodayDate()); setSelectedDateType('today'); };
  const handleTomorrowClick = () => { setDepartDate(getTomorrowDate()); setSelectedDateType('tomorrow'); };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartDate(e.target.value);
    setSelectedDateType('custom');
  };

  const handleSearch = () => {
    if (activeTab === 'visa') {
      router.push('/visa');
      return;
    }

    if (fromCity && toCity && departDate) {
      const searchParams = new URLSearchParams({ type: activeTab, from: fromCity, to: toCity, date: departDate });
      router.push(`/search?${searchParams.toString()}`);
    }
  };

  useEffect(() => { setDepartDate(getTodayDate()); }, []);

  // Determine which icon to show based on selected tab
  const ActiveIcon = activeTab === 'bus' ? Bus : activeTab === 'flights' ? Plane : FileCheck;

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 lg:px-8">

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8"
        >
          <div className="flex items-center gap-2 bg-blue-100 backdrop-blur-md border border-blue-200 rounded-full px-4 py-2">
            <div className="flex -space-x-2">
              {[testimonial1, testimonial2, testimonial3].map((img, i) => (
                <Image key={i} src={img} alt="User" className="w-7 h-7 rounded-full border-2 border-blue-300 object-cover" />
              ))}
            </div>
            <span className="text-sm text-blue-900">2M+ Happy Travelers</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-100 backdrop-blur-md border border-emerald-200 rounded-full px-4 py-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">Best Price Guaranteed</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 backdrop-blur-md border border-blue-200 rounded-full px-4 py-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-blue-900">4.9/5 Rating</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight mb-6">
            Your Dream Trip,
            <br />
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%)' }}>
                Unbeatable Prices
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <motion.path d="M2 8 Q 75 2, 150 8 T 298 8" fill="none" stroke="url(#underlineGradient)" strokeWidth="4" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto">
            Compare flights, hotels, visas & tour packages from 500+ providers.
            Save up to <span className="text-blue-600 font-semibold">40%</span> on your next adventure.
          </p>
        </motion.div>

        {/* ── SEARCH BOX (Redesigned like SearchResults inline bar) ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="w-full relative z-40 max-w-5xl mx-auto"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-4 md:p-5">

            {/* Tabs */}
            <div className="flex gap-2 mb-4 bg-gray-100 rounded-2xl p-1.5 w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 py-2 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      activeTab === tab.id ? 'bg-gradient-button text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Inline Search Fields Container */}
            <div className="flex flex-col lg:flex-row items-stretch lg:h-[60px] bg-white border-2 border-blue-200 rounded-xl lg:rounded-2xl shadow-sm">
              
              {/* FROM */}
              <div className="flex items-center flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-blue-100 relative">
                <ActiveIcon className="w-4 h-4 text-blue-400 ml-4 flex-shrink-0 hidden sm:block" />
                <CityInput
                  label="From"
                  value={fromCity}
                  onChange={setFromCity}
                  icon={ActiveIcon}
                  mode={activeTab === 'flights' ? 'flights' : 'bus'}
                  placeholder={activeTab === 'flights' ? 'Search city, airport or country' : 'Select city'}
                />
              </div>

              {/* SWAP */}
              {(activeTab === 'flights' || activeTab === 'bus') && (
                <button
                  onClick={() => { const t = fromCity; setFromCity(toCity); setToCity(t); }}
                  className="w-full lg:w-10 h-10 lg:h-full bg-gradient-button hover:brightness-105 active:brightness-95 flex items-center justify-center flex-shrink-0 transition-all"
                >
                  <ArrowLeftRight className="w-4 h-4 text-white rotate-90 lg:rotate-0" />
                </button>
              )}

              {/* TO */}
              <div className="flex items-center flex-1 min-w-0 border-b lg:border-b-0 lg:border-x border-blue-100 relative">
                <ActiveIcon className="w-4 h-4 text-blue-400 ml-4 flex-shrink-0 hidden sm:block" />
                <CityInput
                  label="To"
                  value={toCity}
                  onChange={setToCity}
                  icon={ActiveIcon}
                  mode={activeTab === 'flights' ? 'flights' : 'bus'}
                  placeholder={activeTab === 'flights' ? 'Search city, airport or country' : 'Select city'}
                />
              </div>

              {/* DATE */}
              <div className="flex items-center gap-2 px-4 py-3 lg:py-0 border-b lg:border-b-0 lg:border-r border-blue-100 flex-shrink-0 relative">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Date</p>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={departDate}
                      onChange={handleDateChange}
                      className="text-[13px] font-bold text-slate-900 bg-transparent outline-none"
                    />
                    {selectedDateType === 'today' && <span className="text-[10px] text-gray-500">(Today)</span>}
                  </div>
                </div>
              </div>

              {/* Today/Tomorrow Shortcuts (Desktop only) */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 border-b lg:border-b-0 lg:border-r border-blue-100">
                <button
                  onClick={handleTodayClick}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedDateType === 'today' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={handleTomorrowClick}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedDateType === 'tomorrow' ? 'bg-gradient-button text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tomorrow
                </button>
              </div>

              {/* Search Button Inline */}
              <button
                onClick={handleSearch}
                className="bg-gradient-button hover:brightness-105 active:brightness-95 text-white py-4 lg:py-0 px-8 flex items-center justify-center gap-2 flex-shrink-0 transition-all font-bold text-sm rounded-bl-xl rounded-br-xl lg:rounded-bl-none lg:rounded-tr-xl lg:rounded-br-xl shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-14"
        >
          {[
            { icon: Shield, label: 'Secure Booking', value: '100%' },
            { icon: Clock, label: '24/7 Support', value: 'Always' },
            { icon: TrendingDown, label: 'Price Match', value: 'Guaranteed' },
            { icon: Star, label: 'Reviews', value: '50K+' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3 bg-blue-100 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 hover:bg-blue-150 transition-colors"
              >
                <div className="w-11 h-11 bg-blue-200 backdrop-blur rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-blue-700">{stat.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Popular Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-14"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-semibold text-slate-900">Popular Destinations</h3>
              <p className="text-sm text-slate-600 mt-1">Top picks for your next adventure</p>
            </div>
            <motion.button whileHover={{ x: 5 }} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-blue-100 backdrop-blur-md border border-blue-200 rounded-2xl p-5 cursor-pointer hover:bg-blue-150 hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{dest.image}</div>
                <h4 className="text-slate-900 font-semibold text-lg">{dest.city}</h4>
                <p className="text-slate-600 text-sm">{dest.country}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                    from {dest.price}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-200 group-hover:bg-blue-300 transition-colors">
                    <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Floating Deal Cards */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute left-4 lg:left-8 top-48 hidden lg:block"
      >
        <div className="bg-white rounded-2xl p-4 shadow-xl max-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Flash Deal!</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">Paris → London</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 line-through text-sm">$299</span>
            <span className="text-emerald-600 font-bold">$149</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">50% OFF</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute right-4 lg:right-8 xl:right-16 top-64 hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="bg-white rounded-2xl p-4 shadow-2xl max-w-[220px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500">Hotel Deal</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">5★ Resort in Bali</p>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 line-through text-sm">$450/night</span>
            <span className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              $199/night
            </span>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;
