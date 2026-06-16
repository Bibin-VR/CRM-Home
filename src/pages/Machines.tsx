import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Wrench } from "lucide-react";

export default function Machines() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.machines.list.useQuery({ page, limit: 20 });

  const columns = [
    { key: "machineCode", label: "Code" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
    {
      key: "lastMaintenanceAt",
      label: "Last Maint.",
      render: (v: string) => v ? new Date(v).toLocaleDateString() : "-",
    },
    {
      key: "nextMaintenanceAt",
      label: "Next Maint.",
      render: (v: string, row: any) => {
        if (!v) return "-";
        const date = new Date(v);
        const isOverdue = date < new Date() && row.status !== "MAINTENANCE";
        return (
          <span className={isOverdue ? "text-[#F43F5E] font-bold" : ""}>
            {isOverdue && <Wrench className="w-3 h-3 inline mr-1" />}
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Machines"
        subtitle="Equipment & Asset Management"
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
