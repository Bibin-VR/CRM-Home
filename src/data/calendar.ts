import { useMemo } from "react";
import { useDataStore } from "@/data/store";

export type EventCategory =
  | "task"
  | "project"
  | "po"
  | "maintenance"
  | "quotation"
  | "sales"
  | "production";

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  ref: string;
  category: EventCategory;
  /** True when the deadline is in the past and the item is not finished. */
  overdue: boolean;
  done: boolean;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  task: "Task",
  project: "Project",
  po: "Purchase Order",
  maintenance: "Maintenance",
  quotation: "Quotation",
  sales: "Sales Lead",
  production: "Production",
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  task: "#E61919",
  project: "#7C3AED",
  po: "#0EA5E9",
  maintenance: "#F59E0B",
  quotation: "#10B981",
  sales: "#EC4899",
  production: "#0B0B0B",
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Build the full list of dated events from every relevant entity in the store. */
export function useCalendarEvents(filterFocus?: string[]): CalendarEvent[] {
  const s = useDataStore();
  return useMemo(() => {
    const today = startOfToday();
    const events: CalendarEvent[] = [];

    for (const t of s.tasks) {
      if (!t.dueDate) continue;
      const done = t.status === "DONE";
      events.push({
        id: `task-${t.id}`,
        date: t.dueDate,
        title: t.title,
        ref: t.priority,
        category: "task",
        done,
        overdue: !done && t.dueDate < today,
      });
    }

    for (const p of s.projects) {
      if (!p.endDate) continue;
      const done = p.status === "COMPLETED";
      events.push({
        id: `project-${p.id}`,
        date: p.endDate,
        title: `${p.name} — target completion`,
        ref: p.projectNumber,
        category: "project",
        done,
        overdue: !done && p.endDate < today,
      });
    }

    for (const po of s.purchaseOrders) {
      if (!po.expectedDeliveryAt) continue;
      const done = po.status === "RECEIVED" || po.status === "CANCELLED";
      events.push({
        id: `po-${po.id}`,
        date: po.expectedDeliveryAt,
        title: `${po.poNumber} expected delivery`,
        ref: po.status,
        category: "po",
        done,
        overdue: !done && po.expectedDeliveryAt < today,
      });
    }

    for (const m of s.maintenanceLogs) {
      const done = m.status === "COMPLETED" || m.status === "CANCELLED";
      const date = m.startTime;
      events.push({
        id: `maint-${m.id}`,
        date,
        title: m.description,
        ref: m.maintenanceType,
        category: "maintenance",
        done,
        overdue: !done && date < today,
      });
    }

    for (const m of s.machines) {
      if (!m.nextMaintenanceAt) continue;
      const overdue = m.nextMaintenanceAt < today && m.status !== "MAINTENANCE";
      events.push({
        id: `machine-${m.id}`,
        date: m.nextMaintenanceAt,
        title: `${m.name} scheduled maintenance`,
        ref: m.machineCode,
        category: "maintenance",
        done: false,
        overdue,
      });
    }

    for (const q of s.quotations) {
      if (!q.validUntil) continue;
      const done = q.status === "ACCEPTED" || q.status === "REJECTED";
      events.push({
        id: `quote-${q.id}`,
        date: q.validUntil,
        title: `${q.quoteNumber} valid until`,
        ref: q.status,
        category: "quotation",
        done,
        overdue: !done && q.validUntil < today,
      });
    }

    for (const l of s.salesLeads) {
      if (!l.expectedCloseDate) continue;
      const done = l.stage === "CLOSED_WON" || l.stage === "CLOSED_LOST";
      events.push({
        id: `lead-${l.id}`,
        date: l.expectedCloseDate,
        title: `${l.title} — expected close`,
        ref: l.stage,
        category: "sales",
        done,
        overdue: !done && l.expectedCloseDate < today,
      });
    }

    for (const po of s.productionOrders) {
      if (!po.scheduledEnd) continue;
      const done = po.status === "COMPLETED" || po.status === "CANCELLED";
      events.push({
        id: `wo-${po.id}`,
        date: po.scheduledEnd,
        title: `${po.orderNumber} scheduled completion`,
        ref: po.priority,
        category: "production",
        done,
        overdue: !done && po.scheduledEnd < today,
      });
    }

    const filtered = filterFocus && filterFocus.length
      ? events.filter((e) => filterFocus.includes(e.category))
      : events;

    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [s, filterFocus]);
}
