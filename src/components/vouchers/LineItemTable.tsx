import React from 'react';
import { VoucherLine, VoucherType } from '../../types/voucher';
import {
  VOUCHER_TYPE_CONFIGS,
  COST_CENTERS,
  SUBSIDIARIES,
  EMPLOYEES,
  VEHICLES,
  CURRENCIES,
} from '../../constants/voucherTypeConfig';
import { AccountHeadPicker } from './AccountHeadPicker';
import { Plus, Trash2, Info } from 'lucide-react';
import { useCustomFields } from '../../hooks/useCustomFields';
import { CustomFieldCell } from '../shared/CustomFieldCell';
import { CustomFieldContext } from '../../types/customField';

interface LineItemTableProps {
  voucherType: VoucherType;
  lines: VoucherLine[];
  onChange: (lines: VoucherLine[]) => void;
}

export const LineItemTable: React.FC<LineItemTableProps> = ({
  voucherType,
  lines,
  onChange,
}) => {
  const config = VOUCHER_TYPE_CONFIGS[voucherType];

  const voucherContext: CustomFieldContext =
    voucherType === 'Journal Voucher'
      ? 'journal'
      : voucherType === 'Payment Voucher'
      ? 'payment'
      : voucherType === 'Receive Voucher'
      ? 'receive'
      : 'contra';

  const { fields: customFields } = useCustomFields(voucherContext);

  const handleAddLine = () => {
    const initialCustom: Record<string, any> = {};
    customFields.forEach((cf) => {
      if (cf.defaultValue !== undefined && cf.defaultValue !== null) {
        initialCustom[cf.id] = cf.defaultValue;
      }
    });

    const newLine: VoucherLine = {
      id: `vl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      accountHeadId: '',
      accountHeadName: '',
      costCenterId: '',
      subsidiaryId: '',
      employeeId: '',
      vehicleId: '',
      reference: '',
      description: '',
      customFields: initialCustom,
      currency: 'BDT',
      exchangeRate: 1,
      debit: config.showDebit ? 0 : undefined,
      credit: config.showCredit ? 0 : undefined,
      debitBDT: config.showDebit ? 0 : undefined,
      creditBDT: config.showCredit ? 0 : undefined,
    };
    onChange([...lines, newLine]);
  };

  const handleUpdateLine = (id: string, patch: Partial<VoucherLine>) => {
    onChange(
      lines.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...patch };

        // Recalculate BDT conversions
        const rate = updated.exchangeRate > 0 ? updated.exchangeRate : 1;
        if (config.showDebit && updated.debit !== undefined) {
          updated.debitBDT = Math.round(((updated.debit || 0) * rate + Number.EPSILON) * 100) / 100;
        }
        if (config.showCredit && updated.credit !== undefined) {
          updated.creditBDT = Math.round(((updated.credit || 0) * rate + Number.EPSILON) * 100) / 100;
        }

        return updated;
      })
    );
  };

  const handleRemoveLine = (id: string) => {
    onChange(lines.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Responsive Scrollable Table */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/40 border-b border-border/70 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-3 min-w-[220px]">Accounts Head *</th>
                <th className="py-2.5 px-2.5 min-w-[150px]">Cost Center</th>
                <th className="py-2.5 px-2.5 min-w-[150px]">Subsidiary</th>
                <th className="py-2.5 px-2.5 min-w-[150px]">Employee</th>
                <th className="py-2.5 px-2.5 min-w-[140px]">Vehicles</th>
                <th className="py-2.5 px-2 min-w-[110px]">Reference</th>
                <th className="py-2.5 px-2 min-w-[150px]">Description</th>

                {/* Dynamic Custom Field Columns (between Description and Currency) */}
                {customFields.map((cf) => (
                  <th
                    key={cf.id}
                    className="py-2.5 px-2.5 min-w-[140px] bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 border-x border-indigo-100/50 dark:border-indigo-900/30"
                  >
                    <div className="flex items-center gap-1">
                      <span>{cf.label}</span>
                      {cf.mandatory && <span className="text-rose-500 font-bold">*</span>}
                    </div>
                  </th>
                ))}

                <th className="py-2.5 px-2 w-20">Currency</th>
                <th className="py-2.5 px-2 w-20 text-right">Exc. Rate</th>

                {/* Conditional Debit / Credit Columns */}
                {config.showDebit && (
                  <th className="py-2.5 px-2 w-28 text-right bg-emerald-500/5">Debit</th>
                )}
                {config.showCredit && (
                  <th className="py-2.5 px-2 w-28 text-right bg-rose-500/5">Credit</th>
                )}
                {config.showDebit && (
                  <th className="py-2.5 px-2 w-28 text-right bg-emerald-500/10">Debit (BDT)</th>
                )}
                {config.showCredit && (
                  <th className="py-2.5 px-2 w-28 text-right bg-rose-500/10">Credit (BDT)</th>
                )}

                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {lines.length === 0 ? (
                <tr>
                  <td
                    colSpan={10 + customFields.length + (config.showDebit ? 2 : 0) + (config.showCredit ? 2 : 0)}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No line items added yet. Click "+ Add Line ++" below to start.
                  </td>
                </tr>
              ) : (
                lines.map((line, idx) => (
                  <tr key={line.id} className="hover:bg-muted/15 transition-colors">
                    {/* Accounts Head */}
                    <td className="py-1.5 px-3">
                      <AccountHeadPicker
                        value={line.accountHeadId}
                        onChange={(id, name) =>
                          handleUpdateLine(line.id, {
                            accountHeadId: id,
                            accountHeadName: name,
                          })
                        }
                        onlyCashAndBank={config.allowOnlyCashBankLines}
                        placeholder="Choose Head..."
                      />
                    </td>

                    {/* Cost Center */}
                    <td className="py-1.5 px-2.5">
                      <select
                        value={line.costCenterId || ''}
                        onChange={(e) =>
                          handleUpdateLine(line.id, { costCenterId: e.target.value })
                        }
                        className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/70 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
                      >
                        <option value="">None</option>
                        {COST_CENTERS.map((cc) => (
                          <option key={cc.id} value={cc.id}>
                            {cc.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Subsidiary */}
                    <td className="py-1.5 px-2.5">
                      <select
                        value={line.subsidiaryId || ''}
                        onChange={(e) =>
                          handleUpdateLine(line.id, { subsidiaryId: e.target.value })
                        }
                        className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/70 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
                      >
                        <option value="">None</option>
                        {SUBSIDIARIES.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Employee */}
                    <td className="py-1.5 px-2.5">
                      <select
                        value={line.employeeId || ''}
                        onChange={(e) =>
                          handleUpdateLine(line.id, { employeeId: e.target.value })
                        }
                        className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/70 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
                      >
                        <option value="">None</option>
                        {EMPLOYEES.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Vehicles */}
                    <td className="py-1.5 px-2.5">
                      <select
                        value={line.vehicleId || ''}
                        onChange={(e) =>
                          handleUpdateLine(line.id, { vehicleId: e.target.value })
                        }
                        className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/70 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
                      >
                        <option value="">None</option>
                        {VEHICLES.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Reference */}
                    <td className="py-1.5 px-2">
                      <input
                        type="text"
                        placeholder="Ref..."
                        value={line.reference || ''}
                        onChange={(e) =>
                          handleUpdateLine(line.id, { reference: e.target.value })
                        }
                        className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/70 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </td>

                    {/* Description */}
                    <td className="py-1.5 px-2">
                      <input
                        type="text"
                        placeholder="Line note..."
                        value={line.description || ''}
                        onChange={(e) =>
                          handleUpdateLine(line.id, { description: e.target.value })
                        }
                        className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/70 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </td>

                    {/* Dynamic Custom Field Cells (between Description and Currency) */}
                    {customFields.map((cf) => (
                      <td
                        key={cf.id}
                        className="py-1.5 px-2 bg-indigo-50/15 dark:bg-indigo-950/10 border-x border-indigo-100/40 dark:border-indigo-900/20 min-w-[140px]"
                      >
                        <CustomFieldCell
                          field={cf}
                          value={line.customFields?.[cf.id] ?? cf.defaultValue}
                          onChange={(val) => {
                            const existingCustom = line.customFields || {};
                            handleUpdateLine(line.id, {
                              customFields: {
                                ...existingCustom,
                                [cf.id]: val,
                              },
                            });
                          }}
                        />
                      </td>
                    ))}

                    {/* Currency */}
                    <td className="py-1.5 px-2">
                      <select
                        value={line.currency || 'BDT'}
                        onChange={(e) =>
                          handleUpdateLine(line.id, { currency: e.target.value })
                        }
                        className="w-full h-8.5 px-1.5 rounded-lg bg-card border border-border/70 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Exchange Rate */}
                    <td className="py-1.5 px-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0.0001"
                        value={line.exchangeRate ?? 1}
                        onChange={(e) =>
                          handleUpdateLine(line.id, {
                            exchangeRate: parseFloat(e.target.value) || 1,
                          })
                        }
                        className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/70 text-xs font-mono font-bold text-right text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </td>

                    {/* Debit Amount */}
                    {config.showDebit && (
                      <td className="py-1.5 px-2 bg-emerald-500/5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.debit !== undefined && line.debit > 0 ? line.debit : ''}
                          onChange={(e) =>
                            handleUpdateLine(line.id, {
                              debit: parseFloat(e.target.value) || 0,
                              credit: config.isDoubleEntry ? 0 : undefined,
                            })
                          }
                          className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/80 text-xs font-mono font-bold text-right text-foreground outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                        />
                      </td>
                    )}

                    {/* Credit Amount */}
                    {config.showCredit && (
                      <td className="py-1.5 px-2 bg-rose-500/5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.credit !== undefined && line.credit > 0 ? line.credit : ''}
                          onChange={(e) =>
                            handleUpdateLine(line.id, {
                              credit: parseFloat(e.target.value) || 0,
                              debit: config.isDoubleEntry ? 0 : undefined,
                            })
                          }
                          className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/80 text-xs font-mono font-bold text-right text-foreground outline-none focus:ring-1 focus:ring-rose-500 shadow-2xs"
                        />
                      </td>
                    )}

                    {/* Debit (BDT) Readonly */}
                    {config.showDebit && (
                      <td className="py-1.5 px-2 bg-emerald-500/10">
                        <input
                          type="text"
                          readOnly
                          value={(line.debitBDT || 0).toFixed(2)}
                          className="w-full h-8.5 px-2 rounded-lg bg-muted/40 border border-border/50 text-xs font-mono font-bold text-right text-muted-foreground outline-none select-none"
                        />
                      </td>
                    )}

                    {/* Credit (BDT) Readonly */}
                    {config.showCredit && (
                      <td className="py-1.5 px-2 bg-rose-500/10">
                        <input
                          type="text"
                          readOnly
                          value={(line.creditBDT || 0).toFixed(2)}
                          className="w-full h-8.5 px-2 rounded-lg bg-muted/40 border border-border/50 text-xs font-mono font-bold text-right text-muted-foreground outline-none select-none"
                        />
                      </td>
                    )}

                    {/* Remove Line */}
                    <td className="py-1.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(line.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete line"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Line Button */}
      <button
        type="button"
        onClick={handleAddLine}
        className="w-full py-2.5 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
      >
        <Plus className="size-4 stroke-[2.5]" />
        <span>Add Line ++</span>
      </button>
    </div>
  );
};
