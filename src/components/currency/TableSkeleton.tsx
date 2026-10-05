import React from 'react';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="divide-y divide-border/40 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-11 px-4 flex items-center justify-between gap-4 bg-muted/10">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-muted/40" />
            <div className="h-4 w-32 bg-muted/40 rounded" />
          </div>
          <div className="h-4 w-28 bg-muted/30 rounded" />
          <div className="h-4 w-24 bg-muted/30 rounded" />
          <div className="h-4 w-12 bg-muted/20 rounded" />
          <div className="h-4 w-16 bg-muted/40 rounded-full" />
          <div className="size-6 bg-muted/30 rounded" />
        </div>
      ))}
    </div>
  );
};
