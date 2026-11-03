import React from 'react';
import type {
  TemplateCustomization,
  PageCoverage,
  HalfPageOption,
} from '../../types/voucherTemplate';
import { Maximize2, Split, Scissors, Copy } from 'lucide-react';

interface PaperSectionProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const PaperSection: React.FC<PaperSectionProps> = ({
  customization,
  onChange,
}) => {
  const pageCoverage: PageCoverage = customization.pageCoverage || 'full';
  const halfPageOption: HalfPageOption = customization.halfPageOption || 'single';
  const showCutLine = customization.showCutLine ?? true;

  return (
    <div className="space-y-3 font-sans text-[13px]">
      {/* 1. Page Coverage Mode (Full Page vs Half Page) */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider">
            Page Coverage
          </label>
          <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
            {pageCoverage === 'half' ? 'Half Page (1/2 Sheet)' : 'Full Page (1 Sheet)'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => onChange({ pageCoverage: 'full' })}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-[12px] rounded-md transition-all cursor-pointer ${
              pageCoverage === 'full'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Maximize2 className="size-3.5" />
            <span>Full Page</span>
          </button>
          <button
            type="button"
            onClick={() => onChange({ pageCoverage: 'half' })}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-[12px] rounded-md transition-all cursor-pointer ${
              pageCoverage === 'half'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Split className="size-3.5" />
            <span>Half Page</span>
          </button>
        </div>

        {/* Sub-options when Half Page is selected */}
        {pageCoverage === 'half' && (
          <div className="mt-1 p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-200/60 space-y-2">
            <div>
              <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                Half Page Layout:
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => onChange({ halfPageOption: 'single' })}
                  className={`py-1 px-2 text-[11px] rounded border transition-all cursor-pointer text-center ${
                    halfPageOption === 'single'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  1 Voucher (Top Half)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ halfPageOption: 'duplicate' })}
                  className={`py-1 px-2 text-[11px] rounded border transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                    halfPageOption === 'duplicate'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Copy className="size-3" />
                  <span>2 Vouchers (2-in-1)</span>
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between text-[11.5px] text-slate-700 cursor-pointer pt-1 border-t border-indigo-100">
              <span className="flex items-center gap-1.5">
                <Scissors className="size-3.5 text-indigo-600" />
                <span>Show Cut Guideline (✄)</span>
              </span>
              <input
                type="checkbox"
                checked={showCutLine}
                onChange={(e) => onChange({ showCutLine: e.target.checked })}
                className="size-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* 2. Paper Size */}
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

      {/* 3. Orientation */}
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

      {/* 4. Margins */}
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
