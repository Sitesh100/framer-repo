// components/auth/AuthModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Plane,
  ArrowRight,
  Check,
  Github,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Placeholder images - replace with your actual imports
const travelImages = [
  {
    src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    title: 'Explore Paris',
    subtitle: 'The city of lights awaits you',
  },
  {
    src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
    title: 'Discover Tokyo',
    subtitle: 'Where tradition meets innovation',
  },
  {
    src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    title: 'Experience Bali',
    subtitle: 'Paradise on Earth',
  },
  {
    src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    title: 'Visit Dubai',
    subtitle: 'Luxury beyond imagination',
  },
  {
    src: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
    title: 'Wander Santorini',
    subtitle: 'Greek island dreams',
  },
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, initialView = 'signup' }: AuthModalProps) => {
  const [activeView, setActiveView] = useState<'login' | 'signup'>(initialView);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
  });

  // Preload images for smooth transitions
  useEffect(() => {
    travelImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

  // Image carousel effect - 3 seconds display, then fade
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % travelImages.length);
    }, 5000); // 5 seconds total (3s display + 2s for transition feel)

    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset form when switching views
  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  // Close on escape key & lock body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', loginForm);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup:', signupForm);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-[900px]"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex">
              
              {/* ================================ */}
              {/* LEFT SIDE - Image Carousel */}
              {/* ================================ */}
              <div className="relative hidden md:block w-[45%] min-h-[580px]">
                {/* Base layer - current image */}
                <div className="absolute inset-0">
                  {travelImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{ 
                        opacity: currentImageIndex === index ? 1 : 0,
                        scale: currentImageIndex === index ? 1 : 1.1,
                      }}
                      transition={{ 
                        duration: 1.5, 
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="absolute inset-0"
                      style={{ zIndex: currentImageIndex === index ? 1 : 0 }}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onLoad={() => setIsImageLoaded(true)}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 z-10"
                  style={{ 
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 40%, rgba(30, 58, 138, 0.3) 70%, transparent 100%)' 
                  }}
                />

                {/* Content overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 lg:p-8">
                  {/* Logo */}
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                    >
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-serif font-bold text-white">Onlyy</span>
                  </div>

                  {/* Bottom content */}
                  <div>
                    {/* Text with smooth fade */}
                    <div className="relative h-20 mb-4">
                      {travelImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={false}
                          animate={{ 
                            opacity: currentImageIndex === index ? 1 : 0,
                            y: currentImageIndex === index ? 0 : 20,
                          }}
                          transition={{ 
                            duration: 0.8, 
                            ease: "easeOut",
                            delay: currentImageIndex === index ? 0.3 : 0,
                          }}
                          className="absolute inset-0"
                        >
                          <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
                            {image.title}
                          </h3>
                          <p className="text-white/80 text-sm lg:text-base">
                            {image.subtitle}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Image indicators */}
                    <div className="flex gap-2 mb-5">
                      {travelImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                          style={{ width: index === currentImageIndex ? '32px' : '16px' }}
                        >
                          <div className="absolute inset-0 bg-white/30" />
                          {index === currentImageIndex && (
                            <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 5, ease: 'linear' }}
                              className="absolute inset-0 bg-white rounded-full"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {['500+ Airlines', 'Best Prices', '24/7 Support'].map((feature, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5"
                        >
                          <Check className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs text-white/90">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ================================ */}
              {/* RIGHT SIDE - Auth Forms */}
              {/* ================================ */}
              <div className="relative flex-1 p-6 md:p-8 lg:p-10 min-h-[580px] flex flex-col">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Tab switcher */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
                  <button
                    onClick={() => setActiveView('signup')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeView === 'signup'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => setActiveView('login')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeView === 'login'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Login
                  </button>
                </div>

                {/* Forms Container */}
                <div className="flex-1 flex flex-col">
                  <AnimatePresence mode="wait">
                    {activeView === 'signup' ? (
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-1 flex flex-col"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                            Create your account
                          </h2>
                          <p className="text-gray-500 text-sm">
                            Start your journey with exclusive travel deals
                          </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4 flex-1 flex flex-col">
                          {/* Name */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              Full Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="John Doe"
                                value={signupForm.name}
                                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                required
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                value={signupForm.email}
                                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                required
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                value={signupForm.password}
                                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* Spacer */}
                          <div className="flex-1" />

                          {/* Submit */}
                          <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                          >
                            Create Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>

                          {/* Divider */}
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">or continue with</span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>

                          {/* Social login */}
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 rounded-xl font-medium border-gray-200 hover:bg-gray-50"
                            >
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              Google
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 rounded-xl font-medium border-gray-200 hover:bg-gray-50"
                            >
                              <Github className="w-5 h-5 mr-2" />
                              GitHub
                            </Button>
                          </div>

                          {/* Terms */}
                          <p className="text-xs text-gray-500 text-center">
                            By signing up, you agree to our{' '}
                            <a href="#" className="text-blue-600 hover:underline">Terms</a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                          </p>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-1 flex flex-col"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                            Welcome back
                          </h2>
                          <p className="text-gray-500 text-sm">
                            Login to access your travel dashboard
                          </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4 flex-1 flex flex-col">
                          {/* Email */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                required
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-sm font-medium text-gray-700">
                                Password
                              </label>
                              <a href="#" className="text-xs text-blue-600 hover:underline">
                                Forgot password?
                              </a>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* Remember me */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="remember"
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600">
                              Remember me for 30 days
                            </label>
                          </div>

                          {/* Spacer */}
                          <div className="flex-1" />

                          {/* Submit */}
                          <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                          >
                            Sign In
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>

                          {/* Divider */}
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">or continue with</span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>

                          {/* Social login */}
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 rounded-xl font-medium border-gray-200 hover:bg-gray-50"
                            >
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              Google
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 rounded-xl font-medium border-gray-200 hover:bg-gray-50"
                            >
                              <Github className="w-5 h-5 mr-2" />
                              GitHub
                            </Button>
                          </div>

                          {/* Sign up link */}
                          <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                              type="button"
                              onClick={() => setActiveView('signup')}
                              className="text-blue-600 font-semibold hover:underline"
                            >
                              Sign up for free
                            </button>
                          </p>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;