import React, { useRef, useState } from 'react';
import { Attachment } from '../../types/customer';
import { AttachmentCard } from './AttachmentCard';
import { fileToDataUrl } from '../../lib/fileToDataUrl';
import { UploadCloud, AlertCircle } from 'lucide-react';

interface AttachmentDropzoneProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  error?: string;
}

export const AttachmentDropzone: React.FC<AttachmentDropzoneProps> = ({
  attachments,
  onChange,
  maxFiles = 5,
  maxSizeMb = 2,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const availableSlots = maxFiles - attachments.length;
    if (availableSlots <= 0) {
      setUploadError(`Maximum of ${maxFiles} attachments reached.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newAttachments: Attachment[] = [];

    for (const file of filesToProcess) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the ${maxSizeMb} MB file size limit.`);
        continue;
      }

      try {
        const dataUrl = await fileToDataUrl(file);
        newAttachments.push({
          id: `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          dataUrl,
        });
      } catch (err) {
        setUploadError(`Failed to process "${file.name}".`);
      }
    }

    if (newAttachments.length > 0) {
      onChange([...attachments, ...newAttachments]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
    setUploadError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-foreground">
          Attachments
        </label>
        <span className="text-[10px] text-muted-foreground font-mono">
          {attachments.length} / {maxFiles} files (max {maxSizeMb} MB each)
        </span>
      </div>

      {/* Dropzone Container */}
      {attachments.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-border/80 hover:border-indigo-400 bg-muted/20 hover:bg-muted/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-1.5">
            <div className="size-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
              <UploadCloud className="size-4" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              Click to upload or drag & drop files here
            </p>
            <p className="text-[10.5px] text-muted-foreground">
              PDF, JPG, PNG, XLSX, DOCX (up to 2 MB)
            </p>
          </div>
        </div>
      )}

      {/* Error Notices */}
      {(uploadError || error) && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-500 font-medium pt-0.5">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{uploadError || error}</span>
        </div>
      )}

      {/* Render Attached Files */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {attachments.map((att) => (
            <AttachmentCard
              key={att.id}
              attachment={att}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
