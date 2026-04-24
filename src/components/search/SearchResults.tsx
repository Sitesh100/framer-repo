'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowLeftRight, Search, ArrowLeft, Bus, Plane, ChevronRight } from 'lucide-react';
import Header from '@/components/shared/Header';
import BusSearchResultsView, { type BusResult } from '@/components/search/BusSearchResultsView';
import FlightSearchResultsView, { type FlightResult } from '@/components/search/FlightSearchResultsView';

const busResults: BusResult[] = [
  {
    id: 1,
    operator: 'NueGo',
    busType: 'Electric A/C Seater',
    layout: '2+2',
    seatLayout: 'standard',
    rating: 4.4,
    reviews: 230,
    departure: '05:30',
    arrival: '10:55',
    duration: '5h 25m',
    marketPrice: 850,
    ourPrice: 363,
    availableSeats: 7,
    singleSeats: 4,
    amenities: ['AC', 'WiFi', 'Charging', 'LiveTracking'],
    liveTracking: true,
    freeCancellation: true,
    isSleeper: false,
    isAC: true,
    boardingPoints: ['Jaipur Bus Stand', 'Sitapura', 'Tonk Road'],
    droppingPoints: ['Gurugram Sector 14', 'IFFCO Chowk', 'MG Road'],
  },
  {
    id: 2,
    operator: 'Zingbus Plus',
    busType: 'A/C Seater / Sleeper',
    layout: '2+1',
    seatLayout: 'double-deck',
    rating: 4.5,
    reviews: 113,
    departure: '19:45',
    arrival: '01:40',
    duration: '5h 55m',
    marketPrice: 720,
    ourPrice: 409,
    availableSeats: 5,
    singleSeats: 2,
    amenities: ['AC', 'Charging', 'LiveTracking'],
    liveTracking: true,
    freeCancellation: false,
    isSleeper: true,
    isAC: true,
    boardingPoints: ['Jaipur Bus Stand', 'Durgapura'],
    droppingPoints: ['Gurugram Sector 29', 'Sohna Road'],
  },
  {
    id: 3,
    operator: 'Maharani Travels',
    busType: 'A/C Sleeper',
    layout: '2+1',
    seatLayout: 'sleeper',
    rating: 4.3,
    reviews: 231,
    departure: '05:30',
    arrival: '09:10',
    duration: '3h 40m',
    marketPrice: 550,
    ourPrice: 289,
    availableSeats: 6,
    singleSeats: 7,
    amenities: ['AC', 'WiFi', 'LiveTracking'],
    liveTracking: true,
    freeCancellation: false,
    isSleeper: true,
    isAC: true,
    boardingPoints: ['Jaipur Central', 'Sindhi Camp'],
    droppingPoints: ['Gurugram Bus Stand', 'Sector 56'],
  },
  {
    id: 4,
    operator: 'RSRTC Express',
    busType: 'Non-AC Seater',
    layout: '2+3',
    seatLayout: 'standard',
    rating: 3.1,
    reviews: 88,
    departure: '04:05',
    arrival: '08:55',
    duration: '4h 50m',
    marketPrice: 380,
    ourPrice: 229,
    availableSeats: 12,
    singleSeats: 3,
    amenities: [],
    liveTracking: false,
    freeCancellation: false,
    isSleeper: false,
    isAC: false,
    boardingPoints: ['Sindhi Camp Bus Stand'],
    droppingPoints: ['Gurugram Bus Stand'],
  },
  {
    id: 5,
    operator: 'Volvo Express',
    busType: 'Volvo A/C Multi-Axle Sleeper',
    layout: '2+2',
    seatLayout: 'double-deck',
    rating: 4.6,
    reviews: 412,
    departure: '22:00',
    arrival: '04:15',
    duration: '6h 15m',
    marketPrice: 1400,
    ourPrice: 599,
    availableSeats: 3,
    singleSeats: 0,
    amenities: ['AC', 'WiFi', 'Charging', 'Meals', 'Entertainment'],
    liveTracking: true,
    freeCancellation: true,
    isSleeper: true,
    isAC: true,
    boardingPoints: ['Jaipur Central', 'Sindhi Camp', 'Tonk Road'],
    droppingPoints: ['Gurugram Sector 14', 'IFFCO Chowk', 'Cyber City'],
  },
  {
    id: 6,
    operator: 'Laxmi Holidays',
    busType: 'A/C Sleeper',
    layout: '2+1',
    rating: 4.2,
    reviews: 67,
    departure: '23:30',
    arrival: '05:30',
    duration: '6h 00m',
    marketPrice: 980,
    ourPrice: 503,
    availableSeats: 1,
    singleSeats: 0,
    amenities: ['AC', 'Charging'],
    liveTracking: false,
    freeCancellation: false,
    isSleeper: true,
    isAC: true,
    boardingPoints: ['Jaipur Bus Stand'],
    droppingPoints: ['Gurugram Sector 14'],
  },
];

const flightResults: FlightResult[] = [
  {
    id: 1,
    airline: 'SpiceJet',
    flightNo: 'SG 8234',
    airline_rating: 4.1,
    rating_reviews: 2140,
    departure: '19:00',
    arrival: '20:45',
    duration: '1h 45m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 4599,
    marketPrice: 5173,
    bookedDaysAhead: 18,
    stops: 0,
    layover: 'Non-stop',
    deals: 15,
    cabinBag: true,
    checkedBag: false,
    refundable: false,
    seatClass: 'Economy',
  },
  {
    id: 2,
    airline: 'IndiGo',
    flightNo: '6E 2142',
    airline_rating: 4.4,
    rating_reviews: 4890,
    departure: '11:10',
    arrival: '12:45',
    duration: '1h 35m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 5173,
    marketPrice: 5599,
    bookedDaysAhead: 14,
    stops: 0,
    layover: 'Non-stop',
    deals: 16,
    cabinBag: true,
    checkedBag: true,
    refundable: true,
    seatClass: 'Economy',
  },
  {
    id: 3,
    airline: 'IndiGo',
    flightNo: '6E 6271',
    airline_rating: 4.3,
    rating_reviews: 3520,
    departure: '08:10',
    arrival: '09:50',
    duration: '1h 40m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 5173,
    marketPrice: 5599,
    bookedDaysAhead: 12,
    stops: 0,
    layover: 'Non-stop',
    deals: 18,
    cabinBag: true,
    checkedBag: true,
    refundable: true,
    seatClass: 'Economy',
  },
  {
    id: 4,
    airline: 'Air India Express',
    flightNo: 'IX 1124',
    airline_rating: 3.9,
    rating_reviews: 1710,
    departure: '06:20',
    arrival: '07:55',
    duration: '1h 35m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 4832,
    marketPrice: 5310,
    bookedDaysAhead: 10,
    stops: 0,
    layover: 'Non-stop',
    deals: 12,
    cabinBag: true,
    checkedBag: true,
    refundable: false,
    seatClass: 'Economy',
  },
  {
    id: 5,
    airline: 'Air India',
    flightNo: 'AI 740',
    airline_rating: 4,
    rating_reviews: 2940,
    departure: '05:45',
    arrival: '07:30',
    duration: '1h 45m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 5020,
    marketPrice: 5490,
    bookedDaysAhead: 11,
    stops: 0,
    layover: 'Non-stop',
    deals: 12,
    cabinBag: true,
    checkedBag: true,
    refundable: true,
    seatClass: 'Premium Economy',
  },
  {
    id: 6,
    airline: 'Vistara',
    flightNo: 'UK 715',
    airline_rating: 4.6,
    rating_reviews: 4075,
    departure: '16:20',
    arrival: '18:00',
    duration: '1h 40m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 5247,
    marketPrice: 5730,
    bookedDaysAhead: 16,
    stops: 0,
    layover: 'Non-stop',
    deals: 18,
    cabinBag: true,
    checkedBag: true,
    refundable: true,
    seatClass: 'Business',
  },
  {
    id: 7,
    airline: 'Air India Express',
    flightNo: 'IX 1317',
    airline_rating: 3.8,
    rating_reviews: 1330,
    departure: '21:10',
    arrival: '00:10',
    duration: '3h 00m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 5601,
    marketPrice: 6320,
    bookedDaysAhead: 7,
    stops: 1,
    layover: '1 stop via AMD',
    deals: 9,
    cabinBag: true,
    checkedBag: false,
    refundable: false,
    seatClass: 'Economy',
  },
  {
    id: 8,
    airline: 'SpiceJet',
    flightNo: 'SG 371',
    airline_rating: 3.7,
    rating_reviews: 1220,
    departure: '14:40',
    arrival: '19:05',
    duration: '4h 25m',
    fromCode: 'DEL',
    toCode: 'PAT',
    price: 5890,
    marketPrice: 6610,
    bookedDaysAhead: 6,
    stops: 2,
    layover: '2+ stops',
    deals: 7,
    cabinBag: true,
    checkedBag: false,
    refundable: false,
    seatClass: 'Economy',
  },
];

const CITIES = [
  'Agartala (Tripura)',
  'Agra (Uttar Pradesh)',
  'Ahmedabad (Gujarat)',
  'Aizawl (Mizoram)',
  'Amritsar (Punjab)',
  'Aurangabad (Maharashtra)',
  'Ayodhya (Uttar Pradesh)',
  'Bagdogra (West Bengal)',
  'Bareilly (Uttar Pradesh)',
  'Bathinda (Punjab)',
  'Belagavi (Karnataka)',
  'Bengaluru (Karnataka)',
  'Bhopal (Madhya Pradesh)',
  'Bhubaneswar (Odisha)',
  'Bhuj (Gujarat)',
  'Bidar (Karnataka)',
  'Bikaner (Rajasthan)',
  'Bilaspur (Chhattisgarh)',
  'Chandigarh (Chandigarh)',
  'Chennai (Tamil Nadu)',
  'Coimbatore (Tamil Nadu)',
  'Darbhanga (Bihar)',
  'Dehradun (Uttarakhand)',
  'Delhi (Delhi)',
  'Deoghar (Jharkhand)',
  'Dharamshala (Himachal Pradesh)',
  'Dibrugarh (Assam)',
  'Dimapur (Nagaland)',
  'Durgapur (West Bengal)',
  'Gaya (Bihar)',
  'Goa (Goa)',
  'Gorakhpur (Uttar Pradesh)',
  'Guwahati (Assam)',
  'Gwalior (Madhya Pradesh)',
  'Hubballi (Karnataka)',
  'Hyderabad (Telangana)',
  'Imphal (Manipur)',
  'Indore (Madhya Pradesh)',
  'Itanagar (Arunachal Pradesh)',
  'Jabalpur (Madhya Pradesh)',
  'Jagdalpur (Chhattisgarh)',
  'Jaipur (Rajasthan)',
  'Jaisalmer (Rajasthan)',
  'Jalgaon (Maharashtra)',
  'Jammu (Jammu & Kashmir)',
  'Jamnagar (Gujarat)',
  'Jamshedpur (Jharkhand)',
  'Jharsuguda (Odisha)',
  'Jodhpur (Rajasthan)',
  'Jorhat (Assam)',
  'Kadapa (Andhra Pradesh)',
  'Kalaburagi (Karnataka)',
  'Kannur (Kerala)',
  'Kanpur (Uttar Pradesh)',
  'Khajuraho (Madhya Pradesh)',
  'Kishangarh (Rajasthan)',
  'Kochi (Kerala)',
  'Kolhapur (Maharashtra)',
  'Kolkata (West Bengal)',
  'Kozhikode (Kerala)',
  'Kullu (Himachal Pradesh)',
  'Kurnool (Andhra Pradesh)',
  'Kushinagar (Uttar Pradesh)',
  'Leh (Ladakh)',
  'Lucknow (Uttar Pradesh)',
  'Ludhiana (Punjab)',
  'Madurai (Tamil Nadu)',
  'Mangaluru (Karnataka)',
  'Mumbai (Maharashtra)',
  'Mysuru (Karnataka)',
  'Nagpur (Maharashtra)',
  'Nanded (Maharashtra)',
  'Nashik (Maharashtra)',
  'Pakyong (Sikkim)',
  'Pantnagar (Uttarakhand)',
  'Pasighat (Arunachal Pradesh)',
  'Patna (Bihar)',
  'Pithoragarh (Uttarakhand)',
  'Porbandar (Gujarat)',
  'Port Blair (Andaman & Nicobar)',
  'Prayagraj (Uttar Pradesh)',
  'Puducherry (Puducherry)',
  'Pune (Maharashtra)',
  'Raipur (Chhattisgarh)',
  'Rajahmundry (Andhra Pradesh)',
  'Rajkot (Gujarat)',
  'Ranchi (Jharkhand)',
  'Rourkela (Odisha)',
  'Salem (Tamil Nadu)',
  'Shillong (Meghalaya)',
  'Shimla (Himachal Pradesh)',
  'Shirdi (Maharashtra)',
  'Shivamogga (Karnataka)',
  'Silchar (Assam)',
  'Srinagar (Jammu & Kashmir)',
  'Surat (Gujarat)',
  'Tezpur (Assam)',
  'Thiruvananthapuram (Kerala)',
  'Thoothukudi (Tamil Nadu)',
  'Tiruchirappalli (Tamil Nadu)',
  'Tirupati (Andhra Pradesh)',
  'Udaipur (Rajasthan)',
  'Vadodara (Gujarat)',
  'Varanasi (Uttar Pradesh)',
  'Vijayawada (Andhra Pradesh)',
  'Visakhapatnam (Andhra Pradesh)',
];

const FLIGHT_LOCATIONS = [
  { city: 'Delhi', country: 'India', airport: 'Indira Gandhi International Airport', code: 'DEL' },
  { city: 'Mumbai', country: 'India', airport: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM' },
  { city: 'Bengaluru', country: 'India', airport: 'Kempegowda International Airport', code: 'BLR' },
  { city: 'Hyderabad', country: 'India', airport: 'Rajiv Gandhi International Airport', code: 'HYD' },
  { city: 'Chennai', country: 'India', airport: 'Chennai International Airport', code: 'MAA' },
  { city: 'Kolkata', country: 'India', airport: 'Netaji Subhas Chandra Bose International Airport', code: 'CCU' },
  { city: 'Ahmedabad', country: 'India', airport: 'Sardar Vallabhbhai Patel International Airport', code: 'AMD' },
  { city: 'Pune', country: 'India', airport: 'Pune International Airport', code: 'PNQ' },
  { city: 'Goa', country: 'India', airport: 'Manohar International Airport', code: 'GOX' },
  { city: 'Patna', country: 'India', airport: 'Jay Prakash Narayan International Airport', code: 'PAT' },
  { city: 'Jaipur', country: 'India', airport: 'Jaipur International Airport', code: 'JAI' },
  { city: 'Lucknow', country: 'India', airport: 'Chaudhary Charan Singh International Airport', code: 'LKO' },
  { city: 'Dubai', country: 'UAE', airport: 'Dubai International Airport', code: 'DXB' },
  { city: 'Singapore', country: 'Singapore', airport: 'Changi Airport', code: 'SIN' },
  { city: 'Bangkok', country: 'Thailand', airport: 'Suvarnabhumi Airport', code: 'BKK' },
  { city: 'London', country: 'United Kingdom', airport: 'Heathrow Airport', code: 'LHR' },
  { city: 'Paris', country: 'France', airport: 'Charles de Gaulle Airport', code: 'CDG' },
  { city: 'New York', country: 'United States', airport: 'John F. Kennedy International Airport', code: 'JFK' },
];

interface SuggestionItem {
  value: string;
  primary: string;
  secondary: string;
}

function CityInput({
  label,
  value,
  onChange,
  mode = 'bus',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mode?: 'bus' | 'flights';
}) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const buildBusSuggestions = (query: string): SuggestionItem[] => {
    const list = CITIES.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
    return list.map((city) => {
      const [primary, statePart] = city.split(' (');
      const state = statePart ? statePart.replace(')', '') : '';
      return { value: city, primary, secondary: state };
    });
  };

  const buildFlightSuggestions = (query: string): SuggestionItem[] => {
    const normalized = query.trim().toLowerCase();
    const list = FLIGHT_LOCATIONS.filter((item) => {
      if (!normalized) return true;
      return (
        item.city.toLowerCase().includes(normalized) ||
        item.country.toLowerCase().includes(normalized) ||
        item.airport.toLowerCase().includes(normalized) ||
        item.code.toLowerCase().includes(normalized)
      );
    }).slice(0, 6);

    return list.map((item) => ({
      value: `${item.city} (${item.code})`,
      primary: `${item.city} (${item.code})`,
      secondary: `${item.airport}, ${item.country}`,
    }));
  };

  const getSuggestions = (query: string) => (mode === 'flights' ? buildFlightSuggestions(query) : buildBusSuggestions(query));

  const handleChange = (v: string) => {
    onChange(v);
    const nextSuggestions = getSuggestions(v);
    setSuggestions(nextSuggestions);
    setOpen(nextSuggestions.length > 0 && (mode === 'flights' || v.length > 0));
  };

  const handleSelect = (selection: SuggestionItem) => {
    onChange(selection.value);
    setOpen(false);
  };

  const selectedSuggestion = getSuggestions(value).find((entry) => entry.value === value);
  const busStateName = value.includes('(') ? value.split('(')[1]?.replace(')', '') : '';
  const subLine = mode === 'flights' ? selectedSuggestion?.secondary || '' : busStateName;

  return (
    <div ref={ref} className="relative flex-1 min-w-0 w-full">
      <div className="flex flex-col px-4 py-2.5 h-full justify-center">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">{label}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            const nextSuggestions = getSuggestions(value);
            setSuggestions(nextSuggestions);
            if (nextSuggestions.length > 0) setOpen(true);
          }}
          placeholder={mode === 'flights' ? 'Search city, airport or country' : 'Select city'}
          autoComplete="off"
          className="bg-transparent outline-none text-[15px] font-bold text-slate-900 placeholder:text-gray-300 w-full leading-tight"
        />
        {subLine && (
          <span className="text-[11px] text-gray-400 leading-tight block whitespace-nowrap overflow-hidden text-ellipsis">{subLine}</span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 w-max min-w-[280px] bg-white border border-blue-100 rounded-2xl shadow-2xl z-[200] overflow-hidden mt-2"
          >
            {suggestions.map((item, i) => (
              <button
                key={i}
                onMouseDown={() => handleSelect(item)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-0"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{item.primary}</span>
                  {item.secondary && <span className="text-[11px] font-medium text-gray-500">{item.secondary}</span>}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get('type') || 'bus';
  const travelType = currentType === 'flights' ? 'flights' : 'bus';

  const urlFrom = searchParams.get('from');
  const urlTo = searchParams.get('to');
  const urlDate = searchParams.get('date');

  const [fromCity, setFromCity] = useState(urlFrom || '');
  const [toCity, setToCity] = useState(urlTo || '');
  const [date, setDate] = useState(urlDate || new Date().toISOString().split('T')[0]);
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);

  useEffect(() => {
    setFromCity(urlFrom || '');
    setToCity(urlTo || '');
    setDate(urlDate || new Date().toISOString().split('T')[0]);
  }, [currentType, urlFrom, urlTo, urlDate]);

  const hideTopChrome = travelType === 'bus' && isBusModalOpen;

  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const isToday = date === getTodayDate();
  const isTomorrow = date === getTomorrowDate();

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const getCityName = (value: string) => (value ? value.split(' (')[0].trim() : '');
  const getFlightCode = (value: string) => {
    const bracketCode = value.match(/\(([^)]+)\)/)?.[1]?.trim();
    if (bracketCode && /^[A-Za-z]{3,4}$/.test(bracketCode)) {
      return bracketCode.toUpperCase();
    }
    const base = getCityName(value);
    return base ? base.slice(0, 3).toUpperCase() : '---';
  };
  const getBusPoints = (city: string) => {
    const name = getCityName(city) || 'City';
    return [`${name} Bus Stand`, `${name} Central`, `${name} City Point`];
  };

  const fromName = getCityName(fromCity) || 'Select origin';
  const toName = getCityName(toCity) || 'Select destination';
  const fromCode = getFlightCode(fromCity);
  const toCode = getFlightCode(toCity);

  const dynamicBusResults = busResults.map((bus) => {
    const fromPoints = getBusPoints(fromCity);
    const toPoints = getBusPoints(toCity);
    return {
      ...bus,
      boardingPoints: fromPoints.slice(0, Math.max(1, bus.boardingPoints.length)),
      droppingPoints: toPoints.slice(0, Math.max(1, bus.droppingPoints.length)),
    };
  });

  const dynamicFlightResults = flightResults.map((flight) => ({
    ...flight,
    fromCode,
    toCode,
  }));

  const count = travelType === 'flights' ? dynamicFlightResults.length : dynamicBusResults.length;

  return (
    <>
      {!hideTopChrome && <Header />}

      {!hideTopChrome && (
        <div className="sticky top-4 z-[1000] mt-[110px] mb-6 mt-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-stretch h-[60px] bg-white border border-blue-200 rounded-2xl shadow-xl shadow-blue-500/10">
              <div className="flex items-center flex-1 min-w-0 border-r border-blue-100">
                {travelType === 'flights' ? (
                  <Plane className="w-4 h-4 text-blue-300 ml-4 flex-shrink-0" />
                ) : (
                  <Bus className="w-4 h-4 text-blue-300 ml-4 flex-shrink-0" />
                )}
                <CityInput label="From" value={fromCity} onChange={setFromCity} mode={travelType} />
              </div>

              <button
                onClick={() => {
                  const t = fromCity;
                  setFromCity(toCity);
                  setToCity(t);
                }}
                className="w-10 bg-gradient-button hover:brightness-105 active:brightness-95 flex items-center justify-center flex-shrink-0 transition-all"
              >
                <ArrowLeftRight className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center flex-1 min-w-0 border-x border-blue-100">
                <MapPin className="w-4 h-4 text-blue-300 ml-4 flex-shrink-0" />
                <CityInput label="To" value={toCity} onChange={setToCity} mode={travelType} />
              </div>

              <div className="flex items-center gap-2 px-4 border-r border-blue-100 flex-shrink-0">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Date</p>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="text-[13px] font-bold text-slate-900 bg-transparent outline-none"
                    />
                    {isToday && <span className="text-[10px] text-gray-400">(Today)</span>}
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 border-r border-blue-100">
                <button
                  onClick={() => setDate(getTodayDate())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isToday ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setDate(getTomorrowDate())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isTomorrow ? 'bg-gradient-button text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tomorrow
                </button>
              </div>

              <button
                onClick={() => router.push(`/search?type=${currentType}&from=${fromCity}&to=${toCity}&date=${date}`)}
                className="bg-gradient-button hover:brightness-105 active:brightness-95 text-white px-6 flex items-center justify-center gap-2 flex-shrink-0 transition-all font-bold text-sm rounded-r-xl shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-b from-blue-50/40 to-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push('/')}
              className="p-2 bg-white border border-blue-100 hover:border-blue-300 rounded-xl transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {fromName} <ChevronRight className="w-5 h-5 text-blue-400" /> {toName}
              </h1>
              <p className="text-sm text-gray-400">
                {count} {travelType === 'flights' ? 'flights' : 'buses'} · {displayDate}
              </p>
            </div>
          </div>

          {travelType === 'flights' ? (
            <FlightSearchResultsView flightResults={dynamicFlightResults} />
          ) : (
            <BusSearchResultsView
              busResults={dynamicBusResults}
              fromCity={fromCity}
              toCity={toCity}
              date={date}
              onModalOpenChange={setIsBusModalOpen}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">Loading results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
