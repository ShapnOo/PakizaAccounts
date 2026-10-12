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
import { SearchableSelect } from '../shared/SearchableSelect';
import { Plus, Trash2, Info } from 'lucide-react';
import { useCustomFields } from '../../hooks/useCustomFields';
import { CustomFieldCell } from '../shared/CustomFieldCell';

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

  // Detail-level custom fields applied across all voucher lines
  const { fields: customFields } = useCustomFields('voucher-details');

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
      (() => {
        const targetIndex = lines.findIndex((l) => l.id === id);
        if (targetIndex === -1) return lines;

        const updatedList = lines.map((l, idx) => {
          if (idx !== targetIndex) return l;
          const updated = { ...l, ...patch };

          // Mutual exclusivity on edited row if double entry
          if (config.isDoubleEntry) {
            if (patch.debit !== undefined && (patch.debit || 0) > 0) {
              updated.credit = 0;
            } else if (patch.credit !== undefined && (patch.credit || 0) > 0) {
              updated.debit = 0;
            }
          }

          // Recalculate BDT conversions
          const rate = updated.exchangeRate > 0 ? updated.exchangeRate : 1;
          if (config.showDebit && updated.debit !== undefined) {
            updated.debitBDT = Math.round(((updated.debit || 0) * rate + Number.EPSILON) * 100) / 100;
          }
          if (config.showCredit && updated.credit !== undefined) {
            updated.creditBDT = Math.round(((updated.credit || 0) * rate + Number.EPSILON) * 100) / 100;
          }

          return updated;
        });

        // 2-line auto balance for double-entry (Journal & Contra)
        if (config.isDoubleEntry && updatedList.length === 2) {
          const otherIndex = targetIndex === 0 ? 1 : 0;
          const otherLine = updatedList[otherIndex];
          const otherRate = otherLine.exchangeRate > 0 ? otherLine.exchangeRate : 1;

          if (patch.debit !== undefined) {
            const amount = patch.debit || 0;
            if (amount > 0) {
              updatedList[otherIndex] = {
                ...otherLine,
                debit: 0,
                debitBDT: 0,
                credit: amount,
                creditBDT: Math.round((amount * otherRate + Number.EPSILON) * 100) / 100,
              };
            } else if (amount === 0) {
              updatedList[otherIndex] = {
                ...otherLine,
                credit: 0,
                creditBDT: 0,
              };
            }
          } else if (patch.credit !== undefined) {
            const amount = patch.credit || 0;
            if (amount > 0) {
              updatedList[otherIndex] = {
                ...otherLine,
                credit: 0,
                creditBDT: 0,
                debit: amount,
                debitBDT: Math.round((amount * otherRate + Number.EPSILON) * 100) / 100,
              };
            } else if (amount === 0) {
              updatedList[otherIndex] = {
                ...otherLine,
                debit: 0,
                debitBDT: 0,
              };
            }
          }
        }

        return updatedList;
      })()
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
          <table className="w-full text-left text-xs border-collapse min-w-[1450px]">
            <thead className="bg-muted/40 border-b border-border/70 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-3 min-w-[260px]">Accounts Head *</th>
                <th className="py-2.5 px-2.5 min-w-[170px]">Cost Center</th>
                <th className="py-2.5 px-2.5 min-w-[180px]">Subsidiary</th>
                <th className="py-2.5 px-2.5 min-w-[170px]">Employee</th>
                <th className="py-2.5 px-2.5 min-w-[150px]">Vehicles</th>
                <th className="py-2.5 px-2 min-w-[140px]">Reference</th>
                <th className="py-2.5 px-2 min-w-[170px]">Description</th>

                {/* Dynamic Custom Field Columns (between Description and Currency) */}
                {customFields.map((cf) => (
                  <th
                    key={cf.id}
                    className="py-2.5 px-2.5 min-w-[150px] bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 border-x border-indigo-100/50 dark:border-indigo-900/30"
                  >
                    <div className="flex items-center gap-1">
                      <span>{cf.label}</span>
                      {cf.mandatory && <span className="text-rose-500 font-bold">*</span>}
                    </div>
                  </th>
                ))}

                <th className="py-2.5 px-2 min-w-[90px] text-center">Currency</th>
                <th className="py-2.5 px-2 min-w-[85px] text-right">Exc. Rate</th>

                {/* Conditional Debit / Credit Columns */}
                {config.showDebit && (
                  <th className="py-2.5 px-2.5 min-w-[125px] text-right bg-emerald-500/5">Debit</th>
                )}
                {config.showCredit && (
                  <th className="py-2.5 px-2.5 min-w-[125px] text-right bg-rose-500/5">Credit</th>
                )}
                {config.showDebit && (
                  <th className="py-2.5 px-2.5 min-w-[130px] text-right bg-emerald-500/10">Debit (BDT)</th>
                )}
                {config.showCredit && (
                  <th className="py-2.5 px-2.5 min-w-[130px] text-right bg-rose-500/10">Credit (BDT)</th>
                )}

                <th className="py-2.5 px-2 min-w-[44px] text-center"></th>
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
                      <SearchableSelect
                        value={line.costCenterId || ''}
                        onChange={(val) => handleUpdateLine(line.id, { costCenterId: val })}
                        options={COST_CENTERS.map((cc) => ({ value: cc.id, label: cc.name }))}
                        placeholder="None"
                        searchPlaceholder="Filter cost center..."
                        buttonClassName="h-8.5 rounded-lg border-border/70 text-xs"
                      />
                    </td>

                    {/* Subsidiary */}
                    <td className="py-1.5 px-2.5">
                      <SearchableSelect
                        value={line.subsidiaryId || ''}
                        onChange={(val) => handleUpdateLine(line.id, { subsidiaryId: val })}
                        options={SUBSIDIARIES.map((sub) => ({ value: sub.id, label: sub.name }))}
                        placeholder="None"
                        searchPlaceholder="Filter subsidiary..."
                        buttonClassName="h-8.5 rounded-lg border-border/70 text-xs"
                      />
                    </td>

                    {/* Employee */}
                    <td className="py-1.5 px-2.5">
                      <SearchableSelect
                        value={line.employeeId || ''}
                        onChange={(val) => handleUpdateLine(line.id, { employeeId: val })}
                        options={EMPLOYEES.map((emp) => ({
                          value: emp.id,
                          label: emp.name,
                          code: emp.code,
                        }))}
                        placeholder="None"
                        searchPlaceholder="Search by name or employee ID..."
                        buttonClassName="h-8.5 rounded-lg border-border/70 text-xs"
                      />
                    </td>

                    {/* Vehicles */}
                    <td className="py-1.5 px-2.5">
                      <SearchableSelect
                        value={line.vehicleId || ''}
                        onChange={(val) => handleUpdateLine(line.id, { vehicleId: val })}
                        options={VEHICLES.map((v) => ({ value: v.id, label: v.name }))}
                        placeholder="None"
                        searchPlaceholder="Filter vehicle..."
                        buttonClassName="h-8.5 rounded-lg border-border/70 text-xs"
                      />
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
