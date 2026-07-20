"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, X } from "lucide-react";

type HelpTopic = { title: string; steps: string[] };

const HELP: { match: (path: string) => boolean; topic: HelpTopic }[] = [
  {
    match: (p) => p === "/admin",
    topic: {
      title: "Dashboard",
      steps: [
        "Shows patient count, gross income, expenses, and net income for the current month.",
        "Numbers update automatically as you add treatments, payments, and expenses elsewhere.",
      ],
    },
  },
  {
    match: (p) => /^\/admin\/patients\/[^/]+\/soa/.test(p),
    topic: {
      title: "Statement of Account",
      steps: [
        "Shows this patient's full treatment history, payments, and remaining balance.",
        'Click "Print Statement of Account" to save it as a PDF for the patient.',
      ],
    },
  },
  {
    match: (p) => /^\/admin\/patients\/[^/]+\/edit/.test(p),
    topic: {
      title: "Edit Patient",
      steps: [
        'Update any field and click "Save Changes."',
        "Treatment history and payments are not affected by editing patient info.",
      ],
    },
  },
  {
    match: (p) => /^\/admin\/patients\/new/.test(p),
    topic: {
      title: "Add Patient",
      steps: ["Fill in the required fields (name and branch) and click \"Save Patient.\"", "Everything else is optional and can be filled in later from the edit page."],
    },
  },
  {
    match: (p) => /^\/admin\/patients\/[^/]+$/.test(p),
    topic: {
      title: "Patient Record",
      steps: [
        'Fill in the form and click "Add Treatment Record" to log a procedure.',
        'Click "Add Payment" on any treatment row to record money received against it.',
        "Click a section of a tooth to mark its condition on the odontogram — click it again to change or clear it.",
        'Use "View / Print Statement of Account" to generate a printable E-SOA for this patient.',
      ],
    },
  },
  {
    match: (p) => p === "/admin/patients",
    topic: {
      title: "Patient's Profile",
      steps: [
        "Search by name using the search box.",
        'Click "+ Add Patient" to register a new patient.',
        'Click "View" on any row to open that patient\'s full record.',
      ],
    },
  },
  {
    match: (p) => p === "/admin/appointments",
    topic: {
      title: "Client Appointments",
      steps: [
        "Filter the list by branch or dentist using the dropdowns.",
        'Click "Confirm" to accept a pending request, or "Cancel" to decline it.',
        'Once confirmed, click "Mark Completed" after the visit happens.',
      ],
    },
  },
  {
    match: (p) => p === "/admin/expenses",
    topic: {
      title: "Expenses",
      steps: [
        'Select a branch, enter the date, particulars, and amount, then click "Add Expense."',
        "Expenses reduce the net income shown on the Dashboard.",
      ],
    },
  },
  {
    match: (p) => p === "/admin/reports",
    topic: {
      title: "Reports",
      steps: [
        "Patient Recall Report lists patients who haven't visited in 5+ months — good for follow-up calls.",
        "Payroll Report shows each dentist's commission based on their rate and total collections.",
      ],
    },
  },
  {
    match: (p) => /^\/admin\/documents\/[^/]+$/.test(p),
    topic: {
      title: "Document Preview",
      steps: ['Review the certificate or prescription, then click "Print" to save it as a PDF.'],
    },
  },
  {
    match: (p) => p === "/admin/documents",
    topic: {
      title: "Documents",
      steps: [
        'Choose a patient, dentist, and document type, write the content, then click "Generate Document."',
        'Click "View / Print" on any row to reopen and print a document you already generated.',
      ],
    },
  },
  {
    match: (p) => p === "/admin/configurations",
    topic: {
      title: "Configurations",
      steps: [
        "Add branches, dentists (with commission rate and PRC/PTR numbers), services, and HMO providers here.",
        "Anything you add here immediately shows up in the dropdowns across the rest of the system.",
      ],
    },
  },
];

const DEFAULT_TOPIC: HelpTopic = {
  title: "Help",
  steps: ["Use the sidebar on the left to navigate between sections."],
};

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const topic = HELP.find((h) => h.match(pathname))?.topic ?? DEFAULT_TOPIC;

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {open && (
        <div className="absolute bottom-16 right-0 w-72 rounded-lg border bg-white p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-semibold text-brand-900">{topic.title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {topic.steps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-700">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="How to use this page"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-800"
      >
        {open ? <X size={22} /> : <HelpCircle size={22} />}
      </button>
    </div>
  );
}
