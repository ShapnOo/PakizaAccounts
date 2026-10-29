import React from 'react';
import { SubLedgerTag, SUB_LEDGER_TAG_COLORS } from '../../types/balanceSheet';
import { User, Building2, Hash, Truck, HelpCircle } from 'lucide-react';

interface SubLedgerTagChipProps {
  tag: SubLedgerTag;
  className?: string;
}

export const SubLedgerTagChip: React.FC<SubLedgerTagChipProps> = ({ tag, className = '' }) => {
  const styling = SUB_LEDGER_TAG_COLORS[tag] || SUB_LEDGER_TAG_COLORS.Undefined;

  const renderIcon = () => {
    switch (tag) {
      case 'Customer':
        return <User className="size-2.5 mr-1" />;
      case 'Vendor':
        return <Building2 className="size-2.5 mr-1" />;
      case 'Reference':
        return <Hash className="size-2.5 mr-1" />;
      case 'Vehicle':
        return <Truck className="size-2.5 mr-1" />;
      default:
        return <HelpCircle className="size-2.5 mr-1" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ring-1 ring-inset ${styling.bg} ${styling.text} ${styling.ring} ${className}`}
    >
      {renderIcon()}
      <span>({tag})</span>
    </span>
  );
};

