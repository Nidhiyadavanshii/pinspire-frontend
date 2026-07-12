import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Local assets (photos are the load-bearing visual element)
import animalsImg from "../assets/animals_wildlife_cute.jpg";
import architectureImg from "../assets/architecture_modern_building.jpg";
import artImg from "../assets/art_creative_painting.jpg";
import fashionImg from "../assets/fashion_style_outfit.jpg";
import foodImg from "../assets/food_gourmet_aesthetic.jpg";
import gamingImg from "../assets/gaming_setup_neon.jpg";
import natureImg from "../assets/nature_photography_landscape.jpg";
import techImg from "../assets/technology_gadgets_modern.jpg";
import travelImg from "../assets/travel_adventure_mountains.jpg";

const IMAGES = [
  animalsImg,
  architectureImg,
  artImg,
  fashionImg,
  foodImg,
  gamingImg,
  natureImg,
  techImg,
  travelImg,
];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function makePins(count, offset = 0) {
  const rng = seededRandom(offset + 42);
  const titles = [
    "Golden hour in the mountains",
    "Minimalist desk setup",
    "Sunday brunch goals",
    "Abstract acrylic study",
    "Street style Tokyo",
    "Cabin in the woods",
    "Neon nights",
    "Modern facade lines",
    "Puppy eyes",
    "Wanderlust diary",
    "Pastel palette kitchen",
    "Botanical illustration",
    "City lights reflection",
    "Vintage denim layers",
    "Morning mist lake",
    "Retro gaming corner",
    "Concrete curves",
    "Macro leaf veins",
    "Coastal sunset tones",
    "Sneaker collection",
  ];
  const users = [
    "alex_creates",
    "sarah_snaps",
    "design_mike",
    "travel_june",
    "foodie_lisa",
    "art_by_kai",
    "tech_noah",
    "style_riley",
    "nature_paul",
    "pixel_mia",
  ];
  const categories = [
    "Nature",
    "Travel",
    "Food",
    "Technology",
    "Fashion",
    "Animals",
    "Art",
    "Gaming",
    "Photography",
    "Architecture",
  ];

  return Array.from({ length: count }).map((_, i) => {
    const idx = offset + i;
    const img = IMAGES[idx % IMAGES.length];
    const aspect = 0.75 + rng() * 0.85; // portrait-ish range ~0.75–1.6
    return {
      id: `pin-${idx}`,
      image: img,
      title: titles[idx % titles.length],
      user: users[idx % users.length],
      category: categories[idx % categories.length],
      likes: Math.floor(rng() * 4000) + 120,
      aspect,
    };
  });
}

function useColumnCount() {
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const mq = [
      { q: window.matchMedia("(max-width: 640px)"), c: 2 },
      { q: window.matchMedia("(max-width: 768px)"), c: 3 },
      { q: window.matchMedia("(max-width: 1024px)"), c: 4 },
      { q: window.matchMedia("(min-width: 1280px)"), c: 5 },
    ];
    const update = () => {
      for (const m of mq) {
        if (m.q.matches) {
          setCols(m.c);
          return;
        }
      }
      setCols(5);
    };
    update();
    mq.forEach((m) => m.q.addEventListener("change", update));
    return () => mq.forEach((m) => m.q.removeEventListener("change", update));
  }, []);
  return cols;
}

export default function MasonryPinFeed() {
  const cols = useColumnCount();
  const [pins, setPins] = useState(() => makePins(24, 0));
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    // Simulate network latency for skeleton demo
    setTimeout(() => {
      setPins((prev) => [...prev, ...makePins(12, prev.length)]);
      setLoadingMore(false);
    }, 700);
  }, [loadingMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Distribute pins into columns for true masonry
  const columns = Array.from({ length: cols }, () => []);
  const colHeights = Array.from({ length: cols }, () => 0);

  pins.forEach((pin) => {
    const shortest = colHeights.indexOf(Math.min(...colHeights));
    columns[shortest].push(pin);
    colHeights[shortest] += pin.aspect; // proxy height using aspect
  });

  return (
    <section className="w-full px-2 sm:px-3 md:px-4">
      <div
        className="flex gap-2 sm:gap-3"
        style={{ fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
      >
        {columns.map((col, cIdx) => (
          <div key={cIdx} className="flex-1 flex flex-col gap-2 sm:gap-3">
            <AnimatePresence>
              {col.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Infinite-scroll sentinel */}
      <div ref={sentinelRef} className="h-4 w-full" />

      {/* Loading skeleton row */}
      {loadingMore && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: cols }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
        </div>
      )}
    </section>
  );
}

function PinCard({ pin }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPins') || '[]').includes(pin.id); }
    catch { return false; }
  });

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((v) => !v);
  };
  const handleSave = (e) => {
    e.stopPropagation();
    const savedIds = JSON.parse(localStorage.getItem('savedPins') || '[]');
    let updated;
    if (saved) {
      updated = savedIds.filter((id) => id !== pin.id);
    } else {
      updated = [...savedIds, pin.id];
    }
    localStorage.setItem('savedPins', JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/pin/${pin.id}`)}
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      {/* Image */}
      <div className="relative w-full" style={{ paddingTop: `${(1 / pin.aspect) * 100}%` }}>
        <img
          src={pin.image}
          alt={pin.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: 16 }}
        />

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
              style={{
                borderRadius: 16,
                background: "rgba(0,0,0,0.12)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Top-right Save pill */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3"
            >
              <button
                onClick={handleSave}
                className="px-4 py-2 font-bold text-sm transition-colors duration-200"
                style={{
                  borderRadius: 9999,
                  backgroundColor: saved ? "#262622" : "#e60023",
                  color: "#ffffff",
                  fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {saved ? "Saved" : "Save"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom action bar */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-between"
            >
              <span
                className="px-3 py-1.5 text-xs font-semibold truncate max-w-[60%]"
                style={{
                  borderRadius: 9999,
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                }}
                title={pin.title}
              >
                {pin.title}
              </span>
              <div className="flex items-center gap-2">
                <ActionIcon onClick={handleLike} active={liked} label="Like">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#e60023" : "none"} stroke={liked ? "#e60023" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </ActionIcon>
                <ActionIcon label="Share">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </ActionIcon>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Meta below image */}
      <div className="px-1 pt-2 pb-1">
        <p
          className="text-sm font-semibold truncate"
          style={{
            color: "#000000",
            fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {pin.title}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <span
            className="text-xs"
            style={{
              color: "#62625b",
              fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {pin.user}
          </span>
          <span
            className="text-xs"
            style={{
              color: "#91918c",
              fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {pin.likes.toLocaleString()} likes
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ActionIcon({ children, onClick, active, label }) {
  return (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className="flex items-center justify-center transition-colors duration-200 hover:bg-[#e5e5e0]"
      style={{
        width: 36,
        height: 36,
        borderRadius: 9999,
        backgroundColor: "#ffffff",
        color: active ? "#e60023" : "#000000",
      }}
    >
      {children}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div
      className="w-full animate-pulse"
      style={{ borderRadius: 16, backgroundColor: "#f6f6f3", aspectRatio: "3/4" }}
    />
  );
}
