import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { OverviewDashboardPage } from "./pages/dashboard";
import { MasterConfigPage } from "./pages/master-config";
import { CoaListPage } from "./pages/coa/List";
import { CoaTreePage } from "./pages/coa/Tree";
import { CoaCreatePage } from "./pages/coa/Create";
import { CoaProvider } from "./context/CoaContext";
import { VoucherProvider } from "./context/VoucherContext";
import { VoucherListPage } from "./pages/vouchers/List";
import { VoucherSetupPage } from "./pages/vouchers/Setup";
import { VoucherEntryPage } from "./pages/vouchers/Entry";
import { OpeningBalanceEntryPage } from "./pages/opening-balance/Entry";
import { ExchangeRateListPage } from "./pages/currency/ExchangeRateList";
import { CurrencySetupFormPage } from "./pages/currency/CurrencySetupForm";
import { SubledgerListPage } from "./pages/subledger/SubledgerList";
import { SubledgerFormPage } from "./pages/subledger/SubledgerForm";
import { CustomFieldBuilderPage } from "./pages/custom-fields/Builder";
import { CustomFieldFormPage } from "./pages/custom-fields/Form";
import { VoucherTemplateDesignerPage } from "./pages/voucher-template/Designer";
import { CustomerListPage } from "./pages/customers/List";
import { CustomerFormPage } from "./pages/customers/Form";
import { BankSetupList } from "./pages/banks/List";
import { BranchForm } from "./pages/banks/BranchForm";
import { ChequesLandingPage } from "./pages/cheques/Landing";
import { BookListPage } from "./pages/cheques/BookList";
import { BookSetupFormPage } from "./pages/cheques/BookSetupForm";
import { PrepareDirectPage } from "./pages/cheques/PrepareDirect";
import { PrepareBillPage } from "./pages/cheques/PrepareBill";
import { PrepareIouPage } from "./pages/cheques/PrepareIou";
import { ChequePrintPage } from "./pages/cheques/ChequePrint";
import { RegisterPage } from "./pages/cheques/Register";
import { JournalEntriesListPage } from "./pages/journal-entries/List";
import { JournalEntryPage } from "./pages/journal-entries/Entry";
import { JournalEntryPrintPage } from "./pages/journal-entries/Print";
import { RecurringJournalListPage } from "./pages/recurring-journal/List";
import { RecurringJournalFormPage } from "./pages/recurring-journal/Form";
import { PresetJournalListPage } from "./pages/preset-journal/List";
import { PresetJournalFormPage } from "./pages/preset-journal/Form";
import { BulkUploadPage } from "./pages/bulk-upload/Index";
import { BulkUpdatePage } from "./pages/bulk-update/Index";
import { SlidersHorizontal, ArrowRight, Settings, FolderTree, Receipt, Scale, Coins, Layers, ListFilter, FileText, UserCheck, Landmark, BookOpen, Repeat, UploadCloud, RefreshCw } from "lucide-react";
import { Toaster } from "sonner";

function ContentArea() {
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentTitle =
    pathParts.length > 0
      ? pathParts[pathParts.length - 1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Dashboard Overview";

  return (
    <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-center items-center text-center">
      <div className="max-w-xl p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <SlidersHorizontal className="size-3.5" />
          <span>Pakiza Accounts Module</span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-foreground">
          {currentTitle}
        </h2>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Active route:{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px] text-foreground font-bold">
            {location.pathname}
          </code>
        </p>

        <div className="pt-3 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/accounts-config/master-config"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Settings className="size-3.5" />
              <span>Master Configuration (F&A)</span>
            </Link>

            <Link
              to="/chart-of-accounts"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-bold shadow-sm hover:bg-muted transition-all cursor-pointer"
            >
              <FolderTree className="size-3.5 text-primary" />
              <span>Chart of Accounts (COA)</span>
            </Link>

            <Link
              to="/vouchers"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-700 text-xs font-bold shadow-sm hover:bg-indigo-100/60 transition-all cursor-pointer"
            >
              <Receipt className="size-3.5 text-indigo-600" />
              <span>Voucher Setup & Entry</span>
            </Link>

            <Link
              to="/subledger"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-white text-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Layers className="size-3.5 text-indigo-600" />
              <span>Subledger Management</span>
            </Link>

            <Link
              to="/custom-fields"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-700 text-xs font-bold shadow-sm hover:bg-indigo-100/60 transition-all cursor-pointer"
            >
              <ListFilter className="size-3.5 text-indigo-600" />
              <span>Custom Field Builder</span>
            </Link>

            <Link
              to="/accounts-report/journal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-white text-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FileText className="size-3.5 text-indigo-600" />
              <span>Voucher Print Template</span>
            </Link>

            <Link
              to="/customers"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-700 text-xs font-bold shadow-sm hover:bg-indigo-100/60 transition-all cursor-pointer"
            >
              <UserCheck className="size-3.5 text-indigo-600" />
              <span>Customer Master Setup</span>
            </Link>

            <Link
              to="/banks"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-white text-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Landmark className="size-3.5 text-indigo-600" />
              <span>Bank & Branch Setup</span>
            </Link>

            <Link
              to="/cheques/books"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-700 text-xs font-bold shadow-sm hover:bg-indigo-100/60 transition-all cursor-pointer"
            >
              <BookOpen className="size-3.5 text-indigo-600" />
              <span>Cheque Setup & Management</span>
            </Link>

            <Link
              to="/journal-entries"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <FileText className="size-3.5" />
              <span>Journal Entries (All Vouchers)</span>
            </Link>

            <Link
              to="/recurring-journal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-white text-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Repeat className="size-3.5 text-indigo-600" />
              <span>Recurring Journal Schedules</span>
            </Link>
          </div>

          <div className="text-[12px] text-muted-foreground/80 flex items-center justify-center gap-2">
            <span>Dynamic Schema & Print Template Designer</span>
            <ArrowRight className="size-3.5" />
            <span className="font-semibold text-foreground">Journal • Payment • Receive • Contra</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CoaProvider>
        <VoucherProvider>
          <Toaster position="top-right" richColors />
          <div className="h-screen w-screen flex bg-background text-foreground transition-colors duration-300 overflow-hidden">
            {/* Left: Fixed Sidebar */}
            <Sidebar />

            {/* Right: Header + Scrollable Content */}
            <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-x-hidden overflow-y-auto sidebar-scroll">
                <Routes>
                  {/* Dashboard Routes */}
                  <Route path="/" element={<OverviewDashboardPage />} />
                  <Route path="/dashboard" element={<OverviewDashboardPage />} />
                  <Route path="/management-dashboard" element={<OverviewDashboardPage />} />
                  <Route path="/user-dashboard" element={<OverviewDashboardPage />} />

                  <Route path="/accounts-config/master-config" element={<MasterConfigPage />} />
                  
                  {/* Chart of Accounts Routes */}
                  <Route path="/chart-of-accounts" element={<CoaListPage />} />
                  <Route path="/accounts-config/chart-of-accounts" element={<Navigate to="/chart-of-accounts" replace />} />
                  <Route path="/chart-of-accounts/tree" element={<CoaTreePage />} />
                  <Route path="/chart-of-accounts/new" element={<CoaCreatePage />} />
                  <Route path="/chart-of-accounts/:id/edit" element={<CoaCreatePage />} />

                  {/* Voucher Routes */}
                  <Route path="/vouchers" element={<VoucherListPage />} />
                  <Route path="/accounts-config/voucher-setup" element={<Navigate to="/vouchers" replace />} />
                  <Route path="/vouchers/new" element={<VoucherSetupPage />} />
                  <Route path="/vouchers/:id/setup" element={<VoucherSetupPage />} />
                  
                  {/* 4 Voucher Entry forms driven by unified component */}
                  <Route path="/vouchers/entry/journal" element={<VoucherEntryPage forcedType="Journal Voucher" />} />
                  <Route path="/vouchers/entry/payment" element={<VoucherEntryPage forcedType="Payment Voucher" />} />
                  <Route path="/vouchers/entry/receive" element={<VoucherEntryPage forcedType="Receive Voucher" />} />
                  <Route path="/vouchers/entry/contra" element={<VoucherEntryPage forcedType="Contra Voucher" />} />
                  <Route path="/vouchers/entry/:type" element={<VoucherEntryPage />} />

                  {/* Journal Entries Module Routes */}
                  <Route path="/journal-entries" element={<JournalEntriesListPage />} />
                  <Route path="/journal-entries/new" element={<JournalEntryPage />} />
                  <Route path="/journal-entries/:id/edit" element={<JournalEntryPage />} />
                  <Route path="/journal-entries/:id/print" element={<JournalEntryPrintPage />} />
                  <Route path="/journal-books/journal-entries" element={<Navigate to="/journal-entries" replace />} />

                  {/* Recurring Journal Routes */}
                  <Route path="/recurring-journal" element={<RecurringJournalListPage />} />
                  <Route path="/recurring-journal/new" element={<RecurringJournalFormPage />} />
                  <Route path="/recurring-journal/:id/edit" element={<RecurringJournalFormPage />} />
                  <Route path="/journal-books/recurring-journal" element={<Navigate to="/recurring-journal" replace />} />

                  {/* Preset Journal Routes */}
                  <Route path="/preset-journal" element={<PresetJournalListPage />} />
                  <Route path="/preset-journal/new" element={<PresetJournalFormPage />} />
                  <Route path="/preset-journal/:id/edit" element={<PresetJournalFormPage />} />
                  <Route path="/journal-books/preset-journal" element={<Navigate to="/preset-journal" replace />} />

                  {/* Bulk Data Upload & Update Routes */}
                  <Route path="/bulk-upload" element={<BulkUploadPage />} />
                  <Route path="/journal-books/bulk-data-upload" element={<BulkUploadPage />} />
                  <Route path="/bulk-update" element={<BulkUpdatePage />} />
                  <Route path="/journal-books/bulk-update" element={<BulkUpdatePage />} />

                  {/* Opening Balance Routes */}
                  <Route path="/opening-balance" element={<OpeningBalanceEntryPage />} />
                  <Route path="/accounts-config/opening-balance" element={<OpeningBalanceEntryPage />} />

                  {/* Currency Setup Routes */}
                  <Route path="/currency-setup" element={<ExchangeRateListPage />} />
                  <Route path="/currency-setup/rates" element={<ExchangeRateListPage />} />
                  <Route path="/accounts-config/currency-setup" element={<Navigate to="/currency-setup" replace />} />
                  <Route path="/currency-setup/new" element={<CurrencySetupFormPage />} />
                  <Route path="/currency-setup/:id/edit" element={<CurrencySetupFormPage />} />

                  {/* Subledger Routes */}
                  <Route path="/subledger" element={<SubledgerListPage />} />
                  <Route path="/accounts-config/subledger" element={<Navigate to="/subledger" replace />} />
                  <Route path="/subledger/new" element={<SubledgerFormPage />} />
                  <Route path="/subledger/:id/edit" element={<SubledgerFormPage />} />

                  {/* Custom Field Routes */}
                  <Route path="/custom-fields" element={<CustomFieldBuilderPage />} />
                  <Route path="/accounts-config/custom-field" element={<Navigate to="/custom-fields" replace />} />
                  <Route path="/custom-fields/new" element={<CustomFieldFormPage />} />
                  <Route path="/custom-fields/:id/edit" element={<CustomFieldFormPage />} />

                  {/* Voucher Print Template Designer Routes */}
                  <Route path="/accounts-report/journal" element={<VoucherTemplateDesignerPage />} />
                  <Route path="/voucher-template" element={<VoucherTemplateDesignerPage />} />

                  {/* Customer Master Setup Routes */}
                  <Route path="/customers" element={<CustomerListPage />} />
                  <Route path="/accounts-receivable/customer-master-list" element={<Navigate to="/customers" replace />} />
                  <Route path="/customers/new" element={<CustomerFormPage />} />
                  <Route path="/accounts-receivable/customer-master-setup" element={<Navigate to="/customers/new" replace />} />
                  <Route path="/customers/:id/edit" element={<CustomerFormPage />} />

                  {/* Bank & Branch Setup Routes */}
                  <Route path="/banks" element={<BankSetupList />} />
                  <Route path="/bank-management/bank-master-setup" element={<Navigate to="/banks" replace />} />
                  <Route path="/banks/new" element={<BranchForm />} />
                  <Route path="/branches/new" element={<BranchForm />} />
                  <Route path="/branches/:id/edit" element={<BranchForm />} />

                  {/* Cheque Management Routes */}
                  <Route path="/cheques" element={<ChequesLandingPage />} />
                  <Route path="/cheques/books" element={<BookListPage />} />
                  <Route path="/cheques/books/new" element={<BookSetupFormPage />} />
                  <Route path="/cheques/books/:id/edit" element={<BookSetupFormPage />} />
                  <Route path="/cheques/prepare/direct" element={<PrepareDirectPage />} />
                  <Route path="/cheques/prepare/bill" element={<PrepareBillPage />} />
                  <Route path="/cheques/prepare/iou" element={<PrepareIouPage />} />
                  <Route path="/cheques/:preparedId/print" element={<ChequePrintPage />} />
                  <Route path="/cheques/register" element={<RegisterPage />} />

                  {/* Menu 1: Cheque Setup routes */}
                  <Route path="/cheque-setup" element={<BookListPage />} />
                  <Route path="/cheque-setup/new" element={<BookSetupFormPage />} />
                  <Route path="/cheque-setup/:id/edit" element={<BookSetupFormPage />} />

                  {/* Menu 2: Cheque Prepare routes */}
                  <Route path="/cheque-prepare" element={<Navigate to="/cheque-prepare/direct" replace />} />
                  <Route path="/cheque-prepare/direct" element={<PrepareDirectPage />} />
                  <Route path="/cheque-prepare/bill" element={<PrepareBillPage />} />
                  <Route path="/cheque-prepare/iou" element={<PrepareIouPage />} />
                  <Route path="/cheque-prepare/:preparedId/print" element={<ChequePrintPage />} />
                  <Route path="/cheque-prepare/register" element={<RegisterPage />} />

                  {/* Bank Management Sub-routes aliases */}
                  <Route path="/bank-management/cheque-setup" element={<Navigate to="/cheque-setup" replace />} />
                  <Route path="/bank-management/cheque-preparation-payment" element={<Navigate to="/cheque-prepare/direct" replace />} />
                  <Route path="/bank-management/cheque-book-register" element={<Navigate to="/cheque-prepare/register" replace />} />

                  <Route path="*" element={<ContentArea />} />
                </Routes>
              </main>
            </div>
          </div>
        </VoucherProvider>
      </CoaProvider>
    </BrowserRouter>
  );
}

