import React from 'react';

export const AdvanceFilterColumnHeaders: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pb-2 mb-2 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
      <div className="md:col-span-4">Filter By</div>
      <div className="md:col-span-3">Formula</div>
      <div className="md:col-span-4">Value</div>
      <div className="md:col-span-1 text-center">Action</div>
    </div>
  );
};
