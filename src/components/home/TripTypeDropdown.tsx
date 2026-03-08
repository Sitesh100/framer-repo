'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, RefreshCw, LayoutGrid } from 'lucide-react';

const tripTypes = [
  {
    id: 'one-way',
    label: 'One way',
    icon: ArrowRight,
    description: 'Single direction travel',
  },
  {
    id: 'return',
    label: 'Return',
    icon: RefreshCw,
    description: 'Round trip with return',
  },
  {
    id: 'multi-city',
    label: 'Multi-city',
    icon: LayoutGrid,
    description: 'Multiple destinations',
  },
];

export const TripTypeDropdown = () => {
  const [selected, setSelected] = useState(tripTypes[1]); // Default: Return
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: typeof tripTypes[0]) => {
    setSelected(type);
    setIsOpen(false);
  };

  const SelectedIcon = selected.icon;

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200"
        style={{
          background: isOpen
            ? 'rgba(59, 130, 246, 0.1)'
            : 'rgba(243, 244, 246, 1)',
          borderColor: isOpen
            ? 'rgba(59, 130, 246, 0.5)'
            : 'rgba(229, 231, 235, 1)',
          color: '#1f2937',
          backdropFilter: 'blur(12px)',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(59, 130, 246, 0.15)'
            : '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        <SelectedIcon className="w-4 h-4 text-blue-500" />
        <span>{selected.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-52 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(229, 231, 235, 1)',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(59, 130, 246, 0.08)',
            }}
          >
            <div className="p-1.5">
              {tripTypes.map((type, index) => {
                const Icon = type.icon;
                const isActive = selected.id === type.id;

                return (
                  <motion.button
                    key={type.id}
                    onClick={() => handleSelect(type)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group"
                    style={{
                      background: isActive
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background =
                          'rgba(243, 244, 246, 1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: isActive
                          ? 'rgba(59, 130, 246, 0.15)'
                          : 'rgba(243, 244, 246, 1)',
                      }}
                    >
                      <Icon
                        className="w-4 h-4 transition-colors"
                        style={{ color: isActive ? '#3b82f6' : 'rgba(107, 114, 128, 1)' }}
                      />
                    </div>

                    {/* Labels */}
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold leading-tight"
                        style={{ color: isActive ? '#3b82f6' : '#1f2937' }}
                      >
                        {type.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(107, 114, 128, 1)' }}>
                        {type.description}
                      </p>
                    </div>

                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom glow accent */}
            <div
              className="h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
