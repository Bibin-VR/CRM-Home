import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Modal, TextField, SelectField, ModalButton } from "@/components/shared/Modal";
import { ExportButton, InlineStatus } from "@/components/shared/RowActions";

const STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"];

export default function Quotations() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.quotations.list.useQuery({ page, limit: 20 });
  const customers = useDataStore((s) => s.customers);
  const addQuotation = useDataStore((s) => s.addQuotation);
  const updateQuotationStatus = useDataStore((s) => s.updateQuotationStatus);
  const canManage = useCan("quotations");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerId: 1, subtotal: "0", taxPct: "8", validDays: "30" });

  const total = (Number(form.subtotal) * (1 + Number(form.taxPct) / 100)).toFixed(2);

  const generate = () => {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(form.validDays || 30));
    addQuotation({ customerId: Number(form.customerId), total, status: "DRAFT", validUntil });
    setOpen(false);
  };

  const columns = [
    { key: "quotation.quoteNumber", label: "Quote #", render: (_v: any, row: any) => row.quotation?.quoteNumber || "-" },
    { key: "customer.name", label: "Customer", render: (_v: any, row: any) => row.customer?.name || "-" },
    { key: "quotation.total", label: "Total", render: (_v: any, row: any) => row.quotation?.total ? `$${Number(row.quotation.total).toLocaleString()}` : "-" },
    { key: "quotation.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.quotation?.status || ""} /> },
    {
      key: "quotation.validUntil",
      label: "Valid Until",
      render: (_v: any, row: any) => row.quotation?.validUntil ? new Date(row.quotation.validUntil).toLocaleDateString() : "-",
    },
  ];

  const flatRows = (data?.items || []).map((r: any) => ({
    quoteNumber: r.quotation?.quoteNumber, customer: r.customer?.name,
    total: r.quotation?.total, status: r.quotation?.status,
  }));

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
        headerActions={<ExportButton filename="quotations" columns={[
          { key: "quoteNumber", label: "Quote #" }, { key: "customer", label: "Customer" },
          { key: "total", label: "Total" }, { key: "status", label: "Status" },
        ]} rows={flatRows} />}
        actionButton={canManage ? { label: "Generate Quotation", onClick: () => setOpen(true) } : undefined}
        rowActions={canManage ? (row: any) => (
          <InlineStatus value={row.quotation?.status} options={STATUSES} onChange={(v) => updateQuotationStatus(row.quotation.id, v)} />
        ) : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Generate Quotation"
        subtitle="Auto-calculated Total"
        footer={
          <>
            <ModalButton variant="ghost" onClick={() => setOpen(false)}>Cancel</ModalButton>
            <ModalButton onClick={generate}>Generate</ModalButton>
          </>
        }
      >
        <SelectField label="Customer" value={form.customerId} onChange={(v) => setForm({ ...form, customerId: Number(v) })}
          options={customers.map((c) => ({ value: c.id, label: c.name }))} />
        <TextField label="Subtotal ($)" type="number" value={form.subtotal} onChange={(v) => setForm({ ...form, subtotal: v })} />
        <TextField label="Tax (%)" type="number" value={form.taxPct} onChange={(v) => setForm({ ...form, taxPct: v })} />
        <TextField label="Valid For (days)" type="number" value={form.validDays} onChange={(v) => setForm({ ...form, validDays: v })} />
        <div className="border border-black/10 bg-[#F1EDE1] p-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest font-mono-data text-[#6B6B72]">Calculated Total</span>
          <span className="text-xl font-bold font-mono-data text-[#C28A00]">${Number(total).toLocaleString()}</span>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
