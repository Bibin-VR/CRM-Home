import { useAppStore, ROLE_LABELS, type UserRole } from "@/store/useAppStore";
import { Link, useNavigate } from "react-router";
import {
  Bell,
  LogOut,
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

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b-2 border-[#1A1A1A] z-40 flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarOpen ? "left-64" : "left-16"
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-[#1A1A1A] font-bold text-lg uppercase tracking-wider font-mono-data">
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
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] z-50">
              <div className="px-3 py-2 border-b-2 border-[#E5E5E5]">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs uppercase font-mono-data tracking-wider transition-all ${
                      selectedRole === role
                        ? "bg-[#EF4444] text-white font-bold"
                        : "text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#1A1A1A]"
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
        <button className="relative text-[#6B7280] hover:text-[#EF4444] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            <div className="w-8 h-8 bg-[#EF4444] border-2 border-[#1A1A1A] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] z-50">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#1A1A1A] uppercase font-mono-data tracking-wider transition-all"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#6B7280] hover:bg-[#EF4444] hover:text-white uppercase font-mono-data tracking-wider transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
