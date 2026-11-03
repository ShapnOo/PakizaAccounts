import React, { useMemo } from 'react';
import type {
  TemplateId,
  TemplateCustomization,
  VoucherType,
} from '../../types/voucherTemplate';
import { MOCK_PREVIEW_DATA } from '../../mock/voucherPreviewData';
import { TemplateRenderer } from '../voucher-templates/TemplateRenderer';
import { deriveSignatureLabels } from '../../lib/voucherPreviewMath';

interface MiniPreviewProps {
  templateId: TemplateId;
  voucherType?: VoucherType;
  custom?: TemplateCustomization;
  width?: number; // default 80
  height?: number; // default 100
  className?: string;
}

export const MiniPreview: React.FC<MiniPreviewProps> = ({
  templateId,
  voucherType = 'Journal',
  custom,
  width = 80,
  height = 100,
  className = '',
}) => {
  const dummyCustom: TemplateCustomization = useMemo(() => {
    return (
      custom || {
        paperSize: 'A4',
        orientation: 'Portrait',
        margin: { top: 0.08, bottom: 0.08, left: 0.04, right: 0.04 },
        fontFamily: 'Inter',
        fontSize: 9,
        primaryColor: '#0f172a',
        accentColor: '#4f46e5',
        showCompanyHeader: true,
        showNarration: true,
        showValueInWords: true,
        showSignatures: true,
        showFooter: true,
        showCurrencySummary: templateId !== 'standard',
        showBalanceIndicator: templateId !== 'standard',
        showLineDescription: templateId !== 'standard',
        showAuxRow: templateId !== 'standard',
        showDifferenceRow: templateId === 'standard',
        zebraStripes: templateId === 'framedLedger',
      }
    );
  }, [custom, templateId]);

  const previewData = useMemo(() => {
    const labels = deriveSignatureLabels(voucherType);
    return {
      ...MOCK_PREVIEW_DATA,
      voucherType,
      signatureSlots: MOCK_PREVIEW_DATA.signatureSlots.map((s, i) => ({
        ...s,
        label: labels[i] || '',
      })),
    };
  }, [voucherType]);

  // Target A4 canvas reference: 630px x 891px
  const scale = width / 630;

  return (
    <div
      className={`relative bg-white rounded border border-slate-200 shadow-2xs overflow-hidden select-none pointer-events-none ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: '630px',
          height: '891px',
          transform: `scale(${scale})`,
        }}
      >
        <TemplateRenderer
          templateId={templateId}
          data={previewData}
          custom={dummyCustom}
        />
      </div>
    </div>
  );
};

