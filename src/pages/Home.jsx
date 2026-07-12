import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MasonryPinFeed from '../components/MasonryPinFeed';
import TrendingSection from '../components/TrendingSection';
import PinDetailsModal from '../components/PinDetailsModal';
import ScrollToTopButton from '../components/ScrollToTopButton';
import Footer from '../components/Footer';
import { ToastProvider } from '../components/ToastNotifications';
import { useAuth } from '../context/AuthContext';

const PinSans = "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif";

function SectionReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPin = useCallback((pin) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
  }, []);

  const closePin = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPin(null), 250);
  }, []);

  useEffect(() => {
    const onOpenPin = (e) => {
      if (e?.detail?.pin) openPin(e.detail.pin);
    };
    window.addEventListener('open-pin-modal', onOpenPin);
    return () => window.removeEventListener('open-pin-modal', onOpenPin);
  }, [openPin]);

  return (
    <ToastProvider>
      <div
        className="flex min-h-screen flex-col"
        style={{ backgroundColor: '#ffffff', fontFamily: PinSans }}
      >
        {/* Global Header */}
        <Header />

        {/* App shell: sidebar + main */}
        <div className="flex flex-1">
          {/* Sidebar rail */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main content panel */}
          <main className="flex-1 min-w-0">
            {/* Hero panel inside main content */}
            <section
              className="relative overflow-hidden"
              style={{
                backgroundColor: '#f6f6f3',
                borderBottom: '1px solid #dadad3',
              }}
            >
              <div className="mx-auto max-w-7xl px-6 py-10 md:py-14 lg:py-16">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                  {/* Text */}
                  <div className="max-w-xl">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="font-semibold tracking-tight text-[#000000]"
                      style={{
                        fontFamily: PinSans,
                        fontSize: 'clamp(36px, 5vw, 56px)',
                        lineHeight: 1.1,
                        letterSpacing: '-1.2px',
                      }}
                    >
                      Find your next idea
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
                      className="mt-3 text-[#33332e]"
                      style={{
                        fontFamily: PinSans,
                        fontSize: 'clamp(16px, 2vw, 20px)',
                        lineHeight: 1.4,
                      }}
                    >
                      Explore a world of inspiration — from nature and travel to food, fashion, and art.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
                      className="mt-5 flex flex-wrap items-center gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('masonry-feed');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-105 active:scale-95"
                        style={{
                          backgroundColor: '#e60023',
                          fontFamily: PinSans,
                        }}
                      >
                        Explore feed
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(isAuthenticated ? '/profile' : '/signup')}
                        className="rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95"
                        style={{
                          backgroundColor: '#e5e5e0',
                          color: '#000000',
                          fontFamily: PinSans,
                        }}
                      >
                        {isAuthenticated ? 'My Profile' : 'Get Started'}
                      </button>
                    </motion.div>
                  </div>

                  {/* Preview card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
                    className="hidden md:block"
                  >
                    <div
                      className="relative w-72 overflow-hidden shadow-md lg:w-80"
                      style={{
                        borderRadius: 16,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <img
                        src="/src/assets/nature_photography_landscape.jpg"
                        alt="Preview"
                        className="h-48 w-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="px-4 py-3">
                        <p
                          className="text-sm font-semibold text-[#000000]"
                          style={{ fontFamily: PinSans }}
                        >
                          Golden hour in the mountains
                        </p>
                        <p
                          className="mt-0.5 text-xs font-medium text-[#62625b]"
                          style={{ fontFamily: PinSans }}
                        >
                          alex_creates
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Feature bento tiles */}
            <section className="mx-auto max-w-7xl px-6 py-8 md:py-10">
              <SectionReveal>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Large tile */}
                  <div
                    className="group relative col-span-1 overflow-hidden sm:col-span-2 lg:col-span-2"
                    style={{ borderRadius: 16 }}
                  >
                    <img
                      src="/src/assets/travel_adventure_mountains.jpg"
                      alt="Travel"
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: PinSans }}
                      >
                        Travel
                      </p>
                      <p
                        className="mt-0.5 text-sm text-white/80"
                        style={{ fontFamily: PinSans }}
                      >
                        Plan your next adventure
                      </p>
                    </div>
                  </div>

                  {/* Medium tile */}
                  <div
                    className="group relative col-span-1 overflow-hidden"
                    style={{ borderRadius: 16 }}
                  >
                    <img
                      src="/src/assets/food_gourmet_aesthetic.jpg"
                      alt="Food"
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: PinSans }}
                      >
                        Food
                      </p>
                      <p
                        className="mt-0.5 text-sm text-white/80"
                        style={{ fontFamily: PinSans }}
                      >
                        Recipes worth saving
                      </p>
                    </div>
                  </div>

                  {/* Medium tile */}
                  <div
                    className="group relative col-span-1 overflow-hidden"
                    style={{ borderRadius: 16 }}
                  >
                    <img
                      src="/src/assets/fashion_style_outfit.jpg"
                      alt="Fashion"
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: PinSans }}
                      >
                        Fashion
                      </p>
                      <p
                        className="mt-0.5 text-sm text-white/80"
                        style={{ fontFamily: PinSans }}
                      >
                        Style inspiration
                      </p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </section>

            {/* Inline CTA band */}
            <section className="mx-auto max-w-7xl px-6 pb-6 md:pb-8">
              <SectionReveal delay={0.1}>
                <div
                  className="flex flex-col items-start justify-between gap-4 rounded-2xl px-6 py-5 sm:flex-row sm:items-center"
                  style={{
                    backgroundColor: '#f6f6f3',
                    border: '1px solid #dadad3',
                    fontFamily: PinSans,
                  }}
                >
                  <div>
                    <p
                      className="text-base font-bold text-[#000000]"
                      style={{ fontFamily: PinSans }}
                    >
                      Save ideas you love
                    </p>
                    <p
                      className="mt-0.5 text-sm text-[#62625b]"
                      style={{ fontFamily: PinSans }}
                    >
                      Join to collect pins, follow creators, and build your own boards.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(isAuthenticated ? '/upload' : '/signup')}
                    className="shrink-0 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-105 active:scale-95"
                    style={{
                      backgroundColor: '#e60023',
                      fontFamily: PinSans,
                    }}
                  >
                    {isAuthenticated ? 'Create Pin' : 'Get Started'}
                  </button>
                </div>
              </SectionReveal>
            </section>

            {/* Trending Section */}
            <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 md:px-8">
              <SectionReveal delay={0.08}>
                <TrendingSection />
              </SectionReveal>
            </section>

            {/* Masonry feed */}
            <section id="masonry-feed" className="mx-auto max-w-7xl px-2 pb-10 sm:px-4 md:px-6">
              <SectionReveal delay={0.05}>
                <div className="mb-5 flex items-center gap-3">
                  <h2
                    className="text-xl font-bold tracking-tight"
                    style={{ color: '#000000', fontFamily: "'Pin Sans','Inter',ui-sans-serif,system-ui,sans-serif" }}
                  >
                    All Pins
                  </h2>
                  <span
                    className="rounded-full px-3 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: '#f6f6f3', color: '#62625b', border: '1px solid #dadad3' }}
                  >
                    Explore everything
                  </span>
                </div>
                <MasonryPinFeed />
              </SectionReveal>
            </section>

            {/* Footer inside main panel */}
            <Footer />
          </main>
        </div>

        {/* Global overlays */}
        <PinDetailsModal
          pin={selectedPin}
          isOpen={isModalOpen}
          onClose={closePin}
        />
        <ScrollToTopButton />
      </div>
    </ToastProvider>
  );
}
