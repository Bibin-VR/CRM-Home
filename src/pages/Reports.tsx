import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDataStore } from "@/data/store";
import { exportCsv } from "@/lib/csv";
import { BarChartCard, DonutChartCard } from "@/components/shared/Charts";
import StatCard from "@/components/shared/StatCard";
import {
  Download,
  DollarSign,
  TrendingUp,
  FolderKanban,
  Factory,
  ShieldCheck,
  ShoppingCart,
  FileBarChart,
  BarChart3,
  PieChart,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#10B981", IN_PROGRESS: "#0EA5E9", SCHEDULED: "#7C3AED", PLANNED: "#9CA3AF",
  ON_HOLD: "#F59E0B", CANCELLED: "#C28A00", PASS: "#10B981", FAIL: "#C28A00", PENDING: "#F59E0B", REWORK: "#F97316",
};

function num(v: string | null) { return Number(v || 0); }

export default function Reports() {
  const s = useDataStore();

  const metrics = useMemo(() => {
    const revenue = s.salesLeads.filter((l) => l.stage === "CLOSED_WON").reduce((a, l) => a + num(l.value), 0);
    const pipeline = s.salesLeads.filter((l) => !["CLOSED_WON", "CLOSED_LOST"].includes(l.stage)).reduce((a, l) => a + num(l.value), 0);
    const completed = s.productionOrders.filter((p) => p.status === "COMPLETED").length;
    const prodRate = Math.round((completed / Math.max(1, s.productionOrders.length)) * 100);
    const judged = s.qualityReports.filter((q) => q.status === "PASS" || q.status === "FAIL");
    const passRate = judged.length ? Math.round((judged.filter((q) => q.status === "PASS").length / judged.length) * 100) : 100;
    const poSpend = s.purchaseOrders.filter((p) => p.status !== "CANCELLED").reduce((a, p) => a + num(p.totalAmount), 0);
    return { revenue, pipeline, prodRate, passRate, poSpend, projects: s.projects.length };
  }, [s]);

  const datasets: { label: string; rows: any[]; columns: { key: string; label: string }[]; file: string }[] = [
    { label: "Customers", file: "customers", rows: s.customers, columns: [
      { key: "name", label: "Name" }, { key: "company", label: "Company" }, { key: "industry", label: "Industry" }, { key: "status", label: "Status" } ] },
    { label: "Sales Leads", file: "sales-leads", rows: s.salesLeads, columns: [
      { key: "title", label: "Title" }, { key: "value", label: "Value" }, { key: "stage", label: "Stage" }, { key: "probability", label: "Probability" } ] },
    { label: "Quotations", file: "quotations", rows: s.quotations, columns: [
      { key: "quoteNumber", label: "Quote #" }, { key: "total", label: "Total" }, { key: "status", label: "Status" } ] },
    { label: "Projects", file: "projects", rows: s.projects, columns: [
      { key: "projectNumber", label: "Project #" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "progress", label: "Progress" }, { key: "budget", label: "Budget" } ] },
    { label: "Production Orders", file: "production-orders", rows: s.productionOrders, columns: [
      { key: "orderNumber", label: "Order #" }, { key: "quantity", label: "Qty" }, { key: "status", label: "Status" }, { key: "priority", label: "Priority" } ] },
    { label: "Quality Reports", file: "quality-reports", rows: s.qualityReports, columns: [
      { key: "reportNumber", label: "Report #" }, { key: "inspectionType", label: "Type" }, { key: "status", label: "Status" }, { key: "defectCount", label: "Defects" } ] },
    { label: "Purchase Orders", file: "purchase-orders", rows: s.purchaseOrders, columns: [
      { key: "poNumber", label: "PO #" }, { key: "totalAmount", label: "Total" }, { key: "status", label: "Status" } ] },
    { label: "Machines", file: "machines", rows: s.machines, columns: [
      { key: "machineCode", label: "Code" }, { key: "name", label: "Name" }, { key: "status", label: "Status" } ] },
    { label: "Employees", file: "employees", rows: s.employees, columns: [
      { key: "employeeCode", label: "Code" }, { key: "name", label: "Name" }, { key: "department", label: "Dept" }, { key: "designation", label: "Designation" } ] },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <FileBarChart className="w-6 h-6 text-[#C28A00]" />
          <div>
            <h1 className="text-3xl font-semibold text-[#1F1F22] tracking-tight font-display">Reports</h1>
            <p className="text-sm text-[#6B6B72] mt-0.5">Analytics &amp; data exports</p>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Closed Revenue" value={`$${(metrics.revenue / 1000).toFixed(0)}K`} icon={<DollarSign className="w-6 h-6" />} accent="teal" />
          <StatCard title="Pipeline Value" value={`$${(metrics.pipeline / 1000000).toFixed(2)}M`} icon={<TrendingUp className="w-6 h-6" />} accent="blue" />
          <StatCard title="Projects" value={metrics.projects} icon={<FolderKanban className="w-6 h-6" />} accent="amber" />
          <StatCard title="Production Done" value={`${metrics.prodRate}%`} icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="QC Pass Rate" value={`${metrics.passRate}%`} icon={<ShieldCheck className="w-6 h-6" />} accent="blue" />
          <StatCard title="PO Spend" value={`$${(metrics.poSpend / 1000).toFixed(0)}K`} icon={<ShoppingCart className="w-6 h-6" />} accent="amber" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartCard
            title="Sales Pipeline by Stage ($K)"
            icon={<BarChart3 className="w-4 h-4" />}
            xKey="name" dataKey="value" color="#EC4899"
            data={Array.from(s.salesLeads.reduce((m, l) => {
              const k = l.stage.replace(/_/g, " ");
              m.set(k, (m.get(k) ?? 0) + Math.round(num(l.value) / 1000));
              return m;
            }, new Map<string, number>())).map(([name, value]) => ({ name, value }))}
          />
          <DonutChartCard
            title="Production Orders by Status"
            icon={<PieChart className="w-4 h-4" />}
            data={Array.from(s.productionOrders.reduce((m, p) => {
              m.set(p.status, (m.get(p.status) ?? 0) + 1); return m;
            }, new Map<string, number>())).map(([name, value]) => ({ name: name.replace(/_/g, " "), value, color: STATUS_COLORS[name] ?? "#1F1F22" }))}
          />
        </div>

        {/* Export center */}
        <div className="brutalist-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-4 h-4 text-[#C28A00]" />
            <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#C28A00]">Generate Reports — Export to CSV</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {datasets.map((d) => (
              <button
                key={d.file}
                type="button"
                onClick={() => exportCsv(d.file, d.columns, d.rows as Record<string, unknown>[])}
                className="flex items-center justify-between p-3 bg-[#F1EDE1] border border-black/10 hover:bg-[#C28A00] hover:text-white transition-colors group"
              >
                <div className="text-left">
                  <div className="text-xs font-bold font-mono-data uppercase tracking-wider">{d.label}</div>
                  <div className="text-[10px] font-mono-data text-[#6B6B72] group-hover:text-white/80">{d.rows.length} records</div>
                </div>
                <Download className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
