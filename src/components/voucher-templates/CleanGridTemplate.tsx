import React from 'react';
import type {
  VoucherPreviewData,
  TemplateCustomization,
} from '../../types/voucherTemplate';
import { formatCurrency } from '../../lib/format';
import { AuxDimensionsRow } from './shared/AuxDimensionsRow';
import { SignatureRow } from './shared/SignatureRow';
import companyLogoImg from '../../assets/company_logo.png';

interface CleanGridTemplateProps {
  data: VoucherPreviewData;
  custom: TemplateCustomization;
}

export const CleanGridTemplate: React.FC<CleanGridTemplateProps> = ({
  data,
  custom,
}) => {
  const {
    showCompanyHeader = true,
    showNarration = true,
    showValueInWords = true,
    showSignatures = true,
    showFooter = true,
    showCurrencySummary = true,
    showBalanceIndicator = true,
    showLineDescription = true,
    showAuxRow = true,
    primaryColor = '#0f172a',
    accentColor = '#1e40af',
    companyLogo = custom.companyLogo || companyLogoImg || '/company_logo.png',
  } = custom;

  const isVisible = (colId: string, defaultVal = true) => {
    if (!custom.visibleColumns) return defaultVal;
    return custom.visibleColumns[colId] !== undefined ? custom.visibleColumns[colId] : defaultVal;
  };

  const showColLineDesc = showLineDescription && isVisible('lineDescription', true);
  const showColCur = isVisible('currency', true);
  const showColRate = isVisible('exchangeRate', true);
  const showColDebitCur = isVisible('debit', true);
  const showColCreditCur = isVisible('credit', true);
  const showColDebitBDT = isVisible('debitBDT', true);
  const showColCreditBDT = isVisible('creditBDT', true);

  const totalVisibleCols = [
    true, // accountsHead
    showColLineDesc,
    showColCur,
    showColRate,
    showColDebitCur,
    showColCreditCur,
    showColDebitBDT,
    showColCreditBDT,
  ].filter(Boolean).length;

  return (
    <div
      className="w-full h-full p-6 bg-white"
      style={{
        color: primaryColor,
        fontSize: `${custom.fontSize}pt`,
      }}
    >
      {/* Outer black border enclosing the entire canvas */}
      <div className="w-full h-full border border-black p-5 flex flex-col justify-between">
        <div>
          {/* 1. Header: Left Logo & Right Stacked Company Info */}
          {showCompanyHeader && (
            <div className="flex items-center justify-between pb-2 mb-2">
              <div>
                <img
                  src={companyLogo}
                  alt="Pakiza Software Logo"
                  className="h-10 max-w-[140px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="text-right">
                <h1 className="text-[16px] font-bold text-slate-900 tracking-tight leading-tight">
                  {data.company.name}
                </h1>
                <p className="text-[10px] text-slate-600 leading-tight">
                  {data.company.addressLine1}
                </p>
                <p className="text-[10px] text-slate-600 leading-tight">
                  {data.company.addressLine2}
                </p>
              </div>
            </div>
          )}

          {/* 2. Full-Width Navy Banner */}
          <div
            className="w-full py-1 px-4 text-center text-white mb-2"
            style={{ backgroundColor: accentColor }}
          >
            <h2 className="text-[14px] font-bold uppercase tracking-wider text-white">
              {data.voucherType} Voucher
            </h2>
            <p className="text-[9px] text-blue-100 font-medium mt-0.5">
              {data.source}
            </p>
          </div>

          {/* 3. Meta Section: 3 Boxed Cells */}
          <div className="grid grid-cols-3 gap-0 border border-slate-300 mb-3 text-[9.5px]">
            <div className="p-1.5 border-r border-slate-300">
              <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-semibold">
                VOUCHER NO
              </span>
              <span className="font-bold text-slate-900">{data.voucherNo}</span>
            </div>
            <div className="p-1.5 border-r border-slate-300">
              <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-semibold">
                VOUCHER DATE
              </span>
              <span className="font-bold text-slate-900">{data.voucherDate}</span>
            </div>
            <div className="p-1.5">
              <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-semibold">
                BASE CURRENCY
              </span>
              <span className="font-bold text-slate-900">BDT – Bangladeshi Taka</span>
            </div>
          </div>

          {/* 4. Table (Full Grid Borders with Navy Header & White Text) */}
          <div className="mb-3">
            <table className="w-full text-[9px] border-collapse border border-slate-300">
              <thead>
                <tr
                  className="text-white font-bold text-left"
                  style={{ backgroundColor: accentColor }}
                >
                  <th className="py-1 px-1.5 border border-blue-900/50">Accounts Head</th>
                  {showColLineDesc && (
                    <th className="py-1 px-1.5 border border-blue-900/50">Line Description</th>
                  )}
                  {showColCur && (
                    <th className="py-1 px-1.5 border border-blue-900/50 text-center">Cur.</th>
                  )}
                  {showColRate && (
                    <th className="py-1 px-1.5 border border-blue-900/50 text-right">Rate</th>
                  )}
                  {showColDebitCur && (
                    <th className="py-1 px-1.5 border border-blue-900/50 text-right">Debit (Currency)</th>
                  )}
                  {showColCreditCur && (
                    <th className="py-1 px-1.5 border border-blue-900/50 text-right">Credit (Currency)</th>
                  )}
                  {showColDebitBDT && (
                    <th className="py-1 px-1.5 border border-blue-900/50 text-right">Debit (BDT)</th>
                  )}
                  {showColCreditBDT && (
                    <th className="py-1 px-1.5 border border-blue-900/50 text-right">Credit (BDT)</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.lines.map((l) => (
                  <React.Fragment key={l.id}>
                    {/* Row 1: Amounts with Full Cell Borders */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-1 px-1.5 border border-slate-300 font-medium text-slate-900">
                        {l.accountsHead || '–'}
                      </td>
                      {showColLineDesc && (
                        <td className="py-1 px-1.5 border border-slate-300 text-slate-600">
                          {l.lineDescription || '–'}
                        </td>
                      )}
                      {showColCur && (
                        <td className="py-1 px-1.5 border border-slate-300 text-center text-slate-700">
                          {l.currency || '–'}
                        </td>
                      )}
                      {showColRate && (
                        <td className="py-1 px-1.5 border border-slate-300 text-right tabular-nums text-slate-700">
                          {l.exchangeRate ? Number(l.exchangeRate).toFixed(2) : '–'}
                        </td>
                      )}
                      {showColDebitCur && (
                        <td className="py-1 px-1.5 border border-slate-300 text-right tabular-nums text-slate-700">
                          {l.debit ? formatCurrency(l.debit, l.currency) : ''}
                        </td>
                      )}
                      {showColCreditCur && (
                        <td className="py-1 px-1.5 border border-slate-300 text-right tabular-nums text-slate-700">
                          {l.credit ? formatCurrency(l.credit, l.currency) : ''}
                        </td>
                      )}
                      {showColDebitBDT && (
                        <td className="py-1 px-1.5 border border-slate-300 text-right font-medium tabular-nums text-slate-900">
                          {l.debitBDT ? formatCurrency(l.debitBDT, 'BDT') : ''}
                        </td>
                      )}
                      {showColCreditBDT && (
                        <td className="py-1 px-1.5 border border-slate-300 text-right font-medium tabular-nums text-slate-900">
                          {l.creditBDT ? formatCurrency(l.creditBDT, 'BDT') : ''}
                        </td>
                      )}
                    </tr>

                    {/* Row 2: Aux Dimensions with Full Grid Borders */}
                    {showAuxRow && (
                      <AuxDimensionsRow
                        line={l}
                        colSpan={totalVisibleCols}
                        isGrid={true}
                        visibleColumns={custom.visibleColumns}
                      />
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. Currency Summary & Grand Total (Split Layout matching Screenshot 3) */}
          <div className="mt-2 mb-3">
            <div className="grid grid-cols-12 gap-4 items-start">
              {/* Left Side: Currency Summary Grid Table */}
              <div className="col-span-7">
                {showCurrencySummary && (
                  <div>
                    <div className="mb-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                        CURRENCY SUMMARY
                      </span>
                      <p className="text-[8px] text-slate-400 italic">
                        Base currency: BDT. Currency amounts are converted to BDT at each line's rate.
                      </p>
                    </div>

                    <table className="w-full text-[8.5px] border-collapse border border-slate-300 mt-1">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 font-semibold">
                          <th className="py-0.5 px-1 text-left border border-slate-300">Cur.</th>
                          <th className="py-0.5 px-1 text-right border border-slate-300">Debit (Currency)</th>
                          <th className="py-0.5 px-1 text-right border border-slate-300">Credit (Currency)</th>
                          <th className="py-0.5 px-1 text-right border border-slate-300">Debit (BDT)</th>
                          <th className="py-0.5 px-1 text-right border border-slate-300">Credit (BDT)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.currencySummary.map((c) => (
                          <tr key={c.currency} className="text-slate-700">
                            <td className="py-0.5 px-1 font-medium border border-slate-300">{c.currency}</td>
                            <td className="py-0.5 px-1 text-right tabular-nums border border-slate-300">
                              {c.debitCur ? formatCurrency(c.debitCur, c.currency) : ''}
                            </td>
                            <td className="py-0.5 px-1 text-right tabular-nums border border-slate-300">
                              {c.creditCur ? formatCurrency(c.creditCur, c.currency) : ''}
                            </td>
                            <td className="py-0.5 px-1 text-right tabular-nums border border-slate-300">
                              {c.debitBDT ? formatCurrency(c.debitBDT, 'BDT') : ''}
                            </td>
                            <td className="py-0.5 px-1 text-right tabular-nums border border-slate-300">
                              {c.creditBDT ? formatCurrency(c.creditBDT, 'BDT') : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Side: Grand Total (BDT) */}
              <div className="col-span-5 flex flex-col justify-end pt-5">
                <div className="border border-slate-300 bg-slate-50/60 py-1 px-2 flex items-center justify-between text-[9.5px]">
                  <span className="font-bold text-slate-900 uppercase">
                    GRAND TOTAL (BDT)
                  </span>
                  <div className="flex gap-4 font-bold tabular-nums text-slate-900">
                    {showColDebitBDT && (
                      <span>{formatCurrency(data.totals.debitBDT, 'BDT')}</span>
                    )}
                    {showColCreditBDT && (
                      <span>{formatCurrency(data.totals.creditBDT, 'BDT')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Status & Narration & Value In Words */}
          <div className="space-y-1.5 mt-2">
            {showBalanceIndicator && (
              <div className="text-[9.5px] font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="inline-block size-1.5 rounded-full bg-emerald-600" />
                <span>● BALANCED (BDT)</span>
              </div>
            )}

            {showNarration && data.narration && (
              <div className="text-[9.5px] text-slate-700">
                <span className="font-semibold">Narration: </span>
                <span>{data.narration}</span>
              </div>
            )}

            {showValueInWords && data.valueInWords && (
              <div className="text-[9.5px] text-slate-900">
                <span className="font-bold italic">In words: </span>
                <span>{data.valueInWords}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* 7. Dynamic Signatures (4 columns) */}
          {showSignatures && (
            <SignatureRow
              slots={data.signatureSlots}
              fixedThree={false}
              styleVariant="cleanGrid"
              primaryColor={primaryColor}
            />
          )}

          {/* 8. Footer: Centered Website Link */}
          {showFooter && (
            <div className="mt-4 pt-1 text-center text-[8.5px] text-slate-400">
              <a
                href={`https://${data.company.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {data.company.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
