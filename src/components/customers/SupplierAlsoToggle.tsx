import React from 'react';
import { Truck, Info } from 'lucide-react';

interface SupplierAlsoToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SupplierAlsoToggle: React.FC<SupplierAlsoToggleProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div
      className={`w-full p-3 rounded-xl border transition-all duration-200 ${
        checked
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
          : 'bg-card border-border/80'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg transition-colors ${
              checked
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Truck className="size-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">
              Make this Supplier also
            </span>
            <span className="text-[11px] text-muted-foreground block">
              Bridges this party into Supplier Master with linked accounts
            </span>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            checked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {checked && (
        <div className="mt-2.5 pt-2 border-t border-emerald-200/80 dark:border-emerald-900/60 flex items-center gap-2 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-150">
          <Info className="size-3.5 shrink-0" />
          <span>
            A linked Supplier record will automatically be created and maintained with the same name and code.
          </span>
        </div>
      )}
    </div>
  );
};
