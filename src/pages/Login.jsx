import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const mockToken = 'pinspire-token-' + Date.now();
      const mockUser = {
        id: 'u-demo',
        email,
        fullName: rememberMe ? email.split('@')[0] : email.split('@')[0],
        username: email.split('@')[0].toLowerCase().replace(/\s+/g, '_'),
        bio: 'Passionate about creativity and design.',
        followers: 1240,
        following: 380,
        totalPins: 47,
        avatar: null,
        coverImage: null,
      };
      login(mockUser, mockToken);
      navigate(from, { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f6f6f3', ...PS }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ backgroundColor: '#e60023' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-md"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.12 2.5 7.65 6.06 9.17-.08-.74-.16-1.88.03-2.69.17-.74 1.12-4.72 1.12-4.72s-.29-.57-.29-1.42c0-1.33.77-2.32 1.73-2.32.81 0 1.21.61 1.21 1.34 0 .82-.52 2.04-.79 3.17-.23.95.48 1.72 1.43 1.72 1.71 0 3.03-1.81 3.03-4.42 0-2.31-1.66-3.92-4.03-3.92-2.74 0-4.35 2.06-4.35 4.18 0 .83.32 1.72.72 2.2.08.1.09.18.07.28-.07.3-.24.95-.27 1.08-.04.17-.14.21-.33.13-1.24-.58-2.01-2.38-2.01-3.83 0-3.12 2.27-5.99 6.54-5.99 3.44 0 6.11 2.45 6.11 5.72 0 3.41-2.15 6.16-5.14 6.16-1 0-1.95-.52-2.27-1.14l-.62 2.36c-.22.87-.83 1.95-1.24 2.61.93.29 1.92.44 2.95.44 5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="white" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ letterSpacing: '-1px' }}>Welcome back to Pinspire</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Discover millions of ideas for every interest. Save the things you love and find inspiration for your next project.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {['Nature', 'Travel', 'Food', 'Fashion', 'Art', 'Architecture'].map((cat) => (
              <span key={cat} className="px-3 py-1.5 rounded-full text-sm font-semibold text-white/90 bg-white/15">
                {cat}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e60023' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.12 2.5 7.65 6.06 9.17-.08-.74-.16-1.88.03-2.69.17-.74 1.12-4.72 1.12-4.72s-.29-.57-.29-1.42c0-1.33.77-2.32 1.73-2.32.81 0 1.21.61 1.21 1.34 0 .82-.52 2.04-.79 3.17-.23.95.48 1.72 1.43 1.72 1.71 0 3.03-1.81 3.03-4.42 0-2.31-1.66-3.92-4.03-3.92-2.74 0-4.35 2.06-4.35 4.18 0 .83.32 1.72.72 2.2.08.1.09.18.07.28-.07.3-.24.95-.27 1.08-.04.17-.14.21-.33.13-1.24-.58-2.01-2.38-2.01-3.83 0-3.12 2.27-5.99 6.54-5.99 3.44 0 6.11 2.45 6.11 5.72 0 3.41-2.15 6.16-5.14 6.16-1 0-1.95-.52-2.27-1.14l-.62 2.36c-.22.87-.83 1.95-1.24 2.61.93.29 1.92.44 2.95.44 5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-bold" style={{ color: '#e60023' }}>Pinspire</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8" style={{ border: '1px solid #dadad3' }}>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#000000', letterSpacing: '-0.8px' }}>Log in</h2>
            <p className="text-sm mb-6" style={{ color: '#62625b' }}>Welcome back — find new ideas to try</p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#ffe0e0', color: '#9e0a0a' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#33332e' }}>Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all"
                  style={{ borderColor: '#dadad3', color: '#000000', backgroundColor: '#ffffff' }}
                  onFocus={(e) => (e.target.style.borderColor = '#e60023')}
                  onBlur={(e) => (e.target.style.borderColor = '#dadad3')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#33332e' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm border outline-none transition-all"
                    style={{ borderColor: '#dadad3', color: '#000000', backgroundColor: '#ffffff' }}
                    onFocus={(e) => (e.target.style.borderColor = '#e60023')}
                    onBlur={(e) => (e.target.style.borderColor = '#dadad3')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-[#f6f6f3]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} style={{ color: '#91918c' }} /> : <Eye size={18} style={{ color: '#91918c' }} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#e60023' }}
                  />
                  <span className="text-sm" style={{ color: '#33332e' }}>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: '#e60023' }}
                  onClick={() => setError('Password reset is not available in demo mode.')}
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{ backgroundColor: '#e60023' }}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                ) : 'Log in'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm" style={{ color: '#62625b' }}>Don't have an account? </span>
              <Link to="/signup" className="text-sm font-bold hover:underline" style={{ color: '#e60023' }}>
                Sign up
              </Link>
            </div>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: '#91918c' }}>
            By continuing, you agree to our{' '}
            <span className="font-semibold" style={{ color: '#62625b' }}>Terms of Service</span>
            {' '}and{' '}
            <span className="font-semibold" style={{ color: '#62625b' }}>Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
