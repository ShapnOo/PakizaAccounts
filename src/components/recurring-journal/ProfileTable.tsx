import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Pencil,
  Copy,
  PlayCircle,
  Trash2,
  MoreVertical,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { RecurringProfile } from '../../types/recurringJournal';
import { CadenceChip } from './CadenceChip';
import { VoucherTypeChip } from './VoucherTypeChip';
import { ActivePill } from './ActivePill';
import { formatRelativeTime } from '../../lib/recurrence';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface ProfileTableProps {
  profiles: RecurringProfile[];
  onToggleActive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRunNow: (id: string) => void;
  onDelete: (profile: RecurringProfile) => void;
}

export const ProfileTable: React.FC<ProfileTableProps> = ({
  profiles,
  onToggleActive,
  onDuplicate,
  onRunNow,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto sidebar-scroll">
        <table className="w-full text-left text-xs border-collapse min-w-[950px]">
          <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3 px-4 min-w-[220px]">Profile Name</th>
              <th className="py-3 px-3 w-32">Voucher Type</th>
              <th className="py-3 px-3 w-28">Repeat Every</th>
              <th className="py-3 px-3 w-28">Starts On</th>
              <th className="py-3 px-3 w-28">Ends On</th>
              <th className="py-3 px-3 w-36">Next Run</th>
              <th className="py-3 px-3 text-right w-32">Amount (BDT)</th>
              <th className="py-3 px-3 text-center w-24">Status</th>
              <th className="py-3 px-3 text-center w-16">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {profiles.map((p) => {
              const relative = formatRelativeTime(p.nextRunAt);
              const isMenuOpen = openMenuId === p.id;

              return (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                  {/* 1. Profile Name */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <Link
                        to={`/recurring-journal/${p.id}/edit`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-xs inline-flex items-center gap-1.5"
                      >
                        <span>{p.profileName}</span>
                      </Link>
                      {p.narration && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 max-w-sm">
                          {p.narration}
                        </p>
                      )}
                      <span className="text-[10px] text-muted-foreground/80 mt-0.5">
                        {p.lines.length} lines · {p.totalRunsCount || 0} runs executed
                      </span>
                    </div>
                  </td>

                  {/* 2. Voucher Type */}
                  <td className="py-3 px-3">
                    <VoucherTypeChip type={p.voucherType} />
                  </td>

                  {/* 3. Repeat Every */}
                  <td className="py-3 px-3">
                    <CadenceChip cadence={p.repeatEvery} />
                  </td>

                  {/* 4. Starts On */}
                  <td className="py-3 px-3 font-mono font-medium text-foreground text-[11px]">
                    {p.startsOn}
                  </td>

                  {/* 5. Ends On */}
                  <td className="py-3 px-3 font-mono text-[11px]">
                    {p.neverExpired ? (
                      <span className="text-muted-foreground italic font-normal">Never</span>
                    ) : (
                      <span className="font-medium text-foreground">{p.endsOn || '—'}</span>
                    )}
                  </td>

                  {/* 6. Next Run */}
                  <td className="py-3 px-3">
                    {p.nextRunAt ? (
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-foreground text-[11px]">
                          {p.nextRunAt}
                        </span>
                        <span className="text-[10px] font-semibold text-primary">
                          {relative}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* 7. Amount (BDT) */}
                  <td className="py-3 px-3 text-right font-mono font-black text-foreground tabular-nums">
                    ৳ {p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* 8. Status */}
                  <td className="py-3 px-3 text-center">
                    <ActivePill
                      active={p.active}
                      onClick={() => onToggleActive(p.id)}
                    />
                  </td>

                  {/* 9. Actions Menu */}
                  <td className="py-3 px-3 text-center relative">
                    <div className="flex items-center justify-center gap-1">
                      {/* Run Now Quick Button */}
                      <button
                        type="button"
                        onClick={() => onRunNow(p.id)}
                        title="Run this profile now (generate voucher immediately)"
                        className="p-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        <PlayCircle className="size-3.5" />
                      </button>

                      {/* Dropdown Menu Toggle */}
                      <ProfileRowMenu
                        profile={p}
                        isOpen={isMenuOpen}
                        onToggle={() => setOpenMenuId(isMenuOpen ? null : p.id)}
                        onClose={() => setOpenMenuId(null)}
                        onDuplicate={onDuplicate}
                        onRunNow={onRunNow}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileRowMenu: React.FC<{
  profile: RecurringProfile;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onDuplicate: (id: string) => void;
  onRunNow: (id: string) => void;
  onDelete: (profile: RecurringProfile) => void;
}> = ({ profile, isOpen, onClose, onToggle, onDuplicate, onRunNow, onDelete }) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { openUpward } = useDropdownPosition({
    triggerRef: menuRef,
    isOpen,
    minMenuHeight: 180,
  });

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <MoreVertical className="size-3.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div
            className={`absolute right-0 w-44 rounded-xl border border-border bg-card p-1 shadow-xl z-50 ${
              openUpward
                ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in zoom-in-95 duration-150'
                : 'top-full mt-1.5 origin-top animate-in fade-in zoom-in-95 duration-150'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/recurring-journal/${profile.id}/edit`);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
            >
              <Pencil className="size-3.5 text-primary" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDuplicate(profile.id);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
            >
              <Copy className="size-3.5 text-indigo-500" />
              <span>Duplicate</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onRunNow(profile.id);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
            >
              <PlayCircle className="size-3.5 text-emerald-500" />
              <span>Run Now</span>
            </button>

            <div className="h-px bg-border my-1" />

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(profile);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Profile</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
