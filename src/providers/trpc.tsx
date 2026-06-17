/**
 * Client-side replacement for the tRPC client.
 *
 * The app deploys to a static host (GitHub Pages) with no backend. This module
 * exposes the exact `trpc.*` surface the pages already use, but backed by the
 * in-memory Zustand data store so every screen works offline and all roles share
 * one source of truth. Existing pages need no changes.
 */
import { type ReactNode, useMemo } from "react";
import { useDataStore, machineName } from "@/data/store";
import { useAppStore } from "@/store/useAppStore";

type QueryResult<T> = {
  data: T;
  isLoading: false;
  isFetching: false;
  isError: false;
  error: null;
  refetch: () => Promise<{ data: T }>;
};

function result<T>(data: T): QueryResult<T> {
  return {
    data,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: async () => ({ data }),
  };
}

type ListInput = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
  lowStock?: boolean;
} | undefined;

function paginate<T>(rows: T[], input: ListInput) {
  const page = input?.page ?? 1;
  const limit = input?.limit;
  const total = rows.length;
  const items = limit ? rows.slice((page - 1) * limit, page * limit) : rows;
  return result({ items, total });
}

function makeMutation<I>(action: (input: I) => void) {
  return (opts?: { onSuccess?: () => void; onError?: () => void }) => ({
    mutate: (input: I) => {
      try {
        action(input);
        opts?.onSuccess?.();
      } catch {
        opts?.onError?.();
      }
    },
    mutateAsync: async (input: I) => {
      action(input);
      opts?.onSuccess?.();
    },
    isPending: false,
    isLoading: false,
    isError: false,
    error: null,
  });
}

// A proxy that resolves any nested `.invalidate()` / `.refetch()` to a no-op,
// because the Zustand store updates are already reactive.
const noop = () => Promise.resolve();
const utilsProxy: any = new Proxy(
  {},
  {
    get: (_t, prop) => {
      if (prop === "invalidate" || prop === "refetch" || prop === "reset") return noop;
      return utilsProxy;
    },
  },
);

export const trpc = {
  useUtils: () => utilsProxy,

  auth: {
    me: {
      useQuery: (_input?: unknown, _opts?: unknown) => {
        const role = useAppStore((s) => s.selectedRole);
        const users = useDataStore((s) => s.users);
        const user = useMemo(
          () => users.find((u) => u.role === role) ?? users[0],
          [users, role],
        );
        return result(user);
      },
    },
    logout: {
      useMutation: makeMutation<void>(() => {}),
    },
  },

  dashboard: {
    kpis: {
      useQuery: (_input?: { role?: string }) => {
        const s = useDataStore();
        const kpis = useMemo(() => {
          const num = (v: string | null) => Number(v || 0);
          return {
            totalRevenue: s.salesLeads
              .filter((l) => l.stage === "CLOSED_WON")
              .reduce((a, l) => a + num(l.value), 0)
              .toString(),
            activeWorkOrders: s.productionOrders.filter((p) => p.status === "IN_PROGRESS").length,
            pendingPOs: s.purchaseOrders.filter((p) => p.status === "PENDING").length,
            employeeCount: s.employees.length,
            qcPending: s.qualityReports.filter((q) => q.status === "PENDING").length,
            machineBreakdown: s.machines.filter((m) => m.status === "BREAKDOWN").length,
            pipelineValue: s.salesLeads
              .filter((l) => l.stage !== "CLOSED_WON" && l.stage !== "CLOSED_LOST")
              .reduce((a, l) => a + num(l.value), 0)
              .toString(),
            lowStockItems: s.inventory.filter((i) => i.quantityAvailable < 20).length,
            totalProjects: s.projects.length,
            overdueMaintenance: s.machines.filter(
              (m) => m.nextMaintenanceAt && m.nextMaintenanceAt < new Date() && m.status !== "MAINTENANCE",
            ).length,
          };
        }, [s]);
        return result(kpis);
      },
    },
    recentActivity: {
      useQuery: () => {
        const logs = useDataStore((s) => s.activityLogs);
        return result(logs);
      },
    },
  },

  crm: {
    customers: {
      list: {
        useQuery: (input?: ListInput) => {
          const rows = useDataStore((s) => s.customers);
          const filtered = useMemo(() => {
            let r = rows;
            if (input?.status) r = r.filter((c) => c.status === input.status);
            if (input?.search) {
              const q = input.search.toLowerCase();
              r = r.filter(
                (c) =>
                  c.name.toLowerCase().includes(q) ||
                  c.company.toLowerCase().includes(q) ||
                  c.email.toLowerCase().includes(q),
              );
            }
            return r;
          }, [rows, input?.status, input?.search]);
          return paginate(filtered, input);
        },
      },
      create: { useMutation: makeMutation<any>((input) => useDataStore.getState().addCustomer(input)) },
    },

    products: {
      list: {
        useQuery: (input?: ListInput) => {
          const rows = useDataStore((s) => s.products);
          return paginate(rows, input);
        },
      },
    },

    inventory: {
      list: {
        useQuery: (input?: ListInput) => {
          const inv = useDataStore((s) => s.inventory);
          const products = useDataStore((s) => s.products);
          const rows = useMemo(() => {
            let r = inv.map((i) => ({
              inventory: i,
              product: products.find((p) => p.id === i.productId) ?? null,
            }));
            if (input?.lowStock) r = r.filter((x) => x.inventory.quantityAvailable < 20);
            return r;
          }, [inv, products, input?.lowStock]);
          return paginate(rows, input);
        },
      },
    },

    vendors: {
      list: {
        useQuery: (input?: ListInput) => {
          const rows = useDataStore((s) => s.vendors);
          return paginate(rows, input);
        },
      },
    },

    purchaseOrders: {
      list: {
        useQuery: (input?: ListInput) => {
          const pos = useDataStore((s) => s.purchaseOrders);
          const vendors = useDataStore((s) => s.vendors);
          const rows = useMemo(() => {
            let r = pos.map((po) => ({
              purchaseOrder: po,
              vendor: vendors.find((v) => v.id === po.vendorId) ?? null,
            }));
            if (input?.status) r = r.filter((x) => x.purchaseOrder.status === input.status);
            return r;
          }, [pos, vendors, input?.status]);
          return paginate(rows, input);
        },
      },
    },

    productionOrders: {
      list: {
        useQuery: (input?: ListInput) => {
          const orders = useDataStore((s) => s.productionOrders);
          const products = useDataStore((s) => s.products);
          const rows = useMemo(() => {
            let r = orders.map((po) => ({
              productionOrder: po,
              product: products.find((p) => p.id === po.productId) ?? null,
            }));
            if (input?.status) r = r.filter((x) => x.productionOrder.status === input.status);
            return r;
          }, [orders, products, input?.status]);
          return paginate(rows, input);
        },
      },
    },

    qualityReports: {
      list: {
        useQuery: (input?: ListInput) => {
          const reports = useDataStore((s) => s.qualityReports);
          const products = useDataStore((s) => s.products);
          const rows = useMemo(
            () =>
              reports.map((qr) => ({
                qualityReport: qr,
                product: products.find((p) => p.id === qr.productId) ?? null,
              })),
            [reports, products],
          );
          return paginate(rows, input);
        },
      },
    },

    salesLeads: {
      list: {
        useQuery: (input?: ListInput) => {
          const leads = useDataStore((s) => s.salesLeads);
          const customers = useDataStore((s) => s.customers);
          const rows = useMemo(
            () =>
              leads.map((l) => ({
                salesLead: l,
                customer: customers.find((c) => c.id === l.customerId) ?? null,
              })),
            [leads, customers],
          );
          return paginate(rows, input);
        },
      },
    },

    quotations: {
      list: {
        useQuery: (input?: ListInput) => {
          const quotes = useDataStore((s) => s.quotations);
          const customers = useDataStore((s) => s.customers);
          const rows = useMemo(
            () =>
              quotes.map((q) => ({
                quotation: q,
                customer: customers.find((c) => c.id === q.customerId) ?? null,
              })),
            [quotes, customers],
          );
          return paginate(rows, input);
        },
      },
    },

    projects: {
      list: {
        useQuery: (input?: ListInput) => {
          const projects = useDataStore((s) => s.projects);
          const customers = useDataStore((s) => s.customers);
          const rows = useMemo(
            () =>
              projects.map((p) => ({
                project: p,
                customer: customers.find((c) => c.id === p.customerId) ?? null,
              })),
            [projects, customers],
          );
          return paginate(rows, input);
        },
      },
    },

    tasks: {
      list: {
        useQuery: (input?: ListInput) => {
          const tasks = useDataStore((s) => s.tasks);
          const projects = useDataStore((s) => s.projects);
          const rows = useMemo(
            () =>
              tasks.map((t) => ({
                ...t,
                description: `${t.title} — ${projects.find((p) => p.id === t.projectId)?.name ?? "Project"}`,
              })),
            [tasks, projects],
          );
          return paginate(rows, input);
        },
      },
    },

    employees: {
      list: {
        useQuery: (input?: ListInput) => {
          const emps = useDataStore((s) => s.employees);
          const filtered = useMemo(() => {
            let r = emps.map((e) => ({ ...e, joiningDate: null as Date | null }));
            if (input?.department) r = r.filter((e) => e.department === input.department);
            return r;
          }, [emps, input?.department]);
          return paginate(filtered, input);
        },
      },
    },

    machines: {
      list: {
        useQuery: (input?: ListInput) => {
          const rows = useDataStore((s) => s.machines);
          return paginate(rows, input);
        },
      },
      maintenanceLogs: {
        useQuery: (input?: { machineId?: number }, _opts?: { enabled?: boolean }) => {
          const s = useDataStore();
          const logs = useMemo(() => {
            const all = s.maintenanceLogs.map((l) => ({
              ...l,
              machineName: machineName(s, l.machineId),
            }));
            if (input?.machineId && input.machineId !== 0) {
              return all.filter((l) => l.machineId === input.machineId);
            }
            return all;
          }, [s, input?.machineId]);
          return result(logs);
        },
      },
    },
  },
};

// Keep the same provider name main.tsx imports; now a simple passthrough.
export function TRPCProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
