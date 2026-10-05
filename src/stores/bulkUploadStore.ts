import { create } from 'zustand';
import { UploadHistoryRow, UploadStatus } from '../types/bulk';
import {
  listUploadHistory,
  recordUpload,
  deleteUploadHistory,
  parseUploadFile,
  generateSampleTemplate,
  ParseUploadResult,
} from '../services/bulkUploadService';

interface BulkUploadState {
  history: UploadHistoryRow[];
  loading: boolean;
  uploading: boolean;
  preview: ParseUploadResult | null;
  activeFile: File | null;
  searchQuery: string;
  statusFilter: 'ALL' | UploadStatus;

  loadHistory: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'ALL' | UploadStatus) => void;
  handleFileSelect: (file: File) => Promise<void>;
  clearPreview: () => void;
  confirmUpload: (userName?: string) => Promise<UploadHistoryRow | null>;
  removeHistoryItem: (id: string) => Promise<void>;
  downloadSample: () => Promise<void>;
}

export const useBulkUploadStore = create<BulkUploadState>((set, get) => ({
  history: [],
  loading: false,
  uploading: false,
  preview: null,
  activeFile: null,
  searchQuery: '',
  statusFilter: 'ALL',

  loadHistory: async () => {
    set({ loading: true });
    try {
      const data = await listUploadHistory();
      set({ history: data, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStatusFilter: (status: 'ALL' | UploadStatus) => set({ statusFilter: status }),

  handleFileSelect: async (file: File) => {
    set({ uploading: true, activeFile: file });
    try {
      const result = await parseUploadFile(file);
      set({ preview: result, uploading: false });
    } catch (e) {
      set({ uploading: false, activeFile: null });
    }
  },

  clearPreview: () => {
    set({ preview: null, activeFile: null });
  },

  confirmUpload: async (userName = 'Riazul Islam') => {
    const { preview } = get();
    if (!preview) return null;

    set({ uploading: true });
    try {
      let status: UploadStatus = 'Success';
      if (preview.errors.length > 0) {
        if (preview.validRows.length === 0) {
          status = 'Failed';
        } else {
          status = 'Partial';
        }
      }

      const newRow = await recordUpload({
        fileName: preview.fileName,
        noOfVoucher: preview.validRows.length,
        status,
        uploadedBy: userName,
      });

      const updatedHistory = await listUploadHistory();
      set({
        history: updatedHistory,
        preview: null,
        activeFile: null,
        uploading: false,
      });
      return newRow;
    } catch (e) {
      set({ uploading: false });
      return null;
    }
  },

  removeHistoryItem: async (id: string) => {
    await deleteUploadHistory(id);
    const updated = await listUploadHistory();
    set({ history: updated });
  },

  downloadSample: async () => {
    const blob = await generateSampleTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voucher_template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));
