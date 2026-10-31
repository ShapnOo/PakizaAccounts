import React from 'react';
import { ApprovalStatus, APPROVAL_STATUSES } from '../../types/receiptPayment';
import { CheckCircle2, ChevronDown } from 'lucide-react';

interface ApprovalStatusSelectProps {
  value: ApprovalStatus;
  onChange: (val: ApprovalStatus) => void;
  disabled?: boolean;
}

export const ApprovalStatusSelect: React.FC<ApprovalStatusSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <CheckCircle2 className="size-2.5 text-indigo-500" />
        Approval
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as ApprovalStatus)}
          className="w-full h-7.5 pl-2.5 pr-7 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
        >
          {APPROVAL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <ChevronDown className="size-3" />
        </div>
      </div>
    </div>
  );
};

