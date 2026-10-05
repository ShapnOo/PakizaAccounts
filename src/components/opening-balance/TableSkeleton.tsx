import React from 'react';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="divide-y divide-border/40 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 px-4 flex items-center gap-3 bg-muted/10">
          <div className="h-4 w-44 bg-muted/40 rounded" />
          <div className="h-4 w-28 bg-muted/30 rounded" />
          <div className="h-4 w-28 bg-muted/30 rounded" />
          <div className="h-4 w-24 bg-muted/30 rounded" />
          <div className="h-4 w-20 bg-muted/20 rounded" />
          <div className="h-4 flex-1 bg-muted/20 rounded" />
          <div className="h-4 w-20 bg-muted/30 rounded" />
          <div className="h-4 w-24 bg-muted/40 rounded" />
          <div className="h-4 w-24 bg-muted/40 rounded" />
        </div>
      ))}
    </div>
  );
};
