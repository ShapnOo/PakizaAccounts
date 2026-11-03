import React from 'react';
import type {
  TemplateId,
  VoucherType,
} from '../../types/voucherTemplate';
import { TemplatePickerCard } from './TemplatePickerCard';
import { Info } from 'lucide-react';

interface TemplatePickerProps {
  voucherType: VoucherType;
  selectedTemplateId: TemplateId;
  onSelectTemplate: (tid: TemplateId) => void;
}

const TEMPLATES: TemplateId[] = [
  'standard',
  'minimal',
  'cleanGrid',
  'framedLedger',
];

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  voucherType,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-3 font-sans">
      <div>
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
          Print Template
        </h3>
        <p className="text-[12px] text-slate-500">
          Choose one of 4 fixed layouts
        </p>
      </div>

      <div className="space-y-2.5">
        {TEMPLATES.map((tid) => (
          <TemplatePickerCard
            key={tid}
            templateId={tid}
            voucherType={voucherType}
            isSelected={selectedTemplateId === tid}
            onSelect={() => onSelectTemplate(tid)}
          />
        ))}
      </div>

      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11.5px] text-slate-500 leading-normal">
        <Info className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>Layout is fixed. Only visual properties can be customized.</span>
      </div>
    </div>
  );
};

