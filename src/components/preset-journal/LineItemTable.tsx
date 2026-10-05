import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PresetLine, VoucherType } from '../../types/presetJournal';
import { MOCK_ACCOUNTS } from '../../mock/accounts';
import { MOCK_SUBLEDGER } from '../../mock/subledger';
import { MOCK_EMPLOYEES } from '../../mock/employees';
import { MOCK_SUPPLIERS } from '../../mock/suppliers';
import { MOCK_CUSTOMERS } from '../../mock/customers';
import { MOCK_CURRENCY_SETUPS } from '../../mock/currencySetup';
import { DifferenceBadge } from './DifferenceBadge';

interface LineItemTableProps {
  voucherType: VoucherType;
  lines: PresetLine[];
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onUpdateLine: (id: string, patch: Partial<PresetLine>) => void;
  errors?: Record<string, string>;
}

export const LineItemTable: React.FC<LineItemTableProps> = ({
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
  const hasAmounts = totalDebitBDT > 0 || totalCreditBDT > 0;

  const handleLineAccountChange = (id: string, accountHeadId: string) => {
    const matched = MOCK_ACCOUNTS.find((a) => a.id === accountHeadId);
    onUpdateLine(id, {
      accountHeadId,
      accountHeadName: matched?.name || '',
    });
  };

  const handleDebitChange = (id: string, debitVal: number, line: PresetLine) => {
    const rate = line.exchangeRate || 1;
    onUpdateLine(id, {
      debit: debitVal,
      credit: 0, // Mutual exclusion
      debitBDT: debitVal * rate,
      creditBDT: 0,
    });
  };

  const handleCreditChange = (id: string, creditVal: number, line: PresetLine) => {
    const rate = line.exchangeRate || 1;
    onUpdateLine(id, {
      credit: creditVal,
      debit: 0, // Mutual exclusion
      creditBDT: creditVal * rate,
      debitBDT: 0,
    });
  };

  const handleRateChange = (id: string, exchangeRate: number, line: PresetLine) => {
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
          <thead className="bg-muted/40 border-b border-border text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground select-none">
            <tr>
              <th className="py-2.5 px-3 min-w-[200px]">Accounts Head *</th>
              <th className="py-2.5 px-2.5 min-w-[130px]">Cost Center</th>
              <th className="py-2.5 px-2.5 min-w-[140px]">Subsidiary</th>
              <th className="py-2.5 px-2.5 min-w-[130px]">Employee</th>
              <th className="py-2.5 px-2.5 min-w-[120px]">Vehicles</th>
              <th className="py-2.5 px-2.5 min-w-[110px]">Reference</th>
              <th className="py-2.5 px-2.5 min-w-[140px]">Description</th>
              <th className="py-2.5 px-2 w-20">Currency</th>
              <th className="py-2.5 px-2 w-20">Exc. Rate</th>
              {showDebit && <th className="py-2.5 px-2.5 w-28 text-right">Debit</th>}
              {showCredit && <th className="py-2.5 px-2.5 w-28 text-right">Credit</th>}
              {showDebit && <th className="py-2.5 px-2.5 w-28 text-right">Debit (BDT)</th>}
              {showCredit && <th className="py-2.5 px-2.5 w-28 text-right">Credit (BDT)</th>}
              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60 font-medium">
            {lines.map((line, idx) => (
              <tr key={line.id} className="hover:bg-muted/30 transition-colors">
                {/* 1. Accounts Head */}
                <td className="py-2 px-3">
                  <select
                    value={line.accountHeadId}
                    onChange={(e) => handleLineAccountChange(line.id, e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary truncate"
                  >
                    <option value="">Select Account Head...</option>
                    {lineAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.code} - {a.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 2. Cost Center */}
                <td className="py-2 px-2.5">
                  <select
                    value={line.costCenterId || ''}
                    onChange={(e) => onUpdateLine(line.id, { costCenterId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground truncate"
                  >
                    <option value="">None</option>
                    {costCenters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 3. Subsidiary */}
                <td className="py-2 px-2.5">
                  <select
                    value={line.subsidiaryId || ''}
                    onChange={(e) => onUpdateLine(line.id, { subsidiaryId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground truncate"
                  >
                    <option value="">None</option>
                    <optgroup label="Suppliers">
                      {MOCK_SUPPLIERS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Vendor)
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Customers">
                      {MOCK_CUSTOMERS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.customerName} (Client)
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </td>

                {/* 4. Employee */}
                <td className="py-2 px-2.5">
                  <select
                    value={line.employeeId || ''}
                    onChange={(e) => onUpdateLine(line.id, { employeeId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground truncate"
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
                <td className="py-2 px-2.5">
                  <select
                    value={line.vehicleId || ''}
                    onChange={(e) => onUpdateLine(line.id, { vehicleId: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground truncate"
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
                <td className="py-2 px-2.5">
                  <input
                    type="text"
                    placeholder="Ref #"
                    value={line.reference || ''}
                    onChange={(e) => onUpdateLine(line.id, { reference: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </td>

                {/* 7. Description */}
                <td className="py-2 px-2.5">
                  <input
                    type="text"
                    placeholder="Note..."
                    value={line.description || ''}
                    onChange={(e) => onUpdateLine(line.id, { description: e.target.value })}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                </td>

                {/* 8. Currency */}
                <td className="py-2 px-2">
                  <select
                    value={line.currency}
                    onChange={(e) => {
                      const cur = e.target.value;
                      const rateMap: Record<string, number> = {
                        BDT: 1,
                        USD: 120.4,
                        EUR: 132.8,
                        GBP: 163.24,
                      };
                      const rate = rateMap[cur] || 1;
                      onUpdateLine(line.id, {
                        currency: cur,
                        exchangeRate: rate,
                        debitBDT: (line.debit || 0) * rate,
                        creditBDT: (line.credit || 0) * rate,
                      });
                    }}
                    className="w-full h-8 px-1.5 rounded-lg border border-border bg-card text-xs font-mono font-bold text-foreground"
                  >
                    <option value="BDT">BDT</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </td>

                {/* 9. Exc. Rate */}
                <td className="py-2 px-2">
                  <input
                    type="number"
                    disabled={line.currency === 'BDT'}
                    value={line.exchangeRate}
                    onChange={(e) =>
                      handleRateChange(line.id, parseFloat(e.target.value) || 1, line)
                    }
                    className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs font-mono text-right text-foreground disabled:opacity-50"
                  />
                </td>

                {/* 10. Debit */}
                {showDebit && (
                  <td className="py-2 px-2.5">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={line.debit || ''}
                      onChange={(e) =>
                        handleDebitChange(line.id, parseFloat(e.target.value) || 0, line)
                      }
                      className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs font-mono font-bold text-right text-foreground focus:ring-1 focus:ring-primary"
                    />
                  </td>
                )}

                {/* 11. Credit */}
                {showCredit && (
                  <td className="py-2 px-2.5">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={line.credit || ''}
                      onChange={(e) =>
                        handleCreditChange(line.id, parseFloat(e.target.value) || 0, line)
                      }
                      className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs font-mono font-bold text-right text-foreground focus:ring-1 focus:ring-primary"
                    />
                  </td>
                )}

                {/* 12. Debit (BDT) */}
                {showDebit && (
                  <td className="py-2 px-2.5">
                    <input
                      type="number"
                      readOnly={line.currency !== 'BDT'}
                      value={line.debitBDT || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onUpdateLine(line.id, {
                          debitBDT: val,
                          debit: val,
                          credit: 0,
                          creditBDT: 0,
                        });
                      }}
                      className="w-full h-8 px-2 rounded-lg border border-border bg-muted/40 text-xs font-mono font-bold text-right text-foreground read-only:cursor-default"
                    />
                  </td>
                )}

                {/* 13. Credit (BDT) */}
                {showCredit && (
                  <td className="py-2 px-2.5">
                    <input
                      type="number"
                      readOnly={line.currency !== 'BDT'}
                      value={line.creditBDT || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onUpdateLine(line.id, {
                          creditBDT: val,
                          credit: val,
                          debit: 0,
                          debitBDT: 0,
                        });
                      }}
                      className="w-full h-8 px-2 rounded-lg border border-border bg-muted/40 text-xs font-mono font-bold text-right text-foreground read-only:cursor-default"
                    />
                  </td>
                )}

                {/* Delete */}
                <td className="py-2 px-2 text-center">
                  <button
                    type="button"
                    disabled={lines.length <= (voucherType === 'Journal' || voucherType === 'Contra' ? 2 : 1)}
                    onClick={() => onRemoveLine(line.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full-width dashed "Add Line ++" button */}
      <div className="p-3 bg-muted/20 border-t border-border/80">
        <button
          type="button"
          onClick={onAddLine}
          className="w-full py-2.5 rounded-xl border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Plus className="size-4" />
          <span>Add Line ++</span>
        </button>
      </div>

      {/* Totals & Difference Footer */}
      <div className="p-4 bg-muted/30 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showDifference && (
            <DifferenceBadge difference={difference} hasAmounts={hasAmounts} />
          )}
          <span className="text-xs text-muted-foreground">
            {lines.length} total lines configured
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          {showDebit && (
            <div className="text-right">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                Total Debit (BDT)
              </span>
              <span className="text-sm font-black text-foreground">
                ৳ {totalDebitBDT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {showCredit && (
            <div className="text-right">
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                Total Credit (BDT)
              </span>
              <span className="text-sm font-black text-foreground">
                ৳ {totalCreditBDT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
