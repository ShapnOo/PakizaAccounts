import React, { useEffect, useState } from 'react';
import { listBillsBySupplier } from '../../services/mastersService';
import { Bill } from '../../mock/bills';
import { Receipt, Calendar, DollarSign, Calculator } from 'lucide-react';

interface BillInfoBlockProps {
  supplierId?: string;
  billNo?: string;
  billDate?: string;
  billValue?: number;
  prevPaid?: number;
  balance?: number;
  payAmount?: number;
  onBillSelect: (bill: Bill | null) => void;
  onPayAmountChange: (amount: number) => void;
  errors?: Record<string, string | undefined>;
}

export const BillInfoBlock: React.FC<BillInfoBlockProps> = ({
  supplierId,
  billNo,
  billDate,
  billValue = 0,
  prevPaid = 0,
  balance = 0,
  payAmount = 0,
  onBillSelect,
  onPayAmountChange,
  errors = {},
}) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBills = async () => {
      if (!supplierId) {
        setBills([]);
        return;
      }
      setLoading(true);
      try {
        const data = await listBillsBySupplier(supplierId);
        if (isMounted) setBills(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBills();
    return () => {
      isMounted = false;
    };
  }, [supplierId]);

  return (
    <div className="bg-amber-500/5 rounded-xl border border-amber-500/20 p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
        <div className="size-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <Receipt className="size-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            Bill Information (Accounts Payable)
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Select purchase bill to automatically calculate remaining balance and lock payment value
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Bill No */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Bill No. <span className="text-rose-500">*</span>
          </label>
          <select
            value={billNo || ''}
            onChange={(e) => {
              const b = bills.find((item) => item.billNo === e.target.value) || null;
              onBillSelect(b);
            }}
            disabled={!supplierId || loading}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs cursor-pointer ${
              errors.billNo ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          >
            <option value="">
              {!supplierId ? 'Select supplier first' : '-- Select Supplier Bill --'}
            </option>
            {bills.map((b) => (
              <option key={b.id} value={b.billNo}>
                {b.billNo} ({b.billDate} • ৳{b.billValue.toLocaleString()})
              </option>
            ))}
          </select>
          {errors.billNo && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.billNo}</p>
          )}
        </div>

        {/* Bill Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Bill Date</label>
          <input
            type="text"
            readOnly
            value={billDate || '—'}
            className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-mono text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* Bill Value */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Bill Value (৳)</label>
          <input
            type="text"
            readOnly
            value={billValue ? billValue.toLocaleString() : '0'}
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

        {/* Balance = Value - Prev Paid */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-700 dark:text-amber-400">
            Balance (৳)
          </label>
          <input
            type="text"
            readOnly
            value={balance ? balance.toLocaleString() : '0'}
            className="w-full h-9 px-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-xs font-mono font-bold text-right text-amber-900 dark:text-amber-200 outline-none cursor-not-allowed"
          />
        </div>
      </div>

      {/* Pay amount */}
      <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300">
          <Calculator className="size-4 shrink-0" />
          <span>Pay amount defaults to remaining balance and locks into Cheque Amount.</span>
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
            className={`w-36 h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold text-right text-foreground outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs ${
              errors.payAmount ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
