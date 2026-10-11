import React from 'react';
import { SearchableSelect, SearchableSelectOption } from '../../shared/SearchableSelect';

interface ValueEnumPickerProps {
  enumOptions?: string[];
  value: string | number | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export const ValueEnumPicker: React.FC<ValueEnumPickerProps> = ({
  enumOptions = [],
  value,
  onChange,
  disabled,
}) => {
  const options: SearchableSelectOption[] = enumOptions.map((opt) => ({
    value: opt,
    label: opt,
  }));

  return (
    <SearchableSelect
      value={value ? String(value) : ''}
      onChange={(v) => onChange(v || null)}
      options={options}
      placeholder="Select value..."
      searchPlaceholder="Search option..."
      disabled={disabled}
      buttonClassName="h-8 text-xs font-normal text-slate-800 bg-white border-slate-200 hover:border-slate-300 shadow-none"
      popoverWidth="min-w-[200px]"
    />
  );
};
