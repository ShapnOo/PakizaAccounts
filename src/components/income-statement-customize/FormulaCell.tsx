import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { validateFormula } from '../../lib/isCustomizationMath';
import type { ISCustomRow } from '../../types/isCustomization';

interface FormulaCellProps {
  row: ISCustomRow;
  allRows: ISCustomRow[];
  onChange: (newFormula: string) => void;
}

export const FormulaCell: React.FC<FormulaCellProps> = ({
  row,
  allRows,
  onChange,
}) => {
  // If child row: muted "—" placeholder
  if (row.kind !== 'parent') {
    return (
      <div className="text-slate-300 font-medium text-center select-none text-[13px]">
        —
      </div>
    );
  }

  const [formula, setFormula] = useState(row.formula ?? '');

  useEffect(() => {
    setFormula(row.formula ?? '');
  }, [row.formula]);

  const validation = validateFormula(formula, allRows);

  const handleBlur = () => {
    const trimmed = formula.trim().toUpperCase();
    if (trimmed !== (row.formula ?? '')) {
      onChange(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setFormula(row.formula ?? '');
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={formula}
        placeholder="e.g. 1+2+3 or A-B"
        onChange={(e) => setFormula(e.target.value.toUpperCase())}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full h-7 pl-2.5 pr-7 rounded-md border text-[13px] font-semibold outline-none transition [font-feature-settings:'tnum'] ${
          validation.valid
            ? 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            : 'border-rose-400 bg-rose-50/20 text-rose-700 ring-1 ring-rose-400 focus:border-rose-500'
        }`}
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {validation.valid ? (
          <span title="Valid formula">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          </span>
        ) : (
          <div
            className="pointer-events-auto cursor-help"
            title={validation.error ?? 'Invalid formula'}
          >
            <AlertCircle className="size-3.5 text-rose-500" />
          </div>
        )}
      </div>
    </div>
  );
};
