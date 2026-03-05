/* eslint-disable @typescript-eslint/no-unused-vars */
import { RawExcelRow, InvalidRow } from "@/types";

export function validateRow(row: RawExcelRow, rowNumber: number): string | null {
  if (!row["Project Title"] || row["Project Title"].trim() === "") {
    return "Project title is missing";
  }

  if (!row["Supervisor Name"] || row["Supervisor Name"].trim() === "") {
    return "Supervisor name is missing";
  }

  // Collect students from 4 separate columns
  const students = [
    row["Student 1"],
    row["Student 2"],
    row["Student 3"],
    row["Student 4"],
  ].filter((s): s is string => !!s && s.trim() !== "");

  if (students.length < 2) {
    return `Too few students — found ${students.length}, minimum is 2`;
  }

  if (students.length > 4) {
    return `Too many students — found ${students.length}, maximum is 4`;
  }

  if (!row["SDG"] || row["SDG"].trim() === "") {
    return "SDG is missing";
  }

  if (!row["Industrial Partner"] || row["Industrial Partner"].trim() === "") {
    return "Industrial partner is missing";
  }

  return null;
}

export function validateAllRows(rows: RawExcelRow[]): {
  validRows: RawExcelRow[];
  invalidRows: InvalidRow[];
} {
  const validRows: RawExcelRow[] = [];
  const invalidRows: InvalidRow[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const reason = validateRow(row, rowNumber);

    if (reason === null) {
      validRows.push(row);
    } else {
      invalidRows.push({ rowNumber, rawData: row, reason });
    }
  });

  return { validRows, invalidRows };
}