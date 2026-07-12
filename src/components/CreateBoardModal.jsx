import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutGrid, Lock, Globe } from 'lucide-react';
import { useBoards } from '../context/BoardsContext';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

export default function CreateBoardModal({ isOpen, onClose, onCreated, prefillPinId = null }) {
  const { createBoard } = useBoards();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [secret, setSecret] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSecret(false);
      setError('');
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Board name is required.'); return; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    const board = createBoard(name, description);
    onCreated?.(board, prefillPinId);
    onClose();
  };

  return (
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
            className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#ebebeb' }}>
              <div className="flex items-center gap-2">
                <LayoutGrid size={20} style={{ color: '#e60023' }} />
                <h2 className="text-lg font-bold" style={{ ...PS, color: '#111' }}>Create board</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: '#f0f0f0' }}
                aria-label="Close"
              >
                <X size={16} style={{ color: '#333' }} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ ...PS, color: '#555' }}>
                  Name <span style={{ color: '#e60023' }}>*</span>
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="Like 'Places to go' or 'Recipes to try'"
                  maxLength={80}
                  className="w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all"
                  style={{
                    ...PS,
                    borderColor: error ? '#e60023' : '#ddd',
                    backgroundColor: '#fafafa',
                    color: '#111',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#e60023'; e.target.style.boxShadow = '0 0 0 3px rgba(230,0,35,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = error ? '#e60023' : '#ddd'; e.target.style.boxShadow = 'none'; }}
                />
                {error && <p className="text-xs mt-1" style={{ color: '#e60023', ...PS }}>{error}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ ...PS, color: '#555' }}>
                  Description <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What's your board about?"
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 text-sm rounded-xl border outline-none resize-none transition-all"
                  style={{
                    ...PS,
                    borderColor: '#ddd',
                    backgroundColor: '#fafafa',
                    color: '#111',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#e60023'; e.target.style.boxShadow = '0 0 0 3px rgba(230,0,35,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Secret toggle */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
                style={{ backgroundColor: '#f6f6f3' }}
                onClick={() => setSecret(s => !s)}
              >
                <div className="flex items-center gap-3">
                  {secret ? <Lock size={18} style={{ color: '#555' }} /> : <Globe size={18} style={{ color: '#555' }} />}
                  <div>
                    <p className="text-sm font-semibold" style={{ ...PS, color: '#111' }}>
                      {secret ? 'Secret board' : 'Public board'}
                    </p>
                    <p className="text-xs" style={{ ...PS, color: '#777' }}>
                      {secret ? 'Only you can see this board' : 'Anyone can see this board'}
                    </p>
                  </div>
                </div>
                <div
                  className="relative w-10 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: secret ? '#e60023' : '#ccc' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow"
                    style={{ transform: secret ? 'translateX(20px)' : 'translateX(4px)' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-full text-sm font-bold transition-colors"
                  style={{ ...PS, backgroundColor: '#f0f0f0', color: '#333' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-opacity"
                  style={{ ...PS, backgroundColor: '#e60023' }}
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
