import React from 'react';
import { Hash, ShieldCheck } from 'lucide-react';

interface BinTinPairProps {
  bin: string;
  tin: string;
  onChangeBin: (val: string) => void;
  onChangeTin: (val: string) => void;
  binError?: string;
  tinError?: string;
}

export const BinTinPair: React.FC<BinTinPairProps> = ({
  bin,
  tin,
  onChangeBin,
  onChangeTin,
  binError,
  tinError,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* BIN */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Hash className="size-3 text-indigo-600" />
            <span>BIN</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-normal italic">
            Business ID Number
          </span>
        </label>
        <input
          type="text"
          placeholder="e.g. 1092837465"
          value={bin}
          onChange={(e) => onChangeBin(e.target.value)}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-medium text-foreground outline-none shadow-2xs ${
            binError
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        />
        {binError && (
          <p className="text-[10.5px] text-rose-500 font-medium">{binError}</p>
        )}
      </div>

      {/* TIN */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3 text-indigo-600" />
            <span>TIN</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-normal italic">
            Tax ID Number
          </span>
        </label>
        <input
          type="text"
          placeholder="e.g. TIN-992810"
          value={tin}
          onChange={(e) => onChangeTin(e.target.value.toUpperCase())}
          className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-medium text-foreground outline-none shadow-2xs uppercase ${
            tinError
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
              : 'border-border focus:ring-1 focus:ring-indigo-500'
          }`}
        />
        {tinError && (
          <p className="text-[10.5px] text-rose-500 font-medium">{tinError}</p>
        )}
      </div>
    </div>
  );
};
