"use client";

import { InvalidRow } from "@/types";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ValidationErrorsProps {
  invalidRows: InvalidRow[];
}

export default function ValidationErrors({
  invalidRows,
}: ValidationErrorsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (invalidRows.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-yellow-200 bg-yellow-50">

      {/* Header — always visible, clickable to expand */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            {invalidRows.length} row{invalidRows.length !== 1 ? "s" : ""} skipped due to errors
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-yellow-600" />
        ) : (
          <ChevronDown size={16} className="text-yellow-600" />
        )}
      </button>

      {/* Expandable error list */}
      {isExpanded && (
        <div className="border-t border-yellow-200 px-5 pb-4 pt-3">
          <p className="mb-3 text-xs text-yellow-700">
            These rows were not saved. Fix them in your Excel file and re-upload.
          </p>

          <div className="flex flex-col gap-2">
            {invalidRows.map((row, index) => (
              <div
                key={index}
                className="rounded-lg border border-yellow-200 bg-white px-4 py-3"
              >
                {/* Row number + reason */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-yellow-700">
                      Row {row.rowNumber}
                    </span>

                    {/* Project title if it exists */}
                    {row.rawData["Project Title"] && (
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {row.rawData["Project Title"]}
                      </p>
                    )}

                    {/* No title fallback */}
                    {!row.rawData["Project Title"] && (
                      <p className="mt-0.5 text-sm italic text-gray-400">
                        No title found
                      </p>
                    )}
                  </div>

                  {/* Reason badge */}
                  <span className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                    {row.reason}
                  </span>
                </div>

                {/* Raw student field if present */}
                {row.rawData["Student Names (2–4 Students)"] && (
                  <p className="mt-2 text-xs text-gray-500">
                    Students field:{" "}
                    <span className="font-medium text-gray-700">
                      {row.rawData["Student Names (2–4 Students)"]}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}