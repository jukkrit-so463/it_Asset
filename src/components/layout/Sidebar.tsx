import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  Users,
  FileText,
  Package,
  Wrench,
  Settings,
  BarChart3,
  Computer,
  ChevronDown,
  ChevronRight,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "หน้าแรก",
    icon: Home,
    href: "/",
  },
  {
    title: "จัดการครุภัณฑ์",
    icon: Computer,
    href: "/assets",
  },
  {
    title: "ประเภทครุภัณฑ์", 
    icon: Package,
    href: "/asset-categories",
  },
  {
    title: "ซ่อมบำรุง",
    icon: Wrench,
    href: "/maintenance",
  },
  {
    title: "คู่ค้าหน่าย",
    icon: Settings,
    href: "/vendors",
  },
  {
    title: "รายงาน",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "ผู้ใช้งาน",
    icon: Users,
    href: "/users",
  },
  {
    title: "ตั้งค่าระบบ", 
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "bg-card border-r min-h-screen flex flex-col",
      isMobile ? "w-80" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Computer className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">IT Asset</span>
        </div>
        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="sm:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => isMobile && onClose?.()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary border-l-4 border-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}