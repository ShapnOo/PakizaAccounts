import React from 'react';
import { amountToWords } from '../../lib/amountToWords';
import { PrepareLine, SourceType } from '../../types/chequePrepare';
import { MOCK_CHEQUE_COMPANY } from '../../mock/companyHeader';

interface ChequePrintCanvasProps {
  line: PrepareLine;
  bankName: string;
  sourceType: SourceType;
  narration?: string;
  signatory?: string;
  companyName?: string;
}

export const ChequePrintCanvas: React.FC<ChequePrintCanvasProps> = ({
  line,
  bankName,
  sourceType,
  narration = '',
  signatory = 'Authorized Signatory',
  companyName = MOCK_CHEQUE_COMPANY.name,
}) => {
  // Format Date: M/D/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return `${month}/${day}/${year}`;
      }
    }
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}` : dateStr;
  };

  const formattedDate = formatDate(line.chequeDate);
  const words = amountToWords(line.amount);
  const formattedAmount = (line.amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="w-full max-w-[840px] mx-auto bg-transparent p-6 font-serif relative overflow-hidden select-none">
      {/* Top Bar: Bank Info on Left, AC Payee Stamp & Date on Right */}
      <div className="flex items-start justify-between gap-4 pb-4">
        {/* Bank & Leaf Identity */}
        <div className="text-left">
          <div className="text-sm font-black uppercase tracking-wider text-foreground">
            {bankName || 'DUTCH BANGLA BANK LIMITED'}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">
            Cheque Leaf: <strong className="text-foreground">{line.chequeNo || 'CQ26000001'}</strong>
          </div>
        </div>

        {/* Right Section: Account Payee Stamp & Date Box */}
        <div className="flex flex-col items-end gap-2 text-right">
          {/* AC Payee / Crossed stamp on the right side */}
          {line.chequeType === 'AC Payee' && (
            <div className="border-y-2 border-slate-700 dark:border-slate-300 px-3 py-0.5 text-xs font-mono font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 inline-block transform -rotate-2">
              // A/C PAYEE ONLY //
            </div>
          )}
          {line.chequeType === 'Crossed' && (
            <div className="border-y-2 border-slate-700 dark:border-slate-300 px-3 py-0.5 text-xs font-mono font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 inline-block transform -rotate-2">
              // & CO. //
            </div>
          )}

          {/* Date Line */}
          <div className="flex items-center gap-1.5 px-1 py-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Date:
            </span>
            <span className="font-mono font-black text-sm text-foreground tracking-widest">
              {formattedDate || 'MM/DD/YYYY'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Cheque Body: 2-Column Physical Grid */}
      <div className="grid grid-cols-12 gap-6 pt-4 min-h-[160px]">
        {/* Left Side (Counterfoil / Stub preview - 4 cols) */}
        <div className="col-span-4 pr-4 space-y-3 text-xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground pb-1">
            Cheque Counterfoil
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground block">Pay to:</span>
            <span className="font-semibold text-foreground break-words">{line.payTo || '—'}</span>
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground block">Amount (৳):</span>
            <span className="font-mono font-bold text-foreground">৳ {formattedAmount}</span>
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground block">Narration:</span>
            <p className="text-[11px] text-muted-foreground line-clamp-3 leading-snug">
              {narration || 'Being payment against official requisition'}
            </p>
          </div>
        </div>

        {/* Right Side (Main Paper Cheque Leaf - 8 cols) */}
        <div className="col-span-8 space-y-4 pl-2">
          {/* Row 1: Pay To Line */}
          <div className="flex items-end gap-2 pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              Pay To:
            </span>
            <span className="text-sm font-extrabold text-foreground font-sans uppercase tracking-wide flex-1 px-2">
              {line.payTo || 'Bearer'}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">or Bearer</span>
          </div>

          {/* Row 2: Taka in Words */}
          <div className="flex items-start gap-2 pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap pt-0.5">
              Taka in Words:
            </span>
            <span className="text-xs font-bold text-foreground italic flex-1 px-2 leading-relaxed">
              {words}
            </span>
          </div>

          {/* Row 3: Total Amount Box & Signatory */}
          <div className="flex items-end justify-between gap-4 pt-2">
            {/* Amount */}
            <div className="flex items-center gap-1.5 px-3 py-1.5">
              <span className="font-mono font-extrabold text-base text-foreground">৳</span>
              <span className="font-mono font-black text-lg text-foreground tracking-wider">
                {formattedAmount}
              </span>
            </div>

            {/* Company & Signatory */}
            <div className="text-right space-y-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                For {companyName}
              </div>
              <div className="h-8 w-44 inline-block"></div>
              <div className="text-[11px] font-bold text-foreground">
                {signatory || 'Managing Director'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom MICR / Cheque Ribbon Strip */}
      <div className="mt-5 pt-3 flex items-center justify-between text-center font-mono text-[11px] text-muted-foreground tracking-widest">
        <span>⑈{line.chequeNo || 'CQ26000001'}⑈</span>
        <span>120272045⑆</span>
        <span>00123456789⑈ 10</span>
      </div>
    </div>
  );
};
