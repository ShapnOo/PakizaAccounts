import React from 'react';
import type {
  TemplateCustomization,
  WatermarkSource,
} from '../../types/voucherTemplate';
import { resolveWatermarkText } from '../../types/voucherTemplate';
import {
  Building2,
  Building,
  Hash,
  CheckCircle,
  FileText,
  Edit3,
  Ban,
  Sparkles,
} from 'lucide-react';

interface WatermarkSectionProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

interface SourceOption {
  id: WatermarkSource;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const WATERMARK_SOURCES: SourceOption[] = [
  { id: 'none', label: 'None (Disabled)', icon: Ban },
  { id: 'groupName', label: 'Group Name', icon: Building2 },
  { id: 'companyName', label: 'Company Name', icon: Building },
  { id: 'companyShortName', label: 'Company Shortname', icon: Hash },
  { id: 'approvalStatus', label: 'Approval Status', icon: CheckCircle },
  { id: 'voucherName', label: 'Voucher Name', icon: FileText },
  { id: 'custom', label: 'Custom Text / URL', icon: Edit3 },
];

const CUSTOM_QUICK_PRESETS = [
  'DRAFT',
  'PAID',
  'APPROVED',
  'CONFIDENTIAL',
  'VOID',
  'COPY',
];

const OPACITY_PRESETS = [
  { label: '8%', val: 0.08 },
  { label: '12%', val: 0.12 },
  { label: '18%', val: 0.18 },
  { label: '25%', val: 0.25 },
];

export const WatermarkSection: React.FC<WatermarkSectionProps> = ({
  customization,
  onChange,
}) => {
  const currentSource: WatermarkSource =
    customization.watermarkSource ||
    (customization.watermarkText ? 'custom' : 'none');

  const customText =
    customization.watermarkCustomText ?? customization.watermarkText ?? '';
  const placement = customization.watermarkPlacement || 'full';
  const currentOpacity = customization.watermarkOpacity ?? 0.12;

  // Resolved preview text for currently selected source
  const resolvedText = resolveWatermarkText(
    currentSource,
    customText,
    'Pakiza Software Ltd.',
    'Journal'
  );

  const handleSelectSource = (src: WatermarkSource) => {
    if (src === 'none') {
      onChange({
        watermarkSource: 'none',
        watermarkText: '',
      });
      return;
    }

    const resolved = resolveWatermarkText(
      src,
      customText || 'DRAFT',
      'Pakiza Software Ltd.',
      'Journal'
    );

    onChange({
      watermarkSource: src,
      watermarkText: resolved,
    });
  };

  const handleCustomTextChange = (val: string) => {
    onChange({
      watermarkSource: 'custom',
      watermarkCustomText: val,
      watermarkText: val,
    });
  };

  return (
    <div className="space-y-3 font-sans text-[13px]">
      {/* 1. Compact Source Selector */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider block">
          Watermark Source
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {WATERMARK_SOURCES.map((s) => {
            const Icon = s.icon;
            const isSelected = currentSource === s.id;
            const isFullWidth = s.id === 'custom';

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSource(s.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isFullWidth ? 'col-span-2' : ''
                } ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-2xs ring-1 ring-indigo-400/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`size-3.5 shrink-0 ${
                    isSelected ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span className="text-[12px] truncate leading-tight">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Stamp Value Banner (Compact) */}
      {currentSource !== 'none' && (
        <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles className="size-3.5 text-indigo-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-600 shrink-0">
              Active Stamp:
            </span>
            <span className="text-[12px] font-bold text-indigo-900 truncate">
              "{resolvedText || '(Empty)'}"
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
            Active
          </span>
        </div>
      )}

      {/* 3. Custom Input (Compact) */}
      {currentSource === 'custom' && (
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Custom Text or Image URL:
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => handleCustomTextChange(e.target.value)}
              placeholder="e.g. DRAFT, PAID, or https://..."
              className="w-full h-8 px-2.5 text-[12px] rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
          </div>

          <div>
            <span className="block text-[10.5px] font-medium text-slate-500 mb-1">
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-1">
              {CUSTOM_QUICK_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleCustomTextChange(preset)}
                  className={`px-1.5 py-0.5 rounded text-[10.5px] font-semibold border transition-all cursor-pointer ${
                    customText.toUpperCase() === preset
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Placement & Opacity Controls */}
      {currentSource !== 'none' && (
        <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
          {/* Placement */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
              Placement
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg bg-slate-100 border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => onChange({ watermarkPlacement: 'full' })}
                className={`py-1 text-[11.5px] font-medium rounded-md transition-all cursor-pointer ${
                  placement === 'full'
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full Page Center
              </button>
              <button
                type="button"
                onClick={() => onChange({ watermarkPlacement: 'table' })}
                className={`py-1 text-[11.5px] font-medium rounded-md transition-all cursor-pointer ${
                  placement === 'table'
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Table Area Center
              </button>
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Opacity
              </label>
              <span className="text-[11px] font-bold text-slate-700">
                {Math.round(currentOpacity * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {OPACITY_PRESETS.map((op) => {
                const isSelected = Math.abs(currentOpacity - op.val) < 0.02;
                return (
                  <button
                    key={op.label}
                    type="button"
                    onClick={() => onChange({ watermarkOpacity: op.val })}
                    className={`py-1 text-[11px] font-medium rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {op.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
