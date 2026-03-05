"use client";

import { ParsedProject } from "@/types";
import { Users, GraduationCap, Building2, Leaf } from "lucide-react";

interface PreviewTableProps {
  projects: ParsedProject[];
}

export default function PreviewTable({ projects }: PreviewTableProps) {
  if (projects.length === 0) return null;

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Preview — Valid Projects
        </h2>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {projects.length} project{projects.length !== 1 ? "s" : ""} ready
        </span>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">

          {/* Table Head */}
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

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 bg-white">
            {projects.map((project, index) => (
              <tr
                key={index}
                className="transition-colors hover:bg-gray-50"
              >
                {/* Row number */}
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {index + 1}
                </td>

                {/* Title */}
                <td className="px-4 py-3 font-medium text-gray-900 max-w-50">
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
                    {project.studentCount} student{project.studentCount !== 1 ? "s" : ""}
                  </span>
                </td>

                {/* Supervisor */}
                <td className="px-4 py-3 text-gray-700">
                  {project.supervisor}
                </td>

                {/* Co-Supervisor */}
                <td className="px-4 py-3">
                  {project.coSupervisor ? (
                    <span className="text-gray-700">{project.coSupervisor}</span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">None</span>
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
    </div>
  );
}