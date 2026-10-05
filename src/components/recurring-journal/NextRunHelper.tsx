import React from 'react';
import { CalendarDays, Sparkles } from 'lucide-react';
import { computeNextRun, formatRelativeTime } from '../../lib/recurrence';
import { Cadence } from '../../types/recurringJournal';

interface NextRunHelperProps {
  startsOn: string;
  repeatEvery: Cadence;
}

export const NextRunHelper: React.FC<NextRunHelperProps> = ({ startsOn, repeatEvery }) => {
  if (!startsOn) return null;

  const nextDate = computeNextRun(startsOn, repeatEvery);
  const relative = formatRelativeTime(nextDate);

  return (
    <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl w-fit">
      <Sparkles className="size-3.5" />
      <span>Next scheduled execution:</span>
      <span className="font-mono underline">{nextDate}</span>
      <span className="text-muted-foreground font-medium">({relative})</span>
    </div>
  );
};
