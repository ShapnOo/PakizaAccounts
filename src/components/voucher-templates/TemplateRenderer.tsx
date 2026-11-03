import React from 'react';
import type {
  TemplateId,
  VoucherPreviewData,
  TemplateCustomization,
} from '../../types/voucherTemplate';
import {
  resolveWatermarkText,
  resolveBorderColor,
} from '../../types/voucherTemplate';
import { StandardTemplate } from './StandardTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { CleanGridTemplate } from './CleanGridTemplate';
import { FramedLedgerTemplate } from './FramedLedgerTemplate';

interface TemplateRendererProps {
  templateId: TemplateId;
  data: VoucherPreviewData;
  custom: TemplateCustomization;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  data,
  custom,
}) => {
  const isHalfPage = custom.pageCoverage === 'half';

  const {
    watermarkSource,
    watermarkCustomText,
    watermarkText: directText,
    watermarkPlacement = 'full',
    watermarkOpacity = 0.12,
    accentColor = '#1e40af',
  } = custom;

  // Dynamically resolve watermark text from setup source
  const effectiveWatermark = resolveWatermarkText(
    watermarkSource,
    watermarkCustomText || directText,
    data.company?.name || 'Pakiza Software Ltd.',
    data.voucherType || 'Journal'
  );

  const isImageWatermark =
    effectiveWatermark.startsWith('http://') ||
    effectiveWatermark.startsWith('https://') ||
    effectiveWatermark.startsWith('data:') ||
    effectiveWatermark.startsWith('/');

  // Dynamically resolve border styling
  const effectiveBorderColor = resolveBorderColor(
    custom.borderColor || '#000000',
    custom.borderOpacity ?? 1.0
  );
  const borderWeight = custom.borderWeight ?? 1;

  const renderTemplate = () => {
    switch (templateId) {
      case 'standard':
        return <StandardTemplate data={data} custom={custom} />;
      case 'minimal':
        return <MinimalTemplate data={data} custom={custom} />;
      case 'cleanGrid':
        return <CleanGridTemplate data={data} custom={custom} />;
      case 'framedLedger':
        return <FramedLedgerTemplate data={data} custom={custom} />;
      default:
        return <CleanGridTemplate data={data} custom={custom} />;
    }
  };

  return (
    <div className={`relative w-full h-full voucher-tpl-scope-${templateId} box-border overflow-hidden`}>
      {/* Dynamic Scoped Border Styling */}
      <style>{`
        .voucher-tpl-scope-${templateId} .template-outer-frame,
        .voucher-tpl-scope-${templateId} > div > .template-outer-frame,
        .voucher-tpl-scope-${templateId} > .template-outer-frame {
          border-color: ${effectiveBorderColor} !important;
          border-width: ${borderWeight}px !important;
        }
        .voucher-tpl-scope-${templateId} table,
        .voucher-tpl-scope-${templateId} th,
        .voucher-tpl-scope-${templateId} td,
        .voucher-tpl-scope-${templateId} .border-black,
        .voucher-tpl-scope-${templateId} .border-slate-300,
        .voucher-tpl-scope-${templateId} .border-slate-400 {
          border-color: ${effectiveBorderColor} !important;
        }
      `}</style>

      {/* Background Watermark Layer */}
      {effectiveWatermark && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10 ${
            watermarkPlacement === 'table' ? 'top-16 bottom-24' : ''
          }`}
        >
          {isImageWatermark ? (
            <img
              src={effectiveWatermark}
              alt="Watermark"
              className="max-w-[70%] max-h-[70%] object-contain select-none"
              style={{ opacity: watermarkOpacity }}
            />
          ) : (
            <div
              className={`transform -rotate-25 select-none font-black uppercase tracking-widest text-center px-4 ${
                isHalfPage
                  ? 'text-3xl sm:text-4xl md:text-5xl'
                  : 'text-5xl sm:text-6xl md:text-7xl'
              }`}
              style={{
                color: accentColor || '#1e40af',
                opacity: watermarkOpacity,
              }}
            >
              {effectiveWatermark}
            </div>
          )}
        </div>
      )}

      {renderTemplate()}
    </div>
  );
};
