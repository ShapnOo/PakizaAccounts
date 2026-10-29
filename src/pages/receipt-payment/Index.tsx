import React, { useEffect } from 'react';
import { useReceiptPaymentStore } from '../../stores/receiptPaymentStore';
import { TopControlBar } from '../../components/receipt-payment/TopControlBar';
import { ReceiptPaymentTable } from '../../components/receipt-payment/ReceiptPaymentTable';
import { TableSkeleton } from '../../components/receipt-payment/TableSkeleton';
import { EmptyState } from '../../components/receipt-payment/EmptyState';
import { Receipt, Home, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReceiptPaymentPage: React.FC = () => {
  const { statement, filters, loading, fetchData, resetFilters } =
    useReceiptPaymentStore();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
              <Link
                to="/"
                className="hover:text-slate-800 flex items-center gap-1 transition"
              >
                <Home className="size-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="size-3 text-slate-400" />
              <span>Ledger Reports</span>
              <ChevronRight className="size-3 text-slate-400" />
              <span className="text-slate-800 font-semibold">
                Receipt and Payments Statement
              </span>
            </nav>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
                <Receipt className="size-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Receipt and Payments Statement
                </h1>
                <p className="text-xs text-slate-500">
                  Two-sided cash & bank ledger report balancing opening reserves, receipts, payments, and closing balances
                </p>
              </div>
            </div>
          </div>

          {/* Quick status pill */}
          {statement && (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-2 text-xs">
                <span className="text-slate-500">Report Status:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Balanced
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Top Control Bar with 9 Parameters */}
        <TopControlBar />

        {/* Main Content Area */}
        {loading && !statement ? (
          <TableSkeleton />
        ) : !statement || (statement.receiptTransactions.length === 0 && statement.paymentTransactions.length === 0) ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <ReceiptPaymentTable statement={statement} filters={filters} />
        )}
      </div>
    </div>
  );
};

