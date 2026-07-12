import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, LayoutGrid, Search } from 'lucide-react';
import { useBoards } from '../context/BoardsContext';
import { useAuth } from '../context/AuthContext';
import { ALL_PINS } from '../data/dummyPins';
import CreateBoardModal from './CreateBoardModal';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

function BoardThumbnail({ board }) {
  const pinsWithImages = board.pinIds
    .map(id => ALL_PINS.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  if (pinsWithImages.length === 0) {
    return (
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: board.coverColor ?? '#e60023' }}
      >
        <LayoutGrid size={20} style={{ color: 'rgba(255,255,255,0.8)' }} />
      </div>
    );
  }

  if (pinsWithImages.length < 4) {
    return (
      <img
        src={pinsWithImages[0].image ?? pinsWithImages[0].imageUrl}
        alt={board.name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-16 h-16 rounded-xl overflow-hidden grid grid-cols-2 flex-shrink-0">
      {pinsWithImages.slice(0, 4).map((p, i) => (
        <img key={i} src={p.image ?? p.imageUrl} alt="" className="w-full h-full object-cover" />
      ))}
    </div>
  );
}

export default function AddToBoardModal({ isOpen, onClose, pin }) {
  const { boards, addPinToBoard, isPinInBoard } = useBoards();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  const filtered = boards.filter(b =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAdd = (boardId) => {
    if (!pin) return;
    addPinToBoard(boardId, pin.id);
    setJustAdded(boardId);
    setTimeout(() => setJustAdded(null), 1800);
  };

  const handleCreated = (board, prefillPinId) => {
    if (prefillPinId) {
      addPinToBoard(board.id, prefillPinId);
      setJustAdded(board.id);
      setTimeout(() => setJustAdded(null), 1800);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: '#ffffff', maxHeight: '85vh' }}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#ebebeb' }}>
                <h2 className="text-lg font-bold" style={{ ...PS, color: '#111' }}>Save to board</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: '#f0f0f0' }}
                  aria-label="Close"
                >
                  <X size={16} style={{ color: '#333' }} />
                </button>
              </div>

              {/* Pin preview */}
              {pin && (
                <div className="flex items-center gap-3 px-6 py-3 border-b flex-shrink-0" style={{ borderColor: '#f0f0f0' }}>
                  <img
                    src={pin.image ?? pin.imageUrl}
                    alt={pin.title}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ ...PS, color: '#111' }}>{pin.title}</p>
                    <p className="text-xs" style={{ ...PS, color: '#777' }}>by {pin.user ?? pin.username}</p>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="px-6 py-3 border-b flex-shrink-0" style={{ borderColor: '#f0f0f0' }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f6f6f3' }}>
                  <Search size={14} style={{ color: '#999' }} />
                  <input
                    type="text"
                    placeholder="Search boards"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none"
                    style={{ ...PS, color: '#111' }}
                  />
                </div>
              </div>

              {/* Create new board */}
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-3 px-6 py-4 w-full text-left transition-colors border-b flex-shrink-0"
                style={{ borderColor: '#f0f0f0' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0f0f0' }}>
                  <Plus size={20} style={{ color: '#333' }} />
                </div>
                <span className="text-sm font-bold" style={{ ...PS, color: '#111' }}>Create board</span>
              </button>

              {/* Boards list */}
              <div className="overflow-y-auto flex-1">
                {filtered.length === 0 ? (
                  <div className="text-center py-10">
                    <LayoutGrid size={32} className="mx-auto mb-2" style={{ color: '#ccc' }} />
                    <p className="text-sm" style={{ ...PS, color: '#999' }}>
                      {query ? 'No boards match your search' : 'No boards yet'}
                    </p>
                  </div>
                ) : (
                  filtered.map(board => {
                    const inBoard = pin ? isPinInBoard(board.id, pin.id) : false;
                    const added = justAdded === board.id;
                    return (
                      <button
                        key={board.id}
                        onClick={() => !inBoard && handleAdd(board.id)}
                        className="flex items-center gap-3 px-6 py-3 w-full text-left transition-colors"
                        onMouseEnter={e => { if (!inBoard) e.currentTarget.style.backgroundColor = '#fafafa'; }}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        style={{ cursor: inBoard ? 'default' : 'pointer' }}
                      >
                        <BoardThumbnail board={board} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ ...PS, color: '#111' }}>{board.name}</p>
                          <p className="text-xs" style={{ ...PS, color: '#999' }}>
                            {board.pinIds.length} {board.pinIds.length === 1 ? 'pin' : 'pins'}
                          </p>
                        </div>
                        {(inBoard || added) ? (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e60023' }}>
                            <Check size={14} style={{ color: '#fff' }} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0f0f0' }}>
                            <Plus size={14} style={{ color: '#333' }} />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateBoardModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
        prefillPinId={pin?.id ?? null}
      />
    </>
  );
}
