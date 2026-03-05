"use client";

import { useProjects } from "@/hooks/useProjects";
import ProjectsTable from "@/components/ProjectsTable";
import { Upload, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const { projects, loading, error, refetch } = useProjects();

  return (
    <div className="mx-auto max-w-6xl">

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            All projects stored in the database.
          </p>
        </div>

        {/* Header buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/upload"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Upload size={15} />
            Upload More
          </Link>
        </div>
      </div>

      {/* Stats bar — only show when data is loaded */}
      {!loading && !error && projects.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

          {/* Total projects */}
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total Projects
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {projects.length}
            </p>
          </div>

          {/* Total students */}
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total Students
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {projects.reduce((sum, p) => sum + p.studentCount, 0)}
            </p>
          </div>

          {/* Unique supervisors */}
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Supervisors
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {new Set(projects.map((p) => p.supervisor)).size}
            </p>
          </div>

          {/* Unique SDGs */}
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              SDGs Covered
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {new Set(projects.map((p) => p.sdg)).size}
            </p>
          </div>

        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-16">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-gray-500">
            Loading projects...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="text-sm font-semibold text-red-800">
            Failed to load projects
          </p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Projects table */}
      {!loading && !error && (
        <ProjectsTable projects={projects} />
      )}

    </div>
  );
}
