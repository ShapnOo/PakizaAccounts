import { JournalPreset } from '../../types/presetJournal';
import { PresetRow } from './PresetRow';

interface PresetTableProps {
  presets: JournalPreset[];
  selectedPresetId?: string | null;
  onSelectPreset: (preset: JournalPreset) => void;
  onDuplicate: (id: string) => void;
  onDelete: (preset: JournalPreset) => void;
}

export function PresetTable({
  presets,
  selectedPresetId,
  onSelectPreset,
  onDuplicate,
  onDelete,
}: PresetTableProps) {
  return (
    <div className="rounded-2xl border border-border/90 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto sidebar-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
            <tr>
              <th className="py-3 px-4 min-w-[240px]">Profile Name & Narration</th>
              <th className="py-3 px-3 min-w-[150px] whitespace-nowrap">Voucher Type</th>
              <th className="py-3 px-3 min-w-[100px] whitespace-nowrap">Lines</th>
              <th className="py-3 px-3 min-w-[140px] whitespace-nowrap">Usage & Last Used</th>
              <th className="py-3 px-3 text-right w-28 whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {presets.map((preset) => (
              <PresetRow
                key={preset.id}
                preset={preset}
                isSelected={selectedPresetId === preset.id}
                onSelect={() => onSelectPreset(preset)}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
