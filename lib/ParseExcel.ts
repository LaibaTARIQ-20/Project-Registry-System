import * as XLSX from "xlsx";
import { RawExcelRow, ParsedProject, ParseResult } from "@/types";
import { validateAllRows } from "@/lib/validate";

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // ─────────────────────────────────────────
        // Step 1 — Read the raw binary data
        // ─────────────────────────────────────────
        const binaryData = e.target?.result;

        if (!binaryData) {
          reject(new Error("File could not be read"));
          return;
        }

        // ─────────────────────────────────────────
        // Step 2 — Parse with SheetJS
        // ─────────────────────────────────────────
        const workbook = XLSX.read(binaryData, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];

        // Convert sheet to array of objects
        // header: 1 is NOT used — we want objects with column names as keys
        const rawRows = XLSX.utils.sheet_to_json<RawExcelRow>(sheet);

        if (rawRows.length === 0) {
          reject(new Error("Excel file is empty or has no data rows"));
          return;
        }

        // ─────────────────────────────────────────
        // Step 3 — Validate all rows
        // ─────────────────────────────────────────
        const { validRows, invalidRows } = validateAllRows(rawRows);

        // ─────────────────────────────────────────
        // Step 4 — Preprocess valid rows
        // ─────────────────────────────────────────
const validProjects: ParsedProject[] = validRows.map((row) => {
  // Collect students from 4 separate columns
  const students = [
    row["Student 1"],
    row["Student 2"],
    row["Student 3"],
    row["Student 4"],
  ]
    .filter((s): s is string => !!s && s.trim() !== "")
    .map((s) => s.trim());

  const coSupervisor =
    row["Co-Supervisor Name"] && row["Co-Supervisor Name"].trim() !== ""
      ? row["Co-Supervisor Name"].trim()
      : null;

  return {
    title: row["Project Title"]!.trim(),
    students,
    studentCount: students.length,
    supervisor: row["Supervisor Name"]!.trim(),
    coSupervisor,
    industrialPartner: row["Industrial Partner"]!.trim(),
    sdg: row["SDG"]!.trim(),
  };
});

        // ─────────────────────────────────────────
        // Step 5 — Return result
        // ─────────────────────────────────────────
        resolve({
          valid: validProjects,
          invalid: invalidRows,
        });

      } catch (error) {
        reject(new Error("Failed to parse Excel file: " + error));
      }
    };

    reader.onerror = () => {
      reject(new Error("FileReader encountered an error"));
    };

    // Trigger the read
    reader.readAsBinaryString(file);
  });
}
