import * as XLSX from 'xlsx';
import { UploadHistoryRow } from '../types/bulk';
import { MOCK_UPLOAD_HISTORY } from '../mock/uploadHistory';
import { delay } from '../lib/delay';

const LS_UPLOAD_KEY = 'bulk-upload-history-v2';

export async function listUploadHistory(): Promise<UploadHistoryRow[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_UPLOAD_KEY);
  if (!raw) {
    localStorage.setItem(LS_UPLOAD_KEY, JSON.stringify(MOCK_UPLOAD_HISTORY));
    return MOCK_UPLOAD_HISTORY;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : MOCK_UPLOAD_HISTORY;
  } catch (e) {
    return MOCK_UPLOAD_HISTORY;
  }
}

export async function recordUpload(
  payload: Omit<UploadHistoryRow, 'id' | 'uploadDate'>
): Promise<UploadHistoryRow> {
  await delay(400);
  const all = await listUploadHistory();
  const next: UploadHistoryRow = {
    ...payload,
    id: `up-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    uploadDate: new Date().toISOString(),
  };
  const updated = [next, ...all];
  localStorage.setItem(LS_UPLOAD_KEY, JSON.stringify(updated));
  return next;
}

export async function deleteUploadHistory(id: string): Promise<void> {
  await delay(250);
  const all = await listUploadHistory();
  const filtered = all.filter((item) => item.id !== id);
  localStorage.setItem(LS_UPLOAD_KEY, JSON.stringify(filtered));
}

export async function generateSampleTemplate(): Promise<Blob> {
  await delay(200);
  const headers = [
    [
      'Voucher No',
      'Voucher Date',
      'Voucher Type',
      'Accounts Head',
      'Cost Center',
      'Subsidiary',
      'Employee',
      'Vehicle',
      'Reference',
      'Description',
      'Currency',
      'Exc. Rate',
      'Debit',
      'Credit',
    ],
    [
      'JV2600001',
      '2026-09-03',
      'Journal',
      'Cash in Hand',
      'Head Office',
      '',
      '',
      '',
      'REF-SAMPLE-01',
      'Opening cash balance entry',
      'BDT',
      1,
      5000,
      0,
    ],
    [
      'JV2600001',
      '2026-09-03',
      'Journal',
      'Advance to Employee',
      'Head Office',
      '',
      'Riazul Islam',
      '',
      'REF-SAMPLE-01',
      'Opening staff tour float',
      'BDT',
      1,
      0,
      5000,
    ],
    [
      'PV2600002',
      '2026-09-04',
      'Payment',
      'Office Refreshment Expense',
      'Head Office',
      '',
      '',
      '',
      'REF-SAMPLE-02',
      'Pantry tea supplies',
      'BDT',
      1,
      1200,
      0,
    ],
    [
      'PV2600002',
      '2026-09-04',
      'Payment',
      'Dutch-Bangla Bank - Principal Branch',
      'Head Office',
      '',
      '',
      '',
      'REF-SAMPLE-02',
      'Cheque payment settlement',
      'BDT',
      1,
      0,
      1200,
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(headers);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'VoucherTemplate');
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  return new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export interface ParseUploadResult {
  fileName: string;
  totalRows: number;
  validRows: any[];
  errors: { row: number; message: string }[];
}

export async function parseUploadFile(file: File): Promise<ParseUploadResult> {
  await delay(450);
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(ws);

  const errors: { row: number; message: string }[] = [];
  const validRows: any[] = [];

  rows.forEach((r: any, idx) => {
    const rowNum = idx + 2; // header is row 1
    const vNo = r['Voucher No'] || r['voucherNo'] || r['VoucherNo'];
    const accHead = r['Accounts Head'] || r['accountsHead'] || r['Account Head'];
    const debit = r['Debit'] != null ? Number(r['Debit']) : 0;
    const credit = r['Credit'] != null ? Number(r['Credit']) : 0;

    if (!vNo) {
      errors.push({ row: rowNum, message: 'Voucher No is required' });
    } else if (!accHead) {
      errors.push({ row: rowNum, message: 'Accounts Head is missing' });
    } else if (isNaN(debit) || isNaN(credit)) {
      errors.push({ row: rowNum, message: 'Invalid numeric amount in Debit/Credit' });
    } else {
      validRows.push({
        rowNumber: rowNum,
        voucherNo: vNo,
        voucherDate: r['Voucher Date'] || r['voucherDate'] || '2026-10-01',
        voucherType: r['Voucher Type'] || r['voucherType'] || 'Journal',
        accountsHead: accHead,
        costCenter: r['Cost Center'] || r['costCenter'] || '',
        subsidiary: r['Subsidiary'] || r['subsidiary'] || '',
        employee: r['Employee'] || r['employee'] || '',
        vehicle: r['Vehicle'] || r['vehicle'] || '',
        reference: r['Reference'] || r['reference'] || '',
        description: r['Description'] || r['description'] || '',
        currency: r['Currency'] || 'BDT',
        exchangeRate: Number(r['Exc. Rate'] || r['exchangeRate'] || 1),
        debit,
        credit,
      });
    }
  });

  return {
    fileName: file.name,
    totalRows: rows.length,
    validRows,
    errors,
  };
}
