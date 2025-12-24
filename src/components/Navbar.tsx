"use client";

import React from "react";
import { Search, Bell } from "lucide-react";

export default function Navbar() {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            {/* Left side (Breadcrumbs or title often go here, but empty in image example mostly) */}
            <div className="flex bg-white items-center gap-3">
                {/* Placeholder for potential left content */}
                <button className="p-2 hover:bg-gray-100 rounded-full lg:hidden">
                    <Search size={20} />
                </button>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 md:w-80">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        3
                    </span>
                </button>

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#1F9EBD] text-white flex items-center justify-center text-sm font-medium cursor-pointer">
                    J
                </div>
            </div>
        </header>
    );
}
