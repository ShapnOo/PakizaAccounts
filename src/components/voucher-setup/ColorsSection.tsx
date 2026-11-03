import React from 'react';
import type { TemplateCustomization } from '../../types/voucherTemplate';
import { resolveBorderColor } from '../../types/voucherTemplate';
import { Palette, Square } from 'lucide-react';

interface ColorsSectionProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

const BORDER_COLOR_SWATCHES = [
  { label: 'Black', hex: '#000000' },
  { label: 'Slate', hex: '#0f172a' },
  { label: 'Navy', hex: '#1e40af' },
  { label: 'Charcoal', hex: '#334155' },
  { label: 'Muted', hex: '#94a3b8' },
  { label: 'Light', hex: '#cbd5e1' },
];

const WEIGHT_PRESETS = [
  { label: '0.5px', desc: 'Hairline', val: 0.5 },
  { label: '1px', desc: 'Thin', val: 1 },
  { label: '1.5px', desc: 'Medium', val: 1.5 },
  { label: '2px', desc: 'Bold', val: 2 },
  { label: '3px', desc: 'Heavy', val: 3 },
];

const OPACITY_PRESETS = [
  { label: '100%', val: 1.0 },
  { label: '80%', val: 0.8 },
  { label: '60%', val: 0.6 },
  { label: '40%', val: 0.4 },
  { label: '20%', val: 0.2 },
];

export const ColorsSection: React.FC<ColorsSectionProps> = ({
  customization,
  onChange,
}) => {
  const borderColor = customization.borderColor || '#000000';
  const borderWeight = customization.borderWeight ?? 1;
  const borderOpacity = customization.borderOpacity ?? 1.0;

  const resolvedBorder = resolveBorderColor(borderColor, borderOpacity);

  return (
    <div className="space-y-4 font-sans text-[13px]">
      {/* ── 1. Color Palette: Primary & Accent ── */}
      <div className="space-y-3 pb-3 border-b border-slate-100">
        <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider block">
          Text & Theme Colors
        </label>

        {/* Primary Text */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-slate-600">
            Primary Text Color
          </span>
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
          <span className="text-[12px] font-medium text-slate-600">
            Accent Color (Headers)
          </span>
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

      {/* ── 2. Border Customization: Color, Weight, Opacity ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Square className="size-3.5 text-indigo-600" />
            <span>Border & Frame Styling</span>
          </label>

          {/* Live sample chip */}
          <div
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-white"
            style={{
              borderColor: resolvedBorder,
              borderWidth: `${Math.min(3, Math.max(1, borderWeight))}px`,
              borderStyle: 'solid',
              color: resolvedBorder,
            }}
          >
            {borderWeight}px · {Math.round(borderOpacity * 100)}%
          </div>
        </div>

        {/* Border Color */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium text-slate-600">
              Border Color
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={borderColor}
                onChange={(e) => onChange({ borderColor: e.target.value })}
                className="size-7 rounded border border-slate-200 cursor-pointer p-0 bg-white"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => onChange({ borderColor: e.target.value })}
                className="w-20 h-7 px-2 rounded border border-slate-200 text-[12px] font-mono text-slate-700 uppercase"
              />
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {BORDER_COLOR_SWATCHES.map((swatch) => {
              const isSelected = borderColor.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  title={swatch.label}
                  onClick={() => onChange({ borderColor: swatch.hex })}
                  className={`size-6 rounded-md border transition-transform cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'scale-110 ring-2 ring-indigo-500 ring-offset-1 border-indigo-600 shadow-2xs'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && (
                    <span className="text-[9px] font-bold text-white leading-none">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Border Weight / Thickness */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium text-slate-600">
              Border Weight (Thickness)
            </span>
            <span className="text-[11px] font-bold text-indigo-700">
              {borderWeight}px
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {WEIGHT_PRESETS.map((w) => {
              const isSelected = Math.abs(borderWeight - w.val) < 0.1;
              return (
                <button
                  key={w.val}
                  type="button"
                  onClick={() => onChange({ borderWeight: w.val })}
                  className={`py-1 text-center rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] leading-tight font-semibold">{w.label}</div>
                  <div className={`text-[8.5px] leading-tight ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {w.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Border Opacity */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium text-slate-600">
              Border Opacity
            </span>
            <span className="text-[11px] font-bold text-indigo-700">
              {Math.round(borderOpacity * 100)}%
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {OPACITY_PRESETS.map((op) => {
              const isSelected = Math.abs(borderOpacity - op.val) < 0.05;
              return (
                <button
                  key={op.label}
                  type="button"
                  onClick={() => onChange({ borderOpacity: op.val })}
                  className={`py-1 text-[11px] font-medium rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {op.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
