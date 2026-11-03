import React from 'react';
import type { TemplateCustomization } from '../../types/voucherTemplate';
import { FONT_FAMILIES } from '../../types/voucherTemplate';

interface TypographySectionProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({
  customization,
  onChange,
}) => {
  return (
    <div className="space-y-3 font-sans text-[13px]">
      {/* Font Family */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
          Font Family (Preview Paper Only)
        </label>
        <select
          value={customization.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className="w-full h-8 px-2.5 rounded-md border border-slate-200 bg-white text-[13px] text-slate-800 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
            Base Font Size (pt)
          </label>
          <span className="text-[13px] font-bold text-slate-700 tabular-nums">
            {customization.fontSize} pt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="8"
            max="12"
            step="1"
            value={customization.fontSize}
            onChange={(e) => onChange({ fontSize: parseInt(e.target.value, 10) })}
            className="flex-1 accent-indigo-600 cursor-pointer"
          />
          <input
            type="number"
            min="8"
            max="12"
            value={customization.fontSize}
            onChange={(e) =>
              onChange({
                fontSize: Math.min(12, Math.max(8, parseInt(e.target.value, 10) || 9)),
              })
            }
            className="w-12 h-8 px-1.5 text-center rounded border border-slate-200 text-[13px] font-medium tabular-nums"
          />
        </div>
      </div>
    </div>
  );
};

