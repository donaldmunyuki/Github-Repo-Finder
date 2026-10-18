import { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const COMMON_KEYWORDS = [
  "react", "typescript", "javascript", "python", "go", "rust", 
  "vue", "angular", "node", "nextjs", "machine learning", "docker", 
  "kubernetes", "api", "cli", "database", "graphql", "tailwind", 
  "web3", "blockchain", "android", "ios", "aws", "serverless",
  "frontend", "backend", "fullstack", "design system"
];

export function SearchBar({ value, onChange, onSubmit, loading }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const suggestions = value.trim() 
    ? COMMON_KEYWORDS.filter(k => k.includes(value.toLowerCase().trim()) && k !== value.toLowerCase().trim()).slice(0, 5)
    : [];

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsFocused(false);
    // Focus back if needed or submit directly
    setTimeout(() => {
      onSubmit();
    }, 0);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
      <div className="relative group z-20">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={cn(
            "h-5 w-5 transition-colors duration-200",
            isFocused ? "text-indigo-500" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400"
          )} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className={cn(
            "block w-full px-11 py-4 rounded-2xl font-medium transition-all duration-200 shadow-sm",
            "bg-white dark:bg-[#161b22] text-slate-900 dark:text-white",
            "placeholder-slate-400 dark:placeholder-slate-500",
            "border",
            isFocused 
              ? "border-indigo-500 ring-2 ring-indigo-500/20 dark:ring-indigo-500/30 dark:border-indigo-500" 
              : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20",
            loading && "opacity-80"
          )}
          style={{
            // When suggestions are shown, we want the bottom corners to be flat if they touch the dropdown
            borderBottomLeftRadius: isFocused && suggestions.length > 0 ? '1rem' : '1rem',
            borderBottomRightRadius: isFocused && suggestions.length > 0 ? '1rem' : '1rem',
          }}
          placeholder="Search repositories..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsFocused(false);
              inputRef.current?.blur();
              onSubmit();
            }
          }}
          onFocus={() => setIsFocused(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button 
            onClick={() => {
              setIsFocused(false);
              onSubmit();
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            Enter
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-2 z-10 origin-top overflow-hidden bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50"
          >
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Suggestions
              </div>
              <ul className="flex flex-col">
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer group focus:outline-none focus:bg-slate-50 dark:focus:bg-white/5 focus:text-indigo-600 dark:focus:text-indigo-400"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span>{suggestion}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
