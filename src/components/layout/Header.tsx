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
      className={`fixed top-0 right-0 h-16 bg-[#FBFAF7] border-b-2 border-[#0B0B0B] z-40 flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarOpen ? "left-64" : "left-16"
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-[#0B0B0B] font-bold text-lg uppercase tracking-wider font-mono-data">
          IRONGRID // CONTROL
        </h1>
      </div>

      <div className="flex items-center gap-4">
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
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#FBFAF7] border-2 border-[#0B0B0B] shadow-[6px_6px_0px_0px_#0B0B0B] z-50">
              <div className="px-3 py-2 border-b-2 border-[#DAD7CE]">
                <span className="text-[10px] uppercase tracking-widest text-[#8C8A80] font-mono-data">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs uppercase font-mono-data tracking-wider transition-all ${
                      selectedRole === role
                        ? "bg-[#E61919] text-white font-bold"
                        : "text-[#6B6A63] hover:bg-[#FDEBEB] hover:text-[#0B0B0B]"
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
        <button type="button" title="Notifications" className="relative text-[#6B6A63] hover:text-[#E61919] transition-colors">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E61919] text-white text-[9px] font-bold flex items-center justify-center">
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
            className="flex items-center gap-2 text-[#6B6A63] hover:text-[#0B0B0B] transition-colors"
          >
            <div className="hidden md:block text-right">
              <div className="text-xs font-bold font-mono-data text-[#0B0B0B] leading-tight">{profile.name}</div>
              <div className="text-[9px] uppercase tracking-wider text-[#8C8A80] font-mono-data">{ROLE_LABELS[selectedRole]}</div>
            </div>
            <div className="w-8 h-8 bg-[#E61919] border-2 border-[#0B0B0B] flex items-center justify-center text-white font-bold text-xs font-mono-data">
              {profile.initials}
            </div>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#FBFAF7] border-2 border-[#0B0B0B] shadow-[6px_6px_0px_0px_#0B0B0B] z-50">
              <div className="px-3 py-3 border-b-2 border-[#DAD7CE]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#E61919] border-2 border-[#0B0B0B] flex items-center justify-center text-white font-bold text-xs font-mono-data">
                    {profile.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-mono-data text-[#0B0B0B] truncate">{profile.name}</div>
                    <div className="text-[10px] text-[#8C8A80] font-mono-data truncate">{profile.email}</div>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#8C8A80] font-mono-data">
                {ROLE_LABELS[selectedRole]} • {profile.department}
              </div>
              <button
                type="button"
                onClick={() => { setShowUserMenu(false); navigate("/calendar"); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#6B6A63] hover:bg-[#FDEBEB] hover:text-[#0B0B0B] uppercase font-mono-data tracking-wider transition-all"
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
