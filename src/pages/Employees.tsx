import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Employees() {
  const [page, setPage] = useState(1);
  const [department] = useState("");

  const { data, isLoading, refetch } = trpc.crm.employees.list.useQuery({
    department: department || undefined,
    page,
    limit: 20,
  });

  const columns = [
    { key: "employeeCode", label: "Emp Code" },
    { key: "designation", label: "Designation" },
    { key: "department", label: "Department" },
    {
      key: "salary",
      label: "Salary",
      render: (v: string) => v ? `$${Number(v).toLocaleString()}` : "-",
    },
    { key: "employmentType", label: "Type", render: (v: string) => <StatusBadge status={v} /> },
    {
      key: "joiningDate",
      label: "Joined",
      render: (v: string) => v ? new Date(v).toLocaleDateString() : "-",
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Employees"
        subtitle="HR Management"
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
