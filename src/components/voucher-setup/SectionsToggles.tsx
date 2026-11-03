import React from 'react';
import type { TemplateCustomization } from '../../types/voucherTemplate';

interface SectionsTogglesProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const SectionsToggles: React.FC<SectionsTogglesProps> = ({
  customization,
  onChange,
}) => {
  const toggles = [
    {
      key: 'showNarration',
      label: 'Show Narration',
      desc: 'Print voucher narration notes',
      checked: customization.showNarration,
    },
    {
      key: 'showValueInWords',
      label: 'Show Value in Words',
      desc: 'Print grand total textually in words',
      checked: customization.showValueInWords,
    },
    {
      key: 'showSignatures',
      label: 'Show Signatures',
      desc: 'Prepared, Checked, Approved signature block',
      checked: customization.showSignatures,
    },
    {
      key: 'showFooter',
      label: 'Show Footer',
      desc: 'Print page numbers and website',
      checked: customization.showFooter,
    },
  ] as const;

  return (
    <div className="space-y-3 font-sans">
      {toggles.map((t) => (
        <div key={t.key} className="flex items-center justify-between">
          <div>
            <span className="block text-[13px] font-medium text-slate-800">
              {t.label}
            </span>
            <span className="block text-[11.5px] text-slate-400">
              {t.desc}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={t.checked}
              onChange={(e) => onChange({ [t.key]: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>
      ))}
    </div>
  );
};

