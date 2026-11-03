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

  const isLandscape = custom.orientation === 'Landscape';
  const isHalfPage = custom.pageCoverage === 'half';

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
      className={`template-outer-frame w-full h-full border ${
        isHalfPage ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'
      } flex flex-col justify-between bg-white box-border`}
      style={{
        color: primaryColor,
        fontSize: `${custom.fontSize}pt`,
      }}
    >
      <div>
        {/* 1. Header: Left Logo & Right Stacked Company Info */}
        {showCompanyHeader && (
          <div className={`flex items-center justify-between ${isHalfPage ? 'pb-1 mb-1' : 'pb-1.5 mb-1.5'}`}>
            <div>
              <img
                src={companyLogo}
                alt="Pakiza Software Logo"
                className={`${isHalfPage ? 'h-6' : isLandscape ? 'h-8' : 'h-10'} max-w-[120px] object-contain`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="text-right">
              <h1 className={`${isHalfPage ? 'text-[13px] sm:text-[14px]' : 'text-[15px] sm:text-[16px]'} font-bold text-slate-900 tracking-tight leading-tight`}>
                {data.company.name}
              </h1>
              <p className="text-[9.5px] text-slate-600 leading-tight">
                {data.company.addressLine1}
              </p>
              <p className="text-[9.5px] text-slate-600 leading-tight">
                {data.company.addressLine2}
              </p>
            </div>
          </div>
        )}

        {/* 2. Full-Width Navy Banner */}
        <div
          className={`w-full ${isHalfPage ? 'py-0.5 mb-1' : 'py-0.5 sm:py-1 mb-1.5'} px-3 text-center text-white`}
          style={{ backgroundColor: accentColor }}
        >
          <h2 className={`${isHalfPage ? 'text-[11px]' : 'text-[13px] sm:text-[14px]'} font-bold uppercase tracking-wider text-white`}>
            {data.voucherType} Voucher
          </h2>
          <p className={`${isHalfPage ? 'text-[7.5px]' : 'text-[8.5px]'} text-blue-100 font-medium`}>
            {data.source}
          </p>
        </div>

        {/* 3. Meta Section: 3 Boxed Cells */}
        <div className={`grid grid-cols-3 gap-0 border border-slate-300 ${isHalfPage ? 'mb-1 text-[8px]' : 'mb-2 text-[9px] sm:text-[9.5px]'}`}>
          <div className={`${isHalfPage ? 'p-0.5 px-1.5' : 'p-1 px-2'} border-r border-slate-300`}>
            <span className="block text-[7px] sm:text-[7.5px] uppercase tracking-wider text-slate-500 font-semibold">
              VOUCHER NO
            </span>
            <span className="font-bold text-slate-900">{data.voucherNo}</span>
          </div>
          <div className={`${isHalfPage ? 'p-0.5 px-1.5' : 'p-1 px-2'} border-r border-slate-300`}>
            <span className="block text-[7px] sm:text-[7.5px] uppercase tracking-wider text-slate-500 font-semibold">
              VOUCHER DATE
            </span>
            <span className="font-bold text-slate-900">{data.voucherDate}</span>
          </div>
          <div className={`${isHalfPage ? 'p-0.5 px-1.5' : 'p-1 px-2'}`}>
            <span className="block text-[7px] sm:text-[7.5px] uppercase tracking-wider text-slate-500 font-semibold">
              BASE CURRENCY
            </span>
            <span className="font-bold text-slate-900">BDT – Bangladeshi Taka</span>
          </div>
        </div>

        {/* 4. Table (Full Grid Borders with Navy Header & White Text) */}
        <div className={isHalfPage ? 'mb-1' : 'mb-2'}>
          <table className={`w-full ${isHalfPage ? 'text-[8px]' : 'text-[8.5px] sm:text-[9px]'} border-collapse border border-slate-300`}>
            <thead>
              <tr
                className="text-white font-bold text-left"
                style={{ backgroundColor: accentColor }}
              >
                <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50">Accounts Head</th>
                {showColLineDesc && (
                  <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50">Line Description</th>
                )}
                {showColCur && (
                  <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50 text-center">Cur.</th>
                )}
                {showColRate && (
                  <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50 text-right">Rate</th>
                )}
                {showColDebitCur && (
                  <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50 text-right">Debit (Currency)</th>
                )}
                {showColCreditCur && (
                  <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50 text-right">Credit (Currency)</th>
                )}
                {showColDebitBDT && (
                  <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50 text-right">Debit (BDT)</th>
                )}
                {showColCreditBDT && (
                  <th className="py-0.5 sm:py-1 px-1 border border-blue-900/50 text-right">Credit (BDT)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.lines.map((l) => (
                <React.Fragment key={l.id}>
                  {/* Row 1: Amounts with Full Cell Borders */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-0.5 sm:py-1 px-1 border border-slate-300 font-medium text-slate-900">
                      {l.accountsHead || '–'}
                    </td>
                    {showColLineDesc && (
                      <td className="py-0.5 sm:py-1 px-1 border border-slate-300 text-slate-600">
                        {l.lineDescription || '–'}
                      </td>
                    )}
                    {showColCur && (
                      <td className="py-0.5 sm:py-1 px-1 border border-slate-300 text-center text-slate-700">
                        {l.currency || '–'}
                      </td>
                    )}
                    {showColRate && (
                      <td className="py-0.5 sm:py-1 px-1 border border-slate-300 text-right tabular-nums text-slate-700">
                        {l.exchangeRate ? Number(l.exchangeRate).toFixed(2) : '–'}
                      </td>
                    )}
                    {showColDebitCur && (
                      <td className="py-0.5 sm:py-1 px-1 border border-slate-300 text-right tabular-nums text-slate-700">
                        {l.debit ? formatCurrency(l.debit, l.currency) : ''}
                      </td>
                    )}
                    {showColCreditCur && (
                      <td className="py-0.5 sm:py-1 px-1 border border-slate-300 text-right tabular-nums text-slate-700">
                        {l.credit ? formatCurrency(l.credit, l.currency) : ''}
                      </td>
                    )}
                    {showColDebitBDT && (
                      <td className="py-0.5 sm:py-1 px-1 border border-slate-300 text-right font-medium tabular-nums text-slate-900">
                        {l.debitBDT ? formatCurrency(l.debitBDT, 'BDT') : ''}
                      </td>
                    )}
                    {showColCreditBDT && (
                      <td className="py-0.5 sm:py-1 px-1 border border-slate-300 text-right font-medium tabular-nums text-slate-900">
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
                      compact={isHalfPage}
                    />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Currency Summary & Grand Total (Split Layout) */}
        <div className={isHalfPage ? 'mt-0.5 mb-1' : 'mt-1 mb-2'}>
          <div className="grid grid-cols-12 gap-2 sm:gap-3 items-start">
            {/* Left Side: Currency Summary Grid Table */}
            <div className="col-span-7">
              {showCurrencySummary && (
                <div>
                  <div className="mb-0.5">
                    <span className={`${isHalfPage ? 'text-[7.5px]' : 'text-[8.5px]'} font-bold uppercase tracking-wider text-slate-700`}>
                      CURRENCY SUMMARY
                    </span>
                    {!isHalfPage && (
                      <p className="text-[7.5px] text-slate-400 italic">
                        Base currency: BDT. Currency amounts are converted to BDT at each line's rate.
                      </p>
                    )}
                  </div>

                  <table className={`w-full ${isHalfPage ? 'text-[7.5px]' : 'text-[8px] sm:text-[8.5px]'} border-collapse border border-slate-300 mt-0.5`}>
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-semibold">
                        <th className="py-0.5 px-1 text-left border border-slate-300">Cur.</th>
                        <th className="py-0.5 px-1 text-right border border-slate-300">Debit (Cur)</th>
                        <th className="py-0.5 px-1 text-right border border-slate-300">Credit (Cur)</th>
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
            <div className={`col-span-5 flex flex-col justify-end ${isHalfPage ? 'pt-0.5' : 'pt-3 sm:pt-4'}`}>
              <div className={`border border-slate-300 bg-slate-50/60 ${isHalfPage ? 'py-0.5 px-1.5 text-[8px]' : 'py-0.5 sm:py-1 px-2 text-[9px] sm:text-[9.5px]'} flex items-center justify-between`}>
                <span className="font-bold text-slate-900 uppercase">
                  GRAND TOTAL (BDT)
                </span>
                <div className="flex gap-2 sm:gap-4 font-bold tabular-nums text-slate-900">
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
        <div className={`space-y-0.5 ${isHalfPage ? 'mt-0.5 text-[8px]' : 'mt-1 text-[9px]'}`}>
          {showBalanceIndicator && (
            <div className="font-bold text-emerald-600 flex items-center gap-1 leading-tight">
              <span className="inline-block size-1.5 rounded-full bg-emerald-600" />
              <span>● BALANCED (BDT)</span>
            </div>
          )}

          {showNarration && data.narration && (
            <div className="text-slate-700 leading-tight">
              <span className="font-semibold">Narration: </span>
              <span>{data.narration}</span>
            </div>
          )}

          {showValueInWords && data.valueInWords && (
            <div className="text-slate-900 leading-tight">
              <span className="font-bold italic">In words: </span>
              <span>{data.valueInWords}</span>
            </div>
          )}
        </div>
      </div>

      {/* 7. Dynamic Signatures & Footer */}
      <div className={`mt-auto ${isHalfPage ? 'pt-0.5' : 'pt-3'}`}>
        {showSignatures && (
          <SignatureRow
            slots={data.signatureSlots}
            fixedThree={false}
            styleVariant="cleanGrid"
            primaryColor={primaryColor}
            compact={isHalfPage}
          />
        )}

        {showFooter && (
          <div className={`${isHalfPage ? 'mt-1 pt-0.5 text-[7px]' : 'mt-2 pt-1 text-[8px] sm:text-[8.5px]'} text-center text-slate-400 border-t border-slate-100`}>
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
  );
};
