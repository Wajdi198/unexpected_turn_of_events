'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
}

export default function DropZone({ onFileAccepted, isProcessing }: DropZoneProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];
    if (acceptedFile) {
      if (acceptedFile.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      setFile(acceptedFile);
      onFileAccepted(acceptedFile);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative h-64 w-full rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4",
        "bg-slate-900/50 hover:bg-slate-800/50",
        isDragActive ? "border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "border-slate-700",
        isProcessing && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      {file ? (
        <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-300">
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
            <FileText size={48} />
          </div>
          <div className="text-center">
            <p className="text-slate-200 font-medium">{file.name}</p>
            <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          {!isProcessing && (
            <button 
              onClick={removeFile}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-700 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <div className={cn(
            "p-4 rounded-full bg-slate-800 text-slate-400 transition-colors duration-300",
            isDragActive && "bg-indigo-500/20 text-indigo-400"
          )}>
            <Upload size={40} />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-200">
              Drop PDF here or click to browse
            </p>
            <p className="text-sm text-slate-500 mt-1">
              PDF up to 10MB · French or English supported
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
