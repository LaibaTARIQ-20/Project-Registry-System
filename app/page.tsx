import Link from "next/link";
import { Upload, Database, FileSpreadsheet, CheckCircle } from "lucide-react";

export default function Home() {
  const steps = [
    {
      icon: <FileSpreadsheet size={22} className="text-blue-600" />,
      title: "Prepare your Excel file",
    
    },
    {
      icon: <Upload size={22} className="text-blue-600" />,
      title: "Upload and preview",
    
    },
    {
      icon: <CheckCircle size={22} className="text-blue-600" />,
      title: "Confirm and save",
     
    },
    {
      icon: <Database size={22} className="text-blue-600" />,
      title: "Browse projects",
     
    },
  ];

  const rules = [
    "Project Title",
    "Group Members: Minimum 2 students, maximum 4 students",
    "Supervisor name ",
    "Co-Supervisor",
    "Industrial partner ",
    "SDG goal",
  ];

  return (
    <div className="mx-auto max-w-3xl">

      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
          <FileSpreadsheet size={15} />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
          FYP Vault
        </h1>
        <p className="text-base text-gray-500">
          Upload your Final Year Projects
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/upload"
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Upload Excel File
          </Link>
          <Link
            href="/projects"
            className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            View Projects
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  {step.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-gray-800">
                {step.title}
              </h3>
           
            </div>
          ))}
        </div>
      </div>

      {/* Validation rules */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-800">
          Requirements
        </h2>
        <ul className="flex flex-col gap-2">
          {rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle
                size={15}
                className="mt-0.5 shrink-0 text-green-500"
              />
              <span className="text-xs text-gray-600">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}