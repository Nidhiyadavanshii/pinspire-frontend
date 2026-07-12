import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { apiPost } from '../config/api.js';

const PinSansStyle = { fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" };

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setLoading(false);
      // Focus first input after animation
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (mode === 'signup') {
      if (!fullName.trim()) return 'Full name is required';
      if (!username.trim()) return 'Username is required';
      if (password !== confirmPassword) return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        // No backend login endpoint available per api.js, so simulate success for UX
        // In a real scenario with backend: const data = await apiPost('/api/auth/login', { email, password });
        await new Promise((r) => setTimeout(r, 800));
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = { id: 1, email, fullName: email.split('@')[0], username: email.split('@')[0] };
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setSuccess('Welcome back!');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 600);
      } else {
        // No backend signup endpoint available per api.js, so simulate success for UX
        await new Promise((r) => setTimeout(r, 800));
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = { id: 1, email, fullName, username };
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setSuccess('Account created successfully!');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 600);
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setUsername('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full max-w-[420px] mx-4 bg-white rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden"
            style={PinSansStyle}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#f6f6f3] transition-colors duration-200"
              aria-label="Close"
            >
              <X size={20} className="text-[#33332e]" />
            </button>

            <div className="px-8 pt-10 pb-8">
              {/* Logo / Brand */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#e60023' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12c0 4.12 2.5 7.65 6.06 9.17-.08-.74-.16-1.88.03-2.69.17-.74 1.12-4.72 1.12-4.72s-.29-.57-.29-1.42c0-1.33.77-2.32 1.73-2.32.81 0 1.21.61 1.21 1.34 0 .82-.52 2.04-.79 3.17-.23.95.48 1.72 1.43 1.72 1.71 0 3.03-1.81 3.03-4.42 0-2.31-1.66-3.92-4.03-3.92-2.74 0-4.35 2.06-4.35 4.18 0 .83.32 1.72.72 2.2.08.1.09.18.07.28-.07.3-.24.95-.27 1.08-.04.17-.14.21-.33.13-1.24-.58-2.01-2.38-2.01-3.83 0-3.12 2.27-5.99 6.54-5.99 3.44 0 6.11 2.45 6.11 5.72 0 3.41-2.15 6.16-5.14 6.16-1 0-1.95-.52-2.27-1.14l-.62 2.36c-.22.87-.83 1.95-1.24 2.61.93.29 1.92.44 2.95.44 5.52 0 10-4.48 10-10S17.52 2 12 2z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h2
                className="text-center text-[28px] font-bold leading-[1.2] tracking-[-1.2px] mb-2"
                style={{ color: '#000000', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
              >
                {mode === 'login' ? 'Welcome back' : 'Sign up'}
              </h2>
              <p
                className="text-center text-[16px] font-normal leading-[1.4] mb-6"
                style={{ color: '#33332e', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
              >
                {mode === 'login'
                  ? 'Find new ideas to try'
                  : 'Discover new ideas to try'}
              </p>

              {/* Error / Success */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 px-3 py-2.5 rounded-[8px] text-[14px] font-medium leading-[1.4]"
                    style={{ backgroundColor: '#ffe0e0', color: '#9e0a0a' }}
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 px-3 py-2.5 rounded-[8px] text-[14px] font-medium leading-[1.4]"
                    style={{ backgroundColor: '#c7f0da', color: '#103c25' }}
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <>
                    <div>
                      <input
                        ref={firstInputRef}
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[16px] text-[16px] font-normal leading-[1.4] border border-[#dadad3] outline-none transition-all duration-200 focus:border-[#435ee5] focus:ring-2 focus:ring-[#435ee5]/20"
                        style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif", height: 44 }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[16px] text-[16px] font-normal leading-[1.4] border border-[#dadad3] outline-none transition-all duration-200 focus:border-[#435ee5] focus:ring-2 focus:ring-[#435ee5]/20"
                        style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif", height: 44 }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <input
                    ref={mode === 'login' ? firstInputRef : undefined}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[16px] text-[16px] font-normal leading-[1.4] border border-[#dadad3] outline-none transition-all duration-200 focus:border-[#435ee5] focus:ring-2 focus:ring-[#435ee5]/20"
                    style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif", height: 44 }}
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 rounded-[16px] text-[16px] font-normal leading-[1.4] border border-[#dadad3] outline-none transition-all duration-200 focus:border-[#435ee5] focus:ring-2 focus:ring-[#435ee5]/20"
                    style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif", height: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[#f6f6f3] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-[#91918c]" />
                    ) : (
                      <Eye size={18} className="text-[#91918c]" />
                    )}
                  </button>
                </div>

                {mode === 'signup' && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-11 rounded-[16px] text-[16px] font-normal leading-[1.4] border border-[#dadad3] outline-none transition-all duration-200 focus:border-[#435ee5] focus:ring-2 focus:ring-[#435ee5]/20"
                      style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif", height: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[#f6f6f3] transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} className="text-[#91918c]" />
                      ) : (
                        <Eye size={18} className="text-[#91918c]" />
                      )}
                    </button>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#dadad3] text-[#e60023] focus:ring-[#e60023]/30"
                      />
                      <span
                        className="text-[14px] font-normal leading-[1.4]"
                        style={{ color: '#33332e', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
                      >
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-[14px] font-semibold leading-[1.4] hover:underline"
                      style={{ color: '#33332e', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
                      onClick={() => setError('Password reset is not available in demo mode.')}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full mt-2 py-2.5 px-4 rounded-[16px] text-[14px] font-bold leading-[1] text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: loading ? '#cc001f' : '#e60023',
                    fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif",
                    height: 40,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : mode === 'login' ? (
                    'Log in'
                  ) : (
                    'Create account'
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#dadad3]" />
                <span
                  className="text-[12px] font-medium leading-[1.5] uppercase tracking-[0.08em]"
                  style={{ color: '#91918c', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
                >
                  or
                </span>
                <div className="flex-1 h-px bg-[#dadad3]" />
              </div>

              {/* Switch mode */}
              <div className="text-center">
                <span
                  className="text-[14px] font-normal leading-[1.4]"
                  style={{ color: '#33332e', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
                >
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                </span>
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-[14px] font-bold leading-[1.4] hover:underline"
                  style={{ color: '#e60023', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </div>

              {/* Terms */}
              <p
                className="text-center text-[12px] font-normal leading-[1.4] mt-5"
                style={{ color: '#91918c', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
              >
                By continuing, you agree to our{' '}
                <span className="font-semibold" style={{ color: '#33332e' }}>
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="font-semibold" style={{ color: '#33332e' }}>
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
