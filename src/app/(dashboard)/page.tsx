"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/apiClient";

type InspectionTab = "Active" | "In Progress" | "Completed";

interface Vessel {
  vessel_id: string;
  name: string;
  vessel_type: string;
  imo_number: string;
}

interface Assignment {
  assignment_id: string;
  form_id: string;
  vessel_id: string;
  status: string;
  inspection_status: string;
  inspection_progress_percentage: number;
  priority: string;
  due_date: string;
  vessel: Vessel;
  forms: Array<{
    form_id: string;
    title: string;
    status: string;
    progress_percentage: number;
  }>;
}

interface AssignmentsResponse {
  success: boolean;
  data: {
    items: Assignment[];
    page: number;
    limit: number;
    has_next: boolean;
  };
  message: string;
  error: string | null;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<InspectionTab>("Active");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const response: AssignmentsResponse = await apiClient("/inspectors/assignments?page=1&limit=20");
      if (response.success && response.data) {
        setAssignments(response.data.items);
      } else {
        throw new Error(response.message || "Failed to fetch assignments");
      }
    } catch (err: any) {
      console.error("Error fetching assignments:", err);
      setError(err.message || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (assignment: Assignment): InspectionTab => {
    // Based on inspection_status: "start", "continue", "completed"
    const inspectionStatus = assignment.inspection_status?.toLowerCase();
    const status = assignment.status?.toLowerCase();

    if (inspectionStatus === "completed" || status === "completed" || status === "submitted") {
      return "Completed";
    } else if (inspectionStatus === "continue" || status === "in_progress") {
      return "In Progress";
    } else {
      // "start", "assigned", "pending"
      return "Active";
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    return getDisplayStatus(assignment) === activeTab;
  });

  const tabs: InspectionTab[] = ["Active", "In Progress", "Completed"];

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, <span className="text-gray-900">{user?.email?.split("@")[0]?.split("+")[0] || "John"}</span> 👋
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-4 text-center font-medium text-base transition-all relative ${activeTab === tab
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1B6486] rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-[#1B6486]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mb-4 p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
          {error}
          <button onClick={fetchAssignments} className="ml-4 text-[#1B6486] underline">
            Retry
          </button>
        </div>
      )}

      {/* Assignments Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <InspectionCard
              key={assignment.assignment_id}
              assignment={assignment}
              displayStatus={getDisplayStatus(assignment)}
            />
          ))}

          {filteredAssignments.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No {activeTab.toLowerCase()} inspections found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InspectionCard({
  assignment,
  displayStatus,
}: {
  assignment: Assignment;
  displayStatus: InspectionTab;
}) {
  const getStatusColor = (status: InspectionTab) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "In Progress":
        return "bg-yellow-100 text-yellow-600";
      case "Completed":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const progress = Math.round(assignment.inspection_progress_percentage || 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      {/* Header with Title and Badge */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{assignment.vessel?.name || "Unknown Vessel"}</h3>
          <p className="text-sm text-gray-400">IMO {assignment.vessel?.imo_number || "N/A"}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(displayStatus)}`}>
          {displayStatus}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 mb-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
            }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4">Inspection progress {progress}%</p>

      {/* Action Button */}
      <Link href={`/inspections/${assignment.assignment_id}`}>
        <button
          className="w-full py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
          }}
        >
          {displayStatus === "Completed" ? "View Report" : "Start Inspection"}
        </button>
      </Link>
    </div>
  );
}
