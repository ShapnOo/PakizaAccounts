import React, { useState } from 'react';
import { CustomField, CustomFieldContext, CONTEXT_CONFIG } from '../../types/customField';
import { CustomFieldCell } from '../shared/CustomFieldCell';
import { Eye, X, Receipt, CheckCircle2 } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: CustomFieldContext;
  fields: CustomField[];
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  context,
  fields,
}) => {
  const [sampleValues, setSampleValues] = useState<Record<string, any>>({
    'cf-1': 'INV-2026-0889',
    'cf-2': 'CHQ-990142',
    'cf-3': 'PO-7721',
  });

  if (!isOpen) return null;

  const activeFields = fields
    .filter((f) => f.context === context && f.activeStatus === 'Active')
    .sort((a, b) => a.order - b.order);

  const contextConfig = CONTEXT_CONFIG[context];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 grid place-items-center">
              <Eye className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Entry Form Live Preview</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {contextConfig.label}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                How active custom fields flow into this module's line-item table as live columns.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body / Table */}
        <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto sidebar-scroll">
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
              <CheckCircle2 className="size-4 text-indigo-600 shrink-0" />
              <span>
                <strong>{activeFields.length} active custom {activeFields.length === 1 ? 'column' : 'columns'}</strong>{' '}
                inserted between <em>Description</em> and <em>Currency</em>.
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Try typing into the inputs below to test interaction
            </span>
          </div>

          <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
            <div className="overflow-x-auto sidebar-scroll">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/50 border-b border-border text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  <tr>
                    <th className="py-2.5 px-3 min-w-[180px]">Accounts Head</th>
                    <th className="py-2.5 px-2.5 min-w-[120px]">Cost Center</th>
                    <th className="py-2.5 px-2.5 min-w-[140px]">Description</th>

                    {/* Dynamic Custom Field Columns */}
                    {activeFields.map((cf) => (
                      <th
                        key={cf.id}
                        className="py-2.5 px-2.5 min-w-[150px] bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 border-x border-indigo-100 dark:border-indigo-900/40"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{cf.label}</span>
                          {cf.mandatory && <span className="text-rose-500 font-bold">*</span>}
                        </div>
                      </th>
                    ))}

                    <th className="py-2.5 px-2 w-20">Currency</th>
                    <th className="py-2.5 px-3 w-28 text-right bg-emerald-500/5">Debit</th>
                    <th className="py-2.5 px-3 w-28 text-right bg-rose-500/5">Credit</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {/* Row 1 */}
                  <tr className="hover:bg-muted/15 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-foreground">
                        Petty Cash In Hand
                      </span>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        10-100-001
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-muted-foreground">
                      Dhaka HQ
                    </td>
                    <td className="py-2.5 px-2.5 text-muted-foreground">
                      Office logistics
                    </td>

                    {/* Custom Field Cells */}
                    {activeFields.map((cf) => (
                      <td
                        key={cf.id}
                        className="py-2 px-2.5 bg-indigo-50/20 dark:bg-indigo-950/10 border-x border-indigo-100/60 dark:border-indigo-900/30"
                      >
                        <CustomFieldCell
                          field={cf}
                          value={sampleValues[cf.id] ?? cf.defaultValue}
                          onChange={(val) =>
                            setSampleValues((prev) => ({
                              ...prev,
                              [cf.id]: val,
                            }))
                          }
                        />
                      </td>
                    ))}

                    <td className="py-2.5 px-2 font-mono text-muted-foreground">
                      BDT
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600">
                      15,000.00
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                      -
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-muted/15 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-foreground">
                        Stationery & Supplies Expense
                      </span>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        50-200-015
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-muted-foreground">
                      Dhaka HQ
                    </td>
                    <td className="py-2.5 px-2.5 text-muted-foreground">
                      Paper & Cartridges
                    </td>

                    {/* Custom Field Cells */}
                    {activeFields.map((cf) => (
                      <td
                        key={cf.id}
                        className="py-2 px-2.5 bg-indigo-50/20 dark:bg-indigo-950/10 border-x border-indigo-100/60 dark:border-indigo-900/30"
                      >
                        <CustomFieldCell
                          field={cf}
                          value={sampleValues[`${cf.id}_2`] ?? cf.defaultValue}
                          onChange={(val) =>
                            setSampleValues((prev) => ({
                              ...prev,
                              [`${cf.id}_2`]: val,
                            }))
                          }
                        />
                      </td>
                    ))}

                    <td className="py-2.5 px-2 font-mono text-muted-foreground">
                      BDT
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                      -
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-600">
                      15,000.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/20 border-t border-border/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
};
