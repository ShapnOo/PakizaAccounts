import React, { useState, useRef } from 'react';
import { Align } from '../../types/voucherTemplate';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading,
  Compass,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
} from 'lucide-react';

interface HeaderFooterSectionProps {
  companyNameSize: number;
  addressSize: number;
  align: Align;
  showLogo?: boolean;
  logoUrl?: string;
  logoWidth?: number;
  logoPosition?: 'left' | 'center' | 'right';
  showPrintDateTime: boolean;
  showPageNumber: boolean;
  footerName: string;
  footerText?: string;
  defaultCollapsed?: boolean;
  onChangeHeader: (patch: {
    companyNameSize?: number;
    addressSize?: number;
    align?: Align;
    showLogo?: boolean;
    logoUrl?: string;
    logoWidth?: number;
    logoPosition?: 'left' | 'center' | 'right';
  }) => void;
  onChangeFooter: (patch: {
    showPrintDateTime?: boolean;
    showPageNumber?: boolean;
    name?: string;
    text?: string;
  }) => void;
}

export const HeaderFooterSection: React.FC<HeaderFooterSectionProps> = ({
  companyNameSize,
  addressSize,
  align,
  showLogo = true,
  logoUrl = '/company_logo.png',
  logoWidth = 70,
  logoPosition = 'left',
  showPrintDateTime,
  showPageNumber,
  footerName,
  footerText = '',
  defaultCollapsed = false,
  onChangeHeader,
  onChangeFooter,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangeHeader({
          showLogo: true,
          logoUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 shadow-2xs overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-left cursor-pointer group"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-2">
          <Heading className="size-3.5 text-indigo-600 transition-transform group-hover:scale-110" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Header & Footer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md">
            Align: {align}
          </span>
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          />
        </div>
      </button>

      {!isCollapsed && (
        <div className="p-3.5 pt-1 border-t border-border/40 space-y-4">

      {/* ── Sub-heading: Header ── */}
      <div className="space-y-3">
        <div className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-indigo-600" />
          <span>Header</span>
        </div>

        {/* ── Logo Configuration Block ── */}
        <div className="p-2.5 rounded-lg border border-border/80 bg-background/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-indigo-600" />
              <span className="text-[11px] font-bold text-foreground">
                Company Logo
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChangeHeader({ showLogo: !showLogo })}
              className={`h-6 px-2.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer border ${
                showLogo
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-muted text-muted-foreground border-border/60'
              }`}
            >
              {showLogo ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {showLogo && (
            <div className="space-y-2.5 pt-1 border-t border-border/40">
              {/* Logo Preview & Upload Buttons */}
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg border border-border bg-white dark:bg-slate-900 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="size-6 text-muted-foreground/50" />
                  )}
                </div>

                <div className="flex-1 flex flex-wrap gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="size-3" />
                    <span>Upload Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onChangeHeader({
                        showLogo: true,
                        logoUrl: '/company_logo.png',
                      })
                    }
                    title="Reset to default company logo"
                    className="px-2 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    <span>Default</span>
                  </button>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        onChangeHeader({
                          showLogo: false,
                        })
                      }
                      title="Hide logo"
                      className="px-2 py-1 text-xs font-medium rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Position & Width */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-muted-foreground block">
                    Position
                  </label>
                  <div className="flex items-center rounded-lg border border-border bg-background p-0.5 shadow-2xs">
                    {(['left', 'center', 'right'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => onChangeHeader({ logoPosition: pos })}
                        className={`flex-1 py-1 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer ${
                          logoPosition === pos
                            ? 'bg-card text-foreground shadow-2xs border border-border/80'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-muted-foreground block">
                    Width: {logoWidth}px
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="5"
                    value={logoWidth}
                    onChange={(e) =>
                      onChangeHeader({
                        logoWidth: parseInt(e.target.value, 10) || 70,
                      })
                    }
                    className="w-full accent-indigo-600 cursor-pointer h-7"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
              Size (Company Name)
            </label>
            <input
              type="number"
              min="10"
              max="48"
              value={companyNameSize}
              onChange={(e) =>
                onChangeHeader({
                  companyNameSize: parseInt(e.target.value, 10) || 24,
                })
              }
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
              Size (Address)
            </label>
            <input
              type="number"
              min="8"
              max="32"
              value={addressSize}
              onChange={(e) =>
                onChangeHeader({
                  addressSize: parseInt(e.target.value, 10) || 16,
                })
              }
              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Align: Left | Center | Right */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Align
          </label>
          <div className="flex rounded-lg border border-border p-0.5 bg-muted/30">
            <button
              type="button"
              onClick={() => onChangeHeader({ align: 'Left' })}
              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                align === 'Left'
                  ? 'bg-card text-foreground shadow-2xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlignLeft className="size-3.5" />
              <span>Left</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeHeader({ align: 'Center' })}
              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                align === 'Center'
                  ? 'bg-card text-foreground shadow-2xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlignCenter className="size-3.5" />
              <span>Center</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeHeader({ align: 'Right' })}
              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                align === 'Right'
                  ? 'bg-card text-foreground shadow-2xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlignRight className="size-3.5" />
              <span>Right</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-heading: Footer ── */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-indigo-600" />
          <span>Footer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Print Date & Time Toggle */}
          <div className="p-2.5 rounded-lg border border-border/80 bg-background flex items-center justify-between shadow-2xs">
            <span className="text-xs font-semibold text-foreground">
              Print Date & Time
            </span>
            <button
              type="button"
              onClick={() =>
                onChangeFooter({ showPrintDateTime: !showPrintDateTime })
              }
              className={`h-6 px-2.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer border ${
                showPrintDateTime
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-muted text-muted-foreground border-border/60'
              }`}
            >
              {showPrintDateTime ? 'Shown' : 'Hidden'}
            </button>
          </div>

          {/* Number of Page Toggle */}
          <div className="p-2.5 rounded-lg border border-border/80 bg-background flex items-center justify-between shadow-2xs">
            <span className="text-xs font-semibold text-foreground">
              Number of Page
            </span>
            <button
              type="button"
              onClick={() =>
                onChangeFooter({ showPageNumber: !showPageNumber })
              }
              className={`h-6 px-2.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer border ${
                showPageNumber
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-muted text-muted-foreground border-border/60'
              }`}
            >
              {showPageNumber ? 'Shown' : 'Hidden'}
            </button>
          </div>
        </div>

        {/* Footer Name / Website */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Name (Footer Text / Website)
          </label>
          <input
            type="text"
            value={footerName}
            onChange={(e) => onChangeFooter({ name: e.target.value })}
            placeholder="www.Pakizasoftware.com"
            className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>
      </div>
      </div>
    )}
  </div>
  );
};
