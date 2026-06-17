import { useAppStore, type UserRole } from "@/store/useAppStore";

/**
 * Role-based access control.
 *
 * CEO, ADMIN and PLANT_HEAD are "elevated" — they can create/edit everything.
 * Department roles get write access to their own domain; everyone can still
 * read every screen (data stays integrated across the org).
 */
export type Entity =
  | "customers"
  | "salesLeads"
  | "quotations"
  | "projects"
  | "tasks"
  | "productionOrders"
  | "qualityReports"
  | "purchaseOrders"
  | "vendors"
  | "inventory"
  | "machines"
  | "maintenance"
  | "employees"
  | "products"
  | "reports";

export const ELEVATED: UserRole[] = ["CEO", "ADMIN", "PLANT_HEAD"];

const DOMAIN: Record<Entity, UserRole[]> = {
  customers: ["SALES"],
  salesLeads: ["SALES", "COASTING"],
  quotations: ["COASTING", "SALES"],
  projects: ["PROJECT_ENGINEER", "DESIGN"],
  tasks: ["PROJECT_ENGINEER", "DESIGN", "PRODUCTION", "ELECTRICAL", "MECHANICAL", "QUALITY"],
  productionOrders: ["PRODUCTION", "PROJECT_ENGINEER"],
  qualityReports: ["QUALITY", "PRODUCTION"],
  purchaseOrders: ["PURCHASE"],
  vendors: ["PURCHASE"],
  inventory: ["PURCHASE", "PRODUCTION"],
  machines: ["MECHANICAL", "ELECTRICAL"],
  maintenance: ["MECHANICAL", "ELECTRICAL"],
  employees: [],
  products: ["DESIGN", "COASTING"],
  reports: ["COASTING"],
};

/** Can this role create/edit/update the given entity? */
export function canManage(role: UserRole, entity: Entity): boolean {
  if (ELEVATED.includes(role)) return true;
  return DOMAIN[entity].includes(role);
}

/** Highest-authority roles see an "authority" badge and org-wide controls. */
export function isElevated(role: UserRole): boolean {
  return ELEVATED.includes(role);
}

/** Hook: returns whether the current role can manage an entity. */
export function useCan(entity: Entity): boolean {
  const role = useAppStore((s) => s.selectedRole);
  return canManage(role, entity);
}
