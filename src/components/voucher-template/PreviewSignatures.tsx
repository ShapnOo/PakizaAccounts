import React from 'react';

interface PreviewSignaturesProps {
  visible: boolean;
  fontSize: number;
  textColor: string;
}

export const PreviewSignatures: React.FC<PreviewSignaturesProps> = ({
  visible,
  fontSize = 9,
  textColor,
}) => {
  if (!visible) return null;

  return (
    <div
      className="grid grid-cols-3 gap-6 pt-10 pb-2"
      style={{
        fontSize: `${fontSize}px`,
        color: textColor,
      }}
    >
      {/* 1. Prepared By */}
      <div className="flex flex-col items-center text-center">
        <div className="w-full border-t border-slate-900/60 dark:border-slate-300 pt-1">
          <span className="font-bold uppercase tracking-wider">
            Prepared By
          </span>
        </div>
      </div>

      {/* 2. Checked By */}
      <div className="flex flex-col items-center text-center">
        <div className="w-full border-t border-slate-900/60 dark:border-slate-300 pt-1">
          <span className="font-bold uppercase tracking-wider">
            Checked By
          </span>
        </div>
      </div>

      {/* 3. Approved By */}
      <div className="flex flex-col items-center text-center">
        <div className="w-full border-t border-slate-900/60 dark:border-slate-300 pt-1">
          <span className="font-bold uppercase tracking-wider">
            Approved By
          </span>
        </div>
      </div>
    </div>
  );
};
