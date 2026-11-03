import React from 'react';
import type { TemplateCustomization } from '../../types/voucherTemplate';

interface PaperSectionProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const PaperSection: React.FC<PaperSectionProps> = ({
  customization,
  onChange,
}) => {
  return (
    <div className="space-y-3 font-sans text-[13px]">
      {/* Paper Size */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
          Paper Size
        </label>
        <select
          value={customization.paperSize}
          onChange={(e) =>
            onChange({
              paperSize: e.target.value as TemplateCustomization['paperSize'],
            })
          }
          className="w-full h-8 px-2.5 rounded-md border border-slate-200 bg-white text-[13px] text-slate-800 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer"
        >
          <option value="A4">A4 (210 × 297 mm)</option>
          <option value="A5">A5 (148 × 210 mm)</option>
          <option value="Letter">Letter (8.5 × 11 in)</option>
          <option value="Legal">Legal (8.5 × 14 in)</option>
        </select>
      </div>

      {/* Orientation */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
          Orientation
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">
          {(['Portrait', 'Landscape'] as const).map((orient) => (
            <button
              key={orient}
              type="button"
              onClick={() => onChange({ orientation: orient })}
              className={`py-1 text-[12.5px] font-medium rounded-md transition-all cursor-pointer ${
                customization.orientation === orient
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {orient}
            </button>
          ))}
        </div>
      </div>

      {/* Margins */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
          Margins (inches)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
            <div key={side} className="flex items-center justify-between gap-1 border border-slate-200 rounded-md px-2 py-1 bg-white">
              <span className="text-[11px] uppercase text-slate-400 font-semibold">
                {side}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={customization.margin[side]}
                onChange={(e) =>
                  onChange({
                    margin: {
                      ...customization.margin,
                      [side]: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="w-14 text-right text-[13px] font-medium text-slate-800 outline-none tabular-nums"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

