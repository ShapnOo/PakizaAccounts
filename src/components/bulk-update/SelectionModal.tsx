import React from 'react';
import { X, ArrowLeft, ArrowRight, CheckSquare, ListChecks } from 'lucide-react';
import { useBulkUpdateStore } from '../../stores/bulkUpdateStore';
import { WizardStepIndicator } from './WizardStepIndicator';

export const SelectionModal: React.FC = () => {
  const {
    step,
    filteredVouchers,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    goToStep,
    closeWizard,
  } = useBulkUpdateStore();

  if (step !== 2) return null;

  const allSelected =
    filteredVouchers.length > 0 && selectedIds.length === filteredVouchers.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < filteredVouchers.length;

  const selectedVouchers = filteredVouchers.filter((v) => selectedIds.includes(v.id));
  const selectedTotalAmount = selectedVouchers.reduce((sum, v) => sum + (v.amount || 0), 0);

  const getVoucherTypeBadge = (type: string) => {
    switch (type) {
      case 'Journal':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10 whitespace-nowrap">
            Journal
          </span>
        );
      case 'Receive':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10 whitespace-nowrap">
            Receive
          </span>
        );
      case 'Payment':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-700/10 whitespace-nowrap">
            Payment
          </span>
        );
      case 'Contra':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/10 whitespace-nowrap">
            Contra
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ListChecks className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Select Vouchers to Update
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                {filteredVouchers.length} {filteredVouchers.length === 1 ? 'voucher' : 'vouchers'} match your filters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeWizard}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <WizardStepIndicator currentStep={2} />

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredVouchers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs sm:text-sm">
              <p className="font-semibold text-slate-700 mb-1">No matching vouchers found</p>
              <p className="text-slate-400 mb-4">Try relaxing your filter criteria.</p>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="px-3.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Back to Filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-sm z-10 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      title="Toggle All"
                    />
                  </th>
                  <th className="py-2.5 px-3">Voucher Date</th>
                  <th className="py-2.5 px-3">Voucher No</th>
                  <th className="py-2.5 px-3">Voucher Type</th>
                  <th className="py-2.5 px-3">Narration</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredVouchers.map((v) => {
                  const isChecked = selectedIds.includes(v.id);
                  return (
                    <tr
                      key={v.id}
                      onClick={() => toggleSelect(v.id)}
                      className={`cursor-pointer transition-colors ${
                        isChecked ? 'bg-indigo-50/50 hover:bg-indigo-50/80' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td
                        className="py-2.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(v.id)}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                        {v.voucherDate}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono font-semibold text-indigo-600">
                        {v.voucherNo}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {getVoucherTypeBadge(v.voucherType)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                        {v.narration || <span className="text-slate-400 italic">No narration</span>}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-900 tabular-nums whitespace-nowrap">
                        ৳ {v.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Selection Summary (Sticky bottom bar) */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-600">{selectedIds.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{filteredVouchers.length}</span> selected
            <span className="text-slate-300">•</span>
            <span>
              Total: <strong className="font-mono text-slate-900">৳ {selectedTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Filters</span>
          </button>

          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => goToStep(3)}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
