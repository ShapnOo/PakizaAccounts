import React from 'react';
import { PaperSize, Orientation, PAPER_SIZES_MM } from '../../types/voucherTemplate';
import { OrientationToggle } from './OrientationToggle';
import { FileText } from 'lucide-react';

interface PaperSectionProps {
  paperSize: PaperSize;
  orientation: Orientation;
  customWidthMm?: number;
  customHeightMm?: number;
  onChange: (patch: {
    size?: PaperSize;
    orientation?: Orientation;
    customWidthMm?: number;
    customHeightMm?: number;
  }) => void;
}

export const PaperSection: React.FC<PaperSectionProps> = ({
  paperSize,
  orientation,
  customWidthMm = 210,
  customHeightMm = 297,
  onChange,
}) => {
  return (
    <div className="space-y-3 p-3.5 bg-card rounded-xl border border-border/80 shadow-2xs">
      <div className="flex items-center gap-2 pb-1 border-b border-border/60">
        <FileText className="size-3.5 text-indigo-600" />
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Paper Setup
        </h3>
      </div>

      <div className="space-y-3">
        {/* Paper Size */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Paper Size
          </label>
          <select
            value={paperSize}
            onChange={(e) => onChange({ size: e.target.value as PaperSize })}
            className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="A4">A4 (210 × 297 mm)</option>
            <option value="A5">A5 (148 × 210 mm)</option>
            <option value="Letter">Letter (8.5 × 11 in)</option>
            <option value="Legal">Legal (8.5 × 14 in)</option>
            <option value="Custom">Custom Dimensions</option>
          </select>
        </div>

        {/* Custom dimensions if Custom */}
        {paperSize === 'Custom' && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-muted-foreground">
                Width (mm)
              </label>
              <input
                type="number"
                value={customWidthMm}
                onChange={(e) =>
                  onChange({ customWidthMm: parseFloat(e.target.value) || 210 })
                }
                className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-muted-foreground">
                Height (mm)
              </label>
              <input
                type="number"
                value={customHeightMm}
                onChange={(e) =>
                  onChange({ customHeightMm: parseFloat(e.target.value) || 297 })
                }
                className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* Orientation Toggle */}
        <OrientationToggle
          value={orientation}
          onChange={(newOrientation) => onChange({ orientation: newOrientation })}
        />
      </div>
    </div>
  );
};
