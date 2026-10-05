import React from 'react';
import { CustomerType, CUSTOMER_TYPES_WITH_HINTS } from '../../types/customer';

interface CustomerTypeSelectProps {
  value: CustomerType;
  onChange: (val: CustomerType) => void;
  error?: string;
}

export const CustomerTypeSelect: React.FC<CustomerTypeSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const currentHint = CUSTOMER_TYPES_WITH_HINTS.find((c) => c.value === value)?.hint;

  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-bold text-foreground block">
        Customer Type <span className="text-rose-500">*</span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CustomerType)}
        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
      >
        {CUSTOMER_TYPES_WITH_HINTS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.value} — {item.hint}
          </option>
        ))}
      </select>

      {currentHint && (
        <p className="text-[10.5px] text-muted-foreground italic pl-0.5">
          {currentHint}
        </p>
      )}

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};
