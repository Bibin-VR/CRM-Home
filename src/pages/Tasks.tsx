import { useState, useMemo } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Tasks() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.tasks.list.useQuery({});

  const paginatedItems = useMemo(() => {
    if (!data?.items) return [];
    const start = (page - 1) * 20;
    return data.items.slice(start, start + 20);
  }, [data?.items, page]);

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", render: (v: string) => v ? v.substring(0, 40) + "..." : "-" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
    { key: "priority", label: "Priority", render: (v: string) => <StatusBadge status={v} /> },
    {
      key: "dueDate",
      label: "Due Date",
      render: (v: string) => v ? new Date(v).toLocaleDateString() : "-",
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Tasks"
        subtitle="Task Management"
        columns={columns}
        data={paginatedItems}
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
