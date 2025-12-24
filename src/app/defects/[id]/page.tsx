"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DefectDetailsPage() {
    const [activeTab, setActiveTab] = useState("Defects");

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
                    Defect #023
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
                            <p className="font-semibold text-gray-800">Lifeboat motor malfunction</p>
                        </div>

                        <div className="col-span-1 lg:col-span-2">
                            <p className="text-sm text-gray-400 mb-1">Description:</p>
                            <p className="font-semibold text-gray-800 truncate">Motor for Lifeboat is damaged and not prop..</p>
                        </div>

                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Severity:</p>
                            <p className="font-semibold text-gray-800">Minor</p>
                        </div>

                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Location of Defect on Ship:</p>
                            <p className="font-semibold text-gray-800">Bulkheads</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 mb-8">
                        {/* Row 2 */}
                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Equipment Name:</p>
                            <p className="font-semibold text-gray-800">Ultrasonic Flaw Detectors</p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Assign To:</p>
                            <p className="font-semibold text-gray-800">John Mathews</p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-sm text-gray-400 mb-1">Status:</p>
                            <p className="font-semibold text-gray-800">Open</p>
                        </div>
                    </div>

                    {/* Photos */}
                    <div>
                        <p className="text-sm text-gray-400 mb-4">Photos:</p>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative w-24 h-20 md:w-32 md:h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                                    {/* Placeholder for images. In a real app, use next/image with actual src */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                        Photo {i}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Analysis" && (
                <div className="flex items-center justify-center p-20 text-gray-400 border border-dashed border-gray-300 rounded-xl">
                    No analysis data available.
                </div>
            )}
        </div>
    );
}
