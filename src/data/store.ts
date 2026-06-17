import { create } from "zustand";
import * as seed from "./seed";

export type {
  Customer,
  Product,
  InventoryRow,
  Vendor,
  PurchaseOrder,
  ProductionOrder,
  QualityReport,
  SalesLead,
  Quotation,
  Project,
  Task,
  Employee,
  Machine,
  MaintenanceLog,
  Notification,
  ActivityLog,
  User,
} from "./seed";

interface DataState {
  customers: seed.Customer[];
  products: seed.Product[];
  inventory: seed.InventoryRow[];
  vendors: seed.Vendor[];
  purchaseOrders: seed.PurchaseOrder[];
  productionOrders: seed.ProductionOrder[];
  qualityReports: seed.QualityReport[];
  salesLeads: seed.SalesLead[];
  quotations: seed.Quotation[];
  projects: seed.Project[];
  tasks: seed.Task[];
  employees: seed.Employee[];
  machines: seed.Machine[];
  maintenanceLogs: seed.MaintenanceLog[];
  notifications: seed.Notification[];
  activityLogs: seed.ActivityLog[];
  users: seed.User[];

  addCustomer: (c: Partial<seed.Customer>) => void;
  updateCustomer: (id: number, patch: Partial<seed.Customer>) => void;
  addSalesLead: (l: Partial<seed.SalesLead>) => void;
  updateLeadStage: (id: number, stage: string, probability?: number) => void;
  addQuotation: (q: Partial<seed.Quotation>) => void;
  updateQuotationStatus: (id: number, status: string) => void;
  addProject: (p: Partial<seed.Project>) => void;
  updateProject: (id: number, patch: Partial<seed.Project>) => void;
  addProductionOrder: (p: Partial<seed.ProductionOrder>) => void;
  addQualityReport: (q: Partial<seed.QualityReport>) => void;
  updateQualityStatus: (id: number, status: string) => void;
  addTask: (t: Partial<seed.Task>) => void;
  updateTaskStatus: (id: number, status: string) => void;
  updateProductionStatus: (id: number, status: string) => void;
  updateMachineStatus: (id: number, status: string) => void;
  updatePurchaseStatus: (id: number, status: string) => void;
  markNotificationRead: (id: number) => void;
}

let nextId = 100000;
const genId = () => ++nextId;

export const useDataStore = create<DataState>((set) => ({
  customers: seed.customers,
  products: seed.products,
  inventory: seed.inventory,
  vendors: seed.vendors,
  purchaseOrders: seed.purchaseOrders,
  productionOrders: seed.productionOrders,
  qualityReports: seed.qualityReports,
  salesLeads: seed.salesLeads,
  quotations: seed.quotations,
  projects: seed.projects,
  tasks: seed.tasks,
  employees: seed.employees,
  machines: seed.machines,
  maintenanceLogs: seed.maintenanceLogs,
  notifications: seed.notifications,
  activityLogs: seed.activityLogs,
  users: seed.users,

  addCustomer: (c) =>
    set((s) => ({
      customers: [
        {
          id: genId(),
          name: c.name || "New Customer",
          email: c.email || "",
          phone: c.phone || "",
          company: c.company || c.name || "",
          industry: c.industry || "General",
          address: c.address || "",
          status: c.status || "LEAD",
          createdAt: new Date(),
        },
        ...s.customers,
      ],
    })),

  addSalesLead: (l) =>
    set((s) => ({
      salesLeads: [
        {
          id: genId(),
          customerId: l.customerId || 1,
          title: l.title || "New Lead",
          value: l.value || "0.00",
          stage: l.stage || "NEW",
          probability: l.probability ?? 10,
          expectedCloseDate: l.expectedCloseDate || null,
          source: l.source || "Manual",
        },
        ...s.salesLeads,
      ],
    })),

  updateCustomer: (id, patch) =>
    set((s) => ({
      customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  updateLeadStage: (id, stage, probability) =>
    set((s) => ({
      salesLeads: s.salesLeads.map((l) =>
        l.id === id ? { ...l, stage, probability: probability ?? l.probability } : l,
      ),
    })),

  addQuotation: (q) =>
    set((s) => {
      const n = s.quotations.length + 1;
      return {
        quotations: [
          {
            id: genId(),
            quoteNumber: q.quoteNumber || `QT-2026-${String(n).padStart(3, "0")}`,
            customerId: q.customerId || 1,
            status: q.status || "DRAFT",
            total: q.total || "0.00",
            validUntil: q.validUntil ?? null,
          },
          ...s.quotations,
        ],
      };
    }),

  updateQuotationStatus: (id, status) =>
    set((s) => ({
      quotations: s.quotations.map((q) => (q.id === id ? { ...q, status } : q)),
    })),

  addProject: (p) =>
    set((s) => {
      const n = s.projects.length + 1;
      return {
        projects: [
          {
            id: genId(),
            projectNumber: p.projectNumber || `PRJ-2026-${String(n).padStart(3, "0")}`,
            name: p.name || "New Project",
            customerId: p.customerId || 1,
            status: p.status || "PLANNING",
            startDate: p.startDate ?? new Date(),
            endDate: p.endDate ?? null,
            budget: p.budget || "0.00",
            actualCost: p.actualCost || "0.00",
            progress: p.progress ?? 0,
          },
          ...s.projects,
        ],
      };
    }),

  updateProject: (id, patch) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  addProductionOrder: (p) =>
    set((s) => {
      const n = s.productionOrders.length + 1;
      return {
        productionOrders: [
          {
            id: genId(),
            orderNumber: p.orderNumber || `WO-2026-${String(n).padStart(3, "0")}`,
            productId: p.productId || 1,
            quantity: p.quantity ?? 1,
            status: p.status || "PLANNED",
            priority: p.priority || "NORMAL",
            workCenter: p.workCenter || "FAB-01",
            scheduledEnd: p.scheduledEnd ?? null,
            progress: p.progress ?? 0,
          },
          ...s.productionOrders,
        ],
      };
    }),

  addQualityReport: (q) =>
    set((s) => {
      const n = s.qualityReports.length + 1;
      return {
        qualityReports: [
          {
            id: genId(),
            reportNumber: q.reportNumber || `QR-2026-${String(n).padStart(3, "0")}`,
            productId: q.productId || 1,
            inspectionType: q.inspectionType || "IN_PROCESS",
            status: q.status || "PENDING",
            defectCount: q.defectCount ?? 0,
            defectDescription: q.defectDescription || "",
            inspectionDate: q.inspectionDate ?? new Date(),
          },
          ...s.qualityReports,
        ],
      };
    }),

  updateQualityStatus: (id, status) =>
    set((s) => ({
      qualityReports: s.qualityReports.map((q) => (q.id === id ? { ...q, status } : q)),
    })),

  addTask: (t) =>
    set((s) => ({
      tasks: [
        {
          id: genId(),
          projectId: t.projectId || 1,
          title: t.title || "New Task",
          status: t.status || "TODO",
          priority: t.priority || "NORMAL",
          assignedTo: t.assignedTo || 1,
          dueDate: t.dueDate ?? null,
        },
        ...s.tasks,
      ],
    })),

  updateTaskStatus: (id, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  updateProductionStatus: (id, status) =>
    set((s) => ({
      productionOrders: s.productionOrders.map((p) =>
        p.id === id ? { ...p, status } : p,
      ),
    })),

  updateMachineStatus: (id, status) =>
    set((s) => ({
      machines: s.machines.map((m) => (m.id === id ? { ...m, status } : m)),
    })),

  updatePurchaseStatus: (id, status) =>
    set((s) => ({
      purchaseOrders: s.purchaseOrders.map((p) => (p.id === id ? { ...p, status } : p)),
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),
}));

// ─── Relation helpers ──────────────────────────────────────────────
export function productName(state: DataState, productId: number): string {
  return state.products.find((p) => p.id === productId)?.name ?? `#${productId}`;
}
export function customerName(state: DataState, customerId: number): string {
  return state.customers.find((c) => c.id === customerId)?.name ?? `#${customerId}`;
}
export function vendorName(state: DataState, vendorId: number): string {
  return state.vendors.find((v) => v.id === vendorId)?.name ?? `#${vendorId}`;
}
export function machineName(state: DataState, machineId: number): string {
  return state.machines.find((m) => m.id === machineId)?.name ?? `#${machineId}`;
}
export function employeeName(state: DataState, userId: number): string {
  return (
    state.employees.find((e) => e.id === userId)?.name ??
    state.users.find((u) => u.id === userId)?.name ??
    `#${userId}`
  );
}
export function projectName(state: DataState, projectId: number): string {
  return state.projects.find((p) => p.id === projectId)?.name ?? `#${projectId}`;
}
