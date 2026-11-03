import React from 'react';
import type {
  TemplateId,
  VoucherPreviewData,
  TemplateCustomization,
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

