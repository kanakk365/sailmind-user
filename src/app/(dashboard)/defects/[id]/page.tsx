"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Upload, Image as ImageIcon, X } from "lucide-react";
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
    const [submitting, setSubmitting] = useState(false);

    // Analysis Form State
    const [rootCause, setRootCause] = useState("");
    const [impact, setImpact] = useState("");
    const [probability, setProbability] = useState("");
    const [notes, setNotes] = useState("");
    const [analysisPhotos, setAnalysisPhotos] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

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

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setAnalysisPhotos((prev) => [...prev, ...newFiles]);

            const newUrls = newFiles.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setAnalysisPhotos((prev) => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAnalysisSubmit = async () => {
        if (!rootCause || !impact || !probability) {
            alert("Please fill in all required fields (Root Cause, Impact, Probability).");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("root_cause", rootCause);
            formData.append("impact_assessment", impact);
            formData.append("recurrence_probability", probability);
            formData.append("notes", notes);

            analysisPhotos.forEach((photo) => {
                formData.append("photo", photo);
            });

            const response = await apiClient(`/inspectors/defects/${defectId}/analysis`, {
                method: "POST",
                body: formData,
            });

            if (response.success) {
                // Refresh data to show the analysis view
                fetchDefectDetails();
            } else {
                alert(response.message || "Failed to submit analysis.");
            }
        } catch (err: any) {
            console.error("Error submitting analysis:", err);
            alert(err.message || "Failed to submit analysis.");
        } finally {
            setSubmitting(false);
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
                <h1 className="text-xl font-medium text-gray-800">
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
                    <h2 className="font-medium text-gray-800 mb-8">Defect Info Card:</h2>

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
                            <h2 className="font-medium text-gray-800 mb-8">Analysis Info:</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 mb-8">
                                <div className="col-span-1 lg:col-span-2">
                                    <p className="text-sm text-gray-400 mb-1">Root Cause:</p>
                                    <p className="font-medium text-gray-800">
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
                        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                            {/* Form */}
                            <div>
                                <label className="block text-gray-600 text-sm mb-2">Root Cause</label>
                                <input
                                    type="text"
                                    placeholder="Enter Root Cause"
                                    value={rootCause}
                                    onChange={(e) => setRootCause(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#1F9EBD]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-2">Impact Assessment</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Impact"
                                        value={impact}
                                        onChange={(e) => setImpact(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#1F9EBD]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-2">Recurrence Probability</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Probability"
                                        value={probability}
                                        onChange={(e) => setProbability(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#1F9EBD]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-600 text-sm mb-2">Notes</label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter additional notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#1F9EBD]"
                                />
                            </div>

                            {/* Photos */}
                            <div>
                                <label className="block text-gray-600 text-sm mb-2">Analysis Photos</label>
                                <div className="relative mb-3">
                                    <input
                                        type="file"
                                        onChange={handlePhotoChange}
                                        multiple
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-400 flex items-center justify-between bg-white">
                                        <span>{analysisPhotos.length > 0 ? `${analysisPhotos.length} photo(s) selected` : "Upload Photo"}</span>
                                        <ImageIcon size={20} className="text-gray-500" />
                                    </div>
                                </div>

                                {previewUrls.length > 0 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {previewUrls.map((url, index) => (
                                            <div key={url} className="relative flex-shrink-0 group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index}`}
                                                    className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    onClick={() => handleRemovePhoto(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                                    title="Remove photo"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={handleAnalysisSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-[#1F9EBD] text-white font-semibold rounded-lg hover:bg-[#1B6486] transition-colors shadow-sm disabled:opacity-70"
                                    style={{
                                        background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
                                    }}
                                >
                                    {submitting ? "Submitting..." : "Submit Analysis"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
