import React from 'react';
import { History, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClearAll: () => void;
}

export function SearchHistory({
  history,
  onSelect,
  onRemove,
  onClearAll,
}: SearchHistoryProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-1">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <History className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Recent searches</span>
        </div>
        {history.length > 1 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
            title="Clear all search history"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AnimatePresence initial={false}>
          {history.map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center rounded-full bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs group pl-3 pr-1.5 py-1 text-xs"
            >
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="font-medium truncate max-w-[140px] sm:max-w-[200px] text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer focus:outline-none"
                title={`Search for "${item}"`}
              >
                {item}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item);
                }}
                className="ml-1 p-0.5 rounded-full text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
                aria-label={`Remove "${item}" from history`}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
