import React from 'react';
import { DefaultAccountRow, VoucherType } from '../../types/voucher';
import { AccountHeadPicker } from './AccountHeadPicker';
import { Plus, Trash2, Info, Building2 } from 'lucide-react';
import { COMPANIES } from '../../constants/voucherTypeConfig';

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
  // Dynamic header label (Rule V2/V3)
  const dynamicHeaderLabel =
    voucherType === 'Payment Voucher'
      ? 'Payment by'
      : voucherType === 'Receive Voucher'
      ? 'Receive by'
      : 'Default Accounts';

  // Dynamic Nature (auto-derived, Rule V2/V3)
  const derivedNature: 'DR' | 'CR' | '' =
    voucherType === 'Receive Voucher' ? 'DR' : voucherType === 'Payment Voucher' ? 'CR' : '';

  const isCashBankRestricted =
    voucherType === 'Payment Voucher' || voucherType === 'Receive Voucher';

  const handleAddRow = () => {
    const newRow: DefaultAccountRow = {
      id: `da-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      accountId: '',
      accountName: '',
      nature: derivedNature,
      companyId: 'PSL',
      active: true,
    };
    onChange([...rows, newRow]);
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
      {/* Section Header with Dynamic Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            {dynamicHeaderLabel}
          </span>
          {derivedNature && (
            <span
              className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded border ${
                derivedNature === 'DR'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
              }`}
            >
              Default: {derivedNature}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/30 border-b border-border/70 text-[10.5px] font-bold uppercase text-muted-foreground">
            <tr>
              <th className="py-2.5 px-3">Default Accounts</th>
              <th className="py-2.5 px-3 w-20 text-center">Nature</th>
              <th className="py-2.5 px-3 w-28">Company</th>
              <th className="py-2.5 px-3 w-28 text-center">Active Status</th>
              <th className="py-2.5 px-3 w-10 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground text-xs">
                  No default accounts configured. Click "+ Add Line" below.
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
                      onlyCashAndBank={isCashBankRestricted}
                      placeholder="Select Cash / Bank Account..."
                    />
                  </td>

                  {/* Derived Nature (Read-only) */}
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block font-mono font-black text-[11px] px-2 py-0.5 rounded border ${
                        derivedNature === 'DR'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : derivedNature === 'CR'
                          ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          : 'bg-muted text-muted-foreground border-border/50'
                      }`}
                    >
                      {derivedNature || '—'}
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
        <span>Add Line ++</span>
      </button>
    </div>
  );
};
