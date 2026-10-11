import {
  AdvanceFilterState,
  FilterCondition,
  VALUELESS_OPERATORS,
} from '../types/advanceFilter';

export function compileAdvanceFilter(
  state: AdvanceFilterState
): (row: any) => boolean {
  const predicates = (state.conditions || [])
    .map((c) => compileCondition(c))
    .filter(Boolean) as ((r: any) => boolean)[];

  if (predicates.length === 0) return () => true;

  return (row: any) =>
    state.combinator === 'AND'
      ? predicates.every((p) => p(row))
      : predicates.some((p) => p(row));
}

function getRowFieldValue(row: any, fieldKey: string): any {
  if (!row) return undefined;

  switch (fieldKey) {
    case 'accountsHead':
      return (
        row.accountHeadName ||
        row.accountsHead ||
        row.accountHeadId ||
        row.headerAccountName ||
        row.headerAccountId ||
        row.accountName ||
        row.account ||
        ''
      );
    case 'subsidiary':
      return (
        row.subsidiaryName ||
        row.subsidiary ||
        row.subsidiaryId ||
        row.partyName ||
        ''
      );
    case 'costCenter':
      return (
        row.costCenterName ||
        row.costCenter ||
        row.costCenterId ||
        row.headerCostCenterId ||
        ''
      );
    case 'employee':
      return (
        row.employeeName ||
        row.employee ||
        row.employeeId ||
        ''
      );
    case 'vehicle':
      return (
        row.vehicleName ||
        row.vehicle ||
        row.vehicleId ||
        ''
      );
    case 'voucherNo':
      return row.voucherNo || row.voucherNumber || '';
    case 'voucherType':
      return row.voucherType || row.voucherName || '';
    case 'approvalStatus':
      return row.approvalStatus || 'Approved';
    case 'source':
      return row.source || '';
    case 'reference':
      return row.reference || '';
    case 'narration':
      return row.narration || row.description || '';
    case 'currency':
      return row.currency || 'BDT';
    case 'date':
      return row.date || row.voucherDate || '';
    case 'amount':
      return row.amount ?? row.debit ?? row.credit ?? row.debitBDT ?? row.creditBDT ?? 0;
    default:
      return row[fieldKey];
  }
}

function compileCondition(c: FilterCondition): ((r: any) => boolean) | null {
  if (!c.fieldKey || !c.operator) return null;

  const isValueless = VALUELESS_OPERATORS.includes(c.operator);
  if (!isValueless && (c.value === null || c.value === undefined || c.value === '')) {
    return null; // Incomplete row silently skipped
  }

  const baseTest = compileBaseCondition(c);
  if (!baseTest) return null;

  return (row: any) => {
    if (baseTest(row)) return true;
    if (row && Array.isArray(row.lines) && row.lines.length > 0) {
      return row.lines.some((line: any) => baseTest(line));
    }
    return false;
  };
}

function compileBaseCondition(c: FilterCondition): ((r: any) => boolean) | null {

  const v = c.value;

  switch (c.operator) {
    case 'is':
      return (r: any) => {
        const rowVal = getRowFieldValue(r, c.fieldKey);
        if (typeof rowVal === 'string' && typeof v === 'string') {
          return rowVal.toLowerCase().trim() === v.toLowerCase().trim();
        }
        return rowVal === v;
      };

    case 'isNot':
      return (r: any) => {
        const rowVal = getRowFieldValue(r, c.fieldKey);
        if (typeof rowVal === 'string' && typeof v === 'string') {
          return rowVal.toLowerCase().trim() !== v.toLowerCase().trim();
        }
        return rowVal !== v;
      };

    case 'contains':
      return (r: any) => {
        const rowVal = String(getRowFieldValue(r, c.fieldKey) ?? '').toLowerCase();
        return rowVal.includes(String(v ?? '').toLowerCase());
      };

    case 'notContains':
      return (r: any) => {
        const rowVal = String(getRowFieldValue(r, c.fieldKey) ?? '').toLowerCase();
        return !rowVal.includes(String(v ?? '').toLowerCase());
      };

    case 'startsWith':
      return (r: any) => {
        const rowVal = String(getRowFieldValue(r, c.fieldKey) ?? '').toLowerCase();
        return rowVal.startsWith(String(v ?? '').toLowerCase());
      };

    case 'endsWith':
      return (r: any) => {
        const rowVal = String(getRowFieldValue(r, c.fieldKey) ?? '').toLowerCase();
        return rowVal.endsWith(String(v ?? '').toLowerCase());
      };

    case 'eq':
      return (r: any) => Number(getRowFieldValue(r, c.fieldKey)) === Number(v);

    case 'neq':
      return (r: any) => Number(getRowFieldValue(r, c.fieldKey)) !== Number(v);

    case 'gt':
      return (r: any) => Number(getRowFieldValue(r, c.fieldKey)) > Number(v);

    case 'gte':
      return (r: any) => Number(getRowFieldValue(r, c.fieldKey)) >= Number(v);

    case 'lt':
      return (r: any) => Number(getRowFieldValue(r, c.fieldKey)) < Number(v);

    case 'lte':
      return (r: any) => Number(getRowFieldValue(r, c.fieldKey)) <= Number(v);

    case 'between':
      return (r: any) => {
        const rowVal = getRowFieldValue(r, c.fieldKey);
        if (Array.isArray(v) && v.length === 2) {
          if (c.fieldKey === 'date') {
            const [dFrom, dTo] = v as [string, string];
            if (!dFrom && !dTo) return true;
            const rowDate = String(rowVal || '');
            if (dFrom && rowDate < dFrom) return false;
            if (dTo && rowDate > dTo) return false;
            return true;
          }
          const [nMin, nMax] = v as [number, number];
          const n = Number(rowVal);
          return n >= Number(nMin) && n <= Number(nMax);
        }
        return true;
      };

    case 'before':
      return (r: any) => {
        const rowDate = String(getRowFieldValue(r, c.fieldKey) ?? '');
        return rowDate < String(v ?? '');
      };

    case 'after':
      return (r: any) => {
        const rowDate = String(getRowFieldValue(r, c.fieldKey) ?? '');
        return rowDate > String(v ?? '');
      };

    case 'isEmpty':
      return (r: any) => {
        const rowVal = getRowFieldValue(r, c.fieldKey);
        return rowVal == null || rowVal === '';
      };

    case 'isNotEmpty':
      return (r: any) => {
        const rowVal = getRowFieldValue(r, c.fieldKey);
        return rowVal != null && rowVal !== '';
      };

    default:
      return null;
  }
}
