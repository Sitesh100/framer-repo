'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Lock, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
// avoid next/navigation hooks during build; use browser APIs inside effects
import Header from '@/components/shared/Header';

interface BookingData {
  busName: string;
  busRating?: number;
  busReviews?: number;
  departure: string;
  arrival: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  seats: string[];
  passengers: any[];
  flexiAmount?: number;
  flexiSelected?: boolean;
  totalPrice: number;
}

export default function PaymentClient() {
  // router navigation via window to avoid next/navigation SSR hooks
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [showCVV, setShowCVV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'payment' | 'otp' | 'success'>('payment');
  const [otpValue, setOtpValue] = useState('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('data');
      if (data) {
        const parsed = JSON.parse(decodeURIComponent(data));
        setBookingData(parsed);
      }
    } catch (error) {
      console.error('Error parsing booking data:', error);
    }
  }, []);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-16">
        <Header />
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = bookingData.totalPrice;
  const flexiAmount = bookingData.flexiAmount ?? 0;

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleUPIPayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPaymentStep('otp');
      setIsProcessing(false);
    }, 1500);
  };

  const handleCardPayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPaymentStep('otp');
      setIsProcessing(false);
    }, 1500);
  };

  const handleWalletPayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPaymentStep('success');
      setIsProcessing(false);
    }, 2000);
  };

  const handleOTPVerification = async () => {
    if (otpValue.length !== 4) {
      alert('Please enter valid OTP');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setPaymentStep('success');
      setIsProcessing(false);
    }, 1500);
  };

  const handleRedirectHome = () => {
    window.location.href = '/';
  };

  if (paymentStep === 'success') {
    const savedAmount = bookingData.seats.length * (bookingData.originalPrice - bookingData.discountedPrice);
    const bookingRef = `BK${Date.now().toString().slice(-8)}`;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pt-20 pb-16">
        <Header />
        <div className="max-w-2xl mx-auto px-4 lg:px-8">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50"
              />
              <CheckCircle2 className="w-24 h-24 text-green-600 relative" />
            </div>
          </motion.div>

          {/* Success Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your booking has been confirmed
            </p>

            {/* Booking Reference */}
            <div className="bg-white border-2 border-green-200 rounded-2xl p-8 mb-8">
              <p className="text-gray-600 text-sm mb-2">Booking Reference ID</p>
              <p className="text-4xl font-bold text-blue-600 font-mono">{bookingRef}</p>
              <p className="text-sm text-gray-600 mt-4">Check your email for ticket details</p>
            </div>

            {/* Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 border border-blue-100 mb-8 text-left"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Bus: {bookingData.busName}</span>
                  <span className="font-semibold text-slate-900">✓</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Time: {bookingData.departure} - {bookingData.arrival}</span>
                  <span className="font-semibold text-slate-900">✓</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Seats: {bookingData.seats.join(', ')}</span>
                  <span className="font-semibold text-slate-900">✓</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Passengers: {bookingData.passengers.length}</span>
                  <span className="font-semibold text-slate-900">✓</span>
                </div>
                {savedAmount > 0 && (
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-green-700 font-semibold">Amount Saved</span>
                    <span className="font-semibold text-green-600">₹{savedAmount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3">
                  <span className="font-bold text-slate-900">Total Paid</span>
                  <span className="text-2xl font-bold text-blue-600">₹{totalAmount}</span>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRedirectHome}
              className="w-full bg-gradient-button hover:brightness-105 active:brightness-95 text-white font-semibold py-4 rounded-lg transition-all shadow-md"
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-16">
      <Header />
      <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {paymentStep === 'otp' ? 'Verify OTP' : 'Complete Payment'}
          </h1>
          <p className="text-gray-600">
            {paymentStep === 'otp' 
              ? 'Enter the OTP sent to your registered email/phone'
              : 'Choose your payment method and complete the transaction'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2">
            {paymentStep === 'payment' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Payment Methods */}
                <div className="bg-white rounded-2xl border border-blue-100 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Method</h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { id: 'card', name: 'Card', icon: CreditCard },
                      { id: 'upi', name: 'UPI', icon: Smartphone },
                      { id: 'wallet', name: 'Wallet', icon: Wallet }
                    ].map(method => {
                      const Icon = method.icon;
                      return (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            selectedPayment === method.id
                              ? 'border-cyan-500 bg-cyan-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${selectedPayment === method.id ? 'text-cyan-700' : 'text-gray-600'}`} />
                          <span className={`text-xs font-semibold ${selectedPayment === method.id ? 'text-cyan-700' : 'text-slate-900'}`}>
                            {method.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Card Payment */}
                  {selectedPayment === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={cardData.cardholderName}
                          onChange={handleCardInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardData.expiryDate}
                            onChange={handleCardInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type={showCVV ? 'text' : 'password'}
                              name="cvv"
                              value={cardData.cvv}
                              onChange={handleCardInputChange}
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono"
                            />
                            <button
                              onClick={() => setShowCVV(!showCVV)}
                              className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                            >
                              {showCVV ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* UPI Payment */}
                  {selectedPayment === 'upi' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="email"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@bankname"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <p className="text-xs text-gray-600">You will receive an OTP on your registered phone number</p>
                    </motion.div>
                  )}

                  {/* Wallet */}
                  {selectedPayment === 'wallet' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-gray-600">Pay instantly with your saved wallet</p>
                    </motion.div>
                  )}

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        if (selectedPayment === 'card') handleCardPayment();
                        else if (selectedPayment === 'upi') handleUPIPayment();
                        else handleWalletPayment();
                      }}
                      className="w-full bg-gradient-button hover:brightness-105 active:brightness-95 text-white font-semibold py-3 rounded-lg transition-all"
                    >
                      Continue to Pay ₹{totalAmount}
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl border border-blue-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Bus</span>
                      <span className="font-semibold">{bookingData.busName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time</span>
                      <span className="font-semibold">{bookingData.departure} - {bookingData.arrival}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seats</span>
                      <span className="font-semibold">{bookingData.seats.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passengers</span>
                      <span className="font-semibold">{bookingData.passengers.length}</span>
                    </div>
                    {flexiAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Flexi Protect</span>
                        <span className="font-semibold">₹{flexiAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-blue-600">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : paymentStep === 'otp' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-blue-100 p-6 text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Enter OTP</h3>
                  <p className="text-sm text-gray-600 mb-4">We've sent a 4-digit code to your registered phone</p>
                  <div className="flex justify-center gap-3">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0,4))}
                      className="w-24 text-center px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono"
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleOTPVerification}
                      className="w-full bg-gradient-button hover:brightness-105 active:brightness-95 text-white font-semibold py-3 rounded-lg transition-all"
                    >
                      Verify & Pay
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>

          {/* Summary Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Trip Details</h3>
              <div className="text-sm text-gray-700 space-y-3">
                <div>
                  <div className="font-semibold">{bookingData.busName}</div>
                  <div className="text-xs text-gray-500">{bookingData.duration} • {bookingData.busRating} ★ ({bookingData.busReviews} reviews)</div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure</span>
                    <span className="font-semibold">{bookingData.departure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival</span>
                    <span className="font-semibold">{bookingData.arrival}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blue-100 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Fare Breakdown</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>₹{bookingData.seats.length * bookingData.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">-₹{bookingData.seats.length * (bookingData.originalPrice - bookingData.discountedPrice)}</span>
                </div>
                {flexiAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Flexi Protect</span>
                    <span>₹{flexiAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blue-100 p-6 text-sm text-gray-600">
              <Lock className="w-5 h-5 inline mr-2 text-gray-500" />
              Secure payments powered by local gateway
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
