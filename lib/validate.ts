/* eslint-disable @typescript-eslint/no-unused-vars */
import { RawExcelRow, InvalidRow } from "@/types";

export function validateRow(row: RawExcelRow, rowNumber: number): string | null {
  // Rule 1 — Project title must exist
  if (!row["Project Title"] || row["Project Title"].trim() === "") {
    return "Project title is missing";
  }

  // Rule 2 — Supervisor must exist
  if (!row["Supervisor Name"] || row["Supervisor Name"].trim() === "") {
    return "Supervisor name is missing";
  }

  // Rule 3 — Students field must exist
  if (!row["Student Names (2–4 Students)"] || row["Student Names (2–4 Students)"].trim() === "") {
    return "Student names are missing";
  }

  // Rule 4 — Split and count students
  const students = row["Student Names (2–4 Students)"]
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  if (students.length < 2) {
    return `Too few students — found ${students.length}, minimum is 2`;
  }

  if (students.length > 4) {
    return `Too many students — found ${students.length}, maximum is 4`;
  }

  // Rule 5 — SDG must exist
  if (!row["SDG"] || row["SDG"].trim() === "") {
    return "SDG is missing";
  }

  // Rule 6 — Industrial partner must exist
  if (!row["Industrial Partner"] || row["Industrial Partner"].trim() === "") {
    return "Industrial partner is missing";
  }

  // All rules passed
  return null;
}


export function validateAllRows(rows: RawExcelRow[]): {
  validRows: RawExcelRow[];
  invalidRows: InvalidRow[];
} {
  const validRows: RawExcelRow[] = [];
  const invalidRows: InvalidRow[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because row 1 is the header in Excel
    const reason = validateRow(row, rowNumber);

    if (reason === null) {
      validRows.push(row);
    } else {
      invalidRows.push({
        rowNumber,
        rawData: row,
        reason,
      });
    }
  });

  return { validRows, invalidRows };
}