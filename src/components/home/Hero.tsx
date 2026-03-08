'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Plane, 
  FileCheck, 
  Building2, 
  MapPin, 
  Calendar,
  Users,
  Search,
  Star,
  TrendingDown,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Import your images
import testimonial1 from '@/src/app/assets/testimonial-1.jpg';
import testimonial2 from '@/src/app/assets/testimonial-2.jpg';
import testimonial3 from '@/src/app/assets/testimonial-3.jpg';
import  {TripTypeDropdown} from './TripTypeDropdown';

const tabs = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Building2 },
  { id: 'visa', label: 'Visa', icon: FileCheck },
  { id: 'packages', label: 'Packages', icon: MapPin },
];

const popularDestinations = [
  { city: 'Paris', country: 'France', price: '$299', image: '🗼' },
  { city: 'Tokyo', country: 'Japan', price: '$549', image: '🗾' },
  { city: 'Dubai', country: 'UAE', price: '$399', image: '🏙️' },
  { city: 'Bali', country: 'Indonesia', price: '$449', image: '🏝️' },
];

const Hero = () => {
  const [activeTab, setActiveTab] = useState('flights');

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-16">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #0c4a6e 60%, #0891b2 100%)' 
          }}
        />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating circles */}
          <motion.div 
            className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Plane animation */}
          <motion.div
            className="absolute top-32 right-10 text-white/10"
            animate={{ 
              x: [-100, 1500],
              y: [0, -50],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Plane className="w-8 h-8 rotate-45" />
          </motion.div>
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT - CONSISTENT MAX-W-6XL */}
      {/* ============================================ */}
      <div className="relative max-w-6xl mx-auto px-4 lg:px-8">
        
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
            <div className="flex -space-x-2">
              {[testimonial1, testimonial2, testimonial3].map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt="User"
                  className="w-7 h-7 rounded-full border-2 border-white/50 object-cover"
                />
              ))}
            </div>
            <span className="text-sm text-white/90">2M+ Happy Travelers</span>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full px-4 py-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">Best Price Guaranteed</span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-white/90">4.9/5 Rating</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
            Your Dream Trip,
            <br />
            <span className="relative inline-block">
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #06b6d4 100%)' }}
              >
                Unbeatable Prices
              </span>
              {/* Decorative underline */}
              <motion.svg 
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <motion.path
                  d="M2 8 Q 75 2, 150 8 T 298 8"
                  fill="none"
                  stroke="url(#underlineGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Compare flights, hotels, visas & tour packages from 500+ providers. 
            Save up to <span className="text-cyan-400 font-semibold">40%</span> on your next adventure.
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* SEARCH BOX - FULL WIDTH OF MAX-W-6XL */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="w-full"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-3 md:p-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4 px-2">
  <TripTypeDropdown />
</div>
            <div className="flex gap-1 mb-4 bg-gray-100 rounded-2xl p-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300
                      ${activeTab === tab.id 
                        ? 'bg-white text-blue-600 shadow-md' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-2">
              {/* From */}
              <div className="md:col-span-3 relative">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">From</label>
                <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="City or Airport"
                    className="bg-transparent outline-none text-gray-900 placeholder:text-gray-400 w-full text-sm font-medium"
                  />
                </div>
              </div>

              {/* Swap Button (for flights) */}
              {activeTab === 'flights' && (
                <div className="hidden md:flex md:col-span-1 items-end justify-center pb-3">
                  <motion.button 
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-colors shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <ArrowRight className="w-4 h-4 -ml-2" />
                  </motion.button>
                </div>
              )}

              {/* To */}
              <div className={`${activeTab === 'flights' ? 'md:col-span-3' : 'md:col-span-4'} relative`}>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                  {activeTab === 'hotels' ? 'Destination' : 'To'}
                </label>
                <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <MapPin className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder={activeTab === 'hotels' ? 'Where are you going?' : 'City or Airport'}
                    className="bg-transparent outline-none text-gray-900 placeholder:text-gray-400 w-full text-sm font-medium"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-2 relative">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                  {activeTab === 'hotels' ? 'Check-in' : 'Departure'}
                </label>
                <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-900 text-sm font-medium">Select Date</span>
                </div>
              </div>

              {/* Travelers */}
              <div className="md:col-span-2 relative">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Travelers</label>
                <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <Users className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-900 text-sm font-medium">2 Adults</span>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1 flex items-end">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-[52px] rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10"
        >
          {[
            { icon: Shield, label: 'Secure Booking', value: '100%' },
            { icon: Clock, label: '24/7 Support', value: 'Always' },
            { icon: TrendingDown, label: 'Price Match', value: 'Guaranteed' },
            { icon: Star, label: 'Reviews', value: '50K+' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-11 h-11 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-white/60">{stat.label}</p>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Popular Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-14"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-semibold text-white">Popular Destinations</h3>
              <p className="text-sm text-white/60 mt-1">Top picks for your next adventure</p>
            </div>
            <motion.button 
              whileHover={{ x: 5 }}
              className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 cursor-pointer hover:bg-white/15 hover:border-white/30 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{dest.image}</div>
                <h4 className="text-white font-semibold text-lg">{dest.city}</h4>
                <p className="text-white/60 text-sm">{dest.country}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span 
                    className="font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%)' }}
                  >
                    from {dest.price}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* FLOATING DEAL CARDS - OUTSIDE CONTAINER */}
      {/* ============================================ */}
      {/* Floating Deal Cards */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute left-4 lg:left-8 top-48 hidden lg:block"
    >
      <div className="bg-white rounded-2xl p-4 shadow-xl animate-float max-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-gray-500">Flash Deal!</span>
        </div>
        <p className="text-sm font-semibold text-gray-900">Paris → London</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-400 line-through text-sm">$299</span>
          <span className="text-emerald-600 font-bold">$149</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">50% OFF</span>
        </div>
      </div>
    </motion.div>


      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute right-4 lg:right-8 xl:right-16 top-64 hidden xl:block"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="bg-white rounded-2xl p-4 shadow-2xl max-w-[220px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
            >
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500">Hotel Deal</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">5★ Resort in Bali</p>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 line-through text-sm">$450/night</span>
            <span 
              className="font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
            >
              $199/night
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;