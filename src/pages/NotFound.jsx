import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

const PS = { fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" };

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#ffffff', ...PS }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        {/* Big 404 */}
        <div className="relative mb-8">
          <span
            className="text-[160px] font-black leading-none select-none"
            style={{ color: '#f6f6f3', letterSpacing: '-8px' }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e60023' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.12 2.5 7.65 6.06 9.17-.08-.74-.16-1.88.03-2.69.17-.74 1.12-4.72 1.12-4.72s-.29-.57-.29-1.42c0-1.33.77-2.32 1.73-2.32.81 0 1.21.61 1.21 1.34 0 .82-.52 2.04-.79 3.17-.23.95.48 1.72 1.43 1.72 1.71 0 3.03-1.81 3.03-4.42 0-2.31-1.66-3.92-4.03-3.92-2.74 0-4.35 2.06-4.35 4.18 0 .83.32 1.72.72 2.2.08.1.09.18.07.28-.07.3-.24.95-.27 1.08-.04.17-.14.21-.33.13-1.24-.58-2.01-2.38-2.01-3.83 0-3.12 2.27-5.99 6.54-5.99 3.44 0 6.11 2.45 6.11 5.72 0 3.41-2.15 6.16-5.14 6.16-1 0-1.95-.52-2.27-1.14l-.62 2.36c-.22.87-.83 1.95-1.24 2.61.93.29 1.92.44 2.95.44 5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3" style={{ color: '#000000', letterSpacing: '-0.8px' }}>
          Oops! Page not found
        </h1>
        <p className="text-base mb-8" style={{ color: '#62625b' }}>
          The pin you're looking for doesn't exist or may have been moved. Let's get you back to discovering ideas.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:brightness-105"
            style={{ backgroundColor: '#e60023' }}
          >
            <Home size={16} />
            Back to home
          </Link>
          <Link
            to="/search"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:brightness-95"
            style={{ backgroundColor: '#f6f6f3', color: '#000000' }}
          >
            <Search size={16} />
            Search pins
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
