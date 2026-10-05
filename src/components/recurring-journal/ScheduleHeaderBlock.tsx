import React from 'react';
import {
  VoucherType,
  VOUCHER_TYPES,
  Cadence,
  CADENCES,
} from '../../types/recurringJournal';
import { NextRunHelper } from './NextRunHelper';

interface ScheduleHeaderBlockProps {
  voucherType: VoucherType;
  onVoucherTypeChange: (t: VoucherType) => void;
  profileName: string;
  onProfileNameChange: (name: string) => void;
  repeatEvery: Cadence;
  onRepeatEveryChange: (c: Cadence) => void;
  startsOn: string;
  onStartsOnChange: (d: string) => void;
  endsOn: string;
  onEndsOnChange: (d: string) => void;
  neverExpired: boolean;
  onNeverExpiredChange: (n: boolean) => void;
  errors?: Record<string, string>;
}

export const ScheduleHeaderBlock: React.FC<ScheduleHeaderBlockProps> = ({
  voucherType,
  onVoucherTypeChange,
  profileName,
  onProfileNameChange,
  repeatEvery,
  onRepeatEveryChange,
  startsOn,
  onStartsOnChange,
  endsOn,
  onEndsOnChange,
  neverExpired,
  onNeverExpiredChange,
  errors = {},
}) => {
  const handleToggleNeverExpired = () => {
    const next = !neverExpired;
    onNeverExpiredChange(next);
    if (next) {
      onEndsOnChange('');
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-5">
      <div className="border-b border-border/80 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
            1. Recurrence Schedule &amp; Template Header
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure the voucher generation cadence, validity timeframe, and template profile identity
          </p>
        </div>
      </div>

      {/* Grid of 6 Schedule Header Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Voucher Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Voucher Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={voucherType}
            onChange={(e) => onVoucherTypeChange(e.target.value as VoucherType)}
            className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
          >
            {VOUCHER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t} Voucher
              </option>
            ))}
          </select>
        </div>

        {/* 2. Profile Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>
              Profile Name <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">
              e.g. Salary Payable, Monthly Factory Rent
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. Monthly Staff Salary Accrual"
            value={profileName}
            onChange={(e) => onProfileNameChange(e.target.value)}
            className={`w-full h-9 px-3 rounded-xl border bg-background text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs ${
              errors.profileName ? 'border-rose-400' : 'border-border'
            }`}
          />
          {errors.profileName && (
            <p className="text-[11px] text-rose-500 font-bold">{errors.profileName}</p>
          )}
        </div>

        {/* 3. Repeat Every */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Repeat Every <span className="text-rose-500">*</span>
          </label>
          <select
            value={repeatEvery}
            onChange={(e) => onRepeatEveryChange(e.target.value as Cadence)}
            className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
          >
            {CADENCES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} — {c.description}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Starts On */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Starts On <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={startsOn}
            onChange={(e) => onStartsOnChange(e.target.value)}
            className={`w-full h-9 px-3 rounded-xl border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs ${
              errors.startsOn ? 'border-rose-400' : 'border-border'
            }`}
          />
          {errors.startsOn && (
            <p className="text-[11px] text-rose-500 font-bold">{errors.startsOn}</p>
          )}
        </div>

        {/* 5 & 6. Ends On + Never Expired Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground">
              Ends On {!neverExpired && <span className="text-rose-500">*</span>}
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={neverExpired}
                onChange={handleToggleNeverExpired}
                className="rounded border-border text-primary focus:ring-primary size-3.5"
              />
              <span className="text-[11px] font-bold text-muted-foreground hover:text-foreground">
                Never Expired
              </span>
            </label>
          </div>
          <input
            type="date"
            disabled={neverExpired}
            value={endsOn}
            onChange={(e) => onEndsOnChange(e.target.value)}
            placeholder={neverExpired ? 'No expiration' : ''}
            className={`w-full h-9 px-3 rounded-xl border text-xs font-medium outline-none focus:ring-1 focus:ring-primary shadow-2xs transition-opacity ${
              neverExpired
                ? 'bg-muted/40 border-border text-muted-foreground/50 cursor-not-allowed'
                : errors.endsOn
                ? 'bg-background border-rose-400 text-foreground'
                : 'bg-background border-border text-foreground'
            }`}
          />
          {errors.endsOn && (
            <p className="text-[11px] text-rose-500 font-bold">{errors.endsOn}</p>
          )}
        </div>
      </div>

      {/* Live Next Run Helper */}
      <NextRunHelper startsOn={startsOn} repeatEvery={repeatEvery} />
    </div>
  );
};
