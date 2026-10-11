import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UseBoundStore, StoreApi } from 'zustand';
import { useAdvanceFilterStore, AdvanceFilterStore } from '../../../stores/advanceFilterStore';
import { AdvanceFilterHeader } from './AdvanceFilterHeader';
import { AdvanceFilterColumnHeaders } from './AdvanceFilterColumnHeaders';
import { ConditionRow } from './ConditionRow';
import { AddConditionButton } from './AddConditionButton';
import { CombinatorToggle } from './CombinatorToggle';
import { CollapsedSummary } from './CollapsedSummary';

interface AdvanceFilterProps {
  className?: string;
  useStore?: UseBoundStore<StoreApi<AdvanceFilterStore>>;
}

export const AdvanceFilter: React.FC<AdvanceFilterProps> = ({
  className = '',
  useStore,
}) => {
  const storeHook = useStore || useAdvanceFilterStore;
  const {
    state,
    setCombinator,
    toggleCollapsed,
    setCollapsed,
    addCondition,
    removeCondition,
    updateCondition,
    reset,
  } = storeHook();

  const isDefaultState = state.conditions.length === 0;

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
              {state.conditions.length > 0 && <AdvanceFilterColumnHeaders />}

              {/* Condition Rows or Empty State */}
              {state.conditions.length === 0 ? (
                <div className="py-5 px-4 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                  <p className="text-xs font-semibold text-slate-700">No Filter Conditions Active</p>
                  <p className="text-[11px] text-slate-400">All records and transactions are currently shown without filters.</p>
                  <button
                    type="button"
                    onClick={addCondition}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    + Add Filter Condition
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {state.conditions.map((condition) => (
                    <ConditionRow
                      key={condition.id}
                      condition={condition}
                      onUpdate={(patch) => updateCondition(condition.id, patch)}
                      onRemove={() => removeCondition(condition.id)}
                      disableRemove={false}
                    />
                  ))}
                </div>
              )}

              {/* Add Condition Button */}
              {state.conditions.length > 0 && (
                <div>
                  <AddConditionButton
                    onAdd={addCondition}
                    disabled={state.conditions.length >= 10}
                  />
                </div>
              )}

              {/* Combinator Toggle & Footer info */}
              {state.conditions.length > 0 && (
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

