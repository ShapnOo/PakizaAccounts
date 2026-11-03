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

  const isVisible = (colId: string) => {
    if (!custom.visibleColumns) return true;
    return custom.visibleColumns[colId] !== undefined ? custom.visibleColumns[colId] : true;
  };

  // Calculate leading colSpan for Total and Difference rows
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
      className="w-full h-full p-6 bg-white"
      style={{
        color: primaryColor,
        fontSize: `${custom.fontSize}pt`,
      }}
    >
      {/* Outer black border enclosing the entire voucher canvas */}
      <div className="w-full h-full border border-black p-5 flex flex-col justify-between">
        <div>
          {/* 1. Header: Left Logo & Center Company Info */}
          {showCompanyHeader && (
            <div className="relative mb-3 pb-2">
              {/* Logo on top-left */}
              <div className="absolute left-0 top-0">
                <img
                  src={companyLogo}
                  alt="Pakiza Software Logo"
                  className="h-10 max-w-[140px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Centered Company Details & Voucher Title */}
              <div className="text-center pt-0.5">
                <h1 className="text-[17px] font-bold text-black tracking-normal leading-tight">
                  {data.company.name}
                </h1>
                <p className="text-[11px] text-slate-700 leading-tight">
                  {data.company.addressLine1}
                </p>
                <p className="text-[11px] text-slate-700 leading-tight">
                  {data.company.addressLine2 || 'Dhaka Banagladesh'}
                </p>
                <h2
                  className="text-[15px] font-bold mt-1.5 leading-tight"
                  style={{ color: accentColor }}
                >
                  {data.voucherType} Voucher
                </h2>
                <p className="text-[10px] font-semibold text-[#4d7c0f] mt-0.5">
                  Source: {data.source}
                </p>
              </div>
            </div>
          )}

          {/* 2. Metadata: Left-aligned Voucher No & Date */}
          <div className="text-[10px] text-black font-medium mb-2 space-y-0.5">
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
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-[9px] border-collapse border border-black">
              <thead>
                <tr className="bg-slate-300 text-black font-bold">
                  {isVisible('accountsHead') && (
                    <th className="py-1 px-1.5 border border-black text-left">Accounts Head</th>
                  )}
                  {isVisible('costCenter') && (
                    <th className="py-1 px-1.5 border border-black text-left">Cost Center</th>
                  )}
                  {isVisible('subsidiary') && (
                    <th className="py-1 px-1.5 border border-black text-left">Subsidiary</th>
                  )}
                  {isVisible('vehicle') && (
                    <th className="py-1 px-1.5 border border-black text-left">Vehicles</th>
                  )}
                  {isVisible('reference') && (
                    <th className="py-1 px-1.5 border border-black text-left">Reference</th>
                  )}
                  {isVisible('lineDescription') && (
                    <th className="py-1 px-1.5 border border-black text-left">Line Description</th>
                  )}
                  {isVisible('currency') && (
                    <th className="py-1 px-1.5 border border-black text-center">Currency</th>
                  )}
                  {isVisible('exchangeRate') && (
                    <th className="py-1 px-1.5 border border-black text-right">Exc. Rate</th>
                  )}
                  {isVisible('debit') && (
                    <th className="py-1 px-1.5 border border-black text-right">Debit</th>
                  )}
                  {isVisible('credit') && (
                    <th className="py-1 px-1.5 border border-black text-right">Credit</th>
                  )}
                  {showDebitBDT && (
                    <th className="py-1 px-1.5 border border-black text-right">Debit (BDT)</th>
                  )}
                  {showCreditBDT && (
                    <th className="py-1 px-1.5 border border-black text-right">Credit (BDT)</th>
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
                        <td className="py-1 px-1.5 border border-black font-medium">
                          {l.accountsHead || ''}
                        </td>
                      )}
                      {isVisible('costCenter') && (
                        <td className="py-1 px-1.5 border border-black">
                          {l.costCenter || ''}
                        </td>
                      )}
                      {isVisible('subsidiary') && (
                        <td className="py-1 px-1.5 border border-black">
                          {subsidiaryWithEmployee || ''}
                        </td>
                      )}
                      {isVisible('vehicle') && (
                        <td className="py-1 px-1.5 border border-black">
                          {l.vehicle || ''}
                        </td>
                      )}
                      {isVisible('reference') && (
                        <td className="py-1 px-1.5 border border-black">
                          {l.reference || ''}
                        </td>
                      )}
                      {isVisible('lineDescription') && (
                        <td className="py-1 px-1.5 border border-black">
                          {l.lineDescription || ''}
                        </td>
                      )}
                      {isVisible('currency') && (
                        <td className="py-1 px-1.5 border border-black text-center">
                          {l.currency || ''}
                        </td>
                      )}
                      {isVisible('exchangeRate') && (
                        <td className="py-1 px-1.5 border border-black text-right tabular-nums">
                          {l.exchangeRate || ''}
                        </td>
                      )}
                      {isVisible('debit') && (
                        <td className="py-1 px-1.5 border border-black text-right tabular-nums">
                          {l.debit ? formatCurrency(l.debit, l.currency) : ''}
                        </td>
                      )}
                      {isVisible('credit') && (
                        <td className="py-1 px-1.5 border border-black text-right tabular-nums">
                          {l.credit ? formatCurrency(l.credit, l.currency) : ''}
                        </td>
                      )}
                      {showDebitBDT && (
                        <td className="py-1 px-1.5 border border-black text-right tabular-nums">
                          {l.debitBDT ? formatCurrency(l.debitBDT, 'BDT') : '0'}
                        </td>
                      )}
                      {showCreditBDT && (
                        <td className="py-1 px-1.5 border border-black text-right tabular-nums">
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
                  <td colSpan={leadingColSpan} className="py-1 px-2 text-right border border-black">
                    Total
                  </td>
                  {showDebitBDT && (
                    <td className="py-1 px-2 text-right border border-black tabular-nums font-bold">
                      {formatCurrency(data.totals.debitBDT, 'BDT')}
                    </td>
                  )}
                  {showCreditBDT && (
                    <td className="py-1 px-2 text-right border border-black tabular-nums font-bold">
                      {formatCurrency(data.totals.creditBDT, 'BDT')}
                    </td>
                  )}
                </tr>

                {/* Difference Row (Red Text in Difference & Red value under Credit BDT) */}
                {showDifferenceRow && (
                  <tr className="font-semibold border-t border-black">
                    <td colSpan={leadingColSpan} className="py-0.5 px-2 text-right border border-black text-[#dc2626]">
                      Difference
                    </td>
                    {showDebitBDT && (
                      <td className="py-0.5 px-2 text-right border border-black"></td>
                    )}
                    {showCreditBDT && (
                      <td className="py-0.5 px-2 text-right border border-black tabular-nums text-[#dc2626] font-semibold">
                        {formatCurrency(data.totals.difference, 'BDT')}
                      </td>
                    )}
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* 4. Narration (Boxed container matching screenshot) */}
          {showNarration && (
            <div className="flex items-center gap-2 mt-2 text-[9.5px]">
              <span className="font-bold text-black min-w-[70px]">Narration</span>
              <div className="flex-1 border border-black px-2 py-1 min-h-[26px] text-slate-800">
                {data.narration || ''}
              </div>
            </div>
          )}

          {/* 5. Value In Words */}
          {showValueInWords && (
            <div className="flex items-baseline gap-2 mt-2 text-[10px]">
              <span className="font-bold text-black min-w-[90px]">Value In words:</span>
              <span className="text-black font-normal">{data.valueInWords}</span>
            </div>
          )}
        </div>

        <div>
          {/* 6. Fixed 3 Signatures */}
          {showSignatures && (
            <div className="mt-10 mb-4 grid grid-cols-3 gap-6 text-center text-[10px]">
              <div>
                <div className="w-36 border-t border-black mx-auto mb-1" />
                <span className="font-medium text-black">Prepared By</span>
              </div>
              <div>
                <div className="w-36 border-t border-black mx-auto mb-1" />
                <span className="font-medium text-black">Checked By</span>
              </div>
              <div>
                <div className="w-36 border-t border-black mx-auto mb-1" />
                <span className="font-medium text-black">Approved By</span>
              </div>
            </div>
          )}

          {/* 7. Footer: Date/Time on left, blue website link in center, Page-1 on right */}
          {showFooter && (
            <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px] text-slate-500">
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
    </div>
  );
};
