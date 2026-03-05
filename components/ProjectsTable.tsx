"use client";

import { FirestoreProject } from "@/types";
import { Users, GraduationCap, Building2, Leaf, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface ProjectsTableProps {
  projects: FirestoreProject[];
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const [search, setSearch] = useState("");

  // ─────────────────────────────────────────────
  // Filter projects based on search input
  // ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return projects;

    return projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(term) ||
        project.supervisor.toLowerCase().includes(term) ||
        project.sdg.toLowerCase().includes(term) ||
        project.industrialPartner.toLowerCase().includes(term) ||
        project.students.some((s) => s.toLowerCase().includes(term)) ||
        (project.coSupervisor &&
          project.coSupervisor.toLowerCase().includes(term))
      );
    });
  }, [search, projects]);

  // ─────────────────────────────────────────────
  // Empty state — no projects in Firestore at all
  // ─────────────────────────────────────────────
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
        <p className="text-sm font-medium text-gray-500">No projects found</p>
        <p className="mt-1 text-xs text-gray-400">
          Upload an Excel file to get started
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Search bar + count */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by title, supervisor, student, SDG..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <span className="shrink-0 text-xs text-gray-400">
          {filtered.length} of {projects.length} project
          {projects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* No search results */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
          <p className="text-sm text-gray-400">
            No projects match &quot;{search}&quot;
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">

            {/* Head */}
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Project Title</th>
                <th className="px-4 py-3 text-left">
                  <span className="flex items-center gap-1">
                    <Users size={13} /> Students
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} /> Supervisor
                  </span>
                </th>
                <th className="px-4 py-3 text-left">Co-Supervisor</th>
                <th className="px-4 py-3 text-left">
                  <span className="flex items-center gap-1">
                    <Building2 size={13} /> Partner
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="flex items-center gap-1">
                    <Leaf size={13} /> SDG
                  </span>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((project, index) => (
                <tr
                  key={project.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  {/* Number */}
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {index + 1}
                  </td>

                  {/* Title */}
                  <td className="max-w-50 px-4 py-3 font-medium text-gray-900">
                    {project.title}
                  </td>

                  {/* Students */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {project.students.map((student, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                        >
                          {student}
                        </span>
                      ))}
                    </div>
                    <span className="mt-1 block text-xs text-gray-400">
                      {project.studentCount} student
                      {project.studentCount !== 1 ? "s" : ""}
                    </span>
                  </td>

                  {/* Supervisor */}
                  <td className="px-4 py-3 text-gray-700">
                    {project.supervisor}
                  </td>

                  {/* Co-Supervisor */}
                  <td className="px-4 py-3">
                    {project.coSupervisor ? (
                      <span className="text-gray-700">
                        {project.coSupervisor}
                      </span>
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        None
                      </span>
                    )}
                  </td>

                  {/* Industrial Partner */}
                  <td className="px-4 py-3 text-gray-700">
                    {project.industrialPartner}
                  </td>

                  {/* SDG */}
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      {project.sdg}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}