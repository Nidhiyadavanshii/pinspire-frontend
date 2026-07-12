import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Bookmark, Share2, Send, MoreHorizontal, ChevronDown } from 'lucide-react';

const PinSans = "'Pin Sans', 'Inter', 'ui-sans-serif', 'system-ui', sans-serif";

const dummyComments = [
  { id: 1, user: 'Alice', avatar: 'A', text: 'This is absolutely stunning! Love the composition.', time: '2h ago' },
  { id: 2, user: 'Bob', avatar: 'B', text: 'Saved this for my mood board.', time: '5h ago' },
  { id: 3, user: 'Cara', avatar: 'C', text: 'Where was this taken?', time: '1d ago' },
];

const dummyRelated = [
  { id: 101, image: '/src/assets/nature_photography_landscape.jpg', title: 'Mountain sunrise', user: 'NatureDaily' },
  { id: 102, image: '/src/assets/travel_adventure_mountains.jpg', title: 'Alpine trail', user: 'Wanderer' },
  { id: 103, image: '/src/assets/animals_wildlife_cute.jpg', title: 'Forest friends', user: 'WildLens' },
  { id: 104, image: '/src/assets/art_creative_painting.jpg', title: 'Abstract red', user: 'ArtHouse' },
];

export default function PinDetailsModal({ pin, isOpen, onClose }) {
  const overlayRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(dummyComments);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleAddComment = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments((prev) => [
      { id: Date.now(), user: 'You', avatar: 'Y', text, time: 'Just now' },
      ...prev,
    ]);
    setCommentText('');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: pin?.title ?? 'Pin', url: window.location.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // noop
    }
  };

  const title = pin?.title ?? 'Untitled Pin';
  const user = pin?.user ?? 'Unknown';
  const image = pin?.image ?? '/src/assets/nature_photography_landscape.jpg';
  const description = pin?.description ?? '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative my-8 w-full max-w-5xl rounded-[16px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden"
            style={{ fontFamily: PinSans }}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f6f3] text-[#262622] transition-colors hover:bg-[#e5e5e0] active:scale-95"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-3/5 bg-[#f6f6f3]">
                <img
                  src={image}
                  alt={title}
                  className="h-auto max-h-[80vh] w-full object-contain"
                  loading="lazy"
                />
                {/* Image action pills */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  <button
                    onClick={() => setLiked((v) => !v)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-all active:scale-95 ${
                      liked
                        ? 'bg-[#e60023] text-white'
                        : 'bg-white text-[#262622] hover:bg-[#f6f6f3]'
                    }`}
                    style={{ fontFamily: PinSans }}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                    {liked ? 'Liked' : 'Like'}
                  </button>
                  <button
                    onClick={() => setSaved((v) => !v)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition-all active:scale-95 ${
                      saved
                        ? 'bg-[#262622] text-white'
                        : 'bg-white text-[#262622] hover:bg-[#f6f6f3]'
                    }`}
                    style={{ fontFamily: PinSans }}
                  >
                    <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="flex w-full flex-col md:w-2/5">
                {/* Top actions row */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f6f3] text-[#262622] transition-colors hover:bg-[#e5e5e0] active:scale-95"
                      aria-label="Share"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f6f3] text-[#262622] transition-colors hover:bg-[#e5e5e0] active:scale-95"
                      aria-label="More"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => setSaved((v) => !v)}
                    className="rounded-[16px] px-5 py-2 text-sm font-bold text-white transition-all active:scale-95"
                    style={{
                      fontFamily: PinSans,
                      backgroundColor: saved ? '#262622' : '#e60023',
                    }}
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

                {/* Title + meta */}
                <div className="px-6 pt-2 pb-4">
                  <h2
                    className="text-[22px] font-semibold leading-[1.25] tracking-normal text-[#000000]"
                    style={{ fontFamily: PinSans }}
                  >
                    {title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[#62625b]" style={{ fontFamily: PinSans }}>
                    by {user}
                  </p>
                </div>

                {/* Description */}
                {description && (
                  <div className="px-6 pb-4">
                    <p className="text-[16px] font-normal leading-[1.4] text-[#33332e]" style={{ fontFamily: PinSans }}>
                      {description}
                    </p>
                  </div>
                )}

                {/* Comments */}
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="flex items-center justify-between pb-3">
                    <h3
                      className="text-[18px] font-semibold leading-[1.3] text-[#000000]"
                      style={{ fontFamily: PinSans }}
                    >
                      Comments
                    </h3>
                    <span className="text-xs font-medium text-[#91918c]" style={{ fontFamily: PinSans }}>
                      {comments.length}
                    </span>
                  </div>

                  <div className="space-y-4 pb-4">
                    {(comments ?? []).slice(0, showMore ? undefined : 3).map((c) => (
                      <motion.div
                        key={c.id}
                        className="flex gap-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5e5e0] text-xs font-bold text-[#262622]">
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-[#262622]" style={{ fontFamily: PinSans }}>
                              {c.user}
                            </span>
                            <span className="text-xs text-[#91918c]" style={{ fontFamily: PinSans }}>
                              {c.time}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm font-normal text-[#33332e]" style={{ fontFamily: PinSans }}>
                            {c.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {comments.length > 3 && (
                    <button
                      onClick={() => setShowMore((v) => !v)}
                      className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#62625b] transition-colors hover:text-[#262622]"
                      style={{ fontFamily: PinSans }}
                    >
                      {showMore ? 'Show less' : 'Show more'}
                      <ChevronDown size={14} className={`transition-transform ${showMore ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Comment input */}
                <div className="border-t border-[#dadad3] px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5e5e0] text-xs font-bold text-[#262622]">
                      Y
                    </div>
                    <div className="flex flex-1 items-center gap-2 rounded-full bg-[#f6f6f3] px-4 py-2">
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                        placeholder="Add a comment"
                        className="flex-1 bg-transparent text-sm font-normal text-[#000000] placeholder-[#91918c] outline-none"
                        style={{ fontFamily: PinSans }}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 ${
                          commentText.trim()
                            ? 'bg-[#e60023] text-white'
                            : 'bg-[#e5e5e0] text-[#91918c]'
                        }`}
                        aria-label="Send comment"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related pins */}
            <div className="border-t border-[#dadad3] px-6 py-5">
              <h3
                className="mb-3 text-[18px] font-semibold leading-[1.3] text-[#000000]"
                style={{ fontFamily: PinSans }}
              >
                More like this
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(dummyRelated ?? []).map((r) => (
                  <motion.div
                    key={r.id}
                    className="group cursor-pointer overflow-hidden rounded-[16px] bg-[#f6f6f3]"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      className="h-32 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold text-[#262622]" style={{ fontFamily: PinSans }}>
                        {r.title}
                      </p>
                      <p className="truncate text-xs font-medium text-[#91918c]" style={{ fontFamily: PinSans }}>
                        {r.user}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
