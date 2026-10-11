import React, { useMemo } from 'react';
import { SearchableSelect, SearchableSelectOption } from '../../shared/SearchableSelect';
import { INITIAL_ACCOUNTS } from '../../../mock/accounts';
import { MOCK_SUBSIDIARIES } from '../../../mock/subsidiaries';
import { MOCK_COST_CENTERS } from '../../../mock/costCenters';
import { MOCK_EMPLOYEES } from '../../../mock/employees';
import { MOCK_VEHICLES } from '../../../mock/vehicles';

interface ValueReferencePickerProps {
  optionsSource?: 'coa' | 'subsidiary' | 'costCenter' | 'employee' | 'vehicle' | 'currency';
  value: string | number | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export const ValueReferencePicker: React.FC<ValueReferencePickerProps> = ({
  optionsSource = 'coa',
  value,
  onChange,
  disabled,
}) => {
  const options: SearchableSelectOption[] = useMemo(() => {
    switch (optionsSource) {
      case 'coa':
        return INITIAL_ACCOUNTS.map((acc) => ({
          value: acc.name, // Using name for direct readable match (also compatible if user matches by name)
          label: acc.name,
          code: acc.manualCode || acc.code,
          path: acc.path && acc.path.length > 0 ? acc.path.join(' › ') : [acc.nature, acc.accountsType, acc.name].filter(Boolean).join(' › '),
          group: acc.nature,
        }));

      case 'subsidiary':
        return MOCK_SUBSIDIARIES.map((sub) => ({
          value: sub.name,
          label: sub.name,
          subLabel: sub.partyType,
          group: sub.partyType,
        }));

      case 'costCenter':
        return MOCK_COST_CENTERS.map((cc) => ({
          value: cc.name,
          label: cc.name,
          code: cc.code,
        }));

      case 'employee':
        return MOCK_EMPLOYEES.map((emp) => {
          const empId = emp.code || emp.id;
          return {
            value: emp.name,
            label: `${emp.name} (${empId})`,
            code: empId,
            subLabel: emp.designation ? `${emp.designation} · ${emp.department}` : emp.department,
          };
        });

      case 'vehicle':
        return MOCK_VEHICLES.map((v) => ({
          value: v.name,
          label: v.name,
          code: v.code,
        }));

      case 'currency':
        return ['BDT', 'USD', 'EUR', 'GBP', 'INR'].map((curr) => ({
          value: curr,
          label: curr,
        }));

      default:
        return [];
    }
  }, [optionsSource]);

  return (
    <SearchableSelect
      value={value ? String(value) : ''}
      onChange={(v) => onChange(v || null)}
      options={options}
      placeholder="Select reference..."
      searchPlaceholder={`Search ${optionsSource}...`}
      disabled={disabled}
      buttonClassName="h-8 text-xs font-normal text-slate-800 bg-white border-slate-200 hover:border-slate-300 shadow-none"
      popoverWidth="min-w-[280px]"
    />
  );
};
