import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function ProductionOrders() {
  const [page, setPage] = useState(1);
  const [status] = useState("");

  const { data, isLoading, refetch } = trpc.crm.productionOrders.list.useQuery({
    status: status || undefined,
    page,
    limit: 20,
  });

  const columns = [
    { key: "productionOrder.orderNumber", label: "Order #", render: (_v: any, row: any) => row.productionOrder?.orderNumber || "-" },
    { key: "product.name", label: "Product", render: (_v: any, row: any) => row.product?.name || "-" },
    { key: "productionOrder.quantity", label: "Qty", render: (_v: any, row: any) => row.productionOrder?.quantity || 0 },
    { key: "productionOrder.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.productionOrder?.status || ""} /> },
    { key: "productionOrder.priority", label: "Priority", render: (_v: any, row: any) => <StatusBadge status={row.productionOrder?.priority || ""} /> },
    { key: "productionOrder.workCenter", label: "Work Center", render: (_v: any, row: any) => row.productionOrder?.workCenter || "-" },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Production Orders"
        subtitle="Work Order Management"
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
