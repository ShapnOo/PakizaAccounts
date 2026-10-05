import React, { useEffect } from 'react';
import { Align, VoucherTemplate } from '../../types/voucherTemplate';
import { PaperSection } from './PaperSection';
import { MarginSection } from './MarginSection';
import { FontSection } from './FontSection';
import { HeaderFooterSection } from './HeaderFooterSection';
import { TableSection } from './TableSection';
import { useCustomFields } from '../../hooks/useCustomFields';
import { CustomFieldContext } from '../../types/customField';

interface TemplatePropertiesPanelProps {
  template: VoucherTemplate;
  onUpdate: (patch: any) => void;
  onToggleColumn: (colKey: string) => void;
  onUpdateColumnLabel: (colKey: string, label: string) => void;
  onUpdateColumnAlign?: (colKey: string, align: Align) => void;
  onReorderColumns: (newOrder: string[]) => void;
}

export const TemplatePropertiesPanel: React.FC<TemplatePropertiesPanelProps> = ({
  template,
  onUpdate,
  onToggleColumn,
  onUpdateColumnLabel,
  onUpdateColumnAlign,
  onReorderColumns,
}) => {
  // Read active custom fields for this voucher type context
  const contextName: CustomFieldContext =
    template.voucherType === 'Journal'
      ? 'journal'
      : template.voucherType === 'Payment'
      ? 'payment'
      : template.voucherType === 'Receive'
      ? 'receive'
      : 'contra';

  const { fields: customFields } = useCustomFields(contextName);

  // Synchronize any custom fields into table.columns
  useEffect(() => {
    if (customFields.length === 0) return;

    let hasNew = false;
    const currentCols = { ...template.table.columns };
    const currentOrder = [...(template.table.columnOrder || Object.keys(currentCols))];

    customFields.forEach((cf) => {
      const key = `cf_${cf.id}`;
      if (!currentCols[key]) {
        hasNew = true;
        currentCols[key] = {
          visible: true,
          label: cf.label,
          isCustom: true,
        };
        currentOrder.push(key);
      }
    });

    if (hasNew) {
      onUpdate({
        table: {
          columns: currentCols,
          columnOrder: currentOrder,
        },
      });
    }
  }, [customFields, template.table.columns, template.table.columnOrder, onUpdate]);

  const columnOrder =
    template.table.columnOrder && template.table.columnOrder.length > 0
      ? template.table.columnOrder
      : Object.keys(template.table.columns);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 sidebar-scroll">
      {/* 1. Paper Setup */}
      <PaperSection
        paperSize={template.paper.size}
        orientation={template.paper.orientation}
        customWidthMm={template.paper.customWidthMm}
        customHeightMm={template.paper.customHeightMm}
        onChange={(patch) => onUpdate({ paper: patch })}
      />

      {/* 2. Margin (Inches) */}
      <MarginSection
        top={template.margin.top}
        bottom={template.margin.bottom}
        left={template.margin.left}
        right={template.margin.right}
        onChange={(patch) => onUpdate({ margin: patch })}
      />

      {/* 3. Typography & Font */}
      <FontSection
        family={template.font.family}
        theme={template.font.theme}
        pdfFont={template.font.pdfFont}
        color={template.font.color}
        size={template.font.size}
        background={template.font.background}
        backgroundColor={template.font.backgroundColor}
        onChange={(patch) => onUpdate({ font: patch })}
      />

      {/* 4. Header & Footer */}
      <HeaderFooterSection
        companyNameSize={template.header.companyNameSize}
        addressSize={template.header.addressSize}
        align={template.header.align}
        showLogo={template.header.showLogo ?? true}
        logoUrl={template.header.logoUrl || '/company_logo.png'}
        logoWidth={template.header.logoWidth ?? 70}
        logoPosition={template.header.logoPosition ?? 'left'}
        showPrintDateTime={template.footer.showPrintDateTime}
        showPageNumber={template.footer.showPageNumber}
        footerName={template.footer.name}
        footerText={template.footer.text}
        onChangeHeader={(patch) => onUpdate({ header: patch })}
        onChangeFooter={(patch) => onUpdate({ footer: patch })}
      />

      {/* 5. Table Configuration */}
      <TableSection
        columns={template.table.columns}
        columnOrder={columnOrder}
        showBorder={template.table.showBorder}
        fontSize={template.table.fontSize}
        showApprovalSignature={template.table.showApprovalSignature}
        onToggleColumn={onToggleColumn}
        onUpdateColumnLabel={onUpdateColumnLabel}
        onUpdateColumnAlign={onUpdateColumnAlign}
        onReorderColumns={onReorderColumns}
        onChangeLayout={(patch) => onUpdate({ table: patch })}
      />
    </div>
  );
};
