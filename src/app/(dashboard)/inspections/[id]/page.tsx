"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";

// Types for this page
interface Form {
    form_id: string;
    title: string;
    status: string;
    progress_percentage: number;
    due_date: string;
    description?: string;
}

interface Vessel {
    vessel_id: string;
    name: string;
    imo_number: string;
    vessel_type?: string;
    flag?: string; // Not in API assigned response, usually fetches separately or mock
    built_year?: string; // Not in API assigned response
}

interface AssignmentDetail {
    assignment_id: string;
    vessel_id: string;
    status: string;
    inspection_status: string;
    priority: string;
    due_date: string;
    created_at: string;
    vessel: Vessel;
    forms: Form[];
    assignee?: {
        name?: string;
        email?: string;
    };
}

export default function InspectionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params.id as string;
    const { user } = useAuthStore();

    const [activeTab, setActiveTab] = useState("Overview");
    const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (assignmentId) {
            fetchInspectionDetails();
        }
    }, [assignmentId]);

    const fetchInspectionDetails = async () => {
        setLoading(true);
        setError("");
        try {
            // Fetch Assignments list and find the matching one
            const response = await apiClient(`/inspectors/assignments?page=1&limit=20`);
            if (response.success && response.data && response.data.items) {
                const found = response.data.items.find((a: AssignmentDetail) => a.assignment_id === assignmentId);
                if (found) {
                    setAssignment(found);
                } else {
                    throw new Error("Inspection assignment not found.");
                }
            } else {
                throw new Error(response.message || "Failed to fetch inspection assignments.");
            }
        } catch (err: any) {
            console.error("Error fetching inspection details:", err);
            setError(err.message || "Failed to fetch inspection details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 h-screen">
                <svg className="animate-spin h-8 w-8 text-[#1B6486]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-red-500">{error || "Inspection not found"}</p>
                <Link href="/" className="text-[#1B6486] underline">
                    Go back to dashboard
                </Link>
            </div>
        );
    }

    // Calculate stats
    const totalForms = assignment.forms.length;
    const formsCompleted = assignment.forms.filter(f => f.progress_percentage === 100 || f.status === 'completed').length;

    // Mock Data for missing fields
    const vesselFlag = "🇮🇳"; // India Flag emoji or Image
    const vesselLocation = "Port of Goa";
    const inspectionStartDate = new Date(assignment.created_at).toLocaleDateString("en-GB", {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const inspectorName = user?.email?.split('@')[0] || "John Mathews"; // Fallback to logged in user

    return (
        <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
            {/* Header with Back Button */}
            <div className="flex items-center gap-2 mb-6">
                <Link href="/" className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800 uppercase">
                    {assignment.vessel.name}
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {["Overview", "Forms"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 pb-4 text-center font-medium text-lg transition-all relative ${activeTab === tab
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

            {activeTab === "Overview" && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Forms Assigned" value={totalForms} />
                        <StatCard label="Forms Completed" value={formsCompleted} />
                        <StatCard label="Last Synced" value="1 hour ago" isText />
                    </div>

                    {/* Vessel Info Card */}
                    <div className="bg-[#EBF5F8] rounded-xl p-6">
                        <h3 className="font-bold text-gray-800 mb-6">Vessel Info Card:</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6">
                            <InfoItem label="Vessel Name:" value={assignment.vessel.name} />
                            <InfoItem label="IMO:" value={assignment.vessel.imo_number} />
                            <InfoItem label="Flag:" value={vesselFlag} />
                            <InfoItem label="Type:" value={assignment.vessel.vessel_type || "Bulk Carrier"} />

                            <InfoItem label="Built Year:" value="2018" />{/* Mocked */}
                            <InfoItem label="Location:" value={vesselLocation} />
                            <InfoItem label="Inspection Start Date:" value={inspectionStartDate} />
                            <InfoItem label="Inspector:" value={inspectorName} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Forms" && (
                <div className="bg-white rounded-xl p-8 border border-gray-100 min-h-[400px]">
                    {assignment.forms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {assignment.forms.map((form) => (
                                <FormCard key={form.form_id} form={form} imo={assignment.vessel.imo_number} assignmentId={assignmentId} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No forms assigned.
                        </div>
                    )}
                </div>
            )}

            {/* Footer Actions Removed */}
        </div>
    );
}

// Sub-components

function StatCard({ label, value, isText = false }: { label: string, value: string | number, isText?: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-32">
            <p className="text-gray-500 text-sm mb-2">{label}</p>
            <p className={`font-bold ${isText ? 'text-[#1B6486] text-lg' : 'text-[#1B6486] text-3xl'}`}>
                {value}
            </p>
        </div>
    )
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-gray-400 text-xs mb-1">{label}</span>
            <span className="text-gray-800 font-semibold text-sm">{value}</span>
        </div>
    )
}

function FormCard({ form, imo, assignmentId }: { form: Form, imo: string, assignmentId: string }) {
    // Determine status badge color
    let statusColor = "bg-gray-100 text-gray-600";
    let statusText = form.status;

    if (form.status === 'completed' || form.progress_percentage === 100) {
        statusColor = "bg-green-100 text-green-700";
        statusText = "Completed";
    } else if (form.status === 'start' || form.progress_percentage === 0) {
        statusColor = "bg-blue-100 text-blue-700";
        statusText = "To Start";
    } else {
        statusColor = "bg-orange-100 text-orange-700";
        statusText = "In Progress";
    }

    return (
        <div className="bg-[#EBF5F8] p-6 rounded-xl relative flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-gray-800 text-lg leading-tight pr-4">{form.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">IMO {imo}</p>
                </div>
                <span className={`${statusColor} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase whitespace-nowrap`}>
                    {statusText}
                </span>
            </div>

            <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[40px]">
                {form.description || "No description available."}
            </p>

            {/* Progress */}
            <div className="mb-6 mt-auto">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(form.progress_percentage)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#1B6486] transition-all duration-500"
                        style={{ width: `${form.progress_percentage}%` }}
                    ></div>
                </div>
            </div>

            <Link href={`/inspections/${assignmentId}/forms/${form.form_id}`} className="mt-2">
                <button
                    className="w-full py-3 bg-[#1B6486] hover:bg-[#155270] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                    style={{
                        background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
                    }}
                >
                    View Details
                </button>
            </Link>
        </div>
    )
}
