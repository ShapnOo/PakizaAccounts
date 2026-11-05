import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ResetToDefaultButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

export const ResetToDefaultButton: React.FC<ResetToDefaultButtonProps> = ({
  onReset,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-600 text-[13px] font-medium shadow-2xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      title="Restore factory default rows and formulas"
    >
      <RotateCcw className="size-3.5" />
      <span>Reset to Default</span>
    </button>
  );
};

