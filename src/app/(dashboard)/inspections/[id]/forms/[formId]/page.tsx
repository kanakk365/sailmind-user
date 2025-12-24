"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";

interface FormQuestion {
    order: number;
    type: string;
    prompt: string;
    options: string[];
    media_url?: string | null;
    answer?: string;
}

interface FormDetails {
    form_id: string;
    title: string;
    questions: FormQuestion[];
}

export default function FormDetailsPage() {
    const params = useParams();
    const assignmentId = params.id as string;
    const formId = params.formId as string;

    const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (assignmentId && formId) {
            fetchFormDetails();
        }
    }, [assignmentId, formId]);

    const fetchFormDetails = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiClient("/inspectors/assignments?page=1&limit=20");

            if (response.success && response.data && response.data.items) {
                const assignment = response.data.items.find((a: any) => a.assignment_id === assignmentId);

                if (assignment) {
                    const form = assignment.forms.find((f: any) => f.form_id === formId);

                    if (form) {
                        setFormDetails(form);
                    } else {
                        throw new Error("Form not found in this assignment.");
                    }
                } else {
                    throw new Error("Assignment not found.");
                }
            } else {
                throw new Error(response.message || "Failed to fetch assignments.");
            }

        } catch (err: any) {
            console.error("Error fetching form details:", err);
            setError(err.message || "Failed to load form.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to check if a string is a URL (for image answers)
    const isImageUrl = (str?: string) => {
        if (!str) return false;
        return str.startsWith('http://') || str.startsWith('https://');
    };

    if (loading) {
        return (
            <div className="flex  items-center justify-center h-screen">
                <svg className="animate-spin h-8 w-8 text-[#1B6486]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error || !formDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-red-500">{error || "Form not found"}</p>
                <Link href={`/inspections/${assignmentId}`} className="text-[#1B6486] underline">
                    Go back
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto w-full py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <Link href={`/inspections/${assignmentId}`} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-xl font-medium text-gray-800">
                    {formDetails.title}
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                {formDetails.questions
                    .sort((a, b) => a.order - b.order)
                    .map((q, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-6">
                            {/* Question */}
                            <p className="text-gray-800 font-semibold mb-3">
                                {q.order}. {q.prompt}
                            </p>

                            {/* Reference media_url (if exists) */}
                            {q.media_url && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Reference Image</p>
                                    <img
                                        src={q.media_url}
                                        alt="Reference"
                                        className="max-h-48 w-auto rounded-lg border border-gray-200 shadow-sm"
                                    />
                                </div>
                            )}

                            {/* Answer */}
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Answer</p>

                                {q.answer ? (
                                    isImageUrl(q.answer) ? (
                                        // Answer is an image URL
                                        <img
                                            src={q.answer}
                                            alt="Uploaded answer"
                                            className="max-h-64 w-auto rounded-lg border border-gray-200 shadow-sm"
                                        />
                                    ) : (
                                        // Answer is text (text or mcq)
                                        <p className="text-gray-800 bg-white px-4 py-3 rounded-lg border border-gray-200">
                                            {q.answer}
                                        </p>
                                    )
                                ) : (
                                    <p className="text-gray-400 italic bg-white px-4 py-3 rounded-lg border border-gray-200">
                                        No answer provided
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-8 ">
                <Link href={`/inspections/${assignmentId}/forms/${formId}/add-defect`}>
                    <button className="px-6 py-2.5 mb-6 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold rounded-lg transition-colors shadow-sm cursor-pointer">
                        Add Defects
                    </button>
                </Link>
            </div>
        </div>
    );
}
