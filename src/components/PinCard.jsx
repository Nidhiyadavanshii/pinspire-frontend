import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2, LayoutGrid } from 'lucide-react';
import AddToBoardModal from './AddToBoardModal';
import { useAuth } from '../context/AuthContext';

export default function PinCard({ pin, onOpen, onLike, onSave, onShare }) {
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(pin?.liked ?? false);
  const [saved, setSaved] = useState(pin?.saved ?? false);
  const [likeCount, setLikeCount] = useState(pin?.likes ?? 0);
  const [showBoardModal, setShowBoardModal] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    onLike?.(pin?.id, next);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    onSave?.(pin?.id, next);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare?.(pin?.id);
  };

  const handleOpen = () => {
    onOpen?.(pin);
  };

  const imageUrl = pin?.imageUrl ?? pin?.image ?? '';
  const title = pin?.title ?? 'Untitled';
  const username = pin?.username ?? pin?.user?.username ?? 'Unknown';
  const avatarUrl = pin?.avatarUrl ?? pin?.user?.avatar ?? '';

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden"
      style={{
        borderRadius: '16px',
        backgroundColor: '#f6f6f3',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.015, y: -2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleOpen}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ borderRadius: '16px' }}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto object-cover block"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Hover overlay */}
        {hovered && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-3"
            style={{
              background: 'rgba(0,0,0,0.22)',
              borderRadius: '16px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top row: Save pill */}
            <div className="flex justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3.5 py-2 font-bold text-sm"
                style={{
                  fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                  borderRadius: '9999px',
                  backgroundColor: saved ? '#262622' : '#e60023',
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                <Bookmark className="w-4 h-4" fill={saved ? '#ffffff' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </motion.button>
            </div>

            {/* Bottom row: actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className="flex items-center justify-center w-9 h-9"
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: '#f6f6f3',
                    color: liked ? '#e60023' : '#000000',
                  }}
                  aria-label="Like"
                >
                  <Heart className="w-4 h-4" fill={liked ? '#e60023' : 'none'} />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="flex items-center justify-center w-9 h-9"
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: '#f6f6f3',
                    color: '#000000',
                  }}
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>

                {isAuthenticated && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={e => { e.stopPropagation(); setShowBoardModal(true); }}
                    className="flex items-center justify-center w-9 h-9"
                    style={{
                      borderRadius: '9999px',
                      backgroundColor: '#f6f6f3',
                      color: '#000000',
                    }}
                    aria-label="Add to board"
                    title="Add to board"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {likeCount > 0 && (
                <span
                  className="px-2.5 py-1 text-xs font-medium"
                  style={{
                    fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                    borderRadius: '9999px',
                    backgroundColor: '#f6f6f3',
                    color: '#000000',
                  }}
                >
                  {likeCount.toLocaleString()}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Meta below image */}
      <div className="px-2 pt-2 pb-2.5">
        <h3
          className="text-sm font-semibold truncate"
          style={{
            fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
            color: '#000000',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-5 h-5 object-cover"
              style={{ borderRadius: '9999px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              className="w-5 h-5 flex items-center justify-center text-[10px] font-bold"
              style={{
                borderRadius: '9999px',
                backgroundColor: '#e5e5e0',
                color: '#62625b',
                fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {(username?.[0] ?? '?').toUpperCase()}
            </div>
          )}
          <span
            className="text-xs font-medium truncate"
            style={{
              fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
              color: '#62625b',
              lineHeight: 1.4,
            }}
          >
            {username}
          </span>
        </div>
      </div>
      {showBoardModal && (
        <AddToBoardModal
          isOpen={showBoardModal}
          onClose={() => setShowBoardModal(false)}
          pin={pin}
        />
      )}
    </motion.div>
  );
}
