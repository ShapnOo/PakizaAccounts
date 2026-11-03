import React from 'react';
import type {
  TemplateId,
  TemplateCustomization,
} from '../../types/voucherTemplate';

interface TemplateSpecificTogglesProps {
  templateId: TemplateId;
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const TemplateSpecificToggles: React.FC<TemplateSpecificTogglesProps> = ({
  templateId,
  customization,
  onChange,
}) => {
  const isStandard = templateId === 'standard';
  const isDualRow = !isStandard;
  const supportsZebra = templateId === 'cleanGrid' || templateId === 'framedLedger';

  return (
    <div className="space-y-3 font-sans">
      {/* Standard: Difference Row */}
      {isStandard && (
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-[13px] font-medium text-slate-800">
              Show "Difference" Row
            </span>
            <span className="block text-[11.5px] text-slate-400">
              Display Dr minus Cr difference row in table footer
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={customization.showDifferenceRow ?? true}
              onChange={(e) => onChange({ showDifferenceRow: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>
      )}

      {/* Minimal, Clean Grid, Framed Ledger: Multi-Currency & Aux options */}
      {isDualRow && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[13px] font-medium text-slate-800">
                Show Currency Summary
              </span>
              <span className="block text-[11.5px] text-slate-400">
                Multi-currency debit/credit breakdown block
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={customization.showCurrencySummary ?? true}
                onChange={(e) => onChange({ showCurrencySummary: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[13px] font-medium text-slate-800">
                Show Balance Indicator
              </span>
              <span className="block text-[11.5px] text-slate-400">
                Balanced (green) or Out of Balance (red) badge
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={customization.showBalanceIndicator ?? true}
                onChange={(e) => onChange({ showBalanceIndicator: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[13px] font-medium text-slate-800">
                Show Line Description Column
              </span>
              <span className="block text-[11.5px] text-slate-400">
                Separate column for entry line descriptions
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={customization.showLineDescription ?? true}
                onChange={(e) => onChange({ showLineDescription: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[13px] font-medium text-slate-800">
                Show Aux Dimensions Row
              </span>
              <span className="block text-[11.5px] text-slate-400">
                Secondary row with Cost Center, Subsidiary, etc.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={customization.showAuxRow ?? true}
                onChange={(e) => onChange({ showAuxRow: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>
        </>
      )}

      {/* Zebra Stripes */}
      {supportsZebra && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="block text-[13px] font-medium text-slate-800">
              Zebra Stripes
            </span>
            <span className="block text-[11.5px] text-slate-400">
              Alternate row shading in line item table
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={customization.zebraStripes ?? false}
              onChange={(e) => onChange({ zebraStripes: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>
      )}
    </div>
  );
};

