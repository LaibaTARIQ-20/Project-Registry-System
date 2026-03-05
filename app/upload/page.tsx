"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ParsedProject, InvalidRow } from "@/types";
import { parseExcelFile } from "@/lib/ParseExcel";
import { uploadProjects } from "@/lib/uploadToFirebase";
import UploadZone from "@/components/UploadZone";
import PreviewTable from "@/components/PreviewTable";
import ValidationErrors from "@/components/ValidationErrors";
import { Upload, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────
// All possible states the upload page can be in
// ─────────────────────────────────────────────
type UploadStatus =
  | "idle"       // nothing selected yet
  | "parsing"    // reading and parsing the Excel file
  | "preview"    // parsed successfully, showing preview
  | "uploading"  // writing to Firestore
  | "done";      // upload complete

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [validProjects, setValidProjects] = useState<ParsedProject[]>([]);
  const [invalidRows, setInvalidRows] = useState<InvalidRow[]>([]);

  // ─────────────────────────────────────────────
  // Step 1 — File selected from UploadZone
  // ─────────────────────────────────────────────
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("parsing");
    setValidProjects([]);
    setInvalidRows([]);

    try {
      const result = await parseExcelFile(selectedFile);
      setValidProjects(result.valid);
      setInvalidRows(result.invalid);
      setStatus("preview");

      if (result.valid.length === 0) {
        toast.error("No valid projects found in this file.");
      } else {
        toast.success(
          `${result.valid.length} valid project${result.valid.length !== 1 ? "s" : ""} found`
        );
      }
    } catch (error) {
      toast.error("Failed to parse file. Make sure it is a valid Excel file.");
      setStatus("idle");
      setFile(null);
    }
  };

  // ─────────────────────────────────────────────
  // Step 2 — User clears the file
  // ─────────────────────────────────────────────
  const handleFileClear = () => {
    setFile(null);
    setStatus("idle");
    setValidProjects([]);
    setInvalidRows([]);
  };

  // ─────────────────────────────────────────────
  // Step 3 — User confirms upload to Firestore
  // ─────────────────────────────────────────────
  const handleConfirmUpload = async () => {
    if (validProjects.length === 0) return;

    setStatus("uploading");

    try {
      const result = await uploadProjects(validProjects);
      setStatus("done");

      if (result.successCount > 0) {
        toast.success(
          `${result.successCount} project${result.successCount !== 1 ? "s" : ""} saved successfully`
        );
      }

      if (result.skippedCount > 0) {
        toast.error(
          `${result.skippedCount} project${result.skippedCount !== 1 ? "s" : ""} skipped — already exist in database`
        );
      }
    } catch (error) {
      toast.error("Upload failed. Please check your connection and try again.");
      setStatus("preview");
    }
  };

  // ─────────────────────────────────────────────
  // Step 4 — Reset everything for a new upload
  // ─────────────────────────────────────────────
  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setValidProjects([]);
    setInvalidRows([]);
  };

  // ─────────────────────────────────────────────
  // Derived UI helpers
  // ─────────────────────────────────────────────
  const isParsing = status === "parsing";
  const isUploading = status === "uploading";
  const isDisabled = isParsing || isUploading;
  const showPreview = status === "preview" || status === "uploading" || status === "done";
  const isDone = status === "done";

  return (
    <div className="mx-auto max-w-5xl">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload your Excel file to parse, validate and save project data to the database.
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Upload Zone */}
        <UploadZone
          file={file}
          onFileSelect={handleFileSelect}
          onFileClear={handleFileClear}
          disabled={isDisabled}
        />

        {/* Parsing indicator */}
        {isParsing && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-blue-700">
              Parsing Excel file...
            </span>
          </div>
        )}

        {/* Validation Errors */}
        {showPreview && (
          <ValidationErrors invalidRows={invalidRows} />
        )}

        {/* Preview Table */}
        {showPreview && (
          <PreviewTable projects={validProjects} />
        )}

        {/* Action Buttons */}
        {status === "preview" && validProjects.length > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">
            <p className="text-sm text-gray-600">
              Ready to save{" "}
              <span className="font-semibold text-gray-900">
                {validProjects.length} project{validProjects.length !== 1 ? "s" : ""}
              </span>{" "}
              to the database
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFileClear}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Upload size={15} />
                Confirm Upload
              </button>
            </div>
          </div>
        )}

        {/* Uploading indicator */}
        {isUploading && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm font-medium text-blue-700">
              Saving to database...
            </span>
          </div>
        )}

        {/* Done state */}
        {isDone && (
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4">
            <p className="text-sm font-medium text-green-800">
              Upload complete — projects have been saved to the database
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
            >
              <RotateCcw size={14} />
              Upload Another
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
