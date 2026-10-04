import { useState, useEffect, useMemo, useCallback } from 'react';
import { Config, ConfigSectionKey } from '../types/config';
import { toast } from 'sonner';

export const DEFAULT_CONFIG: Config = {
  costCenter: {
    effectiveCompany: 'Pakiza Software Ltd.',
    mandatory: true,
    effectivePart: 'Balance sheet',
    partEffectiveCompany: 'Pakiza Software Ltd.',
  },
  voucherControlling: {
    enabled: true,
    maxDueDays: 5,
    effectivePart: { voucherType: 'Voucher Type', user: 'All' },
    effectiveCompany: 'Pakiza Software Ltd.',
  },
  monthLock: {
    fiscalYear: '2025-2026',
    months: {
      Jul: true,
      Aug: true,
      Sep: true,
      Oct: false,
      Nov: false,
      Dec: false,
      Jan: false,
      Feb: false,
      Mar: false,
      Apr: false,
      May: false,
      Jun: false,
    },
    effectiveCompany: 'Pakiza Software Ltd.',
  },
  voucher: {
    dateFormat: 'DD/MM/YYYY',
    idRenewal: true,
    fiscalYearly: true,
  },
  accountsCode: {
    mergeView: true,
    pathVisible: true,
    effectiveCompany: 'Pakiza Software Ltd.',
  },
  accountsIdentifications: {
    accountsPayable: '2011',
    accountsReceivable: '1021',
    advancePayment: '1031',
    advanceReceive: '2021',
  },
  bankCheque: {
    defaultVoucherType: 'Bank Payment Voucher',
    defaultAccount: '1012',
  },
  globalEffectiveCompany: 'Pakiza Software Ltd.',
};

const STORAGE_KEY = 'pakiza_fa_master_config_v1';

export function useConfigState() {
  const [config, setConfig] = useState<Config>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to parse saved config', e);
        }
      }
    }
    return DEFAULT_CONFIG;
  });

  const [savedConfig, setSavedConfig] = useState<Config>(config);

  // Synchronize saved baseline if storage updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedConfig(parsed);
        } catch (e) {}
      }
    }
  }, []);

  // Update specific section
  const updateSection = useCallback(
    <K extends ConfigSectionKey>(section: K, updates: Partial<Config[K]>) => {
      setConfig((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          ...updates,
        },
      }));
    },
    []
  );

  const updateGlobalEffectiveCompany = useCallback((company: string) => {
    setConfig((prev) => ({ ...prev, globalEffectiveCompany: company }));
  }, []);

  // Check if a section is dirty
  const isSectionDirty = useCallback(
    (section: ConfigSectionKey): boolean => {
      return JSON.stringify(config[section]) !== JSON.stringify(savedConfig[section]);
    },
    [config, savedConfig]
  );

  // Overall dirty state
  const isGlobalDirty = useMemo(() => {
    return JSON.stringify(config) !== JSON.stringify(savedConfig);
  }, [config, savedConfig]);

  // Validation function
  const validateSection = useCallback(
    (section: ConfigSectionKey): { valid: boolean; error?: string } => {
      if (section === 'accountsIdentifications') {
        const { accountsPayable, accountsReceivable, advancePayment, advanceReceive } =
          config.accountsIdentifications;
        if (!accountsPayable) return { valid: false, error: 'Accounts Payable is required.' };
        if (!accountsReceivable) return { valid: false, error: 'Accounts Receivable is required.' };
        if (!advancePayment) return { valid: false, error: 'Advance Payment is required.' };
        if (!advanceReceive) return { valid: false, error: 'Advance Receive is required.' };
      }
      if (section === 'bankCheque') {
        if (!config.bankCheque.defaultAccount) {
          return { valid: false, error: 'Default Bank Account is required.' };
        }
      }
      if (section === 'voucherControlling' && config.voucherControlling.enabled) {
        if (config.voucherControlling.maxDueDays < 0) {
          return { valid: false, error: 'Max Due Days cannot be negative.' };
        }
      }
      return { valid: true };
    },
    [config]
  );

  // Save specific section
  const saveSection = useCallback(
    (section: ConfigSectionKey, customLabel?: string) => {
      const validation = validateSection(section);
      if (!validation.valid) {
        toast.error(validation.error || 'Validation error');
        return false;
      }

      const updatedSaved = {
        ...savedConfig,
        [section]: config[section],
      };

      setSavedConfig(updatedSaved);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSaved));
      }

      toast.success(`${customLabel || 'Section'} configuration saved`);
      return true;
    },
    [config, savedConfig, validateSection]
  );

  // Save all changes
  const saveAll = useCallback(() => {
    const requiredSections: ConfigSectionKey[] = ['accountsIdentifications', 'bankCheque'];
    for (const sec of requiredSections) {
      const v = validateSection(sec);
      if (!v.valid) {
        toast.error(v.error);
        return false;
      }
    }

    setSavedConfig(config);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
    toast.success('Configuration saved');
    return true;
  }, [config, validateSection]);

  // Reset to last saved state
  const resetAll = useCallback(() => {
    setConfig(savedConfig);
    toast.info('Changes reverted to saved configuration');
  }, [savedConfig]);

  return {
    config,
    updateSection,
    updateGlobalEffectiveCompany,
    isSectionDirty,
    isGlobalDirty,
    saveSection,
    saveAll,
    resetAll,
  };
}
