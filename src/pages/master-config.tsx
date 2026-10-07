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

const ACCOUNTS_PATH_OPTIONS = [
  'Hide',
  'Before accounts',
  'After accounts',
] as const;

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
          <div className="pl-4 md:pl-6 my-1 border-l-2 border-primary/50 bg-muted/20 rounded-r-lg space-y-2 py-2">
            <ConfigRow
              label="Effective Part"
              hint="Multi-select balance sheet and income statement"
              controlClassName="w-full md:w-96 shrink-0"
            >
              <MultiSelect
                value={config.costCenter.effectivePart}
                onChange={(val) => updateSection('costCenter', { effectivePart: val })}
                options={EFFECTIVE_PART_OPTIONS}
                className="w-full max-w-none"
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
          <div className="pl-4 md:pl-6 my-1 border-l-2 border-primary/50 bg-muted/20 rounded-r-lg space-y-3 py-3">
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
                controlClassName="w-full md:flex-1 md:max-w-3xl shrink-0"
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full">
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
                      className="px-2.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-md border border-primary/30 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllVouchers}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-muted rounded-md border border-border transition-colors whitespace-nowrap cursor-pointer active:scale-95"
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
                controlClassName="w-full md:flex-1 md:max-w-3xl shrink-0"
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full">
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
                      className="px-2.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-md border border-primary/30 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllUsers}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-muted rounded-md border border-border transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </ConfigRow>
            )}

            {/* Threshold: Max Due Days ONLY */}
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
              label="Effective Company"
              hint="Select which companies this voucher control policy governs"
              controlClassName="w-full md:w-96 shrink-0"
            >
              <MultiSelect
                value={config.voucherControlling.effectiveCompany}
                onChange={(val) => updateSection('voucherControlling', { effectiveCompany: val })}
                options={COMPANY_LIST}
                className="w-full max-w-none"
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
            className="w-48"
          />
        </ConfigRow>

        <div className="py-2">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-foreground">
              Period Locks for FY {config.monthLock.fiscalYear}:
            </span>
          </div>
          <MonthGrid
            fiscalYear={config.monthLock.fiscalYear}
            months={config.monthLock.months}
            onChange={(months) => updateSection('monthLock', { months })}
          />
        </div>

        <ConfigRow
          label="Effective Company"
          hint="Select which companies this period lock governs"
          controlClassName="w-full md:w-96 shrink-0"
        >
          <MultiSelect
            value={config.monthLock.effectiveCompany}
            onChange={(val) => updateSection('monthLock', { effectiveCompany: val })}
            options={COMPANY_LIST}
            className="w-full max-w-none"
          />
        </ConfigRow>
      </SectionCard>

      {/* ── 3.4 ACCOUNTS CODE SETUP ── */}
      <SectionCard
        sectionNo="3.4"
        title="Accounts Code Setup"
        icon={FileText}
        isDirty={isSectionDirty('accountsCode')}
      >
        <ConfigRow label="Auto-Generate Account Code" hint="Automatically generate incremental GL code for new accounts">
          <ToggleYesNo
            value={config.accountsCode.autoGenerate}
            onChange={(val) => updateSection('accountsCode', { autoGenerate: val })}
          />
        </ConfigRow>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ConfigRow label="Account Code Prefix" hint="Default prefix applied to generated codes">
            <input
              type="text"
              value={config.accountsCode.prefix}
              onChange={(e) => updateSection('accountsCode', { prefix: e.target.value })}
              className="w-32 h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </ConfigRow>

          <ConfigRow label="Code Length" hint="Fixed digit length for chart account codes">
            <input
              type="number"
              min="4"
              max="12"
              value={config.accountsCode.codeLength}
              onChange={(e) => updateSection('accountsCode', { codeLength: parseInt(e.target.value, 10) || 6 })}
              className="w-24 h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </ConfigRow>
        </div>

        <ConfigRow
          label="Subsidiary & Accounts Merge View"
          hint="Consolidates subledger codes into primary chart tree"
        >
          <ToggleYesNo
            value={config.accountsCode.mergeView}
            onChange={(val) => updateSection('accountsCode', { mergeView: val })}
          />
        </ConfigRow>

        <ConfigRow label="Accounts Path Visible" hint="Where the account path is shown">
          <Dropdown
            value={String(config.accountsCode.pathVisible)}
            onChange={(val) => updateSection('accountsCode', { pathVisible: val })}
            options={[...ACCOUNTS_PATH_OPTIONS]}
          />
        </ConfigRow>

        <ConfigRow
          label="Effective Company"
          hint="Select company scope for auto-generated GL codes"
          controlClassName="w-full md:w-96 shrink-0"
        >
          <MultiSelect
            value={config.accountsCode.effectiveCompany}
            onChange={(val) => updateSection('accountsCode', { effectiveCompany: val })}
            options={COMPANY_LIST}
            className="w-full max-w-none"
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
        <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
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

          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
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

          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
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

          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
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
          />
        </ConfigRow>

        <ConfigRow label="Default Account" required>
          <div className="w-full max-w-[340px]">
            <AccountPicker
              value={config.bankCheque.defaultAccount}
              onChange={(val) => updateSection('bankCheque', { defaultAccount: val })}
              placeholder="Select Default Bank Account..."
            />
          </div>
        </ConfigRow>
      </SectionCard>

      {/* ── 4. STICKY GLOBAL BOTTOM BAR ── */}
      <div className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-md border-t border-border/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] py-2.5 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="w-full flex items-center justify-end gap-2.5">
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
            <span className="whitespace-nowrap">Apply All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterConfigPage;
