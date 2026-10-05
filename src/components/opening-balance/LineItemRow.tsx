import React, { useState } from 'react';
import { OpeningBalanceLine } from '../../types/openingBalance';
import { AccountHeadPicker } from './AccountHeadPicker';
import { SubsidiaryPicker } from './SubsidiaryPicker';
import { CostCenterPicker } from './CostCenterPicker';
import { EmployeePicker } from './EmployeePicker';
import { VehiclePicker } from './VehiclePicker';
import { CurrencyRateInput } from './CurrencyRateInput';
import { AmountPairInput } from './AmountPairInput';
import { Copy, Trash2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface LineItemRowProps {
  line: OpeningBalanceLine;
  index: number;
  onUpdate: (id: string, patch: Partial<OpeningBalanceLine>) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  error?: string;
  autoFocus?: boolean;
}

export const LineItemRow: React.FC<LineItemRowProps> = ({
  line,
  index,
  onUpdate,
  onDuplicate,
  onRemove,
  error,
  autoFocus,
}) => {
  const [showMoreMobile, setShowMoreMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isZebra = index % 2 === 1;

  return (
    <>
      <tr
        className={`group transition-colors text-xs border-b border-border/40 ${
          isZebra ? 'bg-slate-50/60 dark:bg-muted/10' : 'bg-background'
        } hover:bg-indigo-500/[0.03]`}
      >
        {/* ── 1. Accounts Head ── */}
        <td className="py-1 px-2 min-w-[220px]">
          <AccountHeadPicker
            autoFocus={autoFocus}
            value={line.accountHeadId}
            onChange={(id) => onUpdate(line.id, { accountHeadId: id })}
            error={Boolean(error && !line.accountHeadId)}
          />
          {error && !line.accountHeadId && (
            <p className="text-[10px] text-rose-500 font-medium mt-0.5">Account required</p>
          )}
        </td>

        {/* ── 2. Cost Center ── */}
        <td className="py-1 px-1.5 min-w-[150px]">
          <CostCenterPicker
            value={line.costCenterId}
            onChange={(id) => onUpdate(line.id, { costCenterId: id })}
          />
        </td>

        {/* ── 3. Subsidiary ── */}
        <td className="py-1 px-1.5 min-w-[170px]">
          <SubsidiaryPicker
            value={line.subsidiaryId || ''}
            onChange={(id) => onUpdate(line.id, { subsidiaryId: id })}
          />
        </td>

        {/* ── 4. Employee ── */}
        <td className="py-1 px-1.5 min-w-[150px]">
          <EmployeePicker
            value={line.employeeId}
            onChange={(id) => onUpdate(line.id, { employeeId: id })}
          />
        </td>

        {/* ── 5. Vehicles (hidden on tablet, expandable) ── */}
        <td className="py-1 px-1.5 min-w-[150px]">
          <VehiclePicker
            value={line.vehicleId}
            onChange={(id) => onUpdate(line.id, { vehicleId: id })}
          />
        </td>

        {/* ── 6. Reference ── */}
        <td className="py-1 px-1.5 min-w-[110px]">
          <input
            type="text"
            placeholder="Ref #"
            value={line.reference || ''}
            maxLength={80}
            onChange={(e) => onUpdate(line.id, { reference: e.target.value })}
            className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </td>

        {/* ── 7. Description ── */}
        <td className="py-1 px-1.5 min-w-[160px]">
          <input
            type="text"
            placeholder="Line notes / description..."
            value={line.description || ''}
            maxLength={160}
            onChange={(e) => onUpdate(line.id, { description: e.target.value })}
            className="w-full h-8 px-2 rounded-md border border-border/80 bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </td>

        {/* ── 8 & 9. Currency & Exc. Rate ── */}
        <td className="py-1 px-1.5 min-w-[150px]">
          <CurrencyRateInput
            currency={line.currency}
            exchangeRate={line.exchangeRate}
            onCurrencyChange={(c) => onUpdate(line.id, { currency: c })}
            onRateChange={(r) => onUpdate(line.id, { exchangeRate: r })}
          />
        </td>

        {/* ── 10, 11, 12, 13. Amount Pairs (Debit, Credit, Debit BDT, Credit BDT) ── */}
        <AmountPairInput
          currency={line.currency}
          exchangeRate={line.exchangeRate}
          debit={line.debit}
          credit={line.credit}
          debitBDT={line.debitBDT}
          creditBDT={line.creditBDT}
          onUpdateDebit={(val) => onUpdate(line.id, { debit: val })}
          onUpdateCredit={(val) => onUpdate(line.id, { credit: val })}
          onUpdateDebitBDT={(val) => onUpdate(line.id, { debitBDT: val })}
          onUpdateCreditBDT={(val) => onUpdate(line.id, { creditBDT: val })}
          error={Boolean(error && !line.debitBDT && !line.creditBDT)}
        />

        {/* ── Actions Menu ── */}
        <td className="py-1 px-2 w-14 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              title="Duplicate row"
              onClick={() => onDuplicate(line.id)}
              className="p-1 rounded text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
            >
              <Copy className="size-3.5" />
            </button>
            <button
              type="button"
              title="Remove row"
              onClick={() => onRemove(line.id)}
              className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};
