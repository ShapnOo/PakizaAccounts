import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomField, CustomFieldContext } from '../../types/customField';
import { useCustomFieldStore } from '../../stores/customFieldStore';
import { BuilderHeader } from '../../components/custom-fields/BuilderHeader';
import { ContextTabs } from '../../components/custom-fields/ContextTabs';
import { ContextInfoBar } from '../../components/custom-fields/ContextInfoBar';
import { CustomFieldTable } from '../../components/custom-fields/CustomFieldTable';
import { CustomFieldModal } from '../../components/custom-fields/CustomFieldModal';
import { DeleteConfirmDialog } from '../../components/custom-fields/DeleteConfirmDialog';
import { PreviewModal } from '../../components/custom-fields/PreviewModal';

const VALID_CONTEXTS: CustomFieldContext[] = [
  'journal',
  'payment',
  'receive',
  'contra',
  'opening-balance',
  'coa',
];

export const CustomFieldBuilderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    fields,
    activeContext,
    loading,
    load,
    setContext,
    add,
    update,
    remove,
    duplicate,
    toggleActive,
    toggleMandatory,
    reorder,
  } = useCustomFieldStore();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<CustomField | null>(null);
  const [deletingField, setDeletingField] = useState<CustomField | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Initialize from URL or store
  useEffect(() => {
    const ctxParam = searchParams.get('ctx') as CustomFieldContext | null;
    if (ctxParam && VALID_CONTEXTS.includes(ctxParam)) {
      setContext(ctxParam);
    }
    load();
  }, [load, setContext, searchParams]);

  // Context switch handler
  const handleContextChange = (ctx: CustomFieldContext) => {
    setContext(ctx);
    setSearchParams({ ctx });
  };

  // Create Field handler
  const handleOpenNew = () => {
    setFieldToEdit(null);
    setIsModalOpen(true);
  };

  // Edit Field handler
  const handleEdit = (field: CustomField) => {
    setFieldToEdit(field);
    setIsModalOpen(true);
  };

  // Delete Field handlers
  const handleDeleteClick = (field: CustomField) => {
    setDeletingField(field);
  };

  const handleConfirmDelete = async () => {
    if (deletingField) {
      await remove(deletingField.id);
      setDeletingField(null);
    }
  };

  // Inline rename handler
  const handleInlineRename = async (id: string, newLabel: string) => {
    await update(id, { label: newLabel });
  };

  // Active fields count for header
  const currentContextFields = useMemo(() => {
    return fields.filter((f) => f.context === activeContext);
  }, [fields, activeContext]);

  const activeCount = useMemo(() => {
    return currentContextFields.filter((f) => f.activeStatus === 'Active').length;
  }, [currentContextFields]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-20">
      {/* ── 1. Top Builder Header ── */}
      <BuilderHeader
        activeContext={activeContext}
        activeCount={activeCount}
        totalCount={currentContextFields.length}
        onOpenNew={handleOpenNew}
        onOpenPreview={() => setIsPreviewOpen(true)}
      />

      {/* ── 2. Context Navigation Tabs & Info Banner ── */}
      <div className="space-y-0">
        <ContextTabs
          activeContext={activeContext}
          onSelect={handleContextChange}
          fields={fields}
        />
        <ContextInfoBar context={activeContext} />
      </div>

      {/* ── 3. Custom Field Table ── */}
      <CustomFieldTable
        context={activeContext}
        fields={fields}
        loading={loading}
        onEdit={handleEdit}
        onDuplicate={duplicate}
        onDelete={handleDeleteClick}
        onToggleMandatory={toggleMandatory}
        onToggleActive={toggleActive}
        onInlineRename={handleInlineRename}
        onReorder={reorder}
        onAddNew={handleOpenNew}
      />

      {/* ── 4. In-Place Create / Edit Modal ── */}
      <CustomFieldModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFieldToEdit(null);
        }}
        onSave={add}
        onUpdate={update}
        fieldToEdit={fieldToEdit}
        initialContext={activeContext}
        existingFields={fields}
      />

      {/* ── 5. Delete Confirm Dialog ── */}
      <DeleteConfirmDialog
        field={deletingField}
        isOpen={!!deletingField}
        onClose={() => setDeletingField(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* ── 6. Live Entry Preview Modal ── */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        context={activeContext}
        fields={fields}
      />
    </div>
  );
};
