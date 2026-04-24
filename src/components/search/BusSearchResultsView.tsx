'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  Zap,
  Coffee,
  Tv,
  Wind,
  Star,
  Clock,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Bus,
  SlidersHorizontal,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import BusDetailsModal from '@/components/search/BusDetailsModal';

export interface BusResult {
  id: number;
  operator: string;
  busType: string;
  layout: string;
  seatLayout?: string;
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

interface Filters {
  ac: boolean;
  sleeper: boolean;
  freeCancellation: boolean;
  liveTracking: boolean;
  singleSeats: boolean;
  morning: boolean;
  evening: boolean;
  night: boolean;
  minRating: number;
}

const defaultFilters: Filters = {
  ac: false,
  sleeper: false,
  freeCancellation: false,
  liveTracking: false,
  singleSeats: false,
  morning: false,
  evening: false,
  night: false,
  minRating: 0,
};

interface BusSearchResultsViewProps {
  busResults: BusResult[];
  fromCity: string;
  toCity: string;
  date: string;
  onModalOpenChange?: (open: boolean) => void;
}

function Amenity({ type }: { type: string }) {
  const map: Record<string, { icon: ReactNode; label: string }> = {
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

function BusCard({ bus, onBook }: { bus: BusResult; onBook: (b: BusResult) => void }) {
  const [expanded, setExpanded] = useState(false);
  const urgency = bus.availableSeats <= 3;

  return (
    <motion.div layout className="bg-white rounded-2xl border border-blue-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200">
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">{bus.operator}</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">{bus.busType} · {bus.layout}</p>
              </div>
              <div
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white text-xs font-bold flex-shrink-0 ml-3 ${
                  bus.rating >= 4.3 ? 'bg-blue-500' : bus.rating >= 3.5 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              >
                <Star className="w-3 h-3 fill-white" /> {bus.rating}
                <span className="font-normal opacity-70 text-[10px]">({bus.reviews})</span>
              </div>
            </div>

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

            {bus.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {bus.amenities.map((a) => (
                  <Amenity key={a} type={a} />
                ))}
              </div>
            )}

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
                <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">
                  Sleeper
                </span>
              )}
            </div>
          </div>

          <div className="hidden md:block w-px self-stretch bg-blue-100" />

          <div className="md:w-44 flex flex-row md:flex-col items-center md:items-end justify-center md:justify-between gap-3 pt-2">
            <div className="text-right w-full md:w-auto">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-[12px] text-gray-400 line-through">₹{bus.marketPrice}</span>
                <span className="text-[10px] text-gray-400">elsewhere</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 leading-none">₹{bus.ourPrice}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">on Onlyy</div>
            </div>

            <div className={`text-[11px] font-semibold text-right ${urgency ? 'text-rose-500' : 'text-gray-400'} hidden md:block`}>
              {urgency ? `Only ${bus.availableSeats} left` : `${bus.availableSeats} seats`}
              {bus.singleSeats > 0 && <span className="text-blue-400 block">{bus.singleSeats} single</span>}
            </div>

            <button
              onClick={() => onBook(bus)}
              className="w-full md:w-auto bg-gradient-button hover:brightness-105 active:brightness-95 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm whitespace-nowrap flex items-center gap-1.5 justify-center"
            >
              Select Seats <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-2.5 text-[12px] text-blue-500 hover:text-blue-700 font-semibold transition-colors hover:bg-blue-50"
        >
          <span className="flex gap-5">
            <span>Boarding & Dropping</span>
            <span>Bus Details</span>
            <span>Cancellation</span>
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-blue-50"
          >
            <div className="p-5 grid md:grid-cols-2 gap-5 bg-blue-50/40">
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Boarding Points</p>
                <ul className="space-y-1.5">
                  {bus.boardingPoints.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-[12px] text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Dropping Points</p>
                <ul className="space-y-1.5">
                  {bus.droppingPoints.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-[12px] text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Cancellation Policy</p>
                <ul className="space-y-1.5 text-[12px] text-slate-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    Cancel 7+ days before: 80% refund
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    Cancel 3-7 days before: 50% refund
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    Cancel 1-3 days before: 20% refund
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    Within 24 hours: no refund
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
        layout: bus.seatLayout,
      }}
    />
  );
}

function BusFilterCheck({
  label,
  checked,
  count,
  onToggle,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer group select-none" onClick={onToggle}>
      <div className="flex items-center gap-2.5">
        <div
          className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${
            checked ? 'bg-gradient-button border-transparent' : 'border-gray-300 group-hover:border-cyan-400'
          }`}
        >
          {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <span className="text-[13px] text-slate-700">{label}</span>
      </div>
      {count !== undefined && <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>}
    </label>
  );
}

function FilterPanel({
  filters,
  set,
  onReset,
}: {
  filters: Filters;
  set: (k: keyof Filters, v: boolean | number) => void;
  onReset: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-blue-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          <h2 className="font-bold text-slate-900 text-sm">Filters</h2>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="p-4 divide-y divide-gray-100">
        <div className="pb-3">
          <BusFilterCheck label="AC" checked={filters.ac} count={5} onToggle={() => set('ac', !filters.ac)} />
          <BusFilterCheck label="Sleeper" checked={filters.sleeper} count={4} onToggle={() => set('sleeper', !filters.sleeper)} />
          <BusFilterCheck
            label="Free Cancellation"
            checked={filters.freeCancellation}
            count={2}
            onToggle={() => set('freeCancellation', !filters.freeCancellation)}
          />
          <BusFilterCheck
            label="Live Tracking"
            checked={filters.liveTracking}
            count={4}
            onToggle={() => set('liveTracking', !filters.liveTracking)}
          />
          <BusFilterCheck
            label="Single Seats"
            checked={filters.singleSeats}
            count={4}
            onToggle={() => set('singleSeats', !filters.singleSeats)}
          />
        </div>
        <div className="py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Departure time</p>
          <BusFilterCheck label="Morning (6am-12pm)" checked={filters.morning} onToggle={() => set('morning', !filters.morning)} />
          <BusFilterCheck label="Evening (6pm-midnight)" checked={filters.evening} onToggle={() => set('evening', !filters.evening)} />
          <BusFilterCheck label="Night (12am-6am)" checked={filters.night} onToggle={() => set('night', !filters.night)} />
        </div>
        <div className="pt-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rating</p>
          <div className="flex gap-1.5">
            {[4.5, 4, 3.5, 3].map((r) => (
              <button
                key={r}
                onClick={() => set('minRating', filters.minRating === r ? 0 : r)}
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-colors ${
                  filters.minRating === r ? 'bg-gradient-button text-white border-transparent' : 'border-gray-200 text-gray-600 hover:border-cyan-400'
                }`}
              >
                {r}+
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusSearchResultsView({
  busResults,
  fromCity,
  toCity,
  date,
  onModalOpenChange,
}: BusSearchResultsViewProps) {
  const [selectedBus, setSelectedBus] = useState<BusResult | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'departure'>('price');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    onModalOpenChange?.(selectedBus !== null);
  }, [selectedBus, onModalOpenChange]);

  const setFilter = (k: keyof Filters, v: boolean | number) => setFilters((prev) => ({ ...prev, [k]: v }));
  const resetFilters = () => setFilters(defaultFilters);

  const filtered = busResults
    .filter((b) => {
      if (filters.ac && !b.isAC) return false;
      if (filters.sleeper && !b.isSleeper) return false;
      if (filters.freeCancellation && !b.freeCancellation) return false;
      if (filters.liveTracking && !b.liveTracking) return false;
      if (filters.singleSeats && b.singleSeats === 0) return false;
      if (filters.minRating > 0 && b.rating < filters.minRating) return false;
      const h = parseInt(b.departure.split(':')[0], 10);
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

  return (
    <>
      <div className="flex gap-5">
        <div className="hidden md:block w-52 flex-shrink-0">
          <FilterPanel filters={filters} set={setFilter} onReset={resetFilters} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 bg-white border border-blue-100 rounded-xl p-1 shadow-sm overflow-x-auto">
              {([
                { key: 'price', label: 'Price' },
                { key: 'rating', label: 'Rating' },
                { key: 'departure', label: 'Departure' },
              ] as const).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    sortBy === s.key ? 'bg-gradient-button text-white shadow-sm' : 'text-gray-500 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden md:hidden mb-4"
              >
                <FilterPanel filters={filters} set={setFilter} onReset={resetFilters} />
              </motion.div>
            )}
          </AnimatePresence>

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

      <AnimatePresence>
        {selectedBus && (
          <SeatModal bus={selectedBus} onClose={() => setSelectedBus(null)} fromCity={fromCity} toCity={toCity} travelDate={date} />
        )}
      </AnimatePresence>
    </>
  );
}
