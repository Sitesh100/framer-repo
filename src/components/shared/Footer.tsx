'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Phone,
  Youtube,
  Twitter,
  Instagram,
  Send,
  MapPin,
  ArrowUpRight,
  Plane,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-50 rounded-full blur-3xl opacity-50" />

      <div className="relative container max-w-6xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        {/* TOP – Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-10 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
              Ready For Your Next
              <br />
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
              >
                Adventure?
              </span>
            </h2>

            <p className="text-gray-600 mt-4 mb-6">
              Get exclusive travel deals and tips delivered to your inbox.
            </p>

            <div className="flex max-w-md items-center gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <button 
                className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-start lg:justify-end items-center gap-2.5">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
            >
              <Plane className="w-6 h-6 text-white" />
            </motion.div>
            <span 
              className="text-3xl font-serif font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
            >
              Onlyy
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-14 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* MIDDLE GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-10"
        >
          {/* Travel */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Travel
            </h4>
            <div className="space-y-3 text-sm">
              {[
                { name: 'Flights', href: '/' },
                { name: 'Hotels', href: '/' },
                { name: 'Trains', href: '/' },
                { name: 'Packages', href: '/' },
                { name: 'Deals', href: '/' },
              ].map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group"
                >
                  {item.name}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <div className="space-y-3 text-sm">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers' },
                { name: 'Press', href: '/press' },
                { name: 'Blog', href: '/blog' },
              ].map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group"
                >
                  {item.name}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-4 text-sm">
              <a 
                href="mailto:hello@Onlyy.com" 
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                hello@Onlyy.com
              </a>
              <a 
                href="tel:+1234567890" 
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                1-800-TRAVEL
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Headquarters
            </h4>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <p>
                123 Travel Street
                <br />
                San Francisco, CA 94102
              </p>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* BOTTOM BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm"
        >
          {/* Socials */}
          <div className="flex gap-3">
            {[
              { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
              { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>

          {/* Legal */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500">
            <a href="/privacy" className="hover:text-blue-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-600 transition-colors duration-200">
              Terms & Conditions
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400">
              © {new Date().getFullYear()} Onlyy. All rights reserved.
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;