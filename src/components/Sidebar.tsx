"use client";

import React, { useState } from "react";
import {
  Home,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

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
        {!collapsed && <h1 className="text-2xl font-bold text-[#1B6486]">Sailmind</h1>}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link href="/">
          <NavItem icon={<Home size={20} />} label="Home" active={isActive("/")} collapsed={collapsed} />
        </Link>
        <Link href="/defects">
          <NavItem
            icon={<AlertCircle size={20} />}
            label="Defects"
            active={isActive("/defects")}
            collapsed={collapsed}
          />
        </Link>
      </nav>

      {/* Footer User Profile */}
      <div className="p-4 border-t border-gray-100 relative">
        {showLogout && (
          <div className="absolute bottom-full left-0 w-full px-4 mb-2 z-20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-xl p-3 text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              {!collapsed && <span className="font-medium text-sm">Log Out</span>}
            </button>
          </div>
        )}

        <div
          onClick={() => setShowLogout(!showLogout)}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#1B6486] text-white flex items-center justify-center text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase() || "J"}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-500">Welcome 👋</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.email?.split("@")[0] || "John"}
              </p>
            </div>
          )}
          {!collapsed && <ChevronRight size={16} className={`text-gray-400 transition-transform ${showLogout ? "rotate-[-90deg]" : ""}`} />}
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
      className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors group ${active
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
