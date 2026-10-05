import React, { useEffect, useState } from 'react';
import { ChequeBook, ChequeFor, SourceType } from '../../types/cheque';
import { listCoaBankAccounts } from '../../services/coaBankAccountsService';
import { CoaBankAccount } from '../../mock/coaBankAccounts';
import { listSuppliers, listEmployees } from '../../services/mastersService';
import { Supplier } from '../../mock/suppliers';
import { Employee } from '../../mock/employees';
import { Landmark, Building2, User } from 'lucide-react';

interface BankInfoBlockProps {
  sourceType: SourceType;
  accountsBankId: string;
  bankName: string;
  bookId: string;
  chequeFor: ChequeFor;
  partyName: string;
  books: ChequeBook[];
  onAccountChange: (acc: CoaBankAccount | null) => void;
  onBookChange: (bookId: string) => void;
  onChequeForChange: (val: ChequeFor) => void;
  onPartyNameChange: (val: string, extra?: { supplierId?: string; employeeId?: string }) => void;
  errors?: Record<string, string | undefined>;
}

export const BankInfoBlock: React.FC<BankInfoBlockProps> = ({
  sourceType,
  accountsBankId,
  bankName,
  bookId,
  chequeFor,
  partyName,
  books,
  onAccountChange,
  onBookChange,
  onChequeForChange,
  onPartyNameChange,
  errors = {},
}) => {
  const [bankAccounts, setBankAccounts] = useState<CoaBankAccount[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMasters = async () => {
      const [accs, sups, emps] = await Promise.all([
        listCoaBankAccounts(),
        listSuppliers(),
        listEmployees(),
      ]);
      if (isMounted) {
        setBankAccounts(accs);
        setSuppliers(sups);
        setEmployees(emps);
      }
    };
    fetchMasters();
    return () => {
      isMounted = false;
    };
  }, []);

  const getSourceLabel = () => {
    switch (sourceType) {
      case 'direct':
        return 'Direct Payment';
      case 'bill':
        return 'Bill Payment';
      case 'iou':
        return 'IOU Payment';
    }
  };

  const availableBooks = books.filter(
    (b) => !accountsBankId || b.accountsBankId === accountsBankId
  );

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-2 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Landmark className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Bank & Party Info
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Designate source bank account, cheque leaf book, and recipient party
            </p>
          </div>
        </div>

        {/* Source Type Chip */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            sourceType === 'direct'
              ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300'
              : sourceType === 'bill'
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300'
          }`}
        >
          {getSourceLabel()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Accounts (Bank) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Accounts (Bank) <span className="text-rose-500">*</span>
          </label>
          <select
            value={accountsBankId}
            onChange={(e) => {
              const acc = bankAccounts.find((b) => b.id === e.target.value) || null;
              onAccountChange(acc);
            }}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer ${
              errors.accountsBankId ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          >
            <option value="">-- Select Bank Account --</option>
            {bankAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountName} ({acc.bankName})
              </option>
            ))}
          </select>
          {errors.accountsBankId && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.accountsBankId}</p>
          )}
        </div>

        {/* Bank Name (Read-Only) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Bank Name <span className="text-[10px] text-muted-foreground italic font-normal">(Auto)</span>
          </label>
          <input
            type="text"
            readOnly
            value={bankName || '—'}
            className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-semibold text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* Book Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Book Name <span className="text-rose-500">*</span>
          </label>
          <select
            value={bookId}
            onChange={(e) => onBookChange(e.target.value)}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer ${
              errors.chequeBookId ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          >
            <option value="">-- Select Cheque Book --</option>
            {availableBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bookName} ({b.bankName} • {b.cheques.filter((c) => !c.used && !c.isInactive).length} available)
              </option>
            ))}
          </select>
          {errors.chequeBookId && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.chequeBookId}</p>
          )}
        </div>

        {/* Cheque for */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Cheque for <span className="text-rose-500">*</span>
          </label>
          <select
            value={chequeFor}
            onChange={(e) => onChequeForChange(e.target.value as ChequeFor)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="Supplier">Supplier</option>
            <option value="Employee">Employee</option>
            <option value="Customer">Customer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Name (Party Selection) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            {chequeFor} Name <span className="text-rose-500">*</span>
          </label>
          {chequeFor === 'Supplier' ? (
            <select
              value={partyName}
              onChange={(e) => {
                const sup = suppliers.find((s) => s.name === e.target.value);
                onPartyNameChange(e.target.value, { supplierId: sup?.id });
              }}
              className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer ${
                errors.partyName ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
              }`}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : chequeFor === 'Employee' ? (
            <select
              value={partyName}
              onChange={(e) => {
                const emp = employees.find((em) => em.name === e.target.value);
                onPartyNameChange(e.target.value, { employeeId: emp?.id });
              }}
              className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer ${
                errors.partyName ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
              }`}
            >
              <option value="">-- Select Employee --</option>
              {employees.map((em) => (
                <option key={em.id} value={em.name}>
                  {em.name} ({em.designation})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder={`Enter ${chequeFor.toLowerCase()} name...`}
              value={partyName}
              onChange={(e) => onPartyNameChange(e.target.value)}
              className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs ${
                errors.partyName ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
              }`}
            />
          )}
          {errors.partyName && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.partyName}</p>
          )}
        </div>
      </div>
    </div>
  );
};
