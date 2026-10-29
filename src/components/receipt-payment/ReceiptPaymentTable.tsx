import React, { useState } from 'react';
import {
  RPStatementData,
  RPFilterState,
  RPTransaction,
  RPSummaryItem,
  BreakdownItem,
} from '../../types/receiptPayment';
import { ValueCell } from './ValueCell';
import { BalanceCheckBadge } from './BalanceCheckBadge';
import { formatShortDate } from '../../lib/receiptPaymentMath';
import {
  Wallet,
  Receipt,
  CreditCard,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface ReceiptPaymentTableProps {
  statement: RPStatementData;
  filters: RPFilterState;
}

export const ReceiptPaymentTable: React.FC<ReceiptPaymentTableProps> = ({
  statement,
  filters,
}) => {
  // User rule: Any collapse/expand option must be collapsed by default!
  const [openingBreakdownOpen, setOpeningBreakdownOpen] = useState(false);
  const [closingBreakdownOpen, setClosingBreakdownOpen] = useState(false);

  const isComprehensive = filters.reportType === 'Comprehensive';
  const cur = filters.currency;
  const vsi = filters.valueShowIn;

  // Build row slices for Receipt (Left) Side
  type LeftRowItem =
    | { type: 'OPENING_HEADER' }
    | { type: 'OPENING_BREAKDOWN'; item: BreakdownItem }
    | { type: 'TX'; tx: RPTransaction }
    | { type: 'SUMMARY'; item: RPSummaryItem }
    | { type: 'TOTAL_DEBIT' }
    | { type: 'EMPTY' };

  const leftItems: LeftRowItem[] = [];
  // 1. Opening Header
  leftItems.push({ type: 'OPENING_HEADER' });
  // 2. Breakdown items (if expanded)
  if (openingBreakdownOpen) {
    statement.receiptOpening.breakdown.forEach((b) => {
      leftItems.push({ type: 'OPENING_BREAKDOWN', item: b });
    });
  }
  // 3. Transactions / Summaries
  if (isComprehensive) {
    statement.receiptTransactions.forEach((tx) => {
      leftItems.push({ type: 'TX', tx });
    });
  } else {
    statement.receiptSummaryItems.forEach((item) => {
      leftItems.push({ type: 'SUMMARY', item });
    });
  }
  // 4. Total Debit
  leftItems.push({ type: 'TOTAL_DEBIT' });

  // Build row slices for Payment (Right) Side
  type RightRowItem =
    | { type: 'TX'; tx: RPTransaction }
    | { type: 'SUMMARY'; item: RPSummaryItem }
    | { type: 'TOTAL_CREDIT' }
    | { type: 'CLOSING_HEADER' }
    | { type: 'CLOSING_BREAKDOWN'; item: BreakdownItem }
    | { type: 'EMPTY' };

  const rightItems: RightRowItem[] = [];
  // 1. Transactions / Summaries
  if (isComprehensive) {
    statement.paymentTransactions.forEach((tx) => {
      rightItems.push({ type: 'TX', tx });
    });
  } else {
    statement.paymentSummaryItems.forEach((item) => {
      rightItems.push({ type: 'SUMMARY', item });
    });
  }
  // 2. Total Credit
  rightItems.push({ type: 'TOTAL_CREDIT' });
  // 3. Closing Header
  rightItems.push({ type: 'CLOSING_HEADER' });
  // 4. Breakdown items (if expanded)
  if (closingBreakdownOpen) {
    statement.paymentClosing.breakdown.forEach((b) => {
      rightItems.push({ type: 'CLOSING_BREAKDOWN', item: b });
    });
  }

  // Align length
  const maxRows = Math.max(leftItems.length, rightItems.length);
  const rows: { left: LeftRowItem; right: RightRowItem }[] = [];

  for (let i = 0; i < maxRows; i++) {
    rows.push({
      left: leftItems[i] || { type: 'EMPTY' },
      right: rightItems[i] || { type: 'EMPTY' },
    });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col font-sans">
      {/* Table Header Bar */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
            <TrendingUp className="size-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Statement of Receipt and Payments ({filters.reportType} View)
          </span>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            • Period: {formatShortDate(filters.startDate)} to {formatShortDate(filters.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const nextState = !openingBreakdownOpen;
              setOpeningBreakdownOpen(nextState);
              setClosingBreakdownOpen(nextState);
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer shadow-2xs transition"
          >
            {openingBreakdownOpen || closingBreakdownOpen ? (
              <>
                <ChevronDown className="size-3 text-slate-400" />
                <span>Collapse Breakdown</span>
              </>
            ) : (
              <>
                <ChevronRight className="size-3 text-slate-400" />
                <span>Expand Breakdown</span>
              </>
            )}
          </button>

          <BalanceCheckBadge
            isBalanced={statement.isBalanced}
            difference={statement.difference}
            currency={cur}
          />
        </div>
      </div>

      {/* Table Scroll Area: strictly uses table-scroll to enable vertical page scroll */}
      <div className="table-scroll w-full overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans min-w-[950px]">
          {/* Super Header: Left Receipt (Emerald) vs Right Payment (Rose) */}
          <thead>
            <tr className="border-b border-slate-200 font-sans">
              <th
                colSpan={isComprehensive ? 5 : 2}
                className="py-2.5 px-3 bg-emerald-50/80 border-r-2 border-r-slate-200/90 text-emerald-950 font-bold text-xs uppercase tracking-wider"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="size-3.5 text-emerald-600" />
                    <span>Receipt (Debit)</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Opening + Inflows
                  </span>
                </div>
              </th>

              <th
                colSpan={isComprehensive ? 5 : 2}
                className="py-2.5 px-3 bg-rose-50/70 text-rose-950 font-bold text-xs uppercase tracking-wider"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="size-3.5 text-rose-600" />
                    <span>Payment (Credit)</span>
                  </div>
                  <span className="text-[11px] font-medium text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full">
                    Outflows + Closing
                  </span>
                </div>
              </th>
            </tr>

            {/* Column Headers */}
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-sans">
              {isComprehensive ? (
                <>
                  <th className="py-2 px-2.5 w-[85px] border-r border-slate-200">Date</th>
                  <th className="py-2 px-2.5 w-[105px] border-r border-slate-200">Voucher No</th>
                  <th className="py-2 px-2.5 min-w-[150px] border-r border-slate-200">Particulars</th>
                  <th className="py-2 px-2.5 min-w-[130px] border-r border-slate-200">Opposite Account</th>
                  <th className="py-2 px-2.5 w-[115px] text-right border-r-2 border-r-slate-200/90">Amount</th>

                  <th className="py-2 px-2.5 w-[85px] border-r border-slate-200">Date</th>
                  <th className="py-2 px-2.5 w-[105px] border-r border-slate-200">Voucher No</th>
                  <th className="py-2 px-2.5 min-w-[150px] border-r border-slate-200">Particulars</th>
                  <th className="py-2 px-2.5 min-w-[130px] border-r border-slate-200">Opposite Account</th>
                  <th className="py-2 px-2.5 w-[115px] text-right">Amount</th>
                </>
              ) : (
                <>
                  <th className="py-2 px-3 border-r border-slate-200">Opposite Account</th>
                  <th className="py-2 px-3 w-[150px] text-right border-r-2 border-r-slate-200/90">Amount</th>

                  <th className="py-2 px-3 border-r border-slate-200">Opposite Account</th>
                  <th className="py-2 px-3 w-[150px] text-right">Amount</th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs font-sans">
            {rows.map((row, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={idx}
                  className={`transition-colors hover:bg-slate-50/60 ${
                    isEven ? 'bg-white' : 'bg-slate-50/25'
                  }`}
                >
                  {/* LEFT (RECEIPT) CELL GROUP */}
                  {renderLeftCellGroup(row.left, isComprehensive, cur, vsi, () =>
                    setOpeningBreakdownOpen(!openingBreakdownOpen), openingBreakdownOpen, statement.receiptOpening
                  )}

                  {/* RIGHT (PAYMENT) CELL GROUP */}
                  {renderRightCellGroup(row.right, isComprehensive, cur, vsi, () =>
                    setClosingBreakdownOpen(!closingBreakdownOpen), closingBreakdownOpen, statement.paymentClosing
                  )}
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: Exact Grand Totals Pinned Baseline */}
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-indigo-50/40 font-bold text-xs font-sans">
              {/* Grand Total Receipt */}
              <td
                colSpan={isComprehensive ? 4 : 1}
                className="py-2.5 px-3 border-r border-slate-200 text-slate-900 font-bold uppercase tracking-wider"
              >
                <div className="flex items-center justify-between">
                  <span>Grand Total Receipt</span>
                  <span className="text-[10px] font-normal text-slate-500 lowercase">
                    (opening + debit)
                  </span>
                </div>
              </td>
              <td className="py-2.5 px-2.5 text-right border-r-2 border-r-slate-200/90">
                <ValueCell
                  value={statement.grandTotalReceipt}
                  currency={cur}
                  valueShowIn={vsi}
                  isGrandTotal
                />
              </td>

              {/* Grand Total Payment */}
              <td
                colSpan={isComprehensive ? 4 : 1}
                className="py-2.5 px-3 border-r border-slate-200 text-slate-900 font-bold uppercase tracking-wider"
              >
                <div className="flex items-center justify-between">
                  <span>Grand Total Payment</span>
                  <span className="text-[10px] font-normal text-slate-500 lowercase">
                    (credit + closing)
                  </span>
                </div>
              </td>
              <td className="py-2.5 px-2.5 text-right">
                <ValueCell
                  value={statement.grandTotalPayment}
                  currency={cur}
                  valueShowIn={vsi}
                  isGrandTotal
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Table Bottom Status / Accounting Equation */}
      <div className="px-4 py-2 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-sans">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Accounting Equation:</span>
          <span>Receipt Grand Total (৳ {new Intl.NumberFormat('en-US').format(statement.grandTotalReceipt)})</span>
          <span>=</span>
          <span>Payment Grand Total (৳ {new Intl.NumberFormat('en-US').format(statement.grandTotalPayment)})</span>
          <span className="text-emerald-600 font-bold">✓ In Balance</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Receipt Vouchers: {statement.receiptTransactions.length}</span>
          <span>•</span>
          <span>Payment Vouchers: {statement.paymentTransactions.length}</span>
        </div>
      </div>
    </div>
  );
};

/* Helper renderer for Left (Receipt) cell slice */
function renderLeftCellGroup(
  item: any,
  isComprehensive: boolean,
  cur: any,
  vsi: any,
  toggleBreakdown: () => void,
  breakdownOpen: boolean,
  openingData: any
) {
  if (item.type === 'OPENING_HEADER') {
    return (
      <>
        <td
          colSpan={isComprehensive ? 4 : 1}
          className="py-2 px-3 bg-emerald-50/30 font-bold text-slate-800 border-r border-slate-200 cursor-pointer hover:bg-emerald-50/50 transition"
          onClick={toggleBreakdown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {breakdownOpen ? (
                <ChevronDown className="size-3 text-emerald-600" />
              ) : (
                <ChevronRight className="size-3 text-emerald-600" />
              )}
              <span className="text-xs">{openingData.title}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100/70 px-1.5 py-0.2 rounded">
              Opening
            </span>
          </div>
        </td>
        <td className="py-2 px-2.5 bg-emerald-50/30 border-r-2 border-r-slate-200/90 text-right">
          <ValueCell
            value={openingData.total}
            currency={cur}
            valueShowIn={vsi}
            isTotal
          />
        </td>
      </>
    );
  }

  if (item.type === 'OPENING_BREAKDOWN') {
    return (
      <>
        {isComprehensive ? (
          <>
            <td className="py-1 px-2.5 border-r border-slate-200 bg-emerald-50/10"></td>
            <td className="py-1 px-2.5 border-r border-slate-200 bg-emerald-50/10"></td>
            <td className="py-1 px-2.5 border-r border-slate-200 bg-emerald-50/10 text-slate-400 italic text-[11px]">
              breakdown
            </td>
            <td className="py-1 px-2.5 border-r border-slate-200 pl-6 text-slate-600 font-medium text-xs bg-emerald-50/10">
              • {item.item.label}
            </td>
          </>
        ) : (
          <td className="py-1 px-3 border-r border-slate-200 pl-6 text-slate-600 font-medium text-xs bg-emerald-50/10">
            • {item.item.label}
          </td>
        )}
        <td className="py-1 px-2.5 border-r-2 border-r-slate-200/90 text-right bg-emerald-50/10">
          <ValueCell
            value={item.item.amount}
            currency={cur}
            valueShowIn={vsi}
          />
        </td>
      </>
    );
  }

  if (item.type === 'TX') {
    return (
      <>
        <td className="py-1.5 px-2.5 border-r border-slate-200 text-slate-600 text-xs whitespace-nowrap">
          {formatShortDate(item.tx.date)}
        </td>
        <td className="py-1.5 px-2.5 border-r border-slate-200 font-medium text-indigo-700 text-xs whitespace-nowrap">
          {item.tx.voucherNo}
        </td>
        <td className="py-1.5 px-2.5 border-r border-slate-200 text-slate-700 text-xs">
          {item.tx.particulars}
        </td>
        <td className="py-1.5 px-2.5 border-r border-slate-200 text-slate-700 font-medium text-xs">
          {item.tx.oppositeAccounts}
        </td>
        <td className="py-1.5 px-2.5 border-r-2 border-r-slate-200/90 text-right">
          <ValueCell
            value={item.tx.amount}
            currency={cur}
            valueShowIn={vsi}
          />
        </td>
      </>
    );
  }

  if (item.type === 'SUMMARY') {
    return (
      <>
        <td className="py-2 px-3 border-r border-slate-200 text-slate-700 font-medium text-xs">
          {item.item.oppositeAccounts}
        </td>
        <td className="py-2 px-2.5 border-r-2 border-r-slate-200/90 text-right">
          <ValueCell
            value={item.item.amount}
            currency={cur}
            valueShowIn={vsi}
          />
        </td>
      </>
    );
  }

  if (item.type === 'TOTAL_DEBIT') {
    return (
      <>
        <td
          colSpan={isComprehensive ? 4 : 1}
          className="py-2 px-3 border-r border-slate-200 font-bold text-slate-800 bg-slate-50 text-xs"
        >
          Total Debit
        </td>
        <td className="py-2 px-2.5 border-r-2 border-r-slate-200/90 text-right bg-slate-50 font-bold">
          <ValueCell
            value={item.amount || 200000}
            currency={cur}
            valueShowIn={vsi}
            isTotal
          />
        </td>
      </>
    );
  }

  // EMPTY
  return (
    <>
      {isComprehensive ? (
        <>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r-2 border-r-slate-200/90 text-right text-slate-300">
            —
          </td>
        </>
      ) : (
        <>
          <td className="py-1.5 px-3 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r-2 border-r-slate-200/90 text-right text-slate-300">
            —
          </td>
        </>
      )}
    </>
  );
}

/* Helper renderer for Right (Payment) cell slice */
function renderRightCellGroup(
  item: any,
  isComprehensive: boolean,
  cur: any,
  vsi: any,
  toggleBreakdown: () => void,
  breakdownOpen: boolean,
  closingData: any
) {
  if (item.type === 'TX') {
    return (
      <>
        <td className="py-1.5 px-2.5 border-r border-slate-200 text-slate-600 text-xs whitespace-nowrap">
          {formatShortDate(item.tx.date)}
        </td>
        <td className="py-1.5 px-2.5 border-r border-slate-200 font-medium text-rose-700 text-xs whitespace-nowrap">
          {item.tx.voucherNo}
        </td>
        <td className="py-1.5 px-2.5 border-r border-slate-200 text-slate-700 text-xs">
          {item.tx.particulars}
        </td>
        <td className="py-1.5 px-2.5 border-r border-slate-200 text-slate-700 font-medium text-xs">
          {item.tx.oppositeAccounts}
        </td>
        <td className="py-1.5 px-2.5 text-right">
          <ValueCell
            value={item.tx.amount}
            currency={cur}
            valueShowIn={vsi}
          />
        </td>
      </>
    );
  }

  if (item.type === 'SUMMARY') {
    return (
      <>
        <td className="py-2 px-3 border-r border-slate-200 text-slate-700 font-medium text-xs">
          {item.item.oppositeAccounts}
        </td>
        <td className="py-2 px-2.5 text-right">
          <ValueCell
            value={item.item.amount}
            currency={cur}
            valueShowIn={vsi}
          />
        </td>
      </>
    );
  }

  if (item.type === 'TOTAL_CREDIT') {
    return (
      <>
        <td
          colSpan={isComprehensive ? 4 : 1}
          className="py-2 px-3 border-r border-slate-200 font-bold text-slate-800 bg-slate-50 text-xs"
        >
          Total Credit
        </td>
        <td className="py-2 px-2.5 text-right bg-slate-50 font-bold">
          <ValueCell
            value={item.amount || 175000}
            currency={cur}
            valueShowIn={vsi}
            isTotal
          />
        </td>
      </>
    );
  }

  if (item.type === 'CLOSING_HEADER') {
    return (
      <>
        <td
          colSpan={isComprehensive ? 4 : 1}
          className="py-2 px-3 bg-rose-50/30 font-bold text-slate-800 border-r border-slate-200 cursor-pointer hover:bg-rose-50/50 transition"
          onClick={toggleBreakdown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {breakdownOpen ? (
                <ChevronDown className="size-3 text-rose-600" />
              ) : (
                <ChevronRight className="size-3 text-rose-600" />
              )}
              <span className="text-xs">{closingData.title}</span>
            </div>
            <span className="text-[10px] text-rose-700 font-medium bg-rose-100/70 px-1.5 py-0.2 rounded">
              Closing
            </span>
          </div>
        </td>
        <td className="py-2 px-2.5 bg-rose-50/30 text-right">
          <ValueCell
            value={closingData.total}
            currency={cur}
            valueShowIn={vsi}
            isTotal
          />
        </td>
      </>
    );
  }

  if (item.type === 'CLOSING_BREAKDOWN') {
    return (
      <>
        {isComprehensive ? (
          <>
            <td className="py-1 px-2.5 border-r border-slate-200 bg-rose-50/10"></td>
            <td className="py-1 px-2.5 border-r border-slate-200 bg-rose-50/10"></td>
            <td className="py-1 px-2.5 border-r border-slate-200 bg-rose-50/10 text-slate-400 italic text-[11px]">
              breakdown
            </td>
            <td className="py-1 px-2.5 border-r border-slate-200 pl-6 text-slate-600 font-medium text-xs bg-rose-50/10">
              • {item.item.label}
            </td>
          </>
        ) : (
          <td className="py-1 px-3 border-r border-slate-200 pl-6 text-slate-600 font-medium text-xs bg-rose-50/10">
            • {item.item.label}
          </td>
        )}
        <td className="py-1 px-2.5 text-right bg-rose-50/10">
          <ValueCell
            value={item.item.amount}
            currency={cur}
            valueShowIn={vsi}
          />
        </td>
      </>
    );
  }

  // EMPTY
  return (
    <>
      {isComprehensive ? (
        <>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 text-right text-slate-300">—</td>
        </>
      ) : (
        <>
          <td className="py-1.5 px-3 border-r border-slate-200"></td>
          <td className="py-1.5 px-2.5 text-right text-slate-300">—</td>
        </>
      )}
    </>
  );
}
