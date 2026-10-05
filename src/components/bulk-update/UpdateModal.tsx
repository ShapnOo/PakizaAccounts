import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, Check, Edit3, AlertCircle } from 'lucide-react';
import { useBulkUpdateStore } from '../../stores/bulkUpdateStore';
import { UPDATE_FIELDS, UpdateField } from '../../types/bulk';
import { listCoaAccounts, listEmployees } from '../../services/mastersService';
import { MOCK_COST_CENTERS } from '../../mock/costCenters';
import { MOCK_SUBSIDIARIES } from '../../mock/subsidiaries';
import { MOCK_VEHICLES } from '../../mock/vehicles';
import { Account } from '../../types/coa';
import { Employee } from '../../mock/employees';
import { WizardStepIndicator } from './WizardStepIndicator';

interface UpdateModalProps {
  onSuccess?: (msg: string) => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ onSuccess }) => {
  const {
    step,
    selectedIds,
    updateField,
    newValue,
    goToStep,
    setUpdateField,
    setNewValue,
    getDerivedExistingValue,
    commitUpdate,
    closeWizard,
    updating,
  } = useBulkUpdateStore();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    listCoaAccounts().then(setAccounts);
    listEmployees().then(setEmployees);
  }, []);

  if (step !== 3) return null;

  const derived = getDerivedExistingValue();
  const existingValue = derived.value;
  const isMultiple = derived.isMultiple;

  const currentFieldDef = UPDATE_FIELDS.find((f) => f.value === updateField);
  const fieldLabel = currentFieldDef ? currentFieldDef.label : updateField;

  const isSameAsExisting = !isMultiple && newValue.trim() === existingValue.trim() && newValue !== '';

  const handleUpdate = async () => {
    if (!newValue.trim()) {
      setErrorMsg('Please select or provide a new value for Update To.');
      return;
    }

    if (isSameAsExisting) {
      setErrorMsg('Update To cannot be the same as the Existing value.');
      return;
    }

    setErrorMsg(null);
    const result = await commitUpdate('Riazul Islam');
    if (result && onSuccess) {
      onSuccess(`${result.noOfData} vouchers successfully updated`);
    }
  };

  const renderUpdateToControl = () => {
    switch (updateField) {
      case 'accountsHead':
        return (
          <select
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          >
            <option value="">-- Select Accounts Head --</option>
            <option value="Advance to Supplier">Advance to Supplier</option>
            <option value="Advance to Employee">Advance to Employee</option>
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
                    'Advance to Supplier',
                    'Advance to Employee',
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
        );

      case 'costCenter':
        return (
          <select
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          >
            <option value="">-- Select Cost Center --</option>
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
        );

      case 'subsidiary':
        return (
          <select
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          >
            <option value="">-- Select Subsidiary --</option>
            <option value="Square Yarns Ltd">Square Yarns Ltd</option>
            <option value="Meghna Textile Mills">Meghna Textile Mills</option>
            <option value="Robintex Yarns Ltd">Robintex Yarns Ltd</option>
            <option value="Next Sourcing Ltd UK">Next Sourcing Ltd UK</option>
            {MOCK_SUBSIDIARIES.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name} ({sub.partyType})
              </option>
            ))}
          </select>
        );

      case 'employee':
        return (
          <select
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          >
            <option value="">-- Select Employee --</option>
            <option value="Riazul Islam">Riazul Islam (Chief Accountant)</option>
            <option value="Tanvir Ahmed">Tanvir Ahmed (Senior Accounts Officer)</option>
            <option value="Ayesha Khatun">Ayesha Khatun (Accounts Executive)</option>
            <option value="Sadia Rahman">Sadia Rahman (Accounts Assistant)</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.name}>
                {emp.name} ({emp.designation})
              </option>
            ))}
          </select>
        );

      case 'vehicle':
        return (
          <select
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          >
            <option value="">-- Select Vehicle --</option>
            <option value="Pool Car (Dhaka Metro-Ga 11-2091)">
              Pool Car (Dhaka Metro-Ga 11-2091)
            </option>
            {MOCK_VEHICLES.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        );

      case 'subsidy':
      case 'reference':
      default:
        return (
          <input
            type="text"
            placeholder={`Enter new ${fieldLabel.toLowerCase()}...`}
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Edit3 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Update Selected Vouchers
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                {selectedIds.length} {selectedIds.length === 1 ? 'voucher' : 'vouchers'} will be updated
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

        <WizardStepIndicator currentStep={3} />

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSameAsExisting && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Warning: The new value is identical to the current existing value.</span>
            </div>
          )}

          {/* Update Field Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Update Field
            </label>
            <select
              value={updateField}
              onChange={(e) => setUpdateField(e.target.value as UpdateField)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
            >
              {UPDATE_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Existing Value (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Existing Value
            </label>
            <div className="px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium">
              {isMultiple ? (
                <span className="italic text-slate-400">(multiple values)</span>
              ) : existingValue ? (
                <span className="text-slate-800 font-semibold">{existingValue}</span>
              ) : (
                <span className="italic text-slate-400">(blank)</span>
              )}
            </div>
          </div>

          {/* Update To */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Update To <span className="text-rose-500">*</span>
            </label>
            {renderUpdateToControl()}
          </div>

          {/* Live Preview Bar */}
          <div className="mt-4 p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Live Preview
            </div>
            <div className="text-xs text-slate-700">
              <strong className="font-semibold text-slate-900">{fieldLabel} Update:</strong>{' '}
              <span className="text-rose-600 font-medium">{existingValue || '(blank)'}</span>{' '}
              <span className="text-slate-400 font-normal">to</span>{' '}
              <span className="text-emerald-600 font-semibold">
                {newValue.trim() || '(specify new value)'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToStep(2)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            disabled={updating || !newValue.trim()}
            onClick={handleUpdate}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200"
          >
            <Check className="w-4 h-4" />
            <span>{updating ? 'Updating...' : 'Update Vouchers'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
