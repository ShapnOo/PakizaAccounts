import { TrendingUp, Clock } from 'lucide-react';

interface UsageCounterProps {
  usageCount: number;
  lastUsedAt?: string;
}

export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'Never';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    if (diffHours === 0) return 'Just now';
    return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

export function UsageCounter({
  usageCount,
  lastUsedAt,
}: UsageCounterProps) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1">
        <TrendingUp className="size-3 text-emerald-600" />
        <span>{usageCount} {usageCount === 1 ? 'time' : 'times'}</span>
      </span>
      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
        <Clock className="size-2.5" />
        <span>{formatRelativeTime(lastUsedAt)}</span>
      </span>
    </div>
  );
}
