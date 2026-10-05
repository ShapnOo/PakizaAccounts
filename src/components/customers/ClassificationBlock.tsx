import React from 'react';
import { CustomerGroup, CustomerType, PaymentType } from '../../types/customer';
import { GroupPicker } from './GroupPicker';
import { CustomerTypeSelect } from './CustomerTypeSelect';
import { PaymentTypeSelect } from './PaymentTypeSelect';
import { AdvanceReceiveAccountPicker } from './AdvanceReceiveAccountPicker';
import { Layers } from 'lucide-react';

interface ClassificationBlockProps {
  groups: CustomerGroup[];
  groupId: string;
  customerType: CustomerType;
  paymentType: PaymentType;
  advanceReceiveAccountId: string | null;
  activeStatus: 'Active' | 'Inactive';
  errors: Record<string, string | undefined>;
  onChangeField: (field: string, value: any) => void;
  onAddGroup: (name: string) => Promise<CustomerGroup>;
}

export const ClassificationBlock: React.FC<ClassificationBlockProps> = ({
  groups,
  groupId,
  customerType,
  paymentType,
  advanceReceiveAccountId,
  activeStatus,
  errors,
  onChangeField,
  onAddGroup,
}) => {
  return (
    <div className="space-y-4">
      {/* 12. Group Name + Add++ */}
      <GroupPicker
        groups={groups}
        selectedId={groupId}
        onChange={(val) => onChangeField('groupId', val)}
        onAddGroup={onAddGroup}
        error={errors.groupId}
      />

      {/* 13. Customer Type */}
      <CustomerTypeSelect
        value={customerType}
        onChange={(val) => onChangeField('customerType', val)}
        error={errors.customerType}
      />

      {/* 14. Payment Type */}
      <PaymentTypeSelect
        value={paymentType}
        onChange={(val) => onChangeField('paymentType', val)}
        error={errors.paymentType}
      />

      {/* 15. Advance Receive Accounts (COA) */}
      <AdvanceReceiveAccountPicker
        value={advanceReceiveAccountId}
        onChange={(val) => onChangeField('advanceReceiveAccountId', val)}
        error={errors.advanceReceiveAccountId}
      />

      {/* Status Setting Block */}
      <div className="pt-2 border-t border-border/60 space-y-2">
        <label className="text-[12px] font-bold text-foreground block">
          Customer Status
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeField('activeStatus', 'Active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              activeStatus === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-2xs'
                : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => onChangeField('activeStatus', 'Inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              activeStatus === 'Inactive'
                ? 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 shadow-2xs'
                : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>
    </div>
  );
};
