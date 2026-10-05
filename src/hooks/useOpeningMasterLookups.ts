import { useMemo } from 'react';
import { MOCK_ACCOUNTS } from '../mock/accounts';
import { MOCK_COST_CENTERS } from '../mock/costCenters';
import { MOCK_SUBSIDIARIES } from '../mock/subsidiaries';
import { MOCK_EMPLOYEES } from '../mock/employees';
import { MOCK_VEHICLES } from '../mock/vehicles';

export function useOpeningMasterLookups() {
  const accountMap = useMemo(() => {
    const map = new Map<string, (typeof MOCK_ACCOUNTS)[0]>();
    MOCK_ACCOUNTS.forEach((acc) => map.set(acc.id, acc));
    return map;
  }, []);

  const costCenterMap = useMemo(() => {
    const map = new Map<string, (typeof MOCK_COST_CENTERS)[0]>();
    MOCK_COST_CENTERS.forEach((cc) => map.set(cc.id, cc));
    return map;
  }, []);

  const subsidiaryMap = useMemo(() => {
    const map = new Map<string, (typeof MOCK_SUBSIDIARIES)[0]>();
    MOCK_SUBSIDIARIES.forEach((sub) => map.set(sub.id, sub));
    return map;
  }, []);

  const employeeMap = useMemo(() => {
    const map = new Map<string, (typeof MOCK_EMPLOYEES)[0]>();
    MOCK_EMPLOYEES.forEach((emp) => map.set(emp.id, emp));
    return map;
  }, []);

  const vehicleMap = useMemo(() => {
    const map = new Map<string, (typeof MOCK_VEHICLES)[0]>();
    MOCK_VEHICLES.forEach((veh) => map.set(veh.id, veh));
    return map;
  }, []);

  return {
    getAccount: (id?: string) => (id ? accountMap.get(id) : undefined),
    getCostCenter: (id?: string) => (id ? costCenterMap.get(id) : undefined),
    getSubsidiary: (id?: string) => (id ? subsidiaryMap.get(id) : undefined),
    getEmployee: (id?: string) => (id ? employeeMap.get(id) : undefined),
    getVehicle: (id?: string) => (id ? vehicleMap.get(id) : undefined),
  };
}
