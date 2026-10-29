import React from 'react';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-pulse font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="h-6 w-52 bg-slate-200 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-24 bg-slate-200 rounded" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <div
              className="h-4 bg-slate-200 rounded"
              style={{
                width: `${Math.floor(Math.random() * 25 + 25)}%`,
                marginLeft: `${(i % 3) * 20}px`,
              }}
            />
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

