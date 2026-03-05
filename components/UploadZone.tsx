"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSpreadsheet, X } from "lucide-react";

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  disabled?: boolean;
}

export default function UploadZone({
  file,
  onFileSelect,
  onFileClear,
  disabled = false,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled,
  });

  // ─────────────────────────────────────────────
  // If a file is already selected — show file info
  // ─────────────────────────────────────────────
  if (file) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <FileSpreadsheet size={24} className="text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">{file.name}</p>
            <p className="text-xs text-green-600">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <button
          onClick={onFileClear}
          disabled={disabled}
          className="rounded-full p-1 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // No file selected — show drop zone
  // ─────────────────────────────────────────────
  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-200
        ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />
      <UploadCloud
        size={40}
        className={`mb-3 ${isDragActive ? "text-blue-500" : "text-gray-400"}`}
      />
      {isDragActive ? (
        <p className="text-sm font-medium text-blue-600">
          Drop your Excel file here...
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-700">
            Drag & drop your Excel file here
          </p>
          <p className="mt-1 text-xs text-gray-400">
            or click to browse — .xlsx and .xls supported
          </p>
        </>
      )}
    </div>
  );
}
