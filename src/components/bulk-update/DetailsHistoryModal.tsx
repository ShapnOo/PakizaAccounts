import React from 'react';
import { X, FileText, User, Calendar, Layers } from 'lucide-react';
import { useBulkUpdateStore } from '../../stores/bulkUpdateStore';
import { StatusChip } from './StatusChip';

export const DetailsHistoryModal: React.FC = () => {
  const {
    detailsModalOpen,
    selectedHistoryRow,
    detailsVouchers,
    loadingDetails,
    closeDetailsModal,
  } = useBulkUpdateStore();

  if (!detailsModalOpen || !selectedHistoryRow) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${day} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return isoString;
    }
  };

  const totalAmount = detailsVouchers.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:px-6 sm:py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Update Details — {formatDate(selectedHistoryRow.updateDate)}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {selectedHistoryRow.description}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDetailsModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta Strip */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated by:</span>
            <span className="text-slate-900 font-semibold">{selectedHistoryRow.userName}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">{selectedHistoryRow.noOfData}</span> vouchers
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span>Status:</span>
            <StatusChip status={selectedHistoryRow.status} />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-0">
          {loadingDetails ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-xs text-slate-500 font-medium">Loading details...</span>
            </div>
          ) : detailsVouchers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs sm:text-sm">
              No matching voucher records found for this update log.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-sm z-10 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 sm:px-6">Voucher No</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Narration</th>
                  <th className="py-2.5 px-4 sm:px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {detailsVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 sm:px-6 font-mono font-semibold text-indigo-600 whitespace-nowrap">
                      {v.voucherNo}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap text-slate-600">
                      {v.voucherDate}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">
                      {v.narration || <span className="text-slate-400 italic font-normal">None</span>}
                    </td>
                    <td className="py-2.5 px-4 sm:px-6 text-right font-mono font-medium text-slate-900 tabular-nums whitespace-nowrap">
                      ৳ {v.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-semibold text-slate-900">
                <tr>
                  <td colSpan={3} className="py-2.5 px-4 sm:px-6 text-right text-xs uppercase tracking-wider">
                    Total Amount:
                  </td>
                  <td className="py-2.5 px-4 sm:px-6 text-right font-mono tabular-nums text-indigo-700">
                    ৳ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={closeDetailsModal}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
