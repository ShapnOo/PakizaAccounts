import React from 'react';
import { Filter, ArrowRight, Layers } from 'lucide-react';
import { useBulkUpdateStore } from '../../stores/bulkUpdateStore';

export const ListHeader: React.FC = () => {
  const { openFilterModal } = useBulkUpdateStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Bulk Data Update
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Filter and update many vouchers in one go
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={openFilterModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 active:bg-indigo-800 transition-all shadow-sm shadow-indigo-200"
        >
          <Filter className="w-4 h-4 text-white" />
          <span>Filter and Update</span>
          <ArrowRight className="w-4 h-4 text-indigo-200" />
        </button>
      </div>
    </div>
  );
};
