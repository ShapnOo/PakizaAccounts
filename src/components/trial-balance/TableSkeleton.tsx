import React from 'react';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse p-4 space-y-3 font-sans">
      <div className="h-8 bg-slate-100 rounded-md w-1/4"></div>
      <div className="h-10 bg-slate-200 rounded-md w-full"></div>
      <div className="space-y-2">
        <div className="h-8 bg-slate-100 rounded-md w-full"></div>
        <div className="h-8 bg-slate-50 rounded-md w-full"></div>
        <div className="h-8 bg-slate-50 rounded-md w-full"></div>
        <div className="h-8 bg-slate-100 rounded-md w-full"></div>
        <div className="h-8 bg-slate-50 rounded-md w-full"></div>
      </div>
      <div className="h-10 bg-indigo-50 rounded-md w-full"></div>
    </div>
  );
};

