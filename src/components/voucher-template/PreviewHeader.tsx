import React from 'react';
import { Align, VoucherType } from '../../types/voucherTemplate';

interface PreviewHeaderProps {
  company: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    website: string;
  };
  voucherType: VoucherType;
  variant?: string;
  companyNameSize: number;
  addressSize: number;
  align: Align;
  showLogo?: boolean;
  logoUrl?: string;
  logoWidth?: number;
  logoPosition?: 'left' | 'center' | 'right';
  baseFontSize: number;
  textColor: string;
  themeColor?: string;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  company,
  voucherType,
  variant,
  companyNameSize,
  addressSize,
  align,
  showLogo = true,
  logoUrl,
  logoWidth = 70,
  logoPosition = 'left',
  baseFontSize,
  textColor,
  themeColor,
}) => {
  const activeThemeColor = themeColor || textColor;

  const getAlignmentClass = (a: Align) => {
    switch (a) {
      case 'Left':
        return 'text-left items-start';
      case 'Right':
        return 'text-right items-end';
      case 'Center':
      default:
        return 'text-center items-center';
    }
  };

  const alignClass = getAlignmentClass(align);

  const renderCompanyText = () => (
    <div className={`flex flex-col ${alignClass} leading-tight`}>
      <h1
        className="font-black tracking-tight"
        style={{
          fontSize: `${companyNameSize}px`,
          color: textColor,
        }}
      >
        {company.name}
      </h1>
      <p
        className="font-medium text-slate-600 dark:text-slate-300 mt-1"
        style={{
          fontSize: `${addressSize}px`,
        }}
      >
        {company.addressLine1}
      </p>
      <p
        className="font-normal text-slate-500 dark:text-slate-400"
        style={{
          fontSize: `${addressSize}px`,
        }}
      >
        {company.addressLine2}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* ── 1. Company Logo & Company Details ── */}
      {showLogo && logoUrl ? (
        logoPosition === 'center' ? (
          <div className="flex flex-col items-center">
            <img
              src={logoUrl}
              alt="Company Logo"
              style={{ width: `${logoWidth}px` }}
              className="max-h-20 object-contain mb-2"
            />
            {renderCompanyText()}
          </div>
        ) : (
          <div
            className={`flex items-center gap-4 ${
              logoPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <img
              src={logoUrl}
              alt="Company Logo"
              style={{ width: `${logoWidth}px` }}
              className="max-h-20 object-contain shrink-0"
            />
            <div className="flex-1 min-w-0">
              {renderCompanyText()}
            </div>
            {/* Balance container to maintain perfect center alignment when align === 'Center' */}
            {align === 'Center' && (
              <div
                style={{ width: `${logoWidth}px` }}
                className="hidden sm:block shrink-0 invisible pointer-events-none"
              />
            )}
          </div>
        )
      ) : (
        renderCompanyText()
      )}

      {/* ── 2. Document Title & Voucher Meta ── */}
      <div
        className="flex items-end justify-between border-b-2 pb-2 pt-1"
        style={{ borderColor: activeThemeColor }}
      >
        <div>
          <h2
            className="font-extrabold uppercase tracking-wide flex items-center gap-2"
            style={{
              fontSize: `${baseFontSize + 7}px`,
              color: activeThemeColor,
            }}
          >
            <span>{voucherType} Voucher</span>
            {variant && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-sans tracking-normal">
                {variant}
              </span>
            )}
          </h2>
        </div>

        <div className="text-right space-y-0.5 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
          <div>
            <span style={{ color: activeThemeColor }} className="font-semibold">Voucher No: </span>
            <span className="font-bold underline decoration-dotted underline-offset-4">
              {voucherType.slice(0, 2).toUpperCase()}-2026-0042
            </span>
          </div>
          <div>
            <span style={{ color: activeThemeColor }} className="font-semibold">Voucher Date: </span>
            <span className="font-semibold underline decoration-dotted underline-offset-4">
              2026-10-01
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
