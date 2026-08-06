import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2, ArrowLeft, Send, MoreHorizontal } from 'lucide-react';
import { getAllPins, getPinById as getLocalPinById } from '../data/pinsStore';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { ToastProvider } from '../components/ToastNotifications';
import { apiGet } from '../config/api';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

const MOCK_COMMENTS = [
  { id: 'c1', username: 'sarah_snaps', text: 'This is absolutely stunning! Love the composition.', time: '2h ago', likes: 12 },
  { id: 'c2', username: 'design_mike', text: 'Great shot! What camera did you use?', time: '5h ago', likes: 4 },
  { id: 'c3', username: 'travel_june', text: 'Adding this to my travel bucket list immediately!', time: '1d ago', likes: 28 },
];

function normalizePin(rawPin, fallbackId = '') {
  if (!rawPin) return null;
  const id = rawPin.id ?? fallbackId;
  return {
    ...rawPin,
    id: String(id),
    title: rawPin.title || 'Untitled Pin',
    description: rawPin.description || '',
    image: rawPin.imageUrl || rawPin.image || '',
    user: rawPin.user || rawPin.username || 'unknown',
    userFullName: rawPin.userFullName || rawPin.user || 'Unknown',
    category: rawPin.category || 'General',
    likes: rawPin.likes ?? 0,
  };
}

function buildRelatedPins(pin, candidates = []) {
  if (!pin) return [];
  const currentId = String(pin.id || '');
  return candidates
    .filter(Boolean)
    .filter((candidate) => String(candidate.id) !== currentId)
    .filter((candidate) => (candidate.category || 'General') === (pin.category || 'General'))
    .slice(0, 6);
}

function Avatar({ username, size = 32 }) {
  const initial = (username || 'U')[0].toUpperCase();
  const colors = ['#e60023', '#3b5bdb', '#0ca678', '#f59f00', '#7048e8'];
  const color = colors[username?.charCodeAt(0) % colors.length || 0];
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-bold shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  );
}

function RelatedPinCard({ pin }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative cursor-pointer overflow-hidden"
      style={{ borderRadius: 12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/pin/${pin.id}`)}
    >
      <img src={pin.image} alt={pin.title} loading="lazy" className="w-full object-cover" style={{ aspectRatio: '1/1' }} />
      {hovered && (
        <div className="absolute inset-0 flex items-end p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
          <p className="text-white text-xs font-semibold truncate">{pin.title}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function PinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pin, setPin] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPins') || '[]').includes(String(id)); }
    catch { return false; }
  });
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [shared, setShared] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPin = async () => {
      if (!id) {
        setPin(null);
        setRelated([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const pinData = await apiGet(`/api/pins/${id}`);
        const normalizedPin = normalizePin(pinData, id);

        if (!isMounted) return;
        setPin(normalizedPin);
        setLikeCount(normalizedPin?.likes || 0);

        let allPins = [];
        try {
          const response = await apiGet('/api/pins/all');
          const backendPins = Array.isArray(response) ? response : [];
          allPins = backendPins.map((item) => normalizePin(item, item.id));
        } catch {
          allPins = [];
        }

        const fallbackPins = getAllPins().map((item) => normalizePin(item, item.id)).filter(Boolean);
        const mergedPins = [
          ...allPins,
          ...fallbackPins.filter((item) => !allPins.some((candidate) => String(candidate.id) === String(item.id))),
        ];
        setRelated(buildRelatedPins(normalizedPin, mergedPins));
      } catch {
        const fallbackPin = normalizePin(getLocalPinById(id), id);
        if (!isMounted) return;

        if (fallbackPin) {
          setPin(fallbackPin);
          setLikeCount(fallbackPin.likes || 0);
          const fallbackPins = getAllPins().map((item) => normalizePin(item, item.id)).filter(Boolean);
          setRelated(buildRelatedPins(fallbackPin, fallbackPins));
        } else {
          setPin(null);
          setRelated([]);
          setError('This pin could not be loaded right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPin();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('savedPins') || '[]');
      setSaved(savedIds.includes(String(id)));
    } catch {
      setSaved(false);
    }
  }, [id]);

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => liked ? c - 1 : c + 1);
  };

  const handleSave = () => {
    const savedIds = JSON.parse(localStorage.getItem('savedPins') || '[]');
    let updated;
    if (saved) {
      updated = savedIds.filter((sid) => sid !== id);
    } else {
      updated = [...savedIds, id];
    }
    localStorage.setItem('savedPins', JSON.stringify(updated));
    setSaved(!saved);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: 'c' + Date.now(),
      username: user?.username || 'you',
      text: commentText.trim(),
      time: 'Just now',
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#ffffff', ...PS }}>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e60023] border-t-transparent" />
        <p className="text-sm font-semibold" style={{ color: '#62625b' }}>Loading pin...</p>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ backgroundColor: '#ffffff', ...PS }}>
        <h2 className="text-2xl font-bold" style={{ color: '#000000' }}>Pin not found</h2>
        <p className="max-w-md text-sm" style={{ color: '#62625b' }}>{error || 'The pin you are looking for may have been removed or is unavailable right now.'}</p>
        <Link to="/" className="px-5 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: '#e60023' }}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#ffffff', ...PS }}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: '#62625b' }}
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-lg"
            style={{ border: '1px solid #dadad3' }}
          >
            {/* Image */}
            <div className="relative" style={{ backgroundColor: '#f6f6f3' }}>
              <img
                src={pin.image || 'https://picsum.photos/seed/pin-fallback/800/1000'}
                alt={pin.title}
                className="w-full h-full object-cover"
                style={{ minHeight: 400, maxHeight: 600 }}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 600 }}>
              {/* Actions */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: liked ? '#ffe0e0' : '#f6f6f3',
                    color: liked ? '#e60023' : '#000000',
                  }}
                >
                  <Heart size={16} fill={liked ? '#e60023' : 'none'} stroke={liked ? '#e60023' : 'currentColor'} />
                  {likeCount.toLocaleString()}
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all"
                  style={{ backgroundColor: saved ? '#262622' : '#e60023' }}
                >
                  <Bookmark size={16} fill={saved ? 'white' : 'none'} />
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="ml-auto p-2.5 rounded-full transition-all hover:bg-[#f6f6f3]"
                  title="Share"
                >
                  <Share2 size={18} style={{ color: shared ? '#22c55e' : '#62625b' }} />
                </button>
              </div>

              {/* Pin info */}
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#000000', letterSpacing: '-0.5px' }}>{pin.title}</h1>
              {pin.description && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#33332e' }}>{pin.description}</p>
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#f6f6f3', color: '#62625b' }}>
                  {pin.category}
                </span>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3 mt-4 pb-4 border-b" style={{ borderColor: '#dadad3' }}>
                <Avatar username={pin.user} size={40} />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#000000' }}>{pin.userFullName}</p>
                  <p className="text-xs" style={{ color: '#62625b' }}>@{pin.user}</p>
                </div>
                <button
                  className="ml-auto px-4 py-1.5 rounded-full text-sm font-bold transition-all hover:brightness-95"
                  style={{ backgroundColor: '#f6f6f3', color: '#000000' }}
                >
                  Follow
                </button>
              </div>

              {/* Comments */}
              <div className="mt-4 flex-1">
                <h3 className="text-sm font-bold mb-3" style={{ color: '#000000' }}>
                  {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </h3>
                <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <Avatar username={c.username} size={32} />
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold" style={{ color: '#000000' }}>{c.username}</span>
                          <span className="text-xs" style={{ color: '#91918c' }}>{c.time}</span>
                        </div>
                        <p className="text-sm mt-0.5" style={{ color: '#33332e' }}>{c.text}</p>
                        <button className="flex items-center gap-1 mt-1 text-xs" style={{ color: '#91918c' }}>
                          <Heart size={10} /> {c.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment input */}
                <form onSubmit={handleComment} className="flex items-center gap-2 mt-4">
                  <Avatar username={user?.username || 'you'} size={32} />
                  <div className="flex-1 flex items-center rounded-full px-4 py-2" style={{ backgroundColor: '#f6f6f3', border: '1px solid #dadad3' }}>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: '#000000' }}
                    />
                    <button type="submit" disabled={!commentText.trim()} className="ml-2 disabled:opacity-40">
                      <Send size={16} style={{ color: '#e60023' }} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Related pins */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold mb-6" style={{ color: '#000000', letterSpacing: '-0.5px' }}>
                More like this
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {related.map((p) => (
                  <RelatedPinCard key={p.id} pin={p} />
                ))}
              </div>
            </section>
          )}
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </ToastProvider>
  );
}
