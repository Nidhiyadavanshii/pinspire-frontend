import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LayoutGrid, Trash2, Bookmark, Heart, X } from 'lucide-react';
import { useBoards } from '../context/BoardsContext';
import { ALL_PINS } from '../data/dummyPins';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import PinDetailsModal from '../components/PinDetailsModal';
import { ToastProvider } from '../components/ToastNotifications';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

function BoardPinCard({ pin, onRemove, onClick }) {
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
      <div className="relative w-full" style={{ paddingTop: `${(1 / (pin.aspect ?? 1)) * 100}%` }}>
        <img
          src={pin.image ?? pin.imageUrl}
          alt={pin.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: 16 }}
        />
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 flex flex-col justify-between p-3"
              style={{ borderRadius: 16, background: 'rgba(0,0,0,0.22)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex justify-end">
                <button
                  onClick={e => { e.stopPropagation(); onRemove(pin.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#262622' }}
                >
                  <X size={10} />
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart size={12} style={{ color: '#fff' }} />
                <span className="text-xs font-medium text-white">{pin.likes?.toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="px-1 pt-2 pb-1">
        <p className="text-sm font-semibold truncate" style={{ color: '#111' }}>{pin.title}</p>
        <p className="text-xs mt-0.5" style={{ color: '#777' }}>{pin.user ?? pin.username}</p>
      </div>
    </motion.div>
  );
}

export default function BoardDetail() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { getBoardById, removePinFromBoard, deleteBoard } = useBoards();
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const board = getBoardById(boardId);

  if (!board) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center" style={{ backgroundColor: '#fff' }}>
        <LayoutGrid size={48} style={{ color: '#ccc' }} className="mb-4" />
        <h2 className="text-xl font-bold mb-2" style={{ ...PS, color: '#111' }}>Board not found</h2>
        <Link to="/boards" className="text-sm font-semibold" style={{ color: '#e60023' }}>Back to boards</Link>
      </div>
    );
  }

  const pins = board.pinIds
    .map(id => ALL_PINS.find(p => p.id === id))
    .filter(Boolean);

  // Masonry columns
  const colCount = typeof window !== 'undefined'
    ? window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : 5
    : 4;
  const columns = Array.from({ length: colCount }, () => []);
  const heights = Array.from({ length: colCount }, () => 0);
  pins.forEach(pin => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(pin);
    heights[shortest] += 1 / (pin.aspect ?? 1);
  });

  const handleDeleteBoard = () => {
    deleteBoard(boardId);
    navigate('/boards');
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#ffffff', ...PS }}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Back + header */}
            <div className="mb-6">
              <Link
                to="/boards"
                className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4 transition-colors"
                style={{ color: '#777' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e60023'}
                onMouseLeave={e => e.currentTarget.style.color = '#777'}
              >
                <ArrowLeft size={15} />
                All boards
              </Link>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: '#111', letterSpacing: '-0.8px' }}>{board.name}</h1>
                  {board.description && (
                    <p className="text-sm mt-1 max-w-lg" style={{ color: '#777' }}>{board.description}</p>
                  )}
                  <p className="text-sm mt-1" style={{ color: '#999' }}>
                    {pins.length} {pins.length === 1 ? 'pin' : 'pins'}
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-colors flex-shrink-0"
                  style={{ backgroundColor: '#f6f6f3', color: '#e60023' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffe5e8'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f6f6f3'}
                >
                  <Trash2 size={14} />
                  Delete board
                </button>
              </div>
            </div>

            {/* Pins */}
            {pins.length === 0 ? (
              <div className="text-center py-24">
                <Bookmark size={64} className="mx-auto mb-4" style={{ color: '#dadad3' }} />
                <h2 className="text-xl font-bold mb-2" style={{ color: '#111' }}>This board is empty</h2>
                <p className="text-sm mb-6" style={{ color: '#777' }}>
                  Save pins to this board from your feed or search.
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
                    <AnimatePresence>
                      {col.map(pin => (
                        <BoardPinCard
                          key={pin.id}
                          pin={pin}
                          onRemove={id => removePinFromBoard(boardId, id)}
                          onClick={p => { setSelectedPin(p); setIsModalOpen(true); }}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>

        <Footer />
        <ScrollToTopButton />

        <PinDetailsModal
          pin={selectedPin}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setTimeout(() => setSelectedPin(null), 250); }}
        />

        {/* Delete confirm */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
                style={{ backgroundColor: '#fff' }}
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-lg font-bold mb-2" style={{ ...PS, color: '#111' }}>Delete "{board.name}"?</h3>
                <p className="text-sm mb-5" style={{ ...PS, color: '#777' }}>
                  This board and all its pin links will be permanently deleted. The pins themselves stay in your feed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2.5 rounded-full text-sm font-bold"
                    style={{ ...PS, backgroundColor: '#f0f0f0', color: '#333' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBoard}
                    className="flex-1 py-2.5 rounded-full text-sm font-bold text-white"
                    style={{ ...PS, backgroundColor: '#e60023' }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}
