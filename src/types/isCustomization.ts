export type ReportType = 'Comprehensive' | 'Summary';
export type RowKind = 'parent' | 'child';

export type ISCustomRow = {
  id: string;
  kind: RowKind;
  particulars: string;
  code: string;
  formula?: string;
  parentCode?: string;
  isCustom?: boolean;
  order: number;
};

export type MasterListItem = {
  id: string;
  section: string;
  label: string;
  isSectionHeader: boolean;
};

export type ISCustomization = {
  reportType: ReportType;
  reportTitle: string;
  rows: ISCustomRow[];
  updatedAt: string;
};

export type ISCustomizationState = {
  comprehensive: ISCustomization;
  summary: ISCustomization;
};

export const REPORT_TYPES: ReportType[] = ['Comprehensive', 'Summary'];

export const DEFAULT_TITLES: Record<ReportType, string> = {
  Comprehensive: 'Statement of Comprehensive Income',
  Summary: 'Statement of Summary Income',
};

export const CODE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
