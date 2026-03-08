'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, Mail, Plane, MapPin } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 lg:p-12 border border-blue-100 shadow-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 50%, #f0fdfa 100%)' }}
        >
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-200/30 rounded-full blur-3xl" />
          
          {/* Floating Icons */}
          <motion.div
            className="absolute top-10 right-20 text-blue-300"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plane className="w-8 h-8" />
          </motion.div>
          <motion.div
            className="absolute bottom-10 right-32 text-cyan-300"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <MapPin className="w-6 h-6" />
          </motion.div>

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full mb-4 shadow-md border border-blue-100"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold">Travel Deals Newsletter</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight mb-4">
                Never Miss a
                <br />
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  Travel Deal Again
                </span>
              </h2>

              <p className="text-gray-600 mb-6">
                Get exclusive flight deals, hotel discounts, and travel tips delivered straight to your inbox every week.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 rounded-full px-6 bg-white border-gray-200 focus:border-blue-500 shadow-md text-gray-900 placeholder:text-gray-400"
                  required
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-full text-white font-semibold border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 px-6"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                Join 50,000+ travelers. Unsubscribe anytime.
              </p>
            </div>

            {/* Right Content - Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-end"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  <Plane className="w-10 h-10 text-white" />
                </div>
                <span 
                  className="text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  Onlyy
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;