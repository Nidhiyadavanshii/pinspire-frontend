import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const footerLinks = [
  { label: 'About', route: '/about' },
  { label: 'Privacy', route: '/privacy' },
  { label: 'Terms', route: '/terms' },
  { label: 'Contact', route: '/contact' },
  { label: 'GitHub', route: 'https://github.com/' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const isExternal = (route) => route.startsWith('http');

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-t"
      style={{
        borderColor: '#dadad3',
        backgroundColor: '#ffffff',
        fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: '#e60023', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
            >
              Pinboard
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {footerLinks.map((link) => {
              if (isExternal(link.route)) {
                return (
                  <a
                    key={link.label}
                    href={link.route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium transition-colors duration-200 hover:text-black"
                    style={{ color: '#62625b', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.route}
                  className="text-sm font-medium transition-colors duration-200 hover:text-black"
                  style={{ color: '#62625b', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t pt-6 md:flex-row md:justify-between md:gap-4"
          style={{ borderColor: '#e5e5e0' }}
        >
          <p
            className="text-xs"
            style={{ color: '#91918c', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
          >
            &copy; {currentYear} Pinboard. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            <span
              className="text-xs"
              style={{ color: '#91918c', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
            >
              Made with
            </span>
            <Heart
              className="h-3.5 w-3.5"
              style={{ color: '#e60023' }}
              fill="#e60023"
            />
            <span
              className="text-xs"
              style={{ color: '#91918c', fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
            >
              for creators
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
