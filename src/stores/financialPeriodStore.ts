import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  FiscalYear,
  FinancialPeriod,
  ModuleLockState,
  PeriodStatus,
  INITIAL_FISCAL_YEARS,
  generatePeriodsForFiscalYear,
} from '../types/financialPeriod';
import { toast } from 'sonner';

interface FinancialPeriodStore {
  fiscalYears: FiscalYear[];
  selectedFyCode: string;
  selectedCompany: string; // 'All' or specific company name
  
  // Actions
  setSelectedFyCode: (code: string) => void;
  setSelectedCompany: (company: string) => void;
  setActiveFiscalYear: (code: string) => void;
  
  togglePeriodModuleLock: (fyCode: string, periodId: string, moduleKey: keyof ModuleLockState) => void;
  setPeriodStatus: (fyCode: string, periodId: string, status: PeriodStatus) => void;
  quickLockPeriod: (fyCode: string, periodId: string) => void;
  quickUnlockPeriod: (fyCode: string, periodId: string) => void;
  
  batchLockAllPeriods: (fyCode: string) => void;
  batchUnlockAllPeriods: (fyCode: string) => void;
  
  createFiscalYear: (payload: {
    startYear?: number;
    code?: string;
    name?: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    isClosed?: boolean;
    retainedEarningsAccount?: string;
    effectiveCompanies?: string[];
  }) => boolean;
  
  updateFiscalYear: (code: string, payload: {
    name?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    isClosed?: boolean;
  }) => void;

  deleteFiscalYear: (code: string) => void;
  
  closeFiscalYear: (fyCode: string, retainedEarningsAccount: string, closedBy: string) => void;
  reopenFiscalYear: (fyCode: string) => void;
  resetDefaults: () => void;
}

export const useFinancialPeriodStore = create<FinancialPeriodStore>()(
  persist(
    (set, get) => ({
      fiscalYears: INITIAL_FISCAL_YEARS,
      selectedFyCode: '2026-2027',
      selectedCompany: 'All',

      setSelectedFyCode: (code: string) => set({ selectedFyCode: code }),
      setSelectedCompany: (company: string) => set({ selectedCompany: company }),

      setActiveFiscalYear: (code: string) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => ({
            ...fy,
            isActive: fy.code === code,
          }));
          try {
            localStorage.setItem('config:fy', code);
          } catch (e) {
            // ignore
          }
          return { fiscalYears: updated, selectedFyCode: code };
        });
        toast.success(`Active Fiscal Year switched to ${code}`);
      },

      togglePeriodModuleLock: (fyCode: string, periodId: string, moduleKey: keyof ModuleLockState) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== fyCode) return fy;
            const updatedPeriods = fy.periods.map((p) => {
              if (p.id !== periodId) return p;
              const nextLocks = {
                ...p.moduleLocks,
                [moduleKey]: !p.moduleLocks[moduleKey],
              };
              
              // Recalculate period status if all locks are set or none
              const allLocked = Object.values(nextLocks).every(Boolean);
              const anyLocked = Object.values(nextLocks).some(Boolean);
              let nextStatus: PeriodStatus = p.status;
              if (allLocked) {
                nextStatus = 'Locked';
              } else if (anyLocked) {
                nextStatus = 'Soft-Closed';
              } else if (p.status === 'Locked' || p.status === 'Soft-Closed') {
                nextStatus = 'Open';
              }

              return {
                ...p,
                moduleLocks: nextLocks,
                status: nextStatus,
                lockedAt: anyLocked ? (p.lockedAt || new Date().toISOString().replace('T', ' ').substring(0, 19)) : undefined,
                lockedBy: anyLocked ? (p.lockedBy || 'Finance Controller') : undefined,
              };
            });
            return { ...fy, periods: updatedPeriods };
          });
          return { fiscalYears: updated };
        });
      },

      setPeriodStatus: (fyCode: string, periodId: string, status: PeriodStatus) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== fyCode) return fy;
            const updatedPeriods = fy.periods.map((p) => {
              if (p.id !== periodId) return p;
              const isFullLock = status === 'Locked';
              const isSoftClose = status === 'Soft-Closed';
              return {
                ...p,
                status,
                moduleLocks: {
                  gl: isFullLock || isSoftClose,
                  ap: isFullLock,
                  ar: isFullLock,
                  banking: isFullLock,
                  inventory: isFullLock,
                },
                lockedAt: (isFullLock || isSoftClose) ? new Date().toISOString().replace('T', ' ').substring(0, 19) : undefined,
                lockedBy: (isFullLock || isSoftClose) ? 'Chief Financial Officer' : undefined,
              };
            });
            return { ...fy, periods: updatedPeriods };
          });
          return { fiscalYears: updated };
        });
        toast.success(`Period status updated to ${status}`);
      },

      quickLockPeriod: (fyCode: string, periodId: string) => {
        get().setPeriodStatus(fyCode, periodId, 'Locked');
      },

      quickUnlockPeriod: (fyCode: string, periodId: string) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== fyCode) return fy;
            const updatedPeriods = fy.periods.map((p) => {
              if (p.id !== periodId) return p;
              return {
                ...p,
                status: 'Open' as PeriodStatus,
                moduleLocks: { gl: false, ap: false, ar: false, banking: false, inventory: false },
                lockedAt: undefined,
                lockedBy: undefined,
              };
            });
            return { ...fy, periods: updatedPeriods };
          });
          return { fiscalYears: updated };
        });
        toast.info(`Period reopened for transactions`);
      },

      batchLockAllPeriods: (fyCode: string) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== fyCode) return fy;
            const updatedPeriods = fy.periods.map((p) => ({
              ...p,
              status: 'Locked' as PeriodStatus,
              moduleLocks: { gl: true, ap: true, ar: true, banking: true, inventory: true },
              lockedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              lockedBy: 'Batch Administrator',
            }));
            return { ...fy, periods: updatedPeriods };
          });
          return { fiscalYears: updated };
        });
        toast.success(`All 12 periods locked for Fiscal Year ${fyCode}`);
      },

      batchUnlockAllPeriods: (fyCode: string) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== fyCode) return fy;
            const updatedPeriods = fy.periods.map((p) => ({
              ...p,
              status: 'Open' as PeriodStatus,
              moduleLocks: { gl: false, ap: false, ar: false, banking: false, inventory: false },
              lockedAt: undefined,
              lockedBy: undefined,
            }));
            return { ...fy, periods: updatedPeriods };
          });
          return { fiscalYears: updated };
        });
        toast.info(`All periods unlocked for Fiscal Year ${fyCode}`);
      },

      createFiscalYear: (payload) => {
        const fyCode = payload.code || (payload.startYear ? `${payload.startYear}-${payload.startYear + 1}` : payload.name || `FY-${Date.now()}`);
        const exists = get().fiscalYears.some((f) => f.code === fyCode);
        if (exists) {
          toast.error(`Financial Period "${fyCode}" already exists!`);
          return false;
        }

        const startY = payload.startYear || parseInt(payload.startDate?.split('-')[0] || '2026', 10);
        const newPeriods = generatePeriodsForFiscalYear(startY, fyCode);
        const newFy: FiscalYear = {
          id: `fy-${fyCode}-${Date.now()}`,
          code: fyCode,
          name: payload.name || fyCode,
          startDate: payload.startDate,
          endDate: payload.endDate,
          isActive: payload.isActive ?? true,
          isClosed: payload.isClosed ?? false,
          effectiveCompanies: payload.effectiveCompanies || [
            'Pakiza Software Ltd.',
            'Pakiza Knit Composite Ltd.',
            'Pakiza Apparels Ltd.',
          ],
          retainedEarningsAccount: payload.retainedEarningsAccount || '3101-001',
          retainedEarningsAccountName: 'Retained Earnings / Surplus Account',
          periods: newPeriods,
        };

        set((state) => ({
          fiscalYears: [newFy, ...state.fiscalYears],
          selectedFyCode: fyCode,
        }));

        toast.success(`Financial Period "${payload.name || fyCode}" created successfully!`);
        return true;
      },

      updateFiscalYear: (code: string, payload) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== code) return fy;
            return {
              ...fy,
              name: payload.name !== undefined ? payload.name : fy.name,
              startDate: payload.startDate !== undefined ? payload.startDate : fy.startDate,
              endDate: payload.endDate !== undefined ? payload.endDate : fy.endDate,
              isActive: payload.isActive !== undefined ? payload.isActive : fy.isActive,
              isClosed: payload.isClosed !== undefined ? payload.isClosed : fy.isClosed,
            };
          });
          return { fiscalYears: updated };
        });
        toast.success(`Financial Period updated successfully!`);
      },

      deleteFiscalYear: (code: string) => {
        set((state) => {
          const remaining = state.fiscalYears.filter((fy) => fy.code !== code);
          const nextSelected = remaining.length > 0 ? remaining[0].code : '';
          return {
            fiscalYears: remaining,
            selectedFyCode: state.selectedFyCode === code ? nextSelected : state.selectedFyCode,
          };
        });
        toast.success(`Financial Period deleted successfully.`);
      },

      closeFiscalYear: (fyCode: string, retainedEarningsAccount: string, closedBy: string) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== fyCode) return fy;
            const lockedPeriods = fy.periods.map((p) => ({
              ...p,
              status: 'Locked' as PeriodStatus,
              moduleLocks: { gl: true, ap: true, ar: true, banking: true, inventory: true },
              lockedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              lockedBy: closedBy,
            }));
            return {
              ...fy,
              isClosed: true,
              closedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              closedBy,
              retainedEarningsAccount,
              periods: lockedPeriods,
            };
          });
          return { fiscalYears: updated };
        });
        toast.success(`Fiscal Year ${fyCode} has been successfully closed.`);
      },

      reopenFiscalYear: (fyCode: string) => {
        set((state) => {
          const updated = state.fiscalYears.map((fy) => {
            if (fy.code !== fyCode) return fy;
            return {
              ...fy,
              isClosed: false,
              closedAt: undefined,
              closedBy: undefined,
            };
          });
          return { fiscalYears: updated };
        });
        toast.info(`Fiscal Year ${fyCode} reopened.`);
      },

      resetDefaults: () => {
        set({
          fiscalYears: INITIAL_FISCAL_YEARS,
          selectedFyCode: '2026-2027',
          selectedCompany: 'All',
        });
        toast.info('Fiscal period configuration reset to defaults');
      },
    }),
    {
      name: 'pakiza_financial_period_v1',
    }
  )
);
