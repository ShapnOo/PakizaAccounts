import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  Paperclip,
  Download,
} from 'lucide-react';
import { VoucherEntry, Attachment } from '../../types/journalEntry';

interface AttachmentDrawerProps {
  voucher: VoucherEntry | null;
  onClose: () => void;
  onUpload: (entryId: string, attachment: Attachment) => Promise<void>;
  onDelete: (entryId: string, attachmentId: string) => Promise<void>;
}

export const AttachmentDrawer: React.FC<AttachmentDrawerProps> = ({
  voucher,
  onClose,
  onUpload,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!voucher) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 2MB limit.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = (reader.result as string) || '';
        const attachment: Attachment = {
          id: `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        };
        await onUpload(voucher.id, attachment);
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Paperclip className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Attachments</h3>
              <p className="text-xs font-mono font-semibold text-muted-foreground">
                {voucher.voucherNo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-5 text-center bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer space-y-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Click to upload files</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                PDF, JPG, PNG, Excel (Max 5 files, 2MB each)
              </p>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Attached Documents</span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {voucher.attachments?.length || 0} file(s)
              </span>
            </div>

            {!voucher.attachments || voucher.attachments.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground border border-border/60 rounded-xl bg-muted/10">
                No attachments uploaded for this voucher.
              </div>
            ) : (
              voucher.attachments.map((file) => (
                <div
                  key={file.id}
                  className="p-3 rounded-xl border border-border bg-card shadow-2xs flex items-center justify-between gap-3 group hover:border-border/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatSize(file.size)} •{' '}
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {file.dataUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(file)}
                        title="Preview"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDelete(voucher.id, file.id)}
                      title="Remove"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Preview Modal for Images or simple viewer */}
      {previewAttachment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-border">
            <div className="p-3.5 border-b border-border flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground truncate">
                {previewAttachment.name}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center">
              {previewAttachment.type.startsWith('image/') ? (
                <img
                  src={previewAttachment.dataUrl}
                  alt={previewAttachment.name}
                  className="max-h-[65vh] object-contain rounded-lg"
                />
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground space-y-3">
                  <FileText className="size-12 mx-auto text-primary" />
                  <p>Document preview for {previewAttachment.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
