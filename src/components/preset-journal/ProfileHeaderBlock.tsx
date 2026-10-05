import React from 'react';
import { Bookmark, Info, Sparkles } from 'lucide-react';
import { VoucherType, VOUCHER_TYPES } from '../../types/presetJournal';

interface ProfileHeaderBlockProps {
  voucherType: VoucherType;
  profileName: string;
  onChangeVoucherType: (type: VoucherType) => void;
  onChangeProfileName: (name: string) => void;
  errors?: {
    voucherType?: string;
    profileName?: string;
  };
}

export function ProfileHeaderBlock({
  voucherType,
  profileName,
  onChangeVoucherType,
  onChangeProfileName,
  errors = {},
}: ProfileHeaderBlockProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/60">
        <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
          <Bookmark className="size-4" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
            1. Preset Header Profile
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Specify the voucher type and template profile identifier
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voucher Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <span>Voucher Type</span>
            <span className="text-rose-500">*</span>
          </label>
          <select
            value={voucherType}
            onChange={(e) => onChangeVoucherType(e.target.value as VoucherType)}
            className="w-full h-9 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs cursor-pointer"
          >
            {VOUCHER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t} Voucher
              </option>
            ))}
          </select>
          {errors.voucherType && (
            <p className="text-[11px] font-medium text-rose-500">
              {errors.voucherType}
            </p>
          )}
        </div>

        {/* Profile Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <span>Profile Name</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Salary Payable, Monthly Rent, Yarn Payment..."
            value={profileName}
            onChange={(e) => onChangeProfileName(e.target.value)}
            className={`w-full h-9 px-3 rounded-xl border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs ${
              errors.profileName ? 'border-rose-500' : 'border-border'
            }`}
          />
          {errors.profileName ? (
            <p className="text-[11px] font-medium text-rose-500">
              {errors.profileName}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground italic flex items-center gap-1">
              <Info className="size-3 shrink-0" />
              <span>
                Pick a descriptive name like "Monthly Rent" or "Salary Payable".
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
