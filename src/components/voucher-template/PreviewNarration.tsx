import React from 'react';

interface PreviewNarrationProps {
  fontSize: number;
  textColor: string;
  themeColor?: string;
}

export const PreviewNarration: React.FC<PreviewNarrationProps> = ({
  fontSize = 9,
  textColor,
  themeColor,
}) => {
  const activeLabelColor = themeColor || textColor;

  return (
    <div
      className="flex items-baseline gap-2 pt-2 border-t border-slate-200 dark:border-border/60"
      style={{
        fontSize: `${fontSize}px`,
        color: textColor,
      }}
    >
      <span
        className="font-bold uppercase tracking-wider shrink-0"
        style={{ color: activeLabelColor }}
      >
        Narration:
      </span>
      <div className="flex-1 border-b border-dotted border-slate-400 dark:border-slate-500 pb-0.5 text-slate-600 dark:text-slate-300 italic">
        Being amount posted for office operations and replenishment as per requisition voucher.
      </div>
    </div>
  );
};
