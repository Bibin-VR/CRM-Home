import { Link, useLocation } from "react-router";
import { useAppStore, MENU_ITEMS, ROLE_LABELS } from "@/store/useAppStore";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  Factory,
  ShieldCheck,
  Cog,
  Wrench,
  FolderKanban,
  CheckSquare,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  Factory,
  ShieldCheck,
  Cog,
  Wrench,
  FolderKanban,
  CheckSquare,
  UserCog,
};

export default function Sidebar() {
  const location = useLocation();
  const { selectedRole, sidebarOpen, toggleSidebar } = useAppStore();

  const filteredMenu = MENU_ITEMS.filter((item) =>
    item.roles.includes(selectedRole),
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r-2 border-[#1A1A1A] transition-all duration-300 z-50 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b-2 border-[#E5E5E5]">
        {sidebarOpen && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EF4444] flex items-center justify-center">
              <span className="text-white font-bold text-lg font-mono-data">IG</span>
            </div>
            <span className="text-[#1A1A1A] font-bold text-sm uppercase tracking-wider">
              IRONGRID
            </span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="text-[#6B7280] hover:text-[#EF4444] transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="px-4 py-3 border-b-2 border-[#E5E5E5]">
          <div className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-mono-data mb-1">
            Current Role
          </div>
          <div className="text-xs font-bold text-[#EF4444] uppercase tracking-wider font-mono-data">
            {ROLE_LABELS[selectedRole]}
          </div>
        </div>
      )}

      <nav className="py-2 overflow-y-auto h-[calc(100%-140px)] brutalist-scroll">
        {filteredMenu.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`brutalist-sidebar-item flex items-center gap-3 ${
                isActive ? "active" : ""
              } ${!sidebarOpen ? "justify-center px-2" : ""}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {sidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t-2 border-[#E5E5E5]">
          <div className="text-[9px] text-[#9CA3AF] font-mono-data uppercase tracking-widest">
            v2.4.1 // Industrial CRM
          </div>
        </div>
      )}
    </aside>
  );
}
