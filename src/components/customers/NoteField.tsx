import React from 'react';
import { FileText } from 'lucide-react';

interface NoteFieldProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const NoteField: React.FC<NoteFieldProps> = ({
  value,
  onChange,
  error,
}) => {
  const currentLength = value.length;
  const maxLength = 500;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <FileText className="size-3 text-indigo-600" />
          <span>Note</span>
        </label>
        <span
          className={`text-[10px] font-mono ${
            currentLength > maxLength ? 'text-rose-500 font-bold' : 'text-muted-foreground'
          }`}
        >
          {currentLength} / {maxLength}
        </span>
      </div>

      <textarea
        rows={3}
        maxLength={maxLength}
        placeholder="Add any specific credit, delivery, or commercial terms..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 resize-none shadow-2xs placeholder:text-muted-foreground/60"
      />

      {error && (
        <p className="text-[10.5px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};
