import React, { useEffect, useState } from 'react';
import { X, Search, RotateCcw, Calendar, DollarSign, Filter, Layers } from 'lucide-react';
import { useBulkUpdateStore } from '../../stores/bulkUpdateStore';
import { listCoaAccounts, listEmployees } from '../../services/mastersService';
import { MOCK_COST_CENTERS } from '../../mock/costCenters';
import { MOCK_VEHICLES } from '../../mock/vehicles';
import { Account } from '../../types/coa';
import { Employee } from '../../mock/employees';
import { WizardStepIndicator } from './WizardStepIndicator';

export const FilterModal: React.FC = () => {
  const { step, criteria, setCriteria, resetCriteria, runFilter, closeWizard, filtering } =
    useBulkUpdateStore();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    listCoaAccounts().then(setAccounts);
    listEmployees().then(setEmployees);
  }, []);

  if (step !== 1) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (criteria.dateFrom && criteria.dateTo && criteria.dateFrom > criteria.dateTo) {
      setErrorMsg('Date From cannot be later than Date To.');
      return;
    }

    if (
      criteria.amountMin != null &&
      criteria.amountMax != null &&
      Number(criteria.amountMin) > Number(criteria.amountMax)
    ) {
      setErrorMsg('Minimum amount cannot be greater than Maximum amount.');
      return;
    }

    await runFilter();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Filter className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Filter Vouchers</h2>
              <p className="text-xs text-slate-500">Step 1: Set criteria to filter vouchers for bulk update</p>
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

        <WizardStepIndicator currentStep={1} />

        {/* Form Body */}
        <form onSubmit={handleSearch} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date Range (From — To)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="relative">
                  <input
                    type="date"
                    value={criteria.dateFrom || ''}
                    onChange={(e) => setCriteria({ dateFrom: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                  />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={criteria.dateTo || ''}
                    onChange={(e) => setCriteria({ dateTo: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Accounts Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Accounts Name
              </label>
              <select
                value={criteria.accountsName || ''}
                onChange={(e) => setCriteria({ accountsName: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="">-- All Accounts Heads --</option>
                <option value="Advance to Employee">Advance to Employee</option>
                <option value="Advance to Supplier">Advance to Supplier</option>
                <option value="Cash in Hand">Cash in Hand</option>
                <option value="Factory Electricity & Gas Utility Expense">
                  Factory Electricity & Gas Utility Expense
                </option>
                <option value="Export Sales Revenue - Knitwear">Export Sales Revenue - Knitwear</option>
                <option value="Petty Cash - Dhaka Head Office">Petty Cash - Dhaka Head Office</option>
                {accounts
                  .filter(
                    (a) =>
                      ![
                        'Advance to Employee',
                        'Advance to Supplier',
                        'Cash in Hand',
                        'Factory Electricity & Gas Utility Expense',
                        'Export Sales Revenue - Knitwear',
                        'Petty Cash - Dhaka Head Office',
                      ].includes(a.name)
                  )
                  .map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.code ? `${a.code} - ${a.name}` : a.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Min Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={criteria.amountMin ?? ''}
                onChange={(e) =>
                  setCriteria({
                    amountMin: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Max Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 500000"
                value={criteria.amountMax ?? ''}
                onChange={(e) =>
                  setCriteria({
                    amountMax: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>

            {/* Cost Center */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cost Center
              </label>
              <select
                value={criteria.costCenter || ''}
                onChange={(e) => setCriteria({ costCenter: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="">-- All Cost Centers --</option>
                <option value="Head Office">Head Office</option>
                <option value="Spinning Mill Unit-1">Spinning Mill Unit-1</option>
                <option value="Dyeing & Printing Division">Dyeing & Printing Division</option>
                <option value="Apparels Garments Division">Apparels Garments Division</option>
                {MOCK_COST_CENTERS.map((cc) => (
                  <option key={cc.id} value={cc.name}>
                    {cc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subsidy */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Subsidy
              </label>
              <input
                type="text"
                placeholder="e.g. HQ Operations, Factory Supply..."
                value={criteria.subsidy || ''}
                onChange={(e) => setCriteria({ subsidy: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Employee */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Employee
              </label>
              <select
                value={criteria.employee || ''}
                onChange={(e) => setCriteria({ employee: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="">-- All Employees --</option>
                <option value="Riazul Islam">Riazul Islam</option>
                <option value="Tanvir Ahmed">Tanvir Ahmed</option>
                <option value="Ayesha Khatun">Ayesha Khatun</option>
                <option value="Sadia Rahman">Sadia Rahman</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.designation})
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vehicle
              </label>
              <select
                value={criteria.vehicle || ''}
                onChange={(e) => setCriteria({ vehicle: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="">-- All Vehicles --</option>
                <option value="Pool Car (Dhaka Metro-Ga 11-2091)">
                  Pool Car (Dhaka Metro-Ga 11-2091)
                </option>
                {MOCK_VEHICLES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetCriteria}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeWizard}
              className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={filtering}
              onClick={handleSearch}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm shadow-indigo-200"
            >
              <Search className="w-4 h-4" />
              <span>{filtering ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
