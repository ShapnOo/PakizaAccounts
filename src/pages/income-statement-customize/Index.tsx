import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import {
  useISCustomizationStore,
  selectActive,
  selectRows,
} from '../../stores/isCustomizationStore';
import type { ReportType, ISCustomRow } from '../../types/isCustomization';
import { DEFAULT_TITLES } from '../../mock/isCustomization';
import { validateFormula } from '../../lib/isCustomizationMath';
import { customizationSchema } from '../../lib/validation/isCustomization';

import { CustomizeHeader } from '../../components/income-statement-customize/CustomizeHeader';
import { ReportTypeDropdown } from '../../components/income-statement-customize/ReportTypeDropdown';
import { ReportTitleInput } from '../../components/income-statement-customize/ReportTitleInput';
import { ActionButtons } from '../../components/income-statement-customize/ActionButtons';
import { RowsTable } from '../../components/income-statement-customize/RowsTable';
import { AddListModal } from '../../components/income-statement-customize/AddListModal';
import { ManageMasterListModal } from '../../components/income-statement-customize/ManageMasterListModal';
import { CascadeDeleteDialog } from '../../components/income-statement-customize/CascadeDeleteDialog';

export const IncomeStatementCustomizePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Zustand subscriptions
  const activeReportType = useISCustomizationStore((s) => s.activeReportType);
  const dirty = useISCustomizationStore((s) => s.dirty);
  const loading = useISCustomizationStore((s) => s.loading);
  const saving = useISCustomizationStore((s) => s.saving);
  const masterList = useISCustomizationStore((s) => s.masterList);
  const createMasterItem = useISCustomizationStore((s) => s.createMasterItem);
  const deleteMasterItem = useISCustomizationStore((s) => s.deleteMasterItem);
  const newlyAddedRowId = useISCustomizationStore((s) => s.newlyAddedRowId);

  const setReportType = useISCustomizationStore((s) => s.setReportType);
  const setReportTitle = useISCustomizationStore((s) => s.setReportTitle);
  const updateRow = useISCustomizationStore((s) => s.updateRow);
  const addHead = useISCustomizationStore((s) => s.addHead);
  const addSubHead = useISCustomizationStore((s) => s.addSubHead);
  const addTextLine = useISCustomizationStore((s) => s.addTextLine);
  const addListLines = useISCustomizationStore((s) => s.addListLines);
  const removeRow = useISCustomizationStore((s) => s.removeRow);
  const reorderRows = useISCustomizationStore((s) => s.reorderRows);
  const clearNewlyAddedRowId = useISCustomizationStore((s) => s.clearNewlyAddedRowId);
  const load = useISCustomizationStore((s) => s.load);
  const save = useISCustomizationStore((s) => s.save);
  const resetToDefault = useISCustomizationStore((s) => s.resetToDefault);

  const activeCustom = useISCustomizationStore(selectActive);
  const rows = useISCustomizationStore(selectRows);
  const parentRows = useMemo(() => rows.filter((r) => r.kind === 'parent'), [rows]);

  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [isManageMasterOpen, setIsManageMasterOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState<ISCustomRow | null>(null);

  const usedLabels = useMemo(() => {
    return new Set(rows.map((r) => r.particulars.trim().toLowerCase()));
  }, [rows]);

  // Sync URL query param ?type=Summary on mount
  useEffect(() => {
    load();
    const typeParam = searchParams.get('type');
    if (typeParam === 'Summary' || typeParam === 'Comprehensive') {
      setReportType(typeParam as ReportType, false);
    }
  }, []);

  // Clear flash highlight on newly added row after 1.5s
  useEffect(() => {
    if (newlyAddedRowId) {
      const timer = setTimeout(() => {
        clearNewlyAddedRowId();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [newlyAddedRowId, clearNewlyAddedRowId]);

  const handleTypeChange = (type: ReportType) => {
    if (type === activeReportType) return;

    // Check if title was customized
    const currentDefault = DEFAULT_TITLES[activeReportType];
    const isTitleCustomized = activeCustom.reportTitle !== currentDefault;

    if (isTitleCustomized) {
      const confirmChange = window.confirm(
        `Switching Report Type to ${type} will replace the customized title with "${DEFAULT_TITLES[type]}". Continue?`
      );
      if (!confirmChange) return;
    }

    setReportType(type, true);
    setSearchParams({ type });
    toast.info(`Switched to ${type} Income Statement`);
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      `Reset ${activeReportType} Income Statement structure to factory defaults? All unsaved customizations will be lost.`
    );
    if (!confirmed) return;

    try {
      await resetToDefault();
      toast.info(`Reset ${activeReportType} structure to factory default`);
    } catch {
      toast.error('Failed to reset structure');
    }
  };

  // Add Head (Parent Section Header)
  const handleAddHead = (refRow?: ISCustomRow) => {
    addHead(refRow?.id);
    toast.success('Added new Section Head. Type title and enter formula.');
  };

  // Add Sub Head (Line Item)
  const handleAddSubHead = (refRow?: ISCustomRow) => {
    let parentCode: string | undefined;
    if (refRow?.kind === 'parent') {
      parentCode = refRow.code;
    } else if (refRow?.parentCode) {
      parentCode = refRow.parentCode;
    }
    addSubHead(parentCode, refRow?.id);
    toast.success(
      parentCode
        ? `Added Sub Head under Section ${parentCode}. Select or type account.`
        : 'Added Sub Head. Select or type account.'
    );
  };

  // Validate all formulas in rows to block saving if invalid
  const hasInvalidFormula = useMemo(() => {
    return rows.some((r) => {
      if (r.kind === 'parent') {
        const res = validateFormula(r.formula, rows);
        return !res.valid;
      }
      return false;
    });
  }, [rows]);

  const handleSave = async () => {
    // Validate schema
    const validation = customizationSchema.safeParse(activeCustom);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Validation error in rows');
      return;
    }

    try {
      await save();
      toast.success(`${activeReportType} Customization saved successfully`);
      navigate('/reports/financial-statement/income-statement');
    } catch {
      toast.error('Failed to save customization');
    }
  };

  const handleDeleteRequest = (id: string) => {
    const target = rows.find((r) => r.id === id);
    if (!target) return;

    if (target.kind === 'parent') {
      const children = rows.filter((r) => r.parentCode?.toUpperCase() === target.code.toUpperCase());
      if (children.length > 0) {
        setPendingDeleteRow(target);
        return;
      }
    }

    removeRow(id);
    toast.info(`Deleted row "${target.particulars || target.code}"`);
  };

  const handleConfirmCascadeDelete = () => {
    if (!pendingDeleteRow) return;
    removeRow(pendingDeleteRow.id);
    toast.info(`Deleted section "${pendingDeleteRow.particulars}" and its children`);
    setPendingDeleteRow(null);
  };

  const pendingDeleteChildrenCount = useMemo(() => {
    if (!pendingDeleteRow) return 0;
    return rows.filter(
      (r) => r.parentCode?.toUpperCase() === pendingDeleteRow.code.toUpperCase()
    ).length;
  }, [pendingDeleteRow, rows]);

  const parentCount = parentRows.length;
  const childCount = rows.length - parentCount;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1600px] mx-auto space-y-4">
        {/* Main Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 md:p-6 space-y-5">
          {/* Header Row 1 */}
          <CustomizeHeader
            reportType={activeReportType}
            dirty={dirty}
            onReset={handleReset}
          />

          {/* Header Row 2: Report Type Dropdown + Report Title Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <ReportTypeDropdown
              value={activeReportType}
              onChange={handleTypeChange}
            />
            <ReportTitleInput
              title={activeCustom.reportTitle}
              onChange={setReportTitle}
            />
          </div>

          {/* Action Buttons Row */}
          <ActionButtons
            rowCount={rows.length}
            parentCount={parentCount}
            childCount={childCount}
            onAddHead={() => handleAddHead()}
            onAddSubHead={() => handleAddSubHead()}
          />

          {/* Rows Table */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-[13px] flex items-center justify-center gap-2">
              <div className="size-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span>Loading report structure...</span>
            </div>
          ) : (
            <RowsTable
              rows={rows}
              newlyAddedRowId={newlyAddedRowId}
              onUpdateRow={updateRow}
              onRemoveRow={handleDeleteRequest}
              onReorderRows={reorderRows}
              onAddSubHead={(refRow) => handleAddSubHead(refRow)}
              onAddHeadBelow={(refRow) => handleAddHead(refRow)}
              onReset={handleReset}
            />
          )}

          {/* Sticky Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={() => navigate('/reports/financial-statement/income-statement')}
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-medium transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || hasInvalidFormula || saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="size-3.5" />
              <span>{saving ? 'Saving...' : 'Save Customization'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Line (List) Modal */}
      <AddListModal
        isOpen={isAddListOpen}
        parentRows={parentRows}
        currentRows={rows}
        onClose={() => setIsAddListOpen(false)}
        onOpenManageMaster={() => {
          setIsAddListOpen(false);
          setIsManageMasterOpen(true);
        }}
        onAddLines={(items, parentCode) => {
          addListLines(items, parentCode);
          toast.success(`Added ${items.length} lines under Section ${parentCode}`);
        }}
      />

      {/* Manage Master List (Sheet2) Modal */}
      <ManageMasterListModal
        isOpen={isManageMasterOpen}
        masterList={masterList}
        usedLabels={usedLabels}
        onClose={() => setIsManageMasterOpen(false)}
        onCreateMasterItem={async (section, label) => {
          const item = await createMasterItem(section, label);
          toast.success(`Created master account "${label}" under "${section}"`);
          return item;
        }}
        onDeleteMasterItem={async (id) => {
          await deleteMasterItem(id);
          toast.info('Deleted account from master list');
        }}
      />

      {/* Cascade Delete Confirmation Dialog */}
      <CascadeDeleteDialog
        isOpen={Boolean(pendingDeleteRow)}
        row={pendingDeleteRow}
        childrenCount={pendingDeleteChildrenCount}
        onClose={() => setPendingDeleteRow(null)}
        onConfirm={handleConfirmCascadeDelete}
      />
    </div>
  );
};
