import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoucherSetupStore } from '../../stores/voucherSetupStore';
import { useVoucherPreviewStore } from '../../stores/voucherPreviewStore';
import { VOUCHER_TYPES, VoucherType } from '../../types/voucherTemplate';
import { SetupListHeader } from '../../components/voucher-setup/SetupListHeader';
import { VoucherTypeRow } from '../../components/voucher-setup/VoucherTypeRow';
import { toast } from 'sonner';

export const VoucherSetupListPage: React.FC = () => {
  const navigate = useNavigate();
  const { setups, loading, load, resetAllToDefaults } = useVoucherSetupStore();
  const loadPreview = useVoucherPreviewStore((s) => s.load);

  useEffect(() => {
    load();
    loadPreview();
  }, []);

  const handleCustomize = (vt: VoucherType) => {
    navigate(`/voucher-setup/${vt.toLowerCase()}`);
  };

  const handleResetAll = async () => {
    if (window.confirm('Reset all voucher print templates to their factory defaults?')) {
      await resetAllToDefaults();
      toast.success('All voucher templates reset to defaults');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <SetupListHeader onResetAll={handleResetAll} loading={loading} />

        {/* 4 Voucher Types Grid (2x2 on Desktop, Full Width) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {VOUCHER_TYPES.map((vt) => {
            const setup = setups[vt];
            if (!setup) return null;
            return (
              <VoucherTypeRow
                key={vt}
                setup={setup}
                onCustomize={handleCustomize}
              />
            );
          })}
        </div>

        {/* Informative Footer Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs text-[12.5px] text-slate-500 leading-relaxed space-y-1">
          <p className="font-semibold text-slate-700">How Voucher Setup Works</p>
          <p>
            Select any voucher type above (<strong>Journal</strong>, <strong>Payment</strong>, <strong>Receive</strong>, or <strong>Contra</strong>) to choose between the 4 fixed certified accounting print templates:
            <strong> Standard</strong> (classic single-row with 3 fixed signatures),
            <strong> Minimal</strong> (clean dual-row with dynamic signatures & currency summary),
            <strong> Clean Grid</strong> (boxed grid with optional zebra stripes), or
            <strong> Framed Ledger</strong> (classic framed double-rule ledger).
          </p>
        </div>
      </div>
    </div>
  );
};
