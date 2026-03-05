import { Timestamp } from "firebase/firestore";

// ─────────────────────────────────────────────
// 1. What SheetJS gives us raw from the Excel file
// ─────────────────────────────────────────────
export interface RawExcelRow {
  "Project Title"?: string;
  "Student Names (2–4 Students)"?: string;
  "Supervisor Name"?: string;
  "Co-Supervisor Name"?: string;
  "Industrial Partner"?: string;
  SDG?: string;
}

// ─────────────────────────────────────────────
// 2. After our preprocessing — clean and structured
// ─────────────────────────────────────────────
export interface ParsedProject {
  title: string;
  students: string[];
  studentCount: number;
  supervisor: string;
  coSupervisor: string | null;
  industrialPartner: string;
  sdg: string;
}

// ─────────────────────────────────────────────
// 3. A row that failed validation
// ─────────────────────────────────────────────
export interface InvalidRow {
  rowNumber: number;
  rawData: RawExcelRow;
  reason: string;
}

// ─────────────────────────────────────────────
// 4. What parseExcel.ts returns
// ─────────────────────────────────────────────
export interface ParseResult {
  valid: ParsedProject[];
  invalid: InvalidRow[];
}

// ─────────────────────────────────────────────
// 5. A project saved in Firestore — has extra fields
// ─────────────────────────────────────────────
export interface FirestoreProject extends ParsedProject {
  id: string;
  uploadedAt: Timestamp;
}