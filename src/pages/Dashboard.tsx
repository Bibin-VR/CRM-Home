import { useMemo } from "react";
import { Link } from "react-router";
import { useAppStore, ROLE_LABELS, type UserRole } from "@/store/useAppStore";
import { useDataStore } from "@/data/store";
import { getProfile, greeting } from "@/data/profile";
import { isElevated } from "@/data/permissions";
import { useCalendarEvents, CATEGORY_COLORS, CATEGORY_LABELS } from "@/data/calendar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import {
  BarChartCard,
  DonutChartCard,
  ProgressList,
} from "@/components/shared/Charts";
import {
  TrendingUp,
  Factory,
  ShoppingCart,
  Users,
  AlertTriangle,
  Wrench,
  DollarSign,
  Package,
  ShieldCheck,
  FolderKanban,
  Clock,
  Activity,
  ArrowRight,
  CalendarClock,
  CalendarX,
  PieChart,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#10B981",
  IN_PROGRESS: "#0EA5E9",
  SCHEDULED: "#7C3AED",
  PLANNED: "#8C8A80",
  ON_HOLD: "#F59E0B",
  CANCELLED: "#E61919",
  PASS: "#10B981",
  FAIL: "#E61919",
  PENDING: "#F59E0B",
  REWORK: "#F97316",
  OPERATIONAL: "#10B981",
  MAINTENANCE: "#F59E0B",
  BREAKDOWN: "#E61919",
  IDLE: "#8C8A80",
  DRAFT: "#8C8A80",
  APPROVED: "#10B981",
  ORDERED: "#0EA5E9",
  RECEIVED: "#059669",
};

function countBy<T>(rows: T[], key: (r: T) => string) {
  const m = new Map<string, number>();
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1);
  return m;
}

function toDonut(m: Map<string, number>) {
  return Array.from(m.entries()).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
    color: STATUS_COLORS[name] ?? "#0B0B0B",
  }));
}

// ─── Role → which analytics charts to render ───────────────────────
const CHART_PLAN: Record<UserRole, string[]> = {
  CEO: ["pipeline", "production", "completions", "projects"],
  ADMIN: ["po", "completions", "headcount"],
  PURCHASE: ["po", "completions"],
  PRODUCTION: ["production", "quality", "completions"],
  ELECTRICAL: ["machines", "projects"],
  QUALITY: ["quality", "production"],
  MECHANICAL: ["machines", "production"],
  DESIGN: ["projects", "completions"],
  SALES: ["pipeline", "completions"],
  COASTING: ["pipeline", "projects"],
  PROJECT_ENGINEER: ["projects", "production", "completions"],
  PLANT_HEAD: ["production", "machines", "quality", "po"],
};

function AnalyticsSection({ role }: { role: UserRole }) {
  const s = useDataStore();

  const charts = useMemo(() => {
    const plan = CHART_PLAN[role];
    const out: Record<string, React.ReactNode> = {};

    out.production = (
      <DonutChartCard
        title="Production Orders by Status"
        icon={<PieChart className="w-4 h-4" />}
        data={toDonut(countBy(s.productionOrders, (p) => p.status))}
      />
    );

    out.machines = (
      <DonutChartCard
        title="Machine Fleet Status"
        icon={<PieChart className="w-4 h-4" />}
        data={toDonut(countBy(s.machines, (m) => m.status))}
      />
    );

    out.po = (
      <DonutChartCard
        title="Purchase Orders by Status"
        icon={<PieChart className="w-4 h-4" />}
        data={toDonut(countBy(s.purchaseOrders, (p) => p.status))}
      />
    );

    out.quality = (
      <BarChartCard
        title="Quality Inspections"
        icon={<BarChart3 className="w-4 h-4" />}
        xKey="name"
        dataKey="value"
        data={Array.from(countBy(s.qualityReports, (q) => q.status).entries()).map(([name, value]) => ({ name, value }))}
        color="#10B981"
      />
    );

    out.pipeline = (
      <BarChartCard
        title="Sales Pipeline Value ($K)"
        icon={<BarChart3 className="w-4 h-4" />}
        xKey="name"
        dataKey="value"
        data={Array.from(
          s.salesLeads.reduce((map, l) => {
            const k = l.stage.replace(/_/g, " ");
            map.set(k, (map.get(k) ?? 0) + Math.round(Number(l.value) / 1000));
            return map;
          }, new Map<string, number>()),
        ).map(([name, value]) => ({ name, value }))}
        color="#EC4899"
      />
    );

    out.completions = (
      <BarChartCard
        title="Completions To Date"
        icon={<CheckCircle2 className="w-4 h-4" />}
        xKey="name"
        dataKey="value"
        data={[
          { name: "Work Orders", value: s.productionOrders.filter((p) => p.status === "COMPLETED").length },
          { name: "Tasks", value: s.tasks.filter((t) => t.status === "DONE").length },
          { name: "Projects", value: s.projects.filter((p) => p.status === "COMPLETED").length },
          { name: "Deals Won", value: s.salesLeads.filter((l) => l.stage === "CLOSED_WON").length },
        ]}
        color="#E61919"
      />
    );

    out.projects = (
      <ProgressList
        title="Project Completion"
        icon={<FolderKanban className="w-4 h-4" />}
        items={s.projects.map((p) => ({
          label: p.name,
          value: p.progress,
          sub: `${p.projectNumber} • ${p.status.replace(/_/g, " ")}`,
        }))}
      />
    );

    out.headcount = (
      <BarChartCard
        title="Headcount by Department"
        icon={<Users className="w-4 h-4" />}
        xKey="name"
        dataKey="value"
        data={Array.from(countBy(s.employees, (e) => e.department).entries()).map(([name, value]) => ({ name, value }))}
        color="#0EA5E9"
      />
    );

    return plan.map((k) => <div key={k}>{out[k]}</div>);
  }, [s, role]);

  return (
    <div>
      <SectionTitle icon={<BarChart3 className="w-4 h-4" />} label="Analytics & Progress" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{charts}</div>
    </div>
  );
}

function UpcomingPanel({ role }: { role: UserRole }) {
  const profile = getProfile(role);
  const events = useCalendarEvents(profile.focus);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 30);

  const overdue = events.filter((e) => e.overdue).slice(0, 8);
  const upcoming = events
    .filter((e) => !e.overdue && !e.done && e.date >= today && e.date <= horizon)
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overdue warnings */}
      <div className="brutalist-card p-5 border-l-4 border-l-[#B3110F]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#B3110F] flex items-center gap-2">
            <CalendarX className="w-4 h-4" /> Overdue Warnings
          </h3>
          <span className="brutalist-badge border-[#B3110F] text-[#B3110F] bg-red-50">{overdue.length}</span>
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto brutalist-scroll">
          {overdue.length === 0 && (
            <div className="text-xs font-mono-data text-[#8C8A80]">Nothing overdue. Good work.</div>
          )}
          {overdue.map((e) => (
            <div key={e.id} className="flex items-start gap-3 p-3 bg-red-50 border border-[#FCA5A5]">
              <AlertTriangle className="w-4 h-4 text-[#B3110F] mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-[#0B0B0B] font-mono-data truncate">{e.title}</div>
                <div className="text-[10px] text-[#B3110F] font-mono-data mt-0.5 uppercase tracking-wider">
                  {CATEGORY_LABELS[e.category]} • due {e.date.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming reminders */}
      <div className="brutalist-card p-5 border-l-4 border-l-[#E61919]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#E61919] flex items-center gap-2">
            <CalendarClock className="w-4 h-4" /> Upcoming (30 Days)
          </h3>
          <Link to="/calendar" className="text-[10px] font-mono-data uppercase tracking-wider text-[#6B6A63] hover:text-[#E61919]">
            Open Calendar →
          </Link>
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto brutalist-scroll">
          {upcoming.length === 0 && (
            <div className="text-xs font-mono-data text-[#8C8A80]">No deadlines in the next 30 days.</div>
          )}
          {upcoming.map((e) => {
            const days = Math.ceil((e.date.getTime() - today.getTime()) / 86400000);
            return (
              <div key={e.id} className="flex items-start gap-3 p-3 bg-[#EAE8E3] border border-[#DAD7CE]">
                <div className="w-2 h-2 mt-1.5 flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[e.category] }} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[#0B0B0B] font-mono-data truncate">{e.title}</div>
                  <div className="text-[10px] text-[#6B6A63] font-mono-data mt-0.5 uppercase tracking-wider">
                    {CATEGORY_LABELS[e.category]} • {e.date.toLocaleDateString()}
                  </div>
                </div>
                <span className="text-[10px] font-mono-data font-bold text-[#E61919] whitespace-nowrap">
                  {days === 0 ? "TODAY" : `${days}D`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <span className="text-[#E61919]">{icon}</span>
      <h2 className="text-xs uppercase tracking-[0.3em] font-mono-data text-[#0B0B0B] font-bold">{label}</h2>
      <div className="flex-1 h-px bg-[#0B0B0B] ml-2" />
    </div>
  );
}

function DashboardContent() {
  const { selectedRole } = useAppStore();
  const kpisRaw = useDataStore();
  const profile = getProfile(selectedRole);

  const kpis = useMemo(() => {
    const num = (v: string | null) => Number(v || 0);
    const s = kpisRaw;
    return {
      totalRevenue: s.salesLeads.filter((l) => l.stage === "CLOSED_WON").reduce((a, l) => a + num(l.value), 0),
      activeWorkOrders: s.productionOrders.filter((p) => p.status === "IN_PROGRESS").length,
      pendingPOs: s.purchaseOrders.filter((p) => p.status === "PENDING").length,
      employeeCount: s.employees.length,
      qcPending: s.qualityReports.filter((q) => q.status === "PENDING").length,
      machineBreakdown: s.machines.filter((m) => m.status === "BREAKDOWN").length,
      pipelineValue: s.salesLeads.filter((l) => l.stage !== "CLOSED_WON" && l.stage !== "CLOSED_LOST").reduce((a, l) => a + num(l.value), 0),
      lowStockItems: s.inventory.filter((i) => i.quantityAvailable < 20).length,
      totalProjects: s.projects.length,
      overdueMaintenance: s.machines.filter((m) => m.nextMaintenanceAt && m.nextMaintenanceAt < new Date() && m.status !== "MAINTENANCE").length,
    };
  }, [kpisRaw]);

  const recentActivity = kpisRaw.activityLogs;

  const roleContent: Record<UserRole, { title: string; stats: React.ReactNode; sections: React.ReactNode }> = {
    CEO: {
      title: "Executive Overview",
      stats: (
        <>
          <StatCard title="Total Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} accent="teal" />
          <StatCard title="Active Work Orders" value={kpis.activeWorkOrders} subtitle="In Progress" icon={<Factory className="w-6 h-6" />} accent="blue" />
          <StatCard title="Pipeline Value" value={`$${kpis.pipelineValue.toLocaleString()}`} icon={<TrendingUp className="w-6 h-6" />} accent="teal" />
          <StatCard title="Pending POs" value={kpis.pendingPOs} icon={<ShoppingCart className="w-6 h-6" />} accent="amber" />
          <StatCard title="Employees" value={kpis.employeeCount} icon={<Users className="w-6 h-6" />} accent="blue" />
          <StatCard title="QC Pending" value={kpis.qcPending} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="brutalist-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#E61919]">Recent Activity</h3>
              <Activity className="w-5 h-5 text-[#8C8A80]" />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto brutalist-scroll">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#EAE8E3] border border-[#DAD7CE]">
                  <div className="w-2 h-2 bg-[#E61919] mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-[#0B0B0B] font-mono-data">{activity.action} // {activity.entityType}</div>
                    <div className="text-[10px] text-[#6B6A63] font-mono-data mt-1">{activity.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SystemAlerts kpis={kpis} />
        </div>
      ),
    },
    ADMIN: {
      title: "HR & Administration",
      stats: (
        <>
          <StatCard title="Total Employees" value={kpis.employeeCount} icon={<Users className="w-6 h-6" />} accent="teal" />
          <StatCard title="Departments" value={new Set(kpisRaw.employees.map((e) => e.department)).size} icon={<Factory className="w-6 h-6" />} accent="blue" />
          <StatCard title="Pending POs" value={kpis.pendingPOs} icon={<ShoppingCart className="w-6 h-6" />} accent="amber" />
          <StatCard title="Active Projects" value={kpisRaw.projects.filter((p) => p.status === "ACTIVE").length} icon={<FolderKanban className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="People Management" icon={<Users className="w-5 h-5" />}
            links={[
              { label: "Employee Directory", path: "/employees", desc: `${kpis.employeeCount} staff records` },
              { label: "Purchase Approvals", path: "/purchase-orders", desc: `${kpis.pendingPOs} pending` },
              { label: "Plant Calendar", path: "/calendar", desc: "Deadlines & reminders" },
            ]}
          />
          <SystemAlerts kpis={kpis} />
        </div>
      ),
    },
    PURCHASE: {
      title: "Procurement Dashboard",
      stats: (
        <>
          <StatCard title="Pending Approvals" value={kpis.pendingPOs} icon={<ShoppingCart className="w-6 h-6" />} accent="amber" />
          <StatCard title="Active Vendors" value={kpisRaw.vendors.filter((v) => v.status === "ACTIVE").length} icon={<Users className="w-6 h-6" />} accent="teal" />
          <StatCard title="Low Stock Items" value={kpis.lowStockItems} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Open POs" value={kpisRaw.purchaseOrders.filter((p) => !["RECEIVED", "CANCELLED"].includes(p.status)).length} icon={<Package className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Purchase Operations" icon={<ShoppingCart className="w-5 h-5" />}
            links={[
              { label: "Purchase Orders", path: "/purchase-orders", desc: "New PO workflow" },
              { label: "Vendor Database", path: "/vendors", desc: "Manage suppliers" },
              { label: "Low Stock Alerts", path: "/inventory", desc: `${kpis.lowStockItems} items need reorder` },
            ]}
          />
          <QuickLinksCard title="Inventory" icon={<Package className="w-5 h-5" />}
            links={[
              { label: "View Inventory", path: "/inventory", desc: "Stock levels" },
              { label: "Products Catalog", path: "/products", desc: "Product master" },
              { label: "Delivery Calendar", path: "/calendar", desc: "Expected deliveries" },
            ]}
          />
        </div>
      ),
    },
    PRODUCTION: {
      title: "Production Floor",
      stats: (
        <>
          <StatCard title="Active Work Orders" value={kpis.activeWorkOrders} icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="QC Pending" value={kpis.qcPending} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
          <StatCard title="Machine Down" value={kpis.machineBreakdown} icon={<Wrench className="w-6 h-6" />} accent="red" />
          <StatCard title="Completed" value={kpisRaw.productionOrders.filter((p) => p.status === "COMPLETED").length} icon={<CheckCircle2 className="w-6 h-6" />} accent="teal" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Work Orders" icon={<Factory className="w-5 h-5" />}
            links={[
              { label: "Production Schedule", path: "/production-orders", desc: "All orders" },
              { label: "Quality Reports", path: "/quality-reports", desc: `${kpis.qcPending} pending inspections` },
              { label: "Task Board", path: "/tasks", desc: "Assigned work" },
            ]}
          />
          <QuickLinksCard title="Resources" icon={<Wrench className="w-5 h-5" />}
            links={[
              { label: "Machine Status", path: "/machines", desc: `${kpis.machineBreakdown} machines down` },
              { label: "Material Availability", path: "/inventory", desc: "Check stock" },
              { label: "Production Calendar", path: "/calendar", desc: "Scheduled completions" },
            ]}
          />
        </div>
      ),
    },
    ELECTRICAL: {
      title: "Electrical & Automation",
      stats: (
        <>
          <StatCard title="Operational Machines" value={kpisRaw.machines.filter((m) => m.status === "OPERATIONAL").length} icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="Maintenance Due" value={kpis.overdueMaintenance} icon={<Clock className="w-6 h-6" />} accent="amber" />
          <StatCard title="Breakdowns" value={kpis.machineBreakdown} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Active Projects" value={kpisRaw.projects.filter((p) => p.status === "ACTIVE").length} icon={<FolderKanban className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Equipment" icon={<Wrench className="w-5 h-5" />}
            links={[
              { label: "Machine Status", path: "/machines", desc: "Monitor equipment" },
              { label: "Maintenance Logs", path: "/maintenance", desc: "Schedule repairs" },
              { label: "Maintenance Calendar", path: "/calendar", desc: "Upcoming service" },
            ]}
          />
          <QuickLinksCard title="Projects" icon={<FolderKanban className="w-5 h-5" />}
            links={[
              { label: "Active Projects", path: "/projects", desc: "Project status" },
              { label: "My Tasks", path: "/tasks", desc: "Assigned items" },
            ]}
          />
        </div>
      ),
    },
    QUALITY: {
      title: "Quality Control Center",
      stats: (
        <>
          <StatCard title="Pending Inspections" value={kpis.qcPending} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
          <StatCard title="Failed Reports" value={kpisRaw.qualityReports.filter((q) => q.status === "FAIL").length} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Pass Rate" value={`${passRate(kpisRaw.qualityReports)}%`} icon={<TrendingUp className="w-6 h-6" />} accent="teal" />
          <StatCard title="Work Orders" value={kpis.activeWorkOrders} icon={<Factory className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Quality Operations" icon={<ShieldCheck className="w-5 h-5" />}
            links={[
              { label: "Inspection Queue", path: "/quality-reports", desc: `${kpis.qcPending} pending` },
              { label: "Failed Items", path: "/quality-reports", desc: "Review failures" },
              { label: "Inspection Calendar", path: "/calendar", desc: "Scheduled checks" },
            ]}
          />
          <QuickLinksCard title="Production" icon={<Factory className="w-5 h-5" />}
            links={[
              { label: "Work Orders", path: "/production-orders", desc: "Production schedule" },
              { label: "Inventory", path: "/inventory", desc: "Stock levels" },
            ]}
          />
        </div>
      ),
    },
    MECHANICAL: {
      title: "Mechanical Engineering",
      stats: (
        <>
          <StatCard title="Total Machines" value={kpisRaw.machines.length} icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="Under Maintenance" value={kpisRaw.machines.filter((m) => m.status === "MAINTENANCE").length} icon={<Wrench className="w-6 h-6" />} accent="amber" />
          <StatCard title="Breakdowns" value={kpis.machineBreakdown} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Maintenance Overdue" value={kpis.overdueMaintenance} icon={<Clock className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Maintenance" icon={<Wrench className="w-5 h-5" />}
            links={[
              { label: "Machine Status", path: "/machines", desc: "Monitor equipment" },
              { label: "Maintenance Schedule", path: "/maintenance", desc: `${kpis.overdueMaintenance} overdue` },
              { label: "Service Calendar", path: "/calendar", desc: "Planned maintenance" },
            ]}
          />
          <QuickLinksCard title="Production" icon={<Factory className="w-5 h-5" />}
            links={[
              { label: "Work Orders", path: "/production-orders", desc: "View schedule" },
              { label: "Quality Reports", path: "/quality-reports", desc: "QC status" },
            ]}
          />
        </div>
      ),
    },
    DESIGN: {
      title: "Design Engineering",
      stats: (
        <>
          <StatCard title="Active Projects" value={kpisRaw.projects.filter((p) => p.status === "ACTIVE").length} icon={<FolderKanban className="w-6 h-6" />} accent="teal" />
          <StatCard title="My Tasks" value={kpisRaw.tasks.filter((t) => t.assignedTo === 8 && t.status !== "DONE").length} icon={<Activity className="w-6 h-6" />} accent="blue" />
          <StatCard title="Products" value={kpisRaw.products.length} icon={<Package className="w-6 h-6" />} accent="amber" />
          <StatCard title="Pending QC" value={kpis.qcPending} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Project Work" icon={<FolderKanban className="w-5 h-5" />}
            links={[
              { label: "Active Projects", path: "/projects", desc: "Design projects" },
              { label: "My Tasks", path: "/tasks", desc: "Assigned items" },
              { label: "Deadlines Calendar", path: "/calendar", desc: "Task due dates" },
            ]}
          />
          <QuickLinksCard title="Product Catalog" icon={<Package className="w-5 h-5" />}
            links={[
              { label: "View Products", path: "/products", desc: "Master data" },
              { label: "Inventory", path: "/inventory", desc: "Stock levels" },
            ]}
          />
        </div>
      ),
    },
    SALES: {
      title: "Sales Pipeline",
      stats: (
        <>
          <StatCard title="Pipeline Value" value={`$${kpis.pipelineValue.toLocaleString()}`} icon={<TrendingUp className="w-6 h-6" />} accent="teal" />
          <StatCard title="Active Leads" value={kpisRaw.salesLeads.filter((l) => !["CLOSED_WON", "CLOSED_LOST"].includes(l.stage)).length} icon={<Users className="w-6 h-6" />} accent="blue" />
          <StatCard title="Closed Won" value={kpisRaw.salesLeads.filter((l) => l.stage === "CLOSED_WON").length} icon={<DollarSign className="w-6 h-6" />} accent="teal" />
          <StatCard title="Customers" value={kpisRaw.customers.length} icon={<Users className="w-6 h-6" />} accent="amber" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Sales Operations" icon={<TrendingUp className="w-5 h-5" />}
            links={[
              { label: "Sales Leads", path: "/sales-leads", desc: "Manage pipeline" },
              { label: "Customers", path: "/customers", desc: "Customer database" },
              { label: "Quotations", path: "/quotations", desc: "Price quotes" },
            ]}
          />
          <QuickLinksCard title="Planning" icon={<Activity className="w-5 h-5" />}
            links={[
              { label: "Close Date Calendar", path: "/calendar", desc: "Expected closes" },
              { label: "Quotation Validity", path: "/quotations", desc: "Expiring quotes" },
            ]}
          />
        </div>
      ),
    },
    COASTING: {
      title: "Costing & Finance",
      stats: (
        <>
          <StatCard title="Closed Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} accent="teal" />
          <StatCard title="Draft Quotes" value={kpisRaw.quotations.filter((q) => q.status === "DRAFT").length} icon={<TrendingUp className="w-6 h-6" />} accent="amber" />
          <StatCard title="Project Budget" value={`$${(kpisRaw.projects.reduce((a, p) => a + Number(p.budget), 0) / 1000000).toFixed(1)}M`} icon={<FolderKanban className="w-6 h-6" />} accent="blue" />
          <StatCard title="Pipeline Value" value={`$${kpis.pipelineValue.toLocaleString()}`} icon={<TrendingUp className="w-6 h-6" />} accent="teal" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Costing" icon={<DollarSign className="w-5 h-5" />}
            links={[
              { label: "Quotations", path: "/quotations", desc: `${kpisRaw.quotations.filter((q) => q.status === "DRAFT").length} drafts` },
              { label: "Products & Pricing", path: "/products", desc: "View catalog" },
              { label: "Project Budgets", path: "/projects", desc: "Cost tracking" },
            ]}
          />
          <QuickLinksCard title="Sales Data" icon={<TrendingUp className="w-5 h-5" />}
            links={[
              { label: "Sales Leads", path: "/sales-leads", desc: "Pipeline value" },
              { label: "Customers", path: "/customers", desc: "Client database" },
            ]}
          />
        </div>
      ),
    },
    PROJECT_ENGINEER: {
      title: "Project Engineering",
      stats: (
        <>
          <StatCard title="Active Projects" value={kpisRaw.projects.filter((p) => p.status === "ACTIVE").length} icon={<FolderKanban className="w-6 h-6" />} accent="teal" />
          <StatCard title="Total Tasks" value={kpisRaw.tasks.length} icon={<Activity className="w-6 h-6" />} accent="blue" />
          <StatCard title="In Progress" value={kpisRaw.tasks.filter((t) => t.status === "IN_PROGRESS").length} icon={<Clock className="w-6 h-6" />} accent="amber" />
          <StatCard title="Completed" value={kpisRaw.tasks.filter((t) => t.status === "DONE").length} icon={<CheckCircle2 className="w-6 h-6" />} accent="teal" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard title="Projects" icon={<FolderKanban className="w-5 h-5" />}
            links={[
              { label: "All Projects", path: "/projects", desc: "View all" },
              { label: "Task Board", path: "/tasks", desc: "Manage tasks" },
              { label: "Milestone Calendar", path: "/calendar", desc: "Deadlines" },
            ]}
          />
          <QuickLinksCard title="Resources" icon={<Factory className="w-5 h-5" />}
            links={[
              { label: "Production Orders", path: "/production-orders", desc: "Check capacity" },
              { label: "Quality Reports", path: "/quality-reports", desc: "QC status" },
            ]}
          />
        </div>
      ),
    },
    PLANT_HEAD: {
      title: "Plant Operations",
      stats: (
        <>
          <StatCard title="Active Work Orders" value={kpis.activeWorkOrders} icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="Machine Down" value={kpis.machineBreakdown} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="QC Pending" value={kpis.qcPending} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
          <StatCard title="Low Stock" value={kpis.lowStockItems} icon={<Package className="w-6 h-6" />} accent="amber" />
          <StatCard title="Pending POs" value={kpis.pendingPOs} icon={<ShoppingCart className="w-6 h-6" />} accent="blue" />
          <StatCard title="Employees" value={kpis.employeeCount} icon={<Users className="w-6 h-6" />} accent="teal" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickLinksCard title="Production" icon={<Factory className="w-5 h-5" />}
            links={[
              { label: "Work Orders", path: "/production-orders", desc: "Schedule" },
              { label: "Quality Reports", path: "/quality-reports", desc: `${kpis.qcPending} pending` },
            ]}
          />
          <QuickLinksCard title="Resources" icon={<Wrench className="w-5 h-5" />}
            links={[
              { label: "Machine Status", path: "/machines", desc: `${kpis.machineBreakdown} breakdowns` },
              { label: "Maintenance", path: "/maintenance", desc: `${kpis.overdueMaintenance} overdue` },
            ]}
          />
          <QuickLinksCard title="Supply Chain" icon={<ShoppingCart className="w-5 h-5" />}
            links={[
              { label: "Purchase Orders", path: "/purchase-orders", desc: `${kpis.pendingPOs} pending` },
              { label: "Inventory", path: "/inventory", desc: `${kpis.lowStockItems} low stock` },
            ]}
          />
        </div>
      ),
    },
  };

  const content = roleContent[selectedRole];

  return (
    <div className="space-y-8">
      {/* Personalized greeting */}
      <div className="brutalist-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E61919] border-2 border-[#0B0B0B] flex items-center justify-center text-white font-bold text-xl font-mono-data shadow-[3px_3px_0px_0px_#0B0B0B]">
            {profile.initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0B0B0B] tracking-wide">
              {greeting()}, {profile.name.split(" ")[0]}.
            </h1>
            <p className="text-xs text-[#6B6A63] font-mono-data mt-1">{profile.tagline}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="brutalist-badge border-[#E61919] text-[#E61919] bg-[#FDEBEB]">{ROLE_LABELS[selectedRole]}</span>
              <span className="brutalist-badge border-[#0B0B0B] text-[#0B0B0B] bg-[#FBFAF7]">{profile.department}</span>
              {isElevated(selectedRole) && (
                <span className="brutalist-badge border-[#0B0B0B] text-[#FBFAF7] bg-[#0B0B0B]">Full Authority</span>
              )}
              <span className="text-[10px] text-[#8C8A80] font-mono-data">{profile.email}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono-data text-[#0B0B0B]">{content.title}</div>
          <div className="text-xs text-[#6B6A63] font-mono-data mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <SectionTitle icon={<Activity className="w-4 h-4" />} label="Key Metrics" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {content.stats}
        </div>
      </div>

      {/* Upcoming & overdue */}
      <div>
        <SectionTitle icon={<CalendarClock className="w-4 h-4" />} label="Reminders & Deadlines" />
        <UpcomingPanel role={selectedRole} />
      </div>

      {/* Analytics */}
      <AnalyticsSection role={selectedRole} />

      {/* Quick links / role sections */}
      <div>
        <SectionTitle icon={<ArrowRight className="w-4 h-4" />} label="Quick Access" />
        {content.sections}
      </div>
    </div>
  );
}

function passRate(reports: { status: string }[]) {
  const judged = reports.filter((r) => r.status === "PASS" || r.status === "FAIL");
  if (judged.length === 0) return 100;
  return Math.round((judged.filter((r) => r.status === "PASS").length / judged.length) * 100);
}

function SystemAlerts({ kpis }: { kpis: { machineBreakdown: number; lowStockItems: number; overdueMaintenance: number } }) {
  return (
    <div className="brutalist-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#E61919]">System Alerts</h3>
        <AlertTriangle className="w-5 h-5 text-[#B3110F]" />
      </div>
      <div className="space-y-3">
        {kpis.machineBreakdown > 0 && (
          <div className="flex items-center gap-3 p-3 border-l-4 border-[#B3110F] bg-red-50">
            <AlertTriangle className="w-4 h-4 text-[#B3110F]" />
            <div className="text-xs text-[#0B0B0B] font-mono-data">{kpis.machineBreakdown} machine(s) in BREAKDOWN status</div>
          </div>
        )}
        {kpis.lowStockItems > 0 && (
          <div className="flex items-center gap-3 p-3 border-l-4 border-[#F59E0B] bg-amber-50">
            <Package className="w-4 h-4 text-[#F59E0B]" />
            <div className="text-xs text-[#0B0B0B] font-mono-data">{kpis.lowStockItems} item(s) below reorder level</div>
          </div>
        )}
        {kpis.overdueMaintenance > 0 && (
          <div className="flex items-center gap-3 p-3 border-l-4 border-[#3B82F6] bg-blue-50">
            <Clock className="w-4 h-4 text-[#3B82F6]" />
            <div className="text-xs text-[#0B0B0B] font-mono-data">{kpis.overdueMaintenance} machine(s) overdue for maintenance</div>
          </div>
        )}
        {kpis.machineBreakdown === 0 && kpis.lowStockItems === 0 && kpis.overdueMaintenance === 0 && (
          <div className="text-xs font-mono-data text-[#8C8A80]">All systems nominal.</div>
        )}
      </div>
    </div>
  );
}

function QuickLinksCard({ title, links, icon }: { title: string; links: { label: string; path: string; desc: string }[]; icon: React.ReactNode }) {
  return (
    <div className="brutalist-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#E61919]">{icon}</span>
        <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#E61919]">{title}</h3>
      </div>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path + link.label}
            to={link.path}
            className="flex items-center justify-between p-3 bg-[#EAE8E3] border border-[#DAD7CE] hover:border-[#E61919] hover:bg-[#FDEBEB] transition-all group"
          >
            <div>
              <div className="text-xs text-[#0B0B0B] font-mono-data group-hover:text-[#E61919] transition-colors">{link.label}</div>
              <div className="text-[10px] text-[#8C8A80] font-mono-data mt-0.5">{link.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C8A80] group-hover:text-[#E61919] group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
