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
}

export const SignatureRow: React.FC<SignatureRowProps> = ({
  slots,
  fixedThree = false,
  styleVariant = 'cleanGrid',
  primaryColor = '#0f172a',
}) => {
  if (fixedThree) {
    // Standard template: exactly 3 fixed labels with line above
    const fixedLabels = ['Prepared By', 'Checked By', 'Approved By'];
    return (
      <div className="mt-8 pt-4 grid grid-cols-3 gap-6 font-sans">
        {fixedLabels.map((lbl) => (
          <div key={lbl} className="flex flex-col items-center text-center">
            <div className="w-36 border-t border-slate-800 mb-1" />
            <span className="text-[10px] font-medium text-slate-800">
              {lbl}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 4 columns dynamic signatures (Name above line, line, label below)
  return (
    <div className="mt-8 pt-4 grid grid-cols-4 gap-4 font-sans">
      {slots.map((slot, idx) => {
        const hasContent = Boolean(slot.label || slot.name);
        return (
          <div key={idx} className="flex flex-col items-center text-center min-h-[48px]">
            {hasContent ? (
              <div className="w-full flex flex-col items-center">
                <span
                  className="text-[9.5px] font-medium text-slate-800 mb-1 h-[14px]"
                  style={{ color: primaryColor }}
                >
                  {slot.name || ''}
                </span>
                <div
                  className={`w-36 max-w-full mb-1 ${
                    styleVariant === 'framedLedger'
                      ? 'border-t-2 border-slate-700'
                      : 'border-t border-slate-700'
                  }`}
                />
                <span className="text-[9.5px] text-slate-700 h-[14px]">
                  {slot.label || ''}
                </span>
              </div>
            ) : (
              <div className="h-10" />
            )}
          </div>
        );
      })}
    </div>
  );
};
