import React, { useState } from 'react';
import type { ISCustomRow } from '../../types/isCustomization';

interface CodeCellProps {
  row: ISCustomRow;
  allRows: ISCustomRow[];
  onChange: (newCode: string) => void;
}

export const CodeCell: React.FC<CodeCellProps> = ({ row, allRows, onChange }) => {
  const [val, setVal] = useState(row.code);
  const isParent = row.kind === 'parent';

  // Check duplicate
  const isDuplicate = allRows.some(
    (r) =>
      r.id !== row.id &&
      r.kind === row.kind &&
      r.code.toUpperCase() === val.trim().toUpperCase()
  );

  const handleBlur = () => {
    const trimmed = val.trim();
    if (!trimmed) {
      setVal(row.code);
      return;
    }
    const formatted = isParent ? trimmed.toUpperCase() : trimmed;
    if (formatted !== row.code) {
      onChange(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setVal(row.code);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={val}
        maxLength={4}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-12 h-7 px-2 text-center rounded-md text-[13px] font-semibold outline-none transition select-all [font-feature-settings:'tnum'] ${
          isDuplicate
            ? 'bg-rose-50 text-rose-700 border border-rose-300 ring-1 ring-rose-400'
            : isParent
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300 focus:bg-white focus:border-indigo-500'
            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500'
        }`}
        title={
          isDuplicate
            ? `Duplicate code "${val}" in ${row.kind}s`
            : isParent
            ? 'Parent Section Code (A-Z)'
            : 'Child Line Code (Number)'
        }
      />
    </div>
  );
};
