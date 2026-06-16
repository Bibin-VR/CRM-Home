import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function SalesLeads() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.salesLeads.list.useQuery({ page, limit: 20 });

  const columns = [
    { key: "salesLead.title", label: "Title", render: (_v: any, row: any) => row.salesLead?.title || "-" },
    { key: "customer.name", label: "Customer", render: (_v: any, row: any) => row.customer?.name || "-" },
    {
      key: "salesLead.value",
      label: "Value",
      render: (_v: any, row: any) => row.salesLead?.value ? `$${Number(row.salesLead.value).toLocaleString()}` : "-",
    },
    { key: "salesLead.stage", label: "Stage", render: (_v: any, row: any) => <StatusBadge status={row.salesLead?.stage || ""} /> },
    { key: "salesLead.probability", label: "Probability", render: (_v: any, row: any) => `${row.salesLead?.probability || 0}%` },
    { key: "salesLead.source", label: "Source", render: (_v: any, row: any) => row.salesLead?.source || "-" },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Sales Leads"
        subtitle="Sales Pipeline Management"
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
