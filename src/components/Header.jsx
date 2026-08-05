import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Plus,
  Bookmark,
  Upload,
  LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MessagePanel from './MessagePanel';

const navLinks = [
  { label: 'Home', route: '/' },
];

const primaryCta = { label: 'Get Started', target_route: '#auth-modal' };

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const isActive = (route) => location.pathname === route;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const openAuthModal = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
          borderBottom: scrolled ? '1px solid #dadad3' : '1px solid transparent',
          backdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
          fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#e60023]"
              style={{ fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="16" fill="#e60023" />
                <path
                  d="M16 8c-3.5 0-6 2.5-6 5.5 0 2.2 1.1 3.8 2.6 4.5-.1.6-.5 2-.6 2.3-.1.3.1.3.3.2.9-.6 2.1-1.7 2.5-2.5.4.1.8.1 1.2.1 3.5 0 6-2.5 6-5.5S19.5 8 16 8z"
                  fill="#ffffff"
                />
              </svg>
              <span
                className="hidden text-xl font-bold tracking-tight sm:inline"
                style={{ color: '#e60023' }}
              >
                Pinspire
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.route}
                  to={link.route}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
                  style={{
                    color: isActive(link.route) ? '#000000' : '#33332e',
                    backgroundColor: isActive(link.route) ? '#000000' : 'transparent',
                  }}
                >
                  <span style={{ color: isActive(link.route) ? '#ffffff' : undefined }}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Search */}
          <div className="mx-4 hidden max-w-xl flex-1 md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div
                className="flex items-center rounded-full transition-all duration-200"
                style={{
                  backgroundColor: searchOpen ? '#ffffff' : '#f6f6f3',
                  border: searchOpen ? '2px solid #dadad3' : '2px solid transparent',
                  height: 48,
                }}
              >
                <Search
                  size={18}
                  className="ml-4 shrink-0"
                  style={{ color: '#91918c' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search"
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#91918c]"
                  style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mr-2 rounded-full p-1 transition-colors hover:bg-[#e5e5e0]"
                  >
                    <X size={16} style={{ color: '#62625b' }} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl shadow-lg"
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div className="p-3">
                      <p
                        className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: '#91918c' }}
                      >
                        Recent searches
                      </p>
                      <div className="mt-1 space-y-0.5">
                        {['Nature photography', 'Minimalist interiors', 'Recipe ideas'].map(
                          (term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                setSearchQuery(term);
                                setSearchOpen(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-[#f6f6f3]"
                              style={{ color: '#33332e', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                            >
                              <Search size={16} style={{ color: '#91918c' }} />
                              {term}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to={isAuthenticated ? '/upload' : '/login'}
              className="hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-bold transition-colors hover:bg-[#f6f6f3] md:flex"
              style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
            >
              <Plus size={18} />
              <span className="hidden lg:inline">Create</span>
            </Link>

            <button
              type="button"
              className="relative rounded-full p-2.5 transition-colors hover:bg-[#f6f6f3]"
              aria-label="Notifications"
            >
              <Bell size={22} style={{ color: '#62625b' }} />
              <span
                className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white"
                style={{ backgroundColor: '#e60023' }}
              />
            </button>

            <button
              type="button"
              className="hidden rounded-full p-2.5 transition-colors hover:bg-[#f6f6f3] sm:block"
              aria-label="Messages"
              onClick={() => setShowMessages(true)}
            >
              <MessageCircle size={22} style={{ color: '#62625b' }} />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-[#f6f6f3]"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: '#e60023' }}
                >
                  {isAuthenticated
                    ? <span style={{ fontSize: 13 }}>{(user?.fullName || user?.username || 'U')[0].toUpperCase()}</span>
                    : <User size={16} />}
                </div>
                <ChevronDown
                  size={14}
                  style={{ color: '#91918c' }}
                  className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl"
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div className="p-2">
                      {isAuthenticated ? (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f6f6f3]"
                            style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                          >
                            <User size={16} style={{ color: '#62625b' }} />
                            Profile
                          </Link>
                          <Link
                            to="/saved"
                            onClick={() => setProfileOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f6f6f3]"
                            style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                          >
                            <Bookmark size={16} style={{ color: '#62625b' }} />
                            Saved
                          </Link>
                          <Link
                            to="/upload"
                            onClick={() => setProfileOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f6f6f3]"
                            style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                          >
                            <Upload size={16} style={{ color: '#62625b' }} />
                            Create pin
                          </Link>
                          <Link
                            to="/boards"
                            onClick={() => setProfileOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f6f6f3]"
                            style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                          >
                            <LayoutGrid size={16} style={{ color: '#62625b' }} />
                            My Boards
                          </Link>
                          <div className="my-1 h-px" style={{ backgroundColor: '#dadad3' }} />
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f6f6f3]"
                            style={{ color: '#e60023', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                          >
                            <LogOut size={16} style={{ color: '#e60023' }} />
                            Log out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            onClick={() => setProfileOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f6f6f3]"
                            style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                          >
                            <User size={16} style={{ color: '#62625b' }} />
                            Log in
                          </Link>
                          <Link
                            to="/signup"
                            onClick={() => setProfileOpen(false)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f6f6f3]"
                            style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                          >
                            <Plus size={16} style={{ color: '#62625b' }} />
                            Sign up
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary CTA */}
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="hidden rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:brightness-105 active:scale-95 sm:block"
                style={{
                  backgroundColor: '#e60023',
                  fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {primaryCta.label}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-full p-2 transition-colors hover:bg-[#f6f6f3] md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={22} style={{ color: '#000000' }} />
              ) : (
                <Menu size={22} style={{ color: '#000000' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div
              className="flex items-center rounded-full"
              style={{ backgroundColor: '#f6f6f3', height: 44 }}
            >
              <Search size={16} className="ml-3 shrink-0" style={{ color: '#91918c' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[#91918c]"
                style={{ color: '#000000', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-2 rounded-full p-1"
                >
                  <X size={14} style={{ color: '#62625b' }} />
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.header>

      <MessagePanel isOpen={showMessages} onClose={() => setShowMessages(false)} />

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 h-full w-72 overflow-y-auto"
              style={{ backgroundColor: '#ffffff' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4">
                <span
                  className="text-lg font-bold"
                  style={{ color: '#e60023', fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
                >
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-[#f6f6f3]"
                >
                  <X size={20} style={{ color: '#000000' }} />
                </button>
              </div>

              <nav className="space-y-1 px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.route}
                    to={link.route}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-semibold transition-colors hover:bg-[#f6f6f3]"
                    style={{
                      color: isActive(link.route) ? '#e60023' : '#000000',
                      fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-2 px-3 space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold hover:bg-[#f6f6f3]" style={{ color: '#000000' }}>
                      <User size={18} /> Profile
                    </Link>
                    <Link to="/saved" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold hover:bg-[#f6f6f3]" style={{ color: '#000000' }}>
                      <Bookmark size={18} /> Saved
                    </Link>
                    <Link to="/upload" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold hover:bg-[#f6f6f3]" style={{ color: '#000000' }}>
                      <Upload size={18} /> Create pin
                    </Link>
                    <Link to="/boards" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold hover:bg-[#f6f6f3]" style={{ color: '#000000' }}>
                      <LayoutGrid size={18} /> My Boards
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold hover:bg-[#f6f6f3]" style={{ color: '#e60023' }}>
                      <LogOut size={18} /> Log out
                    </button>
                  </>
                ) : (
                  <div className="mt-2 px-1 space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full rounded-full py-3 text-sm font-bold text-center hover:brightness-95" style={{ backgroundColor: '#f6f6f3', color: '#000000' }}>
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full rounded-full py-3 text-sm font-bold text-center text-white" style={{ backgroundColor: '#e60023' }}>
                      {primaryCta.label}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
