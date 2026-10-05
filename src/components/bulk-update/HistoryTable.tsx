import React, { useState, useMemo } from 'react';
import {
  Search,
  MoreVertical,
  RotateCcw,
  Eye,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { UpdateHistoryRow, UpdateStatus } from '../../types/bulk';
import { StatusChip } from './StatusChip';
import { useBulkUpdateStore } from '../../stores/bulkUpdateStore';

interface HistoryTableProps {
  onUndoMock?: (desc: string) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ onUndoMock }) => {
  const { history, loading, openDetailsModal, openFilterModal } = useBulkUpdateStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UpdateStatus>('ALL');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !search.trim() ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.userName.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [history, search, statusFilter]);

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

  const renderDescription = (desc: string) => {
    // Format: "{Field} Update: {Existing} to {New}"
    const parts = desc.split(' Update: ');
    if (parts.length === 2) {
      const fieldName = parts[0];
      const changeParts = parts[1].split(' to ');
      if (changeParts.length === 2) {
        return (
          <span>
            <strong className="font-semibold text-slate-900">{fieldName} Update:</strong>{' '}
            <span className="text-rose-600 font-medium">{changeParts[0]}</span>{' '}
            <span className="text-slate-400 font-normal">to</span>{' '}
            <span className="text-emerald-700 font-semibold">{changeParts[1]}</span>
          </span>
        );
      }
    }
    return <span className="font-medium text-slate-800">{desc}</span>;
  };

  if (loading && history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs text-slate-500 font-medium">Loading update history...</span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
        <Clock className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-semibold text-slate-900 mb-1">No update logs yet</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4">
          Perform your first bulk update to track changes and audit trails here.
        </p>
        <button
          type="button"
          onClick={openFilterModal}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          Filter and Update
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header & Toolbar */}
      <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">History</h2>
          <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
            {filteredHistory.length}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description or user..."
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
              <option value="Complete">Complete</option>
              <option value="Partial">Partial</option>
              <option value="In Progress">In Progress</option>
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
              <th className="py-3 px-4 sm:px-6">Update Date</th>
              <th className="py-3 px-4 sm:px-6">Description</th>
              <th className="py-3 px-4 text-center">No. of Data</th>
              <th className="py-3 px-4 sm:px-6">User Name</th>
              <th className="py-3 px-4 sm:px-6 text-center">Status</th>
              <th className="py-3 px-4 text-center w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No update logs match your filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => openDetailsModal(row)}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap font-medium text-slate-900">
                    {formatDate(row.updateDate)}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-slate-800">
                    {renderDescription(row.description)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 font-mono">
                      {row.noOfData}
                    </span>
                  </td>
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {row.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{row.userName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-center">
                    <StatusChip status={row.status} />
                  </td>
                  <td
                    className="py-3 px-4 text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                        className="absolute right-4 top-10 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100 text-left"
                        onMouseLeave={() => setActiveMenuId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            openDetailsModal(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onUndoMock) onUndoMock(row.description);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                          <span>Undo changes</span>
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
    </div>
  );
};
