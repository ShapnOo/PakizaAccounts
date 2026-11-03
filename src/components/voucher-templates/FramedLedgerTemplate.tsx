import React from 'react';
import type {
  VoucherPreviewData,
  TemplateCustomization,
} from '../../types/voucherTemplate';
import { formatCurrency } from '../../lib/format';
import { SignatureRow } from './shared/SignatureRow';
import companyLogoImg from '../../assets/company_logo.png';

interface FramedLedgerTemplateProps {
  data: VoucherPreviewData;
  custom: TemplateCustomization;
}

export const FramedLedgerTemplate: React.FC<FramedLedgerTemplateProps> = ({
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
    zebraStripes = true,
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
        {/* 1. Header: Left Logo & Center Serif Title & Company Info */}
        {showCompanyHeader && (
          <div className={`relative ${isHalfPage ? 'mb-1 pb-0.5' : 'mb-1.5 pb-1'}`}>
            {/* Logo on top-left */}
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

            {/* Centered Serif Header */}
            <div className="text-center pt-0.5">
              <h1
                className={`${isHalfPage ? 'text-[15px] sm:text-[17px]' : 'text-[19px] sm:text-[21px]'} font-bold font-serif tracking-normal leading-tight`}
                style={{ color: accentColor }}
              >
                {data.voucherType} Voucher
              </h1>
              <p className={`${isHalfPage ? 'text-[10px]' : 'text-[11px] sm:text-[12px]'} font-bold font-serif text-slate-800 leading-tight mt-0.5`}>
                {data.company.name}
              </p>
              <p className="text-[9px] sm:text-[9.5px] font-serif text-slate-600 leading-tight">
                {data.company.addressLine1}, {data.company.addressLine2}
              </p>
            </div>

            {/* Double Horizontal Rule under Header */}
            <div className="border-b-2 border-t border-slate-700 h-0.5 mt-1.5" />
          </div>
        )}

        {/* 2. Meta Section: 2x2 Boxed Grid with Solid Borders */}
        <div className="border border-slate-300 mb-2 text-[9px] sm:text-[9.5px]">
          <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
            <div className="p-0.5 sm:p-1 px-2 flex justify-between">
              <span className="font-bold text-slate-800">Voucher No</span>
              <span className="font-bold text-slate-900">{data.voucherNo}</span>
            </div>
            <div className="p-0.5 sm:p-1 px-2 flex justify-between">
              <span className="font-bold text-slate-800">Voucher Type</span>
              <span className="text-slate-800 font-medium">{data.voucherType} Voucher</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-300">
            <div className="p-0.5 sm:p-1 px-2 flex justify-between">
              <span className="font-bold text-slate-800">Voucher Date</span>
              <span className="font-bold text-slate-900">{data.voucherDate}</span>
            </div>
            <div className="p-0.5 sm:p-1 px-2 flex justify-between">
              <span className="font-bold text-slate-800">Base Currency</span>
              <span className="font-bold text-slate-900">BDT</span>
            </div>
          </div>
        </div>

        {/* 3. Table (Ledger Style with Double-Rule & Paired Row Striping) */}
        <div className="mb-2">
          <table className="w-full text-[8.5px] sm:text-[9px] border-collapse border border-slate-300">
            <thead>
              <tr className="border-t-2 border-b-2 border-slate-700 bg-slate-100 text-slate-800 font-bold text-left">
                <th className="py-0.5 sm:py-1 px-1 border-r border-slate-300">Accounts Head</th>
                {showColLineDesc && (
                  <th className="py-0.5 sm:py-1 px-1 border-r border-slate-300">Line Description</th>
                )}
                {showColCur && (
                  <th className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-center">Cur.</th>
                )}
                {showColRate && (
                  <th className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right">Rate</th>
                )}
                {showColDebitCur && (
                  <th className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right">Debit (Currency)</th>
                )}
                {showColCreditCur && (
                  <th className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right">Credit (Currency)</th>
                )}
                {showColDebitBDT && (
                  <th className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right">Debit (BDT)</th>
                )}
                {showColCreditBDT && (
                  <th className="py-0.5 sm:py-1 px-1 text-right">Credit (BDT)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.lines.map((l, index) => {
                const isEven = index % 2 === 0;
                const rowBg = zebraStripes && !isEven ? 'bg-slate-50/70' : 'bg-white';

                return (
                  <React.Fragment key={l.id}>
                    {/* Sub-row 1: Amounts */}
                    <tr className={`${rowBg} border-b border-slate-200 hover:bg-slate-50/90`}>
                      <td className="py-0.5 sm:py-1 px-1 border-r border-slate-300 font-medium text-slate-900">
                        {l.accountsHead || '–'}
                      </td>
                      {showColLineDesc && (
                        <td className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-slate-700">
                          {l.lineDescription || '–'}
                        </td>
                      )}
                      {showColCur && (
                        <td className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-center text-slate-700 font-medium">
                          {l.currency || '–'}
                        </td>
                      )}
                      {showColRate && (
                        <td className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right tabular-nums text-slate-700">
                          {l.exchangeRate ? Number(l.exchangeRate).toFixed(2) : '–'}
                        </td>
                      )}
                      {showColDebitCur && (
                        <td className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right tabular-nums text-slate-700">
                          {l.debit ? formatCurrency(l.debit, l.currency) : ''}
                        </td>
                      )}
                      {showColCreditCur && (
                        <td className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right tabular-nums text-slate-700">
                          {l.credit ? formatCurrency(l.credit, l.currency) : ''}
                        </td>
                      )}
                      {showColDebitBDT && (
                        <td className="py-0.5 sm:py-1 px-1 border-r border-slate-300 text-right font-medium tabular-nums text-slate-900">
                          {l.debitBDT ? formatCurrency(l.debitBDT, 'BDT') : ''}
                        </td>
                      )}
                      {showColCreditBDT && (
                        <td className="py-0.5 sm:py-1 px-1 text-right font-medium tabular-nums text-slate-900">
                          {l.creditBDT ? formatCurrency(l.creditBDT, 'BDT') : ''}
                        </td>
                      )}
                    </tr>

                    {/* Sub-row 2: Aux Dimensions placed in aligned column cells */}
                    {showAuxRow && (
                      <tr className={`${rowBg} border-b border-slate-300 text-[8px] sm:text-[8.5px] text-slate-500`}>
                        <td className="py-0.5 px-1 border-r border-slate-300">
                          {isVisible('costCenter', true) && (
                            <span>Cost Center: {l.costCenter || '–'}</span>
                          )}
                        </td>
                        {showColLineDesc && (
                          <td className="py-0.5 px-1 border-r border-slate-300">
                            {isVisible('subsidiary', true) && (
                              <span>Subsidiary: {l.subsidiary || '–'}</span>
                            )}
                          </td>
                        )}
                        {showColCur && (
                          <td className="py-0.5 px-1 border-r border-slate-300 text-center">
                            {/* Empty */}
                          </td>
                        )}
                        {showColRate && (
                          <td className="py-0.5 px-1 border-r border-slate-300">
                            {isVisible('employee', true) && (
                              <span>Employee: {l.employee || '–'}</span>
                            )}
                          </td>
                        )}
                        {showColDebitCur && (
                          <td className="py-0.5 px-1 border-r border-slate-300">
                            {isVisible('vehicle', true) && (
                              <span>Vehicle: {l.vehicle || '–'}</span>
                            )}
                          </td>
                        )}
                        {showColCreditCur && (
                          <td className="py-0.5 px-1 border-r border-slate-300">
                            {/* Empty */}
                          </td>
                        )}
                        {showColDebitBDT && (
                          <td className="py-0.5 px-1 border-r border-slate-300">
                            {isVisible('reference', true) && (
                              <span>Reference: {l.reference || '–'}</span>
                            )}
                          </td>
                        )}
                        {showColCreditBDT && (
                          <td className="py-0.5 px-1">
                            {/* Empty */}
                          </td>
                        )}
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Currency Summary & Grand Total (Split Layout) */}
        <div className="mt-1 mb-2">
          <div className="grid grid-cols-12 gap-3 items-start">
            {/* Left Side: Currency Summary */}
            <div className="col-span-7">
              {showCurrencySummary && (
                <div>
                  <div className="mb-0.5">
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-700">
                      CURRENCY SUMMARY
                    </span>
                    <p className="text-[7.5px] text-slate-400 italic">
                      Base currency: BDT. Currency amounts are converted to BDT at each line's rate.
                    </p>
                  </div>

                  <table className="w-full text-[8px] sm:text-[8.5px] border-collapse mt-0.5">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-600 font-semibold">
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

            {/* Right Side: Grand Total (BDT) with Double Bottom Rule */}
            <div className="col-span-5 flex flex-col justify-end pt-3 sm:pt-4">
              <div className="border-t border-b-2 border-slate-700 py-0.5 sm:py-1 flex items-center justify-between text-[9px] sm:text-[9.5px]">
                <span className="font-bold text-slate-900 uppercase">
                  GRAND TOTAL (BDT)
                </span>
                <div className="flex gap-3 sm:gap-4 font-bold tabular-nums text-slate-900">
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
        <div className="space-y-1 mt-1">
          {showBalanceIndicator && (
            <div className="text-[9px] sm:text-[9.5px] font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-emerald-600" />
              <span>● BALANCED (BDT)</span>
            </div>
          )}

          {showNarration && data.narration && (
            <div className="text-[9px] text-slate-700">
              <span className="font-semibold">Narration: </span>
              <span>{data.narration}</span>
            </div>
          )}

          {showValueInWords && data.valueInWords && (
            <div className="text-[9px] text-slate-900">
              <span className="font-bold italic">In words: </span>
              <span>{data.valueInWords}</span>
            </div>
          )}
        </div>
      </div>

      {/* 6. Dynamic Signatures & Footer */}
      <div className={`mt-auto ${isHalfPage ? 'pt-1.5' : 'pt-3'}`}>
        {showSignatures && (
          <SignatureRow
            slots={data.signatureSlots}
            fixedThree={false}
            styleVariant="framedLedger"
            primaryColor={primaryColor}
            compact={isHalfPage}
          />
        )}

        {showFooter && (
          <div className="mt-2 text-center text-[8px] sm:text-[8.5px] text-slate-400 border-t border-slate-100 pt-1">
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
