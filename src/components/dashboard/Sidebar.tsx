import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  SlidersHorizontal,
  File,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Settings,
  LifeBuoy,
  LogOut,
  FileSpreadsheet,
  Layers,
  CreditCard,
  TrendingUp,
  Landmark,
  BookOpen,
  Coins,
  Network,
  Users2,
  ShoppingCart,
  Boxes,
  Factory,
  Receipt,
  FileCheck,
  UploadCloud,
  RefreshCw,
  Wallet,
  CheckCircle,
  Building,
} from "lucide-react";

export interface NestedItem {
  label: string;
  to: string;
  count?: number;
}

export interface SubItem {
  label: string;
  to?: string;
  subitems?: NestedItem[];
  count?: number;
}

export interface NavItem {
  label: string;
  to?: string;
  icon: any;
  subitems?: SubItem[];
  count?: number;
}

export const nav: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Accounts Configuration & Setup",
    icon: SlidersHorizontal,
    subitems: [
      {
        label: "Master Configuration & Setup (F&A)",
        subitems: [
          { label: "Master Configuration (F&A)", to: "/accounts-config/master-config" },
          { label: "Financial Period Setup", to: "/accounts-config/financial-period-setup" },
          { label: "Chart of Accounts", to: "/accounts-config/chart-of-accounts" },
          { label: "Opening Balance", to: "/accounts-config/opening-balance" },
          { label: "Voucher Setup", to: "/accounts-config/voucher-setup" },
          { label: "Currency Setup", to: "/accounts-config/currency-setup" },
          { label: "Subledger", to: "/accounts-config/subledger" },
          { label: "Voucher Approval Setup", to: "/accounts-config/voucher-approval-setup" },
          { label: "Custom Field", to: "/accounts-config/custom-field" },
          { label: "Customer Master Setup", to: "/customers" },
          { label: "Bank Setup", to: "/banks" },
        ],
      },
      {
        label: "Accounts Report Customization",
        subitems: [
          { label: "Journal", to: "/accounts-report/journal" },
          { label: "General Ledger", to: "/accounts-report/general-ledger" },
          { label: "Income Statement", to: "/accounts-report/income-statement" },
          { label: "Balance Sheet", to: "/accounts-report/balance-sheet" },
        ],
      },
      {
        label: "Accounts Integration Configuration",
        subitems: [
          { label: "HR Integration Configuration", to: "/accounts-integration-config/hr" },
          { label: "Purchase Integration Configuration", to: "/accounts-integration-config/purchase" },
          { label: "Inventory Integration Configuration", to: "/accounts-integration-config/inventory" },
          { label: "Sales Integration Configuration", to: "/accounts-integration-config/sales" },
          { label: "Production Integration Configuration", to: "/accounts-integration-config/production" },
        ],
      },
    ],
  },
  {
    label: "Accounts Payable Management (Purchase)",
    icon: CreditCard,
    subitems: [
      { label: "Supplier Master Setup", to: "/accounts-payable/supplier-master-setup" },
      { label: "Supplier Master List", to: "/accounts-payable/supplier-master-list" },
    ],
  },
  {
    label: "Accounts Receivable Management (Sales)",
    icon: TrendingUp,
    subitems: [
      { label: "Customer Master Setup", to: "/accounts-receivable/customer-master-setup" },
      { label: "Customer Master List", to: "/accounts-receivable/customer-master-list" },
    ],
  },
  {
    label: "Bank Management",
    icon: Landmark,
    subitems: [
      { label: "Bank Master Setup", to: "/bank-management/bank-master-setup" },
      { label: "Cheque Setup", to: "/cheque-setup" },
      { label: "Cheque Preparation & Payment", to: "/cheque-prepare/direct" },
      { label: "Cheque Book Register", to: "/cheque-prepare/register" },
      { label: "Bank Reconciliation", to: "/bank-management/bank-reconciliation" },
    ],
  },
  {
    label: "Voucher Management",
    icon: Receipt,
    subitems: [
      { label: "Voucher Setup (List)", to: "/vouchers" },
      { label: "New Voucher Definition", to: "/vouchers/new" },
      { label: "Journal Voucher (JV)", to: "/vouchers/entry/journal" },
      { label: "Payment Voucher (PV)", to: "/vouchers/entry/payment" },
      { label: "Receive Voucher (RV)", to: "/vouchers/entry/receive" },
      { label: "Contra Voucher (CV)", to: "/vouchers/entry/contra" },
    ],
  },
  {
    label: "Journal Books",
    icon: BookOpen,
    subitems: [
      { label: "Journal Entries", to: "/journal-entries" },
      { label: "Recurring Journal", to: "/recurring-journal" },
      { label: "Preset Journal", to: "/journal-books/preset-journal" },
      { label: "Bulk Data Upload", to: "/journal-books/bulk-data-upload" },
      { label: "Bulk Update", to: "/journal-books/bulk-update" },
    ],
  },
  {
    label: "Treasury Management",
    icon: Coins,
    subitems: [
      { label: "Forecasting Accounts", to: "/treasury-management/forecasting-accounts" },
      { label: "Budgeting", to: "/treasury-management/budgeting" },
    ],
  },
  {
    label: "Accounts Integration",
    icon: Network,
    subitems: [
      {
        label: "HR Integration",
        subitems: [
          { label: "Cash Requisition", to: "/accounts-integration/hr/cash-requisition" },
          { label: "Cash Payment", to: "/accounts-integration/hr/cash-payment" },
          { label: "Salary Disbursement", to: "/accounts-integration/hr/salary-disbursement" },
        ],
      },
      {
        label: "Purchase Integration",
        subitems: [
          { label: "Local Bill Disbursement", to: "/accounts-integration/purchase/local-bill-disbursement" },
          { label: "Import Disbursement", to: "/accounts-integration/purchase/import-disbursement" },
          { label: "BBLC Disbursement", to: "/accounts-integration/purchase/bblc-disbursement" },
        ],
      },
      {
        label: "Inventory Integration",
        subitems: [
          { label: "Inventory Transaction Posting", to: "/accounts-integration/inventory/transaction-posting" },
        ],
      },
      {
        label: "Sales Integration",
        subitems: [
          { label: "Local Sales Collection", to: "/accounts-integration/sales/local-sales-collection" },
          { label: "Deemed Export Realization", to: "/accounts-integration/sales/deemed-export-realization" },
          { label: "Export Realization", to: "/accounts-integration/sales/export-realization" },
        ],
      },
      {
        label: "Production Integration",
        to: "/accounts-integration/production",
      },
    ],
  },
  {
    label: "Reports",
    icon: FileSpreadsheet,
    subitems: [
      {
        label: "Ledger",
        subitems: [
          { label: "Bulk Voucher Print", to: "/reports/ledger/bulk-voucher-print" },
          { label: "General Ledger", to: "/reports/ledger/general-ledger" },
          { label: "Day Book", to: "/reports/ledger/day-book" },
          { label: "Cash Book", to: "/reports/ledger/cash-book" },
          { label: "Receipt and Payments Statement", to: "/reports/ledger/receipt-and-payments-statement" },
          { label: "Employee Ledger", to: "/reports/ledger/employee-ledger" },
          { label: "Supplier Ledger", to: "/reports/ledger/supplier-ledger" },
          { label: "Customer Ledger", to: "/reports/ledger/customer-ledger" },
          { label: "Trial Balance", to: "/reports/ledger/trial-balance" },
        ],
      },
      {
        label: "Financial Statement",
        subitems: [
          { label: "Income Statement", to: "/reports/financial-statement/income-statement" },
          { label: "Retained Earnings Statement", to: "/reports/financial-statement/retained-earnings-statement" },
          { label: "Balance Sheet", to: "/reports/financial-statement/balance-sheet" },
          { label: "Cash Flow Statement (Indirect)", to: "/reports/financial-statement/cash-flow-statement-indirect" },
        ],
      },
      {
        label: "Management Report",
        subitems: [
          { label: "Budget Analysis", to: "/reports/management-report/budget-analysis" },
          { label: "Cash Flow Analysis", to: "/reports/management-report/cash-flow-analysis" },
          { label: "Comparison Analysis", to: "/reports/management-report/comparison-analysis" },
          { label: "Dashboard", to: "/reports/management-report/dashboard" },
        ],
      },
      {
        label: "Additional Report",
        subitems: [
          { label: "Reference Center", to: "/reports/additional-report/reference-center" },
          { label: "Cost Center", to: "/reports/additional-report/cost-center" },
          { label: "Vehicle", to: "/reports/additional-report/vehicle" },
        ],
      },
    ],
  },
];

// Helper to check if a route is already implemented & ready in the application
const READY_ROUTE_PATTERNS = [
  '/',
  '/accounts-config/master-config',
  '/accounts-config/chart-of-accounts',
  '/chart-of-accounts',
  '/accounts-config/opening-balance',
  '/opening-balance',
  '/accounts-config/voucher-setup',
  '/vouchers',
  '/vouchers/new',
  '/vouchers/entry/journal',
  '/vouchers/entry/payment',
  '/vouchers/entry/receive',
  '/vouchers/entry/contra',
  '/accounts-config/currency-setup',
  '/currency-setup',
  '/accounts-config/subledger',
  '/subledger',
  '/accounts-config/custom-field',
  '/custom-fields',
  '/accounts-report/journal',
  '/voucher-template',
  '/customers',
  '/accounts-receivable/customer-master-setup',
  '/accounts-receivable/customer-master-list',
  '/banks',
  '/bank-management/bank-master-setup',
  '/cheques',
  '/cheque-setup',
  '/cheque-prepare/direct',
  '/cheque-prepare/register',
  '/journal-entries',
  '/journal-books/journal-entries',
  '/recurring-journal',
  '/journal-books/recurring-journal',
  '/preset-journal',
  '/journal-books/preset-journal',
  '/bulk-upload',
  '/journal-books/bulk-data-upload',
  '/bulk-update',
  '/journal-books/bulk-update',
];

function isRouteReady(path?: string): boolean {
  if (!path) return false;
  return READY_ROUTE_PATTERNS.some((pattern) => path === pattern || path.startsWith(pattern + '/'));
}

// Helper to determine if a route or alias is currently active
function isPathActive(itemTo: string | undefined, currentPath: string): boolean {
  if (!itemTo) return false;
  if (itemTo === '/' && currentPath === '/') return true;
  if (itemTo !== '/' && (currentPath === itemTo || currentPath.startsWith(itemTo + '/'))) return true;

  // Aliases mapping for accounts sub-routes
  if (itemTo === '/accounts-config/chart-of-accounts' && currentPath.startsWith('/chart-of-accounts')) return true;
  if (itemTo === '/accounts-config/voucher-setup' && (currentPath === '/vouchers' || currentPath.startsWith('/vouchers/'))) return true;
  if (itemTo === '/accounts-config/currency-setup' && currentPath.startsWith('/currency-setup')) return true;
  if (itemTo === '/accounts-config/subledger' && currentPath.startsWith('/subledger')) return true;
  if (itemTo === '/accounts-config/custom-field' && currentPath.startsWith('/custom-fields')) return true;
  if (itemTo === '/customers' && (currentPath.startsWith('/customers') || currentPath.startsWith('/accounts-receivable/customer-master'))) return true;
  if (itemTo === '/banks' && (currentPath.startsWith('/banks') || currentPath.startsWith('/branches') || currentPath.startsWith('/bank-management/bank-master-setup'))) return true;
  if (itemTo === '/cheque-setup' && currentPath.startsWith('/cheque-setup')) return true;
  if (itemTo === '/cheque-prepare/direct' && (currentPath.startsWith('/cheque-prepare') || currentPath.startsWith('/cheques'))) return true;
  if (itemTo === '/cheque-prepare/register' && currentPath === '/cheque-prepare/register') return true;
  if (itemTo === '/journal-entries' && (currentPath.startsWith('/journal-entries') || currentPath.startsWith('/journal-books/journal-entries'))) return true;
  if (itemTo === '/journal-books/journal-entries' && (currentPath.startsWith('/journal-entries') || currentPath.startsWith('/journal-books/journal-entries'))) return true;
  if (itemTo === '/recurring-journal' && (currentPath.startsWith('/recurring-journal') || currentPath.startsWith('/journal-books/recurring-journal'))) return true;
  if (itemTo === '/journal-books/recurring-journal' && (currentPath.startsWith('/recurring-journal') || currentPath.startsWith('/journal-books/recurring-journal'))) return true;
  if (itemTo === '/preset-journal' && (currentPath.startsWith('/preset-journal') || currentPath.startsWith('/journal-books/preset-journal'))) return true;
  if (itemTo === '/journal-books/preset-journal' && (currentPath.startsWith('/preset-journal') || currentPath.startsWith('/journal-books/preset-journal'))) return true;
  if (itemTo === '/bulk-upload' && (currentPath.startsWith('/bulk-upload') || currentPath.startsWith('/journal-books/bulk-data-upload'))) return true;
  if (itemTo === '/journal-books/bulk-data-upload' && (currentPath.startsWith('/bulk-upload') || currentPath.startsWith('/journal-books/bulk-data-upload'))) return true;
  if (itemTo === '/bulk-update' && (currentPath.startsWith('/bulk-update') || currentPath.startsWith('/journal-books/bulk-update'))) return true;
  if (itemTo === '/journal-books/bulk-update' && (currentPath.startsWith('/bulk-update') || currentPath.startsWith('/journal-books/bulk-update'))) return true;
  if (itemTo === '/accounts-report/journal' && (currentPath === '/accounts-report/journal' || currentPath.startsWith('/voucher-template'))) return true;

  return false;
}

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const scrollRef = useRef<HTMLElement>(null);
  const isTransitioning = useRef(false);

  // Default open state for parent and child menus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};

    // Only auto-open if landed directly on a specific subroute (not root /)
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      const activePath = window.location.pathname;
      nav.forEach((item) => {
        if (item.subitems) {
          item.subitems.forEach((sub) => {
            if (isPathActive(sub.to, activePath)) {
              initial[item.label] = true;
            }
            if (sub.subitems) {
              sub.subitems.forEach((nested) => {
                if (isPathActive(nested.to, activePath)) {
                  initial[item.label] = true;
                  initial[sub.label] = true;
                }
              });
            }
          });
        }
      });
    }

    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("sidebar_menus_pakiza_accounts_v4");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...initial, ...parsed };
        } catch (e) {}
      }
    }
    return initial;
  });

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem("sidebar_menus_pakiza_accounts_v4", JSON.stringify(openMenus));
    }
  }, [openMenus]);

  // Restore and maintain scroll position perfectly
  useEffect(() => {
    if (typeof window !== "undefined" && scrollRef.current) {
      const savedScroll = sessionStorage.getItem("sidebar_scroll_pakiza_accounts_v4");
      if (savedScroll) {
        const targetScroll = parseInt(savedScroll, 10);
        scrollRef.current.scrollTop = targetScroll;
        const timer = setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = targetScroll;
          }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (isTransitioning.current) return;
    sessionStorage.setItem(
      "sidebar_scroll_pakiza_accounts_v4",
      e.currentTarget.scrollTop.toString()
    );
  };

  const handleNavClick = () => {
    isTransitioning.current = true;
    setTimeout(() => {
      isTransitioning.current = false;
    }, 300);
  };

  const toggleMenu = (label: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="hidden lg:flex w-[280px] h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 select-none">
      {/* Brand Header */}
      <Link
        to="/"
        className="px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80 group transition-all duration-300 hover:bg-sidebar-accent/30 cursor-pointer relative z-50 shrink-0"
      >
        {/* Hover Tooltip */}
        <div className="absolute left-[70px] top-[80%] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
          <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <LayoutDashboard className="size-3" />
            Switch to Another Module
          </div>
        </div>

        {/* 3D Flip Logo */}
        <div className="relative size-8.5 rounded-xl text-sm tracking-tight [perspective:1000px]">
          <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front: Logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow font-extrabold text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)] flex items-center justify-center rounded-xl [backface-visibility:hidden]">
              P
            </div>
            {/* Back: Back Button */}
            <div className="absolute inset-0 bg-sidebar-primary text-primary-foreground flex items-center justify-center rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-md border-2 border-primary/20">
              <ArrowLeft className="size-4.5" />
            </div>
          </div>
        </div>

        <div className="leading-tight">
          <div className="font-extrabold tracking-tight text-[13px] text-sidebar-foreground group-hover:text-primary transition-colors duration-300">
            PAKIZA
          </div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-sidebar-primary">
            ACCOUNTS
          </div>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={handleNavClick}
        className="flex-1 min-h-0 px-3 py-3 space-y-1 overflow-y-auto overscroll-contain sidebar-scroll"
      >
        <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45 flex items-center justify-between">
          <span>Workspace</span>
          <span className="text-[8px] font-semibold text-sidebar-foreground/35 uppercase tracking-normal">
            Ready &amp; Planned
          </span>
        </div>

        {nav.map((item) => {
          const Icon = item.icon;

          // Determine parent active state dynamically
          const isParentActive =
            isPathActive(item.to, currentPath) ||
            (item.subitems &&
              item.subitems.some((sub) => {
                if (isPathActive(sub.to, currentPath)) return true;
                if (
                  sub.subitems &&
                  sub.subitems.some((nested) => isPathActive(nested.to, currentPath))
                ) {
                  return true;
                }
                return false;
              }));

          if (!item.subitems) {
            const active = isPathActive(item.to, currentPath);
            const ready = isRouteReady(item.to);

            return (
              <div
                key={item.label}
                className="border-b border-sidebar-border/30 last:border-0 pb-1"
              >
                <Link
                  to={item.to || "/"}
                  className={[
                    "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all duration-200",
                    active
                      ? "bg-primary/15 text-primary font-bold shadow-2xs border-l-[3px] border-primary"
                      : ready
                      ? "text-sidebar-foreground/90 font-medium hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/40 font-normal hover:bg-sidebar-accent/30 hover:text-sidebar-foreground/70",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "size-3.5 transition-transform duration-300 group-hover:scale-110",
                      active
                        ? "text-primary"
                        : ready
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/35",
                    ].join(" ")}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && (
                    <span className="ml-auto size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] animate-pulse shrink-0" />
                  )}
                </Link>
              </div>
            );
          }

          const isOpen = !!openMenus[item.label];

          return (
            <div
              key={item.label}
              className="space-y-0.5 border-b border-sidebar-border/30 last:border-0 pb-1"
            >
              {/* Level 1: Main Category Header */}
              <button
                onClick={(e) => toggleMenu(item.label, e)}
                className={[
                  "w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-left transition-all duration-200 cursor-pointer",
                  isParentActive
                    ? "bg-sidebar-accent/40 text-sidebar-accent-foreground font-bold border-l-2 border-primary/60"
                    : "text-sidebar-foreground/85 font-semibold hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "size-3.5 shrink-0 transition-colors duration-300 group-hover:scale-110",
                    isParentActive
                      ? "text-primary font-black"
                      : "text-sidebar-foreground/60 group-hover:text-sidebar-primary",
                  ].join(" ")}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md mr-1 leading-none border border-amber-500/20">
                    {item.count}
                  </span>
                )}
                {isOpen ? (
                  <ChevronDown className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300 rotate-180 shrink-0" />
                ) : (
                  <ChevronRight className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300 shrink-0" />
                )}
              </button>

              {/* Level 1 Subitems Container */}
              <div
                className={[
                  "overflow-hidden transition-all duration-300 space-y-0.5 pl-3.5 bg-sidebar-accent/25 rounded-xl",
                  isOpen ? "max-h-[1600px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0 py-0 m-0",
                ].join(" ")}
              >
                {item.subitems.map((sub) => {
                  if (sub.subitems) {
                    const isSubOpen = !!openMenus[sub.label];
                    const isSubActive = sub.subitems.some((nested) => isPathActive(nested.to, currentPath));

                    return (
                      <div key={sub.label} className="space-y-0.5">
                        {/* Level 2 Sub-Group Header */}
                        <button
                          onClick={(e) => toggleMenu(sub.label, e)}
                          className={[
                            "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] transition-all duration-150 cursor-pointer",
                            isSubActive
                              ? "text-primary font-bold bg-primary/5"
                              : "text-sidebar-foreground/75 font-medium hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <File
                              className={[
                                "size-3 shrink-0",
                                isSubActive
                                  ? "text-primary font-black"
                                  : "text-sidebar-foreground/45",
                              ].join(" ")}
                            />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {isSubOpen ? (
                            <ChevronDown className="size-3 text-sidebar-foreground/45 transition-transform duration-300 rotate-180 shrink-0 ml-1" />
                          ) : (
                            <ChevronRight className="size-3 text-sidebar-foreground/45 transition-transform duration-300 shrink-0 ml-1" />
                          )}
                        </button>

                        {/* Level 3 Nested Subitems List */}
                        <div
                          className={[
                            "overflow-hidden transition-all duration-300 space-y-0.5 pl-4 border-l border-sidebar-border/30 ml-3",
                            isSubOpen
                              ? "max-h-[600px] opacity-100 py-0.5 mt-0.5"
                              : "max-h-0 opacity-0 py-0 m-0",
                          ].join(" ")}
                        >
                          {sub.subitems.map((nested) => {
                            const isNestedActive = isPathActive(nested.to, currentPath);
                            const isNestedReady = isRouteReady(nested.to);

                            return (
                              <Link
                                key={nested.label}
                                to={nested.to || "#"}
                                className={[
                                  "group flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10.5px] transition-all duration-150",
                                  isNestedActive
                                    ? "bg-primary/15 text-primary font-bold shadow-2xs border-l-2 border-primary pl-2"
                                    : isNestedReady
                                    ? "text-sidebar-foreground/85 font-medium hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/40 font-normal hover:bg-sidebar-accent/20 hover:text-sidebar-foreground/60",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                                    isNestedActive
                                      ? "bg-primary shadow-[0_0_6px_var(--primary)]"
                                      : isNestedReady
                                      ? "bg-sidebar-foreground/40 group-hover:bg-primary"
                                      : "bg-sidebar-foreground/20",
                                  ].join(" ")}
                                />
                                <span className="truncate flex-1">{nested.label}</span>

                                {/* Visual indicator if not ready */}
                                {!isNestedReady && (
                                  <span className="text-[8px] font-semibold tracking-tight text-sidebar-foreground/35 px-1 py-0.2 rounded bg-sidebar-foreground/5 shrink-0 select-none">
                                    Soon
                                  </span>
                                )}

                                {isNestedActive && (
                                  <span className="size-1.5 rounded-full bg-primary animate-pulse shrink-0 ml-auto" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // Non-nested level 2 item (Direct Link)
                  const isSubActive = isPathActive(sub.to, currentPath);
                  const isSubReady = isRouteReady(sub.to);

                  return (
                    <Link
                      key={sub.label}
                      to={sub.to || "/"}
                      className={[
                        "group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] transition-all duration-150",
                        isSubActive
                          ? "bg-primary/15 text-primary font-bold shadow-2xs border-l-2 border-primary pl-2.5"
                          : isSubReady
                          ? "text-sidebar-foreground/85 font-medium hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/40 font-normal hover:bg-sidebar-accent/20 hover:text-sidebar-foreground/60",
                      ].join(" ")}
                    >
                      <File
                        className={[
                          "size-3 shrink-0 transition-colors",
                          isSubActive
                            ? "text-primary font-black"
                            : isSubReady
                            ? "text-sidebar-foreground/50 group-hover:text-sidebar-primary"
                            : "text-sidebar-foreground/30",
                        ].join(" ")}
                      />
                      <span className="truncate flex-1">{sub.label}</span>

                      {/* Visual indicator if not ready */}
                      {!isSubReady && (
                        <span className="text-[8px] font-semibold tracking-tight text-sidebar-foreground/35 px-1 py-0.2 rounded bg-sidebar-foreground/5 shrink-0 select-none">
                          Soon
                        </span>
                      )}

                      {isSubActive && (
                        <span className="size-1.5 rounded-full bg-primary animate-pulse shrink-0 ml-auto" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Settings & User Profile */}
      <div className="p-3 border-t border-sidebar-border/60 space-y-1 bg-sidebar-accent/15 shrink-0">
        <Link
          to="/"
          className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all"
        >
          <Settings className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
          Settings
        </Link>
        <Link
          to="/"
          className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all"
        >
          <LifeBuoy className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
          Help & Support
        </Link>
        <button
          onClick={() => {
            alert("Logging out from Pakiza Accounts session.");
          }}
          className="w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all text-left cursor-pointer"
        >
          <LogOut className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 text-rose-500" />
          <span className="text-rose-500/90 group-hover:text-rose-500 transition-colors">
            Log Out
          </span>
        </button>

        {/* User Badge */}
        <div className="mt-2.5 mx-1 p-2.5 rounded-xl bg-sidebar-accent/50 border border-sidebar-border hover:border-sidebar-border/80 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-[10px] font-bold text-primary-foreground shadow-sm">
                TAS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-success border-2 border-sidebar shadow-[0_0_6px_var(--success)]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-sidebar-foreground truncate">
                Tahmid Afsar Shapno
              </div>
              <div className="text-[9px] text-sidebar-foreground/60 truncate font-semibold">
                Head of Accounts & Finance
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
