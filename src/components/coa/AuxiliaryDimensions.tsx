import React from 'react';
import { Truck, Users, User, Bookmark, Car } from 'lucide-react';
import { AuxiliaryDimensions as AuxType, AuxiliaryDimensionItem } from '../../types/coa';
import { AuxMultiSelectPicker } from './AuxMultiSelectPicker';

interface AuxiliaryDimensionsProps {
  values?: AuxType;
  onChange: (values: AuxType) => void;
  disabled?: boolean;
}

const AUX_DIMENSIONS = [
  {
    key: 'supplier' as const,
    label: 'Supplier',
    icon: Truck,
    placeholder: 'Select fixed supplier...',
    samples: ['Bismillah Motors', 'Bengal Chemicals', 'Padma Textile Supplies'],
  },
  {
    key: 'customer' as const,
    label: 'Customer',
    icon: Users,
    placeholder: 'Select fixed customer...',
    samples: ['H&M Global', 'Zara Retail', 'Apex Footwear Ltd.'],
  },
  {
    key: 'employee' as const,
    label: 'Employee',
    icon: User,
    placeholder: 'Select fixed employee...',
    samples: ['EMP-001 (Tahmid Afsar)', 'EMP-002 (Rahim Ullah)'],
  },
  {
    key: 'reference' as const,
    label: 'Reference',
    icon: Bookmark,
    placeholder: 'Select fixed reference tag...',
    samples: ['Project Green Alpha', 'Export LC-9921', 'Local Tender 2026'],
  },
  {
    key: 'vehicle' as const,
    label: 'Vehicle',
    icon: Car,
    placeholder: 'Select fixed vehicle...',
    samples: ['DM-TA-11-2099 (Covered Van)', 'DM-GA-34-1100 (Pickup)'],
  },
];

export const AuxiliaryDimensions: React.FC<AuxiliaryDimensionsProps> = ({
  values = {},
  onChange,
  disabled = false,
}) => {
  const getParsedDimension = (key: keyof AuxType): { value: string; isMandatory: boolean; isFixed: boolean } => {
    const raw = values[key];
    if (!raw) return { value: '', isMandatory: false, isFixed: false };
    if (typeof raw === 'string') {
      return { value: raw, isMandatory: false, isFixed: false };
    }
    const val = Array.isArray(raw.value) ? raw.value.join(', ') : raw.value || '';
    return {
      value: val,
      isMandatory: !!raw.isMandatory,
      isFixed: !!raw.isFixed,
    };
  };

  const updateDimension = (
    key: keyof AuxType,
    patch: Partial<{ value: string; isMandatory: boolean; isFixed: boolean }>
  ) => {
    const current = getParsedDimension(key);
    const nextIsFixed = patch.isFixed !== undefined ? patch.isFixed : current.isFixed;
    const updated: AuxiliaryDimensionItem = {
      // If fixed is being unchecked, reset the fixed dropdown value
      value: !nextIsFixed ? '' : patch.value !== undefined ? patch.value : current.value,
      isMandatory: patch.isMandatory !== undefined ? patch.isMandatory : current.isMandatory,
      isFixed: nextIsFixed,
    };

    onChange({
      ...values,
      [key]: updated,
    });
  };

  return (
    <div className="space-y-2.5">
      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between border-b border-border/50 pb-1.5">
        <span>Auxiliary Dimensions</span>
        <span className="text-[10px] font-normal lowercase italic text-muted-foreground/70">
          Set Mandatory / Fixed options per dimension
        </span>
      </div>

      <div className="space-y-2.5 pt-0.5">
        {AUX_DIMENSIONS.map((dim) => {
          const Icon = dim.icon;
          const { value: currentVal, isMandatory, isFixed } = getParsedDimension(dim.key);

          return (
            <div
              key={dim.key}
              className="bg-card/90 border border-border/70 rounded-xl p-2.5 space-y-2 shadow-2xs transition-all hover:border-border"
            >
              {/* Row Header: Icon + Label + Badges + Option Checkboxes */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-muted/60 text-muted-foreground grid place-items-center shrink-0">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{dim.label}</span>

                  {/* Active Badges */}
                  <div className="flex items-center gap-1">
                    {isMandatory && (
                      <span className="text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        Mandatory *
                      </span>
                    )}
                    {isFixed && (
                      <span className="text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                        Fixed
                      </span>
                    )}
                    {!isMandatory && !isFixed && (
                      <span className="text-[9.5px] font-medium text-muted-foreground/60 px-1">
                        Optional
                      </span>
                    )}
                  </div>
                </div>

                {/* Option Toggles: Is Mandatory & Is Fixed */}
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/85 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={isMandatory}
                      onChange={(e) => updateDimension(dim.key, { isMandatory: e.target.checked })}
                      className="size-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                    <span>Is Mandatory</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/85 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={isFixed}
                      onChange={(e) => updateDimension(dim.key, { isFixed: e.target.checked })}
                      className="size-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                    <span>Is Fixed</span>
                  </label>
                </div>
              </div>

              {/* Fixed Multi-Select Picker (Shown when Is Fixed is checked) */}
              {isFixed && (
                <div className="relative pt-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
                  <AuxMultiSelectPicker
                    label={dim.label}
                    samples={dim.samples}
                    value={currentVal}
                    disabled={disabled}
                    onChange={(val) => updateDimension(dim.key, { value: val })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuxiliaryDimensions;
