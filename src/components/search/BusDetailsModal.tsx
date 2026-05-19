'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Star, Wifi, Zap, Coffee,
  Wind, MapPin, Clock, Shield, AlertCircle, Users,
  Package, PawPrint, Beer, Bus, CheckCircle2, TrendingDown, CircleX,
} from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

// ── Types ─────────────────────────────────────────────────────
export interface BusModalProps {
  bus: {
    id: number;
    name: string;
    rating: number;
    reviews: number;
    departure: string;
    arrival: string;
    duration: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    seats: number;
    amenities: string[];
    bookingDate: string;
    saleWindow: string;
    fromCity: string;
    toCity: string;
    boardingPoints: string[];
    droppingPoints: string[];
    layout?: string;
    busType?: string;
  };
  onClose: () => void;
}

// ── Seat SVG icons (seater + sleeper) ────────────────────────
function SeaterIcon({ color }: { color: 'available' | 'selected' | 'sold' | 'female' }) {
  const fill =
    color === 'available' ? '#16a34a' :
    color === 'selected'  ? '#0ea5e9' : // Updated to match gradient theme
    color === 'female'    ? '#ec4899' : '#d1d5db';
  const stroke =
    color === 'available' ? '#15803d' :
    color === 'selected'  ? '#0284c7' :
    color === 'female'    ? '#db2777' : '#9ca3af';

  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      {/* Seat back */}
      <rect x="4" y="4" width="28" height="18" rx="4" fill={fill} stroke={stroke} strokeWidth="2"/>
      {/* Seat base */}
      <rect x="4" y="20" width="28" height="8" rx="3" fill={fill} stroke={stroke} strokeWidth="2"/>
      {/* Left armrest */}
      <rect x="1" y="18" width="4" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5"/>
      {/* Right armrest */}
      <rect x="31" y="18" width="4" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5"/>
    </svg>
  );
}

function SleeperIcon({ color }: { color: 'available' | 'selected' | 'sold' | 'female' }) {
  const fill =
    color === 'available' ? '#16a34a' :
    color === 'selected'  ? '#0ea5e9' :
    color === 'female'    ? '#ec4899' : '#d1d5db';
  const stroke =
    color === 'available' ? '#15803d' :
    color === 'selected'  ? '#0284c7' :
    color === 'female'    ? '#db2777' : '#9ca3af';

  return (
    <svg width="18" height="34" viewBox="0 0 24 44" fill="none">
      {/* Bed rectangle */}
      <rect x="1" y="1" width="22" height="38" rx="4" fill={fill} stroke={stroke} strokeWidth="2"/>
      {/* Pillow */}
      <rect x="3" y="3" width="18" height="10" rx="3" fill="white" fillOpacity="0.35"/>
      {/* Body line */}
      <line x1="4" y1="40" x2="20" y2="40" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ── Seat data generation ──────────────────────────────────────
interface SeatData {
  id: string;
  row: number;
  col: number;
  deck: 'lower' | 'upper';
  type: 'seater' | 'sleeper';
  gender: 'male' | 'female' | null; // null = available
  price: number;
}

function generateSeats(layoutType: string, price: number): SeatData[] {
  const seats: SeatData[] = [];
  const soldMale   = new Set([2, 5, 11, 14, 17]);
  const soldFemale = new Set([3, 8, 13]);

  if (layoutType === 'sleeper' || layoutType === 'double-deck') {
    // Lower deck sleepers 3 cols × 7 rows
    for (let row = 1; row <= 7; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = (row - 1) * 3 + col;
        seats.push({
          id: `L${row}${String.fromCharCode(65 + col)}`,
          row, col, deck: 'lower', type: 'sleeper',
          gender: soldFemale.has(idx) ? 'female' : soldMale.has(idx) ? 'male' : null,
          price,
        });
      }
    }
    // Upper deck sleepers 3 cols × 7 rows
    for (let row = 1; row <= 7; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = (row - 1) * 3 + col + 30;
        seats.push({
          id: `U${row}${String.fromCharCode(65 + col)}`,
          row, col, deck: 'upper', type: 'sleeper',
          gender: soldFemale.has(idx) ? 'female' : soldMale.has(idx) ? 'male' : null,
          price,
        });
      }
    }
  } else {
    // Standard seater: 4 cols × 10 rows, single deck (lower)
    for (let row = 1; row <= 10; row++) {
      for (let col = 0; col < 4; col++) {
        const idx = (row - 1) * 4 + col;
        seats.push({
          id: `${row}${String.fromCharCode(65 + col)}`,
          row, col, deck: 'lower', type: 'seater',
          gender: soldFemale.has(idx) ? 'female' : soldMale.has(idx) ? 'male' : null,
          price,
        });
      }
    }
  }
  return seats;
}

// ── Boarding time data ────────────────────────────────────────
const BOARDING_TIMES: Record<string, string> = {
  'Jaipur Bus Stand': '08:00',
  'Sindhi Camp': '08:15',
  'Laxmi Mandir Circle': '08:20',
  'Narayan Singh Circle': '08:25',
  'Sitapura': '08:40',
  'Tonk Road': '08:30',
  'Durgapura': '08:35',
  'Jaipur Central': '08:00',
};
const DROPPING_TIMES: Record<string, string> = {
  'Gurugram Sector 14': '12:35',
  'IFFCO Chowk': '12:50',
  'MG Road': '13:00',
  'Gurugram Sector 29': '12:40',
  'Sohna Road': '12:55',
  'Gurugram Bus Stand': '12:35',
  'Sector 56': '13:05',
  'Cyber City': '12:45',
};

// ── Tab list ──────────────────────────────────────────────────
const TABS = ['Cancellation policy', 'Boarding point', 'Dropping point', 'Bus route', 'Bus Features', 'Rating & reviews', 'Other Policies'] as const;
type Tab = typeof TABS[number];

// ── Main modal ────────────────────────────────────────────────
type Step = 'info' | 'seats' | 'boardpoint' | 'passenger';

interface PassengerData { name: string; age: string; gender: string; email: string }
type PaymentPayload = {
  busName: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  boardingPoint: string;
  droppingPoint: string;
  seats: string[];
  passengers: PassengerData[];
  flexiAmount: number;
  flexiSelected: boolean;
  totalPrice: number;
};

const AUTH_USER_KEY = 'onlyy-auth-user';
const FLEXI_FEE = 99;

export default function BusDetailsModal({ bus, onClose }: BusModalProps) {
  const router = useRouter();
  const layoutType = bus.layout || 'standard';
  const seats      = useRef(generateSeats(layoutType, bus.discountedPrice)).current;
  const hasTwoDecks = layoutType !== 'standard';

  const [step, setStep]           = useState<Step>('info');
  const [activeTab, setActiveTab] = useState<Tab>('Cancellation policy');
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [boarding, setBoarding]   = useState('');
  const [dropping, setDropping]   = useState('');
  const [passengers, setPassengers] = useState<Record<string, PassengerData>>({});
  const [isFlexiSelected, setIsFlexiSelected] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<PaymentPayload | null>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);

  const lowerSeats = seats.filter(s => s.deck === 'lower');
  const upperSeats = seats.filter(s => s.deck === 'upper');
  const rows       = Array.from(new Set(seats.map(s => s.row))).sort((a, b) => a - b);

  const toggle = (id: string) => {
    const seat = seats.find(s => s.id === id);
    if (!seat || seat.gender !== null) return;
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectedArr = Array.from(selected);
  const seatTotalPrice = selectedArr.length * bus.discountedPrice;
  const flexiAmount = isFlexiSelected ? FLEXI_FEE : 0;
  const totalPrice  = seatTotalPrice + flexiAmount;
  const savedAmt    = selectedArr.length * (bus.originalPrice - bus.discountedPrice);

  const setPassenger = (seat: string, field: keyof PassengerData, val: string) =>
    setPassengers(p => ({ ...p, [seat]: { ...p[seat], [field]: val } as PassengerData }));

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const savedUser = window.localStorage.getItem(AUTH_USER_KEY);
    return !!savedUser;
  };

  const goToPayment = (data: PaymentPayload) => {
    router.push(`/booking/payment?data=${encodeURIComponent(JSON.stringify(data))}`);
    onClose();
  };

  const handlePay = () => {
    const allOk = selectedArr.every(s => passengers[s]?.name && passengers[s]?.age && passengers[s]?.gender && passengers[s]?.email);
    if (!allOk) { alert('Please fill in all passenger details'); return; }
    const data: PaymentPayload = {
      busName: bus.name, from: bus.fromCity, to: bus.toCity,
      departure: bus.departure, arrival: bus.arrival, duration: bus.duration,
      originalPrice: bus.originalPrice, discountedPrice: bus.discountedPrice,
      boardingPoint: boarding, droppingPoint: dropping,
      seats: selectedArr, passengers: selectedArr.map(s => passengers[s]!),
      flexiAmount,
      flexiSelected: isFlexiSelected,
      totalPrice,
    };
    if (!isAuthenticated()) {
      setPendingPaymentData(data);
      setIsAuthModalOpen(true);
      return;
    }
    goToPayment(data);
  };

  // ── Seat grid ───────────────────────────────────────────────
  function SeatGrid({ deckSeats, deckLabel }: { deckSeats: SeatData[]; deckLabel?: string }) {
    const isSleeper = deckSeats[0]?.type === 'sleeper';
    const cols = isSleeper ? 3 : 4;
    const halfCols = Math.floor(cols / 2);

    return (
      <div className={`bg-white border border-blue-100 rounded-2xl p-4 shadow-sm ${hasTwoDecks ? 'flex-1' : 'w-full max-w-xs mx-auto'}`}>
        {/* Deck label + steering */}
        <div className="flex items-center justify-between mb-3">
          {deckLabel && <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{deckLabel}</span>}
          <div className={`${deckLabel ? '' : 'ml-auto'} w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-50`}>
            <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
          </div>
        </div>

        {/* Rows */}
        <div className={`space-y-${isSleeper ? '2' : '1.5'}`}>
          {rows.map(row => {
            const rowSeats = deckSeats.filter(s => s.row === row).sort((a, b) => a.col - b.col);
            if (rowSeats.length === 0) return null;
            const left  = rowSeats.slice(0, halfCols);
            const right = rowSeats.slice(halfCols);

            return (
              <div key={row} className="flex items-center justify-center gap-3">
                {/* Left seats */}
                <div className={`flex ${isSleeper ? 'gap-1' : 'gap-1.5'}`}>
                  {left.map(seat => {
                    const isSel  = selected.has(seat.id);
                    const isSold = seat.gender !== null;
                    const color  = isSel ? 'selected' : isSold ? (seat.gender === 'female' ? 'female' : 'sold') : 'available';
                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggle(seat.id)}
                        disabled={isSold}
                        title={isSold ? 'Sold' : `Seat ${seat.id} — ₹${seat.price}`}
                        className={`flex flex-col items-center gap-0.5 transition-transform ${!isSold ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed opacity-60'}`}
                      >
                        {seat.type === 'sleeper'
                          ? <SleeperIcon color={color} />
                          : <SeaterIcon color={color} />}
                        <span className={`text-[9px] font-bold ${isSold ? 'text-gray-400' : isSel ? 'text-cyan-600' : 'text-slate-700'}`}>
                          {isSold ? 'Sold' : `₹${seat.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Aisle */}
                <div className={`${isSleeper ? 'w-3' : 'w-4'} flex-shrink-0`} />

                {/* Right seats */}
                <div className={`flex ${isSleeper ? 'gap-1' : 'gap-1.5'}`}>
                  {right.map(seat => {
                    const isSel  = selected.has(seat.id);
                    const isSold = seat.gender !== null;
                    const color  = isSel ? 'selected' : isSold ? (seat.gender === 'female' ? 'female' : 'sold') : 'available';
                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggle(seat.id)}
                        disabled={isSold}
                        title={isSold ? 'Sold' : `Seat ${seat.id} — ₹${seat.price}`}
                        className={`flex flex-col items-center gap-0.5 transition-transform ${!isSold ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed opacity-60'}`}
                      >
                        {seat.type === 'sleeper'
                          ? <SleeperIcon color={color} />
                          : <SeaterIcon color={color} />}
                        <span className={`text-[9px] font-bold ${isSold ? 'text-gray-400' : isSel ? 'text-cyan-600' : 'text-slate-700'}`}>
                          {isSold ? 'Sold' : `₹${seat.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Info tab content ────────────────────────────────────────
  function InfoTab() {
    return (
      <div className="space-y-6">

        {/* Cancellation policy */}
        {activeTab === 'Cancellation policy' && (
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Cancellation Policy</h3>
            <div className="border border-blue-100 rounded-xl overflow-hidden mb-4">
              <div className="grid grid-cols-2 bg-blue-50/40 border-b border-blue-100">
                <div className="px-4 py-2.5 text-[12px] font-bold text-slate-600 uppercase tracking-wide">Time window</div>
                <div className="px-4 py-2.5 text-[12px] font-bold text-slate-600 uppercase tracking-wide">Refund</div>
              </div>
              {[
                { window: `7+ days before departure`, refund: '80%' },
                { window: `3–7 days before departure`, refund: '50%' },
                { window: `1–3 days before departure`, refund: '20%' },
                { window: `Within 24 hours`, refund: '0%', highlight: true },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-2 border-b border-blue-50 last:border-0 ${row.highlight ? 'bg-rose-50' : 'bg-white'}`}>
                  <div className={`px-4 py-3 text-[13px] ${row.highlight ? 'text-rose-700 font-semibold' : 'text-slate-700'}`}>{row.window}</div>
                  <div className={`px-4 py-3 text-[13px] font-bold ${row.highlight ? 'text-rose-600' : 'text-emerald-600'}`}>{row.refund}</div>
                </div>
              ))}
            </div>

            {/* Flexi protect upsell */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-bold text-blue-900">Add Flexi Protect — ₹99</p>
                <p className="text-[12px] text-blue-700 mt-0.5">Upgrade to 100% refund on cancellation anytime before departure.</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setIsFlexiSelected((prev) => !prev)}
                  className={`text-[12px] font-bold border px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    isFlexiSelected
                      ? 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700'
                      : 'text-blue-600 border-blue-300 hover:bg-blue-100 bg-white'
                  }`}
                >
                  {isFlexiSelected ? 'Added' : 'Add'}
                </button>
                {isFlexiSelected && (
                  <button
                    onClick={() => setIsFlexiSelected(false)}
                    aria-label="Remove Flexi Protect"
                    className="w-8 h-8 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                  >
                    <CircleX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
              * Cancellation charges are computed on a per seat basis. Ticket cannot be cancelled after scheduled bus departure time.
            </p>
          </div>
        )}

        {/* Boarding point */}
        {activeTab === 'Boarding point' && (
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Boarding Point</h3>
            <p className="text-[12px] text-gray-400 mb-4">{bus.fromCity}</p>
            <div className="space-y-0">
              {bus.boardingPoints.map((point, i) => {
                const time = BOARDING_TIMES[point] ?? '—';
                const isLast = i === bus.boardingPoints.length - 1;
                return (
                  <div key={point} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 mt-1 flex-shrink-0 ${isLast ? 'border-gray-300 bg-white' : 'border-blue-500 bg-blue-500'}`} />
                      {!isLast && <div className="w-0.5 flex-1 bg-blue-200 mt-1" style={{ minHeight: 36 }} />}
                    </div>
                    <div className="pb-5">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[14px] font-bold text-slate-900">{time}</span>
                        <span className="text-[10px] text-gray-400">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{point}</p>
                      <p className="text-[11px] text-gray-400">{point}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dropping point */}
        {activeTab === 'Dropping point' && (
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Dropping Point</h3>
            <p className="text-[12px] text-gray-400 mb-4">{bus.toCity}</p>
            <div className="space-y-0">
              {bus.droppingPoints.map((point, i) => {
                const time = DROPPING_TIMES[point] ?? '—';
                const isLast = i === bus.droppingPoints.length - 1;
                return (
                  <div key={point} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 mt-1 flex-shrink-0 ${isLast ? 'border-blue-500 bg-blue-500' : 'border-blue-300 bg-white'}`} />
                      {!isLast && <div className="w-0.5 flex-1 bg-blue-200 mt-1" style={{ minHeight: 36 }} />}
                    </div>
                    <div className="pb-5">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[14px] font-bold text-slate-900">{time}</span>
                        <span className="text-[10px] text-gray-400">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{point}</p>
                      <p className="text-[11px] text-gray-400">{point}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bus route */}
        {activeTab === 'Bus route' && (
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Bus Route</h3>
            <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 mb-4">
              <p className="text-[12px] text-gray-500 mb-1">245 km · {bus.duration}</p>
              <div className="flex items-center gap-2 flex-wrap text-[13px] font-semibold">
                <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{bus.fromCity}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Dausa</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{bus.toCity}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Delhi</span>
              </div>
            </div>
          </div>
        )}

        {/* Bus features */}
        {activeTab === 'Bus Features' && (
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Bus Features</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Water Bottle', 'Blankets', 'Charging Point', 'Bed Sheet', 'Reading Light', 'Emergency Exit'].map(f => (
                <span key={f} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> {f}
                </span>
              ))}
            </div>
            <h4 className="font-bold text-slate-900 mb-3">Know your seat types</h4>
            <div className="border border-blue-100 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-blue-50/40 border-b border-blue-100">
                <div className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Seat Types</div>
                <div className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Seater</div>
                <div className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Sleeper</div>
              </div>
              {[
                { label: 'Available', color: 'available' as const },
                { label: 'Selected', color: 'selected' as const },
                { label: 'Female only', color: 'female' as const },
                { label: 'Sold', color: 'sold' as const },
              ].map(row => (
                <div key={row.label} className="grid grid-cols-3 border-b border-blue-50 last:border-0 items-center bg-white">
                  <div className="px-4 py-3 text-[13px] font-medium text-slate-700">{row.label}</div>
                  <div className="px-4 py-3"><SeaterIcon color={row.color} /></div>
                  <div className="px-4 py-3"><SleeperIcon color={row.color} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ratings */}
        {activeTab === 'Rating & reviews' && (
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900">{bus.rating}</div>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(bus.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <div className="text-[11px] font-semibold text-gray-400 mt-1">{bus.reviews} ratings</div>
              </div>
              <div className="flex-1 border-l border-gray-100 pl-4">
                {[5,4,3,2,1].map(star => {
                  const pct = star === 5 ? 86 : star === 4 ? 6 : star === 3 ? 3 : star === 2 ? 2 : 3;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-gray-500 w-3">{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400 w-7 text-right font-medium">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[12px] text-emerald-700 font-semibold">Real feedback from verified travellers</span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Loved by travellers for</p>
            <div className="flex flex-wrap gap-1.5">
              {['Punctuality (131)', 'Driving (121)', 'Cleanliness (120)', 'Staff behavior (119)', 'Seat / Sleep Comfort (109)', 'AC (107)', 'Live tracking (100)'].map(tag => (
                <span key={tag} className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-medium">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Other policies */}
        {activeTab === 'Other Policies' && (
          <div className="space-y-5">
            {[
              { icon: <Users className="w-5 h-5 text-blue-500" />, title: 'Child Passenger Policy', body: 'Children above the age of 6 will need a ticket.' },
              { icon: <Package className="w-5 h-5 text-blue-500" />, title: 'Luggage Policy', body: '2 pieces of luggage per passenger free of charge. Excess baggage over 25 kg will be chargeable.' },
              { icon: <PawPrint className="w-5 h-5 text-blue-500" />, title: 'Pets Policy', body: 'Pets are not allowed on this bus.' },
              { icon: <Beer className="w-5 h-5 text-blue-500" />, title: 'Liquor Policy', body: 'Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers.' },
              { icon: <Clock className="w-5 h-5 text-blue-500" />, title: 'Pick-up Time Policy', body: 'Bus operator is not obligated to wait beyond the scheduled departure time. No refund for late arrivals.' },
            ].map(item => (
              <div key={item.title} className="flex gap-3 bg-white border border-blue-50 p-4 rounded-xl shadow-sm">
                <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900">{item.title}</p>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* ── Modal header ─────────────────────────────── */}
          <div className="bg-white border-b border-blue-100 px-6 py-4 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="font-bold text-slate-900 text-[16px]">{bus.name}</h2>
              <p className="text-gray-500 text-[12px] mt-0.5">{bus.departure} → {bus.arrival} · {bus.duration}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white text-xs font-bold flex-shrink-0
                  ${bus.rating >= 4.3 ? 'bg-blue-500' : bus.rating >= 3.5 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                  <Star className="w-3 h-3 fill-white" /> {bus.rating}
                  <span className="font-normal opacity-70 text-[10px]">({bus.reviews})</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-semibold">
                  <TrendingDown className="w-3 h-3" /> {bus.discount}% cheaper on Onlyy
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex-shrink-0 mt-0.5">
              <X className="w-4 h-4 text-blue-500" />
            </button>
          </div>

          {/* ── Step indicator ───────────────────────────── */}
          <div className="flex items-center gap-0 px-6 py-3 border-b border-blue-100 bg-white flex-shrink-0">
            {(['info', 'seats', 'boardpoint', 'passenger'] as Step[]).map((s, i) => {
              const labels = ['Details', 'Seats', 'Points', 'Passenger'];
              const isActive = step === s;
              const isDone   = ['info', 'seats', 'boardpoint', 'passenger'].indexOf(step) > i;
              return (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${isActive ? 'bg-gradient-button text-white shadow-sm' : isDone ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-slate-800' : 'text-gray-400'}`}>{labels[i]}</span>
                  </div>
                  {i < 3 && <div className={`w-10 h-0.5 mx-1 mb-4 ${isDone ? 'bg-emerald-400' : 'bg-gray-100'}`} />}
                </div>
              );
            })}
          </div>

          {/* ── Scrollable content ───────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* STEP 1 — Info & tabs */}
              {step === 'info' && (
                <motion.div key="info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  
                  {/* Bus photo placeholder + trust strip */}
                  <div className="p-6 pb-0">
                    <div className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center">
                          <Bus className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{bus.busType || 'A/C Sleeper'}</p>
                          <p className="text-[12px] text-gray-500 mt-0.5">{bus.fromCity} → {bus.toCity}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="flex items-baseline gap-1.5 md:justify-end">
                          <span className="text-[12px] text-gray-400 line-through">₹{bus.originalPrice}</span>
                          <span className="text-[10px] text-gray-400">elsewhere</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600 leading-none mt-1">₹{bus.discountedPrice}</div>
                        <div className="flex items-center gap-1 md:justify-end mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                            <TrendingDown className="w-2.5 h-2.5" /> Onlyy early price
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pill Tab Bar matching page theme */}
                  <div className="px-6 pt-4">
                    <div ref={tabScrollRef} className="flex items-center gap-1 bg-white border border-blue-100 rounded-xl p-1 shadow-sm overflow-x-auto scrollbar-hide">
                      {TABS.map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0
                            ${activeTab === tab ? 'bg-gradient-button text-white shadow-sm' : 'text-gray-500 hover:text-slate-900'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="p-6">
                    <InfoTab />
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Seat selection */}
              {step === 'seats' && (
                <motion.div key="seats" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-6">
                  <h3 className="font-bold text-slate-900 mb-1">Select Your Seats</h3>
                  <p className="text-[12px] text-gray-400 mb-4">{bus.fromCity} → {bus.toCity} · {bus.departure}</p>

                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Seat grids */}
                    <div className={`flex ${hasTwoDecks ? 'gap-4' : 'justify-center'} flex-wrap flex-1`}>
                      <SeatGrid deckSeats={lowerSeats} deckLabel={hasTwoDecks ? 'Lower Deck' : undefined} />
                      {hasTwoDecks && <SeatGrid deckSeats={upperSeats} deckLabel="Upper Deck" />}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-52 space-y-3 flex-shrink-0">
                      {/* Legend */}
                      <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3 shadow-sm">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Seat Legend</p>
                        {[
                          { label: 'Available', color: 'available' as const },
                          { label: 'Selected', color: 'selected' as const },
                          { label: 'Female only', color: 'female' as const },
                          { label: 'Sold', color: 'sold' as const },
                        ].map(row => (
                          <div key={row.label} className="flex items-center gap-2 mb-1.5">
                            <SeaterIcon color={row.color} />
                            <span className="text-[11px] font-medium text-slate-600">{row.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Selection summary */}
                      <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Selected</p>
                        {selectedArr.length === 0
                          ? <p className="text-[12px] text-gray-400">No seats selected</p>
                          : (
                            <>
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {selectedArr.map(s => (
                                  <span key={s} className="bg-gradient-button text-white shadow-sm text-[11px] font-bold px-2 py-1 rounded-lg">{s}</span>
                                ))}
                              </div>
                              <div className="border-t border-blue-100 pt-2 space-y-1 text-[12px]">
                                <div className="flex justify-between text-gray-500">
                                  <span>{selectedArr.length} × ₹{bus.discountedPrice}</span>
                                  <span className="font-bold text-slate-900">₹{totalPrice}</span>
                                </div>
                                {savedAmt > 0 && (
                                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" /> Save ₹{savedAmt} vs market
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Boarding & Dropping */}
              {step === 'boardpoint' && (
                <motion.div key="boardpoint" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-6">
                  <h3 className="font-bold text-slate-900 mb-5">Boarding & Dropping Points</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Boarding */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <h4 className="font-bold text-slate-700 text-[13px] uppercase tracking-wide">Pick your boarding point</h4>
                      </div>
                      <div className="space-y-2">
                        {bus.boardingPoints.map(point => {
                          const time = BOARDING_TIMES[point] ?? '—';
                          return (
                            <button key={point} onClick={() => setBoarding(point)}
                              className={`w-full text-left border rounded-xl p-3.5 transition-all
                                ${boarding === point ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-blue-100 hover:border-blue-300 bg-white'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[13px] font-bold text-slate-900">{point}</p>
                                  <p className="text-[11px] text-gray-400 mt-0.5">{bus.fromCity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[13px] font-bold text-blue-600">{time}</p>
                                  {boarding === point && <CheckCircle2 className="w-4 h-4 text-blue-500 mt-1 ml-auto" />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dropping */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <h4 className="font-bold text-slate-700 text-[13px] uppercase tracking-wide">Pick your dropping point</h4>
                      </div>
                      <div className="space-y-2">
                        {bus.droppingPoints.map(point => {
                          const time = DROPPING_TIMES[point] ?? '—';
                          return (
                            <button key={point} onClick={() => setDropping(point)}
                              className={`w-full text-left border rounded-xl p-3.5 transition-all
                                ${dropping === point ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-blue-100 hover:border-blue-300 bg-white'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[13px] font-bold text-slate-900">{point}</p>
                                  <p className="text-[11px] text-gray-400 mt-0.5">{bus.toCity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[13px] font-bold text-emerald-600">{time}</p>
                                  {dropping === point && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 ml-auto" />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 — Passenger details */}
              {step === 'passenger' && (
                <motion.div key="passenger" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="p-6">
                  <h3 className="font-bold text-slate-900 mb-5">Passenger Details</h3>
                  <div className="space-y-4">
                    {selectedArr.map((seatId, idx) => (
                      <div key={seatId} className="border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-blue-50/40 border-b border-blue-100 px-4 py-2.5 flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-button text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">{idx + 1}</div>
                          <span className="text-[13px] font-bold text-slate-800">Seat {seatId}</span>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3 bg-white">
                          {[
                            { field: 'name' as const, placeholder: 'Full Name', type: 'text' },
                            { field: 'age' as const, placeholder: 'Age', type: 'number' },
                            { field: 'email' as const, placeholder: 'Email', type: 'email' },
                          ].map(({ field, placeholder, type }) => (
                            <input key={field} type={type} placeholder={placeholder}
                              value={passengers[seatId]?.[field] || ''}
                              onChange={e => setPassenger(seatId, field, e.target.value)}
                              className="px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                          ))}
                          <select
                            value={passengers[seatId]?.gender || ''}
                            onChange={e => setPassenger(seatId, 'gender', e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                          >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Footer ───────────────────────────────────── */}
          <div className="border-t border-blue-100 px-6 py-4 flex items-center gap-3 bg-white flex-shrink-0">
            {/* Back button */}
            {step !== 'info' && (
              <button
                onClick={() => {
                  const order: Step[] = ['info', 'seats', 'boardpoint', 'passenger'];
                  setStep(order[order.indexOf(step) - 1]);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-blue-200 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {/* Price summary (seats selected) */}
            {step === 'seats' && selectedArr.length > 0 && (
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium text-gray-400">{selectedArr.length} seat{selectedArr.length > 1 ? 's' : ''}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-blue-600">₹{totalPrice}</span>
                  {savedAmt > 0 && <span className="text-[11px] text-emerald-600 font-semibold">Save ₹{savedAmt}</span>}
                </div>
                {isFlexiSelected && (
                  <p className="text-[11px] text-blue-600 font-medium">Includes Flexi Protect ₹{FLEXI_FEE}</p>
                )}
              </div>
            )}

            {/* Primary CTA */}
            <button
              onClick={() => {
                if (step === 'info') setStep('seats');
                else if (step === 'seats') { if (selectedArr.length > 0) setStep('boardpoint'); }
                else if (step === 'boardpoint') { if (boarding && dropping) setStep('passenger'); }
                else handlePay();
              }}
              disabled={
                (step === 'seats' && selectedArr.length === 0) ||
                (step === 'boardpoint' && (!boarding || !dropping))
              }
              className="ml-auto flex items-center gap-1.5 bg-gradient-button disabled:bg-none disabled:bg-gray-200 disabled:opacity-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:brightness-105 active:brightness-95 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm whitespace-nowrap justify-center"
            >
              {step === 'info'       && <><span>Select Seats</span><ChevronRight className="w-4 h-4" /></>}
              {step === 'seats'      && <><span>{selectedArr.length > 0 ? `Continue · ₹${totalPrice}` : 'Select a seat'}</span><ChevronRight className="w-4 h-4" /></>}
              {step === 'boardpoint' && <><span>Passenger Details</span><ChevronRight className="w-4 h-4" /></>}
              {step === 'passenger'  && <><span>Proceed to Payment</span><ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>
        </motion.div>
      </motion.div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
        onAuthSuccess={() => {
          if (pendingPaymentData) {
            const data = pendingPaymentData;
            setPendingPaymentData(null);
            setIsAuthModalOpen(false);
            goToPayment(data);
            return;
          }
          setIsAuthModalOpen(false);
        }}
      />
    </AnimatePresence>
  );
}
