import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Maintenance() {
  const [page, setPage] = useState(1);
  const [machineId, setMachineId] = useState(0);

  const { data, isLoading, refetch } = trpc.crm.machines.maintenanceLogs.useQuery(
    { machineId: machineId || 1 },
    { enabled: true },
  );

  const { data: machinesData } = trpc.crm.machines.list.useQuery({ page: 1, limit: 50 });

  const columns = [
    { key: "maintenanceType", label: "Type", render: (v: string) => <StatusBadge status={v} /> },
    { key: "description", label: "Description", render: (v: string) => v ? v.substring(0, 40) + "..." : "-" },
    { key: "cost", label: "Cost", render: (v: string) => v ? `$${Number(v).toFixed(2)}` : "$0.00" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
    {
      key: "startTime",
      label: "Started",
      render: (v: string) => v ? new Date(v).toLocaleDateString() : "-",
    },
    {
      key: "endTime",
      label: "Completed",
      render: (v: string) => v ? new Date(v).toLocaleDateString() : "In Progress",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-4">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-mono-data mb-2">
          Filter by Machine
        </label>
        <select
          value={machineId}
          onChange={(e) => setMachineId(Number(e.target.value))}
          className="bg-[#12171C] border-2 border-[#2DD4BF] text-white px-4 py-2 text-sm font-mono-data outline-none max-w-xs"
          style={{ borderRadius: 0 }}
        >
          <option value={0}>All Machines</option>
          {machinesData?.items.map((m) => (
            <option key={m.id} value={m.id}>{m.machineCode} - {m.name}</option>
          ))}
        </select>
      </div>
      <DataTablePage
        title="Maintenance Logs"
        subtitle="Equipment Maintenance Records"
        columns={columns}
        data={data || []}
        total={data?.length || 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        loading={isLoading}
        onRefresh={refetch}
      />
    </DashboardLayout>
  );
}
