import React from 'react';
import { BSTreeRow, ValueShowIn } from '../../types/balanceSheet';
import { SectionHeaderRow } from './SectionHeaderRow';
import { TotalRow } from './TotalRow';
import { ParentRow } from './ParentRow';
import { LeafRow } from './LeafRow';

interface TableRowProps {
  row: BSTreeRow;
  years: string[];
  subLedger: boolean;
  currency: string;
  showInPercent: boolean;
  baseForPercent: number | null;
  valueShowIn: ValueShowIn;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isBalanced?: boolean;
  balanceDifference?: number;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  years,
  subLedger,
  currency,
  showInPercent,
  baseForPercent,
  valueShowIn,
  isCollapsed,
  onToggleCollapse,
  isBalanced,
  balanceDifference,
}) => {
  // Case 1: Level 1 Section Header ("Assets", "Liabilities & Owner's Equity")
  if (row.isParent && row.level === 1) {
    return (
      <SectionHeaderRow
        row={row}
        years={years}
        subLedger={subLedger}
        currency={currency}
        showInPercent={showInPercent}
        baseForPercent={baseForPercent}
        valueShowIn={valueShowIn}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
    );
  }

  // Case 2: Totals rows
  if (row.isTotal) {
    return (
      <TotalRow
        row={row}
        years={years}
        subLedger={subLedger}
        currency={currency}
        showInPercent={showInPercent}
        baseForPercent={baseForPercent}
        valueShowIn={valueShowIn}
        isBalanced={isBalanced}
        balanceDifference={balanceDifference}
      />
    );
  }

  // Case 3: Parent row (L2 - L4)
  if (row.isParent) {
    return (
      <ParentRow
        row={row}
        years={years}
        subLedger={subLedger}
        currency={currency}
        showInPercent={showInPercent}
        baseForPercent={baseForPercent}
        valueShowIn={valueShowIn}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
    );
  }

  // Case 4: Leaf row
  return (
    <LeafRow
      row={row}
      years={years}
      subLedger={subLedger}
      currency={currency}
      showInPercent={showInPercent}
      baseForPercent={baseForPercent}
      valueShowIn={valueShowIn}
    />
  );
};

