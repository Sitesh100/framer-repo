'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Plane,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Briefcase,
  Star,
  Bell,
  Building2,
  Check,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
export interface FlightResult {
  id: number;
  airline: string;
  flightNo: string;
  departure: string;
  arrival: string;
  duration: string;
  fromCode: string;
  toCode: string;
  price: number;
  marketPrice: number;
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
  onBookFlight?: (flight: FlightResult) => void;
}

// ── Airline Badge (initials in blue/white) ────────────────────
function AirlineBadge({ airline }: { airline: string }) {
  const initials = airline.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0770e3] to-[#0B1F3A] text-white text-sm font-black flex items-center justify-center shrink-0 shadow-sm">
      {initials}
    </div>
  );
}

// ── Flight Card (Skyscanner-style) ────────────────────────────
function FlightCard({ flight, onBookFlight }: { flight: FlightResult; onBookFlight?: (flight: FlightResult) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#0770e3]/40 hover:shadow-[#0770e3]/10 transition-all duration-200"
    >
      <div className="p-5">
        {/* Top row — full horizontal layout matching Skyscanner */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 items-center">

          {/* Left: airline */}
          <div className="flex items-center gap-3 md:w-[180px]">
            <AirlineBadge airline={flight.airline} />
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-slate-900 leading-tight truncate">{flight.airline}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{flight.flightNo} · {flight.seatClass}</p>
              <div className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded bg-[#0770e3] text-white text-[10px] font-bold">
                <Star className="w-2.5 h-2.5 fill-white" />
                {flight.airline_rating}
                <span className="text-[9px] font-medium opacity-80">({flight.rating_reviews})</span>
              </div>
            </div>
          </div>

          {/* Middle: timeline — gets the lion's share of space */}
          <div className="flex items-center gap-4 md:gap-6 min-w-0 px-2">
            {/* Departure */}
            <div className="text-left shrink-0">
              <div className="text-[28px] font-bold text-slate-900 leading-none tabular-nums">{flight.departure}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1.5">{flight.fromCode}</div>
            </div>

            {/* Route line */}
            <div className="flex-1 flex flex-col items-center min-w-0">
              <div className="text-[11px] text-slate-500 font-semibold mb-1 whitespace-nowrap">{flight.duration}</div>
              <div className="relative w-full flex items-center">
                <div className="h-px flex-1 bg-slate-300" />
                <Plane className="w-4 h-4 text-[#0770e3] mx-1 shrink-0" />
                <div className="h-px flex-1 bg-slate-300" />
              </div>
              <div className="text-[11px] font-semibold mt-1 whitespace-nowrap truncate max-w-full">
                {flight.stops === 0 ? (
                  <span className="text-[#0770e3]">Direct</span>
                ) : (
                  <span className="text-slate-500">{flight.stops} stop · {flight.layover.replace(`${flight.stops} stop via `, 'via ')}</span>
                )}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-right shrink-0">
              <div className="text-[28px] font-bold text-slate-900 leading-none tabular-nums">{flight.arrival}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1.5">{flight.toCode}</div>
            </div>
          </div>

          {/* Right: price + CTA */}
          <div className="flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-center gap-3 md:gap-1 md:w-[180px] md:pl-5 md:border-l md:border-slate-200">
            <div className="md:text-right">
              <p className="text-[11px] text-slate-500 mb-0.5">{flight.deals} deals from</p>
              <div className="text-2xl font-bold text-[#0770e3] leading-none tabular-nums whitespace-nowrap">
                ₹{flight.price.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-through">₹{flight.marketPrice.toLocaleString('en-IN')}</p>
            </div>

            <motion.button
              onClick={() => onBookFlight?.(flight)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-0 md:mt-2 bg-[#0770e3] hover:bg-[#0561c7] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-[#0770e3]/20 whitespace-nowrap flex items-center gap-1.5 justify-center"
            >
              Select <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mt-4 md:ml-[200px]">
          {flight.cabinBag && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded-md font-semibold">
              <Briefcase className="w-3 h-3" /> Cabin bag
            </span>
          )}
          {flight.checkedBag && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded-md font-semibold">
              <Briefcase className="w-3 h-3" /> Checked bag
            </span>
          )}
          {flight.refundable && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#0770e3] bg-blue-50 border border-blue-100 px-2 py-1 rounded-md font-semibold">
              <ShieldCheck className="w-3 h-3" /> Refundable
            </span>
          )}
        </div>
      </div>

      {/* Expand row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-2.5 text-[12px] text-[#0770e3] hover:text-[#0561c7] font-semibold transition-colors hover:bg-blue-50/50 border-t border-slate-100"
      >
        <span className="flex gap-5">
          <span>Fare details</span>
          <span>Baggage policy</span>
          <span>Cancellation</span>
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="p-5 grid md:grid-cols-3 gap-5 bg-blue-50/40">
              <div>
                <p className="text-[11px] font-bold text-[#0770e3] uppercase tracking-wider mb-2">Fare Breakdown</p>
                <div className="space-y-1.5 text-[12px] text-slate-700">
                  <div className="flex justify-between">
                    <span>Base fare</span>
                    <span className="font-semibold">₹{Math.round(flight.price * 0.75).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & fees</span>
                    <span className="font-semibold">₹{Math.round(flight.price * 0.25).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-100 pt-1.5 font-bold text-[#0770e3]">
                    <span>Total</span>
                    <span>₹{flight.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#0770e3] uppercase tracking-wider mb-2">Baggage Allowance</p>
                <ul className="space-y-1.5 text-[12px] text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${flight.cabinBag ? 'bg-[#0770e3]' : 'bg-slate-300'}`} />
                    Cabin bag {flight.cabinBag ? '(7 kg included)' : '(not included)'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${flight.checkedBag ? 'bg-[#0770e3]' : 'bg-slate-300'}`} />
                    Checked bag {flight.checkedBag ? '(15 kg included)' : '(add-on required)'}
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#0770e3] uppercase tracking-wider mb-2">Cancellation Policy</p>
                <ul className="space-y-1 text-[12px] text-slate-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0770e3] mt-1.5 shrink-0" />
                    15+ days: 70% refund
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0770e3] mt-1.5 shrink-0" />
                    7-15 days: 50% refund
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0770e3] mt-1.5 shrink-0" />
                    2-7 days: 25% refund
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    Within 48 hours: no refund
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

// ── Custom Checkbox ───────────────────────────────────────────
function Check2({ checked }: { checked: boolean }) {
  return (
    <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
      checked ? 'bg-[#0770e3] border-[#0770e3]' : 'bg-white border-slate-300'
    }`}>
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </div>
  );
}

function FilterRow({ label, checked, onToggle, hint }: { label: string; checked: boolean; onToggle: () => void; hint?: string }) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer group select-none" onClick={onToggle}>
      <div className="flex items-center gap-2.5">
        <Check2 checked={checked} />
        <span className="text-[13px] text-slate-700 group-hover:text-[#0770e3] transition-colors">{label}</span>
      </div>
      {hint && <span className="text-[11px] text-slate-500">from ₹{hint}</span>}
    </label>
  );
}

// ── Collapsible Section ────────────────────────────────────────
function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-slate-200 first:border-t-0 py-4 px-5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 text-[15px]">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Filter Sidebar ─────────────────────────────────────────────
function FilterSidebar({
  filters, set, toggleAirline, onReset,
}: {
  filters: FlightFilters;
  set: (k: keyof FlightFilters, v: boolean | string[] | number) => void;
  toggleAirline: (a: string) => void;
  onReset: () => void;
}) {
  const airlines = ['IndiGo', 'Air India', 'Air India Express', 'SpiceJet', 'Vistara'];

  return (
    <div className="space-y-4">
      <button className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-[#0770e3] font-semibold rounded-2xl py-3 text-sm transition-colors">
        <Bell className="w-4 h-4" /> Get Price Alerts
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0770e3]" /> Filters
          </h2>
          <button
            onClick={onReset}
            className="text-xs font-semibold text-[#0770e3] hover:text-[#0561c7] transition-colors"
          >
            Reset
          </button>
        </div>

        <Section title="Stops">
          <FilterRow label="Direct" checked={filters.direct} onToggle={() => set('direct', !filters.direct)} hint="4,599" />
          <FilterRow label="1 stop" checked={filters.oneStop} onToggle={() => set('oneStop', !filters.oneStop)} hint="5,601" />
          <FilterRow label="2+ stops" checked={filters.twoPlusStops} onToggle={() => set('twoPlusStops', !filters.twoPlusStops)} hint="5,890" />
        </Section>

        <Section title="Baggage">
          <FilterRow label="Cabin bag included" checked={filters.cabinBag} onToggle={() => set('cabinBag', !filters.cabinBag)} />
          <FilterRow label="Checked bag included" checked={filters.checkedBag} onToggle={() => set('checkedBag', !filters.checkedBag)} />
          <FilterRow label="Refundable only" checked={filters.refundable} onToggle={() => set('refundable', !filters.refundable)} />
        </Section>

        <Section title="Departure time">
          <FilterRow label="Morning (06:00–11:59)" checked={filters.morning} onToggle={() => set('morning', !filters.morning)} />
          <FilterRow label="Afternoon (12:00–17:59)" checked={filters.afternoon} onToggle={() => set('afternoon', !filters.afternoon)} />
          <FilterRow label="Evening (18:00–23:59)" checked={filters.evening} onToggle={() => set('evening', !filters.evening)} />
          <FilterRow label="Night (00:00–05:59)" checked={filters.night} onToggle={() => set('night', !filters.night)} />
        </Section>

        <Section title="Rating" defaultOpen={false}>
          <div className="flex gap-1.5">
            {[4.5, 4, 3.5, 3].map((r) => (
              <button
                key={r}
                onClick={() => set('minRating', filters.minRating === r ? 0 : r)}
                className={`flex-1 text-xs font-bold py-2 rounded-lg border transition-colors ${
                  filters.minRating === r ? 'bg-[#0770e3] text-white border-[#0770e3]' : 'border-slate-200 text-slate-600 hover:border-[#0770e3]'
                }`}
              >
                {r}+
              </button>
            ))}
          </div>
        </Section>

        <Section title="Airlines" defaultOpen={false}>
          {airlines.map(a => (
            <FilterRow
              key={a} label={a}
              checked={filters.airlines.includes(a)}
              onToggle={() => toggleAirline(a)}
            />
          ))}
        </Section>
      </div>
    </div>
  );
}

// ── Duration helper ───────────────────────────────────────────
function toMinutes(dur: string) {
  const h = dur.match(/(\d+)h/);
  const m = dur.match(/(\d+)m/);
  return Number(h?.[1] || 0) * 60 + Number(m?.[1] || 0);
}

// ── Side Promo Card (hotel CTA) ───────────────────────────────
function HotelPromoCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hidden xl:block">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-7 h-7 rounded-full bg-[#0770e3] flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div className="w-7 h-7 -ml-2 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white text-[10px] font-bold">B</div>
        <div className="w-7 h-7 -ml-2 rounded-full bg-blue-200 flex items-center justify-center text-[#0770e3] text-[10px] font-bold">H</div>
      </div>
      <p className="font-bold text-slate-900 text-base leading-snug mb-2">Found flights? Now find a hotel</p>
      <p className="text-[12px] text-slate-500 mb-4">Get results from all the top hotel sites right here on Onlyy.</p>
      <button className="w-full bg-[#0B1F3A] hover:bg-[#16335c] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
        Explore hotels
      </button>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────
export default function FlightSearchResultsView({ flightResults, onBookFlight }: FlightSearchResultsViewProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'best' | 'cheapest' | 'fastest'>('best');
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

  const filtered = useMemo(() => flightResults
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
      // best = ratio of savings, weighted by rating
      return (b.marketPrice - b.price) / b.marketPrice - (a.marketPrice - a.price) / a.marketPrice;
    }), [flightResults, filters, sortBy]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return { best: 0, cheapest: 0, fastest: 0, bestDuration: '—', cheapestDuration: '—', fastestDuration: '—' };
    const cheapest = [...filtered].sort((a, b) => a.price - b.price)[0];
    const fastest = [...filtered].sort((a, b) => toMinutes(a.duration) - toMinutes(b.duration))[0];
    const best = filtered[0];
    return {
      best: best.price,
      cheapest: cheapest.price,
      fastest: fastest.price,
      bestDuration: best.duration,
      cheapestDuration: cheapest.duration,
      fastestDuration: fastest.duration,
    };
  }, [filtered]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_280px] gap-5">
      {/* Sidebar */}
      <aside className="hidden lg:block sticky top-[180px] self-start">
        <FilterSidebar filters={filters} set={set} toggleAirline={toggleAirline} onReset={resetFilters} />
      </aside>

      {/* Results */}
      <div className="min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-700">
            <span className="font-bold text-slate-900">{filtered.length} results</span> sorted by{' '}
            <span className="font-semibold capitalize">{sortBy}</span>
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-1.5 text-sm font-semibold text-[#0770e3] bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl"
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
              className="overflow-hidden lg:hidden mb-4"
            >
              <FilterSidebar filters={filters} set={set} toggleAirline={toggleAirline} onReset={resetFilters} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort tabs (Skyscanner style: 3 boxes, big) */}
        <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-4">
          {([
            { key: 'best', label: 'Best', price: stats.best, dur: stats.bestDuration },
            { key: 'cheapest', label: 'Cheapest', price: stats.cheapest, dur: stats.cheapestDuration },
            { key: 'fastest', label: 'Fastest', price: stats.fastest, dur: stats.fastestDuration },
          ] as const).map((s, idx) => {
            const active = sortBy === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`relative text-left px-4 py-3.5 transition-colors ${
                  idx > 0 ? 'border-l border-slate-200' : ''
                } ${active ? 'bg-[#0B1F3A] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${active ? 'text-white/70' : 'text-slate-500'}`}>
                  {s.label}
                </p>
                <p className="text-lg font-bold tabular-nums leading-none">
                  ₹{s.price.toLocaleString('en-IN')}
                </p>
                <p className={`text-[11px] mt-1 ${active ? 'text-white/70' : 'text-slate-500'}`}>{s.dur}</p>
              </button>
            );
          })}
        </div>

        {/* Sponsored banner */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#0770e3] to-[#0561c7] rounded-2xl p-4 mb-4 flex items-center justify-between text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Up to ₹1000 OFF on first booking</p>
                <p className="text-[12px] text-white/85">Use code: <span className="font-semibold">ONLYYNEW</span> · 15% extra OFF on Login</p>
              </div>
            </div>
            <span className="text-[10px] text-white/60 hidden sm:block">Sponsored</span>
          </motion.div>
        )}

        {/* Flight list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Plane className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No flights match your filters</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting filters in the sidebar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((flight, idx) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
              >
                <FlightCard flight={flight} onBookFlight={onBookFlight} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Right rail (hotel promo) */}
      <aside className="hidden xl:block sticky top-[180px] self-start">
        <HotelPromoCard />
      </aside>
    </div>
  );
}

// Date carousel exported for SearchResults top bar (not used inline above)
export function FlightDateCarousel({
  selectedDate, onSelect,
}: { selectedDate: string; onSelect: (d: string) => void }) {
  const days = useMemo(() => {
    const base = new Date(selectedDate + 'T00:00:00');
    const list: { iso: string; label: string; sub: string; price: number; cheap: boolean }[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const price = 4500 + Math.round(Math.abs(i) * 150 + ((i + 3) * 73) % 400);
      list.push({
        iso,
        label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        sub: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        price,
        cheap: i === -3 || i === 2,
      });
    }
    return list;
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        const active = d.iso === selectedDate;
        return (
          <button
            key={d.iso}
            onClick={() => onSelect(d.iso)}
            className={`relative rounded-xl px-2 py-2.5 transition-all duration-200 text-center ${
              active
                ? 'bg-[#0B1F3A] text-white shadow-md'
                : d.cheap
                  ? 'bg-emerald-50 text-slate-700 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <div className={`text-[11px] font-semibold ${active ? 'text-white/75' : 'text-slate-500'}`}>{d.sub}</div>
            <div className="text-sm font-bold leading-tight">{d.label}</div>
            <div className={`text-[11px] mt-1 tabular-nums ${active ? 'text-white' : 'text-[#0770e3] font-semibold'}`}>
              ₹{d.price.toLocaleString('en-IN')}
            </div>
            {d.cheap && !active && (
              <Star className="absolute top-1 right-1 w-3 h-3 text-emerald-500 fill-emerald-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
