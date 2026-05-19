'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Plane, UserPlus, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '@/components/auth/AuthModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  // { name: 'Visas', href: '/visa' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

type AuthUser = {
  name: string;
  email: string;
  profileImage?: string;
};

const AUTH_USER_KEY = 'onlyy-auth-user';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('signup');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedUser = window.localStorage.getItem(AUTH_USER_KEY);
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser) as AuthUser;
    } catch {
      window.localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
  });
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const syncAuthFromStorage = () => {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (!savedUser) {
        setAuthUser(null);
        return;
      }
      try {
        setAuthUser(JSON.parse(savedUser) as AuthUser);
      } catch {
        localStorage.removeItem(AUTH_USER_KEY);
        setAuthUser(null);
      }
    };

    window.addEventListener('auth-changed', syncAuthFromStorage);
    return () => window.removeEventListener('auth-changed', syncAuthFromStorage);
  }, []);

  const openSignup = () => {
    setAuthModalView('signup');
    setIsAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthModalView('login');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setAuthUser(user);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    window.dispatchEvent(new Event('auth-changed'));
    setAuthUser(null);
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
  };

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-2rem)] max-w-[1440px]"
      >
        <div
          className={`
            rounded-2xl
            transition-all duration-300 ease-out
            bg-white/95 backdrop-blur-xl border border-gray-200/80
            ${isScrolled
              ? 'shadow-xl shadow-blue-500/5'
              : 'shadow-lg'
            }
          `}
        >
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 lg:h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  <Plane className="w-5 h-5 text-white" />
                </motion.div>
                <span
                  className="text-xl lg:text-2xl font-serif font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  Onlyy
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                      active
                        ? 'text-blue-700 bg-blue-100'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )})}
              </nav>

              {/* Desktop Auth/Profile */}
              <div className="hidden lg:flex items-center gap-3">
                {authUser ? (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 pr-3 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                      aria-label="Account menu"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                        {authUser.profileImage ? (
                          <img
                            src={authUser.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
                        >
                          <Link
                            href="/personal-information"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            Personal Information
                          </Link>
                          <Link
                            href="/previous-trip"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            Previous Trip
                          </Link>
                          <Link
                            href="/wallet"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            Onlyy Wallet
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={openLogin}
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={openSignup}
                      className="rounded-full text-white font-semibold px-5 border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden overflow-hidden border-t border-gray-100"
              >
                <nav className="px-4 py-4 flex flex-col gap-1 bg-white rounded-b-2xl">
                  {navLinks.map((link, index) => {
                    const active = isLinkActive(link.href);
                    return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Link
                        href={link.href}
                        className={`block text-sm font-medium transition-all duration-200 py-3 px-4 rounded-xl ${
                          active
                            ? 'text-blue-700 bg-blue-100'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => {
                          setIsMenuOpen(false);
                        }}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  )})}
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    {authUser ? (
                      <>
                        <div className="flex items-center gap-3 px-2 py-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                            {authUser.profileImage ? (
                              <img src={authUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{authUser.name || 'Account'}</p>
                            <p className="text-xs text-gray-500 truncate">{authUser.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/personal-information"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full text-left rounded-xl font-medium px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          Personal Information
                        </Link>
                        <Link
                          href="/previous-trip"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full text-left rounded-xl font-medium px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          Previous Trip
                        </Link>
                        <Link
                          href="/wallet"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full text-left rounded-xl font-medium px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          Onlyy Wallet
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left rounded-xl font-medium px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsMenuOpen(false);
                            openLogin();
                          }}
                          className="w-full rounded-xl font-medium"
                        >
                          Login
                        </Button>
                        <Button
                          onClick={() => {
                            setIsMenuOpen(false);
                            openSignup();
                          }}
                          className="w-full rounded-xl text-white font-semibold border-0"
                          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Sign Up
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;
