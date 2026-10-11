import React from 'react';
import { FILTER_FIELDS } from '../../../types/advanceFilter';
import { SearchableSelect, SearchableSelectOption } from '../../shared/SearchableSelect';

interface FieldPickerProps {
  value: string;
  onChange: (fieldKey: string) => void;
  disabled?: boolean;
}

const FIELD_OPTIONS: SearchableSelectOption[] = FILTER_FIELDS.map((f) => ({
  value: f.key,
  label: f.label,
  subLabel: f.type.charAt(0).toUpperCase() + f.type.slice(1),
}));

export const FieldPicker: React.FC<FieldPickerProps> = ({ value, onChange, disabled }) => {
  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={FIELD_OPTIONS}
      placeholder="Select Field..."
      searchPlaceholder="Search fields..."
      disabled={disabled}
      allowClear={false}
      buttonClassName="h-8 text-xs font-medium text-slate-800 bg-white border-slate-200 hover:border-slate-300 shadow-none"
      popoverWidth="min-w-[240px]"
    />
  );
};
