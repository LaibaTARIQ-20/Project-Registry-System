import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FirestoreProject } from "@/types";

interface UseProjectsReturn {
  projects: FirestoreProject[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(db, "projects"),
          orderBy("uploadedAt", "desc")
        );

        const snapshot = await getDocs(q);

        const fetched: FirestoreProject[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FirestoreProject, "id">),
        }));

        setProjects(fetched);
      } catch (err) {
        console.error("Firestore fetch error:", err);
        setError("Failed to load projects. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [trigger]);

  const refetch = () => setTrigger((prev) => prev + 1);

  return { projects, loading, error, refetch };
}