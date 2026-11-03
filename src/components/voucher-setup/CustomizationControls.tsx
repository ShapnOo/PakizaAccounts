import React, { useState } from 'react';
import type {
  TemplateId,
  TemplateCustomization,
} from '../../types/voucherTemplate';
import { PaperSection } from './PaperSection';
import { TypographySection } from './TypographySection';
import { ColorsSection } from './ColorsSection';
import { CompanySection } from './CompanySection';
import { SectionsToggles } from './SectionsToggles';
import { TemplateSpecificToggles } from './TemplateSpecificToggles';
import { ColumnsVisibilitySection } from './ColumnsVisibilitySection';
import {
  FileText,
  Type,
  Palette,
  Building,
  Sliders,
  Sparkles,
  Columns3,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomizationControlsProps {
  templateId: TemplateId;
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
  onResetTemplate: () => void;
}

export const CustomizationControls: React.FC<CustomizationControlsProps> = ({
  templateId,
  customization,
  onChange,
  onResetTemplate,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    columns: true,
    paper: true,
    typography: true,
    colors: false,
    company: false,
    sections: false,
    templateSpecific: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
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
      title: 'Colors & Branding',
      icon: <Palette className="size-4 text-indigo-500" />,
      component: (
        <ColorsSection customization={customization} onChange={onChange} />
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
      <div className="pb-1">
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
          Customization Controls
        </h3>
        <p className="text-[12px] text-slate-500">
          Visual styling for the active template
        </p>
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

