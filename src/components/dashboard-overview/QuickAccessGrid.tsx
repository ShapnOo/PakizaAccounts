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
  Plus,
  UploadCloud,
  RefreshCw,
} from 'lucide-react';

interface QuickLinkItem {
  title: string;
  subtitle: string;
  to: string;
  icon: any;
  badge?: string;
}

const QUICK_LINKS: QuickLinkItem[] = [
  {
    title: 'Journal Entries',
    subtitle: 'Post & verify all vouchers',
    to: '/journal-entries',
    icon: FileText,
    badge: '14 Vouchers',
  },
  {
    title: 'Recurring Journal',
    subtitle: 'Automated schedules & templates',
    to: '/recurring-journal',
    icon: Repeat,
    badge: '10 Profiles',
  },
  {
    title: 'Preset Journal',
    subtitle: 'Fast entry template library',
    to: '/preset-journal',
    icon: Receipt,
    badge: '10 Presets',
  },
  {
    title: 'Bulk Data Upload',
    subtitle: 'Import vouchers via Excel',
    to: '/bulk-upload',
    icon: UploadCloud,
    badge: 'Excel Import',
  },
  {
    title: 'Bulk Data Update',
    subtitle: 'Filter & batch edit fields',
    to: '/bulk-update',
    icon: RefreshCw,
    badge: 'Batch Wizard',
  },
  {
    title: 'Chart of Accounts',
    subtitle: 'COA ledger hierarchy tree',
    to: '/chart-of-accounts',
    icon: FolderTree,
    badge: 'Master Tree',
  },
  {
    title: 'Bank & Branch Setup',
    subtitle: 'Corporate bank accounts',
    to: '/banks',
    icon: Landmark,
    badge: '8 Banks',
  },
  {
    title: 'Cheque Management',
    subtitle: 'Cheque issue & register',
    to: '/cheques/register',
    icon: BookOpen,
    badge: 'Register',
  },
  {
    title: 'Customer Master',
    subtitle: 'Receivables & customer groups',
    to: '/customers',
    icon: UserCheck,
    badge: 'Directory',
  },
  {
    title: 'Currency & Rates',
    subtitle: 'Multi-currency exchange rates',
    to: '/currency-setup',
    icon: Coins,
    badge: 'USD/EUR',
  },
  {
    title: 'Subledger Master',
    subtitle: 'Auxiliary subledger codes',
    to: '/subledger',
    icon: Layers,
    badge: 'Sub-Heads',
  },
  {
    title: 'Custom Field Builder',
    subtitle: 'Dynamic schema form fields',
    to: '/custom-fields',
    icon: ListFilter,
    badge: 'Schema',
  },
];

export function QuickAccessGrid() {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Quick Access Modules
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Direct shortcuts to key accounting configuration, entry screens, and registers
          </p>
        </div>

        <Link
          to="/journal-entries"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="size-3.5" />
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
              className="group p-3 rounded-lg border border-border/60 bg-card hover:bg-muted/40 hover:border-border transition-all flex flex-col justify-between space-y-2.5 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="size-7 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Icon className="size-3.5" />
                </div>
                {link.badge && (
                  <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-muted text-muted-foreground truncate">
                    {link.badge}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {link.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {link.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground group-hover:text-primary font-medium pt-0.5">
                <span>Open</span>
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
