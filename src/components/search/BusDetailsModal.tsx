'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin as MapPinIcon, ChevronRight } from 'lucide-react';

interface BusDetailsModalProps {
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
  };
  onClose: () => void;
}

const seatRows = [
  { row: 1, seatsPerRow: 4 },
  { row: 2, seatsPerRow: 4 },
  { row: 3, seatsPerRow: 4 },
  { row: 4, seatsPerRow: 4 },
  { row: 5, seatsPerRow: 4 },
  { row: 6, seatsPerRow: 4 },
  { row: 7, seatsPerRow: 4 },
  { row: 8, seatsPerRow: 4 },
  { row: 9, seatsPerRow: 4 },
  { row: 10, seatsPerRow: 4 },
];

interface Seat {
  id: number;
  number: string;
  row: number;
  isAvailable: boolean;
  isSelected: boolean;
  type: 'sleeper' | 'seater';
}

interface PassengerFormData {
  name: string;
  age: string;
  gender: string;
  email: string;
  seatNumber: string;
}

const generateSeats = () => {
  const seats: Seat[] = [];
  let seatId = 1;
  
  seatRows.forEach((rowData) => {
    for (let i = 0; i < rowData.seatsPerRow; i++) {
      const seatLetter = String.fromCharCode(65 + i);
      seats.push({
        id: seatId,
        number: `${rowData.row}${seatLetter}`,
        row: rowData.row,
        isAvailable: Math.random() > 0.4,
        isSelected: false,
        type: rowData.row > 5 ? 'sleeper' : 'seater'
      });
      seatId++;
    }
  });
  
  return seats;
};

type Step = 'seats' | 'boardpoint' | 'passenger';

export default function BusDetailsModal({ bus, onClose }: BusDetailsModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('seats');
  const [seats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerData, setPassengerData] = useState<Record<string, PassengerFormData>>({});
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>('');

  const toggleSeatSelection = (seatNumber: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handlePassengerDataChange = (seatNumber: string, field: string, value: string) => {
    setPassengerData((prev) => ({
      ...prev,
      [seatNumber]: {
        ...prev[seatNumber],
        [field]: value,
        seatNumber
      }
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 'seats' && selectedSeats.length > 0) {
      setCurrentStep('boardpoint');
    } else if (currentStep === 'boardpoint' && selectedBoardingPoint && selectedDroppingPoint) {
      setCurrentStep('passenger');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'boardpoint') {
      setCurrentStep('seats');
    } else if (currentStep === 'passenger') {
      setCurrentStep('boardpoint');
    }
  };

  const handleContinueBooking = () => {
    // Validate passenger data
    const allPassengersComplete = selectedSeats.every(seat => 
      passengerData[seat]?.name && 
      passengerData[seat]?.age && 
      passengerData[seat]?.gender &&
      passengerData[seat]?.email
    );

    if (!allPassengersComplete) {
      alert('Please fill in all passenger details');
      return;
    }

    // Navigate directly to payment page with all booking data
    const passengersArray = selectedSeats.map(seat => passengerData[seat]);
    const bookingData = {
      busName: bus.name,
      busRating: bus.rating,
      busReviews: bus.reviews,
      from: bus.fromCity,
      to: bus.toCity,
      departure: bus.departure,
      arrival: bus.arrival,
      duration: bus.duration,
      originalPrice: bus.originalPrice,
      discountedPrice: bus.discountedPrice,
      discount: bus.discount,
      boardingPoint: selectedBoardingPoint,
      droppingPoint: selectedDroppingPoint,
      bookingDate: bus.bookingDate,
      seats: selectedSeats,
      passengers: passengersArray,
      totalPrice: selectedSeats.length * bus.discountedPrice
    };
    
    router.push(
      `/booking/payment?data=${encodeURIComponent(JSON.stringify(bookingData))}`
    );
    
    onClose();
  };

  const totalPrice = selectedSeats.length * bus.discountedPrice;
  const savedAmount = selectedSeats.length * (bus.originalPrice - bus.discountedPrice);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {bus.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {bus.departure} - {bus.arrival} ({bus.duration})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="bg-blue-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-md">
              <div className={`flex flex-col items-center ${currentStep === 'seats' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 'seats' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                <span className="text-xs mt-1 font-semibold text-gray-700">Seats</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep !== 'seats' ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`flex flex-col items-center ${['boardpoint', 'passenger'].includes(currentStep) ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${['boardpoint', 'passenger'].includes(currentStep) ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                <span className="text-xs mt-1 font-semibold text-gray-700">Points</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep === 'passenger' ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`flex flex-col items-center ${currentStep === 'passenger' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 'passenger' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>3</div>
                <span className="text-xs mt-1 font-semibold text-gray-700">Passenger</span>
              </div>
            </div>
          </div>

          {/* Content with Sliding Animation */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {currentStep === 'seats' && (
                <motion.div
                  key="seats"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Seat Layout */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8 border border-blue-200">
                      <h3 className="text-center font-bold text-slate-900 mb-6">Select Your Seats</h3>
                      
                      {/* Seats Grid */}
                      <div className="space-y-3 mb-8">
                        {seatRows.map((rowData) => (
                          <div key={rowData.row} className="flex justify-center gap-3">
                            {seats
                              .filter(s => s.row === rowData.row)
                              .map((seat) => (
                                <motion.button
                                  key={seat.id}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => seat.isAvailable && toggleSeatSelection(seat.number)}
                                  disabled={!seat.isAvailable}
                                  className={`
                                    w-10 h-10 rounded-lg font-semibold text-xs flex items-center justify-center transition-all border-2
                                    ${selectedSeats.includes(seat.number)
                                      ? 'bg-green-500 border-green-600 text-white shadow-lg'
                                      : seat.isAvailable
                                      ? 'bg-white border-green-400 text-slate-900 hover:bg-blue-50'
                                      : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                                    }
                                  `}
                                >
                                  {seat.number.charAt(0)}
                                </motion.button>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <h4 className="font-bold text-slate-900 mb-2">Selected Seats</h4>
                      {selectedSeats.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedSeats.map((seat, idx) => (
                            <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                              {seat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 mb-4">No seats selected</p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <h4 className="font-semibold text-slate-900 mb-3 text-sm">Price Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Seats:</span>
                          <span className="font-semibold">{selectedSeats.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Per seat:</span>
                          <span className="font-semibold">₹{bus.discountedPrice}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-green-200">
                          <span className="font-semibold text-slate-900">Total:</span>
                          <span className="text-lg font-bold text-green-600">₹{totalPrice}</span>
                        </div>
                        {savedAmount > 0 && (
                          <div className="bg-green-100 text-green-700 rounded p-2 text-xs font-semibold mt-2">
                            💰 Save ₹{savedAmount} ({bus.discount}% off)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'boardpoint' && (
                <motion.div
                  key="boardpoint"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">Boarding & Dropping Points</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Boarding Points */}
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-blue-600" />
                        Boarding Points
                      </h4>
                      <div className="space-y-4">
                        {bus.boardingPoints.map((point, idx) => (
                          <button
                            key={point}
                            type="button"
                            onClick={() => setSelectedBoardingPoint(point)}
                            className={`w-full text-left rounded-lg p-4 border transition-colors ${
                              selectedBoardingPoint === point
                                ? 'bg-blue-100 border-blue-500'
                                : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="font-semibold text-slate-900 mb-1">Option {idx + 1}</div>
                            <div className="text-sm text-gray-700">{point}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dropping Points */}
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-blue-600" />
                        Dropping Points
                      </h4>
                      <div className="space-y-4">
                        {bus.droppingPoints.map((point, idx) => (
                          <button
                            key={point}
                            type="button"
                            onClick={() => setSelectedDroppingPoint(point)}
                            className={`w-full text-left rounded-lg p-4 border transition-colors ${
                              selectedDroppingPoint === point
                                ? 'bg-blue-100 border-blue-500'
                                : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="font-semibold text-slate-900 mb-1">Option {idx + 1}</div>
                            <div className="text-sm text-gray-700">{point}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'passenger' && (
                <motion.div
                  key="passenger"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">Passenger Details</h3>
                  <div className="space-y-6">
                    {selectedSeats.map((seat, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                            {idx + 1}
                          </div>
                          Seat {seat}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={passengerData[seat]?.name || ''}
                            onChange={(e) => handlePassengerDataChange(seat, 'name', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <input
                            type="number"
                            placeholder="Age"
                            min="1"
                            max="120"
                            value={passengerData[seat]?.age || ''}
                            onChange={(e) => handlePassengerDataChange(seat, 'age', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <select 
                            value={passengerData[seat]?.gender || ''}
                            onChange={(e) => handlePassengerDataChange(seat, 'gender', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="email"
                            placeholder="Email"
                            value={passengerData[seat]?.email || ''}
                            onChange={(e) => handlePassengerDataChange(seat, 'email', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with Action Buttons */}
          <div className="bg-white border-t border-gray-200 p-6 flex justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePreviousStep}
              disabled={currentStep === 'seats'}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 'seats'
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              ← Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (currentStep === 'passenger') {
                  handleContinueBooking();
                } else {
                  handleNextStep();
                }
              }}
              disabled={
                (currentStep === 'seats' && selectedSeats.length === 0) ||
                (currentStep === 'boardpoint' && (!selectedBoardingPoint || !selectedDroppingPoint))
              }
              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                ((currentStep === 'seats' && selectedSeats.length === 0) ||
                (currentStep === 'boardpoint' && (!selectedBoardingPoint || !selectedDroppingPoint)))
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
              }`}
            >
              {currentStep === 'passenger' ? (
                <>
                  Proceed to Payment Methods <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next Step <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
