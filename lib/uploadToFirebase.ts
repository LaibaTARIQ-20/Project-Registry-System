import {
  collection,
  writeBatch,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ParsedProject } from "@/types";

// ─────────────────────────────────────────────
// Result type for the upload operation
// ─────────────────────────────────────────────
export interface UploadResult {
  successCount: number;
  skippedCount: number;
  skippedTitles: string[];
}

// ─────────────────────────────────────────────
// Check which titles already exist in Firestore
// ─────────────────────────────────────────────
async function getExistingTitles(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map((doc) => doc.data().title as string);
}

// ─────────────────────────────────────────────
// Main upload function
// ─────────────────────────────────────────────
export async function uploadProjects(
  projects: ParsedProject[]
): Promise<UploadResult> {
  // Step 1 — Find out which titles already exist
  const existingTitles = await getExistingTitles();

  // Step 2 — Separate new projects from duplicates
  const newProjects: ParsedProject[] = [];
  const skippedTitles: string[] = [];

  projects.forEach((project) => {
    if (existingTitles.includes(project.title)) {
      skippedTitles.push(project.title);
    } else {
      newProjects.push(project);
    }
  });

  // Step 3 — If nothing new to upload, return early
  if (newProjects.length === 0) {
    return {
      successCount: 0,
      skippedCount: skippedTitles.length,
      skippedTitles,
    };
  }

  // Step 4 — Write in chunks of 500 (Firestore batch limit)
  const CHUNK_SIZE = 500;
  let successCount = 0;

  for (let i = 0; i < newProjects.length; i += CHUNK_SIZE) {
    const chunk = newProjects.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);

    chunk.forEach((project) => {
      const docRef = doc(collection(db, "projects"));
      batch.set(docRef, {
        ...project,
        uploadedAt: Timestamp.now(),
      });
    });

    await batch.commit();
    successCount += chunk.length;
  }

  // Step 5 — Return result summary
  return {
    successCount,
    skippedCount: skippedTitles.length,
    skippedTitles,
  };
}