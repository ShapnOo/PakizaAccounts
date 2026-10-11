import React, { useRef } from 'react';
import { Paperclip, UploadCloud, FileText, Trash2, Eye, Download } from 'lucide-react';
import { Attachment } from '../../types/journalEntry';
import { toast } from 'sonner';

interface AttachmentUploadSectionProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}

export const AttachmentUploadSection: React.FC<AttachmentUploadSectionProps> = ({
  attachments,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit

    Array.from(files).forEach((file) => {
      if (file.size > maxSizeBytes) {
        toast.error(`File "${file.name}" exceeds the 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = (reader.result as string) || '';
        const item: Attachment = {
          id: `att-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          dataUrl,
          uploadedAt: new Date().toISOString(),
        };
        newAttachments.push(item);
        if (newAttachments.length === files.length) {
          onChange([...attachments, ...newAttachments]);
          toast.success(`${newAttachments.length} file(s) attached successfully`);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="pt-3 border-t border-border/60 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground flex items-center gap-2">
          <Paperclip className="size-4 text-primary" />
          <span>Attachments</span>
        </label>
        <span className="text-[11px] font-semibold text-muted-foreground">
          {attachments.length} attached
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop / Click Trigger Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-4 text-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 group"
      >
        <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
          <UploadCloud className="size-5" />
        </div>
        <p className="text-xs font-bold text-foreground">
          Click or drop files here to attach supporting documents
        </p>
        <p className="text-[10.5px] text-muted-foreground">
          Supports invoices, receipts, vouchers, PDFs, spreadsheets, and images (Max 10MB per file)
        </p>
      </div>

      {/* Attached Files List */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="p-2.5 rounded-xl border border-border/70 bg-background flex items-center justify-between gap-2 shadow-2xs group hover:border-border transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {file.dataUrl && (
                  <a
                    href={file.dataUrl}
                    download={file.name}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Download attachment"
                  >
                    <Download className="size-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove attachment"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
