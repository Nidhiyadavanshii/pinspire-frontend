import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MoreHorizontal, Trash2, MessageCircle } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  CommentsSection                                                    */
/*  Pinterest-inspired comment thread for a pin.                      */
/*  Reads + adds comments locally (POST /api/comments is unavailable). */
/* ------------------------------------------------------------------ */

const COLORS = {
  primary: '#e60023',
  primaryPressed: '#cc001f',
  ink: '#000000',
  inkSoft: '#211922',
  body: '#33332e',
  mute: '#62625b',
  ash: '#91918c',
  stone: '#c8c8c1',
  hairline: '#dadad3',
  hairlineSoft: '#e5e5e0',
  canvas: '#ffffff',
  surfaceSoft: '#fbfbf9',
  surfaceCard: '#f6f6f3',
  surfaceElevated: '#ffffff',
  onDark: '#ffffff',
  onDarkMute: 'rgba(255,255,255,0.7)',
  focusOuter: '#435ee5',
};

const TYPO = {
  bodyMd: { fontFamily: 'Pin Sans, ui-sans-serif, system-ui, sans-serif', fontSize: 16, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0 },
  bodySm: { fontFamily: 'Pin Sans, ui-sans-serif, system-ui, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0 },
  bodySmStrong: { fontFamily: 'Pin Sans, ui-sans-serif, system-ui, sans-serif', fontSize: 14, fontWeight: 700, lineHeight: 1.4, letterSpacing: 0 },
  captionMd: { fontFamily: 'Pin Sans, ui-sans-serif, system-ui, sans-serif', fontSize: 12, fontWeight: 500, lineHeight: 1.5, letterSpacing: 0 },
  buttonMd: { fontFamily: 'Pin Sans, ui-sans-serif, system-ui, sans-serif', fontSize: 14, fontWeight: 700, lineHeight: 1, letterSpacing: 0 },
};

const RADIUS = { md: 16, full: 9999 };

/* Seed comments so the component is never empty on first render */
const SEED_COMMENTS = [
  {
    id: 'c1',
    author: 'Elena V.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    text: 'This composition is absolutely stunning — the light falling on the subject is so soft!',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    likes: 12,
    likedByMe: false,
  },
  {
    id: 'c2',
    author: 'Marcus Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    text: 'Saved this to my moodboard immediately. What camera setup did you use?',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    likes: 4,
    likedByMe: false,
  },
  {
    id: 'c3',
    author: 'Sofia R.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    text: 'Love the colour palette here. Very Pinterest-core!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    likes: 8,
    likedByMe: true,
  },
];

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  return `${w}w`;
}

function useLocalComments() {
  const [comments, setComments] = useState(SEED_COMMENTS);

  const addComment = (text) => {
    const next = {
      id: `c-${Date.now()}`,
      author: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      text: text.trim(),
      createdAt: Date.now(),
      likes: 0,
      likedByMe: false,
    };
    setComments((prev) => [next, ...prev]);
    return next;
  };

  const toggleLike = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, likedByMe: !c.likedByMe, likes: c.likedByMe ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const removeComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return { comments, addComment, toggleLike, removeComment };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Avatar({ src, alt, size = 36 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-cover"
      style={{
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.surfaceCard,
      }}
    />
  );
}

function CommentRow({ comment, onLike, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isMe = comment.author === 'You';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex gap-3"
    >
      <Avatar src={comment.avatar} alt={comment.author} size={36} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span
              className="block truncate"
              style={{ ...TYPO.bodySmStrong, color: COLORS.inkSoft }}
            >
              {comment.author}
            </span>
            <span
              className="block mt-0.5"
              style={{ ...TYPO.bodySm, color: COLORS.body, wordBreak: 'break-word' }}
            >
              {comment.text}
            </span>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1 rounded-full transition-colors duration-200"
              style={{ color: COLORS.ash }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.ash)}
              aria-label="Comment options"
            >
              <MoreHorizontal size={16} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-7 z-10 min-w-[8rem] overflow-hidden"
                  style={{
                    backgroundColor: COLORS.canvas,
                    borderRadius: RADIUS.md,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    border: `1px solid ${COLORS.hairlineSoft}`,
                  }}
                >
                  {isMe && (
                    <button
                      onClick={() => {
                        onDelete(comment.id);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 transition-colors duration-150"
                      style={{ ...TYPO.bodySm, color: COLORS.primary }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = COLORS.surfaceSoft)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onLike(comment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 transition-colors duration-150"
                    style={{ ...TYPO.bodySm, color: COLORS.inkSoft }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = COLORS.surfaceSoft)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <Heart size={14} />
                    {comment.likedByMe ? 'Unlike' : 'Like'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-1.5">
          <span style={{ ...TYPO.captionMd, color: COLORS.ash }}>
            {timeAgo(comment.createdAt)}
          </span>
          <button
            onClick={() => onLike(comment.id)}
            className="flex items-center gap-1 transition-colors duration-200"
            style={{
              ...TYPO.captionMd,
              color: comment.likedByMe ? COLORS.primary : COLORS.ash,
              fontWeight: comment.likedByMe ? 700 : 500,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = comment.likedByMe ? COLORS.primaryPressed : COLORS.mute)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = comment.likedByMe ? COLORS.primary : COLORS.ash)
            }
          >
            <Heart size={12} fill={comment.likedByMe ? COLORS.primary : 'none'} />
            {comment.likes > 0 ? comment.likes : 'Like'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CommentsSection() {
  const { comments, addComment, toggleLike, removeComment } = useLocalComments();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const canSubmit = text.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    addComment(text);
    setText('');
    setFocused(false);
  };

  return (
    <section
      className="flex flex-col h-full"
      style={{
        backgroundColor: COLORS.canvas,
        borderRadius: RADIUS.md,
        fontFamily: 'Pin Sans, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <MessageCircle size={18} style={{ color: COLORS.mute }} />
        <h3 style={{ ...TYPO.bodySmStrong, color: COLORS.inkSoft }}>
          Comments
        </h3>
        <span
          className="ml-1 px-2 py-0.5 rounded-full"
          style={{
            ...TYPO.captionMd,
            backgroundColor: COLORS.surfaceCard,
            color: COLORS.mute,
          }}
        >
          {comments.length}
        </span>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        <AnimatePresence mode="popLayout">
          {(comments ?? []).map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              onLike={toggleLike}
              onDelete={removeComment}
            />
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <MessageCircle size={32} style={{ color: COLORS.stone }} />
            <p className="mt-2" style={{ ...TYPO.bodySm, color: COLORS.ash }}>
              No comments yet. Be the first to share your thoughts!
            </p>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div
        className="px-4 pb-4 pt-2"
        style={{
          borderTop: `1px solid ${COLORS.hairlineSoft}`,
          backgroundColor: COLORS.canvas,
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 transition-all duration-200"
            style={{
              backgroundColor: focused ? COLORS.canvas : COLORS.surfaceCard,
              borderRadius: RADIUS.md,
              border: `1.5px solid ${focused ? COLORS.focusOuter : COLORS.hairlineSoft}`,
            }}
          >
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
              alt="You"
              size={28}
            />
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Add a comment"
              className="flex-1 bg-transparent outline-none placeholder:text-[#91918c]"
              style={{ ...TYPO.bodyMd, color: COLORS.ink }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.05 } : {}}
            whileTap={canSubmit ? { scale: 0.95 } : {}}
            className="shrink-0 flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
            style={{
              width: 40,
              height: 40,
              borderRadius: RADIUS.full,
              backgroundColor: canSubmit ? COLORS.primary : COLORS.surfaceCard,
              color: canSubmit ? COLORS.onDark : COLORS.ash,
            }}
            aria-label="Post comment"
          >
            <Send size={18} />
          </motion.button>
        </form>
      </div>
    </section>
  );
}
