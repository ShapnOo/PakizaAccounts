import React from 'react';
import { FilterOperator, FILTER_FIELDS, OPERATORS_BY_TYPE } from '../../../types/advanceFilter';
import { SearchableSelect, SearchableSelectOption } from '../../shared/SearchableSelect';

interface FormulaPickerProps {
  fieldKey: string;
  value: FilterOperator;
  onChange: (op: FilterOperator) => void;
  disabled?: boolean;
}

export const FormulaPicker: React.FC<FormulaPickerProps> = ({
  fieldKey,
  value,
  onChange,
  disabled,
}) => {
  const field = FILTER_FIELDS.find((f) => f.key === fieldKey);
  const fieldType = field?.type || 'text';
  const operators = OPERATORS_BY_TYPE[fieldType] || [];

  const options: SearchableSelectOption[] = operators.map((op) => ({
    value: op.value,
    label: op.label,
  }));

  return (
    <SearchableSelect
      value={value}
      onChange={(val) => onChange(val as FilterOperator)}
      options={options}
      placeholder="Select Formula..."
      searchPlaceholder="Search operator..."
      disabled={disabled || !fieldKey}
      allowClear={false}
      buttonClassName="h-8 text-xs font-medium text-slate-800 bg-white border-slate-200 hover:border-slate-300 shadow-none"
      popoverWidth="min-w-[200px]"
    />
  );
};
