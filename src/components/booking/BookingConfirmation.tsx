'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Users,
  CreditCard,
  Smartphone,
  Wallet,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import Header from '@/components/shared/Header';

interface PassengerInfo {
  name: string;
  age: number;
  gender: string;
  email: string;
  seatNumber: string;
}

interface BookingData {
  busName: string;
  busRating: number;
  busReviews: number;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  passengers: PassengerInfo[];
  selectedSeats: string[];
  travelDate: string;
  flexiAmount?: number;
  flexiSelected?: boolean;
}

interface BookingConfirmationProps {
  bookingData: BookingData;
  onBack: () => void;
  onProceedToPayment: () => void;
}

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'upi', name: 'UPI', icon: Smartphone },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
];

export default function BookingConfirmation({ 
  bookingData, 
  onBack, 
  onProceedToPayment 
}: BookingConfirmationProps) {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const totalPrice = bookingData.selectedSeats.length * bookingData.discountedPrice;
  const flexiAmount = bookingData.flexiAmount ?? 0;
  const savedAmount = bookingData.selectedSeats.length * (bookingData.originalPrice - bookingData.discountedPrice);
  let finalPrice = totalPrice + flexiAmount;
  let promoDiscount = 0;

  if (appliedPromo) {
    promoDiscount = Math.floor(totalPrice * (appliedPromo.discount / 100));
    finalPrice = totalPrice - promoDiscount + flexiAmount;
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setAppliedPromo({ code: 'SAVE20', discount: 20 });
    } else if (promoCode.toUpperCase() === 'TRAVEL10') {
      setAppliedPromo({ code: 'TRAVEL10', discount: 10 });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-6 pb-16">
      <Header />
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-gray-600">
            Review your details and proceed to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-blue-100"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Trip Summary</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-4 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(bookingData.busRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{bookingData.busRating}</span>
                      <span className="text-xs text-gray-600">({bookingData.busReviews} reviews)</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-3">{bookingData.busName}</h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{bookingData.from} → {bookingData.to}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{bookingData.departure} - {bookingData.arrival} ({bookingData.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{bookingData.selectedSeats.length} {bookingData.selectedSeats.length === 1 ? 'Passenger' : 'Passengers'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats Selected */}
              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 mb-2">Selected Seats:</h4>
                <div className="flex flex-wrap gap-2">
                  {bookingData.selectedSeats.map((seat, idx) => (
                    <span 
                      key={idx}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Travel Date */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-slate-900">Travel Date:</span> {bookingData.travelDate}
                </p>
              </div>
            </motion.div>

            {/* Passenger Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-blue-100"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Passenger Details</h2>
              
              <div className="space-y-4">
                {bookingData.passengers.map((passenger, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">Seat {passenger.seatNumber}</h4>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Passenger {idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Name</div>
                        <div className="font-semibold text-slate-900">{passenger.name}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Age</div>
                        <div className="font-semibold text-slate-900">{passenger.age} years</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Gender</div>
                        <div className="font-semibold text-slate-900">{passenger.gender}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Email</div>
                        <div className="font-semibold text-slate-900 truncate">{passenger.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-blue-100"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Select Payment Method</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`
                        p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                        ${selectedPayment === method.id
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className={`w-6 h-6 ${selectedPayment === method.id ? 'text-cyan-700' : 'text-gray-600'}`} />
                      <span className={`text-xs font-semibold text-center ${selectedPayment === method.id ? 'text-cyan-700' : 'text-slate-900'}`}>
                        {method.name}
                      </span>
                      {selectedPayment === method.id && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-1" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                {selectedPayment === 'card' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
                {selectedPayment === 'upi' && (
                  <input
                    type="email"
                    placeholder="Enter UPI ID (e.g., user@bank)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                )}
                {selectedPayment === 'wallet' && (
                  <div className="text-center py-4">
                    <p className="text-gray-700 mb-2">Your Wallet Balance</p>
                    <p className="text-2xl font-bold text-blue-600">₹5,000</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-blue-100"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="terms" className="cursor-pointer">
                  <span className="text-sm text-gray-700">
                    I agree to the <span className="text-blue-600 font-semibold hover:underline">Terms and Conditions</span> and <span className="text-blue-600 font-semibold hover:underline">Privacy Policy</span>
                  </span>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Price Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-20 bg-white rounded-2xl p-6 border border-blue-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Price Summary</h2>

              {/* Promo Code Section */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                {appliedPromo ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-700">{appliedPromo.code}</span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-green-600 hover:text-green-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-green-700">{appliedPromo.discount}% discount applied</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleApplyPromo}
                        disabled={!promoCode}
                        className="px-3 py-2 bg-gradient-button text-white rounded-lg text-sm font-semibold hover:brightness-105 active:brightness-95 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Apply
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-600">Try: SAVE20 or TRAVEL10</p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Base Price ({bookingData.selectedSeats.length} × ₹{bookingData.originalPrice})</span>
                  <span className="font-semibold text-slate-900">₹{bookingData.selectedSeats.length * bookingData.originalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Your Discount</span>
                  <span className="font-semibold text-green-600">-₹{savedAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{totalPrice}</span>
                </div>
                {flexiAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Flexi Protect</span>
                    <span className="font-semibold text-slate-900">₹{flexiAmount}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{appliedPromo.code} Discount</span>
                    <span className="font-semibold text-green-600">-₹{promoDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Taxes & Fees</span>
                  <span className="font-semibold text-slate-900">₹0</span>
                </div>

                <div className="pt-3 border-t-2 border-gray-200 flex justify-between">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{finalPrice}</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p>Your payment is encrypted and secure</p>
                  </div>
                </div>
              </div>

              {/* Proceed Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onProceedToPayment}
                disabled={!termsAccepted}
                className={`
                  w-full py-3 rounded-lg font-bold transition-all text-white
                  ${termsAccepted
                    ? 'bg-gradient-button hover:brightness-105 active:brightness-95'
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                Proceed to Payment
              </motion.button>

              <p className="text-xs text-center text-gray-600">
                Payment will be processed securely. Your ticket will be emailed immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
