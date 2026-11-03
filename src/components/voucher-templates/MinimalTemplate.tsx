import React from 'react';
import type {
  VoucherPreviewData,
  TemplateCustomization,
} from '../../types/voucherTemplate';
import { formatCurrency } from '../../lib/format';
import { AuxDimensionsRow } from './shared/AuxDimensionsRow';
import { SignatureRow } from './shared/SignatureRow';
import companyLogoImg from '../../assets/company_logo.png';

interface MinimalTemplateProps {
  data: VoucherPreviewData;
  custom: TemplateCustomization;
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({
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
          {/* 1. Header: Left Logo & Right Large Title with Company Line */}
          {showCompanyHeader && (
            <div>
              <div className="flex items-center justify-between pb-1">
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
                  <h1
                    className="text-[20px] font-bold tracking-tight leading-tight"
                    style={{ color: accentColor }}
                  >
                    {data.voucherType} Voucher
                  </h1>
                  <p className="text-[9.5px] text-slate-500 mt-0.5">
                    {data.company.name} | {data.company.addressLine1}, {data.company.addressLine2}
                  </p>
                </div>
              </div>

              {/* Solid dark blue divider bar */}
              <div
                className="w-full h-0.5 mt-1 mb-2"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          )}

          {/* 2. Meta Line (4 Columns: Voucher No, Date, Source, Base Currency) */}
          <div className="grid grid-cols-4 gap-4 py-1.5 border-b border-slate-300 text-[9.5px] mb-3">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                VOUCHER NO
              </span>
              <span className="font-bold text-slate-900">{data.voucherNo}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                VOUCHER DATE
              </span>
              <span className="font-bold text-slate-900">{data.voucherDate}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                Source
              </span>
              <span className="font-bold text-slate-900">{data.source}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                BASE CURRENCY
              </span>
              <span className="font-bold text-slate-900">BDT</span>
            </div>
          </div>

          {/* 3. Table (Dual-Row, Hairline Borders) */}
          <div className="mb-3">
            <table className="w-full text-[9px] border-collapse">
              <thead>
                <tr className="border-y border-slate-400 text-slate-700 font-semibold text-left">
                  <th className="py-1 px-1.5">Accounts Head</th>
                  {showColLineDesc && (
                    <th className="py-1 px-1.5">Line Description</th>
                  )}
                  {showColCur && <th className="py-1 px-1.5 text-center">Cur.</th>}
                  {showColRate && <th className="py-1 px-1.5 text-right">Rate</th>}
                  {showColDebitCur && (
                    <th className="py-1 px-1.5 text-right">Debit (Currency)</th>
                  )}
                  {showColCreditCur && (
                    <th className="py-1 px-1.5 text-right">Credit (Currency)</th>
                  )}
                  {showColDebitBDT && (
                    <th className="py-1 px-1.5 text-right">Debit (BDT)</th>
                  )}
                  {showColCreditBDT && (
                    <th className="py-1 px-1.5 text-right">Credit (BDT)</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.lines.map((l) => (
                  <React.Fragment key={l.id}>
                    {/* Row 1: Amounts */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-1 px-1.5 font-medium text-slate-900">
                        {l.accountsHead || '–'}
                      </td>
                      {showColLineDesc && (
                        <td className="py-1 px-1.5 text-slate-600">
                          {l.lineDescription || '–'}
                        </td>
                      )}
                      {showColCur && (
                        <td className="py-1 px-1.5 text-center text-slate-700">
                          {l.currency || '–'}
                        </td>
                      )}
                      {showColRate && (
                        <td className="py-1 px-1.5 text-right tabular-nums text-slate-700">
                          {l.exchangeRate ? Number(l.exchangeRate).toFixed(2) : '–'}
                        </td>
                      )}
                      {showColDebitCur && (
                        <td className="py-1 px-1.5 text-right tabular-nums text-slate-700">
                          {l.debit ? formatCurrency(l.debit, l.currency) : ''}
                        </td>
                      )}
                      {showColCreditCur && (
                        <td className="py-1 px-1.5 text-right tabular-nums text-slate-700">
                          {l.credit ? formatCurrency(l.credit, l.currency) : ''}
                        </td>
                      )}
                      {showColDebitBDT && (
                        <td className="py-1 px-1.5 text-right font-medium tabular-nums text-slate-900">
                          {l.debitBDT ? formatCurrency(l.debitBDT, 'BDT') : ''}
                        </td>
                      )}
                      {showColCreditBDT && (
                        <td className="py-1 px-1.5 text-right font-medium tabular-nums text-slate-900">
                          {l.creditBDT ? formatCurrency(l.creditBDT, 'BDT') : ''}
                        </td>
                      )}
                    </tr>

                    {/* Row 2: Aux Dimensions */}
                    {showAuxRow && (
                      <AuxDimensionsRow
                        line={l}
                        colSpan={totalVisibleCols}
                        isGrid={false}
                        visibleColumns={custom.visibleColumns}
                      />
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Currency Summary & Grand Total */}
          <div className="mt-2 mb-3">
            <div className="grid grid-cols-12 gap-4 items-start">
              {/* Left Side: Currency Summary Table */}
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

                    <table className="w-full text-[8.5px] border-collapse mt-1">
                      <thead>
                        <tr className="border-b border-slate-300 text-slate-500 font-medium">
                          <th className="py-0.5 px-1 text-left">Cur.</th>
                          <th className="py-0.5 px-1 text-right">Debit (Currency)</th>
                          <th className="py-0.5 px-1 text-right">Credit (Currency)</th>
                          <th className="py-0.5 px-1 text-right">Debit (BDT)</th>
                          <th className="py-0.5 px-1 text-right">Credit (BDT)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.currencySummary.map((c) => (
                          <tr key={c.currency} className="border-b border-slate-100 text-slate-700">
                            <td className="py-0.5 px-1 font-medium">{c.currency}</td>
                            <td className="py-0.5 px-1 text-right tabular-nums">
                              {c.debitCur ? formatCurrency(c.debitCur, c.currency) : ''}
                            </td>
                            <td className="py-0.5 px-1 text-right tabular-nums">
                              {c.creditCur ? formatCurrency(c.creditCur, c.currency) : ''}
                            </td>
                            <td className="py-0.5 px-1 text-right tabular-nums">
                              {c.debitBDT ? formatCurrency(c.debitBDT, 'BDT') : ''}
                            </td>
                            <td className="py-0.5 px-1 text-right tabular-nums">
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
                <div className="border-t border-b border-slate-700 py-1 flex items-center justify-between text-[9.5px]">
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

          {/* 5. Status & Narration & Value In Words */}
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
          {/* 6. Dynamic Signatures (4 columns: Name above, line, label below) */}
          {showSignatures && (
            <SignatureRow
              slots={data.signatureSlots}
              fixedThree={false}
              styleVariant="minimal"
              primaryColor={primaryColor}
            />
          )}

          {/* 7. Footer: Centered Website Link */}
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
