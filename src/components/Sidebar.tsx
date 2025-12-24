"use client";

import React, { useState } from "react";
import {
  Home,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`relative flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 cursor-pointer z-10 shadow-sm hover:bg-gray-50"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="text-[#1B6486]">
          {/* Simple Boat/Logo representation */}
            <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path d="M12 2L2 22H22L12 2Z" fill="#1B6486" transform="scale(0.8) translate(3,0)" />
            <path d="M12 18C12 18 14 16 18 16" stroke="white" strokeWidth="2" />
            </svg>
        </div>
        {!collapsed && <h1 className="text-2xl font-bold text-[#1B6486]">ARKA</h1>}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavItem icon={<Home size={20} />} label="Home" collapsed={collapsed} />
        <NavItem icon={<LayoutGrid size={20} />} label="Forms" collapsed={collapsed} />
        <NavItem
          icon={<AlertCircle size={20} />}
          label="Defects"
          active
          collapsed={collapsed}
        />
      </nav>

      {/* Footer User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#1B6486] text-white flex items-center justify-center text-sm font-medium">
            J
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-500">Welcome 👋</p>
              <p className="text-sm font-semibold text-gray-900 truncate">John</p>
            </div>
          )}
          {!collapsed && <ChevronRight size={16} className="text-gray-400" />}
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  collapsed = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors group ${
        active
          ? "text-white shadow-md"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
      style={
        active
          ? {
              background: "linear-gradient(90deg, #1B6486 0%, #1F9EBD 100%)",
            }
          : {}
      }
    >
      <div className={`${active ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`}>
        {icon}
      </div>
      {!collapsed && <span className="font-medium text-sm">{label}</span>}
    </div>
  );
}
