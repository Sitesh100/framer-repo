'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/src/components/shared/Header';
import Footer from '@/src/components/shared/Footer';
import { toast } from 'sonner';
import FAQ from '@/src/components/home/FAQ';

const subjects = [
  'Pricing',
  'Technical Support',
  'Feature Request',
  'Partnership',
  'Other',
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warning("Please enter a valid email address");
      return;
    }

    toast.success("Message sent! We'll get back to you as soon as possible.");
    setFormData({ name: '', surname: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background - Blue Theme */}
      <div 
        className="absolute inset-0 h-[900px]"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #0c4a6e 60%, #0891b2 100%)' }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 h-[900px] overflow-hidden">
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
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-6 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white/90"
        >
          <Mail className="w-4 h-4 text-cyan-400" />
          Contact
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6"
        >
          Get In Touch With Our Team
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto text-white/70"
        >
          Have questions about our travel deals? We're here to help you plan your perfect getaway.
        </motion.p>
      </section>

      {/* Contact Section */}
      <section className="pb-32 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            
            {/* Left Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-72 space-y-6"
            >
              {/* Email Card */}
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Email Us</h3>
                <p className="text-white/60 text-sm mb-4">
                  Facing a more technical issue?<br />
                  Need an expert? We're here.
                </p>
                <a
                  href="mailto:support@marqo.com"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                >
                  support@marqo.com
                </a>
              </div>

              {/* Sales Card */}
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)' }}
                >
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Contact Sales</h3>
                <p className="text-white/60 text-sm mb-4">
                  Questions about custom pricing?<br />
                  Feature picking? We'll handle it.
                </p>
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                >
                  Book a call with sales
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-8"
            >
              <h3 className="text-2xl font-serif font-bold text-white mb-1">
                We'd Love To Answer Your Questions
              </h3>
              <p className="text-white/60 mb-8">
                Send us a message and we'll get back to you as soon as possible
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1.5 block">First Name</label>
                    <input
                      placeholder="John"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1.5 block">Last Name</label>
                    <input
                      placeholder="Doe"
                      value={formData.surname}
                      onChange={(e) => setFormData({...formData, surname: e.target.value})}
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    placeholder="john@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 mb-1.5 block">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">Select a subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject} className="bg-slate-800">{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 mb-1.5 block">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full rounded-full py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
                >
                  <Send className="w-4 h-4" />
                  Send your message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="bg-white">
        <div className='max-w-6xl mx-auto'>
          <FAQ />
        </div>
      </div>

      {/* Footer */}
      <div className='bg-white'>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;