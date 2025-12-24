"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, Search, Plus } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { Defect, DefectsResponse } from "@/lib/types";

export default function DefectsPage() {
    const [defects, setDefects] = useState<Defect[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchDefects();
    }, []);

    const fetchDefects = async () => {
        setLoading(true);
        setError("");
        try {
            const response: DefectsResponse = await apiClient("/inspectors/defects?page=1&limit=20");
            if (response.success && response.data) {
                setDefects(response.data.items);
            } else {
                throw new Error(response.message || "Failed to fetch defects");
            }
        } catch (err: any) {
            console.error("Error fetching defects:", err);
            setError(err.message || "Failed to fetch defects");
        } finally {
            setLoading(false);
        }
    };

    const filteredDefects = defects.filter((defect) =>
        defect.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Page Header */}
            <div className="flex items-center gap-2 mb-6">
                <Link href="/" className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-xl font-medium text-gray-800">
                    Defects
                </h1>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm w-full md:w-96 border border-gray-100">
                    <Search size={18} className="text-gray-300 mr-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-300"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-[#1B6486]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="mb-4 p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                    <button onClick={fetchDefects} className="ml-4 text-[#1B6486] underline">
                        Retry
                    </button>
                </div>
            )}

            {/* Defects Cards Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {filteredDefects.map((defect) => (
                        <DefectCard key={defect.defect_id} defect={defect} />
                    ))}

                    {filteredDefects.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            No defects found.
                        </div>
                    )}
                </div>
            )}

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
        switch (severity.toLowerCase()) {
            case "minor":
                return "text-green-500";
            case "major":
                return "text-yellow-500";
            case "critical":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "open":
                return "Pending";
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

    const capitalizeFirst = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h3 className="font-medium text-gray-800 mb-4">{defect.title}</h3>

            <div className="space-y-3 flex-1">
                <div className="text-sm">
                    <span className="text-gray-500 font-medium">Assigned To: </span>
                    <span className="text-gray-400">
                        {defect.raised_by_inspector?.name || "N/A"}
                    </span>
                </div>

                <div className="text-sm">
                    <span className="text-gray-500 font-medium">Status: </span>
                    <span className="text-gray-400">{getStatusDisplay(defect.status)}</span>
                </div>

                <div className="text-sm flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Severity Indicator: </span>
                    <div className="flex items-center gap-1">
                        <span className={`w-3 h-3 rounded-full ${getSeverityColor(defect.severity).replace("text-", "bg-")}`}></span>
                        <span className={`${getSeverityColor(defect.severity)} font-medium`}>{capitalizeFirst(defect.severity)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <Link href={`/defects/${defect.defect_id}`}>
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
