import React, { useState } from 'react';
import { Type, ChevronDown } from 'lucide-react';
import {
  FONT_FAMILIES,
  PDF_FONTS,
  COLOR_THEMES,
} from '../../types/voucherTemplate';
import { ColorPicker } from './ColorPicker';

interface FontSectionProps {
  family: string;
  theme: string;
  pdfFont?: string;
  color: string;
  size: number;
  background?: string;
  backgroundColor?: string;
  defaultCollapsed?: boolean;
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
  color,
  size,
  background = '',
  backgroundColor = '#ffffff',
  defaultCollapsed = false,
  onChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const watermarkPresets = ['DRAFT', 'COPY', 'PAID', 'CONFIDENTIAL', 'VOID', 'PAKIZA GROUP'];

  return (
    <div className="bg-card rounded-xl border border-border/80 shadow-2xs overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-left cursor-pointer group"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-2">
          <Type className="size-3.5 text-indigo-600 transition-transform group-hover:scale-110" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Typography & Styling
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md">
            {family} • {size}px
          </span>
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          />
        </div>
      </button>

      {!isCollapsed && (
        <div className="p-3.5 pt-1 border-t border-border/40 space-y-3">
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
              <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
                Color Theme
              </label>
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

          {/* Base Font Size */}
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

          {/* Colors: Theme Accent Color & Background Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <ColorPicker
              label="Theme Accent Color"
              value={color}
              onChange={(newColor) => onChange({ color: newColor })}
            />

            <ColorPicker
              label="Paper Background Color"
              value={backgroundColor}
              onChange={(newBgColor) => onChange({ backgroundColor: newBgColor })}
            />
          </div>

          {/* Background Watermark / Image */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
              Background Watermark Text / Image URL
            </label>
            <input
              type="text"
              value={background}
              onChange={(e) => onChange({ background: e.target.value })}
              placeholder="Watermark text (e.g. DRAFT, PAID) or Image URL..."
              className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
            {/* Quick watermark presets */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {watermarkPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange({ background: background === preset ? '' : preset })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                    background === preset
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
