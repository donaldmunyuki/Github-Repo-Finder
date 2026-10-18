import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onResetToFeatured?: () => void;
}

export function Navbar({ onResetToFeatured }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = resolvedTheme === 'dark';

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      if (onResetToFeatured) {
        onResetToFeatured();
      }
    } else {
      // Just let the Link navigate
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent pt-0 sm:pt-6 px-0 sm:px-6 pb-2 sm:pb-4 pointer-events-none">
      <nav
        className="pointer-events-auto max-w-4xl mx-auto py-3 px-4 sm:px-6 rounded-none sm:rounded-full transition-all duration-200 border-0 sm:border sm:border-transparent"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(14,16,26,0.7), rgba(14,16,26,0.5)) padding-box, linear-gradient(120deg, rgba(255,255,255,0.25), rgba(255,255,255,0.06)) border-box'
            : 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.7)) padding-box, linear-gradient(120deg, rgba(0,0,0,0.12), rgba(0,0,0,0.04)) border-box',
          backdropFilter: 'blur(16px) saturate(120%)',
          WebkitBackdropFilter: 'blur(16px) saturate(120%)',
          boxShadow: isDark
            ? '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
            : '0 10px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
        }}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center text-left focus:outline-none cursor-pointer"
          >
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white/90">
              Repo Compass
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-white/60">
            <li>
              <Link
                to="/"
                onClick={handleHomeClick}
                className="transition-colors duration-200 rounded-full py-1.5 px-3.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Search
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/trending"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full py-1.5 px-3.5"
              >
                Trending
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex md:hidden p-2 rounded-full transition-all duration-200 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Functional Light / Dark / Auto Button */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pt-3 mt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1 overflow-hidden"
            >
              <Link
                to="/"
                onClick={handleHomeClick}
                className="text-left py-2 px-3 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Search
              </Link>
              <a
                href="https://github.com/trending"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Trending
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
