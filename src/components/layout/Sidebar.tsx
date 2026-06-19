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
  CalendarDays,
  FileBarChart,
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
  CalendarDays,
  FileBarChart,
};

export default function Sidebar() {
  const location = useLocation();
  const { selectedRole, sidebarOpen, toggleSidebar } = useAppStore();

  const filteredMenu = MENU_ITEMS.filter((item) =>
    item.roles.includes(selectedRole),
  );

  return (
    <aside
      className={`glass-strong fixed left-3 top-3 bottom-3 rounded-[28px] transition-all duration-300 z-50 overflow-hidden ${
        sidebarOpen ? "w-60" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-black/5">
        {sidebarOpen && (
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAB308] flex items-center justify-center shadow-[0_4px_12px_-4px_rgba(234,179,8,0.6)]">
              <span className="text-[#1F1F22] font-bold text-base font-display">IG</span>
            </div>
            <span className="text-[#1F1F22] font-semibold text-base tracking-tight font-display">
              IronGrid
            </span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="text-[#6B6B72] hover:text-[#1F1F22] transition-colors rounded-full p-1 hover:bg-white/60"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="px-4 py-3 border-b border-black/5">
          <div className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-mono-data mb-1">
            Current Role
          </div>
          <div className="text-xs font-bold text-[#C28A00] uppercase tracking-wider font-mono-data">
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
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-black/5">
          <div className="text-[9px] text-[#9CA3AF] font-mono-data uppercase tracking-widest">
            v2.4.1 // Industrial CRM
          </div>
        </div>
      )}
    </aside>
  );
}
