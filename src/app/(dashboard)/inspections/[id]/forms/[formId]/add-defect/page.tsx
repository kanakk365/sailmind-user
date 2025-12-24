"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";

export default function AddDefectPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params.id as string;
    const formId = params.formId as string;
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [vesselId, setVesselId] = useState("");

    // Form Fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("");
    const [location, setLocation] = useState("");
    const [equipment, setEquipment] = useState("");

    const [priority, setPriority] = useState("low");
    const [dueDate, setDueDate] = useState("");

    // Photos state with object URLs for preview
    const [photos, setPhotos] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        if (assignmentId) {
            fetchAssignmentDetails();
        }
    }, [assignmentId]);

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const fetchAssignmentDetails = async () => {
        setLoading(true);
        try {
            const response = await apiClient(`/inspectors/assignments?page=1&limit=20`);
            if (response.success && response.data && response.data.items) {
                const found = response.data.items.find((a: any) => a.assignment_id === assignmentId);
                if (found) {
                    setVesselId(found.vessel_id);
                } else {
                    setError("Assignment not found.");
                }
            }
        } catch (err: any) {
            console.error("Error fetching assignment:", err);
            setError("Failed to load context.");
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setPhotos((prev) => [...prev, ...newFiles]);

            // Generate preview URLs
            const newUrls = newFiles.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));

        // Revoke the specific URL and remove from state
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title || !description || !severity || !location || !equipment || !vesselId) {
            alert("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("vessel_id", vesselId);
            formData.append("form_id", formId);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("severity", severity.toLowerCase());
            formData.append("priority", priority);
            formData.append("location_on_ship", location);
            formData.append("equipment_name", equipment);

            const submitDueDate = dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            formData.append("due_date", submitDueDate);

            photos.forEach((photo) => {
                formData.append("photo", photo);
            });

            const response = await apiClient("/inspectors/defects", {
                method: "POST",
                body: formData,
            });

            if (response.success) {
                router.push(`/inspections/${assignmentId}/forms/${formId}`);
            } else {
                alert(response.message || "Failed to create defect");
            }

        } catch (err: any) {
            console.error("Error creating defect:", err);
            alert(err.message || "Failed to submit defect");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                    <Link href={`/inspections/${assignmentId}/forms/${formId}`}>
                        <ChevronLeft className="text-gray-600 cursor-pointer hover:bg-gray-100 rounded-full p-1" size={32} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Add Defect</h1>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-6">
                    {/* Defect Title */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Defect Title</label>
                        <input
                            type="text"
                            placeholder="Enter your Defect Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#1F9EBD]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Description</label>
                        <input
                            type="text"
                            placeholder="Enter Description for Defect"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#1F9EBD]"
                        />
                    </div>

                    {/* Severity */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Severity</label>
                        <div className="relative">
                            <select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#1F9EBD]"
                            >
                                <option value="" disabled>Add Severity</option>
                                <option value="minor">Minor</option>
                                <option value="medium">Medium</option>
                                <option value="major">Major</option>
                                <option value="critical">Critical</option>
                            </select>
                            <ChevronLeft className="rotate-[-90deg] absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    {/* Location - Changed to Input */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Location of Defect on Ship</label>
                        <input
                            type="text"
                            placeholder="Type Location of Defect"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#1F9EBD]"
                        />
                    </div>

                    {/* Equipment Name - Changed to Input */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Equipment Name</label>
                        <input
                            type="text"
                            placeholder="Type Equipment Name"
                            value={equipment}
                            onChange={(e) => setEquipment(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#1F9EBD]"
                        />
                    </div>



                    {/* Priority & Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm mb-2">Priority</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#1F9EBD]"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                                <ChevronLeft className="rotate-[-90deg] absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm mb-2">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#1F9EBD]"
                            />
                        </div>
                    </div>

                    {/* Photo Upload with Preview */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Photo Upload</label>
                        <div className="relative mb-3">
                            <input
                                type="file"
                                onChange={handlePhotoChange}
                                multiple
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-400 flex items-center justify-between bg-white">
                                <span>{photos.length > 0 ? `${photos.length} photo(s) selected` : "Upload Photo"}</span>
                                <ImageIcon size={20} className="text-gray-500" />
                            </div>
                        </div>

                        {/* Image Previews */}
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

                </div>

                {/* Footer Actions */}
                <div className="bg-white px-8 py-6 border-t border-gray-100 flex justify-end gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 border border-[#1F9EBD] text-[#1F9EBD] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 bg-[#1F9EBD] text-white font-semibold rounded-lg hover:bg-[#1B6486] transition-colors shadow-sm disabled:opacity-70"
                        disabled={submitting}
                        style={{
                            background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
                        }}
                    >
                        {submitting ? "Submitting..." : "Next"}
                    </button>
                </div>

            </div>
        </div>
    );
}
