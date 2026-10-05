import React from 'react';
import { Globe } from 'lucide-react';

interface SwiftBicInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const SwiftBicInput: React.FC<SwiftBicInputProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <Globe className="size-3 text-indigo-600" />
          <span>SWIFT / BIC Code</span>
        </label>
        <span className="text-[10px] text-muted-foreground font-mono">
          (Optional)
        </span>
      </div>

      <input
        type="text"
        maxLength={11}
        placeholder="e.g. DBBLBDDH"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
        }
        className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold uppercase tracking-wider text-foreground outline-none shadow-2xs ${
          error
            ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
            : 'border-border focus:ring-1 focus:ring-indigo-500'
        }`}
      />

      <p className="text-[10.5px] text-muted-foreground">
        8 or 11 characters ISO 9362 identifier (e.g. DBBLBDDH)
      </p>

      {error && (
        <p className="text-[10.5px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};
