import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { ExportButton, InlineStatus } from "@/components/shared/RowActions";

const STATUSES = ["DRAFT", "PENDING", "APPROVED", "ORDERED", "RECEIVED", "CANCELLED"];

export default function PurchaseOrders() {
  const [page, setPage] = useState(1);
  const [status] = useState("");

  const { data, isLoading, refetch } = trpc.crm.purchaseOrders.list.useQuery({
    status: status || undefined, page, limit: 20,
  });
  const updatePurchaseStatus = useDataStore((s) => s.updatePurchaseStatus);
  const canManage = useCan("purchaseOrders");

  const columns = [
    { key: "purchaseOrder.poNumber", label: "PO Number", render: (_v: any, row: any) => row.purchaseOrder?.poNumber || "-" },
    { key: "vendor.name", label: "Vendor", render: (_v: any, row: any) => row.vendor?.name || "-" },
    { key: "purchaseOrder.totalAmount", label: "Total", render: (_v: any, row: any) => row.purchaseOrder?.totalAmount ? `$${Number(row.purchaseOrder.totalAmount).toLocaleString()}` : "-" },
    { key: "purchaseOrder.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.purchaseOrder?.status || ""} /> },
    { key: "purchaseOrder.createdAt", label: "Created", render: (_v: any, row: any) => row.purchaseOrder?.createdAt ? new Date(row.purchaseOrder.createdAt).toLocaleDateString() : "-" },
  ];

  const flatRows = (data?.items || []).map((r: any) => ({
    poNumber: r.purchaseOrder?.poNumber, vendor: r.vendor?.name,
    total: r.purchaseOrder?.totalAmount, status: r.purchaseOrder?.status,
  }));

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
        headerActions={<ExportButton filename="purchase-orders" columns={[
          { key: "poNumber", label: "PO Number" }, { key: "vendor", label: "Vendor" },
          { key: "total", label: "Total" }, { key: "status", label: "Status" },
        ]} rows={flatRows} />}
        rowActions={canManage ? (row: any) => (
          <InlineStatus value={row.purchaseOrder?.status} options={STATUSES} onChange={(v) => updatePurchaseStatus(row.purchaseOrder.id, v)} />
        ) : undefined}
      />
    </DashboardLayout>
  );
}
