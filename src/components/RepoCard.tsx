import { GitFork, Star, ExternalLink, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { GitHubRepo } from '../services/github';

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
}

export function RepoCard({ repo, index }: RepoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(repo.html_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-md dark:hover:bg-neutral-850 transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="w-8 h-8 rounded-full border border-slate-100 dark:border-white/10"
            referrerPolicy="no-referrer"
          />
          <div>
            <a
              href={repo.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {repo.owner.login}
            </a>
            <h3 className="font-semibold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                {repo.name}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </h3>
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Copy repository URL"
          aria-label="Copy repository URL"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 flex-grow">
        {repo.description || "No description provided."}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(repo.topics || []).slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200/80 dark:border-white/10"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-1" title="Stars">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1" title="Forks">
            <GitFork className="w-3.5 h-3.5" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-medium text-slate-600 dark:text-slate-300">{repo.language}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
