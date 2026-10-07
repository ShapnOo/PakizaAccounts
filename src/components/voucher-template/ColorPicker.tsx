import React, { useState, useRef } from 'react';
import { Palette, Check } from 'lucide-react';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  '#0f172a', // Slate 900
  '#1e293b', // Slate 800
  '#475569', // Slate 600
  '#4f46e5', // Indigo 600
  '#2563eb', // Blue 600
  '#0d9488', // Teal 600
  '#059669', // Emerald 600
  '#d97706', // Amber 600
  '#dc2626', // Red 600
  '#ffffff', // White
  '#f8fafc', // Slate 50
  '#f1f5f9', // Slate 100
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { openUpward } = useDropdownPosition({
    triggerRef,
    isOpen,
    minMenuHeight: 180,
  });

  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
        {label}
      </label>
      <div className="relative" ref={triggerRef}>
        <div className="flex items-center gap-2">
          {/* Swatch Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="size-8 rounded-lg border border-border/80 shadow-2xs cursor-pointer relative shrink-0 p-0.5 bg-background transition-transform active:scale-95"
            style={{ backgroundColor: value || '#ffffff' }}
            title="Choose Color"
          >
            <span className="sr-only">Color swatch</span>
          </button>

          {/* Hex Input */}
          <input
            type="text"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Quick Popover Palette */}
        {isOpen && (
          <div
            className={`absolute left-0 z-30 p-2.5 bg-card border border-border rounded-xl shadow-xl space-y-2 w-48 ${
              openUpward
                ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95'
                : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95'
            }`}
          >
            <div className="flex items-center justify-between pb-1 border-b border-border/60">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Preset Palette
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => {
                    onChange(hex);
                    setIsOpen(false);
                  }}
                  className="size-6 rounded-md border border-border/60 shadow-2xs cursor-pointer transition-transform hover:scale-110 grid place-items-center relative"
                  style={{ backgroundColor: hex }}
                >
                  {value.toLowerCase() === hex.toLowerCase() && (
                    <Check
                      className={`size-3 ${
                        hex === '#ffffff' || hex === '#f8fafc' || hex === '#f1f5f9'
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
