import React from 'react';
import {
  Building2,
  Lock,
  CalendarDays,
  FileText,
  GitMerge,
  Landmark,
  Wallet,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { useConfigState, COMPANY_LIST } from '../hooks/useConfigState';
import { useVouchers } from '../context/VoucherContext';
import { SectionCard } from '../components/config/SectionCard';
import { ConfigRow } from '../components/config/ConfigRow';
import { ToggleYesNo } from '../components/config/ToggleYesNo';
import { Dropdown } from '../components/config/Dropdown';
import { MultiSelect } from '../components/config/MultiSelect';
import { DateFmtInput } from '../components/config/DateFmtInput';
import { MonthGrid } from '../components/config/MonthGrid';
import { AccountPicker } from '../components/config/AccountPicker';

const EFFECTIVE_PART_OPTIONS = ['Balance sheet', 'Income Statement'];

const USER_OPTIONS = ['Admin', 'Accountant', 'Finance Manager', 'Maker', 'Checker', 'Super User'];

const FISCAL_YEAR_OPTIONS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];

export const MasterConfigPage: React.FC = () => {
  const {
    config,
    updateSection,
    isSectionDirty,
    isGlobalDirty,
    saveAll,
    resetAll,
  } = useConfigState();

  const { vouchers } = useVouchers();
  const voucherTypeOptions = vouchers.length > 0
    ? vouchers.map((v) => v.name)
    : ['Bank Payment Voucher', 'Bank Receipt Voucher', 'Contra Voucher', 'Journal Voucher', 'Cash Payment Voucher', 'Cash Receive Voucher'];

  const handleSelectAllVouchers = () => {
    updateSection('voucherControlling', { selectedVouchers: [...voucherTypeOptions] });
  };

  const handleDeselectAllVouchers = () => {
    updateSection('voucherControlling', { selectedVouchers: [] });
  };

  const handleSelectAllUsers = () => {
    updateSection('voucherControlling', { selectedUsers: [...USER_OPTIONS] });
  };

  const handleDeselectAllUsers = () => {
    updateSection('voucherControlling', { selectedUsers: [] });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 md:py-6 space-y-4 pb-20">
      {/* ── Breadcrumb & Page Header ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
          <span>Home</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span>Accounts Configuration</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-primary font-black">Master Configuration (F&A)</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <SlidersHorizontal className="size-5.5 text-primary" />
              <span>Master Configuration (F&A)</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              General ledger policies, period locking, cost centers, and automated voucher rules.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3.1 COST CENTER ── */}
      <SectionCard
        sectionNo="3.1"
        title="Cost Center"
        icon={Building2}
        isDirty={isSectionDirty('costCenter')}
      >
        <ConfigRow
          label="Cost Center"
          hint="This part will be visible when mandatory"
        >
          <ToggleYesNo
            label="Mandatory"
            value={config.costCenter.mandatory}
            onChange={(val) => updateSection('costCenter', { mandatory: val })}
          />
        </ConfigRow>

        {/* CONDITIONAL (Mandatory === true) */}
        <div
          className={`transition-all duration-300 ${
            config.costCenter.mandatory ? 'max-h-96 opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'
          }`}
        >
          <div className="mt-1 pt-1 border-t border-border/40 divide-y divide-border/20 bg-muted/10 rounded-xl">
            <ConfigRow
              label="Effective Part"
              hint="Multi-select balance sheet and income statement"
            >
              <MultiSelect
                value={config.costCenter.effectivePart}
                onChange={(val) => updateSection('costCenter', { effectivePart: val })}
                options={EFFECTIVE_PART_OPTIONS}
                className="w-full max-w-md"
              />
            </ConfigRow>

            <ConfigRow
              label="Apply Changes To"
              hint="Select companies to apply cost center configuration"
            >
              <MultiSelect
                value={config.costCenter.effectiveCompany || COMPANY_LIST}
                onChange={(val) => updateSection('costCenter', { effectiveCompany: val })}
                options={COMPANY_LIST}
                className="w-full max-w-md"
              />
            </ConfigRow>
          </div>
        </div>
      </SectionCard>

      {/* ── 3.2 VOUCHER CONTROLLING ── */}
      <SectionCard
        sectionNo="3.2"
        title="Voucher Controlling"
        icon={Lock}
        isDirty={isSectionDirty('voucherControlling')}
      >
        <ConfigRow label="Voucher Control">
          <ToggleYesNo
            value={config.voucherControlling.enabled}
            onChange={(val) => updateSection('voucherControlling', { enabled: val })}
          />
        </ConfigRow>

        {/* CONDITIONAL (Enabled === true) */}
        <div
          className={`transition-all duration-300 ${
            config.voucherControlling.enabled ? 'max-h-[700px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'
          }`}
        >
          <div className="mt-1 pt-1 border-t border-border/40 divide-y divide-border/20 bg-muted/10 rounded-xl">
            {/* Control Mode: Voucher-wise vs User-wise */}
            <ConfigRow label="Control Mode" hint="Configure control rules voucher-wise or user-wise">
              <div className="inline-flex p-1 rounded-lg border border-border/80 bg-card shadow-2xs">
                <button
                  type="button"
                  onClick={() => updateSection('voucherControlling', { controlMode: 'voucher-wise' })}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    config.voucherControlling.controlMode === 'voucher-wise'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Voucher-wise
                </button>
                <button
                  type="button"
                  onClick={() => updateSection('voucherControlling', { controlMode: 'user-wise' })}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    config.voucherControlling.controlMode === 'user-wise'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  User-wise
                </button>
              </div>
            </ConfigRow>

            {/* Voucher-wise Selection */}
            {config.voucherControlling.controlMode === 'voucher-wise' ? (
              <ConfigRow
                label="Controlled Vouchers"
                hint="Multi-select vouchers with select-all option"
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full max-w-xl">
                  <MultiSelect
                    value={config.voucherControlling.selectedVouchers || []}
                    onChange={(val) => updateSection('voucherControlling', { selectedVouchers: val })}
                    options={voucherTypeOptions}
                    placeholder="Select Controlled Vouchers..."
                    className="flex-1 max-w-none"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAllVouchers}
                      className="h-8.5 px-3 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg border border-primary/30 transition-colors whitespace-nowrap cursor-pointer active:scale-95 shadow-2xs"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllVouchers}
                      className="h-8.5 px-3 text-[11px] font-bold text-muted-foreground hover:bg-muted rounded-lg border border-border transition-colors whitespace-nowrap cursor-pointer active:scale-95 shadow-2xs"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </ConfigRow>
            ) : (
              /* User-wise Selection */
              <ConfigRow
                label="Controlled Users"
                hint="Multi-user selection with select-all option"
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full max-w-xl">
                  <MultiSelect
                    value={config.voucherControlling.selectedUsers || []}
                    onChange={(val) => updateSection('voucherControlling', { selectedUsers: val })}
                    options={USER_OPTIONS}
                    placeholder="Select Controlled Users..."
                    className="flex-1 max-w-none"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAllUsers}
                      className="h-8.5 px-3 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg border border-primary/30 transition-colors whitespace-nowrap cursor-pointer active:scale-95 shadow-2xs"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllUsers}
                      className="h-8.5 px-3 text-[11px] font-bold text-muted-foreground hover:bg-muted rounded-lg border border-border transition-colors whitespace-nowrap cursor-pointer active:scale-95 shadow-2xs"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </ConfigRow>
            )}

            {/* Threshold: Max Due Days */}
            <ConfigRow
              label="Max Due Days"
              hint="Maximum allowable due period (in days) before voucher creation is restricted"
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={config.voucherControlling.maxDueDays}
                  onChange={(e) =>
                    updateSection('voucherControlling', {
                      maxDueDays: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-24 h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
                />
                <span className="text-xs text-muted-foreground font-semibold">Days</span>
              </div>
            </ConfigRow>

            <ConfigRow
              label="Apply Changes To"
              hint="Select which companies this voucher control policy governs"
            >
              <MultiSelect
                value={config.voucherControlling.effectiveCompany}
                onChange={(val) => updateSection('voucherControlling', { effectiveCompany: val })}
                options={COMPANY_LIST}
                className="w-full max-w-md"
              />
            </ConfigRow>
          </div>
        </div>
      </SectionCard>

      {/* ── 3.3 MONTH LOCK ── */}
      <SectionCard
        sectionNo="3.3"
        title="Month Lock"
        icon={CalendarDays}
        isDirty={isSectionDirty('monthLock')}
      >
        <ConfigRow label="Fiscal Year" hint="Selecting a year displays that year's 12 months for locking">
          <Dropdown
            value={config.monthLock.fiscalYear}
            onChange={(val) => updateSection('monthLock', { fiscalYear: val })}
            options={FISCAL_YEAR_OPTIONS}
            className="w-full max-w-[240px]"
          />
        </ConfigRow>

        <div className="py-2">
          <MonthGrid
            fiscalYear={config.monthLock.fiscalYear}
            months={config.monthLock.months}
            onChange={(months) => updateSection('monthLock', { months })}
          />
        </div>

        <ConfigRow
          label="Apply Changes To"
          hint="Select which companies this period lock governs"
        >
          <MultiSelect
            value={config.monthLock.effectiveCompany}
            onChange={(val) => updateSection('monthLock', { effectiveCompany: val })}
            options={COMPANY_LIST}
            className="w-full max-w-md"
          />
        </ConfigRow>
      </SectionCard>

      {/* ── 3.4 VOUCHER CONFIG ── */}
      <SectionCard
        sectionNo="3.4"
        title="Voucher Config."
        icon={FileText}
        isDirty={isSectionDirty('accountsCode')}
      >
        <ConfigRow label="Accounts Code" hint="Control whether account codes are shown or hidden across voucher screens">
          <ToggleYesNo
            value={config.accountsCode.showCode !== false && config.accountsCode.autoGenerate !== false}
            onChange={(val) => updateSection('accountsCode', { showCode: val, autoGenerate: val })}
            yesLabel="Show"
            noLabel="Hide"
          />
        </ConfigRow>

        <ConfigRow
          label="Subsidiary & Accounts Merge View"
          hint="Consolidates subledger codes into primary chart tree"
        >
          <ToggleYesNo
            value={config.accountsCode.mergeView}
            onChange={(val) => updateSection('accountsCode', { mergeView: val })}
          />
        </ConfigRow>

        <ConfigRow label="Accounts Path" hint="Control whether the full account hierarchy path is shown or hidden">
          <ToggleYesNo
            value={Boolean(config.accountsCode.pathVisible && config.accountsCode.pathVisible !== 'Hide')}
            onChange={(val) => updateSection('accountsCode', { pathVisible: val ? 'Show' : 'Hide' })}
            yesLabel="Show"
            noLabel="Hide"
          />
        </ConfigRow>

        <ConfigRow
          label="Apply Changes To"
          hint="Select company scope for voucher account configuration"
        >
          <MultiSelect
            value={config.accountsCode.effectiveCompany}
            onChange={(val) => updateSection('accountsCode', { effectiveCompany: val })}
            options={COMPANY_LIST}
            className="w-full max-w-md"
          />
        </ConfigRow>
      </SectionCard>

      {/* ── 3.5 ACCOUNTS IDENTIFICATIONS ── */}
      <SectionCard
        sectionNo="3.5"
        title="Accounts Identifications"
        icon={Landmark}
        isDirty={isSectionDirty('accountsIdentifications')}
      >
        <div className="py-2.5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs hover:border-primary/30 transition-colors">
            <AccountPicker
              label="Accounts Payable"
              badge="Current Liability"
              required
              value={config.accountsIdentifications.accountsPayable}
              onChange={(val) =>
                updateSection('accountsIdentifications', { accountsPayable: val })
              }
              placeholder="Select Accounts Payable Head..."
            />
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs hover:border-primary/30 transition-colors">
            <AccountPicker
              label="Accounts Receivable"
              badge="Current Asset"
              required
              value={config.accountsIdentifications.accountsReceivable}
              onChange={(val) =>
                updateSection('accountsIdentifications', { accountsReceivable: val })
              }
              placeholder="Select Accounts Receivable Head..."
            />
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs hover:border-primary/30 transition-colors">
            <AccountPicker
              label="Advance Payment"
              badge="Asset Prepayment"
              required
              value={config.accountsIdentifications.advancePayment}
              onChange={(val) =>
                updateSection('accountsIdentifications', { advancePayment: val })
              }
              placeholder="Select Advance Payment Head..."
            />
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs hover:border-primary/30 transition-colors">
            <AccountPicker
              label="Advance Receive"
              badge="Customer Liability"
              required
              value={config.accountsIdentifications.advanceReceive}
              onChange={(val) =>
                updateSection('accountsIdentifications', { advanceReceive: val })
              }
              placeholder="Select Advance Receive Head..."
            />
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-border/30">
          <ConfigRow
            label="Apply Changes To"
            hint="Select company scope for accounts identifications"
          >
            <MultiSelect
              value={config.accountsIdentifications.effectiveCompany || COMPANY_LIST}
              onChange={(val) => updateSection('accountsIdentifications', { effectiveCompany: val })}
              options={COMPANY_LIST}
              className="w-full max-w-md"
            />
          </ConfigRow>
        </div>
      </SectionCard>

      {/* ── 3.6 BANK & CHEQUE ── */}
      <SectionCard
        sectionNo="3.6"
        title="Bank & Cheque"
        icon={Wallet}
        isDirty={isSectionDirty('bankCheque')}
      >
        <ConfigRow label="Default Voucher Name">
          <Dropdown
            value={config.bankCheque.defaultVoucherName}
            onChange={(val) => updateSection('bankCheque', { defaultVoucherName: val })}
            options={voucherTypeOptions}
            className="w-full max-w-md"
          />
        </ConfigRow>

        <ConfigRow label="Default Account" required>
          <div className="w-full max-w-md">
            <AccountPicker
              value={config.bankCheque.defaultAccount}
              onChange={(val) => updateSection('bankCheque', { defaultAccount: val })}
              placeholder="Select Default Bank Account..."
            />
          </div>
        </ConfigRow>

        <ConfigRow
          label="Apply Changes To"
          hint="Select company scope for bank and cheque settings"
        >
          <MultiSelect
            value={config.bankCheque.effectiveCompany || ['Pakiza Software Ltd.']}
            onChange={(val) => updateSection('bankCheque', { effectiveCompany: val })}
            options={COMPANY_LIST}
            className="w-full max-w-md"
          />
        </ConfigRow>
      </SectionCard>

      {/* ── 4. STICKY GLOBAL BOTTOM BAR ── */}
      <div className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-md border-t border-border/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] py-2.5 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            {isGlobalDirty ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                <span>You have unsaved changes</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground/70">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>All configurations up to date</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={resetAll}
              disabled={!isGlobalDirty}
              className={`inline-flex items-center gap-1.5 h-8.5 px-4 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isGlobalDirty
                  ? 'text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95'
                  : 'text-muted-foreground/40 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="size-3.5 shrink-0" />
              <span className="whitespace-nowrap">Reset</span>
            </button>

            <button
              type="button"
              onClick={saveAll}
              disabled={!isGlobalDirty}
              className={`inline-flex items-center gap-2 h-8.5 px-5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all shadow-sm cursor-pointer ${
                isGlobalDirty
                  ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-primary/20 active:scale-95'
                  : 'bg-muted/60 text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
              }`}
            >
              <Check className="size-3.5 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterConfigPage;
