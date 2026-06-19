import { useAppStore, ROLE_LABELS, type UserRole } from "@/store/useAppStore";
import { useNavigate } from "react-router";
import { getProfile } from "@/data/profile";
import { useDataStore } from "@/data/store";
import {
  Bell,
  User,
  Shield,
  Crown,
  ShoppingCart,
  Factory,
  Zap,
  Award,
  WrenchIcon,
  Palette,
  TrendingUp,
  Calculator,
  FolderKanban,
  Building,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  CEO: Crown,
  ADMIN: Shield,
  PURCHASE: ShoppingCart,
  PRODUCTION: Factory,
  ELECTRICAL: Zap,
  QUALITY: Award,
  MECHANICAL: WrenchIcon,
  DESIGN: Palette,
  SALES: TrendingUp,
  COASTING: Calculator,
  PROJECT_ENGINEER: FolderKanban,
  PLANT_HEAD: Building,
};

export default function Header() {
  const { selectedRole, setRole, sidebarOpen } = useAppStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const roles = Object.keys(ROLE_LABELS) as UserRole[];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CurrentRoleIcon = roleIcons[selectedRole];
  const profile = getProfile(selectedRole);
  const unread = useDataStore((s) => s.notifications.filter((n) => !n.isRead).length);

  return (
    <header
      className={`glass-strong fixed top-3 right-3 h-14 rounded-full z-40 flex items-center justify-between pl-6 pr-3 transition-all duration-300 ${
        sidebarOpen ? "left-64" : "left-20"
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-[#1F1F22] font-semibold text-base tracking-tight font-display">
          Control Center
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="brutalist-btn flex items-center gap-2 text-xs"
          >
            <CurrentRoleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{ROLE_LABELS[selectedRole]}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showRoleMenu && (
            <div className="glass-strong absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-black/5">
                <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-mono-data">
                  Switch Role
                </span>
              </div>
              {roles.map((role) => {
                const Icon = roleIcons[role];
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setRole(role);
                      setShowRoleMenu(false);
                      navigate("/dashboard");
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs font-medium transition-all ${
                      selectedRole === role
                        ? "bg-[#EAB308] text-[#1F1F22] font-semibold"
                        : "text-[#6B6B72] hover:bg-white/60 hover:text-[#1F1F22]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {ROLE_LABELS[role]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button type="button" title="Notifications" className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/60 text-[#6B6B72] hover:text-[#1F1F22] hover:bg-white transition-colors">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-0 right-0 min-w-[16px] h-4 px-1 rounded-full bg-[#EAB308] text-[#1F1F22] text-[9px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            title={profile.name}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-[#6B6B72] hover:text-[#1F1F22] transition-colors"
          >
            <div className="hidden md:block text-right">
              <div className="text-xs font-bold font-mono-data text-[#1F1F22] leading-tight">{profile.name}</div>
              <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-mono-data">{ROLE_LABELS[selectedRole]}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#EAB308] flex items-center justify-center text-[#1F1F22] font-bold text-xs font-display shadow-[0_4px_12px_-4px_rgba(234,179,8,0.6)]">
              {profile.initials}
            </div>
          </button>
          {showUserMenu && (
            <div className="glass-strong absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50">
              <div className="px-3 py-3 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#EAB308] flex items-center justify-center text-[#1F1F22] font-bold text-xs font-display">
                    {profile.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-mono-data text-[#1F1F22] truncate">{profile.name}</div>
                    <div className="text-[10px] text-[#9CA3AF] font-mono-data truncate">{profile.email}</div>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#9CA3AF] font-mono-data">
                {ROLE_LABELS[selectedRole]} • {profile.department}
              </div>
              <button
                type="button"
                onClick={() => { setShowUserMenu(false); navigate("/calendar"); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#6B6B72] hover:bg-[#FBF3D5] hover:text-[#1F1F22] uppercase font-mono-data tracking-wider transition-all"
              >
                <User className="w-4 h-4" />
                My Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
