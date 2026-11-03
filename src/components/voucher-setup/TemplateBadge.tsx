import React from 'react';
import type { TemplateId } from '../../types/voucherTemplate';
import { TEMPLATE_INFO } from '../../types/voucherTemplate';
import { FileText, Minus, Grid3x3, Frame } from 'lucide-react';

interface TemplateBadgeProps {
  templateId: TemplateId;
}

export const TemplateBadge: React.FC<TemplateBadgeProps> = ({ templateId }) => {
  const info = TEMPLATE_INFO[templateId] || TEMPLATE_INFO.cleanGrid;

  const renderIcon = () => {
    switch (templateId) {
      case 'standard':
        return <FileText className="size-3 text-slate-500" />;
      case 'minimal':
        return <Minus className="size-3 text-slate-500" />;
      case 'cleanGrid':
        return <Grid3x3 className="size-3 text-indigo-500" />;
      case 'framedLedger':
        return <Frame className="size-3 text-amber-600" />;
      default:
        return <Grid3x3 className="size-3 text-slate-500" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 text-slate-700 border border-slate-200 text-[13px] font-medium font-sans">
      {renderIcon()}
      <span>{info.label}</span>
    </span>
  );
};

