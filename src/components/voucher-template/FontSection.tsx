import React, { useState } from 'react';
import { Type, ChevronDown, Table2, Maximize, Sparkles } from 'lucide-react';
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
  watermarkPlacement?: 'table' | 'full';
  watermarkOpacity?: number;
  defaultCollapsed?: boolean;
  onChange: (patch: {
    family?: string;
    theme?: string;
    pdfFont?: string;
    color?: string;
    size?: number;
    background?: string;
    backgroundColor?: string;
    watermarkPlacement?: 'table' | 'full';
    watermarkOpacity?: number;
  }) => void;
}

export const FontSection: React.FC<FontSectionProps> = ({
  family,
  theme,
  color,
  size,
  background = '',
  backgroundColor = '#ffffff',
  watermarkPlacement = 'table',
  watermarkOpacity = 0.15,
  defaultCollapsed = false,
  onChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const watermarkPresets = [
    'DRAFT',
    'COPY',
    'PAID',
    'CONFIDENTIAL',
    'VOID',
    'PAKIZA GROUP',
  ];

  const opacityPresets = [
    { label: '10%', val: 0.1 },
    { label: '15%', val: 0.15 },
    { label: '25%', val: 0.25 },
    { label: '35%', val: 0.35 },
  ];

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
          <span className="text-[10px] text-muted-foreground font-mono bg-muted/80 px-2 py-0.5 rounded-md">
            {family} · {size}px
          </span>
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          />
        </div>
      </button>

      {!isCollapsed && (
        <div className="p-3.5 pt-1 border-t border-border/40 space-y-3.5">
          {/* Font Family & Theme Dropdowns */}
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

          {/* ── Background Watermark / Image (Table Centered) ── */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-indigo-600" />
                <span>Background Watermark / Image</span>
              </label>
              {background && (
                <button
                  type="button"
                  onClick={() => onChange({ background: '' })}
                  className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Clear Watermark
                </button>
              )}
            </div>

            <input
              type="text"
              value={background}
              onChange={(e) => onChange({ background: e.target.value })}
              placeholder="Watermark text (e.g. DRAFT, PAID) or Image URL..."
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />

            {/* Placement & Opacity Controls */}
            <div className="space-y-2 bg-muted/20 p-2.5 rounded-lg border border-border/60">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Placement Toggle */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Position:
                  </span>
                  <div className="flex items-center rounded-md border border-border bg-card p-0.5">
                    <button
                      type="button"
                      onClick={() => onChange({ watermarkPlacement: 'table' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        watermarkPlacement === 'table'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Watermark centered across the Line Items Table (upper section)"
                    >
                      <Table2 className="size-3" />
                      <span>Over Table (Upper)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ watermarkPlacement: 'full' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        watermarkPlacement === 'full'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title="Watermark centered on the entire paper sheet"
                    >
                      <Maximize className="size-3" />
                      <span>Full Page</span>
                    </button>
                  </div>
                </div>

                {/* Opacity Presets */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Opacity:
                  </span>
                  <div className="flex items-center gap-1">
                    {opacityPresets.map((op) => (
                      <button
                        key={op.label}
                        type="button"
                        onClick={() => onChange({ watermarkOpacity: op.val })}
                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold border transition-colors cursor-pointer ${
                          Math.abs(watermarkOpacity - op.val) < 0.02
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
                            : 'bg-card text-muted-foreground border-border/60 hover:text-foreground'
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status hint */}
              <div className="flex items-center gap-1.5 text-[10.5px] text-indigo-700 dark:text-indigo-300 font-medium">
                <Sparkles className="size-3 text-indigo-600 shrink-0" />
                <span>
                  {watermarkPlacement === 'table'
                    ? 'Watermark is centered directly across the data table in the upper page.'
                    : 'Watermark is centered across the full paper sheet.'}
                </span>
              </div>
            </div>

            {/* Quick watermark presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Quick Text Presets:
              </span>
              <div className="flex flex-wrap gap-1">
                {watermarkPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      onChange({
                        background: background === preset ? '' : preset,
                        watermarkPlacement: 'table',
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      background === preset
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
