import { Link } from 'react-router-dom';
import {
  Settings,
  FolderTree,
  Receipt,
  FileText,
  Repeat,
  BookOpen,
  Landmark,
  UserCheck,
  Coins,
  Layers,
  ListFilter,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

interface QuickLinkItem {
  title: string;
  subtitle: string;
  to: string;
  icon: any;
  color: string;
  badge?: string;
  category: string;
}

const QUICK_LINKS: QuickLinkItem[] = [
  {
    title: 'Journal Entries',
    subtitle: 'Manage & post all vouchers',
    to: '/journal-entries',
    icon: FileText,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60',
    badge: '14 Vouchers',
    category: 'Vouchers',
  },
  {
    title: 'Recurring Journal',
    subtitle: 'Automated schedules & templates',
    to: '/recurring-journal',
    icon: Repeat,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60',
    badge: '10 Profiles',
    category: 'Vouchers',
  },
  {
    title: 'Preset Journal',
    subtitle: 'Fast entry template library',
    to: '/preset-journal',
    icon: Receipt,
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60',
    badge: '10 Presets',
    category: 'Vouchers',
  },
  {
    title: 'Chart of Accounts',
    subtitle: 'Multi-level COA ledger tree',
    to: '/chart-of-accounts',
    icon: FolderTree,
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60',
    badge: 'Tree View',
    category: 'Master',
  },
  {
    title: 'Voucher Setup',
    subtitle: 'Configure JV, PV, RV & Contra',
    to: '/vouchers',
    icon: Receipt,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/60',
    badge: '4 Formats',
    category: 'Vouchers',
  },
  {
    title: 'Cheque Management',
    subtitle: 'Cheque prepare & register',
    to: '/cheques/register',
    icon: BookOpen,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
    badge: 'Books & Print',
    category: 'Banking',
  },
  {
    title: 'Bank & Branch Setup',
    subtitle: 'Company bank accounts',
    to: '/banks',
    icon: Landmark,
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/60',
    badge: '8 Banks',
    category: 'Banking',
  },
  {
    title: 'Customer Master',
    subtitle: 'Receivables & customer groups',
    to: '/customers',
    icon: UserCheck,
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60',
    badge: 'Clients',
    category: 'Master',
  },
  {
    title: 'Currency & Rates',
    subtitle: 'Multi-currency exchange rates',
    to: '/currency-setup',
    icon: Coins,
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/60',
    badge: 'USD/EUR/BDT',
    category: 'Master',
  },
  {
    title: 'Custom Field Builder',
    subtitle: 'Dynamic form schema fields',
    to: '/custom-fields',
    icon: ListFilter,
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/60',
    badge: 'Dynamic',
    category: 'System',
  },
  {
    title: 'Subledger Management',
    subtitle: 'Auxiliary subledger codes',
    to: '/subledger',
    icon: Layers,
    color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    badge: 'Sub-Heads',
    category: 'Master',
  },
  {
    title: 'Master Config (F&A)',
    subtitle: 'Financial year & module rules',
    to: '/accounts-config/master-config',
    icon: Settings,
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/60',
    badge: 'System Rules',
    category: 'System',
  },
  {
    title: 'Voucher Template Print',
    subtitle: 'Print designer & layout config',
    to: '/accounts-report/journal',
    icon: FileText,
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/60',
    badge: 'Designer',
    category: 'Reports',
  },
];

export function QuickAccessGrid() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              Quick Access Modules
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              12 Active Modules
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Direct shortcuts to key accounting configuration, entry screens, and registers
          </p>
        </div>

        <Link
          to="/journal-entries"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
        >
          <PlusCircle className="size-3.5" />
          <span>New Voucher</span>
        </Link>
      </div>

      {/* Grid of Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.title}
              to={link.to}
              className="group p-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted/50 hover:border-border transition-all flex flex-col justify-between space-y-2 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div
                  className={`size-8 rounded-lg flex items-center justify-center border ${link.color} shrink-0`}
                >
                  <Icon className="size-4" />
                </div>
                {link.badge && (
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-muted text-muted-foreground truncate">
                    {link.badge}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {link.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {link.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground group-hover:text-primary font-semibold pt-0.5">
                <span>Open module</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
