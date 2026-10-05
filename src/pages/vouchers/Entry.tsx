import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { VoucherType } from '../../types/voucher';
import { VoucherEntryForm } from '../../components/vouchers/VoucherEntryForm';
import { useVouchers } from '../../context/VoucherContext';
import {
  Receipt,
  ArrowLeft,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

const SLUG_TO_TYPE: Record<string, VoucherType> = {
  journal: 'Journal Voucher',
  payment: 'Payment Voucher',
  receive: 'Receive Voucher',
  contra: 'Contra Voucher',
  'journal-voucher': 'Journal Voucher',
  'payment-voucher': 'Payment Voucher',
  'receive-voucher': 'Receive Voucher',
  'contra-voucher': 'Contra Voucher',
};

const TYPE_TO_SLUG: Record<VoucherType, string> = {
  'Journal Voucher': 'journal',
  'Payment Voucher': 'payment',
  'Receive Voucher': 'receive',
  'Contra Voucher': 'contra',
};

export const VoucherEntryPage: React.FC<{ forcedType?: VoucherType }> = ({ forcedType }) => {
  const { type: typeParam } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { postVoucherEntry } = useVouchers();

  const currentType: VoucherType = useMemo(() => {
    if (forcedType) return forcedType;
    if (typeParam && SLUG_TO_TYPE[typeParam.toLowerCase()]) {
      return SLUG_TO_TYPE[typeParam.toLowerCase()];
    }
    return 'Journal Voucher';
  }, [forcedType, typeParam]);

  const entryTabs: { type: VoucherType; slug: string; label: string; icon: React.ReactNode; color: string }[] = [
    {
      type: 'Journal Voucher',
      slug: 'journal',
      label: 'Journal (JV)',
      icon: <BookOpen className="size-3.5" />,
      color: 'data-[state=active]:bg-indigo-600 data-[state=active]:text-white',
    },
    {
      type: 'Payment Voucher',
      slug: 'payment',
      label: 'Payment (PV)',
      icon: <ArrowUpRight className="size-3.5" />,
      color: 'data-[state=active]:bg-rose-600 data-[state=active]:text-white',
    },
    {
      type: 'Receive Voucher',
      slug: 'receive',
      label: 'Receive (RV)',
      icon: <ArrowDownLeft className="size-3.5" />,
      color: 'data-[state=active]:bg-emerald-600 data-[state=active]:text-white',
    },
    {
      type: 'Contra Voucher',
      slug: 'contra',
      label: 'Contra (CV)',
      icon: <RefreshCw className="size-3.5" />,
      color: 'data-[state=active]:bg-amber-600 data-[state=active]:text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 pt-5">
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Navigation Breadcrumb & Type Selector Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-border/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <Link
              to="/vouchers"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:bg-slate-100 text-xs font-bold text-muted-foreground hover:text-foreground transition-all group"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Voucher List</span>
            </Link>
            <div className="h-4 w-px bg-border/80" />
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>Voucher Entry</span>
              <span className="text-border">/</span>
              <span className="font-bold text-foreground">{currentType}</span>
            </div>
          </div>

          {/* Quick Switcher Tabs between the 4 voucher entry types */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 overflow-x-auto">
            {entryTabs.map((tab) => {
              const isActive = tab.type === currentType;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => navigate(`/vouchers/entry/${tab.slug}`)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Type-driven Entry Form Component */}
        <VoucherEntryForm
          key={currentType}
          type={currentType}
          onSave={(entry) => {
            postVoucherEntry(entry);
          }}
        />
      </div>
    </div>
  );
};
