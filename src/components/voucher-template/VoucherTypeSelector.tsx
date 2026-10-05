import React from 'react';
import { VoucherType } from '../../types/voucherTemplate';
import { BookOpen, ArrowUpRight, ArrowDownRight, Repeat, ChevronLeft, ChevronRight } from 'lucide-react';

interface VoucherTypeSelectorProps {
  activeType: VoucherType;
  onSelectType: (type: VoucherType) => void;
  dirtyTypes?: VoucherType[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface TypeItem {
  type: VoucherType;
  label: string;
  variant?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VOUCHER_ITEMS: TypeItem[] = [
  {
    type: 'Journal',
    label: 'Journal',
    variant: 'General',
    icon: BookOpen,
  },
  {
    type: 'Payment',
    label: 'Payment',
    variant: 'Standard',
    icon: ArrowUpRight,
  },
  {
    type: 'Receive',
    label: 'Receive',
    variant: 'Standard',
    icon: ArrowDownRight,
  },
  {
    type: 'Contra',
    label: 'Contra',
    variant: 'Cash/Bank',
    icon: Repeat,
  },
];

export const VoucherTypeSelector: React.FC<VoucherTypeSelectorProps> = ({
  activeType,
  onSelectType,
  dirtyTypes = [],
  collapsed = false,
  onToggleCollapse,
}) => {
  return (
    <div className={`w-full h-full bg-card border-r border-border/80 flex flex-col transition-all duration-200 ${collapsed ? 'p-1.5' : 'p-2.5 space-y-1'}`}>
      {/* Header with collapse toggle */}
      <div className={`flex items-center ${collapsed ? 'justify-center py-2' : 'justify-between px-2 py-1.5'} border-b border-border/40 mb-1`}>
        {!collapsed && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Voucher Types
          </span>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand Voucher Types (sidebar)' : 'Collapse Voucher Types'}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Item List */}
      <div className="flex-1 space-y-1">
        {VOUCHER_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeType === item.type;
          const isDirty = dirtyTypes.includes(item.type);

          if (collapsed) {
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onSelectType(item.type)}
                title={`${item.label}${item.variant ? ` (${item.variant})` : ''}${isDirty ? ' - Unsaved changes' : ''}`}
                className={`w-full p-2.5 rounded-lg transition-all flex items-center justify-center group cursor-pointer relative ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold border-l-2 border-l-indigo-600 rounded-l-none'
                    : 'text-slate-600 dark:text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Icon
                  className={`size-4 transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                {isDirty && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          }

          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelectType(item.type)}
              className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between group cursor-pointer relative ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold border-l-[3px] border-l-indigo-600 rounded-l-none'
                  : 'text-slate-600 dark:text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                <div className="truncate">
                  <span className="text-xs block leading-tight">
                    {item.label}
                  </span>
                  {item.variant && (
                    <span className="text-[10.5px] font-normal text-muted-foreground/80 block mt-0.5">
                      {item.variant}
                    </span>
                  )}
                </div>
              </div>

              {/* Dirty indicator */}
              {isDirty && (
                <div
                  className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0"
                  title="Unsaved changes"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
