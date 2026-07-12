import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Heart } from 'lucide-react';
import { ALL_PINS } from '../data/dummyPins';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { ToastProvider } from '../components/ToastNotifications';
import PinDetailsModal from '../components/PinDetailsModal';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

function SavedPinCard({ pin, onUnsave, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="relative cursor-pointer"
      style={{ borderRadius: 16, overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(pin)}
    >
      <div className="relative w-full" style={{ paddingTop: `${(1 / pin.aspect) * 100}%` }}>
        <img
          src={pin.image}
          alt={pin.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: 16 }}
        />
        {hovered && (
          <div className="absolute inset-0" style={{ borderRadius: 16, background: 'rgba(0,0,0,0.2)' }}>
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => { e.stopPropagation(); onUnsave(pin.id); }}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: '#262622' }}
              >
                Unsave
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="px-1 pt-2 pb-1">
        <p className="text-sm font-semibold truncate" style={{ color: '#000000' }}>{pin.title}</p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs" style={{ color: '#62625b' }}>{pin.user}</span>
          <span className="flex items-center gap-1 text-xs" style={{ color: '#91918c' }}>
            <Heart size={10} />
            {pin.likes.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SavedPins() {
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPins') || '[]'); }
    catch { return []; }
  });
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const savedPins = ALL_PINS.filter((p) => savedIds.includes(p.id));

  const handleUnsave = (id) => {
    const updated = savedIds.filter((sid) => sid !== id);
    setSavedIds(updated);
    localStorage.setItem('savedPins', JSON.stringify(updated));
  };

  // Masonry columns
  const colCount = typeof window !== 'undefined'
    ? window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : 5
    : 5;
  const columns = Array.from({ length: colCount }, () => []);
  const heights = Array.from({ length: colCount }, () => 0);
  savedPins.forEach((pin) => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(pin);
    heights[shortest] += 1 / pin.aspect;
  });

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#ffffff', ...PS }}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#000000', letterSpacing: '-0.8px' }}>Saved Pins</h1>
                <p className="text-sm mt-1" style={{ color: '#62625b' }}>
                  {savedPins.length} {savedPins.length === 1 ? 'pin' : 'pins'} saved
                </p>
              </div>
              <Bookmark size={28} style={{ color: '#e60023' }} />
            </div>

            {savedPins.length === 0 ? (
              <div className="text-center py-24">
                <Bookmark size={64} className="mx-auto mb-4" style={{ color: '#dadad3' }} />
                <h2 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>No saved pins yet</h2>
                <p className="text-sm mb-6" style={{ color: '#62625b' }}>
                  When you save pins from your feed, they'll appear here.
                </p>
                <Link
                  to="/"
                  className="px-6 py-3 rounded-full text-sm font-bold text-white inline-block"
                  style={{ backgroundColor: '#e60023' }}
                >
                  Explore feed
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                {columns.map((col, cIdx) => (
                  <div key={cIdx} className="flex-1 flex flex-col gap-3">
                    {col.map((pin) => (
                      <SavedPinCard
                        key={pin.id}
                        pin={pin}
                        onUnsave={handleUnsave}
                        onClick={(p) => { setSelectedPin(p); setIsModalOpen(true); }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
        <Footer />
        <PinDetailsModal
          pin={selectedPin}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setTimeout(() => setSelectedPin(null), 250); }}
        />
        <ScrollToTopButton />
      </div>
    </ToastProvider>
  );
}
