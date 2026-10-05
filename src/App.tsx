import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
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
import { SlidersHorizontal, ArrowRight, Settings, FolderTree, Receipt, Scale, Coins, Layers, ListFilter } from "lucide-react";
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
          </div>

          <div className="text-[12px] text-muted-foreground/80 flex items-center justify-center gap-2">
            <span>Dynamic Schema & Extra Columns</span>
            <ArrowRight className="size-3.5" />
            <span className="font-semibold text-foreground">Journal • Payment • Receive • Contra • Opening Balance</span>
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

