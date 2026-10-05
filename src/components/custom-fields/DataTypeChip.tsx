import React from 'react';
import { CustomFieldDataType } from '../../types/customField';

interface DataTypeChipProps {
  dataType: CustomFieldDataType;
  className?: string;
  size?: 'sm' | 'md';
}

export const DataTypeChip: React.FC<DataTypeChipProps> = ({
  dataType,
  className = '',
  size = 'md',
}) => {
  const getStyles = (type: CustomFieldDataType) => {
    switch (type) {
      case 'Text':
      case 'LongText':
        return 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'Number':
        return 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
      case 'Currency':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Date':
      case 'DateTime':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'Dropdown':
      case 'MultiSelect':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
      case 'YesNo':
        return 'bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-1.5 py-0.5 text-[10px]'
      : 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded-md border tracking-tight transition-colors shadow-2xs ${sizeClasses} ${getStyles(
        dataType
      )} ${className}`}
    >
      {dataType}
    </span>
  );
};
