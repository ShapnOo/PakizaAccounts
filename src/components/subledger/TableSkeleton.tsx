import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  compact?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 4,
  compact = false,
}) => {
  return (
    <div className="divide-y divide-slate-100 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={[
            'flex items-center justify-between gap-4 px-4 bg-white',
            compact ? 'py-2.5' : 'py-3.5',
          ].join(' ')}
        >
          {/* Name & icon placeholder */}
          <div className="flex items-center gap-3 w-2/5 min-w-[180px]">
            <div className="size-7 rounded-lg bg-slate-200/80 shrink-0" />
            <div className="space-y-1.5 w-full">
              <div className="h-3.5 bg-slate-200 rounded w-4/5" />
              <div className="h-2.5 bg-slate-100 rounded w-1/2" />
            </div>
          </div>

          {/* Active status pill placeholder */}
          <div className="w-28 shrink-0">
            <div className="h-6 w-20 bg-slate-200/80 rounded-full" />
          </div>

          {/* Company chips placeholder */}
          <div className="w-1/3 hidden md:flex items-center gap-1.5">
            <div className="h-5 w-16 bg-slate-200/70 rounded-full" />
            <div className="h-5 w-20 bg-slate-200/70 rounded-full" />
          </div>

          {/* Action dots placeholder */}
          <div className="size-8 rounded-lg bg-slate-100 shrink-0" />
        </div>
      ))}
    </div>
  );
};
