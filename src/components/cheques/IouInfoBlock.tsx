import React, { useEffect, useState } from 'react';
import { listIousByEmployee } from '../../services/mastersService';
import { IouRequisition } from '../../mock/ious';
import { FileText, Calculator } from 'lucide-react';

interface IouInfoBlockProps {
  employeeId?: string;
  requisitionNo?: string;
  reqDate?: string;
  reqValue?: number;
  prevPaid?: number;
  balance?: number;
  payAmount?: number;
  onIouSelect: (iou: IouRequisition | null) => void;
  onPayAmountChange: (amount: number) => void;
  errors?: Record<string, string | undefined>;
}

export const IouInfoBlock: React.FC<IouInfoBlockProps> = ({
  employeeId,
  requisitionNo,
  reqDate,
  reqValue = 0,
  prevPaid = 0,
  balance = 0,
  payAmount = 0,
  onIouSelect,
  onPayAmountChange,
  errors = {},
}) => {
  const [ious, setIous] = useState<IouRequisition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchIous = async () => {
      if (!employeeId) {
        setIous([]);
        return;
      }
      setLoading(true);
      try {
        const data = await listIousByEmployee(employeeId);
        if (isMounted) setIous(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchIous();
    return () => {
      isMounted = false;
    };
  }, [employeeId]);

  return (
    <div className="bg-violet-500/5 rounded-xl border border-violet-500/20 p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-violet-500/20">
        <div className="size-7 rounded-lg bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-400 flex items-center justify-center">
          <FileText className="size-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-violet-900 dark:text-violet-300 uppercase tracking-wider">
            IOU Requisition Information
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Select employee money requisition to calculate remaining unadjusted balance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Requisition No */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Requisition No. <span className="text-rose-500">*</span>
          </label>
          <select
            value={requisitionNo || ''}
            onChange={(e) => {
              const item = ious.find((i) => i.requisitionNo === e.target.value) || null;
              onIouSelect(item);
            }}
            disabled={!employeeId || loading}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-violet-500 shadow-2xs cursor-pointer ${
              errors.billNo ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          >
            <option value="">
              {!employeeId ? 'Select employee first' : '-- Select Requisition No. --'}
            </option>
            {ious.map((i) => (
              <option key={i.id} value={i.requisitionNo}>
                {i.requisitionNo} ({i.reqDate} • ৳{i.reqValue.toLocaleString()})
              </option>
            ))}
          </select>
          {errors.billNo && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.billNo}</p>
          )}
        </div>

        {/* Req Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Req. Date</label>
          <input
            type="text"
            readOnly
            value={reqDate || '—'}
            className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-mono text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* Req Value */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Req. Value (৳)</label>
          <input
            type="text"
            readOnly
            value={reqValue ? reqValue.toLocaleString() : '0'}
            className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-mono font-semibold text-right text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* Prev. Paid */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Prev. Paid (৳)</label>
          <input
            type="text"
            readOnly
            value={prevPaid ? prevPaid.toLocaleString() : '0'}
            className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-mono font-semibold text-right text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* Balance */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-violet-700 dark:text-violet-400">
            Balance (৳)
          </label>
          <input
            type="text"
            readOnly
            value={balance ? balance.toLocaleString() : '0'}
            className="w-full h-9 px-3 rounded-lg border border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/50 text-xs font-mono font-bold text-right text-violet-900 dark:text-violet-200 outline-none cursor-not-allowed"
          />
        </div>
      </div>

      {/* Pay amount */}
      <div className="pt-2 border-t border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-violet-800 dark:text-violet-300">
          <Calculator className="size-4 shrink-0" />
          <span>Pay amount defaults to requisition balance and locks into Cheque Amount.</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-foreground shrink-0">
            Pay Amount (৳):
          </label>
          <input
            type="number"
            min={1}
            max={balance || undefined}
            value={payAmount || ''}
            onChange={(e) => onPayAmountChange(parseFloat(e.target.value) || 0)}
            className={`w-36 h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold text-right text-foreground outline-none focus:ring-1 focus:ring-violet-500 shadow-2xs ${
              errors.payAmount ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
