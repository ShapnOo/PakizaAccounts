import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Download,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { UploadHistoryRow, UploadStatus } from '../../types/bulk';
import { UploadStatusChip } from './UploadStatusChip';
import { useBulkUploadStore } from '../../stores/bulkUploadStore';
import { EmptyState } from './EmptyState';

export const UploadHistoryTable: React.FC = () => {
  const { history, loading, removeHistoryItem, downloadSample } = useBulkUploadStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UploadStatus>('ALL');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [fileDetailsRow, setFileDetailsRow] = useState<UploadHistoryRow | null>(null);

  // Filtered rows
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !search.trim() ||
        item.fileName.toLowerCase().includes(search.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [history, search, statusFilter]);

  // Pagination
  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredHistory.length / pageSize);
  const paginatedRows = useMemo(() => {
    if (pageSize === -1) return filteredHistory;
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage, pageSize]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${mins}`;
    } catch {
      return isoString;
    }
  };

  const handleDelete = async (id: string) => {
    await removeHistoryItem(id);
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  if (loading && history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs text-slate-500 font-medium">Loading upload history...</span>
      </div>
    );
  }

  if (history.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">History</h2>
          <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
            {filteredHistory.length}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by filename or user..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="py-1.5 pl-3 pr-8 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Success">Success</option>
              <option value="Partial">Partial</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider select-none">
              <th className="py-3 px-4 sm:px-6">Upload Date</th>
              <th className="py-3 px-4 sm:px-6 text-right">No. of Voucher</th>
              <th className="py-3 px-4 sm:px-6 text-center">Status</th>
              <th className="py-3 px-4 text-center w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  No upload records match your filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                      <div>
                        <div>{formatDate(row.uploadDate)}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {row.fileName} • by {row.uploadedBy}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-right font-mono font-medium text-slate-800 tabular-nums">
                    {row.noOfVoucher.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-center">
                    <UploadStatusChip status={row.status} />
                  </td>
                  <td className="py-3 px-4 text-center relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(activeMenuId === row.id ? null : row.id)
                      }
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Action Dropdown Menu */}
                    {activeMenuId === row.id && (
                      <div
                        className="absolute right-4 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100 text-left"
                        onMouseLeave={() => setActiveMenuId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setFileDetailsRow(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>View file info</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            downloadSample();
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download template</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmId(row.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Remove from history</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="py-1 px-2 border border-slate-200 rounded bg-white font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={-1}>All</option>
          </select>
          <span className="text-slate-400">
            Showing {filteredHistory.length === 0 ? 0 : (currentPage - 1) * (pageSize === -1 ? filteredHistory.length : pageSize) + 1} to{' '}
            {pageSize === -1 ? filteredHistory.length : Math.min(currentPage * pageSize, filteredHistory.length)} of {filteredHistory.length}
          </span>
        </div>

        {pageSize !== -1 && totalPages > 1 && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Remove from History?</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              Are you sure you want to remove this upload log from your history? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Details Info Modal */}
      {fileDetailsRow && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <FileText className="w-5 h-5" />
                <h3 className="text-base font-semibold text-slate-900">File Information</h3>
              </div>
              <button
                type="button"
                onClick={() => setFileDetailsRow(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">File Name:</span>
                <span className="font-semibold text-slate-800">{fileDetailsRow.fileName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Uploaded Date:</span>
                <span className="font-medium text-slate-800">{formatDate(fileDetailsRow.uploadDate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Vouchers Imported:</span>
                <span className="font-bold text-slate-900 font-mono">{fileDetailsRow.noOfVoucher}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Uploaded By:</span>
                <span className="font-medium text-slate-800">{fileDetailsRow.uploadedBy}</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-slate-500">Import Status:</span>
                <UploadStatusChip status={fileDetailsRow.status} />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setFileDetailsRow(null)}
                className="px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
