import React from 'react';
import { PreparedCheque } from '../../types/cheque';
import { amountToWords } from '../../lib/amountToWords';
import { MOCK_CHEQUE_COMPANY } from '../../mock/companyHeader';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChequePrintCanvasProps {
  cheque: PreparedCheque;
  signatoryCaption?: string;
}

export const ChequePrintCanvas: React.FC<ChequePrintCanvasProps> = ({
  cheque,
  signatoryCaption = 'Managing Director',
}) => {
  const navigate = useNavigate();

  const formattedAmount = (cheque.amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const words = amountToWords(cheque.amount || 0);

  return (
    <div className="w-full space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between pb-4 border-b border-border print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/cheques/prepare/direct')}
            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs cursor-pointer"
            title="Back to Cheque Prepare"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-foreground">Cheque Print Layout</h2>
            <p className="text-xs text-muted-foreground">
              Physical cheque leaf preview for #{cheque.chequeNo} ({cheque.bankName})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Printer className="size-4" />
          <span>Print Cheque</span>
        </button>
      </div>

      {/* ── Cheque Paper Canvas ── */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div
          id="cheque-paper-canvas"
          className="relative bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 border-2 border-emerald-700/40 rounded-xl shadow-lg p-8 w-[840px] h-[340px] text-slate-800 flex flex-col justify-between font-serif select-none print:shadow-none print:border-black print:w-full print:h-[90mm]"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 80%)',
          }}
        >
          {/* Top Row: Date left & right */}
          <div className="flex items-start justify-between">
            {/* Top-Left: Crossed / Payee stamp & Date */}
            <div className="space-y-1">
              <div className="inline-block border-y-2 border-slate-700 px-3 py-0.5 text-[11px] font-mono font-bold tracking-widest uppercase">
                {cheque.chequeType}
              </div>
              <div className="text-[12px] font-mono font-medium text-slate-600">
                DATE: <span className="font-bold text-slate-900">{cheque.chequeDate}</span>
              </div>
            </div>

            {/* Bank Entity Header */}
            <div className="text-center space-y-0.5">
              <h3 className="text-sm font-sans font-black tracking-wider text-slate-900 uppercase">
                {cheque.bankName}
              </h3>
              <p className="text-[10px] font-sans text-slate-500 font-semibold tracking-wide">
                {cheque.bookName} • A/C No: {cheque.accountsBankId}
              </p>
            </div>

            {/* Top-Right: Cheque Date Box */}
            <div className="border border-slate-400 bg-white/80 px-3 py-1 rounded shadow-2xs font-mono text-xs font-bold tracking-wider">
              DATE: {cheque.chequeDate}
            </div>
          </div>

          {/* Middle Section: Pay to & Amount */}
          <div className="space-y-3.5 my-auto">
            {/* Pay To Row */}
            <div className="flex items-baseline gap-2 border-b border-dashed border-slate-400 pb-1">
              <span className="text-xs font-sans font-bold text-slate-700 uppercase tracking-wider shrink-0">
                PAY TO:
              </span>
              <span className="text-sm font-serif font-black text-slate-900 tracking-wide flex-1">
                {cheque.payTo || cheque.partyName}
              </span>
              <span className="text-xs font-serif font-bold text-slate-600 uppercase tracking-widest shrink-0">
                OR BEARER
              </span>
            </div>

            {/* Taka in Words & Amount Box Row */}
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-baseline gap-2 border-b border-dashed border-slate-400 pb-1">
                <span className="text-xs font-sans font-bold text-slate-700 uppercase tracking-wider shrink-0">
                  TAKA:
                </span>
                <span className="text-xs font-serif italic font-bold text-slate-900 flex-1 leading-relaxed">
                  {words}
                </span>
              </div>

              {/* Amount Box */}
              <div className="border-2 border-slate-800 bg-white px-4 py-2 rounded-lg font-mono font-black text-base text-slate-900 shadow-2xs shrink-0 tracking-wider">
                ৳ {formattedAmount} /-
              </div>
            </div>
          </div>

          {/* Bottom Section: Narration, Cheque MICR number, Company Name & Signatory */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-300">
            {/* Narration on bottom-left */}
            <div className="space-y-1 max-w-xs">
              <div className="text-[10px] font-sans text-slate-500 uppercase tracking-wider font-semibold">
                Narration / Purpose:
              </div>
              <div className="text-[11px] font-sans text-slate-700 truncate">
                {cheque.narration || `${cheque.sourceType.toUpperCase()} payment to ${cheque.payTo}`}
              </div>
              <div className="font-mono text-xs font-bold tracking-widest text-slate-800 pt-1">
                ⑈{cheque.chequeNo}⑈ 090272023⑆
              </div>
            </div>

            {/* Bottom-Right: Company Name & Authorized Signatory */}
            <div className="text-right space-y-4">
              <div className="text-xs font-sans font-bold text-slate-800 uppercase tracking-wide">
                For {MOCK_CHEQUE_COMPANY.name}
              </div>

              <div className="pt-6 border-t border-slate-700 min-w-[200px]">
                <div className="text-[11.5px] font-sans font-bold text-slate-900 uppercase tracking-wider">
                  {signatoryCaption || 'Authorised Signatory'}
                </div>
                <div className="text-[10px] font-sans text-slate-500">
                  Signature Caption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
