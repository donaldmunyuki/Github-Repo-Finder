import { cn } from '../lib/utils';
import { ArrowDownUp, Code2 } from 'lucide-react';

interface FilterBarProps {
  sort: string;
  onSortChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  totalCount?: number;
}

export function FilterBar({ sort, onSortChange, language, onLanguageChange, totalCount }: FilterBarProps) {
  const languages = [
    { value: '', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'c++', label: 'C++' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
    { value: 'swift', label: 'Swift' },
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-200 dark:border-white/10 mb-6 lg:flex-row lg:justify-between transition-colors">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        {totalCount !== undefined && (
          <>
            <span className="font-semibold text-slate-900 dark:text-white">{totalCount.toLocaleString()}</span>
            <span>repositories found</span>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="language" className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Code2 className="w-3 h-3" /> Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors pr-8 focus:outline-none dark:[&>option]:bg-neutral-900 dark:[&>option]:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ArrowDownUp className="w-3 h-3" /> Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors pr-8 focus:outline-none dark:[&>option]:bg-neutral-900 dark:[&>option]:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900"
          >
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
