'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  SlidersHorizontal,
  Plane,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  Briefcase,
  Star,
  Zap,
  Wind,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────
export interface FlightResult {
  id: number;
  airline: string;
  flightNo: string;
  departure: string;
  arrival: string;
  duration: string;
  fromCode: string;
  toCode: string;
  price: number;          // our early-booked price
  marketPrice: number;    // what other platforms charge near departure
  bookedDaysAhead: number;
  stops: 0 | 1 | 2;
  layover: string;
  deals: number;
  cabinBag: boolean;
  checkedBag: boolean;
  refundable: boolean;
  airline_rating: number;
  rating_reviews: number;
  seatClass: 'Economy' | 'Business' | 'Premium Economy';
}

interface FlightFilters {
  direct: boolean;
  oneStop: boolean;
  twoPlusStops: boolean;
  cabinBag: boolean;
  checkedBag: boolean;
  refundable: boolean;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
  minRating: number;
  airlines: string[];
}

const defaultFlightFilters: FlightFilters = {
  direct: false,
  oneStop: false,
  twoPlusStops: false,
  cabinBag: false,
  checkedBag: false,
  refundable: false,
  morning: false,
  afternoon: false,
  evening: false,
  night: false,
  minRating: 0,
  airlines: [],
};

interface FlightSearchResultsViewProps {
  flightResults: FlightResult[];
}

// ── Airline logo placeholder ──────────────────────────────────
const AIRLINE_COLORS: Record<string, string> = {
  IndiGo: 'from-blue-500 to-cyan-500',
  'Air India': 'from-rose-500 to-orange-500',
  'Air India Express': 'from-orange-400 to-cyan-500',
  SpiceJet: 'from-red-400 to-pink-500',
  Vistara: 'from-sky-500 to-cyan-500',
};

function AirlineBadge({ airline }: { airline: string }) {
  const initials = airline.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const gradient = AIRLINE_COLORS[airline] ?? 'from-sky-500 to-cyan-500';
  return (
    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}

// ── Stop dot indicator ────────────────────────────────────────
function StopDots({ stops }: { stops: 0 | 1 | 2 }) {
  if (stops === 0) return null;
  return (
    <div className="flex gap-1 justify-center mt-1">
      {Array.from({ length: stops }).map((_, i) => (
        <div key={i} className="w-1 h-1 rounded-full bg-amber-400" />
      ))}
    </div>
  );
}

// ── Flight Card ───────────────────────────────────────────────
function FlightCard({ flight }: { flight: FlightResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-blue-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200"
    >
      {/* Main body */}
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-5">

          {/* Left: airline + flight timeline */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AirlineBadge airline={flight.airline} />
                <div>
                  <p className="text-[14px] font-bold text-slate-900 leading-tight">{flight.airline}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{flight.flightNo} · {flight.seatClass}</p>
                </div>
              </div>

              {/* Rating pill */}
              <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white text-xs font-bold flex-shrink-0 ml-3
                ${flight.airline_rating >= 4.3 ? 'bg-blue-500' : flight.airline_rating >= 3.5 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                <Star className="w-3 h-3 fill-white" /> {flight.airline_rating}
                <span className="text-[10px] font-medium opacity-80">({flight.rating_reviews})</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 leading-none">{flight.departure}</div>
                <div className="text-[11px] font-bold text-blue-500 mt-1">{flight.fromCode}</div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1 text-[10px] text-blue-400 font-semibold">
                  <Clock className="w-3 h-3" /> {flight.duration}
                </div>
                <div className="flex items-center w-full gap-1.5">
                  <div className="h-px flex-1 bg-blue-200" />
                  <Plane className="w-3.5 h-3.5 text-blue-400 -rotate-0" />
                  <div className="h-px flex-1 bg-blue-200" />
                </div>
                <div className="text-[10px] text-gray-400 font-medium">
                  {flight.stops === 0 ? (
                    <span className="text-emerald-600 font-semibold">Non-stop</span>
                  ) : (
                    <span className="text-amber-600 font-semibold">{flight.layover}</span>
                  )}
                </div>
                <StopDots stops={flight.stops} />
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 leading-none">{flight.arrival}</div>
                <div className="text-[11px] font-bold text-blue-500 mt-1">{flight.toCode}</div>
              </div>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5">
              {flight.cabinBag && (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                  <Briefcase className="w-2.5 h-2.5" /> Cabin bag
                </span>
              )}
              {flight.checkedBag && (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                  <Wind className="w-2.5 h-2.5" /> Checked bag
                </span>
              )}
              {flight.refundable && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-2.5 h-2.5" /> Refundable
                </span>
              )}
              {flight.stops === 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  <Zap className="w-2.5 h-2.5" /> Direct flight
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px self-stretch bg-blue-100" />

          {/* Right: price + CTA */}
          <div className="md:w-44 flex flex-row md:flex-col items-center md:items-end justify-between gap-3">
            
            {/* Pricing */}
            <div className="text-right mt-auto md:mt-0">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-[12px] text-gray-400 line-through">₹{flight.marketPrice.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-gray-400">elsewhere</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 leading-none">₹{flight.price.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">on Onlyy</div>
            </div>

            {/* Deals count */}
            <div className="text-[11px] text-gray-400 text-right">
              {flight.deals} deal{flight.deals > 1 ? 's' : ''} available
            </div>

            {/* CTA */}
            <button className="w-full md:w-auto bg-gradient-button hover:brightness-105 active:scale-95 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-200 whitespace-nowrap flex items-center gap-1.5 justify-center">
              Book Flight <ChevronRight className="w-4 h-4" />
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
            <span>Fare details</span>
            <span>Baggage policy</span>
            <span>Cancellation</span>
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded fare breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-blue-50"
          >
            <div className="p-5 grid md:grid-cols-3 gap-5 bg-blue-50/40">
              {/* Fare breakdown */}
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Fare Breakdown</p>
                <div className="space-y-1.5 text-[12px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Base fare</span>
                    <span className="font-semibold">₹{Math.round(flight.price * 0.75).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & fees</span>
                    <span className="font-semibold">₹{Math.round(flight.price * 0.25).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-100 pt-1.5 font-bold text-blue-600">
                    <span>Total</span>
                    <span>₹{flight.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Baggage */}
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Baggage Allowance</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-[12px] text-slate-600">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${flight.cabinBag ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                    Cabin bag {flight.cabinBag ? '(7 kg included)' : '(not included)'}
                  </li>
                  <li className="flex items-center gap-2 text-[12px] text-slate-600">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${flight.checkedBag ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                    Checked bag {flight.checkedBag ? '(15 kg included)' : '(add-on required)'}
                  </li>
                </ul>
              </div>

              {/* Cancellation */}
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Cancellation Policy</p>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-700">Domestic</p>
                  <ul className="space-y-1 text-[12px] text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      15+ days: 70% refund
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      7-15 days: 50% refund
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      2-7 days: 25% refund
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                      Within 48 hours: no refund
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Filter check ──────────────────────────────────────────────
function FilterCheck({
  label,
  checked,
  onToggle,
  hint,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  hint?: string;
}) {
  return (
    <label
      className="flex items-start justify-between py-2 cursor-pointer group select-none"
      onClick={onToggle}
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
          ${checked ? 'bg-gradient-button border-transparent' : 'border-gray-300 group-hover:border-cyan-400'}`}>
          {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <div>
          <span className="text-[13px] text-slate-700 block">{label}</span>
          {hint && <span className="text-[11px] text-gray-400">from ₹{hint}</span>}
        </div>
      </div>
    </label>
  );
}

// ── Filter panel ──────────────────────────────────────────────
function FlightFilterPanel({
  filters,
  set,
  toggleAirline,
  onReset,
}: {
  filters: FlightFilters;
  set: (k: keyof FlightFilters, v: boolean | string[] | number) => void;
  toggleAirline: (a: string) => void;
  onReset: () => void;
}) {
  const airlines = ['IndiGo', 'Air India', 'Air India Express', 'SpiceJet', 'Vistara'];

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
        {/* Stops */}
        <div className="pb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stops</p>
          <FilterCheck label="Direct" checked={filters.direct} onToggle={() => set('direct', !filters.direct)} hint="4,599" />
          <FilterCheck label="1 stop" checked={filters.oneStop} onToggle={() => set('oneStop', !filters.oneStop)} hint="5,601" />
          <FilterCheck label="2+ stops" checked={filters.twoPlusStops} onToggle={() => set('twoPlusStops', !filters.twoPlusStops)} hint="5,890" />
        </div>

        {/* Baggage */}
        <div className="py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Baggage</p>
          <FilterCheck label="Cabin bag included" checked={filters.cabinBag} onToggle={() => set('cabinBag', !filters.cabinBag)} />
          <FilterCheck label="Checked bag included" checked={filters.checkedBag} onToggle={() => set('checkedBag', !filters.checkedBag)} />
          <FilterCheck label="Refundable only" checked={filters.refundable} onToggle={() => set('refundable', !filters.refundable)} />
        </div>

        {/* Departure time */}
        <div className="py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Departure time</p>
          <FilterCheck label="Morning (06:00–11:59)" checked={filters.morning} onToggle={() => set('morning', !filters.morning)} />
          <FilterCheck label="Afternoon (12:00–17:59)" checked={filters.afternoon} onToggle={() => set('afternoon', !filters.afternoon)} />
          <FilterCheck label="Evening (18:00–23:59)" checked={filters.evening} onToggle={() => set('evening', !filters.evening)} />
          <FilterCheck label="Night (00:00–05:59)" checked={filters.night} onToggle={() => set('night', !filters.night)} />
        </div>

        {/* Min Rating */}
        <div className="py-3">
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

        {/* Airlines */}
        <div className="pt-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Airlines</p>
          {airlines.map(a => (
            <FilterCheck
              key={a} label={a}
              checked={filters.airlines.includes(a)}
              onToggle={() => toggleAirline(a)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Duration to minutes helper ────────────────────────────────
function toMinutes(dur: string) {
  const h = dur.match(/(\d+)h/);
  const m = dur.match(/(\d+)m/);
  return Number(h?.[1] || 0) * 60 + Number(m?.[1] || 0);
}

// ── Main export ───────────────────────────────────────────────
export default function FlightSearchResultsView({ flightResults }: FlightSearchResultsViewProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'cheapest' | 'fastest' | 'saving'>('saving');
  const [filters, setFilters] = useState<FlightFilters>(defaultFlightFilters);

  const set = (k: keyof FlightFilters, v: boolean | string[] | number) =>
    setFilters(prev => ({ ...prev, [k]: v }));

  const toggleAirline = (a: string) =>
    setFilters(prev => ({
      ...prev,
      airlines: prev.airlines.includes(a)
        ? prev.airlines.filter(x => x !== a)
        : [...prev.airlines, a],
    }));
  const resetFilters = () => setFilters(defaultFlightFilters);

  const filtered = flightResults
    .filter(f => {
      const hasStop = filters.direct || filters.oneStop || filters.twoPlusStops;
      if (hasStop) {
        const ok = (filters.direct && f.stops === 0) ||
          (filters.oneStop && f.stops === 1) ||
          (filters.twoPlusStops && f.stops >= 2);
        if (!ok) return false;
      }
      if (filters.cabinBag && !f.cabinBag) return false;
      if (filters.checkedBag && !f.checkedBag) return false;
      if (filters.refundable && !f.refundable) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) return false;
      if (filters.minRating > 0 && f.airline_rating < filters.minRating) return false;

      const h = Number(f.departure.split(':')[0]);
      const hasDep = filters.morning || filters.afternoon || filters.evening || filters.night;
      if (hasDep) {
        const ok =
          (filters.morning && h >= 6 && h < 12) ||
          (filters.afternoon && h >= 12 && h < 18) ||
          (filters.evening && h >= 18) ||
          (filters.night && h < 6);
        if (!ok) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'cheapest') return a.price - b.price;
      if (sortBy === 'fastest') return toMinutes(a.duration) - toMinutes(b.duration);
      if (sortBy === 'saving') return (b.marketPrice - b.price) / b.marketPrice - (a.marketPrice - a.price) / a.marketPrice;
      return b.airline_rating - a.airline_rating;
    });

  return (
    <div className="flex gap-5">
      {/* Sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0">
        <FlightFilterPanel filters={filters} set={set} toggleAirline={toggleAirline} onReset={resetFilters} />
      </div>

      {/* Results */}
      <div className="flex-1 min-w-0">
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-white border border-blue-100 rounded-xl p-1 shadow-sm overflow-x-auto">
            {([
              { key: 'saving', label: 'Best savings' },
              { key: 'rating', label: 'Rating' },
              { key: 'cheapest', label: 'Cheapest' },
              { key: 'fastest', label: 'Fastest' },
            ] as const).map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
                  ${sortBy === s.key ? 'bg-gradient-button text-white shadow-sm' : 'text-gray-500 hover:text-slate-900'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Mobile filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden mb-4"
          >
              <FlightFilterPanel filters={filters} set={set} toggleAirline={toggleAirline} onReset={resetFilters} />
          </motion.div>
        )}
      </AnimatePresence>

        {/* Flight list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-blue-100">
            <Plane className="w-12 h-12 mx-auto text-blue-200 mb-3" />
            <p className="font-bold text-slate-700">No flights match your filters</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting the filters on the left</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((flight, idx) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <FlightCard flight={flight} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
