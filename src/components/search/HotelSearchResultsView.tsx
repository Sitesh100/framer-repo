'use client';

import { useState, useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  TrendingDown,
  MapPin,
  Plus,
  Minus,
  Maximize2,
  MessageSquare,
} from 'lucide-react';

import imgBali from '@/app/assets/bali.jpg';
import imgDubai from '@/app/assets/dubai.jpg';
import imgParis from '@/app/assets/paris.jpg';
import imgSantorini from '@/app/assets/santoroni.jpg';
import imgTokyo from '@/app/assets/tokyo.jpg';

// ── Types ────────────────────────────────────────────────────
export interface HotelResult {
  id: number;
  name: string;
  stars: 3 | 4 | 5;
  rating: number;
  reviews: number;
  reviewLabel: string;
  distance: string;
  pricePerNight: number;
  marketPrice: number;
  provider: 'agoda' | 'booking.com' | 'expedia' | 'trip.com';
  bookingOptions: number;
  fromPrice: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  accessible: boolean;
  cheaperThanUsual: boolean;
  image: StaticImageData;
  mapX: number; // 0-100 % for map placement
  mapY: number;
}

// ── Dummy data ───────────────────────────────────────────────
const hotelData: HotelResult[] = [
  {
    id: 1,
    name: 'Newly Built Gold The Royal With Rooftop Restaurant',
    stars: 4,
    rating: 4.3,
    reviews: 405,
    reviewLabel: 'Excellent',
    distance: '0.75 km from City Centre',
    pricePerNight: 2062,
    marketPrice: 2524,
    provider: 'agoda',
    bookingOptions: 1,
    fromPrice: 2524,
    freeCancellation: true,
    breakfastIncluded: true,
    accessible: false,
    cheaperThanUsual: true,
    image: imgBali,
    mapX: 60, mapY: 50,
  },
  {
    id: 2,
    name: 'Novotel City Centre',
    stars: 5,
    rating: 4.7,
    reviews: 1735,
    reviewLabel: 'Excellent',
    distance: '0.33 km from City Centre',
    pricePerNight: 7400,
    marketPrice: 8120,
    provider: 'agoda',
    bookingOptions: 3,
    fromPrice: 7400,
    freeCancellation: true,
    breakfastIncluded: true,
    accessible: true,
    cheaperThanUsual: true,
    image: imgDubai,
    mapX: 55, mapY: 45,
  },
  {
    id: 3,
    name: 'The Imperial Garden Suites',
    stars: 5,
    rating: 4.6,
    reviews: 2104,
    reviewLabel: 'Excellent',
    distance: '1.2 km from City Centre',
    pricePerNight: 5872,
    marketPrice: 6400,
    provider: 'booking.com',
    bookingOptions: 5,
    fromPrice: 5872,
    freeCancellation: true,
    breakfastIncluded: false,
    accessible: true,
    cheaperThanUsual: false,
    image: imgSantorini,
    mapX: 70, mapY: 40,
  },
  {
    id: 4,
    name: 'Hotel Pluto Inn',
    stars: 3,
    rating: 3.9,
    reviews: 282,
    reviewLabel: 'Good',
    distance: '2.1 km from City Centre',
    pricePerNight: 1450,
    marketPrice: 1750,
    provider: 'expedia',
    bookingOptions: 2,
    fromPrice: 1450,
    freeCancellation: false,
    breakfastIncluded: false,
    accessible: false,
    cheaperThanUsual: true,
    image: imgParis,
    mapX: 35, mapY: 65,
  },
  {
    id: 5,
    name: 'Taj Palace Heritage',
    stars: 5,
    rating: 4.8,
    reviews: 3201,
    reviewLabel: 'Exceptional',
    distance: '0.5 km from City Centre',
    pricePerNight: 11200,
    marketPrice: 12500,
    provider: 'trip.com',
    bookingOptions: 7,
    fromPrice: 11200,
    freeCancellation: true,
    breakfastIncluded: true,
    accessible: true,
    cheaperThanUsual: false,
    image: imgTokyo,
    mapX: 50, mapY: 55,
  },
  {
    id: 6,
    name: 'Comfort Stay Residency',
    stars: 4,
    rating: 4.2,
    reviews: 612,
    reviewLabel: 'Very Good',
    distance: '1.8 km from City Centre',
    pricePerNight: 3299,
    marketPrice: 3800,
    provider: 'agoda',
    bookingOptions: 2,
    fromPrice: 3299,
    freeCancellation: true,
    breakfastIncluded: true,
    accessible: false,
    cheaperThanUsual: true,
    image: imgBali,
    mapX: 25, mapY: 35,
  },
  {
    id: 7,
    name: 'Marina Bay Boutique Hotel',
    stars: 4,
    rating: 4.5,
    reviews: 892,
    reviewLabel: 'Excellent',
    distance: '3.2 km from City Centre',
    pricePerNight: 4750,
    marketPrice: 5200,
    provider: 'booking.com',
    bookingOptions: 4,
    fromPrice: 4750,
    freeCancellation: true,
    breakfastIncluded: false,
    accessible: true,
    cheaperThanUsual: false,
    image: imgSantorini,
    mapX: 80, mapY: 30,
  },
  {
    id: 8,
    name: 'Budget Backpackers Lodge',
    stars: 3,
    rating: 4.0,
    reviews: 156,
    reviewLabel: 'Very Good',
    distance: '4.5 km from City Centre',
    pricePerNight: 899,
    marketPrice: 1100,
    provider: 'expedia',
    bookingOptions: 1,
    fromPrice: 899,
    freeCancellation: false,
    breakfastIncluded: false,
    accessible: false,
    cheaperThanUsual: true,
    image: imgParis,
    mapX: 18, mapY: 75,
  },
];

// ── Filters ──────────────────────────────────────────────────
interface HotelFilters {
  freeCancellation: boolean;
  breakfast: boolean;
  accessible: boolean;
  priceRange: [number, number] | null;
  minScore: number;
  stars: number[];
}

const defaultFilters: HotelFilters = {
  freeCancellation: false,
  breakfast: false,
  accessible: false,
  priceRange: null,
  minScore: 0,
  stars: [],
};

const PRICE_BUCKETS: { label: string; range: [number, number]; count: number }[] = [
  { label: '₹0 – ₹800', range: [0, 800], count: 44 },
  { label: '₹800 – ₹1,600', range: [800, 1600], count: 275 },
  { label: '₹1,600 – ₹2,400', range: [1600, 2400], count: 344 },
  { label: '₹2,400 – ₹3,200', range: [2400, 3200], count: 297 },
  { label: '₹3,200 – ₹4,000', range: [3200, 4000], count: 211 },
  { label: '₹4,000 +', range: [4000, 100000], count: 190 },
];

const REVIEW_BUCKETS: { label: string; min: number; count: number }[] = [
  { label: '5.0+ Outstanding', min: 5.0, count: 11 },
  { label: '4.5+ Excellent', min: 4.5, count: 45 },
  { label: '4.0+ Very good', min: 4.0, count: 132 },
  { label: '3.5+ Good', min: 3.5, count: 280 },
  { label: '3.0+ Pleasant', min: 3.0, count: 412 },
];

// ── Custom checkbox ──────────────────────────────────────────
function CheckBox({ checked }: { checked: boolean }) {
  return (
    <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
      checked ? 'bg-[#0770e3] border-[#0770e3]' : 'bg-white border-slate-300'
    }`}>
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </div>
  );
}

function FilterRow({ label, checked, onToggle, count }: { label: string; checked: boolean; onToggle: () => void; count?: number }) {
  return (
    <label
      className="flex items-center justify-between py-1.5 cursor-pointer group select-none"
      onClick={onToggle}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <CheckBox checked={checked} />
        <span className="text-[13px] text-slate-700 group-hover:text-[#0770e3] transition-colors truncate">{label}</span>
      </div>
      {count !== undefined && <span className="text-[11px] text-slate-500 ml-2 shrink-0">{count}</span>}
    </label>
  );
}

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

// ── Provider Logo (small colored dots) ───────────────────────
function ProviderLogo({ provider }: { provider: HotelResult['provider'] }) {
  const colors: Record<HotelResult['provider'], string[]> = {
    'agoda': ['#FF5722', '#3B82F6', '#FBBF24', '#10B981', '#A855F7'],
    'booking.com': ['#003580', '#FFB700'],
    'expedia': ['#FFC72C', '#191E3B'],
    'trip.com': ['#287DFA', '#FF6E00'],
  };
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-bold text-slate-700 capitalize">{provider}</span>
      <div className="flex gap-0.5">
        {colors[provider].map((c, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

// ── Hotel Card ───────────────────────────────────────────────
function HotelCard({ hotel }: { hotel: HotelResult }) {
  const [liked, setLiked] = useState(false);
  const [optsOpen, setOptsOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  // Multiple "images" — for demo, reuse same image (could be variants)
  const images = useMemo(() => [hotel.image, hotel.image, hotel.image, hotel.image], [hotel.image]);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#0770e3]/40 transition-all duration-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] gap-0">
        {/* Image */}
        <div className="relative h-[220px] md:h-auto bg-slate-100 group">
          <Image
            src={images[imgIdx]}
            alt={hotel.name}
            fill
            className="object-cover"
          />
          {/* Image nav arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {/* dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>

        {/* Middle: details */}
        <div className="p-5 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 hover:text-[#0770e3] cursor-pointer transition-colors">
              {hotel.name}
            </h3>
            <button
              onClick={() => setLiked(!liked)}
              className="shrink-0 w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
              aria-label="Save"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-[#0770e3] text-[#0770e3]' : 'text-slate-400'}`} />
            </button>
          </div>

          <div className="flex items-center gap-0.5 mb-3">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#0770e3] text-[#0770e3]" />
            ))}
          </div>

          <p className="text-sm text-slate-600 mb-3 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{hotel.distance}</span>
          </p>

          {/* Rating pill */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center min-w-[44px] h-7 px-2 rounded-lg bg-[#0770e3] text-white text-sm font-bold tabular-nums">
              {hotel.rating}/5
            </div>
            <div className="text-sm">
              <span className="font-semibold text-slate-900">{hotel.reviewLabel}</span>
              <span className="text-slate-500 ml-1">{hotel.reviews} reviews</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.freeCancellation && (
              <span className="text-[11px] text-[#0770e3] bg-blue-50 border border-blue-100 px-2 py-1 rounded-md font-semibold">
                Free cancellation
              </span>
            )}
            {hotel.breakfastIncluded && (
              <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded-md font-semibold">
                Breakfast included
              </span>
            )}
            {hotel.accessible && (
              <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded-md font-semibold">
                Accessible
              </span>
            )}
          </div>
        </div>

        {/* Right: price + CTA */}
        <div className="p-5 md:border-l border-slate-200 flex flex-col gap-2 justify-center bg-slate-50/40">
          {hotel.cheaperThanUsual && (
            <div className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0770e3] mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Cheaper than usual
              <Info className="w-3 h-3 text-slate-400" />
            </div>
          )}

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500">a night</span>
          </div>

          <ProviderLogo provider={hotel.provider} />

          {hotel.freeCancellation && (
            <p className="text-[12px] text-slate-600 mt-1">Free cancellation</p>
          )}

          <button className="mt-2 w-full bg-[#0B1F3A] hover:bg-[#16335c] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
            Go to site
          </button>

          {/* Booking options accordion */}
          <button
            onClick={() => setOptsOpen(!optsOpen)}
            className="mt-2 w-full flex items-center justify-between gap-2 px-3 py-2 border border-slate-200 hover:border-[#0770e3] rounded-xl text-[12px] text-slate-700 transition-colors"
          >
            <div className="text-left">
              <p className="font-semibold">{hotel.bookingOptions}+ booking options</p>
              <p className="text-[11px] text-slate-500">From ₹{hotel.fromPrice.toLocaleString('en-IN')}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${optsOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded booking options */}
      <AnimatePresence>
        {optsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 bg-slate-50/40"
          >
            <div className="px-5 py-4 space-y-2">
              {[
                { provider: hotel.provider, price: hotel.pricePerNight, type: 'Standard room · Room only' },
                { provider: 'booking.com' as const, price: Math.round(hotel.pricePerNight * 1.08), type: 'Deluxe · Breakfast included' },
                { provider: 'expedia' as const, price: Math.round(hotel.pricePerNight * 1.15), type: 'Suite · Free cancellation' },
              ].slice(0, hotel.bookingOptions + 1).map((opt, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                  <div className="min-w-0">
                    <ProviderLogo provider={opt.provider} />
                    <p className="text-[12px] text-slate-600 mt-1 truncate">{opt.type}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-bold text-slate-900 tabular-nums">₹{opt.price.toLocaleString('en-IN')}</span>
                    <button className="bg-[#0770e3] hover:bg-[#0561c7] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      Go
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Map placeholder with price pins ──────────────────────────
function HotelMap({ hotels, selectedId }: { hotels: HotelResult[]; selectedId: number | null }) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#e8f1e9]">
      {/* Map-like SVG pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d2e2cf" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
        {/* Faux roads */}
        <path d="M 0 30 Q 200 80 400 60 T 800 100" stroke="#c4d7c1" strokeWidth="6" fill="none" />
        <path d="M 100 0 L 80 200 L 140 400 L 100 600" stroke="#c4d7c1" strokeWidth="5" fill="none" />
        <path d="M 0 200 L 400 220 L 800 180" stroke="#c4d7c1" strokeWidth="4" fill="none" />
        <path d="M 300 0 L 320 300 L 280 600" stroke="#c4d7c1" strokeWidth="4" fill="none" />
        <path d="M 0 400 L 200 380 L 400 420 L 600 380 L 800 420" stroke="#c4d7c1" strokeWidth="4" fill="none" />
        {/* Faux parks */}
        <circle cx="180" cy="320" r="40" fill="#cfe5ce" opacity="0.7" />
        <circle cx="500" cy="180" r="55" fill="#cfe5ce" opacity="0.7" />
        <rect x="380" y="430" width="80" height="60" rx="8" fill="#cfe5ce" opacity="0.7" />
      </svg>

      {/* Top controls */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <button className="bg-[#0770e3] hover:bg-[#0561c7] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md transition-colors">
          <MessageSquare className="w-3.5 h-3.5" /> Chat
        </button>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <label className="bg-white rounded-full pl-3 pr-1.5 py-1 flex items-center gap-2 text-[11px] font-semibold text-slate-700 shadow">
          Search as you move
          <span className="relative inline-flex w-7 h-4 bg-[#0770e3] rounded-full">
            <span className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
          </span>
        </label>
        <button className="w-7 h-7 rounded-md bg-white shadow flex items-center justify-center hover:bg-slate-50">
          <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
        </button>
      </div>

      {/* Zoom buttons */}
      <div className="absolute top-14 right-3 flex flex-col gap-px overflow-hidden rounded-md shadow">
        <button className="w-7 h-7 bg-white hover:bg-slate-50 flex items-center justify-center">
          <Plus className="w-3.5 h-3.5 text-slate-700" />
        </button>
        <button className="w-7 h-7 bg-white hover:bg-slate-50 flex items-center justify-center">
          <Minus className="w-3.5 h-3.5 text-slate-700" />
        </button>
      </div>

      {/* Hotel price pins */}
      {hotels.map((h) => (
        <button
          key={h.id}
          style={{ left: `${h.mapX}%`, top: `${h.mapY}%` }}
          className={`absolute -translate-x-1/2 -translate-y-full px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-all hover:scale-110 hover:z-10 ${
            selectedId === h.id ? 'bg-[#0B1F3A] text-white z-20' : 'bg-white text-[#0770e3] border border-slate-200'
          }`}
        >
          ₹{h.pricePerNight.toLocaleString('en-IN')}
        </button>
      ))}
    </div>
  );
}

// ── Filter sidebar ───────────────────────────────────────────
function HotelFilterSidebar({
  filters, set, toggleStar, onHide,
}: {
  filters: HotelFilters;
  set: <K extends keyof HotelFilters>(k: K, v: HotelFilters[K]) => void;
  toggleStar: (s: number) => void;
  onHide: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={onHide}
        className="w-full flex items-center gap-1.5 px-5 py-3 border-b border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Hide filters
      </button>

      <Section title="Book with peace of mind">
        <FilterRow
          label="Free cancellation"
          checked={filters.freeCancellation}
          onToggle={() => set('freeCancellation', !filters.freeCancellation)}
          count={587}
        />
        <FilterRow
          label="Breakfast included"
          checked={filters.breakfast}
          onToggle={() => set('breakfast', !filters.breakfast)}
          count={323}
        />
        <FilterRow
          label="Accessible online booking"
          checked={filters.accessible}
          onToggle={() => set('accessible', !filters.accessible)}
        />
      </Section>

      <Section title="Price">
        {PRICE_BUCKETS.map((b) => {
          const active = filters.priceRange?.[0] === b.range[0] && filters.priceRange?.[1] === b.range[1];
          return (
            <FilterRow
              key={b.label}
              label={b.label}
              checked={!!active}
              onToggle={() => set('priceRange', active ? null : b.range)}
              count={b.count}
            />
          );
        })}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
            <input className="w-full pl-7 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-[#0770e3] outline-none" placeholder="0" />
          </div>
          <span className="text-slate-400">–</span>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
            <input className="w-full pl-7 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-[#0770e3] outline-none" placeholder="—" />
          </div>
          <button className="w-9 h-9 rounded-lg bg-[#0B1F3A] hover:bg-[#16335c] text-white flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Section>

      <Section title="Traveller review score">
        {REVIEW_BUCKETS.map((b) => (
          <FilterRow
            key={b.label}
            label={b.label}
            checked={filters.minScore === b.min}
            onToggle={() => set('minScore', filters.minScore === b.min ? 0 : b.min)}
            count={b.count}
          />
        ))}
      </Section>

      <Section title="Hotel class" defaultOpen={false}>
        <div className="flex gap-1.5 px-1">
          {[5, 4, 3].map((s) => {
            const active = filters.stars.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleStar(s)}
                className={`flex-1 flex items-center justify-center gap-0.5 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  active ? 'bg-[#0770e3] text-white border-[#0770e3]' : 'border-slate-200 text-slate-600 hover:border-[#0770e3]'
                }`}
              >
                {s} <Star className={`w-3 h-3 ${active ? 'fill-white' : 'fill-[#0770e3] text-[#0770e3]'}`} />
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
interface HotelSearchResultsViewProps {
  destination?: string;
}

export default function HotelSearchResultsView({ destination }: HotelSearchResultsViewProps) {
  const [sortBy, setSortBy] = useState<'recommended' | 'reviews' | 'lowest' | 'stars' | 'nearest'>('recommended');
  const [filters, setFilters] = useState<HotelFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const set = <K extends keyof HotelFilters>(k: K, v: HotelFilters[K]) =>
    setFilters((prev) => ({ ...prev, [k]: v }));

  const toggleStar = (s: number) =>
    setFilters((prev) => ({
      ...prev,
      stars: prev.stars.includes(s) ? prev.stars.filter((x) => x !== s) : [...prev.stars, s],
    }));

  const filtered = useMemo(() => hotelData
    .filter((h) => {
      if (filters.freeCancellation && !h.freeCancellation) return false;
      if (filters.breakfast && !h.breakfastIncluded) return false;
      if (filters.accessible && !h.accessible) return false;
      if (filters.priceRange && (h.pricePerNight < filters.priceRange[0] || h.pricePerNight > filters.priceRange[1])) return false;
      if (filters.minScore > 0 && h.rating < filters.minScore) return false;
      if (filters.stars.length > 0 && !filters.stars.includes(h.stars)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'reviews': return b.reviews - a.reviews;
        case 'lowest': return a.pricePerNight - b.pricePerNight;
        case 'stars': return b.stars - a.stars || b.rating - a.rating;
        case 'nearest': return parseFloat(a.distance) - parseFloat(b.distance);
        default:
          return (Number(b.cheaperThanUsual) - Number(a.cheaperThanUsual)) || (b.rating - a.rating);
      }
    }), [filters, sortBy]);

  const SORT_TABS = [
    { key: 'recommended', label: 'Recommended', icon: true },
    { key: 'reviews', label: 'Top reviews' },
    { key: 'lowest', label: 'Lowest price' },
    { key: 'stars', label: 'Most stars' },
    { key: 'nearest', label: 'Nearest first', chevron: true },
  ] as const;

  return (
    <div className={`grid gap-5 ${showFilters ? 'grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_340px]' : 'grid-cols-1 xl:grid-cols-[1fr_340px]'}`}>

      {/* Sidebar */}
      {showFilters && (
        <aside className="hidden lg:block self-start sticky top-[120px]">
          <HotelFilterSidebar
            filters={filters}
            set={set}
            toggleStar={toggleStar}
            onHide={() => setShowFilters(false)}
          />
        </aside>
      )}

      {/* Main results */}
      <div className="min-w-0">
        {/* Show filters when hidden */}
        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="hidden lg:flex mb-3 items-center gap-1.5 text-sm font-semibold text-[#0770e3] hover:text-[#0561c7]"
          >
            <ChevronRight className="w-4 h-4" /> Show filters
          </button>
        )}

        {/* Results count + sort tabs */}
        <p className="text-sm text-slate-700 mb-3">
          Taxes and fees not included <span className="mx-1 text-slate-400">|</span>{' '}
          <span className="font-bold text-slate-900">{filtered.length} results</span>
          {destination && <span className="text-slate-500"> in {destination}</span>}
        </p>

        {/* Sort tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {SORT_TABS.map((t) => {
              const active = sortBy === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setSortBy(t.key)}
                  className={`relative flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                    active ? 'text-[#0770e3]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                  {'icon' in t && t.icon && <Info className="w-3.5 h-3.5 text-slate-400" />}
                  {'chevron' in t && t.chevron && <ChevronDown className="w-3.5 h-3.5" />}
                  {active && (
                    <motion.span
                      layoutId="hotel-sort-underline"
                      className="absolute left-3 right-3 bottom-0 h-0.5 bg-[#0770e3] rounded-t"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price trend banner */}
        <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-700">
            Prices are <span className="font-semibold text-emerald-600">lower</span> than usual
          </p>
          <button className="flex items-center gap-1 text-sm font-semibold text-[#0770e3] hover:text-[#0561c7]">
            Show price data <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Hotel list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="font-bold text-slate-700">No hotels match your filters</p>
            <p className="text-sm text-slate-500 mt-1">Try relaxing some filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((h, idx) => (
              <motion.div
                key={h.id}
                onMouseEnter={() => setSelectedId(h.id)}
                onMouseLeave={() => setSelectedId(null)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
              >
                <HotelCard hotel={h} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Map (right) */}
      <aside className="hidden xl:block sticky top-[120px] self-start h-[calc(100vh-140px)]">
        <HotelMap hotels={filtered} selectedId={selectedId} />
      </aside>
    </div>
  );
}
