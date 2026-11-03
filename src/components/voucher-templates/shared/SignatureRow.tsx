import React from 'react';

interface SignatureSlot {
  label: string;
  name: string;
}

interface SignatureRowProps {
  slots: SignatureSlot[];
  fixedThree?: boolean;
  styleVariant?: 'standard' | 'minimal' | 'cleanGrid' | 'framedLedger';
  primaryColor?: string;
  compact?: boolean;
}

export const SignatureRow: React.FC<SignatureRowProps> = ({
  slots,
  fixedThree = false,
  styleVariant = 'cleanGrid',
  primaryColor = '#0f172a',
  compact = false,
}) => {
  if (fixedThree) {
    // Standard template: exactly 3 fixed labels with line above
    const fixedLabels = ['Prepared By', 'Checked By', 'Approved By'];
    return (
      <div className={`${compact ? 'mt-1 pt-0.5 gap-2' : 'mt-6 pt-3 gap-6'} grid grid-cols-3 font-sans`}>
        {fixedLabels.map((lbl) => (
          <div key={lbl} className="flex flex-col items-center text-center">
            <div className={`${compact ? 'w-20 sm:w-24 mb-0.5' : 'w-28 sm:w-36 mb-1'} border-t border-slate-800`} />
            <span className={`${compact ? 'text-[8px]' : 'text-[9px] sm:text-[10px]'} font-medium text-slate-800`}>
              {lbl}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 4 columns dynamic signatures (Name above line, line, label below)
  return (
    <div className={`${compact ? 'mt-1 pt-0.5 gap-1.5' : 'mt-6 pt-3 gap-4'} grid grid-cols-4 font-sans`}>
      {slots.map((slot, idx) => {
        const hasContent = Boolean(slot.label || slot.name);
        return (
          <div key={idx} className={`flex flex-col items-center text-center ${compact ? 'min-h-[26px]' : 'min-h-[44px]'}`}>
            {hasContent ? (
              <div className="w-full flex flex-col items-center">
                <span
                  className={`${compact ? 'text-[8px] h-[11px]' : 'text-[9px] sm:text-[9.5px] h-[13px] mb-0.5'} font-medium text-slate-800 truncate max-w-full`}
                  style={{ color: primaryColor }}
                >
                  {slot.name || ''}
                </span>
                <div
                  className={`${compact ? 'w-20 sm:w-24 mb-0.5' : 'w-28 sm:w-36 mb-0.5'} max-w-full ${
                    styleVariant === 'framedLedger'
                      ? 'border-t-2 border-slate-700'
                      : 'border-t border-slate-700'
                  }`}
                />
                <span className={`${compact ? 'text-[7.5px] h-[11px]' : 'text-[8.5px] sm:text-[9px] h-[13px]'} text-slate-700 truncate max-w-full`}>
                  {slot.label || ''}
                </span>
              </div>
            ) : (
              <div className={compact ? 'h-4' : 'h-8'} />
            )}
          </div>
        );
      })}
    </div>
  );
};
