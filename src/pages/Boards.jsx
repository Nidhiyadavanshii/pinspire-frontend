import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Plus, Trash2, Lock, Globe, Edit2, X, Check } from 'lucide-react';
import { useBoards } from '../context/BoardsContext';
import { ALL_PINS } from '../data/dummyPins';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import CreateBoardModal from '../components/CreateBoardModal';
import { ToastProvider } from '../components/ToastNotifications';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

function BoardCover({ board }) {
  const pinsWithImages = board.pinIds
    .map(id => ALL_PINS.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  if (pinsWithImages.length === 0) {
    return (
      <div
        className="w-full h-40 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: board.coverColor ?? '#e60023' }}
      >
        <LayoutGrid size={32} style={{ color: 'rgba(255,255,255,0.7)' }} />
      </div>
    );
  }

  if (pinsWithImages.length < 3) {
    return (
      <img
        src={pinsWithImages[0].image ?? pinsWithImages[0].imageUrl}
        alt={board.name}
        className="w-full h-40 rounded-2xl object-cover"
      />
    );
  }

  return (
    <div className="w-full h-40 rounded-2xl overflow-hidden grid grid-cols-2 gap-0.5">
      <img src={pinsWithImages[0].image ?? pinsWithImages[0].imageUrl} alt="" className="w-full h-full object-cover col-span-1 row-span-2" style={{ gridRow: '1 / span 2' }} />
      <div className="flex flex-col gap-0.5">
        {pinsWithImages.slice(1, 3).map((p, i) => (
          <img key={i} src={p.image ?? p.imageUrl} alt="" className="w-full flex-1 object-cover" style={{ height: '50%' }} />
        ))}
      </div>
    </div>
  );
}

function BoardCard({ board, onDelete, onRename }) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(board.name);

  const handleRename = () => {
    if (editName.trim().length >= 2) {
      onRename(board.id, editName.trim());
    }
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25 }}
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/boards/${board.id}`} className="block">
        <BoardCover board={board} />
      </Link>

      {/* Hover actions */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute top-2 right-2 flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <button
              onClick={(e) => { e.preventDefault(); setEditing(true); }}
              className="w-8 h-8 rounded-full flex items-center justify-center shadow"
              style={{ backgroundColor: '#fff' }}
              aria-label="Rename board"
            >
              <Edit2 size={13} style={{ color: '#333' }} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(board.id); }}
              className="w-8 h-8 rounded-full flex items-center justify-center shadow"
              style={{ backgroundColor: '#fff' }}
              aria-label="Delete board"
            >
              <Trash2 size={13} style={{ color: '#e60023' }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name / edit */}
      <div className="mt-2 px-1">
        {editing ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false); }}
              className="flex-1 text-sm font-bold rounded-lg px-2 py-1 border outline-none"
              style={{ ...PS, borderColor: '#e60023', color: '#111' }}
              maxLength={80}
            />
            <button onClick={handleRename} className="w-6 h-6 flex items-center justify-center rounded-full" style={{ backgroundColor: '#e60023' }}>
              <Check size={12} style={{ color: '#fff' }} />
            </button>
            <button onClick={() => setEditing(false)} className="w-6 h-6 flex items-center justify-center rounded-full" style={{ backgroundColor: '#f0f0f0' }}>
              <X size={12} style={{ color: '#333' }} />
            </button>
          </div>
        ) : (
          <Link to={`/boards/${board.id}`}>
            <div className="flex items-center gap-1.5">
              {board.secret
                ? <Lock size={12} style={{ color: '#777', flexShrink: 0 }} />
                : <Globe size={12} style={{ color: '#bbb', flexShrink: 0 }} />
              }
              <p className="text-sm font-bold truncate" style={{ ...PS, color: '#111' }}>{board.name}</p>
            </div>
            <p className="text-xs mt-0.5" style={{ ...PS, color: '#999' }}>
              {board.pinIds.length} {board.pinIds.length === 1 ? 'pin' : 'pins'}
            </p>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function Boards() {
  const { boards, deleteBoard, updateBoard, createBoard } = useBoards();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (boardId) => {
    setDeleteConfirm(boardId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteBoard(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleRename = (boardId, newName) => {
    updateBoard(boardId, { name: newName });
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#ffffff', ...PS }}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#111', letterSpacing: '-0.8px' }}>My Boards</h1>
                <p className="text-sm mt-1" style={{ color: '#777' }}>
                  {boards.length} {boards.length === 1 ? 'board' : 'boards'}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: '#e60023' }}
              >
                <Plus size={16} />
                Create board
              </motion.button>
            </div>

            {/* Empty state */}
            {boards.length === 0 ? (
              <div className="text-center py-24">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: '#f6f6f3' }}
                >
                  <LayoutGrid size={36} style={{ color: '#ccc' }} />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: '#111' }}>No boards yet</h2>
                <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: '#777' }}>
                  Create a board to start organising your saved pins into collections.
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="px-6 py-3 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: '#e60023' }}
                >
                  Create your first board
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                <AnimatePresence>
                  {boards.map(board => (
                    <BoardCard
                      key={board.id}
                      board={board}
                      onDelete={handleDelete}
                      onRename={handleRename}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </main>

        <Footer />
        <ScrollToTopButton />

        <CreateBoardModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
        />

        {/* Delete confirmation */}
        <AnimatePresence>
          {deleteConfirm && (
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
                <h3 className="text-lg font-bold mb-2" style={{ ...PS, color: '#111' }}>Delete board?</h3>
                <p className="text-sm mb-5" style={{ ...PS, color: '#777' }}>
                  This will permanently delete the board and remove all pins from it. The pins themselves won't be deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2.5 rounded-full text-sm font-bold"
                    style={{ ...PS, backgroundColor: '#f0f0f0', color: '#333' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
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
