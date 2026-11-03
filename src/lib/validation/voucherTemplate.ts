import { z } from 'zod';

export const customizationSchema = z.object({
  paperSize: z.enum(['A4', 'A5', 'Letter', 'Legal']),
  orientation: z.enum(['Portrait', 'Landscape']),
  pageCoverage: z.enum(['full', 'half']).optional(),
  halfPageOption: z.enum(['single', 'duplicate']).optional(),
  showCutLine: z.boolean().optional(),
  margin: z.object({
    top: z.number().min(0).max(5),
    bottom: z.number().min(0).max(5),
    left: z.number().min(0).max(5),
    right: z.number().min(0).max(5),
  }),
  fontFamily: z.string().min(1),
  fontSize: z.number().int().min(8).max(12),
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
  accentColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
  borderColor: z.string().optional(),
  borderWeight: z.number().min(0.2).max(10).optional(),
  borderOpacity: z.number().min(0).max(1).optional(),
  companyLogo: z.string().optional(),
  showCompanyHeader: z.boolean(),
  showNarration: z.boolean(),
  showValueInWords: z.boolean(),
  showSignatures: z.boolean(),
  showFooter: z.boolean(),
  showDifferenceRow: z.boolean().optional(),
  showCurrencySummary: z.boolean().optional(),
  showBalanceIndicator: z.boolean().optional(),
  showLineDescription: z.boolean().optional(),
  showAuxRow: z.boolean().optional(),
  zebraStripes: z.boolean().optional(),
  visibleColumns: z.record(z.string(), z.boolean()).optional(),
  watermarkSource: z
    .enum([
      'none',
      'groupName',
      'companyName',
      'companyShortName',
      'approvalStatus',
      'voucherName',
      'custom',
    ])
    .optional(),
  watermarkCustomText: z.string().optional(),
  watermarkText: z.string().optional(),
  watermarkPlacement: z.enum(['table', 'full']).optional(),
  watermarkOpacity: z.number().min(0).max(1).optional(),
});

export const setupSchema = z.object({
  voucherType: z.enum(['Journal', 'Payment', 'Receive', 'Contra']),
  templateId: z.enum(['standard', 'minimal', 'cleanGrid', 'framedLedger']),
  customization: customizationSchema,
});

export type CustomizationFormData = z.infer<typeof customizationSchema>;
export type TemplateSetupFormData = z.infer<typeof setupSchema>;
