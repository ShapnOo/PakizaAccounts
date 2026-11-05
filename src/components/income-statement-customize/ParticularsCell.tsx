import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { GroupedMasterDropdown } from './GroupedMasterDropdown';
import { PARENT_PRESETS } from '../../mock/isCustomization';
import { buildDisplayLabel } from '../../lib/isCustomizationMath';
import type { ISCustomRow } from '../../types/isCustomization';

interface ParticularsCellProps {
  row: ISCustomRow;
  onChange: (particulars: string) => void;
  autoFocus?: boolean;
}

export const ParticularsCell: React.FC<ParticularsCellProps> = ({
  row,
  onChange,
  autoFocus = false,
}) => {
  const isParent = row.kind === 'parent';

  // Parent Combobox state
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsPresetOpen(false);
      }
    };
    if (isPresetOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isPresetOpen]);

  const currentParticulars = row.particulars || (row as any).label || '';

  // If child row: render GroupedMasterDropdown
  if (!isParent) {
    return (
      <div className="flex items-center gap-2 w-full">
        {row.isCustom && (
          <span
            className="size-1.5 rounded-full bg-violet-500 shrink-0 select-none"
            title="User-added custom line"
          />
        )}
        <GroupedMasterDropdown
          value={currentParticulars}
          onChange={onChange}
          autoFocus={autoFocus}
        />
      </div>
    );
  }

  // Parent row: Combobox (editable text + preset dropdown)
  // Compute display suffix e.g. "(A)" or "(A-B)"
  const displayLabel = buildDisplayLabel({ ...row, particulars: currentParticulars });
  const matchSuffix = displayLabel.match(/\(([^)]+)\)$/);
  const suffix = matchSuffix ? `(${matchSuffix[1]})` : `(${row.code})`;

  return (
    <div className="relative w-full flex items-center gap-2" ref={containerRef}>
      {row.isCustom && (
        <span
          className="size-1.5 rounded-full bg-violet-500 shrink-0 select-none"
          title="User-added custom section"
        />
      )}

      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={currentParticulars}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Section title..."
          className="w-full h-8 pl-2 pr-7 rounded-md border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent hover:bg-white focus:bg-white text-[13px] font-semibold text-slate-900 outline-none transition focus:ring-1 focus:ring-indigo-500"
        />

        <button
          type="button"
          onClick={() => setIsPresetOpen(!isPresetOpen)}
          className="absolute right-1 text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
          title="Choose from preset section titles"
        >
          <ChevronDown
            className={`size-3.5 transition-transform ${isPresetOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Suffix indicator (display-only, derived from Code + Formula) */}
      <span
        className="text-[12px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60 select-none shrink-0"
        title="Derived display suffix (Code / Formula)"
      >
        {suffix}
      </span>

      {/* Preset Dropdown */}
      {isPresetOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg border border-slate-200 shadow-xl z-50 py-1 max-h-56 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Preset Section Titles
          </div>
          {PARENT_PRESETS.map((preset) => {
            const isSelected = row.particulars === preset;
            return (
              <div
                key={preset}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onChange(preset);
                  setIsPresetOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onChange(preset);
                    setIsPresetOpen(false);
                  }
                }}
                className={`px-3 py-1.5 text-[13px] flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer ${
                  isSelected ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
                }`}
              >
                <span>{preset}</span>
                {isSelected && <Check className="size-3.5 text-indigo-600" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
