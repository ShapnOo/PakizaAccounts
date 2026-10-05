import { z } from 'zod';

export const voucherTemplateSchema = z
  .object({
    voucherType: z.enum(['Journal', 'Payment', 'Receive', 'Contra']),
    paper: z.object({
      size: z.enum(['A4', 'A5', 'Letter', 'Legal', 'Custom']),
      orientation: z.enum(['Portrait', 'Landscape']),
      customWidthMm: z.number().optional(),
      customHeightMm: z.number().optional(),
    }),
    margin: z.object({
      top: z.number().min(0, 'Min margin 0').max(5, 'Max margin 5 in'),
      bottom: z.number().min(0, 'Min margin 0').max(5, 'Max margin 5 in'),
      left: z.number().min(0, 'Min margin 0').max(5, 'Max margin 5 in'),
      right: z.number().min(0, 'Min margin 0').max(5, 'Max margin 5 in'),
    }),
    font: z.object({
      family: z.string().min(1, 'Font family required'),
      theme: z.string().min(1, 'Theme required'),
      pdfFont: z.string().min(1, 'PDF font required'),
      color: z.string().min(1, 'Font color required'),
      size: z.number().min(6).max(72),
      background: z.string().optional(),
      backgroundColor: z.string().min(1, 'Background color required'),
    }),
    header: z.object({
      companyNameSize: z.number().min(8).max(72),
      addressSize: z.number().min(6).max(48),
      align: z.enum(['Left', 'Center', 'Right']),
      showLogo: z.boolean().optional(),
      logoUrl: z.string().optional(),
      logoWidth: z.number().min(20).max(300).optional(),
      logoPosition: z.enum(['left', 'center', 'right']).optional(),
    }),
    footer: z.object({
      text: z.string().optional(),
      showPrintDateTime: z.boolean(),
      showPageNumber: z.boolean(),
      name: z.string().max(80),
    }),
    table: z.object({
      columns: z.record(
        z.string(),
        z.object({
          visible: z.boolean(),
          label: z.string().min(1).max(40),
          isCustom: z.boolean().optional(),
        })
      ),
      columnOrder: z.array(z.string()).optional(),
      showBorder: z.boolean(),
      fontSize: z.number().min(6).max(24),
      showApprovalSignature: z.boolean(),
    }),
  })
  .refine(
    (data) => {
      const visibleCols = Object.values(data.table.columns).filter(
        (c: any) => c && c.visible
      );
      return visibleCols.length >= 4;
    },
    {
      message: 'At least 4 columns must remain visible on the printed voucher',
      path: ['table', 'columns'],
    }
  )
  .refine(
    (data) => data.header.companyNameSize >= data.header.addressSize,
    {
      message: 'Company Name size must be greater than or equal to Address size',
      path: ['header', 'companyNameSize'],
    }
  );

export type VoucherTemplateFormData = z.infer<typeof voucherTemplateSchema>;
