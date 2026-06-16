import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Customers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status] = useState("");

  const { data, isLoading, refetch } = trpc.crm.customers.list.useQuery({
    status: status || undefined,
    search: search || undefined,
    page,
    limit: 20,
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.crm.customers.create.useMutation({
    onSuccess: () => {
      utils.crm.customers.list.invalidate();
    },
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "industry", label: "Industry" },
    {
      key: "status",
      label: "Status",
      render: (v: string) => <StatusBadge status={v} />,
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Customers"
        subtitle="Customer Relationship Management"
        columns={columns}
        data={data?.items || []}
        total={data?.total || 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        searchPlaceholder="Search by name..."
        onSearch={setSearch}
        searchValue={search}
        loading={isLoading}
        onRefresh={refetch}
        actionButton={{
          label: "Add Customer",
          onClick: () => {
            createMutation.mutate({
              name: "New Customer " + Date.now(),
              email: "new@customer.com",
              status: "LEAD",
            });
          },
        }}
      />
    </DashboardLayout>
  );
}
