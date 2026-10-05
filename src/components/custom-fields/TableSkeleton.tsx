import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="divide-y divide-border/60 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 px-4 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="size-4 bg-muted/60 rounded" />
            <div className="h-4 w-32 bg-muted/70 rounded-md" />
          </div>
          <div className="h-5 w-20 bg-muted/50 rounded-md" />
          <div className="h-5 w-14 bg-muted/50 rounded-full" />
          <div className="h-5 w-16 bg-muted/50 rounded-full" />
          <div className="flex items-center gap-2">
            <div className="size-7 bg-muted/40 rounded-lg" />
            <div className="size-7 bg-muted/40 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
