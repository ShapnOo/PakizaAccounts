import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  MessagesSquare,
  Sun,
  Moon,
  CornerDownLeft,
  SlidersHorizontal,
  FileSpreadsheet,
  Layers,
  FileText,
  User,
  Globe,
  Check,
  RefreshCw,
  LayoutDashboard,
  Coins,
  CreditCard,
  TrendingUp,
  Landmark,
  BookOpen,
  Network,
} from "lucide-react";
import { ModuleLauncher } from "./ModuleLauncher";

interface SearchMenuLink {
  label: string;
  parent: string;
  to: string;
  description?: string;
}

const searchableMenus: SearchMenuLink[] = [
  { label: "Dashboard Overview", parent: "Home", to: "/" },

  // Accounts Configuration & Setup
  {
    label: "Master Configuration (F&A)",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/master-config",
    description: "Core financial entities, tax codes, and accounting definitions",
  },
  {
    label: "Financial Period Setup",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/financial-period-setup",
    description: "Fiscal year, periods, and monthly accounting lock calendars",
  },
  {
    label: "Chart of Accounts",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/chart-of-accounts",
    description: "COA account heads, trees, assets, liabilities, and equity groups",
  },
  {
    label: "Opening Balance",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/opening-balance",
    description: "Fiscal opening balances and historical trial balance migration",
  },
  {
    label: "Voucher Setup",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/voucher-setup",
    description: "Journal, payment, receipt, and contra voucher numbering prefixes",
  },
  {
    label: "Currency Setup",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/currency-setup",
    description: "Multi-currency rates, conversion policies, and foreign exchange",
  },
  {
    label: "Subledger",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/subledger",
    description: "Customer, vendor, employee, and cost center subledger classifications",
  },
  {
    label: "Voucher Approval Setup",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/voucher-approval-setup",
    description: "Multi-tiered financial voucher verification & sanction workflows",
  },
  {
    label: "Custom Field",
    parent: "Master Configuration & Setup (F&A)",
    to: "/accounts-config/custom-field",
    description: "User-defined attributes, project tags, and custom metadata",
  },

  // Accounts Report Customization
  {
    label: "Journal",
    parent: "Accounts Report Customization",
    to: "/accounts-report/journal",
    description: "General journal transaction ledger and audit posting reports",
  },
  {
    label: "General Ledger",
    parent: "Accounts Report Customization",
    to: "/accounts-report/general-ledger",
    description: "Detailed account head debit/credit activity with date filters",
  },
  {
    label: "Income Statement",
    parent: "Accounts Report Customization",
    to: "/accounts-report/income-statement",
    description: "Profit & Loss statement, operational revenue and expenses breakdown",
  },
  {
    label: "Balance Sheet",
    parent: "Accounts Report Customization",
    to: "/accounts-report/balance-sheet",
    description: "Corporate financial balance sheet, current assets and liabilities",
  },

  // Accounts Integration Configuration
  {
    label: "HR Integration Configuration",
    parent: "Accounts Integration Configuration",
    to: "/accounts-integration-config/hr",
    description: "Payroll salary sheets, provident fund, and bonus automated ledger sync",
  },
  {
    label: "Purchase Integration Configuration",
    parent: "Accounts Integration Configuration",
    to: "/accounts-integration-config/purchase",
    description: "Procurement purchase order and supplier bill automated vouchers",
  },
  {
    label: "Inventory Integration Configuration",
    parent: "Accounts Integration Configuration",
    to: "/accounts-integration-config/inventory",
    description: "Store MRR, issue, consumption, and yarn stock valuation integration",
  },
  {
    label: "Sales Integration Configuration",
    parent: "Accounts Integration Configuration",
    to: "/accounts-integration-config/sales",
    description: "Commercial sales invoice and accounts receivable automated entry",
  },
  {
    label: "Production Integration Configuration",
    parent: "Accounts Integration Configuration",
    to: "/accounts-integration-config/production",
    description: "Batch production costing, work-in-progress (WIP), and manufacturing sync",
  },

  // Accounts Payable Management (Purchase)
  {
    label: "Supplier Master Setup",
    parent: "Accounts Payable Management",
    to: "/accounts-payable/supplier-master-setup",
    description: "Configure vendors, terms, credit limits, and payment methods",
  },
  {
    label: "Supplier Master List",
    parent: "Accounts Payable Management",
    to: "/accounts-payable/supplier-master-list",
    description: "Directory of registered corporate suppliers and trade payables",
  },

  // Accounts Receivable Management (Sales)
  {
    label: "Customer Master Setup",
    parent: "Accounts Receivable Management",
    to: "/customers",
    description: "Customer onboarding, billing profiles, and credit policies",
  },
  {
    label: "Customer Master List",
    parent: "Accounts Receivable Management",
    to: "/customers",
    description: "Complete list of accounts receivable debtors and customer balances",
  },

  // Bank Management
  {
    label: "Bank Master Setup",
    parent: "Bank Management",
    to: "/bank-management/bank-master-setup",
    description: "Corporate bank accounts, branch details, and routing codes",
  },
  {
    label: "Cheque Setup",
    parent: "Bank Management",
    to: "/bank-management/cheque-setup",
    description: "Cheque leaf registration, books, and serial prefixes",
  },
  {
    label: "Cheque Preparation & Payment",
    parent: "Bank Management",
    to: "/bank-management/cheque-preparation-payment",
    description: "Generate bank payment cheques, print leaves, and voucher sync",
  },
  {
    label: "Bank Reconciliation",
    parent: "Bank Management",
    to: "/bank-management/bank-reconciliation",
    description: "Match book balance with bank statement balances automatically",
  },

  // Journal Books
  {
    label: "Journal Entries",
    parent: "Journal Books",
    to: "/journal-books/journal-entries",
    description: "General debit/credit double entry voucher posting",
  },
  {
    label: "Recurring Journal",
    parent: "Journal Books",
    to: "/journal-books/recurring-journal",
    description: "Automate scheduled monthly accruals and recurring entries",
  },
  {
    label: "Preset Journal",
    parent: "Journal Books",
    to: "/journal-books/preset-journal",
    description: "Pre-configured accounting transaction templates",
  },
  {
    label: "Bulk Data Upload",
    parent: "Journal Books",
    to: "/journal-books/bulk-data-upload",
    description: "Import multi-line transactions and voucher records via Excel/CSV",
  },
  {
    label: "Bulk Update",
    parent: "Journal Books",
    to: "/journal-books/bulk-update",
    description: "Batch update voucher heads, dimensions, or approval states",
  },

  // Treasury Management
  {
    label: "Forecasting Accounts",
    parent: "Treasury Management",
    to: "/treasury-management/forecasting-accounts",
    description: "Cash flow projections, incoming receivables, and outgoing commitments",
  },
  {
    label: "Budgeting",
    parent: "Treasury Management",
    to: "/treasury-management/budgeting",
    description: "Departmental fiscal budgets, allocations, and variance tracking",
  },

  // Accounts Integration
  {
    label: "Cash Requisition",
    parent: "Accounts Integration (HR)",
    to: "/accounts-integration/hr/cash-requisition",
    description: "Approve petty cash and office expenditure requisitions",
  },
  {
    label: "Cash Payment",
    parent: "Accounts Integration (HR)",
    to: "/accounts-integration/hr/cash-payment",
    description: "Disburse approved cash vouchers and record cash ledger transactions",
  },
  {
    label: "Salary Disbursement",
    parent: "Accounts Integration (HR)",
    to: "/accounts-integration/hr/salary-disbursement",
    description: "Post bank/cash salary payments generated from HR payroll",
  },
  {
    label: "Local Bill Disbursement",
    parent: "Accounts Integration (Purchase)",
    to: "/accounts-integration/purchase/local-bill-disbursement",
    description: "Settle verified domestic supplier procurement bills",
  },
  {
    label: "Import Disbursement",
    parent: "Accounts Integration (Purchase)",
    to: "/accounts-integration/purchase/import-disbursement",
    description: "Foreign supplier commercial remittances and landed cost settlement",
  },
  {
    label: "BBLC Disbursement",
    parent: "Accounts Integration (Purchase)",
    to: "/accounts-integration/purchase/bblc-disbursement",
    description: "Back-to-back letter of credit maturity payments and banking acceptance",
  },
  {
    label: "Inventory Transaction Posting",
    parent: "Accounts Integration (Inventory)",
    to: "/accounts-integration/inventory/transaction-posting",
    description: "Post store receipts, production issues, and inventory adjustments",
  },
  {
    label: "Local Sales Collection",
    parent: "Accounts Integration (Sales)",
    to: "/accounts-integration/sales/local-sales-collection",
    description: "Record domestic receivables collections and money receipts",
  },
  {
    label: "Deemed Export Realization",
    parent: "Accounts Integration (Sales)",
    to: "/accounts-integration/sales/deemed-export-realization",
    description: "Process in-country indirect export proceeds and realization",
  },
  {
    label: "Export Realization",
    parent: "Accounts Integration (Sales)",
    to: "/accounts-integration/sales/export-realization",
    description: "Direct foreign export bill realization, foreign currency conversion",
  },
  {
    label: "Production Integration",
    parent: "Accounts Integration",
    to: "/accounts-integration/production",
    description: "Sync factory shop floor production costing and finished goods valuation",
  },

  // Reports - Ledger
  {
    label: "Bulk Voucher Print",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/bulk-voucher-print",
    description: "Print batch accounting vouchers across selected date ranges",
  },
  {
    label: "General Ledger",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/general-ledger",
    description: "Comprehensive account ledger statements with running balance",
  },
  {
    label: "Day Book",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/day-book",
    description: "Daily accounting transaction activity and journal log",
  },
  {
    label: "Cash Book",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/cash-book",
    description: "Real-time cash in hand records, debit/credit receipts and payments",
  },
  {
    label: "Receipt and Payments Statement",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/receipt-and-payments-statement",
    description: "Periodic consolidated summary of all organizational receipts and payments",
  },
  {
    label: "Employee Ledger",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/employee-ledger",
    description: "Individual employee advance, loan, and claim disbursement ledgers",
  },
  {
    label: "Supplier Ledger",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/supplier-ledger",
    description: "Vendor payable statement, billing adjustments, and paid vouchers",
  },
  {
    label: "Customer Ledger",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/customer-ledger",
    description: "Accounts receivable debtor transactions, invoices, and realization",
  },
  {
    label: "Trial Balance",
    parent: "Reports (Ledger)",
    to: "/reports/ledger/trial-balance",
    description: "Complete trial balance report with opening, movement, and closing",
  },

  // Reports - Financial Statement
  {
    label: "Income Statement",
    parent: "Reports (Financial Statement)",
    to: "/reports/financial-statement/income-statement",
    description: "Profit & loss, gross margin, operating expenditure, and net earnings",
  },
  {
    label: "Retained Earnings Statement",
    parent: "Reports (Financial Statement)",
    to: "/reports/financial-statement/retained-earnings-statement",
    description: "Equity movement, dividend distributions, and retained corporate profits",
  },
  {
    label: "Balance Sheet",
    parent: "Reports (Financial Statement)",
    to: "/reports/financial-statement/balance-sheet",
    description: "Assets, liabilities, and owner's equity financial position",
  },
  {
    label: "Cash Flow Statement (Indirect)",
    parent: "Reports (Financial Statement)",
    to: "/reports/financial-statement/cash-flow-statement-indirect",
    description: "Indirect cash flow from operations, investing, and financing",
  },

  // Reports - Management Report
  {
    label: "Budget Analysis",
    parent: "Reports (Management Report)",
    to: "/reports/management-report/budget-analysis",
    description: "Actual vs budget expenditure variance and performance metrics",
  },
  {
    label: "Cash Flow Analysis",
    parent: "Reports (Management Report)",
    to: "/reports/management-report/cash-flow-analysis",
    description: "Liquidity ratios, burn rate, and projected working capital",
  },
  {
    label: "Comparison Analysis",
    parent: "Reports (Management Report)",
    to: "/reports/management-report/comparison-analysis",
    description: "Multi-period and year-over-year financial performance comparisons",
  },
  {
    label: "Dashboard",
    parent: "Reports (Management Report)",
    to: "/reports/management-report/dashboard",
    description: "Executive financial summary KPIs and visual accounting charts",
  },

  // Reports - Additional Report
  {
    label: "Reference Center",
    parent: "Reports (Additional Report)",
    to: "/reports/additional-report/reference-center",
    description: "Reference tagging and audit trail cross-referencing",
  },
  {
    label: "Cost Center",
    parent: "Reports (Additional Report)",
    to: "/reports/additional-report/cost-center",
    description: "Cost center allocation, direct/indirect department overheads",
  },
  {
    label: "Vehicle",
    parent: "Reports (Additional Report)",
    to: "/reports/additional-report/vehicle",
    description: "Fleet logistics fuel, maintenance, and vehicle cost analytics",
  },
];

function getCategoryIcon(parent: string) {
  if (parent.includes("Master Configuration") || parent.includes("Configuration")) return SlidersHorizontal;
  if (parent.includes("Report")) return FileSpreadsheet;
  if (parent.includes("Payable")) return CreditCard;
  if (parent.includes("Receivable")) return TrendingUp;
  if (parent.includes("Bank")) return Landmark;
  if (parent.includes("Journal")) return BookOpen;
  if (parent.includes("Treasury")) return Coins;
  if (parent.includes("Integration")) return Network;
  return LayoutDashboard;
}

export function Topbar() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // Global Command Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Profile dropdown states
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Notifications
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Keypress event listener for keyboard shortcut Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const inputEl = document.getElementById("global-menu-search-input");
        inputEl?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter list matching current input query
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return searchableMenus.slice(0, 6);
    }
    return searchableMenus.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.parent.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.to.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredResults[focusedIndex];
      if (selected) {
        setIsSearchOpen(false);
        setSearchQuery("");
        window.location.href = selected.to;
      }
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".global-search-container")) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  // Dynamic Greeting based on time of day
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <header className="h-14 px-5 flex items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300 shadow-2xs">
      <div>
        <h1 className="text-sm font-bold tracking-tight text-foreground">{greeting}, Shapno 👋</h1>
        <p className="text-[11px] text-muted-foreground/90 font-medium font-sans">
          Here's what's happening across your organization today.
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Interactive Global Menu Search Container */}
        <div className="relative hidden md:block global-search-container">
          <div className="relative group">
            <Search className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              id="global-menu-search-input"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search menus (e.g. Bank Reconciliation, Journal, COA...)"
              className="w-76 focus:w-88 pl-10 pr-14 h-9.5 rounded-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 focus:border-primary/80 focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none text-xs transition-all duration-300 font-sans font-bold"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black px-2 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 shadow-2xs select-none pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Search Result Popover List */}
          {isSearchOpen && (
            <div className="absolute right-0 top-11.5 w-[420px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header inside popover */}
              <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-500 animate-pulse">⚡</span>
                  <span>
                    {searchQuery
                      ? `Matching Menus (${filteredResults.length})`
                      : "Quick Access Menus"}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-[8.5px] font-bold lowercase tracking-normal">
                  esc to close
                </span>
              </div>

              {/* Scrollable list items */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredResults.map((item, idx) => {
                  const isFocused = idx === focusedIndex;
                  const CategoryIcon = getCategoryIcon(item.parent);

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className={`w-full group text-left flex items-center gap-3 p-2.5 rounded-xl transition duration-150 border ${
                        isFocused
                          ? "bg-primary/[0.08] dark:bg-primary/[0.12] border-primary/20 text-primary"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-900/40 border-transparent text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {/* Left: Category Icon Box */}
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-300 ${
                          isFocused ? "scale-105" : ""
                        } bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400`}
                      >
                        <CategoryIcon className="size-4" />
                      </div>

                      {/* Middle: Text details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black tracking-tight leading-none">
                            {item.label}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider scale-90 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {item.parent}
                          </span>
                        </div>
                        {item.description && (
                          <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-tight">
                            {item.description}
                          </div>
                        )}
                      </div>

                      {/* Right: Enter key badge */}
                      {isFocused && (
                        <div className="flex items-center gap-1.5 text-[8px] font-black px-2 py-1 rounded-md bg-primary text-white shadow-xs animate-pulse">
                          <span>Enter</span>
                          <CornerDownLeft className="size-2.5" />
                        </div>
                      )}
                    </Link>
                  );
                })}

                {filteredResults.length === 0 && (
                  <div className="px-4 py-8 text-center text-slate-400 font-bold text-[10.5px]">
                    No corporate menus found matching query.
                  </div>
                )}
              </div>

              {/* Search Instructions Bar */}
              <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 text-[9px] text-slate-400 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>↑↓</span>
                  <span>to navigate</span>
                </span>
                <span>Enter to open</span>
              </div>
            </div>
          )}
        </div>

        {/* Modules Launcher */}
        <ModuleLauncher />

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200 cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="size-4.5 text-primary transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Refresh / Reset Data */}
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200 cursor-pointer"
          title="Refresh Session"
        >
          <RefreshCw className="size-4.5 text-primary hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* Messages */}
        <button className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200 cursor-pointer">
          <MessagesSquare className="size-4.5" />
        </button>

        {/* Notification Bell */}
        <div className="relative flex items-center mr-1" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((v) => !v)}
            className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200 cursor-pointer"
            title="Accounting Notifications"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-1 left-1.5 px-1 py-0.2 text-[8px] font-extrabold bg-[#1e40af] dark:bg-blue-600 text-white rounded shadow-2xs min-w-[12px] text-center">
              1
            </span>
          </button>

          {isNotifOpen && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] w-[360px] z-50 rounded-2xl border shadow-2xl overflow-hidden bg-card"
            >
              <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between bg-primary/5">
                <span className="text-xs font-black text-foreground">Accounts Notifications</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-primary/10 text-primary rounded-full">1 New</span>
              </div>
              <div className="p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Fiscal Period 2026 Ready</p>
                <p className="text-[11px] mt-0.5">Financial Period and Chart of Accounts are configured for the upcoming year.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Block */}
        <div className="relative pl-3.5 border-l border-border/60">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 hover:opacity-85 transition-opacity text-left cursor-pointer focus:outline-none"
          >
            <div className="text-right hidden lg:block">
              <div className="text-xs font-bold text-foreground">Tahmid Afsar</div>
              <div className="text-[9px] font-bold text-muted-foreground/85 mt-0.5">
                Pakiza Software Limited (PSL-Operation)
              </div>
            </div>
            <div className="size-9 rounded-full overflow-hidden border border-border/80 shadow-2xs flex-shrink-0 bg-muted">
              <img
                src="https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg"
                alt="Tahmid Afsar"
                className="size-full object-cover"
              />
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border z-50 p-1.5 bg-card border-border shadow-xl focus:outline-none"
              >
                <div className="px-3 py-2 border-b border-border/60 mb-1">
                  <p className="text-xs font-extrabold text-foreground">Tahmid Afsar</p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    tahmid@pakizasoftware.com
                  </p>
                </div>

                <Link
                  to="/"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted text-foreground transition-colors text-left"
                >
                  <User className="size-4 text-primary" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    alert("Region configuration settings are currently locked.");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted text-foreground transition-colors text-left cursor-pointer"
                >
                  <Globe className="size-4 text-muted-foreground" />
                  <span>Change Region</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
