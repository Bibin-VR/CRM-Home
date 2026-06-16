import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  customers,
  products,
  inventory,
  vendors,
  purchaseOrders,
  purchaseOrderItems,
  productionOrders,
  qualityReports,
  salesLeads,
  quotations,
  projects,
  tasks,
  employees,
  machines,
  maintenanceLogs,
  notifications,
} from "@db/schema";
import { sql, eq, and, count, sum, desc, asc, like } from "drizzle-orm";

export const crmRouter = createRouter({
  // ─── CUSTOMERS ─────────────────────────────────────────────────
  customers: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          search: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db.select().from(customers);

        const conditions = [];
        if (input?.status) conditions.push(eq(customers.status, input.status as any));
        if (input?.search) conditions.push(like(customers.name, `%${input.search}%`));

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const items = where
          ? await query.where(where).limit(limit).offset(offset).orderBy(desc(customers.createdAt))
          : await query.limit(limit).offset(offset).orderBy(desc(customers.createdAt));

        const totalResult = where
          ? await db.select({ count: count() }).from(customers).where(where)
          : await db.select({ count: count() }).from(customers);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    get: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const result = await db.select().from(customers).where(eq(customers.id, input.id));
        return result[0] || null;
      }),

    create: publicQuery
      .input(
        z.object({
          name: z.string(),
          email: z.string().optional(),
          phone: z.string().optional(),
          company: z.string().optional(),
          industry: z.string().optional(),
          address: z.string().optional(),
          status: z.string().optional(),
          assignedTo: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(customers).values({
          ...input,
          status: (input.status as any) || "LEAD",
        });
        return result;
      }),
  }),

  // ─── PRODUCTS ──────────────────────────────────────────────────
  products: createRouter({
    list: publicQuery
      .input(
        z.object({
          category: z.string().optional(),
          search: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        const items = await db
          .select()
          .from(products)
          .limit(limit)
          .offset(offset)
          .orderBy(asc(products.sku));

        const totalResult = await db.select({ count: count() }).from(products);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    get: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const result = await db.select().from(products).where(eq(products.id, input.id));
        return result[0] || null;
      }),
  }),

  // ─── INVENTORY ─────────────────────────────────────────────────
  inventory: createRouter({
    list: publicQuery
      .input(
        z.object({
          lowStock: z.boolean().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db
          .select({
            inventory: inventory,
            product: products,
          })
          .from(inventory)
          .leftJoin(products, eq(inventory.productId, products.id));

        if (input?.lowStock) {
          query = query.where(sql`${inventory.quantityAvailable} < 20`) as any;
        }

        const items = await query.limit(limit).offset(offset);
        return { items, total: items.length };
      }),

    update: publicQuery
      .input(
        z.object({
          id: z.number(),
          quantityOnHand: z.number().optional(),
          quantityReserved: z.number().optional(),
          warehouseLocation: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db.update(inventory).set(data).where(eq(inventory.id, id));
        return { success: true };
      }),
  }),

  // ─── VENDORS ───────────────────────────────────────────────────
  vendors: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async () => {
        const db = getDb();
        const items = await db
          .select()
          .from(vendors)
          .orderBy(asc(vendors.name));
        return { items, total: items.length };
      }),

    get: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const result = await db.select().from(vendors).where(eq(vendors.id, input.id));
        return result[0] || null;
      }),

    create: publicQuery
      .input(
        z.object({
          name: z.string(),
          contactPerson: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          paymentTerms: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(vendors).values(input);
        return result;
      }),
  }),

  // ─── PURCHASE ORDERS ───────────────────────────────────────────
  purchaseOrders: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db
          .select({
            purchaseOrder: purchaseOrders,
            vendor: vendors,
          })
          .from(purchaseOrders)
          .leftJoin(vendors, eq(purchaseOrders.vendorId, vendors.id));

        if (input?.status) {
          query = query.where(eq(purchaseOrders.status, input.status as any)) as any;
        }

        const items = await query
          .limit(limit)
          .offset(offset)
          .orderBy(desc(purchaseOrders.createdAt));

        const totalResult = await db.select({ count: count() }).from(purchaseOrders);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    get: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const po = await db
          .select()
          .from(purchaseOrders)
          .where(eq(purchaseOrders.id, input.id));
        const items = await db
          .select()
          .from(purchaseOrderItems)
          .where(eq(purchaseOrderItems.purchaseOrderId, input.id));
        return { ...po[0], items };
      }),

    create: publicQuery
      .input(
        z.object({
          poNumber: z.string(),
          vendorId: z.number(),
          totalAmount: z.string().optional(),
          requestedBy: z.number(),
          expectedDeliveryAt: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(purchaseOrders).values({
          ...input,
          status: "DRAFT",
          expectedDeliveryAt: input.expectedDeliveryAt
            ? new Date(input.expectedDeliveryAt)
            : undefined,
        });
        return result;
      }),

    updateStatus: publicQuery
      .input(
        z.object({
          id: z.number(),
          status: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(purchaseOrders)
          .set({ status: input.status as any })
          .where(eq(purchaseOrders.id, input.id));
        return { success: true };
      }),
  }),

  // ─── PRODUCTION ORDERS ─────────────────────────────────────────
  productionOrders: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db
          .select({
            productionOrder: productionOrders,
            product: products,
          })
          .from(productionOrders)
          .leftJoin(products, eq(productionOrders.productId, products.id));

        if (input?.status) {
          query = query.where(eq(productionOrders.status, input.status as any)) as any;
        }

        const items = await query
          .limit(limit)
          .offset(offset)
          .orderBy(desc(productionOrders.createdAt));

        const totalResult = await db.select({ count: count() }).from(productionOrders);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    get: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const result = await db
          .select()
          .from(productionOrders)
          .where(eq(productionOrders.id, input.id));
        return result[0] || null;
      }),

    create: publicQuery
      .input(
        z.object({
          orderNumber: z.string(),
          productId: z.number(),
          quantity: z.number(),
          priority: z.string().optional(),
          workCenter: z.string().optional(),
          assignedTo: z.number().optional(),
          createdBy: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(productionOrders).values({
          ...input,
          status: "PLANNED",
          priority: (input.priority as any) || "NORMAL",
        });
        return result;
      }),

    updateStatus: publicQuery
      .input(
        z.object({
          id: z.number(),
          status: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(productionOrders)
          .set({ status: input.status as any })
          .where(eq(productionOrders.id, input.id));
        return { success: true };
      }),
  }),

  // ─── QUALITY REPORTS ───────────────────────────────────────────
  qualityReports: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          inspectionType: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db
          .select({
            qualityReport: qualityReports,
            product: products,
          })
          .from(qualityReports)
          .leftJoin(products, eq(qualityReports.productId, products.id));

        const conditions = [];
        if (input?.status) conditions.push(eq(qualityReports.status, input.status as any));
        if (input?.inspectionType) conditions.push(eq(qualityReports.inspectionType, input.inspectionType as any));

        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }

        const items = await query
          .limit(limit)
          .offset(offset)
          .orderBy(desc(qualityReports.createdAt));

        const totalResult = await db.select({ count: count() }).from(qualityReports);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    create: publicQuery
      .input(
        z.object({
          reportNumber: z.string(),
          productionOrderId: z.number().optional(),
          productId: z.number(),
          inspectionType: z.string(),
          inspectorId: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(qualityReports).values({
          ...input,
          inspectionType: input.inspectionType as any,
          status: "PENDING",
        });
        return result;
      }),

    updateStatus: publicQuery
      .input(
        z.object({
          id: z.number(),
          status: z.string(),
          defectCount: z.number().optional(),
          defectDescription: z.string().optional(),
          correctiveAction: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db
          .update(qualityReports)
          .set({
            status: data.status as any,
            defectCount: data.defectCount,
            defectDescription: data.defectDescription,
            correctiveAction: data.correctiveAction,
          })
          .where(eq(qualityReports.id, id));
        return { success: true };
      }),

    stats: publicQuery.query(async () => {
      const db = getDb();
      const total = await db.select({ count: count() }).from(qualityReports);
      const pass = await db
        .select({ count: count() })
        .from(qualityReports)
        .where(eq(qualityReports.status, "PASS"));
      const fail = await db
        .select({ count: count() })
        .from(qualityReports)
        .where(eq(qualityReports.status, "FAIL"));
      const pending = await db
        .select({ count: count() })
        .from(qualityReports)
        .where(eq(qualityReports.status, "PENDING"));

      return {
        total: total[0]?.count || 0,
        pass: pass[0]?.count || 0,
        fail: fail[0]?.count || 0,
        pending: pending[0]?.count || 0,
        passRate:
          total[0]?.count && total[0].count > 0
            ? Math.round(((pass[0]?.count || 0) / total[0].count) * 100)
            : 0,
      };
    }),
  }),

  // ─── SALES LEADS ───────────────────────────────────────────────
  salesLeads: createRouter({
    list: publicQuery
      .input(
        z.object({
          stage: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db
          .select({
            salesLead: salesLeads,
            customer: customers,
          })
          .from(salesLeads)
          .leftJoin(customers, eq(salesLeads.customerId, customers.id));

        if (input?.stage) {
          query = query.where(eq(salesLeads.stage, input.stage as any)) as any;
        }

        const items = await query
          .limit(limit)
          .offset(offset)
          .orderBy(desc(salesLeads.createdAt));

        const totalResult = await db.select({ count: count() }).from(salesLeads);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    create: publicQuery
      .input(
        z.object({
          customerId: z.number(),
          title: z.string(),
          description: z.string().optional(),
          value: z.string().optional(),
          assignedTo: z.number().optional(),
          source: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(salesLeads).values({
          ...input,
          stage: "NEW",
          probability: 20,
        });
        return result;
      }),

    updateStage: publicQuery
      .input(
        z.object({
          id: z.number(),
          stage: z.string(),
          probability: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db
          .update(salesLeads)
          .set({ stage: data.stage as any, probability: data.probability })
          .where(eq(salesLeads.id, id));
        return { success: true };
      }),

    pipeline: publicQuery.query(async () => {
      const db = getDb();
      const stages = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];
      const result = [];
      for (const stage of stages) {
        const countResult = await db
          .select({ count: count(), totalValue: sum(salesLeads.value) })
          .from(salesLeads)
          .where(eq(salesLeads.stage, stage as any));
        result.push({
          stage,
          count: countResult[0]?.count || 0,
          value: countResult[0]?.totalValue || "0",
        });
      }
      return result;
    }),
  }),

  // ─── QUOTATIONS ────────────────────────────────────────────────
  quotations: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async () => {
        const db = getDb();
        const items = await db
          .select({
            quotation: quotations,
            customer: customers,
          })
          .from(quotations)
          .leftJoin(customers, eq(quotations.customerId, customers.id))
          .orderBy(desc(quotations.createdAt));
        return { items, total: items.length };
      }),
  }),

  // ─── PROJECTS ──────────────────────────────────────────────────
  projects: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db
          .select({
            project: projects,
            customer: customers,
          })
          .from(projects)
          .leftJoin(customers, eq(projects.customerId, customers.id));

        if (input?.status) {
          query = query.where(eq(projects.status, input.status as any)) as any;
        }

        const items = await query
          .limit(limit)
          .offset(offset)
          .orderBy(desc(projects.createdAt));

        const totalResult = await db.select({ count: count() }).from(projects);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    get: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const project = await db
          .select()
          .from(projects)
          .where(eq(projects.id, input.id));
        const taskList = await db
          .select()
          .from(tasks)
          .where(eq(tasks.projectId, input.id));
        return { ...project[0], tasks: taskList };
      }),
  }),

  // ─── TASKS ─────────────────────────────────────────────────────
  tasks: createRouter({
    list: publicQuery
      .input(
        z.object({
          projectId: z.number().optional(),
          assignedTo: z.number().optional(),
          status: z.string().optional(),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const conditions = [];
        if (input?.projectId) conditions.push(eq(tasks.projectId, input.projectId));
        if (input?.assignedTo) conditions.push(eq(tasks.assignedTo, input.assignedTo));
        if (input?.status) conditions.push(eq(tasks.status, input.status as any));

        const items =
          conditions.length > 0
            ? await db
                .select()
                .from(tasks)
                .where(and(...conditions))
                .orderBy(desc(tasks.createdAt))
            : await db.select().from(tasks).orderBy(desc(tasks.createdAt));

        return { items, total: items.length };
      }),

    updateStatus: publicQuery
      .input(z.object({ id: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(tasks)
          .set({
            status: input.status as any,
            completedAt:
              input.status === "DONE" ? new Date() : undefined,
          })
          .where(eq(tasks.id, input.id));
        return { success: true };
      }),
  }),

  // ─── EMPLOYEES ─────────────────────────────────────────────────
  employees: createRouter({
    list: publicQuery
      .input(
        z.object({
          department: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db.select().from(employees);
        if (input?.department) {
          query = query.where(eq(employees.department, input.department)) as any;
        }

        const items = await query.limit(limit).offset(offset);
        const totalResult = await db.select({ count: count() }).from(employees);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    get: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const result = await db
          .select()
          .from(employees)
          .where(eq(employees.id, input.id));
        return result[0] || null;
      }),

    departmentSummary: publicQuery.query(async () => {
      const db = getDb();
      const result = await db
        .select({
          department: employees.department,
          count: count(),
        })
        .from(employees)
        .groupBy(employees.department);
      return result;
    }),
  }),

  // ─── MACHINES ──────────────────────────────────────────────────
  machines: createRouter({
    list: publicQuery
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().default(1),
          limit: z.number().default(20),
        }).optional(),
      )
      .query(async ({ input }) => {
        const db = getDb();
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;

        let query = db.select().from(machines);
        if (input?.status) {
          query = query.where(eq(machines.status, input.status as any)) as any;
        }

        const items = await query.limit(limit).offset(offset);
        const totalResult = await db.select({ count: count() }).from(machines);

        return { items, total: totalResult[0]?.count || 0 };
      }),

    updateStatus: publicQuery
      .input(
        z.object({
          id: z.number(),
          status: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(machines)
          .set({ status: input.status as any })
          .where(eq(machines.id, input.id));
        return { success: true };
      }),

    maintenanceLogs: publicQuery
      .input(z.object({ machineId: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const items = await db
          .select()
          .from(maintenanceLogs)
          .where(eq(maintenanceLogs.machineId, input.machineId))
          .orderBy(desc(maintenanceLogs.createdAt));
        return items;
      }),
  }),

  // ─── NOTIFICATIONS ─────────────────────────────────────────────
  notifications: createRouter({
    list: publicQuery
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const db = getDb();
        const items = await db
          .select()
          .from(notifications)
          .where(eq(notifications.userId, input.userId))
          .orderBy(desc(notifications.createdAt));
        return items;
      }),

    markRead: publicQuery
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.id, input.id));
        return { success: true };
      }),
  }),
});
