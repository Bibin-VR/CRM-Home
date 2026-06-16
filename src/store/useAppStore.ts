import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "CEO"
  | "ADMIN"
  | "PURCHASE"
  | "PRODUCTION"
  | "ELECTRICAL"
  | "QUALITY"
  | "MECHANICAL"
  | "DESIGN"
  | "SALES"
  | "COASTING"
  | "PROJECT_ENGINEER"
  | "PLANT_HEAD";

interface AppState {
  selectedRole: UserRole;
  setRole: (role: UserRole) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedRole: "CEO",
      setRole: (role) => set({ selectedRole: role }),
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: "irongrid-app-store" },
  ),
);

export const ROLE_LABELS: Record<UserRole, string> = {
  CEO: "Chief Executive Officer",
  ADMIN: "Admin / HR",
  PURCHASE: "Purchase",
  PRODUCTION: "Production",
  ELECTRICAL: "Electrical & Automation",
  QUALITY: "Quality",
  MECHANICAL: "Mechanical",
  DESIGN: "Design",
  SALES: "Sales",
  COASTING: "Costing",
  PROJECT_ENGINEER: "Project Engineer",
  PLANT_HEAD: "Plant Head",
};

export interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", roles: ["CEO", "ADMIN", "PURCHASE", "PRODUCTION", "ELECTRICAL", "QUALITY", "MECHANICAL", "DESIGN", "SALES", "COASTING", "PROJECT_ENGINEER", "PLANT_HEAD"] },
  { label: "Customers", path: "/customers", icon: "Users", roles: ["CEO", "ADMIN", "SALES", "COASTING", "PLANT_HEAD"] },
  { label: "Sales Leads", path: "/sales-leads", icon: "TrendingUp", roles: ["CEO", "SALES", "PLANT_HEAD"] },
  { label: "Quotations", path: "/quotations", icon: "FileText", roles: ["CEO", "SALES", "COASTING", "PLANT_HEAD"] },
  { label: "Products", path: "/products", icon: "Package", roles: ["CEO", "PURCHASE", "PRODUCTION", "COASTING", "DESIGN", "PLANT_HEAD"] },
  { label: "Inventory", path: "/inventory", icon: "Warehouse", roles: ["CEO", "PURCHASE", "PRODUCTION", "QUALITY", "PLANT_HEAD"] },
  { label: "Purchase Orders", path: "/purchase-orders", icon: "ShoppingCart", roles: ["CEO", "PURCHASE", "ADMIN", "PLANT_HEAD"] },
  { label: "Vendors", path: "/vendors", icon: "Truck", roles: ["CEO", "PURCHASE", "ADMIN", "PLANT_HEAD"] },
  { label: "Production Orders", path: "/production-orders", icon: "Factory", roles: ["CEO", "PRODUCTION", "PLANT_HEAD", "QUALITY", "MECHANICAL"] },
  { label: "Quality Reports", path: "/quality-reports", icon: "ShieldCheck", roles: ["CEO", "QUALITY", "PRODUCTION", "PLANT_HEAD"] },
  { label: "Machines", path: "/machines", icon: "Cog", roles: ["CEO", "MECHANICAL", "ELECTRICAL", "PRODUCTION", "PLANT_HEAD"] },
  { label: "Maintenance", path: "/maintenance", icon: "Wrench", roles: ["CEO", "MECHANICAL", "ELECTRICAL", "PLANT_HEAD"] },
  { label: "Projects", path: "/projects", icon: "FolderKanban", roles: ["CEO", "PROJECT_ENGINEER", "DESIGN", "PLANT_HEAD"] },
  { label: "Tasks", path: "/tasks", icon: "CheckSquare", roles: ["CEO", "PROJECT_ENGINEER", "DESIGN", "PRODUCTION", "PLANT_HEAD"] },
  { label: "Employees", path: "/employees", icon: "UserCog", roles: ["CEO", "ADMIN", "PLANT_HEAD"] },
];
