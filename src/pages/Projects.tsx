import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Projects() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.projects.list.useQuery({ page, limit: 20 });

  const columns = [
    { key: "project.projectNumber", label: "Project #", render: (_v: any, row: any) => row.project?.projectNumber || "-" },
    { key: "project.name", label: "Name", render: (_v: any, row: any) => row.project?.name || "-" },
    { key: "customer.name", label: "Customer", render: (_v: any, row: any) => row.customer?.name || "-" },
    { key: "project.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.project?.status || ""} /> },
    {
      key: "project.progress",
      label: "Progress",
      render: (_v: any, row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-[#2a3649]">
            <div
              className="h-full bg-[#2DD4BF] transition-all"
              style={{ width: `${row.project?.progress || 0}%` }}
            />
          </div>
          <span className="text-xs font-mono-data">{row.project?.progress || 0}%</span>
        </div>
      ),
    },
    {
      key: "project.budget",
      label: "Budget",
      render: (_v: any, row: any) => row.project?.budget ? `$${Number(row.project.budget).toLocaleString()}` : "-",
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Projects"
        subtitle="Project Portfolio Management"
        columns={columns}
        data={data?.items || []}
        total={data?.total || 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        loading={isLoading}
        onRefresh={refetch}
      />
    </DashboardLayout>
  );
}
