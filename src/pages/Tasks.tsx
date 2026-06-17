import { useState, useMemo } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Modal, TextField, SelectField, ModalButton } from "@/components/shared/Modal";
import { ExportButton, InlineStatus } from "@/components/shared/RowActions";

const STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];

export default function Tasks() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.tasks.list.useQuery({});
  const projects = useDataStore((s) => s.projects);
  const employees = useDataStore((s) => s.employees);
  const addTask = useDataStore((s) => s.addTask);
  const updateTaskStatus = useDataStore((s) => s.updateTaskStatus);
  const canManage = useCan("tasks");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", projectId: 1, priority: "NORMAL", assignedTo: 1, days: "14" });

  const create = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(form.days || 14));
    addTask({
      title: form.title, projectId: Number(form.projectId), priority: form.priority,
      assignedTo: Number(form.assignedTo), status: "TODO", dueDate,
    });
    setOpen(false);
  };

  const paginatedItems = useMemo(() => {
    if (!data?.items) return [];
    const start = (page - 1) * 20;
    return data.items.slice(start, start + 20);
  }, [data?.items, page]);

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", render: (v: string) => v ? v.substring(0, 40) + "..." : "-" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
    { key: "priority", label: "Priority", render: (v: string) => <StatusBadge status={v} /> },
    { key: "dueDate", label: "Due Date", render: (v: string) => v ? new Date(v).toLocaleDateString() : "-" },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Tasks"
        subtitle="Task Management"
        columns={columns}
        data={paginatedItems}
        total={data?.total || 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        loading={isLoading}
        onRefresh={refetch}
        headerActions={<ExportButton filename="tasks" columns={[
          { key: "title", label: "Title" }, { key: "status", label: "Status" },
          { key: "priority", label: "Priority" }, { key: "dueDate", label: "Due Date" },
        ]} rows={data?.items || []} />}
        actionButton={canManage ? { label: "New Task", onClick: () => setOpen(true) } : undefined}
        rowActions={canManage ? (row: any) => (
          <InlineStatus value={row.status} options={STATUSES} onChange={(v) => updateTaskStatus(row.id, v)} />
        ) : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Task"
        subtitle="Assign Work"
        footer={
          <>
            <ModalButton variant="ghost" onClick={() => setOpen(false)}>Cancel</ModalButton>
            <ModalButton onClick={create}>Create Task</ModalButton>
          </>
        }
      >
        <TextField label="Task Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Fabricate Components" />
        <SelectField label="Project" value={form.projectId} onChange={(v) => setForm({ ...form, projectId: Number(v) })}
          options={projects.map((p) => ({ value: p.id, label: p.name }))} />
        <SelectField label="Assigned To" value={form.assignedTo} onChange={(v) => setForm({ ...form, assignedTo: Number(v) })}
          options={employees.map((e) => ({ value: e.id, label: `${e.name} (${e.designation})` }))} />
        <SelectField label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })}
          options={PRIORITIES.map((p) => ({ value: p, label: p }))} />
        <TextField label="Due In (days)" type="number" value={form.days} onChange={(v) => setForm({ ...form, days: v })} />
      </Modal>
    </DashboardLayout>
  );
}
