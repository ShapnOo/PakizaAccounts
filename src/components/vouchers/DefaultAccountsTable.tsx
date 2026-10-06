import React, { useState } from 'react';
import { DefaultAccountRow, VoucherType } from '../../types/voucher';
import { AccountHeadPicker } from './AccountHeadPicker';
import { Plus, Trash2, Info, Building2, Sparkles, Landmark, Wallet } from 'lucide-react';
import { COMPANIES } from '../../constants/voucherTypeConfig';
import { toast } from 'sonner';

interface DefaultAccountsTableProps {
  voucherType: VoucherType;
  rows: DefaultAccountRow[];
  onChange: (rows: DefaultAccountRow[]) => void;
}

export const DefaultAccountsTable: React.FC<DefaultAccountsTableProps> = ({
  voucherType,
  rows,
  onChange,
}) => {
  const [bankOrCashFilter, setBankOrCashFilter] = useState<'All' | 'Cash Only' | 'Bank Only'>('All');

  // Rule: Default accounts should be visible ONLY for Payment Voucher & Receive Voucher
  const isEligibleVoucherType =
    voucherType === 'Payment Voucher' || voucherType === 'Receive Voucher';

  if (!isEligibleVoucherType) {
    return (
      <div className="p-4 rounded-xl bg-muted/20 border border-border/70 text-xs text-muted-foreground flex items-center gap-2">
        <Info className="size-4 text-indigo-500 shrink-0" />
        <span>
          Default accounts configuration is only applicable for <strong>Payment Voucher</strong> and{' '}
          <strong>Receive Voucher</strong> types.
        </span>
      </div>
    );
  }

  // Dynamic header label
  const dynamicHeaderLabel =
    voucherType === 'Payment Voucher' ? 'Payment by (Default Accounts)' : 'Receive by (Default Accounts)';

  // Derived Nature (auto-derived: DR (+) for Receive, CR (-) for Payment)
  const derivedNature: 'DR' | 'CR' = voucherType === 'Receive Voucher' ? 'DR' : 'CR';
  const natureBadgeLabel = derivedNature === 'DR' ? 'Debit (+)' : 'Credit (-)';

  const handleAddRow = () => {
    const newRow: DefaultAccountRow = {
      id: `da-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      accountId: '',
      accountName: '',
      nature: derivedNature,
      companyId: COMPANIES[0] || 'PSL',
      active: true,
    };
    onChange([...rows, newRow]);
  };

  // Single-click option to populate all companies
  const handlePopulateAllCompanies = () => {
    const existingCompanies = new Set(rows.map((r) => r.companyId));
    const newRows: DefaultAccountRow[] = [...rows];
    let addedCount = 0;

    COMPANIES.forEach((comp) => {
      if (!existingCompanies.has(comp)) {
        newRows.push({
          id: `da-auto-${comp}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          accountId: rows[0]?.accountId || '1-01-01-01-01-01',
          accountName: rows[0]?.accountName || 'Petty Cash In Hand',
          nature: derivedNature,
          companyId: comp,
          active: true,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      onChange(newRows);
      toast.success(`Populated default accounts for ${addedCount} additional companies`);
    } else {
      toast.info('All companies are already populated in the table');
    }
  };

  const handleUpdateRow = (id: string, patch: Partial<DefaultAccountRow>) => {
    onChange(
      rows.map((r) =>
        r.id === id
          ? {
              ...r,
              ...patch,
              nature: derivedNature, // keep nature synchronized with voucherType
            }
          : r
      )
    );
  };

  const handleRemoveRow = (id: string) => {
    onChange(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-3 pt-3 border-t border-border/60">
      {/* Section Header with Dynamic Label & Bank/Cash Selection Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Building2 className="size-3.5 text-indigo-600" />
            <span>{dynamicHeaderLabel}</span>
          </span>
          <span
            className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
              derivedNature === 'DR'
                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-700 border-rose-500/30'
            }`}
          >
            Nature: {natureBadgeLabel}
          </span>
        </div>

        {/* Right Header Actions: Bank/Cash Filter & Populate All Companies Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bank or Cash Selection Dropdown */}
          <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/80 text-xs">
            <Landmark className="size-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-muted-foreground">Account Category:</span>
            <select
              value={bankOrCashFilter}
              onChange={(e) => setBankOrCashFilter(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer"
            >
              <option value="All">Bank & Cash Both</option>
              <option value="Cash Only">Cash Only</option>
              <option value="Bank Only">Bank Only</option>
            </select>
          </div>

          {/* Single-Click Populate All Companies Button */}
          <button
            type="button"
            onClick={handlePopulateAllCompanies}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Populate default rows for all registered companies in one click"
          >
            <Sparkles className="size-3.5" />
            <span>Populate All Companies</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/30 border-b border-border/70 text-[10.5px] font-bold uppercase text-muted-foreground">
            <tr>
              <th className="py-2.5 px-3">Default Account Head</th>
              <th className="py-2.5 px-3 w-28 text-center">Direction / Nature</th>
              <th className="py-2.5 px-3 w-36">Company Scope</th>
              <th className="py-2.5 px-3 w-28 text-center">Active Status</th>
              <th className="py-2.5 px-3 w-10 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground text-xs">
                  No default accounts configured. Click "+ Add Line" or "Populate All Companies" above.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                  {/* Account Head Picker */}
                  <td className="py-2 px-3">
                    <AccountHeadPicker
                      value={row.accountId}
                      onChange={(accId, accName) =>
                        handleUpdateRow(row.id, {
                          accountId: accId,
                          accountName: accName,
                        })
                      }
                      onlyCashAndBank={true}
                      placeholder={
                        bankOrCashFilter === 'Cash Only'
                          ? 'Select Cash Account...'
                          : bankOrCashFilter === 'Bank Only'
                          ? 'Select Bank Account...'
                          : 'Select Cash / Bank Account...'
                      }
                    />
                  </td>

                  {/* Derived Dynamic Nature Badge: Debit (+) / Credit (-) */}
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-black text-[11px] px-2.5 py-0.5 rounded-full border ${
                        derivedNature === 'DR'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                      }`}
                    >
                      <span>{derivedNature === 'DR' ? 'Debit (+)' : 'Credit (-)'}</span>
                    </span>
                  </td>

                  {/* Company Select */}
                  <td className="py-2 px-3">
                    <select
                      value={row.companyId}
                      onChange={(e) => handleUpdateRow(row.id, { companyId: e.target.value })}
                      className="w-full h-8.5 px-2 rounded-lg bg-card border border-border/80 text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-2xs"
                    >
                      {COMPANIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Active Toggle */}
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleUpdateRow(row.id, { active: !row.active })}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border transition-colors cursor-pointer ${
                        row.active
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15'
                          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          row.active ? 'bg-emerald-500' : 'bg-muted-foreground/50'
                        }`}
                      />
                      <span>{row.active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>

                  {/* Delete row */}
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove Row"
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

      {/* Add Line Button */}
      <button
        type="button"
        onClick={handleAddRow}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-dashed border-primary/50 text-primary hover:bg-primary/5 text-xs font-bold transition-all cursor-pointer shadow-2xs"
      >
        <Plus className="size-3.5 stroke-[2.5]" />
        <span>Add Default Account Row ++</span>
      </button>
    </div>
  );
};
