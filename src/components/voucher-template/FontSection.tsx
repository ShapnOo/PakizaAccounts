import React from 'react';
import { Type } from 'lucide-react';
import {
  FONT_FAMILIES,
  PDF_FONTS,
  COLOR_THEMES,
} from '../../types/voucherTemplate';
import { ColorPicker } from './ColorPicker';

interface FontSectionProps {
  family: string;
  theme: string;
  pdfFont: string;
  color: string;
  size: number;
  background?: string;
  backgroundColor?: string;
  onChange: (patch: {
    family?: string;
    theme?: string;
    pdfFont?: string;
    color?: string;
    size?: number;
    background?: string;
    backgroundColor?: string;
  }) => void;
}

export const FontSection: React.FC<FontSectionProps> = ({
  family,
  theme,
  pdfFont,
  color,
  size,
  background = '',
  backgroundColor = '#ffffff',
  onChange,
}) => {
  return (
    <div className="space-y-3 p-3.5 bg-card rounded-xl border border-border/80 shadow-2xs">
      <div className="flex items-center gap-2 pb-1 border-b border-border/60">
        <Type className="size-3.5 text-indigo-600" />
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Typography & Styling
        </h3>
      </div>

      <div className="space-y-3">
        {/* Font Family & Color Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
              Font Family
            </label>
            <select
              value={family}
              onChange={(e) => onChange({ family: e.target.value })}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
                Color Themse{' '}
                <span className="text-[10px] text-muted-foreground font-normal italic">
                  (sic)
                </span>
              </label>
            </div>
            <select
              value={theme}
              onChange={(e) => onChange({ theme: e.target.value })}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              {COLOR_THEMES.map((th) => (
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PDF Font & Font Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
              PDF Font
            </label>
            <select
              value={pdfFont}
              onChange={(e) => onChange({ pdfFont: e.target.value })}
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              {PDF_FONTS.map((pf) => (
                <option key={pf} value={pf}>
                  {pf}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
              Base Font Size (pt/px)
            </label>
            <input
              type="number"
              min="6"
              max="24"
              value={size}
              onChange={(e) =>
                onChange({ size: parseInt(e.target.value, 10) || 9 })
              }
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Colors: Font Color & Background Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <ColorPicker
            label="Font Color"
            value={color}
            onChange={(newColor) => onChange({ color: newColor })}
          />

          <ColorPicker
            label="Background Color"
            value={backgroundColor}
            onChange={(newBgColor) => onChange({ backgroundColor: newBgColor })}
          />
        </div>

        {/* Background Image/Keyword */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Background Watermark / Image (Optional)
          </label>
          <input
            type="text"
            value={background}
            onChange={(e) => onChange({ background: e.target.value })}
            placeholder="URL or watermark keyword..."
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
