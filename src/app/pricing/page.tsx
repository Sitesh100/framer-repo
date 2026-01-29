'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Plane, Building2, Train } from 'lucide-react';
import Header from '@/src/components/shared/Header';
import Footer from '@/src/components/shared/Footer';

const plans = [
  {
    name: 'Explorer',
    description: 'Perfect for occasional travelers looking for great deals.',
    price: 0,
    cta: 'Start Free',
    popular: false,
    features: [
      'Basic flight search',
      'Price alerts (3 routes)',
      'Standard support',
      '1 user account',
    ],
  },
  {
    name: 'Voyager',
    description: 'For frequent travelers who want the best deals every time.',
    price: 19,
    cta: 'Get Started',
    popular: true,
    features: [
      'Unlimited flight searches',
      'Price alerts (unlimited)',
      'Hotel & train bookings',
      'Priority customer support',
      '5 user accounts',
    ],
  },
  {
    name: 'Business',
    description: 'For companies managing corporate travel at scale.',
    price: 99,
    cta: 'Talk to Sales',
    popular: false,
    features: [
      'Everything in Voyager',
      'Dedicated account manager',
      'Custom reporting & API',
      'Expense management',
      'Unlimited users',
    ],
  },
];

const Pricing = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background - Blue Theme */}
      <div 
        className="absolute inset-0 h-[800px]"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #0c4a6e 60%, #0891b2 100%)' }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 h-[800px] overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Flying plane animation */}
        <motion.div
          className="absolute top-32 right-10 text-white/10"
          animate={{ x: [-100, 1500], y: [0, -50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Plane className="w-8 h-8 rotate-45" />
        </motion.div>
      </div> 

      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-6 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white/90"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Pricing
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6"
        >
          Simple, Transparent Pricing
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-white/70 mb-10"
        >
          Choose the perfect plan for your travel needs. Save more on every trip with our premium features.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-1"
        >
          <button
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              billing === 'monthly'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              billing === 'yearly'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Yearly
            <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 pb-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`relative rounded-3xl border backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular 
                    ? 'bg-white border-transparent shadow-2xl' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                {plan.popular && (
                  <span 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                  >
                    Most Popular
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.popular ? '' : 'bg-white/20'
                    }`}
                    style={plan.popular ? { background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' } : {}}
                  >
                    {i === 0 && <Plane className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-cyan-400'}`} />}
                    {i === 1 && <Sparkles className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-cyan-400'}`} />}
                    {i === 2 && <Building2 className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-cyan-400'}`} />}
                  </div>
                  <h3 className={`text-2xl font-serif font-bold ${plan.popular ? 'text-gray-900' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                </div>
                
                <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-600' : 'text-white/60'}`}>
                  {plan.description}
                </p>

                <div className="mb-1">
                  <span 
                    className={`text-4xl font-bold ${plan.popular ? '' : 'text-white'}`}
                    style={plan.popular ? { 
                      background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    } : {}}
                  >
                    ${billing === 'yearly' ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-gray-500' : 'text-white/60'}`}> /month</span>
                </div>

                <p className={`text-xs mb-6 ${plan.popular ? 'text-gray-500' : 'text-white/50'}`}>
                  {billing === 'yearly' ? 'Billed annually' : 'Cancel anytime'}
                </p>

                <button
                  className={`w-full rounded-full py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    plan.popular
                      ? 'text-white shadow-lg hover:shadow-xl'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                  style={plan.popular ? { background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' } : {}}
                >
                  {plan.cta}
                </button>

                <div className="mt-8">
                  <p className={`text-sm font-semibold mb-4 ${plan.popular ? 'text-gray-900' : 'text-white'}`}>
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-center gap-3 text-sm ${plan.popular ? 'text-gray-600' : 'text-white/80'}`}
                      >
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom CTA */}
      <section className="relative z-10 pb-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  Need a Custom Travel Solution?
                </h3>
                <p className="text-white/60 text-sm">
                  Managing corporate travel for a large team? Let's create a custom plan for you.
                </p>
              </div>
            </div>

            <button 
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Contact our team
            </button>
          </motion.div>
        </div>
      </section>

      <div className='bg-white'>
        <Footer />
      </div>
    </div>
  );
};

export default Pricing;