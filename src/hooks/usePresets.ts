import { useEffect } from 'react';
import { usePresetJournalStore } from '../stores/presetJournalStore';
import { VoucherType, JournalPreset } from '../types/presetJournal';
import { toast } from 'sonner';

export function usePresets(voucherType?: VoucherType) {
  const { presets, loading, load, add, incrementUsage } = usePresetJournalStore();

  useEffect(() => {
    if (presets.length === 0) {
      load();
    }
  }, [load, presets.length]);

  const filteredPresets = voucherType
    ? presets.filter((p) => p.voucherType === voucherType)
    : presets;

  const applyPreset = async (presetId: string): Promise<JournalPreset | null> => {
    const target = presets.find((p) => p.id === presetId);
    if (!target) {
      toast.error('Preset template not found');
      return null;
    }

    if (voucherType && target.voucherType !== voucherType) {
      toast.error(`This preset belongs to "${target.voucherType}" voucher type.`);
      return null;
    }

    await incrementUsage(presetId);
    toast.success(`Loaded preset '${target.profileName}' (${target.lines.length} lines)`);
    return target;
  };

  const saveCurrentAsPreset = async (
    profileName: string,
    type: VoucherType,
    lines: any[],
    narration?: string
  ): Promise<JournalPreset> => {
    const created = await add({
      profileName,
      voucherType: type,
      lines: lines.map((l, idx) => ({
        id: l.id || `pl-${idx + 1}`,
        accountHeadId: l.accountHeadId,
        accountHeadName: l.accountHeadName,
        costCenterId: l.costCenterId,
        subsidiaryId: l.subsidiaryId,
        employeeId: l.employeeId,
        vehicleId: l.vehicleId,
        reference: l.reference,
        description: l.description,
        currency: l.currency || 'BDT',
        exchangeRate: l.exchangeRate || 1,
        debit: l.debit || 0,
        credit: l.credit || 0,
        debitBDT: l.debitBDT || l.debit || 0,
        creditBDT: l.creditBDT || l.credit || 0,
      })),
      narration: narration || '',
    });

    toast.success(`Preset '${profileName}' saved successfully to Preset Library`);
    return created;
  };

  return {
    presets: filteredPresets,
    allPresets: presets,
    loading,
    applyPreset,
    saveCurrentAsPreset,
  };
}
