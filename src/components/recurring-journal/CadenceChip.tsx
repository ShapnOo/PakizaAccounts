import React from 'react';
import { Clock } from 'lucide-react';
import { Cadence } from '../../types/recurringJournal';

interface CadenceChipProps {
  cadence: Cadence;
  size?: 'sm' | 'md';
}

const CADENCE_STYLES: Record<Cadence, { bg: string; text: string; border: string }> = {
  Day: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800/60',
  },
  Week: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800/60',
  },
  Month: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800/60',
  },
  Quarter: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800/60',
  },
  Year: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/60',
  },
};

export const CadenceChip: React.FC<CadenceChipProps> = ({ cadence, size = 'sm' }) => {
  const style = CADENCE_STYLES[cadence] || CADENCE_STYLES.Month;

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-lg border whitespace-nowrap select-none ${style.bg} ${style.text} ${style.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Clock className="size-3 shrink-0" />
      <span>{cadence}</span>
    </span>
  );
};
