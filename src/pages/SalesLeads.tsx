import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Modal, TextField, SelectField, ModalButton } from "@/components/shared/Modal";
import { ExportButton, InlineStatus } from "@/components/shared/RowActions";

const STAGES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];
const PROB: Record<string, number> = { NEW: 10, CONTACTED: 30, QUALIFIED: 50, PROPOSAL: 65, NEGOTIATION: 80, CLOSED_WON: 100, CLOSED_LOST: 0 };

export default function SalesLeads() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.salesLeads.list.useQuery({ page, limit: 20 });
  const customers = useDataStore((s) => s.customers);
  const addSalesLead = useDataStore((s) => s.addSalesLead);
  const updateLeadStage = useDataStore((s) => s.updateLeadStage);
  const canManage = useCan("salesLeads");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerId: 1, title: "", value: "0", source: "Referral", days: "30" });

  const create = () => {
    const expectedCloseDate = new Date();
    expectedCloseDate.setDate(expectedCloseDate.getDate() + Number(form.days || 30));
    addSalesLead({
      customerId: Number(form.customerId), title: form.title, value: form.value,
      source: form.source, stage: "NEW", probability: 10, expectedCloseDate,
    });
    setOpen(false);
  };

  const columns = [
    { key: "salesLead.title", label: "Title", render: (_v: any, row: any) => row.salesLead?.title || "-" },
    { key: "customer.name", label: "Customer", render: (_v: any, row: any) => row.customer?.name || "-" },
    { key: "salesLead.value", label: "Value", render: (_v: any, row: any) => row.salesLead?.value ? `$${Number(row.salesLead.value).toLocaleString()}` : "-" },
    { key: "salesLead.stage", label: "Stage", render: (_v: any, row: any) => <StatusBadge status={row.salesLead?.stage || ""} /> },
    { key: "salesLead.probability", label: "Probability", render: (_v: any, row: any) => `${row.salesLead?.probability || 0}%` },
    { key: "salesLead.source", label: "Source", render: (_v: any, row: any) => row.salesLead?.source || "-" },
  ];

  const flatRows = (data?.items || []).map((r: any) => ({
    title: r.salesLead?.title, customer: r.customer?.name, value: r.salesLead?.value,
    stage: r.salesLead?.stage, probability: r.salesLead?.probability, source: r.salesLead?.source,
  }));

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
        headerActions={<ExportButton filename="sales-leads" columns={[
          { key: "title", label: "Title" }, { key: "customer", label: "Customer" }, { key: "value", label: "Value" },
          { key: "stage", label: "Stage" }, { key: "probability", label: "Probability" }, { key: "source", label: "Source" },
        ]} rows={flatRows} />}
        actionButton={canManage ? { label: "New Lead", onClick: () => setOpen(true) } : undefined}
        rowActions={canManage ? (row: any) => (
          <InlineStatus value={row.salesLead?.stage} options={STAGES} onChange={(v) => updateLeadStage(row.salesLead.id, v, PROB[v])} />
        ) : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Sales Lead"
        subtitle="Add to Pipeline"
        footer={
          <>
            <ModalButton variant="ghost" onClick={() => setOpen(false)}>Cancel</ModalButton>
            <ModalButton onClick={create}>Create Lead</ModalButton>
          </>
        }
      >
        <TextField label="Lead Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Steel Plate Supply - Q3" />
        <SelectField label="Customer" value={form.customerId} onChange={(v) => setForm({ ...form, customerId: Number(v) })}
          options={customers.map((c) => ({ value: c.id, label: c.name }))} />
        <TextField label="Estimated Value ($)" type="number" value={form.value} onChange={(v) => setForm({ ...form, value: v })} />
        <SelectField label="Source" value={form.source} onChange={(v) => setForm({ ...form, source: v })}
          options={["Referral", "Cold Call", "Website", "Trade Show", "Government Tender"].map((s) => ({ value: s, label: s }))} />
        <TextField label="Expected Close (days)" type="number" value={form.days} onChange={(v) => setForm({ ...form, days: v })} />
      </Modal>
    </DashboardLayout>
  );
}
