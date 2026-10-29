import React from 'react';
import { SubLedgerTag, SUB_LEDGER_TAG_COLORS } from '../../types/trialBalance';
import { User, Building2, Hash, Truck, HelpCircle } from 'lucide-react';

interface SubLedgerTagChipProps {
  tag: SubLedgerTag;
}

export const SubLedgerTagChip: React.FC<SubLedgerTagChipProps> = ({ tag }) => {
  const cfg = SUB_LEDGER_TAG_COLORS[tag] || SUB_LEDGER_TAG_COLORS.Undefined;

  const getIcon = () => {
    switch (tag) {
      case 'Customer':
        return <User className="size-2.5" />;
      case 'Vendor':
        return <Building2 className="size-2.5" />;
      case 'Reference':
        return <Hash className="size-2.5" />;
      case 'Vehicle':
        return <Truck className="size-2.5" />;
      default:
        return <HelpCircle className="size-2.5" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold ring-1 font-sans ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      {getIcon()}
      <span>{tag}</span>
    </span>
  );
};

