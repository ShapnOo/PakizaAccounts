import React from 'react';
import { Attachment } from '../../types/customer';
import { Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';

interface AttachmentCardProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
}

export const AttachmentCard: React.FC<AttachmentCardProps> = ({
  attachment,
  onRemove,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = attachment.mimeType.startsWith('image/');

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-card shadow-2xs group hover:border-indigo-200 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          {isImage ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate max-w-[200px]" title={attachment.name}>
            {attachment.name}
          </p>
          <span className="text-[10px] text-muted-foreground font-mono">
            {formatSize(attachment.size)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(attachment.id)}
        className="p-1 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        title="Remove attachment"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
};
