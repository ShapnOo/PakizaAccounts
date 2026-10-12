import React, { useEffect, useRef } from 'react';
import { Align, VoucherTemplate } from '../../types/voucherTemplate';
import { PaperSection } from './PaperSection';
import { MarginSection } from './MarginSection';
import { FontSection } from './FontSection';
import { HeaderFooterSection } from './HeaderFooterSection';
import { TableSection } from './TableSection';
import { useCustomFields } from '../../hooks/useCustomFields';
import { FileText, Ruler, Type, LayoutTemplate, Table2 } from 'lucide-react';

interface TemplatePropertiesPanelProps {
  template: VoucherTemplate;
  onUpdate: (patch: any) => void;
  onToggleColumn: (colKey: string) => void;
  onUpdateColumnLabel: (colKey: string, label: string) => void;
  onUpdateColumnAlign?: (colKey: string, align: Align) => void;
  onUpdateColumnWidth?: (colKey: string, width: number) => void;
  onReorderColumns: (newOrder: string[]) => void;
}

export const TemplatePropertiesPanel: React.FC<TemplatePropertiesPanelProps> = ({
  template,
  onUpdate,
  onToggleColumn,
  onUpdateColumnLabel,
  onUpdateColumnAlign,
  onUpdateColumnWidth,
  onReorderColumns,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Read active custom detail fields for line items
  const { fields: customFields } = useCustomFields('voucher-details');

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

  const visibleCount = columnOrder.filter((k) => template.table.columns[k]?.visible).length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-3.5 space-y-3.5 sidebar-scroll"
    >
      {/* ── Top Dynamic Quick Jump Strip & Live Summary ── */}
      <div className="bg-card/90 backdrop-blur-xs p-2 rounded-xl border border-border/80 shadow-2xs space-y-2 sticky -top-3.5 z-20">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>Template Settings</span>
          </span>
          <span className="font-mono text-muted-foreground text-[10px]">
            {template.paper.size} • Margins L/R: {template.margin.left}" • {visibleCount} Cols
          </span>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sidebar-scroll">
          <button
            type="button"
            onClick={() => scrollToSection('sec-paper')}
            className="px-2 py-1 rounded-md text-[10.5px] font-bold bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0 transition-colors cursor-pointer border border-border/40"
          >
            <FileText className="size-3 text-blue-500" />
            <span>Paper</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('sec-margin')}
            className="px-2 py-1 rounded-md text-[10.5px] font-bold bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 shrink-0 transition-colors cursor-pointer border border-indigo-200/80 dark:border-indigo-800"
          >
            <Ruler className="size-3 text-indigo-600" />
            <span>Margins</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('sec-font')}
            className="px-2 py-1 rounded-md text-[10.5px] font-bold bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0 transition-colors cursor-pointer border border-border/40"
          >
            <Type className="size-3 text-purple-500" />
            <span>Font</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('sec-header')}
            className="px-2 py-1 rounded-md text-[10.5px] font-bold bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0 transition-colors cursor-pointer border border-border/40"
          >
            <LayoutTemplate className="size-3 text-amber-500" />
            <span>Header</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('sec-table')}
            className="px-2 py-1 rounded-md text-[10.5px] font-bold bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1 shrink-0 transition-colors cursor-pointer border border-emerald-200/80 dark:border-emerald-800"
          >
            <Table2 className="size-3 text-emerald-600" />
            <span>Table ({visibleCount})</span>
          </button>
        </div>
      </div>

      {/* 1. Paper Setup */}
      <div id="sec-paper">
        <PaperSection
          paperSize={template.paper.size}
          orientation={template.paper.orientation}
          customWidthMm={template.paper.customWidthMm}
          customHeightMm={template.paper.customHeightMm}
          onChange={(patch) => onUpdate({ paper: patch })}
        />
      </div>

      {/* 2. Margin (Inches) */}
      <div id="sec-margin">
        <MarginSection
          top={template.margin.top}
          bottom={template.margin.bottom}
          left={template.margin.left}
          right={template.margin.right}
          onChange={(patch) => onUpdate({ margin: patch })}
        />
      </div>

      {/* 3. Typography & Font */}
      <div id="sec-font">
        <FontSection
          family={template.font.family}
          theme={template.font.theme}
          pdfFont={template.font.pdfFont}
          color={template.font.color}
          size={template.font.size}
          background={template.font.background}
          backgroundColor={template.font.backgroundColor}
          watermarkPlacement={template.font.watermarkPlacement}
          watermarkOpacity={template.font.watermarkOpacity}
          onChange={(patch) => onUpdate({ font: patch })}
        />
      </div>

      {/* 4. Header & Footer */}
      <div id="sec-header">
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
      </div>

      {/* 5. Table Configuration */}
      <div id="sec-table">
        <TableSection
          columns={template.table.columns}
          columnOrder={columnOrder}
          showBorder={template.table.showBorder}
          fontSize={template.table.fontSize}
          showApprovalSignature={template.table.showApprovalSignature}
          onToggleColumn={onToggleColumn}
          onUpdateColumnLabel={onUpdateColumnLabel}
          onUpdateColumnAlign={onUpdateColumnAlign}
          onUpdateColumnWidth={onUpdateColumnWidth}
          onReorderColumns={onReorderColumns}
          onChangeLayout={(patch) => onUpdate({ table: patch })}
        />
      </div>
    </div>
  );
};
