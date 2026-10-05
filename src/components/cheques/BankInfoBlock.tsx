import React, { useEffect, useState } from 'react';
import { Landmark, BookOpen, Users, Building2, Check } from 'lucide-react';
import { SourceType, ChequeFor, ChequeBook } from '../../types/cheque';
import { SourceTypeChip } from './SourceTypeChip';
import { CoaBankAccount, MOCK_COA_BANK_ACCOUNTS } from '../../mock/coaBankAccounts';
import { listSuppliers, listEmployees, listCustomers } from '../../services/mastersService';
import { Supplier } from '../../mock/suppliers';
import { Employee } from '../../mock/employees';
import { Customer } from '../../mock/customers';

interface BankInfoBlockProps {
  sourceType: SourceType;
  accountsBankId: string;
  bankName: string;
  bookId: string;
  chequeFor?: ChequeFor;
  partyName?: string;
  books: ChequeBook[];
  onAccountChange: (acc: CoaBankAccount | null) => void;
  onBookChange: (bookId: string) => void;
  onChequeForChange?: (cFor: ChequeFor) => void;
  onPartyNameChange?: (name: string, extra?: { supplierId?: string; employeeId?: string }) => void;
  errors?: Record<string, string | undefined>;
}

export const BankInfoBlock: React.FC<BankInfoBlockProps> = ({
  sourceType,
  accountsBankId,
  bankName,
  bookId,
  chequeFor = sourceType === 'iou' ? 'Employee' : 'Supplier',
  partyName = '',
  books,
  onAccountChange,
  onBookChange,
  onChequeForChange,
  onPartyNameChange,
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

  // Filter books matching selected bank account
  const matchingBooks = accountsBankId
    ? books.filter((b) => b.accountsBankId === accountsBankId)
    : books;

  const isBillOrIou = sourceType === 'bill' || sourceType === 'iou';

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Landmark className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Bank & Source Information
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Select disbursement bank account, cheque leaf book, and payment reference
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground">Source:</span>
          <SourceTypeChip type={sourceType} />
        </div>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Accounts (Bank) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <span>Accounts (Bank)</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <select
            value={accountsBankId}
            onChange={(e) => {
              const sel = MOCK_COA_BANK_ACCOUNTS.find((a) => a.id === e.target.value) || null;
              onAccountChange(sel);
            }}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
              errors.accountsBankId ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          >
            <option value="">-- Select Bank Account --</option>
            {MOCK_COA_BANK_ACCOUNTS.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountName} ({acc.bankName})
              </option>
            ))}
          </select>
          {errors.accountsBankId && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.accountsBankId}</p>
          )}
        </div>

        {/* 2. Bank Name (Auto-populated readonly) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Bank Name</label>
          <input
            type="text"
            readOnly
            value={bankName || 'Auto-populated from account'}
            className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-bold text-foreground outline-none shadow-2xs cursor-not-allowed"
          />
        </div>

        {/* 3. Book Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <span>Book Name</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <select
            value={bookId}
            onChange={(e) => onBookChange(e.target.value)}
            disabled={matchingBooks.length === 0}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
              matchingBooks.length === 0 ? 'bg-muted/40 text-muted-foreground' : ''
            } ${errors.chequeBookId || errors.bookName ? 'border-rose-400 focus:ring-rose-500' : 'border-border'}`}
          >
            <option value="">
              {matchingBooks.length === 0
                ? '-- No active books found --'
                : '-- Select Cheque Book --'}
            </option>
            {matchingBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bookName} ({b.cheques.filter((c) => !c.used && !c.isInactive).length} available)
              </option>
            ))}
          </select>
          {(errors.chequeBookId || errors.bookName) && (
            <p className="text-[11px] text-rose-500 font-medium">
              {errors.chequeBookId || errors.bookName}
            </p>
          )}
        </div>

        {/* 4. For Bill / IOU: Name Party Picker */}
        {isBillOrIou ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>{sourceType === 'bill' ? 'Supplier Name' : 'Employee Name'}</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[10px] font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10">
                {chequeFor}
              </span>
            </div>

            {sourceType === 'bill' ? (
              <select
                value={partyName}
                onChange={(e) => {
                  const selName = e.target.value;
                  const sup = suppliers.find((s) => s.name === selName);
                  onPartyNameChange?.(selName, { supplierId: sup?.id });
                }}
                className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
                  errors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
                }`}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={partyName}
                onChange={(e) => {
                  const selName = e.target.value;
                  const emp = employees.find((em) => em.name === selName);
                  onPartyNameChange?.(selName, { employeeId: emp?.id });
                }}
                className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
                  errors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
                }`}
              >
                <option value="">-- Select Employee --</option>
                {employees.map((em) => (
                  <option key={em.id} value={em.name}>
                    {em.name}
                  </option>
                ))}
              </select>
            )}

            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Disbursement Mode</label>
            <div className="w-full h-9 px-3 rounded-lg border border-border bg-muted/20 text-xs font-semibold text-foreground flex items-center justify-between shadow-2xs">
              <span className="text-muted-foreground font-medium">Multi-line Direct</span>
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                Party per line
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
