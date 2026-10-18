import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'segmented' | 'dropdown' | 'compact';
}

const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun; description: string }[] = [
  { mode: 'light', label: 'Light', icon: Sun, description: 'Bright & clean' },
  { mode: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
  { mode: 'auto', label: 'Auto', icon: Monitor, description: 'Follows system theme' },
];

export function ThemeToggle({ className = '', variant = 'segmented' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeOption = themeOptions.find((opt) => opt.mode === theme) || themeOptions[2];
  const ActiveIcon = activeOption.icon;

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={dropdownRef}>
      {/* Desktop Segmented Toggle */}
      <div className="hidden sm:inline-flex items-center p-0.5 rounded-full border border-slate-300/80 dark:border-white/10 bg-slate-200/70 dark:bg-white/10 backdrop-blur-md transition-colors">
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.mode;

          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setTheme(opt.mode)}
              title={`${opt.label} Mode — ${opt.description}`}
              aria-label={`Switch to ${opt.label} theme`}
              className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none cursor-pointer ${
                isSelected
                  ? 'text-slate-950 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="theme-active-indicator"
                  className="absolute inset-0 rounded-full bg-white dark:bg-white/20 border border-slate-300/80 dark:border-white/20 shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile/Compact Dropdown Toggle */}
      <div className="sm:hidden relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 border border-slate-300/80 dark:border-white/10 bg-slate-200/70 dark:bg-white/10 text-slate-800 dark:text-white/90 hover:bg-slate-300/70 dark:hover:bg-white/15 focus:outline-none cursor-pointer shadow-xs"
          aria-label={`Theme selector (current: ${activeOption.label})`}
          title={`Theme: ${activeOption.label}`}
        >
          <ActiveIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold pr-0.5">{activeOption.label}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-36 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-xl p-1 z-50 overflow-hidden"
            >
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-1 tracking-wider">
                Theme
              </div>
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.mode;

                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => {
                      setTheme(opt.mode);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-600/20 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
