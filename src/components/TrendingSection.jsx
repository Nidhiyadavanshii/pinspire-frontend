import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import animalsImg from '../assets/animals_wildlife_cute.jpg';
import architectureImg from '../assets/architecture_modern_building.jpg';
import artImg from '../assets/art_creative_painting.jpg';
import fashionImg from '../assets/fashion_style_outfit.jpg';
import foodImg from '../assets/food_gourmet_aesthetic.jpg';
import gamingImg from '../assets/gaming_setup_neon.jpg';
import natureImg from '../assets/nature_photography_landscape.jpg';
import techImg from '../assets/technology_gadgets_modern.jpg';
import travelImg from '../assets/travel_adventure_mountains.jpg';

const PinSans = "'Pin Sans','Inter',ui-sans-serif,system-ui,sans-serif";

const TRENDING_PINS = [
  { id: 'tr-1', image: natureImg,       title: 'Golden hour peaks',      user: 'nature_paul',   category: 'Nature',       likes: 8420 },
  { id: 'tr-2', image: fashionImg,      title: 'Street style Tokyo',     user: 'style_riley',   category: 'Fashion',      likes: 6310 },
  { id: 'tr-3', image: foodImg,         title: 'Sunday brunch goals',    user: 'foodie_lisa',   category: 'Food',         likes: 5980 },
  { id: 'tr-4', image: travelImg,       title: 'Wanderlust diary',       user: 'travel_june',   category: 'Travel',       likes: 5540 },
  { id: 'tr-5', image: artImg,          title: 'Abstract acrylic study', user: 'art_by_kai',    category: 'Art',          likes: 4870 },
  { id: 'tr-6', image: gamingImg,       title: 'Neon gaming corner',     user: 'tech_noah',     category: 'Gaming',       likes: 4210 },
  { id: 'tr-7', image: architectureImg, title: 'Concrete curves',        user: 'design_mike',   category: 'Architecture', likes: 3990 },
  { id: 'tr-8', image: techImg,         title: 'Minimal desk setup',     user: 'pixel_mia',     category: 'Technology',   likes: 3640 },
  { id: 'tr-9', image: animalsImg,      title: 'Puppy eyes forever',     user: 'alex_creates',  category: 'Animals',      likes: 3210 },
];

const TRENDING_TAGS = [
  { label: 'Nature',       emoji: '🌿' },
  { label: 'Travel',       emoji: '✈️' },
  { label: 'Food',         emoji: '🍜' },
  { label: 'Fashion',      emoji: '👗' },
  { label: 'Art',          emoji: '🎨' },
  { label: 'Gaming',       emoji: '🎮' },
  { label: 'Architecture', emoji: '🏛️' },
  { label: 'Technology',   emoji: '💻' },
  { label: 'Animals',      emoji: '🐾' },
];

function TrendingTag({ label, emoji, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95"
      style={{
        fontFamily: PinSans,
        backgroundColor: active ? '#e60023' : '#f6f6f3',
        color: active ? '#ffffff' : '#000000',
        border: active ? '1.5px solid #e60023' : '1.5px solid #dadad3',
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

function TrendingCard({ pin, rank }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPins') || '[]').includes(pin.id); }
    catch { return false; }
  });

  const handleSave = (e) => {
    e.stopPropagation();
    const savedIds = JSON.parse(localStorage.getItem('savedPins') || '[]');
    const updated = saved ? savedIds.filter(id => id !== pin.id) : [...savedIds, pin.id];
    localStorage.setItem('savedPins', JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: rank * 0.04 }}
      className="relative shrink-0 cursor-pointer group"
      style={{ width: 200, borderRadius: 16, overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/pin/${pin.id}`)}
    >
      {/* Image */}
      <div className="relative" style={{ height: 240 }}>
        <img
          src={pin.image}
          alt={pin.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ borderRadius: 16 }}
        />

        {/* Rank badge */}
        <div
          className="absolute top-3 left-3 flex items-center justify-center font-bold text-sm"
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            backgroundColor: rank < 3 ? '#e60023' : '#ffffff',
            color: rank < 3 ? '#ffffff' : '#000000',
            fontFamily: PinSans,
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        >
          {rank + 1}
        </div>

        {/* Trending fire badge */}
        {rank < 3 && (
          <div
            className="absolute top-3 right-3 text-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              borderRadius: 9999,
              padding: '2px 8px',
              fontFamily: PinSans,
              fontSize: 12,
              fontWeight: 700,
              color: '#e60023',
            }}
          >
            🔥 Hot
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0"
              style={{ borderRadius: 16, background: 'rgba(0,0,0,0.14)' }}
            />
          )}
        </AnimatePresence>

        {/* Save button on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              onClick={handleSave}
              className="absolute bottom-3 right-3 px-4 py-1.5 text-sm font-bold"
              style={{
                borderRadius: 9999,
                backgroundColor: saved ? '#262622' : '#e60023',
                color: '#ffffff',
                fontFamily: PinSans,
              }}
            >
              {saved ? 'Saved' : 'Save'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Meta */}
      <div className="px-2 pt-2 pb-1" style={{ backgroundColor: '#ffffff' }}>
        <p
          className="text-sm font-semibold truncate"
          style={{ color: '#000000', fontFamily: PinSans }}
        >
          {pin.title}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs" style={{ color: '#62625b', fontFamily: PinSans }}>
            {pin.user}
          </span>
          <span className="text-xs" style={{ color: '#91918c', fontFamily: PinSans }}>
            {pin.likes.toLocaleString()} ♥
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrendingSection() {
  const [activeTag, setActiveTag] = useState(null);
  const scrollRef = useRef(null);

  const filtered = activeTag
    ? TRENDING_PINS.filter(p => p.category === activeTag)
    : TRENDING_PINS;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  return (
    <div className="w-full pb-2">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#fff0f2', color: '#e60023', border: '1.5px solid #ffd6dc' }}
          >
            <span>🔥</span>
            <span>Trending Now</span>
          </div>
          <h2
            className="text-xl font-bold tracking-tight"
            style={{ color: '#000000', fontFamily: PinSans }}
          >
            What's Hot
          </h2>
        </div>
        {/* Scroll arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 hover:bg-[#f6f6f3] active:scale-95"
            style={{ border: '1.5px solid #dadad3' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 hover:bg-[#f6f6f3] active:scale-95"
            style={{ border: '1.5px solid #dadad3' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tag filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
        <TrendingTag
          label="All"
          emoji="✨"
          active={activeTag === null}
          onClick={() => setActiveTag(null)}
        />
        {TRENDING_TAGS.map(t => (
          <TrendingTag
            key={t.label}
            label={t.label}
            emoji={t.emoji}
            active={activeTag === t.label}
            onClick={() => setActiveTag(activeTag === t.label ? null : t.label)}
          />
        ))}
      </div>

      {/* Horizontally scrollable pin row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((pin, i) => (
            <TrendingCard key={pin.id} pin={pin} rank={i} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div
            className="flex items-center justify-center w-full py-12 text-sm"
            style={{ color: '#91918c', fontFamily: PinSans }}
          >
            No trending pins in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
