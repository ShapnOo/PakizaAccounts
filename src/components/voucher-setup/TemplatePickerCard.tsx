import React from 'react';
import type { TemplateId, VoucherType } from '../../types/voucherTemplate';
import { TEMPLATE_INFO } from '../../types/voucherTemplate';
import { MiniPreview } from './MiniPreview';
import { Check } from 'lucide-react';

interface TemplatePickerCardProps {
  templateId: TemplateId;
  voucherType: VoucherType;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplatePickerCard: React.FC<TemplatePickerCardProps> = ({
  templateId,
  voucherType,
  isSelected,
  onSelect,
}) => {
  const info = TEMPLATE_INFO[templateId];

  return (
    <div
      onClick={onSelect}
      className={`relative p-3 rounded-xl border transition-all cursor-pointer font-sans flex items-start gap-3 select-none ${
        isSelected
          ? 'bg-indigo-50/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xs'
          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 shadow-2xs'
      }`}
    >
      {/* Mini Thumbnail */}
      <div className="shrink-0">
        <MiniPreview
          templateId={templateId}
          voucherType={voucherType}
          width={60}
          height={80}
          className="rounded shadow-xs"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-1.5">
          <h4 className="text-[13px] font-bold text-slate-800 tracking-tight">
            {info.label}
          </h4>
        </div>
        <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {info.description}
        </p>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 size-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
          <Check className="size-2.5 stroke-[3]" />
        </div>
      )}
    </div>
  );
};

