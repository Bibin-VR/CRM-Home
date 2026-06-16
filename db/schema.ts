import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  bigint,
  boolean,
} from "drizzle-orm/mysql-core";

// ─── USERS ───────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", [
    "CEO",
    "ADMIN",
    "PURCHASE",
    "PRODUCTION",
    "ELECTRICAL",
    "QUALITY",
    "MECHANICAL",
    "DESIGN",
    "SALES",
    "COASTING",
    "PROJECT_ENGINEER",
    "PLANT_HEAD",
    "user",
  ])
    .default("user")
    .notNull(),
  department: varchar("department", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

// ─── CUSTOMERS ───────────────────────────────────────────────────
export const customers = mysqlTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  address: text("address"),
  status: mysqlEnum("status", ["ACTIVE", "INACTIVE", "LEAD", "PROSPECT"]).default("LEAD"),
  assignedTo: bigint("assignedTo", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── PRODUCTS ────────────────────────────────────────────────────
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }),
  costPrice: decimal("costPrice", { precision: 10, scale: 2 }),
  reorderLevel: int("reorderLevel").default(10),
  status: mysqlEnum("status", ["ACTIVE", "DISCONTINUED", "PENDING"]).default("ACTIVE"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── INVENTORY ───────────────────────────────────────────────────
export const inventory = mysqlTable("inventory", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  warehouseLocation: varchar("warehouseLocation", { length: 100 }),
  quantityOnHand: int("quantityOnHand").default(0),
  quantityReserved: int("quantityReserved").default(0),
  quantityAvailable: int("quantityAvailable").default(0),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().notNull(),
  updatedBy: bigint("updatedBy", { mode: "number", unsigned: true }),
});

// ─── VENDORS ─────────────────────────────────────────────────────
export const vendors = mysqlTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  status: mysqlEnum("status", ["ACTIVE", "INACTIVE", "BLACKLISTED"]).default("ACTIVE"),
  paymentTerms: varchar("paymentTerms", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── PURCHASE ORDERS ─────────────────────────────────────────────
export const purchaseOrders = mysqlTable("purchase_orders", {
  id: serial("id").primaryKey(),
  poNumber: varchar("poNumber", { length: 50 }).notNull().unique(),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["DRAFT", "PENDING", "APPROVED", "ORDERED", "RECEIVED", "CANCELLED"]).default("DRAFT"),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }),
  requestedBy: bigint("requestedBy", { mode: "number", unsigned: true }).notNull(),
  approvedBy: bigint("approvedBy", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expectedDeliveryAt: timestamp("expectedDeliveryAt"),
});

// ─── PURCHASE ORDER ITEMS ────────────────────────────────────────
export const purchaseOrderItems = mysqlTable("purchase_order_items", {
  id: serial("id").primaryKey(),
  purchaseOrderId: bigint("purchaseOrderId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  receivedQuantity: int("receivedQuantity").default(0),
});

// ─── PRODUCTION ORDERS ───────────────────────────────────────────
export const productionOrders = mysqlTable("production_orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  quantity: int("quantity").notNull(),
  status: mysqlEnum("status", ["PLANNED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]).default("PLANNED"),
  priority: mysqlEnum("priority", ["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  scheduledStart: timestamp("scheduledStart"),
  scheduledEnd: timestamp("scheduledEnd"),
  actualStart: timestamp("actualStart"),
  actualEnd: timestamp("actualEnd"),
  assignedTo: bigint("assignedTo", { mode: "number", unsigned: true }),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }),
  workCenter: varchar("workCenter", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── QUALITY REPORTS ─────────────────────────────────────────────
export const qualityReports = mysqlTable("quality_reports", {
  id: serial("id").primaryKey(),
  reportNumber: varchar("reportNumber", { length: 50 }).notNull().unique(),
  productionOrderId: bigint("productionOrderId", { mode: "number", unsigned: true }),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  inspectionType: mysqlEnum("inspectionType", ["INCOMING", "IN_PROCESS", "FINAL", "AUDIT"]).notNull(),
  status: mysqlEnum("status", ["PASS", "FAIL", "PENDING", "REWORK"]).default("PENDING"),
  inspectorId: bigint("inspectorId", { mode: "number", unsigned: true }),
  defectCount: int("defectCount").default(0),
  defectDescription: text("defectDescription"),
  correctiveAction: text("correctiveAction"),
  inspectionDate: timestamp("inspectionDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── SALES LEADS ─────────────────────────────────────────────────
export const salesLeads = mysqlTable("sales_leads", {
  id: serial("id").primaryKey(),
  customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  value: decimal("value", { precision: 12, scale: 2 }),
  stage: mysqlEnum("stage", ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]).default("NEW"),
  probability: int("probability").default(0),
  expectedCloseDate: timestamp("expectedCloseDate"),
  assignedTo: bigint("assignedTo", { mode: "number", unsigned: true }),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── QUOTATIONS ──────────────────────────────────────────────────
export const quotations = mysqlTable("quotations", {
  id: serial("id").primaryKey(),
  quoteNumber: varchar("quoteNumber", { length: 50 }).notNull().unique(),
  customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
  leadId: bigint("leadId", { mode: "number", unsigned: true }),
  status: mysqlEnum("status", ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]).default("DRAFT"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }),
  total: decimal("total", { precision: 12, scale: 2 }),
  validUntil: timestamp("validUntil"),
  preparedBy: bigint("preparedBy", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── PROJECTS ────────────────────────────────────────────────────
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  projectNumber: varchar("projectNumber", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  customerId: bigint("customerId", { mode: "number", unsigned: true }),
  status: mysqlEnum("status", ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).default("PLANNING"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  actualCost: decimal("actualCost", { precision: 12, scale: 2 }).default("0.00"),
  projectManagerId: bigint("projectManagerId", { mode: "number", unsigned: true }),
  progress: int("progress").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── TASKS ───────────────────────────────────────────────────────
export const tasks = mysqlTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: bigint("projectId", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED"]).default("TODO"),
  priority: mysqlEnum("priority", ["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  assignedTo: bigint("assignedTo", { mode: "number", unsigned: true }),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

// ─── EMPLOYEES ───────────────────────────────────────────────────
export const employees = mysqlTable("employees", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  employeeCode: varchar("employeeCode", { length: 50 }).unique(),
  designation: varchar("designation", { length: 100 }),
  department: varchar("department", { length: 100 }),
  joiningDate: timestamp("joiningDate").defaultNow().notNull(),
  salary: decimal("salary", { precision: 12, scale: 2 }),
  employmentType: mysqlEnum("employmentType", ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]).default("FULL_TIME"),
  reportingTo: bigint("reportingTo", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── MACHINES ────────────────────────────────────────────────────
export const machines = mysqlTable("machines", {
  id: serial("id").primaryKey(),
  machineCode: varchar("machineCode", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  location: varchar("location", { length: 100 }),
  status: mysqlEnum("status", ["OPERATIONAL", "MAINTENANCE", "BREAKDOWN", "IDLE"]).default("IDLE"),
  lastMaintenanceAt: timestamp("lastMaintenanceAt"),
  nextMaintenanceAt: timestamp("nextMaintenanceAt"),
  purchaseDate: timestamp("purchaseDate").defaultNow().notNull(),
  warrantyExpiry: timestamp("warrantyExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── MAINTENANCE LOGS ────────────────────────────────────────────
export const maintenanceLogs = mysqlTable("maintenance_logs", {
  id: serial("id").primaryKey(),
  machineId: bigint("machineId", { mode: "number", unsigned: true }).notNull(),
  maintenanceType: mysqlEnum("maintenanceType", ["PREVENTIVE", "CORRECTIVE", "PREDICTIVE", "EMERGENCY"]).notNull(),
  description: text("description"),
  performedBy: bigint("performedBy", { mode: "number", unsigned: true }),
  cost: decimal("cost", { precision: 10, scale: 2 }).default("0.00"),
  startTime: timestamp("startTime").defaultNow().notNull(),
  endTime: timestamp("endTime"),
  status: mysqlEnum("status", ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── NOTIFICATIONS ───────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  type: mysqlEnum("type", ["INFO", "WARNING", "SUCCESS", "ERROR"]).default("INFO"),
  isRead: boolean("isRead").default(false),
  relatedEntityType: varchar("relatedEntityType", { length: 50 }),
  relatedEntityId: bigint("relatedEntityId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── ACTIVITY LOGS ───────────────────────────────────────────────
export const activityLogs = mysqlTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }),
  entityId: bigint("entityId", { mode: "number", unsigned: true }),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type ProductionOrder = typeof productionOrders.$inferSelect;
export type QualityReport = typeof qualityReports.$inferSelect;
export type SalesLead = typeof salesLeads.$inferSelect;
export type Quotation = typeof quotations.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type Machine = typeof machines.$inferSelect;
export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
