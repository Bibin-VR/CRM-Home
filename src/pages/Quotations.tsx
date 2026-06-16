import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Quotations() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.quotations.list.useQuery({ page, limit: 20 });

  const columns = [
    { key: "quotation.quoteNumber", label: "Quote #", render: (_v: any, row: any) => row.quotation?.quoteNumber || "-" },
    { key: "customer.name", label: "Customer", render: (_v: any, row: any) => row.customer?.name || "-" },
    {
      key: "quotation.total",
      label: "Total",
      render: (_v: any, row: any) => row.quotation?.total ? `$${Number(row.quotation.total).toLocaleString()}` : "-",
    },
    { key: "quotation.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.quotation?.status || ""} /> },
    {
      key: "quotation.validUntil",
      label: "Valid Until",
      render: (_v: any, row: any) =>
        row.quotation?.validUntil
          ? new Date(row.quotation.validUntil).toLocaleDateString()
          : "-",
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Quotations"
        subtitle="Quote Management"
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
