import React from 'react';
import { Trash2 } from 'lucide-react';
import { FilterCondition } from '../../../types/advanceFilter';
import { FieldPicker } from './FieldPicker';
import { FormulaPicker } from './FormulaPicker';
import { ValueControl } from './ValueControl';

interface ConditionRowProps {
  condition: FilterCondition;
  onUpdate: (patch: Partial<FilterCondition>) => void;
  onRemove: () => void;
  disableRemove: boolean;
}

export const ConditionRow: React.FC<ConditionRowProps> = ({
  condition,
  onUpdate,
  onRemove,
  disableRemove,
}) => {
  return (
    <div className="group grid grid-cols-1 md:grid-cols-12 gap-2 py-1.5 items-center border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 rounded-md px-1 transition-colors">
      {/* 1. Filter By */}
      <div className="md:col-span-4">
        <FieldPicker
          value={condition.fieldKey}
          onChange={(fieldKey) => onUpdate({ fieldKey })}
        />
      </div>

      {/* 2. Formula */}
      <div className="md:col-span-3">
        <FormulaPicker
          fieldKey={condition.fieldKey}
          value={condition.operator}
          onChange={(operator) => onUpdate({ operator })}
        />
      </div>

      {/* 3. Value */}
      <div className="md:col-span-4">
        <ValueControl
          fieldKey={condition.fieldKey}
          operator={condition.operator}
          value={condition.value}
          onChange={(value) => onUpdate({ value })}
        />
      </div>

      {/* 4. Remove Button */}
      <div className="md:col-span-1 flex justify-center items-center">
        <button
          type="button"
          onClick={onRemove}
          disabled={disableRemove}
          title={disableRemove ? 'At least one condition required' : 'Remove condition'}
          className={`p-1.5 rounded-md text-slate-400 transition-all ${
            disableRemove
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:text-rose-600 hover:bg-rose-50 cursor-pointer opacity-70 group-hover:opacity-100'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
