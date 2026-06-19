import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Modal, TextField, SelectField, ModalButton } from "@/components/shared/Modal";
import { ExportButton, RowButton } from "@/components/shared/RowActions";
import { Pencil } from "lucide-react";

const STATUSES = ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];

const empty = { id: 0, name: "", customerId: 1, status: "PLANNING", progress: 0, budget: "0", endDate: "" };

export default function Projects() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.projects.list.useQuery({ page, limit: 20 });
  const customers = useDataStore((s) => s.customers);
  const addProject = useDataStore((s) => s.addProject);
  const updateProject = useDataStore((s) => s.updateProject);
  const canManage = useCan("projects");

  const [modal, setModal] = useState<null | "new" | "edit">(null);
  const [form, setForm] = useState(empty);

  const openNew = () => { setForm(empty); setModal("new"); };
  const openEdit = (p: any) => {
    setForm({
      id: p.id, name: p.name, customerId: p.customerId, status: p.status,
      progress: p.progress, budget: String(p.budget),
      endDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 10) : "",
    });
    setModal("edit");
  };

  const save = () => {
    const patch = {
      name: form.name,
      customerId: Number(form.customerId),
      status: form.status,
      progress: Number(form.progress),
      budget: form.budget,
      endDate: form.endDate ? new Date(form.endDate) : null,
    };
    if (modal === "new") addProject(patch);
    else updateProject(form.id, patch);
    setModal(null);
  };

  const columns = [
    { key: "project.projectNumber", label: "Project #", render: (_v: any, row: any) => row.project?.projectNumber || "-" },
    { key: "project.name", label: "Name", render: (_v: any, row: any) => row.project?.name || "-" },
    { key: "customer.name", label: "Customer", render: (_v: any, row: any) => row.customer?.name || "-" },
    { key: "project.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.project?.status || ""} /> },
    {
      key: "project.progress",
      label: "Progress",
      render: (_v: any, row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2.5 bg-[#F1EDE1] border border-[#1F1F22]">
            <div className="h-full bg-[#C28A00] transition-all" style={{ width: `${row.project?.progress || 0}%` }} />
          </div>
          <span className="text-xs font-mono-data">{row.project?.progress || 0}%</span>
        </div>
      ),
    },
    {
      key: "project.budget",
      label: "Budget",
      render: (_v: any, row: any) => row.project?.budget ? `$${Number(row.project.budget).toLocaleString()}` : "-",
    },
  ];

  const flatRows = (data?.items || []).map((r: any) => ({
    projectNumber: r.project?.projectNumber, name: r.project?.name,
    customer: r.customer?.name, status: r.project?.status,
    progress: r.project?.progress, budget: r.project?.budget,
  }));

  return (
    <DashboardLayout>
      <DataTablePage
        title="Projects"
        subtitle="Project Portfolio Management"
        columns={columns}
        data={data?.items || []}
        total={data?.total || 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        loading={isLoading}
        onRefresh={refetch}
        headerActions={<ExportButton filename="projects" columns={[
          { key: "projectNumber", label: "Project #" }, { key: "name", label: "Name" },
          { key: "customer", label: "Customer" }, { key: "status", label: "Status" },
          { key: "progress", label: "Progress" }, { key: "budget", label: "Budget" },
        ]} rows={flatRows} />}
        actionButton={canManage ? { label: "New Project", onClick: openNew } : undefined}
        rowActions={canManage ? (row: any) => (
          <RowButton label="Manage" icon={<Pencil className="w-3 h-3" />} onClick={() => openEdit(row.project)} />
        ) : undefined}
      />

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "new" ? "New Project" : "Manage Project"}
        subtitle="Project Details & Progress"
        footer={
          <>
            <ModalButton variant="ghost" onClick={() => setModal(null)}>Cancel</ModalButton>
            <ModalButton onClick={save}>{modal === "new" ? "Create" : "Save Changes"}</ModalButton>
          </>
        }
      >
        <TextField label="Project Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Apex Line Upgrade" />
        <SelectField label="Customer" value={form.customerId} onChange={(v) => setForm({ ...form, customerId: Number(v) })}
          options={customers.map((c) => ({ value: c.id, label: c.name }))} />
        <SelectField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })}
          options={STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))} />
        <TextField label="Progress (%)" type="number" value={String(form.progress)} onChange={(v) => setForm({ ...form, progress: Number(v) })} />
        <TextField label="Budget ($)" type="number" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} />
        <TextField label="Target Completion" type="date" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} />
      </Modal>
    </DashboardLayout>
  );
}
