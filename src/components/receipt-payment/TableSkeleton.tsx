import React from 'react';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse p-4 space-y-4 font-sans">
      <div className="h-8 bg-slate-100 rounded-md w-1/3"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="h-9 bg-emerald-50 rounded-md"></div>
          <div className="h-6 bg-slate-100 rounded-md w-full"></div>
          <div className="h-6 bg-slate-100 rounded-md w-5/6"></div>
          <div className="h-6 bg-slate-100 rounded-md w-4/6"></div>
          <div className="h-8 bg-slate-200 rounded-md w-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-9 bg-rose-50 rounded-md"></div>
          <div className="h-6 bg-slate-100 rounded-md w-full"></div>
          <div className="h-6 bg-slate-100 rounded-md w-5/6"></div>
          <div className="h-6 bg-slate-100 rounded-md w-4/6"></div>
          <div className="h-8 bg-slate-200 rounded-md w-full"></div>
        </div>
      </div>
    </div>
  );
};
