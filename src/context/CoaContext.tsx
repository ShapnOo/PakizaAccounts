import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, AccountFilter, AccountFormData, HierarchyLevel } from '../types/coa';
import {
  INITIAL_ACCOUNTS,
  getStoredAccounts,
  saveStoredAccounts,
  getStoredExtraDetailsTypes,
  saveStoredExtraDetailsTypes,
} from '../mock/accounts';
import { generateNextAccountCode } from '../lib/accountCode';
import { ACCOUNTS_TYPE_TREE, Nature } from '../constants/accountsTypeTree';
import { toast } from 'sonner';

interface CoaContextType {
  accounts: Account[];
  extraDetailsTypes: string[];
  addDetailsType: (newType: string) => void;
  createAccount: (data: AccountFormData) => Account;
  updateAccount: (id: string, data: Partial<AccountFormData>) => Account;
  deleteAccount: (id: string) => void;
  toggleAccountActive: (id: string) => void;
  importAccounts: (imported: Account[]) => void;
  resetToDefault: () => void;
  getAccountById: (id: string) => Account | undefined;
  filter: AccountFilter;
  setFilter: (patch: Partial<AccountFilter>) => void;
  density: 'comfortable' | 'compact';
  setDensity: (d: 'comfortable' | 'compact') => void;
}

const CoaContext = createContext<CoaContextType | null>(null);

export const CoaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => getStoredAccounts());
  const [extraDetailsTypes, setExtraDetailsTypes] = useState<string[]>(() =>
    getStoredExtraDetailsTypes()
  );
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [filter, setFilterState] = useState<AccountFilter>({
    search: '',
    accountsType: 'All',
    activeStatus: 'All',
    company: 'All',
    level: 'All',
  });

  useEffect(() => {
    saveStoredAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    saveStoredExtraDetailsTypes(extraDetailsTypes);
  }, [extraDetailsTypes]);

  const setFilter = (patch: Partial<AccountFilter>) => {
    setFilterState((prev) => ({ ...prev, ...patch }));
  };

  const addDetailsType = (newType: string) => {
    const trimmed = newType.trim();
    if (!trimmed) return;
    if (extraDetailsTypes.includes(trimmed)) return;
    setExtraDetailsTypes((prev) => [...prev, trimmed]);
    toast.success(`Details Type "${trimmed}" added to taxonomy`);
  };

  const getAccountById = (id: string) => {
    return accounts.find((a) => a.id === id);
  };

  const createAccount = (data: AccountFormData): Account => {
    // Determine nature
    const taxonomyNode = ACCOUNTS_TYPE_TREE.find((n) => n.type === data.accountsType);
    const nature: Nature = taxonomyNode ? taxonomyNode.nature : 'Assets';

    const parent = data.parentId ? accounts.find((a) => a.id === data.parentId) : null;
    const { code, level } = generateNextAccountCode(nature, parent, accounts);

    // Compute path
    const path: string[] = parent ? [...parent.path, data.name] : [data.name];

    const newAccount: Account = {
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name,
      code,
      manualCode: data.manualCode,
      accountsType: data.accountsType,
      nature,
      parentId: data.parentId || null,
      level,
      path,
      description: data.description,
      activeStatus: data.activeStatus,
      companyName: data.companyName,
      isParent: data.isParent,
      defaultCurrency: 'BDT',
      isMandatory: data.isMandatory,
      aux: data.aux,
      detailsType: data.detailsType,
      bankDetails: data.bankDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAccounts((prev) => [...prev, newAccount]);
    toast.success(`Account "${newAccount.name}" created successfully`);
    return newAccount;
  };

  const updateAccount = (id: string, data: Partial<AccountFormData>): Account => {
    const existing = accounts.find((a) => a.id === id);
    if (!existing) {
      throw new Error(`Account not found: ${id}`);
    }

    let updatedLevel = existing.level;
    let updatedCode = existing.code;
    let updatedPath = existing.path;
    let updatedNature = existing.nature;

    if (data.accountsType && data.accountsType !== existing.accountsType) {
      const taxonomyNode = ACCOUNTS_TYPE_TREE.find((n) => n.type === data.accountsType);
      if (taxonomyNode) {
        updatedNature = taxonomyNode.nature;
      }
    }

    // If parent changed, re-calculate code, level, path
    if (data.parentId !== undefined && data.parentId !== existing.parentId) {
      const newParent = data.parentId ? accounts.find((a) => a.id === data.parentId) : null;
      const gen = generateNextAccountCode(updatedNature, newParent, accounts);
      updatedCode = gen.code;
      updatedLevel = gen.level;
      updatedPath = newParent ? [...newParent.path, data.name || existing.name] : [data.name || existing.name];
    } else if (data.name && data.name !== existing.name) {
      // Name changed, update last element of path
      updatedPath = [...existing.path];
      updatedPath[updatedPath.length - 1] = data.name;
    }

    const updated: Account = {
      ...existing,
      ...data,
      level: updatedLevel,
      code: updatedCode,
      path: updatedPath,
      nature: updatedNature,
      updatedAt: new Date().toISOString(),
    };

    setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
    toast.success(`Account "${updated.name}" updated successfully`);
    return updated;
  };

  const deleteAccount = (id: string) => {
    // Check if account has children
    const hasChildren = accounts.some((a) => a.parentId === id);
    if (hasChildren) {
      toast.error('Cannot delete an account that has child accounts. Please delete children first.');
      return;
    }

    setAccounts((prev) => prev.filter((a) => a.id !== id));
    toast.success('Account deleted successfully');
  };

  const toggleAccountActive = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              activeStatus: a.activeStatus === 'Active' ? 'Inactive' : 'Active',
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
    toast.success('Account active status updated');
  };

  const importAccounts = (imported: Account[]) => {
    setAccounts((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const filtered = imported.filter((item) => !existingIds.has(item.id));
      return [...prev, ...filtered];
    });
    toast.success(`Imported ${imported.length} accounts successfully`);
  };

  const resetToDefault = () => {
    setAccounts(INITIAL_ACCOUNTS);
    toast.info('Reset to default seed accounts');
  };

  return (
    <CoaContext.Provider
      value={{
        accounts,
        extraDetailsTypes,
        addDetailsType,
        createAccount,
        updateAccount,
        deleteAccount,
        toggleAccountActive,
        importAccounts,
        resetToDefault,
        getAccountById,
        filter,
        setFilter,
        density,
        setDensity,
      }}
    >
      {children}
    </CoaContext.Provider>
  );
};

export const useCoa = () => {
  const context = useContext(CoaContext);
  if (!context) {
    throw new Error('useCoa must be used within a CoaProvider');
  }
  return context;
};
