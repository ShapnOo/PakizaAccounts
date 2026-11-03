import React from 'react';
import type {
  TemplateSetup,
  VoucherType,
} from '../../types/voucherTemplate';
import { TEMPLATE_INFO } from '../../types/voucherTemplate';
import { TemplateBadge } from './TemplateBadge';
import {
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

interface VoucherTypeRowProps {
  setup: TemplateSetup;
  onCustomize: (vt: VoucherType) => void;
}

const VOUCHER_TYPE_METADATA: Record<
  VoucherType,
  {
    title: string;
    badge: string;
    subtitle: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    colorScheme: {
      bg: string;
      text: string;
      border: string;
      hoverBorder: string;
      iconBg: string;
      iconColor: string;
      lightBadge: string;
      btnBg: string;
    };
  }
> = {
  Journal: {
    title: 'Journal Voucher',
    badge: 'Journal',
    subtitle: 'General Journal & Audit Ledger',
    description:
      'Double-entry audit postings, adjustment vouchers, multi-currency ledger entries, and depreciation records.',
    icon: BookOpen,
    colorScheme: {
      bg: 'bg-indigo-50/20',
      text: 'text-indigo-700',
      border: 'border-indigo-100',
      hoverBorder: 'hover:border-indigo-300',
      iconBg: 'bg-indigo-100/80',
      iconColor: 'text-indigo-600',
      lightBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      btnBg: 'group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600',
    },
  },
  Payment: {
    title: 'Payment Voucher',
    badge: 'Payment',
    subtitle: 'Vendor Payouts & Disbursements',
    description:
      'Supplier advance payments, utility settlements, employee expenses, and direct cash or bank disbursement entries.',
    icon: ArrowUpRight,
    colorScheme: {
      bg: 'bg-rose-50/20',
      text: 'text-rose-700',
      border: 'border-rose-100',
      hoverBorder: 'hover:border-rose-300',
      iconBg: 'bg-rose-100/80',
      iconColor: 'text-rose-600',
      lightBadge: 'bg-rose-50 text-rose-700 border-rose-200',
      btnBg: 'group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600',
    },
  },
  Receive: {
    title: 'Receive Voucher',
    badge: 'Receive',
    subtitle: 'Customer Collections & Deposits',
    description:
      'Customer advances, client collection receipts, invoice clearance vouchers, and cash or cheque deposit records.',
    icon: ArrowDownLeft,
    colorScheme: {
      bg: 'bg-emerald-50/20',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      hoverBorder: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-100/80',
      iconColor: 'text-emerald-600',
      lightBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnBg: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600',
    },
  },
  Contra: {
    title: 'Contra Voucher',
    badge: 'Contra',
    subtitle: 'Internal Cash & Bank Fund Transfers',
    description:
      'Cash withdrawals from bank, cash deposits into bank accounts, and inter-bank or petty-cash account transfers.',
    icon: ArrowLeftRight,
    colorScheme: {
      bg: 'bg-amber-50/20',
      text: 'text-amber-700',
      border: 'border-amber-100',
      hoverBorder: 'hover:border-amber-300',
      iconBg: 'bg-amber-100/80',
      iconColor: 'text-amber-600',
      lightBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      btnBg: 'group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600',
    },
  },
};

export const VoucherTypeRow: React.FC<VoucherTypeRowProps> = ({
  setup,
  onCustomize,
}) => {
  const meta = VOUCHER_TYPE_METADATA[setup.voucherType];
  const Icon = meta.icon;
  const info = TEMPLATE_INFO[setup.templateId] || TEMPLATE_INFO.cleanGrid;

  return (
    <div
      onClick={() => onCustomize(setup.voucherType)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-5 md:p-6 flex flex-col justify-between cursor-pointer hover:border-slate-300 font-sans relative overflow-hidden"
    >
      {/* Top Section: Icon, Name, Badge, Arrow */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-xl ${meta.colorScheme.iconBg} ${meta.colorScheme.iconColor} shadow-2xs transition-transform duration-200 group-hover:scale-105`}
            >
              <Icon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {meta.title}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${meta.colorScheme.lightBadge}`}
                >
                  {meta.badge}
                </span>
              </div>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">
                {meta.subtitle}
              </p>
            </div>
          </div>

          <div className="size-8 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:bg-indigo-50/50 transition-all">
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-slate-600 mt-3.5 leading-relaxed line-clamp-2">
          {meta.description}
        </p>
      </div>

      {/* Bottom Section: Active Template & Config Meta */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[12px] text-slate-600 font-medium">
            <span className="text-slate-400">Current Template:</span>
            <TemplateBadge templateId={setup.templateId} />
          </div>
          <span className="text-slate-300">·</span>
          <span className="text-[11.5px] text-slate-500">
            Paper: {setup.customization.paperSize} ({setup.customization.orientation})
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCustomize(setup.voucherType);
          }}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[12.5px] font-semibold shadow-2xs transition-all cursor-pointer ${meta.colorScheme.btnBg}`}
        >
          <span>Choose Template</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
};
