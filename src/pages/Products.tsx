import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Products() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.products.list.useQuery({
    page,
    limit: 20,
  });

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    {
      key: "unitPrice",
      label: "Unit Price",
      render: (v: string) => v ? `$${Number(v).toFixed(2)}` : "-",
    },
    {
      key: "costPrice",
      label: "Cost Price",
      render: (v: string) => v ? `$${Number(v).toFixed(2)}` : "-",
    },
    { key: "reorderLevel", label: "Reorder Lvl" },
    {
      key: "status",
      label: "Status",
      render: (v: string) => <StatusBadge status={v} />,
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Products"
        subtitle="Product Master Catalog"
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
