import React from 'react';
import { AccountsType, ACCOUNTS_TYPES } from '../../types/receiptPayment';
import { Wallet, ChevronDown } from 'lucide-react';

interface AccountsTypeSelectProps {
  value: AccountsType;
  onChange: (val: AccountsType) => void;
  disabled?: boolean;
}

export const AccountsTypeSelect: React.FC<AccountsTypeSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <Wallet className="size-2.5 text-indigo-500" />
        Accounts Type
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as AccountsType)}
          className="w-full h-7.5 pl-2.5 pr-7 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
        >
          {ACCOUNTS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
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

