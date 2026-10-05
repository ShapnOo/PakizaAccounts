import React from 'react';
import { CustomFieldContext, CONTEXT_CONFIG } from '../../types/customField';
import { CustomField } from '../../types/customField';

interface ContextTabsProps {
  activeContext: CustomFieldContext;
  onSelect: (context: CustomFieldContext) => void;
  fields: CustomField[];
}

const CONTEXT_KEYS: CustomFieldContext[] = [
  'journal',
  'payment',
  'receive',
  'contra',
  'opening-balance',
  'coa',
];

export const ContextTabs: React.FC<ContextTabsProps> = ({
  activeContext,
  onSelect,
  fields,
}) => {
  return (
    <div className="w-full border-b border-border/80 bg-card rounded-t-xl px-2 pt-2 shadow-2xs overflow-x-auto sidebar-scroll">
      <div className="flex items-center gap-1.5 min-w-max">
        {CONTEXT_KEYS.map((key) => {
          const config = CONTEXT_CONFIG[key];
          const Icon = config.icon;
          const isActive = activeContext === key;

          // Count active fields in this context
          const activeCount = fields.filter(
            (f) => f.context === key && f.activeStatus === 'Active'
          ).length;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-bold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 dark:text-indigo-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              <Icon
                className={`size-3.5 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              <span>{config.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10.5px] font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/15'
                }`}
              >
                {activeCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
