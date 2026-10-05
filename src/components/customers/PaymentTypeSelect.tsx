import React from 'react';
import { PaymentType, PAYMENT_TYPES } from '../../types/customer';

interface PaymentTypeSelectProps {
  value: PaymentType;
  onChange: (val: PaymentType) => void;
  error?: string;
}

export const PaymentTypeSelect: React.FC<PaymentTypeSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-bold text-foreground block">
        Payment Type <span className="text-rose-500">*</span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentType)}
        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
      >
        {PAYMENT_TYPES.map((pt) => (
          <option key={pt} value={pt}>
            {pt}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};
