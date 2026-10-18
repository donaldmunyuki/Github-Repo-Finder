import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchHistory } from '../components/SearchHistory';
import { RepoCard } from '../components/RepoCard';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { Navbar } from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { searchRepos, GitHubRepo } from '../services/github';
import { INITIAL_FEATURED_REPOS } from '../data/featuredRepos';
import { Loader2, AlertCircle, Search, ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MAX_HISTORY = 6;
const STORAGE_KEY = 'github_repo_search_history';

const getStoredHistory = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .slice(0, MAX_HISTORY);
    }
  } catch {
    // Ignore storage parse error
  }
  return [];
};

const saveHistory = (items: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage write error
  }
};

export default function SearchPage() {
  const { resolvedTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState<GitHubRepo[]>(INITIAL_FEATURED_REPOS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('stars');
  const [language, setLanguage] = useState('');
  const [totalCount, setTotalCount] = useState(INITIAL_FEATURED_REPOS.length);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(getStoredHistory);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addToHistory = useCallback((searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const nextHistory = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(nextHistory);
      return nextHistory;
    });
  }, []);

  const handleRemoveHistory = useCallback((itemToRemove: string) => {
    setSearchHistory((prev) => {
      const nextHistory = prev.filter((item) => item !== itemToRemove);
      saveHistory(nextHistory);
      return nextHistory;
    });
  }, []);

  const handleClearAllHistory = useCallback(() => {
    setSearchHistory([]);
    saveHistory([]);
  }, []);
  
  const handleSearch = useCallback(async (newQuery?: string, newPage?: number, newSort?: string, newLanguage?: string) => {
    const searchQuery = newQuery !== undefined ? newQuery : query;
    const searchPage = newPage !== undefined ? newPage : page;
    const searchSort = newSort !== undefined ? newSort : sort;
    const searchLanguage = newLanguage !== undefined ? newLanguage : language;

    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchRepos(searchQuery, searchSort, searchPage, searchLanguage);
      setRepos(data.items);
      setTotalCount(data.total_count);
    } catch (err) {
      setError('Failed to fetch repositories. Please try again later.');
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, [query, page, sort, language]);

  // Trigger search when sort, page, or language changes, but only if we have a query
  useEffect(() => {
    if (hasSearched) {
      handleSearch(query, page, sort, language);
    }
  }, [page, sort, language]);

  const handleResetToFeatured = useCallback(() => {
    setQuery('');
    setHasSearched(false);
    setRepos(INITIAL_FEATURED_REPOS);
    setTotalCount(INITIAL_FEATURED_REPOS.length);
    setError(null);
    setPage(1);
  }, []);

  const onSearchSubmit = () => {
    if (!query.trim()) return;
    addToHistory(query);
    setPage(1); // Reset to page 1 on new search
    handleSearch(query, 1, sort, language);
  };

  const onHistorySelect = (selectedQuery: string) => {
    setQuery(selectedQuery);
    addToHistory(selectedQuery);
    setPage(1);
    handleSearch(selectedQuery, 1, sort, language);
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans text-slate-900 dark:text-slate-100 flex flex-col relative transition-colors duration-200">
      {/* Floating Navbar */}
      <Navbar onResetToFeatured={handleResetToFeatured} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 flex-grow w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3 text-slate-900 dark:text-white transition-colors">
            Search Repositories
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-slate-600 dark:text-slate-400 transition-colors">
            Find exactly what you need with powerful filters.
          </p>
        </div>

        <div className="mb-10">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={onSearchSubmit}
            loading={loading}
          />
          <SearchHistory
            history={searchHistory}
            onSelect={onHistorySelect}
            onRemove={handleRemoveHistory}
            onClearAll={handleClearAllHistory}
          />
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl p-4 mb-8 flex items-center gap-3 text-red-700 dark:text-red-300 max-w-2xl mx-auto shadow-xs"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
            </motion.div>
          ) : (
            repos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {hasSearched ? (
                  <FilterBar
                    sort={sort}
                    onSortChange={(newSort) => {
                      setSort(newSort);
                      setPage(1); // Reset to page 1 on sort change
                    }}
                    language={language}
                    onLanguageChange={(newLanguage) => {
                      setLanguage(newLanguage);
                      setPage(1); // Reset to page 1 on language change
                    }}
                    totalCount={totalCount}
                  />
                ) : (
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-white sm:text-indigo-700 dark:text-white dark:sm:text-indigo-400">
                        Featured Repositories
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        6 popular open-source projects
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {repos.map((repo, index) => (
                    <RepoCard key={repo.id} repo={repo} index={index} />
                  ))}
                </div>

                {hasSearched && totalCount > 12 && (
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(totalCount / 12)}
                    onPageChange={setPage}
                  />
                )}
              </motion.div>
            )
          )}

          {hasSearched && !loading && !error && repos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200/80 dark:bg-white/5 mb-4">
                <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No repositories found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any repositories matching "{query}". Try a different search term or clear the language filter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative mt-auto transition-colors duration-200">
        <div className="sm:px-6 md:px-10 relative max-w-7xl mx-auto pt-16 pr-4 pb-16 pl-4">
          {/* Soft radial glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-0 bottom-0 w-[60%] h-[80%] rounded-[40%] bg-gradient-to-tr from-indigo-500/5 dark:from-white/5 to-transparent blur-3xl"></div>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
            <span className="h-px w-12 bg-slate-300 dark:bg-white/10"></span>
            <span className="italic font-sans">Keep exploring</span>
            <span className="h-px w-12 bg-slate-300 dark:bg-white/10"></span>
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-3xl sm:text-5xl text-slate-900 dark:text-white text-center font-sans font-light tracking-tighter">
            Build Something <span className="text-slate-700 dark:text-white/90 font-sans font-light tracking-tighter">Amazing</span>
          </h2>

          {/* Copy */}
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-center font-sans">
            Discover the best open-source tools, libraries, and frameworks. Contribute to the community and accelerate your development workflow.
          </p>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm font-medium tracking-tight transition shadow-xs dark:shadow-[inset_0_-2px_0_rgba(255,255,255,0.15)] font-sans cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              Explore on GitHub
            </a>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 h-px bg-slate-300 dark:bg-white/10"></div>
          <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
            <p className="font-sans">© <span className="font-sans">{new Date().getFullYear()}</span> REPO COMPASS</p>
            <div className="hidden sm:block text-slate-500">All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
