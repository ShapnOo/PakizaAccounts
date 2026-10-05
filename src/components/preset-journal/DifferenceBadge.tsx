import { Check, AlertCircle } from 'lucide-react';

interface DifferenceBadgeProps {
  difference: number;
  hasAmounts: boolean;
}

export function DifferenceBadge({
  difference,
  hasAmounts,
}: DifferenceBadgeProps) {
  const isBalanced = Math.abs(difference) <= 0.01 && hasAmounts;

  if (isBalanced) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-black font-mono whitespace-nowrap shadow-2xs">
        <Check className="size-3" />
        <span>Balanced ✓</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-[11px] font-black font-mono whitespace-nowrap shadow-2xs animate-pulse">
      <AlertCircle className="size-3" />
      <span>
        Difference: {difference >= 0 ? '+' : ''}
        {difference.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </span>
  );
}
