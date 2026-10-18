import { cn } from '../lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <img 
      src="/logo.svg" 
      alt="Logo" 
      className={cn("w-8 h-8", className)}
    />
  );
}
