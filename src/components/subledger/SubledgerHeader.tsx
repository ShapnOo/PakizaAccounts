import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import { useSubledgerStore } from '../../stores/subledgerStore';

export const SubledgerHeader: React.FC = () => {
  const entries = useSubledgerStore((state) => state.entries);
  const activeCount = entries.filter((e) => e.activeStatus === 'Active').length;
  const totalCount = entries.length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Subledger Management
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="size-3 text-indigo-600" />
                Auxiliary Master
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage cost centers, reference centers, and fleet vehicles across company divisions
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-2xs">
          <span className="text-slate-500 font-medium">Status Overview:</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200/60">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            {activeCount} Active
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-bold">{totalCount} Total</span>
        </div>
      </div>
    </div>
  );
};
