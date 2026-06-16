import { useAppStore, ROLE_LABELS, type UserRole } from "@/store/useAppStore";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Link } from "react-router";
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
} from "lucide-react";

function DashboardContent() {
  const { selectedRole } = useAppStore();
  const { data: kpis } = trpc.dashboard.kpis.useQuery({ role: selectedRole });
  const { data: recentActivity } = trpc.dashboard.recentActivity.useQuery();

  const roleContent: Record<UserRole, { title: string; stats: React.ReactNode; sections: React.ReactNode }> = {
    CEO: {
      title: "Executive Overview",
      stats: (
        <>
          <StatCard title="Total Revenue" value={`$${Number(kpis?.totalRevenue || 0).toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} accent="teal" />
          <StatCard title="Active Work Orders" value={kpis?.activeWorkOrders || 0} subtitle="In Progress" icon={<Factory className="w-6 h-6" />} accent="blue" />
          <StatCard title="Pipeline Value" value={`$${Number(kpis?.pipelineValue || 0).toLocaleString()}`} icon={<TrendingUp className="w-6 h-6" />} accent="teal" />
          <StatCard title="Pending POs" value={kpis?.pendingPOs || 0} icon={<ShoppingCart className="w-6 h-6" />} accent="amber" />
          <StatCard title="Employees" value={kpis?.employeeCount || 0} icon={<Users className="w-6 h-6" />} accent="blue" />
          <StatCard title="QC Pending" value={kpis?.qcPending || 0} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="brutalist-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#EF4444]">Recent Activity</h3>
              <Activity className="w-5 h-5 text-[#9CA3AF]" />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto brutalist-scroll">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#F5F5F5] border border-[#E5E5E5]">
                  <div className="w-2 h-2 bg-[#EF4444] mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-[#1A1A1A] font-mono-data">{activity.action} // {activity.entityType}</div>
                    <div className="text-[10px] text-[#6B7280] font-mono-data mt-1">{activity.details}</div>
                  </div>
                </div>
              )) || <div className="text-[#6B7280] text-xs font-mono-data">No recent activity</div>}
            </div>
          </div>
          <div className="brutalist-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#EF4444]">System Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div className="space-y-3">
              {kpis?.machineBreakdown ? (
                <div className="flex items-center gap-3 p-3 border-l-4 border-[#DC2626] bg-red-50">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  <div className="text-xs text-[#1A1A1A] font-mono-data">{kpis.machineBreakdown} machine(s) in BREAKDOWN status</div>
                </div>
              ) : null}
              {kpis?.lowStockItems ? (
                <div className="flex items-center gap-3 p-3 border-l-4 border-[#F59E0B] bg-amber-50">
                  <Package className="w-4 h-4 text-[#F59E0B]" />
                  <div className="text-xs text-[#1A1A1A] font-mono-data">{kpis.lowStockItems} items below reorder level</div>
                </div>
              ) : null}
              {kpis?.overdueMaintenance ? (
                <div className="flex items-center gap-3 p-3 border-l-4 border-[#3B82F6] bg-blue-50">
                  <Clock className="w-4 h-4 text-[#3B82F6]" />
                  <div className="text-xs text-[#1A1A1A] font-mono-data">{kpis.overdueMaintenance} machines overdue for maintenance</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ),
    },
    ADMIN: {
      title: "HR & Administration",
      stats: (
        <>
          <StatCard title="Total Employees" value={kpis?.employeeCount || 0} icon={<Users className="w-6 h-6" />} accent="teal" />
          <StatCard title="Active Users" value="12" subtitle="All Roles" icon={<ShieldCheck className="w-6 h-6" />} accent="blue" />
          <StatCard title="Pending POs" value={kpis?.pendingPOs || 0} icon={<ShoppingCart className="w-6 h-6" />} accent="amber" />
          <StatCard title="Department Count" value="10" icon={<Factory className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Employee Management"
            links={[
              { label: "View All Employees", path: "/employees", desc: "Manage staff records" },
              { label: "Department Summary", path: "/employees", desc: "Department analytics" },
            ]}
            icon={<Users className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="System Overview"
            links={[
              { label: "Purchase Orders", path: "/purchase-orders", desc: `${kpis?.pendingPOs || 0} pending approvals` },
              { label: "Machine Status", path: "/machines", desc: "View all equipment" },
            ]}
            icon={<Activity className="w-5 h-5" />}
          />
        </div>
      ),
    },
    PURCHASE: {
      title: "Procurement Dashboard",
      stats: (
        <>
          <StatCard title="Pending Approvals" value={kpis?.pendingPOs || 0} icon={<ShoppingCart className="w-6 h-6" />} accent="amber" />
          <StatCard title="Active Vendors" value="8" icon={<Users className="w-6 h-6" />} accent="teal" />
          <StatCard title="Low Stock Items" value={kpis?.lowStockItems || 0} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Total Projects" value={kpis?.totalProjects || 0} icon={<FolderKanban className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Purchase Operations"
            links={[
              { label: "Create Purchase Order", path: "/purchase-orders", desc: "New PO workflow" },
              { label: "Vendor Database", path: "/vendors", desc: "Manage suppliers" },
              { label: "Low Stock Alerts", path: "/inventory", desc: `${kpis?.lowStockItems || 0} items need reordering` },
            ]}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Inventory Status"
            links={[
              { label: "View Inventory", path: "/inventory", desc: "Stock levels" },
              { label: "Products Catalog", path: "/products", desc: "Product master" },
            ]}
            icon={<Package className="w-5 h-5" />}
          />
        </div>
      ),
    },
    PRODUCTION: {
      title: "Production Floor",
      stats: (
        <>
          <StatCard title="Active Work Orders" value={kpis?.activeWorkOrders || 0} icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="QC Pending" value={kpis?.qcPending || 0} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
          <StatCard title="Machine Down" value={kpis?.machineBreakdown || 0} icon={<Wrench className="w-6 h-6" />} accent="red" />
          <StatCard title="Scheduled Orders" value="5" icon={<Clock className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Work Orders"
            links={[
              { label: "View All Orders", path: "/production-orders", desc: "Production schedule" },
              { label: "Quality Reports", path: "/quality-reports", desc: `${kpis?.qcPending || 0} pending inspections` },
            ]}
            icon={<Factory className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Resources"
            links={[
              { label: "Machine Status", path: "/machines", desc: `${kpis?.machineBreakdown || 0} machines down` },
              { label: "Material Availability", path: "/inventory", desc: "Check stock levels" },
            ]}
            icon={<CogIcon className="w-5 h-5" />}
          />
        </div>
      ),
    },
    ELECTRICAL: {
      title: "Electrical & Automation",
      stats: (
        <>
          <StatCard title="Active Machines" value="13" icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="Maintenance Due" value={kpis?.overdueMaintenance || 0} icon={<Clock className="w-6 h-6" />} accent="amber" />
          <StatCard title="Breakdowns" value={kpis?.machineBreakdown || 0} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Projects" value={kpis?.totalProjects || 0} icon={<FolderKanban className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Equipment"
            links={[
              { label: "Machine Status", path: "/machines", desc: "Monitor all equipment" },
              { label: "Maintenance Logs", path: "/maintenance", desc: "Schedule repairs" },
            ]}
            icon={<Wrench className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Projects"
            links={[
              { label: "Active Projects", path: "/projects", desc: "View project status" },
              { label: "My Tasks", path: "/tasks", desc: "Assigned work items" },
            ]}
            icon={<FolderKanban className="w-5 h-5" />}
          />
        </div>
      ),
    },
    QUALITY: {
      title: "Quality Control Center",
      stats: (
        <>
          <StatCard title="Pending Inspections" value={kpis?.qcPending || 0} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
          <StatCard title="Failed Reports" value="2" icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Pass Rate" value="83%" icon={<TrendingUp className="w-6 h-6" />} accent="teal" />
          <StatCard title="Work Orders" value={kpis?.activeWorkOrders || 0} icon={<Factory className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Quality Operations"
            links={[
              { label: "Inspection Queue", path: "/quality-reports", desc: `${kpis?.qcPending || 0} pending inspections` },
              { label: "Create Report", path: "/quality-reports", desc: "New quality report" },
              { label: "Failed Items", path: "/quality-reports", desc: "Review failures" },
            ]}
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Production"
            links={[
              { label: "Work Orders", path: "/production-orders", desc: "View production schedule" },
              { label: "Inventory", path: "/inventory", desc: "Check stock levels" },
            ]}
            icon={<Factory className="w-5 h-5" />}
          />
        </div>
      ),
    },
    MECHANICAL: {
      title: "Mechanical Engineering",
      stats: (
        <>
          <StatCard title="Total Machines" value="15" icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="Under Maintenance" value="1" icon={<Wrench className="w-6 h-6" />} accent="amber" />
          <StatCard title="Breakdowns" value={kpis?.machineBreakdown || 0} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="Maintenance Due" value={kpis?.overdueMaintenance || 0} icon={<Clock className="w-6 h-6" />} accent="blue" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Maintenance"
            links={[
              { label: "Machine Status", path: "/machines", desc: "Monitor equipment" },
              { label: "Maintenance Schedule", path: "/maintenance", desc: `${kpis?.overdueMaintenance || 0} overdue` },
              { label: "Log Repair", path: "/maintenance", desc: "Record maintenance" },
            ]}
            icon={<Wrench className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Production"
            links={[
              { label: "Work Orders", path: "/production-orders", desc: "View schedule" },
              { label: "Quality Reports", path: "/quality-reports", desc: "QC status" },
            ]}
            icon={<Factory className="w-5 h-5" />}
          />
        </div>
      ),
    },
    DESIGN: {
      title: "Design Engineering",
      stats: (
        <>
          <StatCard title="Active Projects" value="5" icon={<FolderKanban className="w-6 h-6" />} accent="teal" />
          <StatCard title="My Tasks" value="3" icon={<Activity className="w-6 h-6" />} accent="blue" />
          <StatCard title="Products" value="20" icon={<Package className="w-6 h-6" />} accent="amber" />
          <StatCard title="Pending QC" value={kpis?.qcPending || 0} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Project Work"
            links={[
              { label: "Active Projects", path: "/projects", desc: "View design projects" },
              { label: "My Tasks", path: "/tasks", desc: "Assigned work items" },
            ]}
            icon={<FolderKanban className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Product Catalog"
            links={[
              { label: "View Products", path: "/products", desc: "Product master data" },
              { label: "Create Product", path: "/products", desc: "New product entry" },
            ]}
            icon={<Package className="w-5 h-5" />}
          />
        </div>
      ),
    },
    SALES: {
      title: "Sales Pipeline",
      stats: (
        <>
          <StatCard title="Pipeline Value" value={`$${Number(kpis?.pipelineValue || 0).toLocaleString()}`} icon={<TrendingUp className="w-6 h-6" />} accent="teal" />
          <StatCard title="Active Leads" value="7" icon={<Users className="w-6 h-6" />} accent="blue" />
          <StatCard title="Closed Won" value="1" subtitle="This Month" icon={<DollarSign className="w-6 h-6" />} accent="teal" />
          <StatCard title="Customers" value="20" icon={<Users className="w-6 h-6" />} accent="amber" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Sales Operations"
            links={[
              { label: "Sales Leads", path: "/sales-leads", desc: "Manage pipeline" },
              { label: "Customers", path: "/customers", desc: "Customer database" },
              { label: "Quotations", path: "/quotations", desc: "Price quotes" },
            ]}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Quick Actions"
            links={[
              { label: "Add New Lead", path: "/sales-leads", desc: "Create lead" },
              { label: "Create Quote", path: "/quotations", desc: "New quotation" },
            ]}
            icon={<Activity className="w-5 h-5" />}
          />
        </div>
      ),
    },
    COASTING: {
      title: "Costing & Finance",
      stats: (
        <>
          <StatCard title="Total Revenue" value={`$${Number(kpis?.totalRevenue || 0).toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} accent="teal" />
          <StatCard title="Pending Quotes" value="3" icon={<FileIcon className="w-6 h-6" />} accent="amber" />
          <StatCard title="Active Projects" value={kpis?.totalProjects || 0} icon={<FolderKanban className="w-6 h-6" />} accent="blue" />
          <StatCard title="Products" value="20" icon={<Package className="w-6 h-6" />} accent="teal" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Costing"
            links={[
              { label: "Quotations", path: "/quotations", desc: `3 pending approval` },
              { label: "Products & Pricing", path: "/products", desc: "View catalog" },
            ]}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Sales Data"
            links={[
              { label: "Sales Leads", path: "/sales-leads", desc: "Pipeline value" },
              { label: "Customers", path: "/customers", desc: "Client database" },
            ]}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
      ),
    },
    PROJECT_ENGINEER: {
      title: "Project Engineering",
      stats: (
        <>
          <StatCard title="Active Projects" value="5" icon={<FolderKanban className="w-6 h-6" />} accent="teal" />
          <StatCard title="Total Tasks" value="17" icon={<Activity className="w-6 h-6" />} accent="blue" />
          <StatCard title="In Progress" value="7" icon={<Clock className="w-6 h-6" />} accent="amber" />
          <StatCard title="Completed" value="5" icon={<ShieldCheck className="w-6 h-6" />} accent="teal" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickLinksCard
            title="Projects"
            links={[
              { label: "All Projects", path: "/projects", desc: "View all projects" },
              { label: "Task Board", path: "/tasks", desc: "Manage tasks" },
            ]}
            icon={<FolderKanban className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Resources"
            links={[
              { label: "Production Orders", path: "/production-orders", desc: "Check capacity" },
              { label: "Quality Reports", path: "/quality-reports", desc: "QC status" },
            ]}
            icon={<Factory className="w-5 h-5" />}
          />
        </div>
      ),
    },
    PLANT_HEAD: {
      title: "Plant Operations",
      stats: (
        <>
          <StatCard title="Active Work Orders" value={kpis?.activeWorkOrders || 0} icon={<Factory className="w-6 h-6" />} accent="teal" />
          <StatCard title="Machine Down" value={kpis?.machineBreakdown || 0} icon={<AlertTriangle className="w-6 h-6" />} accent="red" />
          <StatCard title="QC Pending" value={kpis?.qcPending || 0} icon={<ShieldCheck className="w-6 h-6" />} accent="amber" />
          <StatCard title="Low Stock" value={kpis?.lowStockItems || 0} icon={<Package className="w-6 h-6" />} accent="amber" />
          <StatCard title="Pending POs" value={kpis?.pendingPOs || 0} icon={<ShoppingCart className="w-6 h-6" />} accent="blue" />
          <StatCard title="Employees" value={kpis?.employeeCount || 0} icon={<Users className="w-6 h-6" />} accent="teal" />
        </>
      ),
      sections: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickLinksCard
            title="Production"
            links={[
              { label: "Work Orders", path: "/production-orders", desc: "Production schedule" },
              { label: "Quality Reports", path: "/quality-reports", desc: `${kpis?.qcPending || 0} pending` },
            ]}
            icon={<Factory className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Resources"
            links={[
              { label: "Machine Status", path: "/machines", desc: `${kpis?.machineBreakdown || 0} breakdowns` },
              { label: "Maintenance", path: "/maintenance", desc: `${kpis?.overdueMaintenance || 0} overdue` },
            ]}
            icon={<Wrench className="w-5 h-5" />}
          />
          <QuickLinksCard
            title="Supply Chain"
            links={[
              { label: "Purchase Orders", path: "/purchase-orders", desc: `${kpis?.pendingPOs || 0} pending` },
              { label: "Inventory", path: "/inventory", desc: `${kpis?.lowStockItems || 0} low stock` },
            ]}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
        </div>
      ),
    },
  };

  const content = roleContent[selectedRole];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] uppercase tracking-wider font-mono-data">
            {content.title}
          </h1>
          <p className="text-xs text-[#6B7280] font-mono-data mt-1 uppercase tracking-widest">
            {ROLE_LABELS[selectedRole]} // Dashboard
          </p>
        </div>
        <div className="text-xs text-[#6B7280] font-mono-data">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {content.stats}
      </div>

      {/* Sections */}
      {content.sections}
    </div>
  );
}

function QuickLinksCard({ title, links, icon }: { title: string; links: { label: string; path: string; desc: string }[]; icon: React.ReactNode }) {
  return (
    <div className="brutalist-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#EF4444]">{icon}</span>
        <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#EF4444]">{title}</h3>
      </div>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path + link.label}
            to={link.path}
            className="flex items-center justify-between p-3 bg-[#F5F5F5] border border-[#E5E5E5] hover:border-[#EF4444] hover:bg-[#FEF2F2] transition-all group"
          >
            <div>
              <div className="text-xs text-[#1A1A1A] font-mono-data group-hover:text-[#EF4444] transition-colors">
                {link.label}
              </div>
              <div className="text-[10px] text-[#9CA3AF] font-mono-data mt-0.5">{link.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#EF4444] group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function CogIcon({ className }: { className?: string }) {
  return <Activity className={className} />;
}

function FileIcon({ className }: { className?: string }) {
  return <Activity className={className} />;
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
