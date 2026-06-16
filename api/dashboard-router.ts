import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  purchaseOrders,
  productionOrders,
  qualityReports,
  salesLeads,
  inventory,
  machines,
  employees,
  projects,
  notifications,
  activityLogs,
} from "@db/schema";
import { sql, eq, and, count, sum, desc } from "drizzle-orm";

export const dashboardRouter = createRouter({
  kpis: publicQuery
    .input(z.object({ role: z.string().optional() }))
    .query(async () => {
      const db = getDb();

      const totalRevenue = await db
        .select({ total: sum(salesLeads.value) })
        .from(salesLeads)
        .where(eq(salesLeads.stage, "CLOSED_WON"));

      const activeWorkOrders = await db
        .select({ count: count() })
        .from(productionOrders)
        .where(eq(productionOrders.status, "IN_PROGRESS"));

      const pendingPOs = await db
        .select({ count: count() })
        .from(purchaseOrders)
        .where(
          and(
            eq(purchaseOrders.status, "PENDING"),
          ),
        );

      const employeeCount = await db
        .select({ count: count() })
        .from(employees);

      const qcPending = await db
        .select({ count: count() })
        .from(qualityReports)
        .where(eq(qualityReports.status, "PENDING"));

      const machineBreakdown = await db
        .select({ count: count() })
        .from(machines)
        .where(eq(machines.status, "BREAKDOWN"));

      const pipelineValue = await db
        .select({ total: sum(salesLeads.value) })
        .from(salesLeads)
        .where(
          sql`${salesLeads.stage} NOT IN ('CLOSED_WON', 'CLOSED_LOST')`,
        );

      const lowStockItems = await db
        .select({ count: count() })
        .from(inventory)
        .where(
          sql`${inventory.quantityAvailable} < 20`,
        );

      const totalProjects = await db
        .select({ count: count() })
        .from(projects);

      const overdueMaintenance = await db
        .select({ count: count() })
        .from(machines)
        .where(
          sql`${machines.nextMaintenanceAt} < NOW()`,
        );

      return {
        totalRevenue: totalRevenue[0]?.total || "0",
        activeWorkOrders: activeWorkOrders[0]?.count || 0,
        pendingPOs: pendingPOs[0]?.count || 0,
        employeeCount: employeeCount[0]?.count || 0,
        qcPending: qcPending[0]?.count || 0,
        machineBreakdown: machineBreakdown[0]?.count || 0,
        pipelineValue: pipelineValue[0]?.total || "0",
        lowStockItems: lowStockItems[0]?.count || 0,
        totalProjects: totalProjects[0]?.count || 0,
        overdueMaintenance: overdueMaintenance[0]?.count || 0,
      };
    }),

  recentActivity: publicQuery.query(async () => {
    const db = getDb();
    const activities = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(15);
    return activities;
  }),

  alerts: publicQuery
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const alerts = await db
        .select()
        .from(notifications)
        .where(
          input.userId
            ? eq(notifications.userId, input.userId)
            : sql`1=1`,
        )
        .orderBy(desc(notifications.createdAt))
        .limit(10);
      return alerts;
    }),
});
