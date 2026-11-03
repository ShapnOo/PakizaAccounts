import React, { useState } from 'react';
import type {
  TemplateId,
  TemplateCustomization,
} from '../../types/voucherTemplate';
import { TEMPLATE_INFO } from '../../types/voucherTemplate';
import { PaperSection } from './PaperSection';
import { TypographySection } from './TypographySection';
import { ColorsSection } from './ColorsSection';
import { CompanySection } from './CompanySection';
import { SectionsToggles } from './SectionsToggles';
import { TemplateSpecificToggles } from './TemplateSpecificToggles';
import { ColumnsVisibilitySection } from './ColumnsVisibilitySection';
import { WatermarkSection } from './WatermarkSection';
import {
  FileText,
  Type,
  Palette,
  Building,
  Sliders,
  Sparkles,
  Columns3,
  Stamp,
  ChevronDown,
  RotateCcw,
  LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES: TemplateId[] = [
  'standard',
  'minimal',
  'cleanGrid',
  'framedLedger',
];

interface CustomizationControlsProps {
  templateId: TemplateId;
  customization: TemplateCustomization;
  onSelectTemplate: (tid: TemplateId) => void;
  onChange: (patch: Partial<TemplateCustomization>) => void;
  onResetTemplate: () => void;
}

export const CustomizationControls: React.FC<CustomizationControlsProps> = ({
  templateId,
  customization,
  onSelectTemplate,
  onChange,
  onResetTemplate,
}) => {
  const [isTemplateSectionOpen, setIsTemplateSectionOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    columns: true,
    paper: true,
    typography: false,
    colors: false,
    watermark: false,
    company: false,
    sections: false,
    templateSpecific: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAnySectionOpen = Object.values(openSections).some(Boolean);

  const handleToggleAllSections = () => {
    const nextState = !isAnySectionOpen;
    const updated: Record<string, boolean> = {};
    sections.forEach((sec) => {
      updated[sec.key] = nextState;
    });
    setOpenSections(updated);
  };

  const sections = [
    {
      key: 'columns',
      title: 'Columns & Fields Visibility',
      icon: <Columns3 className="size-4 text-indigo-500" />,
      component: (
        <ColumnsVisibilitySection
          templateId={templateId}
          customization={customization}
          onChange={onChange}
        />
      ),
    },
    {
      key: 'paper',
      title: 'Paper & Margins',
      icon: <FileText className="size-4 text-indigo-500" />,
      component: (
        <PaperSection customization={customization} onChange={onChange} />
      ),
    },
    {
      key: 'typography',
      title: 'Typography',
      icon: <Type className="size-4 text-indigo-500" />,
      component: (
        <TypographySection customization={customization} onChange={onChange} />
      ),
    },
    {
      key: 'colors',
      title: 'Colors & Borders',
      icon: <Palette className="size-4 text-indigo-500" />,
      component: (
        <ColorsSection customization={customization} onChange={onChange} />
      ),
    },
    {
      key: 'watermark',
      title: 'Background Watermark',
      icon: <Stamp className="size-4 text-indigo-500" />,
      component: (
        <WatermarkSection customization={customization} onChange={onChange} />
      ),
    },
    {
      key: 'company',
      title: 'Company Header & Logo',
      icon: <Building className="size-4 text-indigo-500" />,
      component: (
        <CompanySection customization={customization} onChange={onChange} />
      ),
    },
    {
      key: 'sections',
      title: 'Common Sections',
      icon: <Sliders className="size-4 text-indigo-500" />,
      component: (
        <SectionsToggles customization={customization} onChange={onChange} />
      ),
    },
    {
      key: 'templateSpecific',
      title: 'Template Features',
      icon: <Sparkles className="size-4 text-indigo-500" />,
      component: (
        <TemplateSpecificToggles
          templateId={templateId}
          customization={customization}
          onChange={onChange}
        />
      ),
    },
  ];

  return (
    <div className="space-y-3 font-sans">
      {/* ── Compact Template Selector (Collapsible with Chevron) ── */}
      <div className="space-y-1.5 pb-2.5 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setIsTemplateSectionOpen((prev) => !prev)}
          className="w-full flex items-center justify-between cursor-pointer select-none group text-left"
        >
          <div className="flex items-center gap-1.5">
            <LayoutGrid className="size-3.5 text-indigo-600" />
            <span className="text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Print Template
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {TEMPLATE_INFO[templateId]?.label || templateId}
            </span>
            <ChevronDown
              className={`size-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${
                isTemplateSectionOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isTemplateSectionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden pt-1"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {TEMPLATES.map((tid) => {
                  const isSelected = templateId === tid;
                  const info = TEMPLATE_INFO[tid];
                  return (
                    <button
                      key={tid}
                      type="button"
                      onClick={() => onSelectTemplate(tid)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold shadow-2xs ring-1 ring-indigo-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium'
                      }`}
                    >
                      {isSelected && (
                        <span className="size-1.5 rounded-full bg-indigo-600 shrink-0" />
                      )}
                      <span className="text-[12px] truncate">{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pb-0.5">
        <div>
          <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">
            Customization Controls
          </h3>
          <p className="text-[11.5px] text-slate-500">
            Visual styling for the active template
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleAllSections}
          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
        >
          {isAnySectionOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((sec) => {
          const isOpen = Boolean(openSections[sec.key]);
          return (
            <div
              key={sec.key}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleSection(sec.key)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  {sec.icon}
                  <span className="text-[13px] font-semibold text-slate-800">
                    {sec.title}
                  </span>
                </div>
                <ChevronDown
                  className={`size-4 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3.5 border-t border-slate-100 bg-white">
                      {sec.component}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onResetTemplate}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[12.5px] font-medium shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCcw className="size-3.5 text-slate-400" />
          <span>Reset This Template to Defaults</span>
        </button>
      </div>
    </div>
  );
};

