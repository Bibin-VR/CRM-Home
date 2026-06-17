import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Modal, TextField, SelectField, ModalButton } from "@/components/shared/Modal";
import { ExportButton, InlineStatus, RowButton } from "@/components/shared/RowActions";
import { Pencil } from "lucide-react";

const STATUSES = ["LEAD", "PROSPECT", "ACTIVE", "INACTIVE"];
const empty = { id: 0, name: "", company: "", email: "", phone: "", industry: "", status: "LEAD" };

export default function Customers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = trpc.crm.customers.list.useQuery({
    search: search || undefined, page, limit: 20,
  });
  const addCustomer = useDataStore((s) => s.addCustomer);
  const updateCustomer = useDataStore((s) => s.updateCustomer);
  const canManage = useCan("customers");

  const [modal, setModal] = useState<null | "new" | "edit">(null);
  const [form, setForm] = useState(empty);

  const save = () => {
    if (modal === "new") addCustomer(form);
    else updateCustomer(form.id, form);
    setModal(null);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "industry", label: "Industry" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
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
        headerActions={<ExportButton filename="customers" columns={columns.map((c) => ({ key: c.key, label: c.label }))} rows={data?.items || []} />}
        actionButton={canManage ? { label: "Add Customer", onClick: () => { setForm(empty); setModal("new"); } } : undefined}
        rowActions={canManage ? (row: any) => (
          <div className="flex items-center gap-2 justify-end">
            <InlineStatus value={row.status} options={STATUSES} onChange={(v) => updateCustomer(row.id, { status: v })} />
            <RowButton label="Edit" icon={<Pencil className="w-3 h-3" />} onClick={() => { setForm({ ...row }); setModal("edit"); }} />
          </div>
        ) : undefined}
      />

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "new" ? "Add Customer" : "Edit Customer"}
        subtitle="Customer Record"
        footer={
          <>
            <ModalButton variant="ghost" onClick={() => setModal(null)}>Cancel</ModalButton>
            <ModalButton onClick={save}>{modal === "new" ? "Create" : "Save Changes"}</ModalButton>
          </>
        }
      >
        <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Customer / contact name" />
        <TextField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
        <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <TextField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <TextField label="Industry" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
        <SelectField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })}
          options={STATUSES.map((s) => ({ value: s, label: s }))} />
      </Modal>
    </DashboardLayout>
  );
}
