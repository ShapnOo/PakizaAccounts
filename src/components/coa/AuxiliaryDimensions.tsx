import React from 'react';
import { Truck, Users, User, Bookmark, Car } from 'lucide-react';
import { AuxiliaryDimensions as AuxType } from '../../types/coa';

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
    placeholder: 'e.g. Bismillah Motors',
    samples: ['Bismillah Motors', 'Bengal Chemicals', 'Padma Textile Supplies'],
  },
  {
    key: 'customer' as const,
    label: 'Customer',
    icon: Users,
    placeholder: 'Select or enter customer...',
    samples: ['H&M Global', 'Zara Retail', 'Apex Footwear Ltd.'],
  },
  {
    key: 'employee' as const,
    label: 'Employee',
    icon: User,
    placeholder: 'Select employee...',
    samples: ['EMP-001 (Tahmid Afsar)', 'EMP-002 (Rahim Ullah)'],
  },
  {
    key: 'reference' as const,
    label: 'Reference',
    icon: Bookmark,
    placeholder: 'Select reference tag...',
    samples: ['Project Green Alpha', 'Export LC-9921', 'Local Tender 2026'],
  },
  {
    key: 'vehicle' as const,
    label: 'Vehicle',
    icon: Car,
    placeholder: 'Select vehicle...',
    samples: ['DM-TA-11-2099 (Covered Van)', 'DM-GA-34-1100 (Pickup)'],
  },
];

export const AuxiliaryDimensions: React.FC<AuxiliaryDimensionsProps> = ({
  values = {},
  onChange,
  disabled = false,
}) => {
  const updateDimension = (key: keyof AuxType, val: string) => {
    onChange({
      ...values,
      [key]: val,
    });
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between border-b border-border/50 pb-1.5">
        <span>Auxiliary Dimensions</span>
        <span className="text-[10px] font-normal lowercase italic text-muted-foreground/70">
          5 fixed dimension slots
        </span>
      </div>

      <div className="space-y-2 pt-0.5">
        {AUX_DIMENSIONS.map((dim) => {
          const Icon = dim.icon;
          const currentVal = values[dim.key] || '';

          return (
            <div
              key={dim.key}
              className="flex items-center gap-2 text-xs bg-muted/15 p-1.5 rounded-lg border border-border/40 hover:border-border/80 transition-colors"
            >
              {/* Fixed indicator badge */}
              <div className="w-20 shrink-0 flex items-center gap-1.5">
                <span className="text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground/80 border border-border/50">
                  Fixed
                </span>
                <span className="font-semibold text-foreground/85 truncate" title={dim.label}>
                  {dim.label}
                </span>
              </div>

              {/* Arrow */}
              <span className="text-muted-foreground/40 text-[11px] font-bold">→</span>

              {/* Control input / lookup */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  list={`aux-list-${dim.key}`}
                  disabled={disabled}
                  placeholder={dim.placeholder}
                  value={currentVal}
                  onChange={(e) => updateDimension(dim.key, e.target.value)}
                  className={`w-full h-8 px-2.5 rounded-md bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs transition-all ${
                    disabled ? 'bg-muted/40 text-muted-foreground cursor-not-allowed' : ''
                  }`}
                />
                <datalist id={`aux-list-${dim.key}`}>
                  {dim.samples.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
