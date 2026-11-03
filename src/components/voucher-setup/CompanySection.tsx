import React, { useRef } from 'react';
import type { TemplateCustomization } from '../../types/voucherTemplate';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CompanySectionProps {
  customization: TemplateCustomization;
  onChange: (patch: Partial<TemplateCustomization>) => void;
}

export const CompanySection: React.FC<CompanySectionProps> = ({
  customization,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3.5 font-sans text-[13px]">
      {/* Show Company Header Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-[13px] font-medium text-slate-800">
            Show Company Header
          </span>
          <span className="block text-[11.5px] text-slate-400">
            Display company name and addresses
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={customization.showCompanyHeader}
            onChange={(e) => onChange({ showCompanyHeader: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
        </label>
      </div>

      {/* Company Logo Upload */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <label className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider block">
          Company Logo
        </label>

        {customization.companyLogo ? (
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <img
                src={customization.companyLogo}
                alt="Logo"
                className="h-8 max-w-[80px] object-contain rounded border border-slate-200 bg-white"
              />
              <span className="text-[11.5px] text-slate-600 truncate max-w-[140px]">
                Logo uploaded
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ companyLogo: undefined })}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white cursor-pointer transition-colors"
              title="Remove Logo"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-lg p-3 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-1 text-slate-500">
              <Upload className="size-4 text-slate-400" />
              <span className="text-[12px] font-medium text-indigo-600">
                Click to upload logo
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, or SVG</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

