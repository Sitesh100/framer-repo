'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Shield,
  CircleX,
  Plane,
  Clock3,
  Briefcase,
  Luggage,
  Star,
  CheckCircle2,
  User,
  Mail,
  BadgeIndianRupee,
} from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import type { FlightResult } from '@/components/search/FlightSearchResultsView';

type Step = 'details' | 'travellers' | 'review';

interface FlightBookingModalProps {
  flight: FlightResult;
  fromCity: string;
  toCity: string;
  travelDate: string;
  onClose: () => void;
}

type Traveller = {
  name: string;
  age: string;
  gender: string;
  email: string;
};

const AUTH_USER_KEY = 'onlyy-auth-user';
const FLEXI_FEE = 199;
const CONVENIENCE_FEE_PER_PAX = 49;

export default function FlightBookingModal({ flight, fromCity, toCity, travelDate, onClose }: FlightBookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [travellerCount, setTravellerCount] = useState(1);
  const [travellers, setTravellers] = useState<Record<number, Traveller>>({});
  const [isFlexiSelected, setIsFlexiSelected] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<string | null>(null);

  const baseFare = travellerCount * flight.price;
  const convenienceFee = travellerCount * CONVENIENCE_FEE_PER_PAX;
  const flexiAmount = isFlexiSelected ? FLEXI_FEE : 0;
  const totalPrice = baseFare + convenienceFee + flexiAmount;

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!window.localStorage.getItem(AUTH_USER_KEY);
  };

  const setTraveller = (index: number, field: keyof Traveller, value: string) => {
    setTravellers((prev) => ({ ...prev, [index]: { ...prev[index], [field]: value } as Traveller }));
  };

  const allTravellersValid = useMemo(() => {
    for (let i = 0; i < travellerCount; i += 1) {
      const t = travellers[i];
      if (!t?.name || !t?.age || !t?.gender || !t?.email) return false;
    }
    return true;
  }, [travellers, travellerCount]);

  const paymentPayload = useMemo(() => {
    const passengers = Array.from({ length: travellerCount }).map((_, i) => ({
      ...travellers[i],
      seatNumber: `T${i + 1}`,
    }));

    return {
      busName: `${flight.airline} ${flight.flightNo}`,
      busRating: flight.airline_rating,
      busReviews: flight.rating_reviews,
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      originalPrice: flight.marketPrice,
      discountedPrice: flight.price,
      discount: Math.max(0, flight.marketPrice - flight.price),
      seats: passengers.map((p) => p.seatNumber),
      passengers,
      flexiAmount,
      flexiSelected: isFlexiSelected,
      totalPrice,
      from: fromCity,
      to: toCity,
      travelDate,
      mode: 'flight',
    };
  }, [flight, flexiAmount, fromCity, isFlexiSelected, totalPrice, travelDate, travellerCount, travellers, toCity]);

  const goToPayment = () => {
    const encoded = encodeURIComponent(JSON.stringify(paymentPayload));
    router.push(`/booking/payment?data=${encoded}`);
    onClose();
  };

  const handleProceedPayment = () => {
    if (!allTravellersValid) return;
    if (!isAuthenticated()) {
      const encoded = encodeURIComponent(JSON.stringify(paymentPayload));
      setPendingPayload(encoded);
      setIsAuthModalOpen(true);
      return;
    }
    goToPayment();
  };

  const stepIndex = step === 'details' ? 1 : step === 'travellers' ? 2 : 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center p-0 md:p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 26, opacity: 0 }}
          className="bg-slate-50 rounded-t-3xl md:rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="px-5 md:px-7 py-4 border-b border-blue-100 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.16em]">Flight Booking</p>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mt-0.5">{flight.airline} · {flight.flightNo}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{fromCity} ({flight.fromCode}) to {toCity} ({flight.toCode}) • {travelDate}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 md:gap-3">
              {[
                { key: 'details', title: 'Flight & Fare', n: 1 },
                { key: 'travellers', title: 'Traveller Details', n: 2 },
                { key: 'review', title: 'Review & Pay', n: 3 },
              ].map((s) => (
                <div key={s.key} className={`rounded-xl border px-3 py-2.5 ${stepIndex >= s.n ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${stepIndex >= s.n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{s.n}</div>
                    <span className={`text-xs md:text-sm font-bold ${stepIndex >= s.n ? 'text-blue-700' : 'text-gray-500'}`}>{s.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 md:p-7 overflow-y-auto">
            <div className="grid lg:grid-cols-[1.65fr_1fr] gap-5">
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-blue-100 p-4 md:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Plane className="w-4 h-4 text-blue-500" /> {flight.airline}
                        <span className="text-gray-300">|</span> {flight.flightNo}
                        <span className="text-gray-300">|</span> {flight.seatClass}
                      </div>
                      <div className="mt-2 flex items-center gap-3 md:gap-4">
                        <div>
                          <p className="text-2xl font-black text-slate-900 leading-none">{flight.departure}</p>
                          <p className="text-xs font-bold text-blue-600 mt-1">{flight.fromCode}</p>
                        </div>
                        <div className="min-w-[120px] md:min-w-[180px]">
                          <div className="flex items-center justify-center gap-1.5 text-[11px] text-blue-500 font-semibold mb-1">
                            <Clock3 className="w-3 h-3" /> {flight.duration}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="h-px flex-1 bg-blue-200" />
                            <Plane className="w-3.5 h-3.5 text-blue-500" />
                            <div className="h-px flex-1 bg-blue-200" />
                          </div>
                          <p className="text-center text-[11px] text-gray-500 mt-1">{flight.stops === 0 ? 'Non-stop' : flight.layover}</p>
                        </div>
                        <div>
                          <p className="text-2xl font-black text-slate-900 leading-none">{flight.arrival}</p>
                          <p className="text-xs font-bold text-blue-600 mt-1">{flight.toCode}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400 line-through">₹{flight.marketPrice.toLocaleString('en-IN')}</p>
                      <p className="text-2xl font-black text-blue-600">₹{flight.price.toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">Save ₹{(flight.marketPrice - flight.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold"><Briefcase className="w-3 h-3" /> Cabin 7kg</span>
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold ${flight.checkedBag ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}><Luggage className="w-3 h-3" /> {flight.checkedBag ? 'Check-in 15kg' : 'No check-in bag'}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold"><Star className="w-3 h-3" /> {flight.airline_rating} ({flight.rating_reviews})</span>
                  </div>
                </div>

                {step === 'details' && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-blue-100 p-5">
                      <h4 className="text-sm font-black text-slate-900">Choose Fare Type</h4>
                      <p className="text-xs text-gray-500 mt-1">MMT/Ixigo style fare family view for better clarity.</p>

                      <div className="mt-4 grid md:grid-cols-3 gap-3">
                        <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-3">
                          <p className="text-xs font-black text-blue-700">Onlyy Smart (Selected)</p>
                          <p className="text-lg font-black text-slate-900 mt-2">₹{flight.price.toLocaleString('en-IN')}</p>
                          <ul className="mt-2 text-[11px] text-slate-700 space-y-1">
                            <li>Cabin bag included</li>
                            <li>Best price guarantee</li>
                            <li>Standard cancellation</li>
                          </ul>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3 opacity-70">
                          <p className="text-xs font-black text-slate-500">Flexi Plus</p>
                          <p className="text-lg font-black text-slate-900 mt-2">₹{(flight.price + 699).toLocaleString('en-IN')}</p>
                          <ul className="mt-2 text-[11px] text-slate-600 space-y-1">
                            <li>Lower cancellation fee</li>
                            <li>Free date change once</li>
                            <li>Priority support</li>
                          </ul>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-3 opacity-70">
                          <p className="text-xs font-black text-slate-500">Refundable Max</p>
                          <p className="text-lg font-black text-slate-900 mt-2">₹{(flight.price + 1399).toLocaleString('en-IN')}</p>
                          <ul className="mt-2 text-[11px] text-slate-600 space-y-1">
                            <li>Highest refund slab</li>
                            <li>Trip delay protection</li>
                            <li>Assisted rebooking</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-black text-blue-900">Add Flexi Fare Shield - ₹{FLEXI_FEE}</p>
                        <p className="text-xs text-blue-700 mt-0.5">Lower cancellation penalty + one date change option before departure.</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={() => setIsFlexiSelected((p) => !p)}
                          className={`text-xs font-black border px-3 py-1.5 rounded-lg ${isFlexiSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'}`}
                        >
                          {isFlexiSelected ? 'Added' : 'Add'}
                        </button>
                        {isFlexiSelected && (
                          <button onClick={() => setIsFlexiSelected(false)} className="w-8 h-8 rounded-lg border border-red-200 text-red-600 flex items-center justify-center">
                            <CircleX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-blue-100 p-4">
                      <label className="text-sm font-black text-slate-900">Travellers</label>
                      <div className="mt-2 flex items-center gap-3">
                        <button onClick={() => setTravellerCount((v) => Math.max(1, v - 1))} className="w-8 h-8 rounded-lg border border-gray-200 font-bold">-</button>
                        <span className="font-black text-slate-900">{travellerCount}</span>
                        <button onClick={() => setTravellerCount((v) => Math.min(6, v + 1))} className="w-8 h-8 rounded-lg border border-gray-200 font-bold">+</button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 'travellers' && (
                  <div className="bg-white rounded-2xl border border-blue-100 p-5 space-y-4">
                    <h4 className="text-sm font-black text-slate-900">Traveller Information</h4>
                    <p className="text-xs text-gray-500">Enter names exactly as on valid ID/passport.</p>

                    {Array.from({ length: travellerCount }).map((_, i) => (
                      <div key={i} className="rounded-xl border border-blue-100 p-4">
                        <p className="text-xs font-black text-blue-600 mb-3">Traveller {i + 1}</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="relative">
                            <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            <input placeholder="Full Name" value={travellers[i]?.name || ''} onChange={(e) => setTraveller(i, 'name', e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
                          </div>
                          <input type="number" placeholder="Age" value={travellers[i]?.age || ''} onChange={(e) => setTraveller(i, 'age', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            <input type="email" placeholder="Email" value={travellers[i]?.email || ''} onChange={(e) => setTraveller(i, 'email', e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
                          </div>
                          <select value={travellers[i]?.gender || ''} onChange={(e) => setTraveller(i, 'gender', e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step === 'review' && (
                  <div className="bg-white rounded-2xl border border-blue-100 p-5 space-y-4">
                    <h4 className="text-sm font-black text-slate-900">Review Before Payment</h4>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Flight and traveller details look good. Continue to secure payment.
                    </div>

                    <div className="text-sm space-y-2">
                      <div className="flex justify-between"><span>Base Fare ({travellerCount} x ₹{flight.price.toLocaleString('en-IN')})</span><span>₹{baseFare.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>Convenience Fee ({travellerCount} x ₹{CONVENIENCE_FEE_PER_PAX})</span><span>₹{convenienceFee.toLocaleString('en-IN')}</span></div>
                      {isFlexiSelected && <div className="flex justify-between"><span>Flexi Fare Shield</span><span>₹{flexiAmount.toLocaleString('en-IN')}</span></div>}
                      <div className="flex justify-between pt-2 border-t font-black text-blue-600 text-base"><span>Total</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-blue-100 p-4 md:p-5">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-[0.16em]">Fare Summary</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Flight Fare</span><span className="font-bold">₹{baseFare.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Convenience</span><span className="font-bold">₹{convenienceFee.toLocaleString('en-IN')}</span></div>
                    {isFlexiSelected && <div className="flex justify-between"><span className="text-gray-600">Flexi</span><span className="font-bold">₹{flexiAmount.toLocaleString('en-IN')}</span></div>}
                    <div className="pt-3 mt-2 border-t border-gray-200 flex justify-between items-end">
                      <span className="font-black text-slate-900">Total Payable</span>
                      <span className="text-2xl font-black text-blue-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 p-4">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-[0.14em]">Why Book on Onlyy</p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" /> Better fare visibility with clear breakup</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" /> Faster support for flight changes/cancellation</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5" /> One-click secure payment and instant confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-100 px-5 md:px-7 py-4 bg-white flex items-center gap-3">
            {step !== 'details' && (
              <button
                onClick={() => setStep(step === 'review' ? 'travellers' : 'details')}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-blue-200 text-blue-600 font-bold text-sm rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 text-sm font-black text-slate-900">
                <BadgeIndianRupee className="w-4 h-4 text-blue-600" /> {totalPrice.toLocaleString('en-IN')}
              </div>
              <button
                onClick={() => {
                  if (step === 'details') setStep('travellers');
                  else if (step === 'travellers') setStep('review');
                  else handleProceedPayment();
                }}
                disabled={step === 'travellers' && !allTravellersValid}
                className="flex items-center gap-1.5 bg-gradient-button disabled:bg-gray-200 disabled:text-gray-500 text-white font-black text-sm px-6 py-2.5 rounded-xl"
              >
                {step === 'details' && <><span>Continue to Travellers</span><ChevronRight className="w-4 h-4" /></>}
                {step === 'travellers' && <><span>Review Fare</span><ChevronRight className="w-4 h-4" /></>}
                {step === 'review' && <><span>Proceed to Payment</span><ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </motion.div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialView="login"
          onAuthSuccess={() => {
            if (pendingPayload) {
              router.push(`/booking/payment?data=${pendingPayload}`);
              setPendingPayload(null);
              setIsAuthModalOpen(false);
              onClose();
              return;
            }
            setIsAuthModalOpen(false);
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
