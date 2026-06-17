import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Modal, TextField, SelectField, ModalButton } from "@/components/shared/Modal";
import { ExportButton, InlineStatus } from "@/components/shared/RowActions";

const STATUSES = ["PLANNED", "SCHEDULED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];

export default function ProductionOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.productionOrders.list.useQuery({ page, limit: 20 });
  const products = useDataStore((s) => s.products);
  const addProductionOrder = useDataStore((s) => s.addProductionOrder);
  const updateProductionStatus = useDataStore((s) => s.updateProductionStatus);
  const canManage = useCan("productionOrders");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: 1, quantity: "1", priority: "NORMAL", workCenter: "FAB-01", days: "14" });

  const create = () => {
    const scheduledEnd = new Date();
    scheduledEnd.setDate(scheduledEnd.getDate() + Number(form.days || 14));
    addProductionOrder({
      productId: Number(form.productId), quantity: Number(form.quantity),
      priority: form.priority, workCenter: form.workCenter, status: "PLANNED", scheduledEnd,
    });
    setOpen(false);
  };

  const columns = [
    { key: "productionOrder.orderNumber", label: "Order #", render: (_v: any, row: any) => row.productionOrder?.orderNumber || "-" },
    { key: "product.name", label: "Product", render: (_v: any, row: any) => row.product?.name || "-" },
    { key: "productionOrder.quantity", label: "Qty", render: (_v: any, row: any) => row.productionOrder?.quantity || 0 },
    { key: "productionOrder.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.productionOrder?.status || ""} /> },
    { key: "productionOrder.priority", label: "Priority", render: (_v: any, row: any) => <StatusBadge status={row.productionOrder?.priority || ""} /> },
    { key: "productionOrder.workCenter", label: "Work Center", render: (_v: any, row: any) => row.productionOrder?.workCenter || "-" },
  ];

  const flatRows = (data?.items || []).map((r: any) => ({
    orderNumber: r.productionOrder?.orderNumber, product: r.product?.name,
    quantity: r.productionOrder?.quantity, status: r.productionOrder?.status,
    priority: r.productionOrder?.priority, workCenter: r.productionOrder?.workCenter,
  }));

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
        headerActions={<ExportButton filename="production-orders" columns={[
          { key: "orderNumber", label: "Order #" }, { key: "product", label: "Product" },
          { key: "quantity", label: "Qty" }, { key: "status", label: "Status" },
          { key: "priority", label: "Priority" }, { key: "workCenter", label: "Work Center" },
        ]} rows={flatRows} />}
        actionButton={canManage ? { label: "New Work Order", onClick: () => setOpen(true) } : undefined}
        rowActions={canManage ? (row: any) => (
          <InlineStatus value={row.productionOrder?.status} options={STATUSES} onChange={(v) => updateProductionStatus(row.productionOrder.id, v)} />
        ) : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Work Order"
        subtitle="Schedule Production"
        footer={
          <>
            <ModalButton variant="ghost" onClick={() => setOpen(false)}>Cancel</ModalButton>
            <ModalButton onClick={create}>Create</ModalButton>
          </>
        }
      >
        <SelectField label="Product" value={form.productId} onChange={(v) => setForm({ ...form, productId: Number(v) })}
          options={products.map((p) => ({ value: p.id, label: `${p.sku} — ${p.name}` }))} />
        <TextField label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
        <SelectField label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })}
          options={PRIORITIES.map((p) => ({ value: p, label: p }))} />
        <TextField label="Work Center" value={form.workCenter} onChange={(v) => setForm({ ...form, workCenter: v })} />
        <TextField label="Due In (days)" type="number" value={form.days} onChange={(v) => setForm({ ...form, days: v })} />
      </Modal>
    </DashboardLayout>
  );
}
