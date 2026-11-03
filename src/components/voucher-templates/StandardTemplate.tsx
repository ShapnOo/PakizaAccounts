import React from 'react';
import type {
  VoucherPreviewData,
  TemplateCustomization,
} from '../../types/voucherTemplate';
import { formatCurrency } from '../../lib/format';
import companyLogoImg from '../../assets/company_logo.png';

interface StandardTemplateProps {
  data: VoucherPreviewData;
  custom: TemplateCustomization;
}

export const StandardTemplate: React.FC<StandardTemplateProps> = ({
  data,
  custom,
}) => {
  const {
    showCompanyHeader = true,
    showNarration = true,
    showValueInWords = true,
    showSignatures = true,
    showFooter = true,
    showDifferenceRow = true,
    primaryColor = '#0f172a',
    accentColor = '#1e40af',
    companyLogo = custom.companyLogo || companyLogoImg || '/company_logo.png',
  } = custom;

  const isLandscape = custom.orientation === 'Landscape';
  const isHalfPage = custom.pageCoverage === 'half';

  const isVisible = (colId: string) => {
    if (!custom.visibleColumns) return true;
    return custom.visibleColumns[colId] !== undefined ? custom.visibleColumns[colId] : true;
  };

  const leadingCols = [
    'accountsHead',
    'costCenter',
    'subsidiary',
    'vehicle',
    'reference',
    'lineDescription',
    'currency',
    'exchangeRate',
    'debit',
    'credit',
  ];
  const leadingColSpan = leadingCols.filter(isVisible).length || 1;

  const showDebitBDT = isVisible('debitBDT');
  const showCreditBDT = isVisible('creditBDT');

  return (
    <div
      className={`template-outer-frame w-full h-full border ${
        isHalfPage ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'
      } flex flex-col justify-between bg-white box-border`}
      style={{
        color: primaryColor,
        fontSize: `${custom.fontSize}pt`,
      }}
    >
      <div>
        {/* 1. Header: Left Logo & Center Company Info */}
        {showCompanyHeader && (
          <div className={`relative ${isHalfPage ? 'mb-1 pb-0.5' : 'mb-2 pb-1'}`}>
            <div className="absolute left-0 top-0">
              <img
                src={companyLogo}
                alt="Pakiza Software Logo"
                className={`${isHalfPage ? 'h-6' : isLandscape ? 'h-8' : 'h-10'} max-w-[120px] object-contain`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="text-center pt-0.5">
              <h1 className={`${isHalfPage ? 'text-[13px] sm:text-[14px]' : 'text-[16px] sm:text-[17px]'} font-bold text-black tracking-normal leading-tight`}>
                {data.company.name}
              </h1>
              <p className={`${isHalfPage ? 'text-[9px]' : 'text-[10px] sm:text-[11px]'} text-slate-700 leading-tight`}>
                {data.company.addressLine1}
              </p>
              <p className={`${isHalfPage ? 'text-[9px]' : 'text-[10px] sm:text-[11px]'} text-slate-700 leading-tight`}>
                {data.company.addressLine2 || 'Dhaka Banagladesh'}
              </p>
              <h2
                className={`${isHalfPage ? 'text-[12px]' : 'text-[14px] sm:text-[15px]'} font-bold mt-0.5 leading-tight`}
                style={{ color: accentColor }}
              >
                {data.voucherType} Voucher
              </h2>
              <p className="text-[8.5px] sm:text-[9.5px] font-semibold text-[#4d7c0f] mt-0.5">
                Source: {data.source}
              </p>
            </div>
          </div>
        )}

        {/* 2. Metadata */}
        <div className="text-[9.5px] sm:text-[10px] text-black font-medium mb-2 flex items-center justify-between">
          <div>
            <span className="font-bold">Voucher No: </span>
            <span>{data.voucherNo}</span>
          </div>
          <div>
            <span className="font-bold">Voucher Date: </span>
            <span>{data.voucherDate}</span>
          </div>
        </div>

        {/* 3. Table (Single-Row with Gray Header & Full Grid Borders) */}
        <div className="overflow-x-auto mb-2">
          <table className="w-full text-[8.5px] sm:text-[9px] border-collapse border border-black">
            <thead>
              <tr className="bg-slate-300 text-black font-bold">
                {isVisible('accountsHead') && (
                  <th className="py-1 px-1 border border-black text-left">Accounts Head</th>
                )}
                {isVisible('costCenter') && (
                  <th className="py-1 px-1 border border-black text-left">Cost Center</th>
                )}
                {isVisible('subsidiary') && (
                  <th className="py-1 px-1 border border-black text-left">Subsidiary</th>
                )}
                {isVisible('vehicle') && (
                  <th className="py-1 px-1 border border-black text-left">Vehicles</th>
                )}
                {isVisible('reference') && (
                  <th className="py-1 px-1 border border-black text-left">Reference</th>
                )}
                {isVisible('lineDescription') && (
                  <th className="py-1 px-1 border border-black text-left">Line Description</th>
                )}
                {isVisible('currency') && (
                  <th className="py-1 px-1 border border-black text-center">Currency</th>
                )}
                {isVisible('exchangeRate') && (
                  <th className="py-1 px-1 border border-black text-right">Exc. Rate</th>
                )}
                {isVisible('debit') && (
                  <th className="py-1 px-1 border border-black text-right">Debit</th>
                )}
                {isVisible('credit') && (
                  <th className="py-1 px-1 border border-black text-right">Credit</th>
                )}
                {showDebitBDT && (
                  <th className="py-1 px-1 border border-black text-right">Debit (BDT)</th>
                )}
                {showCreditBDT && (
                  <th className="py-1 px-1 border border-black text-right">Credit (BDT)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.lines.map((l) => {
                const subsidiaryWithEmployee = [l.subsidiary, l.employee]
                  .filter(Boolean)
                  .join('  ');

                return (
                  <tr key={l.id} className="border-b border-black">
                    {isVisible('accountsHead') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black font-medium">
                        {l.accountsHead || ''}
                      </td>
                    )}
                    {isVisible('costCenter') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black">
                        {l.costCenter || ''}
                      </td>
                    )}
                    {isVisible('subsidiary') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black">
                        {subsidiaryWithEmployee || ''}
                      </td>
                    )}
                    {isVisible('vehicle') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black">
                        {l.vehicle || ''}
                      </td>
                    )}
                    {isVisible('reference') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black">
                        {l.reference || ''}
                      </td>
                    )}
                    {isVisible('lineDescription') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black">
                        {l.lineDescription || ''}
                      </td>
                    )}
                    {isVisible('currency') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black text-center">
                        {l.currency || ''}
                      </td>
                    )}
                    {isVisible('exchangeRate') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black text-right tabular-nums">
                        {l.exchangeRate || ''}
                      </td>
                    )}
                    {isVisible('debit') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black text-right tabular-nums">
                        {l.debit ? formatCurrency(l.debit, l.currency) : ''}
                      </td>
                    )}
                    {isVisible('credit') && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black text-right tabular-nums">
                        {l.credit ? formatCurrency(l.credit, l.currency) : ''}
                      </td>
                    )}
                    {showDebitBDT && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black text-right tabular-nums">
                        {l.debitBDT ? formatCurrency(l.debitBDT, 'BDT') : '0'}
                      </td>
                    )}
                    {showCreditBDT && (
                      <td className="py-0.5 sm:py-1 px-1 border border-black text-right tabular-nums">
                        {l.creditBDT ? formatCurrency(l.creditBDT, 'BDT') : '0'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {/* Total Row */}
              <tr className="font-bold border-t-2 border-black">
                <td colSpan={leadingColSpan} className="py-0.5 sm:py-1 px-1.5 text-right border border-black">
                  Total
                </td>
                {showDebitBDT && (
                  <td className="py-0.5 sm:py-1 px-1.5 text-right border border-black tabular-nums font-bold">
                    {formatCurrency(data.totals.debitBDT, 'BDT')}
                  </td>
                )}
                {showCreditBDT && (
                  <td className="py-0.5 sm:py-1 px-1.5 text-right border border-black tabular-nums font-bold">
                    {formatCurrency(data.totals.creditBDT, 'BDT')}
                  </td>
                )}
              </tr>

              {/* Difference Row */}
              {showDifferenceRow && (
                <tr className="font-semibold border-t border-black">
                  <td colSpan={leadingColSpan} className="py-0.5 px-1.5 text-right border border-black text-[#dc2626]">
                    Difference
                  </td>
                  {showDebitBDT && (
                    <td className="py-0.5 px-1.5 text-right border border-black"></td>
                  )}
                  {showCreditBDT && (
                    <td className="py-0.5 px-1.5 text-right border border-black tabular-nums text-[#dc2626] font-semibold">
                      {formatCurrency(data.totals.difference, 'BDT')}
                    </td>
                  )}
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        {/* 4. Narration */}
        {showNarration && (
          <div className="flex items-center gap-2 mt-1.5 text-[9px] sm:text-[9.5px]">
            <span className="font-bold text-black min-w-[65px]">Narration</span>
            <div className="flex-1 border border-black px-2 py-0.5 sm:py-1 min-h-[22px] sm:min-h-[24px] text-slate-800">
              {data.narration || ''}
            </div>
          </div>
        )}

        {/* 5. Value In Words */}
        {showValueInWords && (
          <div className="flex items-baseline gap-2 mt-1.5 text-[9.5px]">
            <span className="font-bold text-black min-w-[85px]">Value In words:</span>
            <span className="text-black font-normal">{data.valueInWords}</span>
          </div>
        )}
      </div>

      {/* 6. Bottom Signatures & Footer */}
      <div className={`mt-auto ${isHalfPage ? 'pt-1.5' : 'pt-3'}`}>
        {showSignatures && (
          <div className={`grid grid-cols-3 ${isHalfPage ? 'gap-3 mb-1 text-[8.5px]' : isLandscape ? 'gap-6 mb-2 text-[9.5px]' : 'gap-6 mb-3 text-[9.5px]'} text-center`}>
            <div>
              <div className={`${isHalfPage ? 'w-24 sm:w-28' : 'w-32 sm:w-36'} border-t border-black mx-auto mb-0.5`} />
              <span className="font-medium text-black">Prepared By</span>
            </div>
            <div>
              <div className={`${isHalfPage ? 'w-24 sm:w-28' : 'w-32 sm:w-36'} border-t border-black mx-auto mb-0.5`} />
              <span className="font-medium text-black">Checked By</span>
            </div>
            <div>
              <div className={`${isHalfPage ? 'w-24 sm:w-28' : 'w-32 sm:w-36'} border-t border-black mx-auto mb-0.5`} />
              <span className="font-medium text-black">Approved By</span>
            </div>
          </div>
        )}

        {showFooter && (
          <div className="border-t border-slate-300 pt-1 flex items-center justify-between text-[8px] sm:text-[8.5px] text-slate-500">
            <div className="leading-tight text-left">
              <div>10/1/26</div>
              <div>6:42 PM</div>
            </div>
            <div className="text-center">
              <a
                href={`https://${data.company.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline font-medium"
              >
                {data.company.website}
              </a>
            </div>
            <div className="text-right">
              <span>Page-1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
