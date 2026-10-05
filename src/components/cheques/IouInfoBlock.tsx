import React, { useEffect, useState } from 'react';
import { Receipt, Calculator, AlertCircle } from 'lucide-react';
import { listIousByEmployee } from '../../services/mastersService';
import { IouRequisition } from '../../mock/ious';

interface IouInfoBlockProps {
  employeeId?: string;
  requisitionNo: string;
  reqDate: string;
  reqValue: number;
  prevPaid: number;
  balance: number;
  payAmount: number;
  onIouSelect: (iou: IouRequisition | null) => void;
  onPayAmountChange: (val: number) => void;
  errors?: Record<string, string | undefined>;
}

export const IouInfoBlock: React.FC<IouInfoBlockProps> = ({
  employeeId,
  requisitionNo,
  reqDate,
  reqValue,
  prevPaid,
  balance,
  payAmount,
  onIouSelect,
  onPayAmountChange,
  errors = {},
}) => {
  const [ious, setIous] = useState<IouRequisition[]>([]);

  useEffect(() => {
    if (employeeId) {
      listIousByEmployee(employeeId).then(setIous);
    } else {
      setIous([]);
    }
  }, [employeeId]);

  const handleIouChange = (selectedReqNo: string) => {
    const matched = ious.find((i) => i.requisitionNo === selectedReqNo) || null;
    onIouSelect(matched);
  };

  return (
    <div className="bg-card rounded-xl border border-violet-500/30 dark:border-violet-500/20 p-5 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Receipt className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              IOU / Advance Requisition Information
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Employee requisition details and advance disbursement calculation
            </p>
          </div>
        </div>

        {employeeId && ious.length > 0 && (
          <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
            {ious.length} Pending {ious.length === 1 ? 'Requisition' : 'Requisitions'}
          </span>
        )}
      </div>

      {/* 6-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Requisition No */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <span>Requisition No</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <select
            value={requisitionNo}
            onChange={(e) => handleIouChange(e.target.value)}
            disabled={!employeeId || ious.length === 0}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-violet-500 shadow-2xs cursor-pointer ${
              !employeeId || ious.length === 0 ? 'bg-muted/40 text-muted-foreground' : ''
            } ${errors['iou.requisitionNo'] || errors.iou ? 'border-rose-400 focus:ring-rose-500' : 'border-border'}`}
          >
            <option value="">
              {!employeeId
                ? '-- Select Employee First --'
                : ious.length === 0
                ? '-- No pending requisitions --'
                : '-- Select Requisition No --'}
            </option>
            {ious.map((i) => (
              <option key={i.id} value={i.requisitionNo}>
                {i.requisitionNo}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Req. Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Req. Date</label>
          <input
            type="text"
            readOnly
            value={reqDate || '—'}
            className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-medium text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* 3. Req. Value */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Req. Value (৳)</label>
          <input
            type="text"
            readOnly
            value={reqValue ? reqValue.toLocaleString('en-IN') : '0.00'}
            className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono font-bold text-foreground text-right outline-none cursor-not-allowed"
          />
        </div>

        {/* 4. Prev. Paid */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Prev. Paid (৳)</label>
          <input
            type="text"
            readOnly
            value={prevPaid ? prevPaid.toLocaleString('en-IN') : '0.00'}
            className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono font-medium text-muted-foreground text-right outline-none cursor-not-allowed"
          />
        </div>

        {/* 5. Balance (Formula: Value - Prev Paid) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
            <Calculator className="size-3" />
            <span>Balance (৳)</span>
          </label>
          <input
            type="text"
            readOnly
            value={balance ? balance.toLocaleString('en-IN') : '0.00'}
            className="w-full h-9 px-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-xs font-mono font-extrabold text-violet-600 dark:text-violet-400 text-right outline-none cursor-not-allowed"
          />
        </div>

        {/* 6. Pay Amount */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground flex items-center gap-1">
            <span>Pay Amount (৳)</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={0.01}
            max={balance || undefined}
            step="any"
            value={payAmount || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              onPayAmountChange(val);
            }}
            placeholder="0.00"
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold text-foreground text-right outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-2xs ${
              errors['iou.payAmount'] || (payAmount > balance && balance > 0)
                ? 'border-rose-400'
                : 'border-border'
            }`}
          />
        </div>
      </div>

      {payAmount > balance && balance > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold pt-1">
          <AlertCircle className="size-3.5" />
          <span>Pay amount cannot exceed available balance of ৳{balance.toLocaleString('en-IN')}.</span>
        </div>
      )}
    </div>
  );
};
