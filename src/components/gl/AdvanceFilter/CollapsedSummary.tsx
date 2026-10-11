import React from 'react';
import { FilterCondition, FILTER_FIELDS, OPERATORS_BY_TYPE } from '../../../types/advanceFilter';

interface CollapsedSummaryProps {
  conditions: FilterCondition[];
  onExpand: () => void;
}

export const CollapsedSummary: React.FC<CollapsedSummaryProps> = ({ conditions, onExpand }) => {
  const parts = conditions
    .map((c) => {
      const field = FILTER_FIELDS.find((f) => f.key === c.fieldKey);
      const fieldLabel = field?.label || c.fieldKey;
      const op = OPERATORS_BY_TYPE[field?.type || 'text']?.find((o) => o.value === c.operator);
      const opLabel = op?.label || c.operator;

      let valStr = '';
      if (Array.isArray(c.value)) {
        valStr = `${c.value[0] ?? ''} to ${c.value[1] ?? ''}`;
      } else if (c.value !== null && c.value !== undefined) {
        valStr = String(c.value);
      }

      if (!c.fieldKey) return null;
      if (c.operator === 'isEmpty') return `${fieldLabel} is empty`;
      if (c.operator === 'isNotEmpty') return `${fieldLabel} is not empty`;
      return `${fieldLabel} ${opLabel.toLowerCase()} "${valStr || '...'}"`;
    })
    .filter(Boolean);

  if (parts.length === 0) {
    return (
      <div
        onClick={onExpand}
        className="px-3 py-2 text-xs italic text-slate-400 bg-white cursor-pointer hover:bg-slate-50/60 transition-colors"
      >
        No active filters. Click to configure.
      </div>
    );
  }

  const summaryText = `${parts.join(' · ')} (${parts.length} filter${parts.length > 1 ? 's' : ''})`;

  return (
    <div
      onClick={onExpand}
      title={summaryText}
      className="px-3 py-1.5 text-xs italic text-slate-500 bg-white cursor-pointer hover:bg-slate-50/60 truncate transition-colors border-t border-slate-100 flex items-center justify-between"
    >
      <span className="truncate">{summaryText}</span>
      <span className="text-[11px] text-indigo-600 font-medium ml-2 not-italic shrink-0 hover:underline">
        Expand
      </span>
    </div>
  );
};
