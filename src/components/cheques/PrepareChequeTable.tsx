import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Lock,
  Calendar,
  User,
  Building2,
  DollarSign,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  SourceType,
  ChequeType,
  ChequeFor,
  PrepareLine,
  CHEQUE_TYPES,
  CHEQUE_FOR,
} from '../../types/chequePrepare';
import { ChequeBook, ChequeEntry } from '../../types/cheque';
import { availableCheques } from '../../lib/chequeNoFilter';
import { INITIAL_ACCOUNTS } from '../../mock/accounts';
import { ColumnTogglePopover, ColumnVisibilityState } from './ColumnTogglePopover';
import { listSuppliers, listEmployees, listCustomers } from '../../services/mastersService';
import { Supplier } from '../../mock/suppliers';
import { Employee } from '../../mock/employees';
import { Customer } from '../../mock/customers';

interface PrepareChequeTableProps {
  sourceType: SourceType;
  book: ChequeBook | null;
  lines: PrepareLine[];
  onLinesChange: (lines: PrepareLine[]) => void;
  columns: ColumnVisibilityState;
  onColumnsChange: (cols: ColumnVisibilityState) => void;
  isAmountLocked?: boolean;
  errors?: Record<string, string | undefined>;
}

export const PrepareChequeTable: React.FC<PrepareChequeTableProps> = ({
  sourceType,
  book,
  lines,
  onLinesChange,
  columns,
  onColumnsChange,
  isAmountLocked = false,
  errors = {},
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    listSuppliers().then(setSuppliers);
    listEmployees().then(setEmployees);
    listCustomers().then(setCustomers);
  }, []);

  const isDirect = sourceType === 'direct';

  // Available cheques in the selected book
  const allAvailableCheques = availableCheques(book, book?.enforceBySerial ?? false);
  const enforceBySerial = book?.enforceBySerial ?? false;
  const lowestSl = allAvailableCheques.length > 0 ? allAvailableCheques[0].sl : 0;

  // Leaf accounts for GL selection
  const selectableGlAccounts = INITIAL_ACCOUNTS.filter(
    (a) => !a.isParent || !a.children || a.children.length === 0
  );

  // Add line (Direct only)
  const handleAddLine = () => {
    if (lines.length >= 50) return;
    const newLine: PrepareLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      chequeType: 'AC Payee',
      chequeNo: '',
      chequeDate: new Date().toISOString().split('T')[0],
      payTo: '',
      chequeFor: 'Supplier',
      name: '',
      glAccountId: 'acc-02-01-01-01',
      amount: 0,
    };
    onLinesChange([...lines, newLine]);
  };

  // Remove line
  const handleRemoveLine = (idx: number) => {
    if (lines.length <= 1) return;
    const updated = lines.filter((_, i) => i !== idx);
    onLinesChange(updated);
  };

  // Update specific line field
  const handleUpdateLine = (idx: number, patch: Partial<PrepareLine>) => {
    const updated = lines.map((l, i) => {
      if (i === idx) {
        const next = { ...l, ...patch };
        // Auto-suggest payTo if name changes and payTo is empty or equal to previous name
        if (patch.name !== undefined) {
          if (!l.payTo || l.payTo === l.name) {
            next.payTo = patch.name;
          }
        }
        return next;
      }
      return l;
    });
    onLinesChange(updated);
  };

  // Calculate total amount
  const totalAmount = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

  // Selected cheque numbers in other rows to prevent duplicate selection
  const getSelectedChequesInOtherRows = (currentIdx: number) => {
    const set = new Set<string>();
    lines.forEach((l, i) => {
      if (i !== currentIdx && l.chequeNo) {
        set.add(l.chequeNo);
      }
    });
    return set;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-2xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <CreditCard className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Prepare Cheque {isDirect ? '(Multi-Line)' : '(Single Cheque)'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Assign cheque leaf, payee, debit GL head, and clearing type
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Column Toggle Popover (N.B. #1) */}
          <ColumnTogglePopover
            sourceType={sourceType}
            columns={columns}
            onChange={onColumnsChange}
          />

          {/* Add Line Button (Direct Only - RULE CP1) */}
          {isDirect && (
            <button
              type="button"
              onClick={handleAddLine}
              disabled={lines.length >= 50}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-dashed border-primary/60 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>Add Line</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-border/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/60 dark:bg-muted/30 border-b border-border/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">#</th>

              {columns.chequeType && <th className="py-2.5 px-3 min-w-[120px]">Cheque Type</th>}

              <th className="py-2.5 px-3 min-w-[160px]">
                <div className="flex items-center gap-1">
                  <span>Cheque No</span>
                  {enforceBySerial && (
                    <span title="Serial Enforcement Active" className="inline-flex">
                      <Lock className="size-3 text-amber-500" />
                    </span>
                  )}
                  <span className="text-rose-500">*</span>
                </div>
              </th>

              {columns.chequeDate && (
                <th className="py-2.5 px-3 min-w-[130px]">
                  <span>Cheque Date</span> <span className="text-rose-500">*</span>
                </th>
              )}

              {columns.payTo && (
                <th className="py-2.5 px-3 min-w-[160px]">
                  <span>Pay to</span> <span className="text-rose-500">*</span>
                </th>
              )}

              {isDirect && columns.chequeFor && (
                <th className="py-2.5 px-3 min-w-[130px]">
                  <span>Cheque for</span> <span className="text-rose-500">*</span>
                </th>
              )}

              {isDirect && columns.name && (
                <th className="py-2.5 px-3 min-w-[160px]">
                  <span>Name</span> <span className="text-rose-500">*</span>
                </th>
              )}

              {columns.glAccountId && (
                <th className="py-2.5 px-3 min-w-[180px]">
                  <span>GL Account</span> <span className="text-rose-500">*</span>
                </th>
              )}

              <th className="py-2.5 px-3 min-w-[130px] text-right">
                <span>DR. Amount (৳)</span> <span className="text-rose-500">*</span>
              </th>

              {isDirect && <th className="py-2.5 px-3 w-12 text-center">Act</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {lines.map((line, idx) => {
              const otherSelected = getSelectedChequesInOtherRows(idx);

              return (
                <tr
                  key={line.id || idx}
                  className="hover:bg-muted/20 transition-colors group bg-card"
                >
                  {/* Row Number */}
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-muted-foreground/80">
                    {idx + 1}
                  </td>

                  {/* 1. Cheque Type */}
                  {columns.chequeType && (
                    <td className="py-2 px-2">
                      <select
                        value={line.chequeType}
                        onChange={(e) =>
                          handleUpdateLine(idx, { chequeType: e.target.value as ChequeType })
                        }
                        className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                      >
                        {CHEQUE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}

                  {/* 2. Cheque No (Combobox with serial enforcement) */}
                  <td className="py-2 px-2">
                    <select
                      value={line.chequeNo}
                      onChange={(e) => handleUpdateLine(idx, { chequeNo: e.target.value })}
                      disabled={!book || allAvailableCheques.length === 0}
                      className={`w-full h-8 px-2 rounded-md border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
                        !book || allAvailableCheques.length === 0
                          ? 'bg-muted/40 text-muted-foreground'
                          : ''
                      } ${errors[`lines.${idx}.chequeNo`] ? 'border-rose-400' : 'border-border/80'}`}
                    >
                      <option value="">
                        {!book
                          ? '-- Select Book First --'
                          : allAvailableCheques.length === 0
                          ? '-- No Cheques Available --'
                          : '-- Select Cheque Leaf --'}
                      </option>
                      {allAvailableCheques.map((c) => {
                        const isLocked = enforceBySerial && c.sl > lowestSl;
                        const isUsedInOtherRow = otherSelected.has(c.chequeNo);
                        const disabled = (isLocked && c.chequeNo !== line.chequeNo) || isUsedInOtherRow;

                        return (
                          <option
                            key={c.id}
                            value={c.chequeNo}
                            disabled={disabled}
                          >
                            {c.chequeNo} (SL: {c.sl})
                            {isLocked ? ' 🔒 Locked (Serial)' : ''}
                            {isUsedInOtherRow ? ' (Selected in another line)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </td>

                  {/* 3. Cheque Date */}
                  {columns.chequeDate && (
                    <td className="py-2 px-2">
                      <input
                        type="date"
                        value={line.chequeDate}
                        onChange={(e) => handleUpdateLine(idx, { chequeDate: e.target.value })}
                        className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </td>
                  )}

                  {/* 4. Pay to */}
                  {columns.payTo && (
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        placeholder="Payee / Bearer name"
                        value={line.payTo}
                        onChange={(e) => handleUpdateLine(idx, { payTo: e.target.value })}
                        className={`w-full h-8 px-2.5 rounded-md border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs ${
                          errors[`lines.${idx}.payTo`] ? 'border-rose-400' : 'border-border/80'
                        }`}
                      />
                    </td>
                  )}

                  {/* 5. Cheque for (Direct only) */}
                  {isDirect && columns.chequeFor && (
                    <td className="py-2 px-2">
                      <select
                        value={line.chequeFor || 'Supplier'}
                        onChange={(e) => {
                          const nextFor = e.target.value as ChequeFor;
                          handleUpdateLine(idx, { chequeFor: nextFor, name: '' });
                        }}
                        className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                      >
                        {CHEQUE_FOR.map((cf) => (
                          <option key={cf} value={cf}>
                            {cf}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}

                  {/* 6. Name (Direct only - dynamic combobox based on Cheque for) */}
                  {isDirect && columns.name && (
                    <td className="py-2 px-2">
                      {line.chequeFor === 'Supplier' ? (
                        <select
                          value={line.name || ''}
                          onChange={(e) => handleUpdateLine(idx, { name: e.target.value })}
                          className={`w-full h-8 px-2 rounded-md border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
                            errors[`lines.${idx}.name`] ? 'border-rose-400' : 'border-border/80'
                          }`}
                        >
                          <option value="">-- Select Supplier --</option>
                          {suppliers.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : line.chequeFor === 'Employee' ? (
                        <select
                          value={line.name || ''}
                          onChange={(e) => handleUpdateLine(idx, { name: e.target.value })}
                          className={`w-full h-8 px-2 rounded-md border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
                            errors[`lines.${idx}.name`] ? 'border-rose-400' : 'border-border/80'
                          }`}
                        >
                          <option value="">-- Select Employee --</option>
                          {employees.map((em) => (
                            <option key={em.id} value={em.name}>
                              {em.name}
                            </option>
                          ))}
                        </select>
                      ) : line.chequeFor === 'Customer' ? (
                        <select
                          value={line.name || ''}
                          onChange={(e) => handleUpdateLine(idx, { name: e.target.value })}
                          className={`w-full h-8 px-2 rounded-md border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
                            errors[`lines.${idx}.name`] ? 'border-rose-400' : 'border-border/80'
                          }`}
                        >
                          <option value="">-- Select Customer --</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter Party Name"
                          value={line.name || ''}
                          onChange={(e) => handleUpdateLine(idx, { name: e.target.value })}
                          className={`w-full h-8 px-2.5 rounded-md border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs ${
                            errors[`lines.${idx}.name`] ? 'border-rose-400' : 'border-border/80'
                          }`}
                        />
                      )}
                    </td>
                  )}

                  {/* 7. GL Account */}
                  {columns.glAccountId && (
                    <td className="py-2 px-2">
                      <select
                        value={line.glAccountId}
                        onChange={(e) => handleUpdateLine(idx, { glAccountId: e.target.value })}
                        className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                      >
                        <option value="">-- Select GL Account --</option>
                        {selectableGlAccounts.map((gl) => (
                          <option key={gl.id} value={gl.id}>
                            {gl.code} — {gl.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}

                  {/* 8. DR. Amount */}
                  <td className="py-2 px-2 text-right">
                    <input
                      type="number"
                      min={0.01}
                      step="any"
                      readOnly={isAmountLocked}
                      value={line.amount || ''}
                      onChange={(e) =>
                        handleUpdateLine(idx, { amount: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                      className={`w-full h-8 px-2.5 rounded-md border text-xs font-mono font-bold text-right outline-none shadow-2xs ${
                        isAmountLocked
                          ? 'bg-muted/40 border-border/80 text-foreground cursor-not-allowed'
                          : 'bg-background border-border/80 text-foreground focus:ring-1 focus:ring-primary'
                      } ${errors[`lines.${idx}.amount`] ? 'border-rose-400' : ''}`}
                    />
                  </td>

                  {/* 9. Actions (Direct only) */}
                  {isDirect && (
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        disabled={lines.length <= 1}
                        title={lines.length <= 1 ? 'Minimum 1 line required' : 'Remove line'}
                        className={`size-7 rounded-md grid place-items-center transition-all ${
                          lines.length <= 1
                            ? 'text-muted-foreground/30 cursor-not-allowed'
                            : 'text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer'
                        }`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-muted/40 border-t border-border/80 font-bold text-xs">
              <td colSpan={2} className="py-2.5 px-3 text-muted-foreground">
                Total ({lines.length} {lines.length === 1 ? 'Cheque Line' : 'Cheque Lines'})
              </td>
              <td colSpan={isDirect ? 6 : 4} className="py-2.5 px-3 text-right text-muted-foreground">
                Total DR. Amount:
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-black text-primary text-sm">
                ৳ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              {isDirect && <td className="py-2.5 px-3"></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export const PrepareChequeBlock = PrepareChequeTable;
