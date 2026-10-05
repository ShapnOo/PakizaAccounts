import React, { createContext, useContext, useState, useEffect } from 'react';
import { VoucherDefinition, VoucherEntry } from '../types/voucher';
import {
  INITIAL_VOUCHER_DEFINITIONS,
  getStoredVouchers,
  saveStoredVouchers,
  getStoredPostedVouchers,
  saveStoredPostedVouchers,
} from '../mock/vouchers';
import { toast } from 'sonner';

interface VoucherContextType {
  vouchers: VoucherDefinition[];
  postedVouchers: VoucherEntry[];
  createVoucherDefinition: (data: Omit<VoucherDefinition, 'id'>) => VoucherDefinition;
  updateVoucherDefinition: (id: string, data: Partial<VoucherDefinition>) => VoucherDefinition;
  deleteVoucherDefinition: (id: string) => void;
  toggleVoucherActive: (id: string) => void;
  postVoucherEntry: (entry: VoucherEntry) => VoucherEntry;
  getVoucherById: (id: string) => VoucherDefinition | undefined;
  resetToDefault: () => void;
}

const VoucherContext = createContext<VoucherContextType | null>(null);

export const VoucherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vouchers, setVouchers] = useState<VoucherDefinition[]>(() => getStoredVouchers());
  const [postedVouchers, setPostedVouchers] = useState<VoucherEntry[]>(() =>
    getStoredPostedVouchers()
  );

  useEffect(() => {
    saveStoredVouchers(vouchers);
  }, [vouchers]);

  useEffect(() => {
    saveStoredPostedVouchers(postedVouchers);
  }, [postedVouchers]);

  const getVoucherById = (id: string) => {
    return vouchers.find((v) => v.id === id);
  };

  const createVoucherDefinition = (data: Omit<VoucherDefinition, 'id'>): VoucherDefinition => {
    const newVoucher: VoucherDefinition = {
      ...data,
      id: `vdef-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVouchers((prev) => [...prev, newVoucher]);
    toast.success(`Voucher definition "${newVoucher.name}" created`);
    return newVoucher;
  };

  const updateVoucherDefinition = (
    id: string,
    data: Partial<VoucherDefinition>
  ): VoucherDefinition => {
    const existing = vouchers.find((v) => v.id === id);
    if (!existing) throw new Error(`Voucher definition not found: ${id}`);

    const updated: VoucherDefinition = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setVouchers((prev) => prev.map((v) => (v.id === id ? updated : v)));
    toast.success(`Voucher "${updated.name}" updated`);
    return updated;
  };

  const deleteVoucherDefinition = (id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
    toast.success('Voucher definition deleted');
  };

  const toggleVoucherActive = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              activeStatus: v.activeStatus === 'Active' ? 'Inactive' : 'Active',
              updatedAt: new Date().toISOString(),
            }
          : v
      )
    );
    toast.success('Voucher status toggled');
  };

  const postVoucherEntry = (entry: VoucherEntry): VoucherEntry => {
    setPostedVouchers((prev) => [entry, ...prev]);
    return entry;
  };

  const resetToDefault = () => {
    setVouchers(INITIAL_VOUCHER_DEFINITIONS);
    toast.info('Reset vouchers to defaults');
  };

  return (
    <VoucherContext.Provider
      value={{
        vouchers,
        postedVouchers,
        createVoucherDefinition,
        updateVoucherDefinition,
        deleteVoucherDefinition,
        toggleVoucherActive,
        postVoucherEntry,
        getVoucherById,
        resetToDefault,
      }}
    >
      {children}
    </VoucherContext.Provider>
  );
};

export const useVouchers = () => {
  const context = useContext(VoucherContext);
  if (!context) {
    throw new Error('useVouchers must be used within a VoucherProvider');
  }
  return context;
};
