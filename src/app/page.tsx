"use client";

import React from "react";
import { ChevronLeft, Search, Plus } from "lucide-react";
import Link from "next/link";

interface Defect {
  id: string;
  title: string;
  assignedTo: string;
  role?: string;
  status: "Pending" | "In Progress" | "Resolved";
  severity: "Minor" | "Major" | "Critical";
}

const defects: Defect[] = [
  {
    id: "1",
    title: "Lifeboat motor malfunction",
    assignedTo: "John Mathews",
    role: "Chief Engineer",
    status: "Pending",
    severity: "Minor",
  },
  {
    id: "2",
    title: "Emergency light not functioning",
    assignedTo: "Riya Fernandes",
    status: "In Progress",
    severity: "Major",
  },
  {
    id: "3",
    title: "Fire extinguisher missing from Engine Room",
    assignedTo: "Anil Kumar",
    status: "Resolved",
    severity: "Critical",
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-6">
        <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Safety Equipment Check-Form
        </h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm w-full md:w-96 border border-gray-100">
          <Search size={18} className="text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-300"
          />
        </div>
      </div>

      {/* Defects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {defects.map((defect) => (
          <DefectCard key={defect.id} defect={defect} />
        ))}
      </div>

      {/* Floating Action Button or Bottom Right Button */}
      <div className="fixed bottom-8 right-8 md:absolute md:bottom-0 md:right-0 md:relative md:flex md:justify-end md:mt-auto">
        <button
          className="flex items-center gap-2 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
          style={{
            background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
          }}
        >
          <Plus size={20} />
          <span>Add new defect</span>
        </button>
      </div>
    </div>
  );
}

function DefectCard({ defect }: { defect: Defect }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minor":
        return "text-green-500";
      case "Major":
        return "text-yellow-500";
      case "Critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    // In the image, status text is gray/lighter.
    return "text-gray-400";
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-bold text-gray-800 mb-4">{defect.title}</h3>

      <div className="space-y-3 flex-1">
        <div className="text-sm">
          <span className="text-gray-500 font-medium">Assigned To: </span>
          <span className="text-gray-400">
            {defect.assignedTo} {defect.role && <span className="text-gray-300">({defect.role})</span>}
          </span>
        </div>

        <div className="text-sm">
          <span className="text-gray-500 font-medium">Status: </span>
          <span className={getStatusColor(defect.status)}>{defect.status}</span>
        </div>

        <div className="text-sm flex items-center gap-2">
          <span className="text-gray-500 font-medium">Severity Indicator: </span>
          <div className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${getSeverityColor(defect.severity).replace("text-", "bg-")}`}></span>
            <span className={`${getSeverityColor(defect.severity)} font-medium`}>{defect.severity}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href={`/defects/1`}>
          <button
            className="text-white text-xs font-semibold px-4 py-2 rounded-md transition-opacity hover:opacity-90 w-full md:w-auto"
            style={{
              background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
            }}
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
