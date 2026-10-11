import React from 'react';

interface CombinatorToggleProps {
  combinator: 'AND' | 'OR';
  onChange: (combinator: 'AND' | 'OR') => void;
}

export const CombinatorToggle: React.FC<CombinatorToggleProps> = ({ combinator, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        Combine:
      </span>
      <div className="inline-flex p-0.5 bg-slate-100 rounded-md border border-slate-200">
        <button
          type="button"
          onClick={() => onChange('AND')}
          className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
            combinator === 'AND'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          AND
        </button>
        <button
          type="button"
          onClick={() => onChange('OR')}
          className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
            combinator === 'OR'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          OR
        </button>
      </div>
    </div>
  );
};
