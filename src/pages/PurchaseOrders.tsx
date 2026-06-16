import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function PurchaseOrders() {
  const [page, setPage] = useState(1);
  const [status] = useState("");

  const { data, isLoading, refetch } = trpc.crm.purchaseOrders.list.useQuery({
    status: status || undefined,
    page,
    limit: 20,
  });

  const columns = [
    { key: "purchaseOrder.poNumber", label: "PO Number", render: (_v: any, row: any) => row.purchaseOrder?.poNumber || "-" },
    { key: "vendor.name", label: "Vendor", render: (_v: any, row: any) => row.vendor?.name || "-" },
    {
      key: "purchaseOrder.totalAmount",
      label: "Total",
      render: (_v: any, row: any) => row.purchaseOrder?.totalAmount ? `$${Number(row.purchaseOrder.totalAmount).toLocaleString()}` : "-",
    },
    { key: "purchaseOrder.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.purchaseOrder?.status || ""} /> },
    {
      key: "purchaseOrder.createdAt",
      label: "Created",
      render: (_v: any, row: any) =>
        row.purchaseOrder?.createdAt
          ? new Date(row.purchaseOrder.createdAt).toLocaleDateString()
          : "-",
    },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Purchase Orders"
        subtitle="Procurement Tracking"
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
