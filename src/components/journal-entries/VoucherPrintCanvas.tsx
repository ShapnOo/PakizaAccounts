import React from 'react';
import { VoucherEntry, VOUCHER_TYPE_CONFIG } from '../../types/journalEntry';

interface VoucherPrintCanvasProps {
  voucher: VoucherEntry;
}

export const VoucherPrintCanvas: React.FC<VoucherPrintCanvasProps> = ({ voucher }) => {
  const cfg = VOUCHER_TYPE_CONFIG[voucher.voucherType];

  const totalDebitBDT = voucher.lines.reduce((s, l) => s + (l.debitBDT ?? 0), 0);
  const totalCreditBDT = voucher.lines.reduce((s, l) => s + (l.creditBDT ?? 0), 0);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 rounded-2xl">
      {/* Header */}
      <div className="text-center pb-6 border-b-2 border-slate-900/80 space-y-1">
        <h1 className="text-2xl font-black tracking-wider uppercase text-slate-900">
          Pakiza Spinning Mills Ltd.
        </h1>
        <p className="text-xs text-slate-600 font-medium">
          Pakiza Corporate Tower, 56-57 Motijheel C/A, Dhaka-1000, Bangladesh
        </p>
        <p className="text-[11px] text-slate-500">
          Phone: +880-2-9568123 • Email: accounts@pakizagroup.com
        </p>

        <div className="pt-2">
          <span className="inline-block px-4 py-1 text-sm font-black uppercase tracking-widest bg-slate-100 text-slate-900 border border-slate-300 rounded-md">
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Meta Information Grid */}
      <div className="grid grid-cols-2 gap-4 py-5 text-xs border-b border-slate-200">
        <div className="space-y-1.5">
          <div>
            <span className="text-slate-500 font-medium">Voucher No: </span>
            <span className="font-mono font-bold text-slate-900">{voucher.voucherNo}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Voucher Type: </span>
            <span className="font-bold text-slate-900">{voucher.voucherType}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Transaction Source: </span>
            <span className="font-semibold text-slate-800">{voucher.source}</span>
          </div>
        </div>

        <div className="space-y-1.5 text-right">
          <div>
            <span className="text-slate-500 font-medium">Voucher Date: </span>
            <span className="font-bold text-slate-900">
              {new Date(voucher.voucherDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Status: </span>
            <span className={`font-bold ${voucher.voided ? 'text-rose-600' : 'text-emerald-700'}`}>
              {voucher.voided ? 'VOIDED' : 'POSTED / ACTIVE'}
            </span>
          </div>
          {voucher.headerAccountName && (
            <div>
              <span className="text-slate-500 font-medium">Header Account: </span>
              <span className="font-bold text-slate-900">{voucher.headerAccountName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lines Table */}
      <div className="py-6">
        <table className="w-full text-left text-xs border-collapse border border-slate-300">
          <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[11px] text-slate-700">
            <tr>
              <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">SL</th>
              <th className="py-2.5 px-3 border-r border-slate-300">Accounts Head & Description</th>
              <th className="py-2.5 px-3 border-r border-slate-300 w-28">Cost Center / Ref</th>
              <th className="py-2.5 px-3 border-r border-slate-300 w-20 text-center">Currency</th>
              <th className="py-2.5 px-3 border-r border-slate-300 w-28 text-right">Debit (৳ BDT)</th>
              <th className="py-2.5 px-3 w-28 text-right">Credit (৳ BDT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {voucher.lines.map((line, idx) => (
              <tr key={line.id}>
                <td className="py-2 px-3 border-r border-slate-300 text-center font-mono text-slate-500">
                  {idx + 1}
                </td>
                <td className="py-2 px-3 border-r border-slate-300">
                  <div className="font-bold text-slate-900">{line.accountHeadName || line.accountHeadId}</div>
                  {line.description && (
                    <div className="text-[11px] text-slate-600 mt-0.5">{line.description}</div>
                  )}
                </td>
                <td className="py-2 px-3 border-r border-slate-300 text-slate-700">
                  {line.costCenterId || line.reference || '-'}
                </td>
                <td className="py-2 px-3 border-r border-slate-300 text-center font-mono">
                  {line.currency} {line.currency !== 'BDT' && `@ ${line.exchangeRate}`}
                </td>
                <td className="py-2 px-3 border-r border-slate-300 text-right font-mono font-bold">
                  {line.debitBDT ? line.debitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold">
                  {line.creditBDT ? line.creditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
            <tr>
              <td colSpan={4} className="py-2.5 px-3 text-right border-r border-slate-300 uppercase">
                Total Amount:
              </td>
              <td className="py-2.5 px-3 text-right border-r border-slate-300 font-mono text-sm font-black">
                ৳ {totalDebitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-sm font-black">
                ৳ {totalCreditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Narration */}
      <div className="py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
        <span className="font-bold uppercase tracking-wider text-slate-600 text-[10px]">
          Narration:
        </span>
        <p className="text-slate-800 italic leading-relaxed">
          {voucher.narration || 'N/A'}
        </p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-4 gap-4 pt-16 text-center text-xs text-slate-700">
        <div className="border-t border-slate-400 pt-2 font-bold">Prepared By</div>
        <div className="border-t border-slate-400 pt-2 font-bold">Checked By</div>
        <div className="border-t border-slate-400 pt-2 font-bold">Accounts Manager</div>
        <div className="border-t border-slate-400 pt-2 font-bold">Authorized Signatory</div>
      </div>
    </div>
  );
};
