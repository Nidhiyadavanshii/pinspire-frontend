import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { searchPins, CATEGORIES_LIST } from '../data/pinsStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { ToastProvider } from '../components/ToastNotifications';
import PinDetailsModal from '../components/PinDetailsModal';
import LoadingSkeleton from '../components/LoadingSkeleton';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

function SearchPinCard({ pin, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative cursor-pointer group"
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
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ borderRadius: 16, background: 'rgba(0,0,0,0.15)' }}
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setSaved((v) => !v); }}
                  className="px-3 py-1.5 rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: saved ? '#262622' : '#e60023' }}
                >
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="px-1 pt-2 pb-1">
        <p className="text-sm font-semibold truncate" style={{ color: '#000000' }}>{pin.title}</p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs" style={{ color: '#62625b' }}>{pin.user}</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f6f6f3', color: '#62625b' }}>{pin.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const doSearch = useCallback((q, cat) => {
    setLoading(true);
    setTimeout(() => {
      let pins = searchPins(q);
      if (cat && cat !== 'All') {
        pins = pins.filter((p) => p.category === cat);
      }
      setResults(pins);
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    doSearch(query, activeCategory);
  }, [query, activeCategory, doSearch]);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const handleQueryChange = (val) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  const columns = [[], [], [], [], []];
  const heights = [0, 0, 0, 0, 0];
  const colCount = window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : 5;
  const usedCols = columns.slice(0, colCount);
  const usedHeights = heights.slice(0, colCount);

  results.forEach((pin) => {
    const shortest = usedHeights.indexOf(Math.min(...usedHeights));
    usedCols[shortest].push(pin);
    usedHeights[shortest] += 1 / pin.aspect;
  });

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#ffffff', ...PS }}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
          {/* Search input */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center rounded-full" style={{ backgroundColor: '#f6f6f3', border: '2px solid #dadad3' }}>
              <SearchIcon size={20} className="ml-4 shrink-0" style={{ color: '#91918c' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search pins, categories, creators..."
                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                style={{ color: '#000000' }}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => handleQueryChange('')}
                  className="mr-3 p-1 rounded-full hover:bg-[#e5e5e0] transition-colors"
                >
                  <X size={16} style={{ color: '#62625b' }} />
                </button>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {['All', ...CATEGORIES_LIST].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeCategory === cat ? '#000000' : '#f6f6f3',
                  color: activeCategory === cat ? '#ffffff' : '#33332e',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: '#62625b' }}>
              {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} ${query ? `for "${query}"` : ''}`}
            </p>
          </div>

          {/* Results grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl" style={{ backgroundColor: '#f6f6f3', aspectRatio: '3/4' }} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <SearchIcon size={48} className="mx-auto mb-4" style={{ color: '#dadad3' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#000000' }}>No results found</h3>
              <p className="text-sm" style={{ color: '#62625b' }}>
                Try different keywords or browse by category above.
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              {usedCols.map((col, cIdx) => (
                <div key={cIdx} className="flex-1 flex flex-col gap-3">
                  {col.map((pin) => (
                    <SearchPinCard
                      key={pin.id}
                      pin={pin}
                      onClick={(p) => { setSelectedPin(p); setIsModalOpen(true); }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
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
