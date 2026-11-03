import React from 'react';
import type { TemplateCustomization } from '../../types/voucherTemplate';

interface ColorsSectionProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const ColorsSection: React.FC<ColorsSectionProps> = ({
  customization,
  onChange,
}) => {
  return (
    <div className="space-y-3 font-sans text-[13px]">
      {/* Primary Text */}
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
          Primary Text
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customization.primaryColor}
            onChange={(e) => onChange({ primaryColor: e.target.value })}
            className="size-7 rounded border border-slate-200 cursor-pointer p-0 bg-white"
          />
          <input
            type="text"
            value={customization.primaryColor}
            onChange={(e) => onChange({ primaryColor: e.target.value })}
            className="w-20 h-7 px-2 rounded border border-slate-200 text-[12px] font-mono text-slate-700 uppercase"
          />
        </div>
      </div>

      {/* Accent Color */}
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
          Accent Color (Headers)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customization.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="size-7 rounded border border-slate-200 cursor-pointer p-0 bg-white"
          />
          <input
            type="text"
            value={customization.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="w-20 h-7 px-2 rounded border border-slate-200 text-[12px] font-mono text-slate-700 uppercase"
          />
        </div>
      </div>
    </div>
  );
};

