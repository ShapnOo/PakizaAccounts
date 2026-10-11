import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvanceFilterStore } from '../../../stores/advanceFilterStore';
import { DEFAULT_ADVANCE_FILTER } from '../../../mock/advanceFilter';
import { AdvanceFilterHeader } from './AdvanceFilterHeader';
import { AdvanceFilterColumnHeaders } from './AdvanceFilterColumnHeaders';
import { ConditionRow } from './ConditionRow';
import { AddConditionButton } from './AddConditionButton';
import { CombinatorToggle } from './CombinatorToggle';
import { CollapsedSummary } from './CollapsedSummary';

interface AdvanceFilterProps {
  className?: string;
}

export const AdvanceFilter: React.FC<AdvanceFilterProps> = ({ className = '' }) => {
  const {
    state,
    setCombinator,
    toggleCollapsed,
    setCollapsed,
    addCondition,
    removeCondition,
    updateCondition,
    reset,
  } = useAdvanceFilterStore();

  const isDefaultState =
    state.combinator === DEFAULT_ADVANCE_FILTER.combinator &&
    state.conditions.length === DEFAULT_ADVANCE_FILTER.conditions.length &&
    state.conditions.every((c, i) => {
      const def = DEFAULT_ADVANCE_FILTER.conditions[i];
      return (
        def &&
        c.fieldKey === def.fieldKey &&
        c.operator === def.operator &&
        c.value === def.value
      );
    });

  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden ${className}`}>
      {/* 1. Header Row */}
      <AdvanceFilterHeader
        collapsed={state.collapsed}
        onToggleCollapse={toggleCollapsed}
        conditionCount={state.conditions.length}
        onReset={reset}
        isDefaultState={isDefaultState}
      />

      {/* 2. Collapsed State Summary */}
      {state.collapsed && (
        <CollapsedSummary
          conditions={state.conditions}
          onExpand={() => setCollapsed(false)}
        />
      )}

      {/* 3. Expanded Panel Body */}
      <AnimatePresence initial={false}>
        {!state.collapsed && (
          <motion.div
            key="advance-filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-3.5 space-y-3 bg-white">
              {/* Column Headers (Filter By | Formula | Value | Action) */}
              <AdvanceFilterColumnHeaders />

              {/* Condition Rows */}
              <div className="space-y-1">
                {state.conditions.map((condition) => (
                  <ConditionRow
                    key={condition.id}
                    condition={condition}
                    onUpdate={(patch) => updateCondition(condition.id, patch)}
                    onRemove={() => removeCondition(condition.id)}
                    disableRemove={state.conditions.length <= 1}
                  />
                ))}
              </div>

              {/* Add Condition Button */}
              <div>
                <AddConditionButton
                  onAdd={addCondition}
                  disabled={state.conditions.length >= 10}
                />
              </div>

              {/* Combinator Toggle & Footer info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 gap-2">
                <CombinatorToggle
                  combinator={state.combinator}
                  onChange={setCombinator}
                />
                <span className="text-[11px] text-slate-400">
                  {state.conditions.length} condition{state.conditions.length > 1 ? 's' : ''} combined via{' '}
                  <strong className="text-slate-600 font-semibold">{state.combinator}</strong> logic
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
