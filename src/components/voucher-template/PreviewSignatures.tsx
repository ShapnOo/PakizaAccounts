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

  const signatures = [
    { label: 'Prepared By', sub: 'Accountant' },
    { label: 'Checked By', sub: 'Accounts Manager' },
    { label: 'Verified By', sub: 'Head of Internal Audit' },
    { label: 'Authorized Signatory', sub: 'Director / CFO' },
  ];

  return (
    <div
      className="grid grid-cols-4 gap-4 sm:gap-6 pt-12 pb-2"
      style={{
        fontSize: `${fontSize}px`,
        color: textColor,
      }}
    >
      {signatures.map((sig, idx) => (
        <div key={idx} className="flex flex-col items-center text-center">
          <div className="w-full border-t border-slate-900/70 dark:border-slate-300 pt-1.5 space-y-0.5">
            <div className="font-extrabold uppercase tracking-wider text-[10px]">
              {sig.label}
            </div>
            <div className="text-[8.5px] text-slate-500 dark:text-slate-400 font-normal">
              {sig.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
