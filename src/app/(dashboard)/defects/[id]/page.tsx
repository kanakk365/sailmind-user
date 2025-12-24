"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { Defect } from "@/lib/types";

interface DefectDetailResponse {
    success: boolean;
    data: Defect;
    message: string;
    error: string | null;
}

export default function DefectDetailsPage() {
    const params = useParams();
    const defectId = params.id as string;

    const [activeTab, setActiveTab] = useState("Defects");
    const [defect, setDefect] = useState<Defect | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (defectId) {
            fetchDefectDetails();
        }
    }, [defectId]);

    const fetchDefectDetails = async () => {
        setLoading(true);
        setError("");
        try {
            // Fetch defects list and find the one with matching ID
            const response = await apiClient("/inspectors/defects?page=1&limit=50");
            if (response.success && response.data) {
                const foundDefect = response.data.items.find(
                    (d: Defect) => d.defect_id === defectId
                );
                if (foundDefect) {
                    setDefect(foundDefect);
                } else {
                    throw new Error("Defect not found");
                }
            } else {
                throw new Error(response.message || "Failed to fetch defect");
            }
        } catch (err: any) {
            console.error("Error fetching defect:", err);
            setError(err.message || "Failed to fetch defect details");
        } finally {
            setLoading(false);
        }
    };

    const capitalizeFirst = (str: string) => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : "N/A";
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "open":
                return "Open";
            case "in_progress":
                return "In Progress";
            case "approved":
                return "Approved";
            case "resolved":
                return "Resolved";
            case "closed":
                return "Closed";
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
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
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-red-500">{error}</p>
                <Link href="/" className="text-[#1B6486] underline">
                    Go back to dashboard
                </Link>
            </div>
        );
    }

    if (!defect) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-500">Defect not found</p>
                <Link href="/" className="text-[#1B6486] underline">
                    Go back to dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
            {/* Header with Back Button */}
            <div className="flex items-center gap-2 mb-6">
                <Link
                    href="/"
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">
                    Defect #{defect.defect_id.slice(0, 8)}
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab("Defects")}
                    className={`flex-1 pb-4 text-center font-medium text-lg transition-all relative ${activeTab === "Defects"
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Defects
                    {activeTab === "Defects" && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1B6486] rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("Analysis")}
                    className={`flex-1 pb-4 text-center font-medium text-lg transition-all relative ${activeTab === "Analysis"
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Analysis
                    {activeTab === "Analysis" && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1B6486] rounded-t-full"></span>
                    )}
                </button>
            </div>

            {/* Content Card */}
            {activeTab === "Defects" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="font-bold text-gray-800 mb-8">Defect Info Card:</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 mb-8">
                        {/* Row 1 */}
                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Defect Title:</p>
                            <p className="font-semibold text-gray-800">{defect.title}</p>
                        </div>

                        <div className="col-span-1 lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-1">Description:</p>
                            <p className="font-semibold text-gray-800">
                                {defect.description || "N/A"}
                            </p>
                        </div>

                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Severity:</p>
                            <p className="font-semibold text-gray-800">
                                {capitalizeFirst(defect.severity)}
                            </p>
                        </div>

                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">
                                Location of Defect on Ship:
                            </p>
                            <p className="font-semibold text-gray-800">
                                {defect.location_on_ship || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 mb-8">
                        {/* Row 2 */}
                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Equipment Name:</p>
                            <p className="font-semibold text-gray-800">
                                {defect.equipment_name || "N/A"}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Assign To:</p>
                            <p className="font-semibold text-gray-800">
                                {defect.raised_by_inspector?.name || "N/A"}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Status:</p>
                            <p className="font-semibold text-gray-800">
                                {getStatusDisplay(defect.status)}
                            </p>
                        </div>
                    </div>

                    {/* Photos */}
                    <div>
                        <p className="text-sm text-gray-400 mb-4">Photos:</p>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {defect.photos && defect.photos.length > 0 ? (
                                defect.photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="relative w-24 h-20 md:w-32 md:h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0"
                                    >
                                        <img
                                            src={photo}
                                            alt={`Defect photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm">No photos available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Analysis" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    {defect.analysis_root_cause ? (
                        <>
                            <h2 className="font-bold text-gray-800 mb-8">Analysis Info:</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 mb-8">
                                <div className="col-span-1 lg:col-span-2">
                                    <p className="text-sm text-gray-400 mb-1">Root Cause:</p>
                                    <p className="font-semibold text-gray-800">
                                        {defect.analysis_root_cause}
                                    </p>
                                </div>

                                <div className="col-span-1">
                                    <p className="text-sm text-gray-400 mb-1">
                                        Impact Assessment:
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {capitalizeFirst(defect.analysis_impact_assessment || "")}
                                    </p>
                                </div>

                                <div className="col-span-1">
                                    <p className="text-sm text-gray-400 mb-1">
                                        Recurrence Probability:
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {defect.analysis_recurrence_probability || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm text-gray-400 mb-1">Notes:</p>
                                <p className="font-semibold text-gray-800">
                                    {defect.analysis_notes || "N/A"}
                                </p>
                            </div>

                            {/* Analysis Photos */}
                            <div>
                                <p className="text-sm text-gray-400 mb-4">Analysis Photos:</p>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {defect.analysis_photos && defect.analysis_photos.length > 0 ? (
                                        defect.analysis_photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="relative w-24 h-20 md:w-32 md:h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0"
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Analysis photo ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No analysis photos available</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center p-20 text-gray-400">
                            No analysis data available.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
