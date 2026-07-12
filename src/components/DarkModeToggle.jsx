import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      if (prefersDark) document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 9999,
          backgroundColor: '#f6f6f3',
        }}
      />
    );
  }

  return (
    <motion.button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="relative flex items-center justify-center outline-none focus-visible:ring-2"
      style={{
        width: 40,
        height: 40,
        borderRadius: 9999,
        backgroundColor: isDark ? '#33332e' : '#f6f6f3',
        color: isDark ? '#ffffff' : '#000000',
        border: '1px solid transparent',
        fontFamily: "'Pin Sans', 'Inter', 'ui-sans-serif', 'system-ui', sans-serif",
      }}
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ opacity: 0, rotate: isDark ? -45 : 45, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: isDark ? 45 : -45, scale: 0.6 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <Moon size={18} strokeWidth={2} />
        ) : (
          <Sun size={18} strokeWidth={2} />
        )}
      </motion.div>
    </motion.button>
  );
}
