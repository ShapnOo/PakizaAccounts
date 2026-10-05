import React from 'react';
import { OpeningBalanceLine } from '../../types/openingBalance';
import { Pencil, Trash2, Copy, Building2, Users, Truck } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/format';
import { useOpeningMasterLookups } from '../../hooks/useOpeningMasterLookups';

interface LineItemRowProps {
  line: OpeningBalanceLine;
  index: number;
  onEdit: (line: OpeningBalanceLine) => void;
  onDuplicate: (id: string) => void;
  onDelete: (line: OpeningBalanceLine) => void;
}

export const LineItemRow: React.FC<LineItemRowProps> = ({
  line,
  index,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const { getAccount, getCostCenter, getSubsidiary, getEmployee, getVehicle } =
    useOpeningMasterLookups();

  const account = getAccount(line.accountHeadId);
  const costCenter = getCostCenter(line.costCenterId);
  const subsidiary = getSubsidiary(line.subsidiaryId);
  const employee = getEmployee(line.employeeId);
  const vehicle = getVehicle(line.vehicleId);

  const debit = line.debitBDT || 0;
  const credit = line.creditBDT || 0;
  const isForeign = line.currency && line.currency !== 'BDT';

  const isZebra = index % 2 === 1;

  return (
    <tr
      className={[
        'group transition-colors text-xs border-b border-border/50 hover:bg-indigo-500/[0.04]',
        isZebra ? 'bg-slate-50/50 dark:bg-muted/10' : 'bg-background',
      ].join(' ')}
    >
      {/* ── 1. Index ── */}
      <td className="py-2.5 px-3 text-center text-muted-foreground font-mono text-[11px] w-10">
        {index + 1}
      </td>

      {/* ── 2. Account Head ── */}
      <td className="py-2.5 px-3 min-w-[200px]">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {account?.code && (
              <span className="font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-muted text-slate-800 dark:text-foreground border border-slate-200/80 dark:border-border">
                {account.code}
              </span>
            )}
            <button
              type="button"
              onClick={() => onEdit(line)}
              className="text-left font-bold text-slate-900 dark:text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {account?.name || line.accountHeadId || 'Untitled Account'}
            </button>
          </div>
          {account?.path && account.path.length > 0 && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[240px]">
              {account.path.join(' › ')}
            </span>
          )}
        </div>
      </td>

      {/* ── 3. Cost Center ── */}
      <td className="py-2.5 px-2.5 min-w-[130px] text-muted-foreground">
        {costCenter ? (
          <div className="flex items-center gap-1.5 text-foreground font-medium">
            <Building2 className="size-3 text-indigo-500 shrink-0" />
            <span className="truncate max-w-[130px]">{costCenter.name}</span>
          </div>
        ) : (
          <span className="text-slate-300 dark:text-muted-foreground/40">—</span>
        )}
      </td>

      {/* ── 4. Subsidiary (Vendor / Customer) ── */}
      <td className="py-2.5 px-2.5 min-w-[150px]">
        {subsidiary ? (
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground truncate max-w-[120px]">
              {subsidiary.name}
            </span>
            <span
              className={[
                'px-1.5 py-0.5 rounded text-[9.5px] font-bold shrink-0',
                subsidiary.partyType === 'Vendor'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : subsidiary.partyType === 'Customer'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-muted dark:text-muted-foreground',
              ].join(' ')}
            >
              {subsidiary.partyType}
            </span>
          </div>
        ) : (
          <span className="text-slate-300 dark:text-muted-foreground/40">—</span>
        )}
      </td>

      {/* ── 5. Employee ── */}
      <td className="py-2.5 px-2.5 min-w-[120px] text-muted-foreground">
        {employee ? (
          <div className="flex items-center gap-1 text-foreground font-medium">
            <Users className="size-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{employee.name}</span>
          </div>
        ) : (
          <span className="text-slate-300 dark:text-muted-foreground/40">—</span>
        )}
      </td>

      {/* ── 6. Vehicles ── */}
      <td className="py-2.5 px-2.5 min-w-[130px] text-muted-foreground">
        {vehicle ? (
          <div className="flex items-center gap-1 text-foreground font-medium">
            <Truck className="size-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{vehicle.name}</span>
          </div>
        ) : (
          <span className="text-slate-300 dark:text-muted-foreground/40">—</span>
        )}
      </td>

      {/* ── 7. Reference ── */}
      <td className="py-2.5 px-2.5 min-w-[110px]">
        {line.reference ? (
          <span className="font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded bg-muted/60 text-foreground border border-border/60">
            {line.reference}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-muted-foreground/40">—</span>
        )}
      </td>

      {/* ── 8. Currency & Conversion ── */}
      <td className="py-2.5 px-2.5 min-w-[120px] text-[11px] whitespace-nowrap">
        {isForeign ? (
          <div className="flex flex-col">
            <span className="font-bold text-foreground">
              {formatNumber(line.debit || line.credit)} {line.currency}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Rate: {line.exchangeRate || 1}
            </span>
          </div>
        ) : (
          <span className="font-medium text-muted-foreground">BDT (1.00)</span>
        )}
      </td>

      {/* ── 9. Debit (BDT) ── */}
      <td className="py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap min-w-[110px]">
        {debit > 0 ? (
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
            ৳ {formatCurrency(debit)}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-muted-foreground/30 font-normal">—</span>
        )}
      </td>

      {/* ── 10. Credit (BDT) ── */}
      <td className="py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap min-w-[110px]">
        {credit > 0 ? (
          <span className="text-rose-700 dark:text-rose-400 font-extrabold">
            ৳ {formatCurrency(credit)}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-muted-foreground/30 font-normal">—</span>
        )}
      </td>

      {/* ── 11. Actions ── */}
      <td className="py-2.5 px-3 text-right whitespace-nowrap">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(line)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
            title="Edit line entry"
          >
            <Pencil className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDuplicate(line.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-muted dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Duplicate line"
          >
            <Copy className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(line)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Delete line"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
