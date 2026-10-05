import React from 'react';
import { Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { RecurringLine, VoucherType } from '../../types/recurringJournal';
import { MOCK_ACCOUNTS } from '../../mock/accounts';
import { MOCK_SUBLEDGER } from '../../mock/subledger';
import { MOCK_EMPLOYEES } from '../../mock/employees';
import { MOCK_SUPPLIERS } from '../../mock/suppliers';
import { MOCK_CUSTOMERS } from '../../mock/customers';
import { MOCK_CURRENCY_SETUPS } from '../../mock/currencySetup';

interface RecurringLineTableProps {
  voucherType: VoucherType;
  lines: RecurringLine[];
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onUpdateLine: (id: string, patch: Partial<RecurringLine>) => void;
  errors?: Record<string, string>;
}

export const RecurringLineTable: React.FC<RecurringLineTableProps> = ({
  voucherType,
  lines,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
  errors = {},
}) => {
  const costCenters = MOCK_SUBLEDGER.filter((s) => s.type === 'cost-center');
  const vehicles = MOCK_SUBLEDGER.filter((s) => s.type === 'vehicle');

  const lineAccounts =
    voucherType === 'Contra'
      ? MOCK_ACCOUNTS.filter(
          (a) =>
            a.name.toLowerCase().includes('bank') ||
            a.name.toLowerCase().includes('cash')
        )
      : MOCK_ACCOUNTS;

  // Visibility flags based on voucher type
  const showDebit = voucherType !== 'Receive';
  const showCredit = voucherType !== 'Payment';
  const showDifference = voucherType === 'Journal' || voucherType === 'Contra';

  // Compute Totals
  const totalDebitBDT = lines.reduce((s, l) => s + (l.debitBDT || 0), 0);
  const totalCreditBDT = lines.reduce((s, l) => s + (l.creditBDT || 0), 0);
  const difference = totalDebitBDT - totalCreditBDT;
  const isBalanced =
    Math.abs(difference) <= 0.01 && (totalDebitBDT > 0 || totalCreditBDT > 0);

  const handleLineAccountChange = (id: string, accountHeadId: string) => {
    const matched = MOCK_ACCOUNTS.find((a) => a.id === accountHeadId);
    onUpdateLine(id, {
      accountHeadId,
      accountHeadName: matched?.name || '',
    });
  };

  const handleDebitChange = (id: string, debitVal: number, line: RecurringLine) => {
    const rate = line.exchangeRate || 1;
    onUpdateLine(id, {
      debit: debitVal,
      credit: 0, // Mutual exclusion
      debitBDT: debitVal * rate,
      creditBDT: 0,
    });
  };

  const handleCreditChange = (id: string, creditVal: number, line: RecurringLine) => {
    const rate = line.exchangeRate || 1;
    onUpdateLine(id, {
      credit: creditVal,
      debit: 0, // Mutual exclusion
      creditBDT: creditVal * rate,
      debitBDT: 0,
    });
  };

  const handleRateChange = (id: string, exchangeRate: number, line: RecurringLine) => {
    onUpdateLine(id, {
      exchangeRate,
      debitBDT: (line.debit || 0) * exchangeRate,
      creditBDT: (line.credit || 0) * exchangeRate,
    });
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs space-y-0">
      <div className="p-4 border-b border-border/80 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
            2. Journal Lines ({lines.length})
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure line items with accounts, subledgers, and balanced debits/credits
          </p>
        </div>
      </div>

      <div className="overflow-x-auto sidebar-scroll">
        <table className="w-full text-left text-xs border-collapse min-w-[1250px]">
          <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-2.5 px-3 min-w-[220px]">Accounts Head *</th>
              <th className="py-2.5 px-3 min-w-[140px]">Cost Center</th>
              <th className="py-2.5 px-3 min-w-[160px]">Subsidiary</th>
              <th className="py-2.5 px-3 min-w-[140px]">Employee</th>
              <th className="py-2.5 px-3 min-w-[130px]">Vehicles</th>
              <th className="py-2.5 px-3 min-w-[110px]">Reference</th>
              <th className="py-2.5 px-3 min-w-[150px]">Description</th>
              <th className="py-2.5 px-2 w-20 text-center">Curr.</th>
              <th className="py-2.5 px-2 w-20 text-center">Rate</th>

              {showDebit && (
                <th className="py-2.5 px-3 w-28 text-right bg-indigo-500/5">Debit</th>
              )}
              {showCredit && (
                <th className="py-2.5 px-3 w-28 text-right bg-emerald-500/5">Credit</th>
              )}
              {showDebit && (
                <th className="py-2.5 px-3 w-28 text-right bg-indigo-500/10">Debit (BDT)</th>
              )}
              {showCredit && (
                <th className="py-2.5 px-3 w-28 text-right bg-emerald-500/10">Credit (BDT)</th>
              )}

              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {lines.map((line, idx) => (
              <tr key={line.id} className="hover:bg-muted/20 transition-colors">
                {/* 1. Accounts Head */}
                <td className="py-2 px-2.5">
                  <select
                    value={line.accountHeadId}
                    onChange={(e) => handleLineAccountChange(line.id, e.target.value)}
                    className={`w-full h-8 px-2 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary ${
                      errors[`line_${idx}_account`] ? 'border-rose-400' : 'border-border'
                    }`}
                  >
                    <option value="">Select Account Head...</option>
                    {lineAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.code ? `${a.code} - ` : ''}
                        {a.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 2. Cost Center */}
                <td className="py-2 px-2">
                  <select
                    value={line.costCenterId || ''}
                    onChange={(e) => onUpdateLine(line.id, { costCenterId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">None</option>
                    {costCenters.map((cc) => (
                      <option key={cc.id} value={cc.id}>
                        {cc.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 3. Subsidiary */}
                <td className="py-2 px-2">
                  <select
                    value={line.subsidiaryId || ''}
                    onChange={(e) => onUpdateLine(line.id, { subsidiaryId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">None</option>
                    <optgroup label="Suppliers / Vendors">
                      {MOCK_SUPPLIERS.map((s) => (
                        <option key={s.id} value={s.id}>
                          [Vendor] {s.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Customers / Buyers">
                      {MOCK_CUSTOMERS.map((c) => (
                        <option key={c.id} value={c.id}>
                          [Customer] {c.customerName}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </td>

                {/* 4. Employee */}
                <td className="py-2 px-2">
                  <select
                    value={line.employeeId || ''}
                    onChange={(e) => onUpdateLine(line.id, { employeeId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">None</option>
                    {MOCK_EMPLOYEES.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.designation})
                      </option>
                    ))}
                  </select>
                </td>

                {/* 5. Vehicles */}
                <td className="py-2 px-2">
                  <select
                    value={line.vehicleId || ''}
                    onChange={(e) => onUpdateLine(line.id, { vehicleId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">None</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 6. Reference */}
                <td className="py-2 px-2">
                  <input
                    type="text"
                    placeholder="Ref #"
                    value={line.reference || ''}
                    onChange={(e) => onUpdateLine(line.id, { reference: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>

                {/* 7. Description */}
                <td className="py-2 px-2">
                  <input
                    type="text"
                    placeholder="Line description..."
                    value={line.description || ''}
                    onChange={(e) => onUpdateLine(line.id, { description: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>

                {/* 8. Currency */}
                <td className="py-2 px-1 text-center">
                  <select
                    value={line.currency}
                    onChange={(e) => onUpdateLine(line.id, { currency: e.target.value })}
                    className="h-8 px-1.5 rounded-lg border border-border bg-background text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                  >
                    {MOCK_CURRENCY_SETUPS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 9. Exchange Rate */}
                <td className="py-2 px-1 text-center">
                  <input
                    type="number"
                    step="any"
                    min={0.0001}
                    value={line.exchangeRate || 1}
                    onChange={(e) =>
                      handleRateChange(line.id, parseFloat(e.target.value) || 1, line)
                    }
                    className="w-16 h-8 px-1 text-center rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>

                {/* 10. Debit */}
                {showDebit && (
                  <td className="py-2 px-2 bg-indigo-500/5">
                    <input
                      type="number"
                      step="any"
                      min={0}
                      value={line.debit || ''}
                      onChange={(e) =>
                        handleDebitChange(line.id, parseFloat(e.target.value) || 0, line)
                      }
                      placeholder="0.00"
                      className="w-full h-8 px-2 text-right rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                )}

                {/* 11. Credit */}
                {showCredit && (
                  <td className="py-2 px-2 bg-emerald-500/5">
                    <input
                      type="number"
                      step="any"
                      min={0}
                      value={line.credit || ''}
                      onChange={(e) =>
                        handleCreditChange(line.id, parseFloat(e.target.value) || 0, line)
                      }
                      placeholder="0.00"
                      className="w-full h-8 px-2 text-right rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>
                )}

                {/* 12. Debit BDT (Read-only) */}
                {showDebit && (
                  <td className="py-2 px-2 text-right font-mono font-bold text-xs text-foreground bg-indigo-500/10">
                    ৳ {(line.debitBDT || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                )}

                {/* 13. Credit BDT (Read-only) */}
                {showCredit && (
                  <td className="py-2 px-2 text-right font-mono font-bold text-xs text-foreground bg-emerald-500/10">
                    ৳ {(line.creditBDT || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                )}

                {/* Remove Action */}
                <td className="py-2 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveLine(line.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove Line"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer Totals & Difference */}
          <tfoot className="bg-muted/30 border-t-2 border-border/80 font-bold text-xs">
            <tr>
              <td colSpan={9} className="py-3 px-4 text-right uppercase tracking-wider text-muted-foreground">
                Total:
              </td>

              {showDebit && (
                <td className="py-3 px-2 text-right font-mono font-black text-foreground bg-indigo-500/5">
                  ৳ {totalDebitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              )}

              {showCredit && (
                <td className="py-3 px-2 text-right font-mono font-black text-foreground bg-emerald-500/5">
                  ৳ {totalCreditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              )}

              {showDebit && (
                <td className="py-3 px-2 text-right font-mono font-black text-indigo-700 dark:text-indigo-300 bg-indigo-500/15">
                  ৳ {totalDebitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              )}

              {showCredit && (
                <td className="py-3 px-2 text-right font-mono font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/15">
                  ৳ {totalCreditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              )}

              <td></td>
            </tr>

            {/* Double-Entry Difference Row */}
            {showDifference && (
              <tr className="bg-muted/50 border-t border-border/60">
                <td colSpan={9} className="py-2.5 px-4 text-right text-xs font-bold text-muted-foreground">
                  Difference (Debit BDT − Credit BDT):
                </td>
                <td colSpan={5} className="py-2.5 px-4 text-right">
                  {isBalanced ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      <Check className="size-3.5 stroke-[3]" />
                      <span>Balanced ✓</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/15 text-rose-600 border border-rose-500/30">
                      <AlertCircle className="size-3.5" />
                      <span>
                        Difference: ৳ {difference > 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)}
                      </span>
                    </span>
                  )}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>

      {/* Add Line ++ Button */}
      <div className="p-3 bg-muted/20 border-t border-border">
        <button
          type="button"
          onClick={onAddLine}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary/60 hover:bg-muted/40 text-xs font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Add Line ++</span>
        </button>
      </div>
    </div>
  );
};
