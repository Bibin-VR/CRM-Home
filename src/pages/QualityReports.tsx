import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useDataStore } from "@/data/store";
import { useCan } from "@/data/permissions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Modal, TextField, SelectField, TextAreaField, ModalButton } from "@/components/shared/Modal";
import { ExportButton, InlineStatus } from "@/components/shared/RowActions";

const STATUSES = ["PENDING", "PASS", "FAIL", "REWORK"];
const TYPES = ["INCOMING", "IN_PROCESS", "FINAL", "AUDIT"];

export default function QualityReports() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.qualityReports.list.useQuery({ page, limit: 20 });
  const products = useDataStore((s) => s.products);
  const addQualityReport = useDataStore((s) => s.addQualityReport);
  const updateQualityStatus = useDataStore((s) => s.updateQualityStatus);
  const canManage = useCan("qualityReports");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: 1, inspectionType: "IN_PROCESS", defectCount: "0", defectDescription: "" });

  const create = () => {
    addQualityReport({
      productId: Number(form.productId), inspectionType: form.inspectionType,
      defectCount: Number(form.defectCount), defectDescription: form.defectDescription,
      status: Number(form.defectCount) > 0 ? "FAIL" : "PENDING", inspectionDate: new Date(),
    });
    setOpen(false);
  };

  const columns = [
    { key: "qualityReport.reportNumber", label: "Report #", render: (_v: any, row: any) => row.qualityReport?.reportNumber || "-" },
    { key: "product.name", label: "Product", render: (_v: any, row: any) => row.product?.name || "-" },
    { key: "qualityReport.inspectionType", label: "Type", render: (_v: any, row: any) => <StatusBadge status={row.qualityReport?.inspectionType || ""} /> },
    { key: "qualityReport.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.qualityReport?.status || ""} /> },
    { key: "qualityReport.defectCount", label: "Defects", render: (_v: any, row: any) => (
      <span className={row.qualityReport?.defectCount > 0 ? "text-[#B3110F] font-bold" : "text-emerald-600"}>
        {row.qualityReport?.defectCount || 0}
      </span>
    )},
    { key: "qualityReport.inspectionDate", label: "Date", render: (_v: any, row: any) => row.qualityReport?.inspectionDate ? new Date(row.qualityReport.inspectionDate).toLocaleDateString() : "-" },
  ];

  const flatRows = (data?.items || []).map((r: any) => ({
    reportNumber: r.qualityReport?.reportNumber, product: r.product?.name,
    type: r.qualityReport?.inspectionType, status: r.qualityReport?.status, defects: r.qualityReport?.defectCount,
  }));

  return (
    <DashboardLayout>
      <DataTablePage
        title="Quality Reports"
        subtitle="Quality Control & Inspection"
        columns={columns}
        data={data?.items || []}
        total={data?.total || 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        loading={isLoading}
        onRefresh={refetch}
        headerActions={<ExportButton filename="quality-reports" columns={[
          { key: "reportNumber", label: "Report #" }, { key: "product", label: "Product" },
          { key: "type", label: "Type" }, { key: "status", label: "Status" }, { key: "defects", label: "Defects" },
        ]} rows={flatRows} />}
        actionButton={canManage ? { label: "New Inspection", onClick: () => setOpen(true) } : undefined}
        rowActions={canManage ? (row: any) => (
          <InlineStatus value={row.qualityReport?.status} options={STATUSES} onChange={(v) => updateQualityStatus(row.qualityReport.id, v)} />
        ) : undefined}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Inspection"
        subtitle="Quality Report"
        footer={
          <>
            <ModalButton variant="ghost" onClick={() => setOpen(false)}>Cancel</ModalButton>
            <ModalButton onClick={create}>Create Report</ModalButton>
          </>
        }
      >
        <SelectField label="Product" value={form.productId} onChange={(v) => setForm({ ...form, productId: Number(v) })}
          options={products.map((p) => ({ value: p.id, label: `${p.sku} — ${p.name}` }))} />
        <SelectField label="Inspection Type" value={form.inspectionType} onChange={(v) => setForm({ ...form, inspectionType: v })}
          options={TYPES.map((t) => ({ value: t, label: t.replace(/_/g, " ") }))} />
        <TextField label="Defect Count" type="number" value={form.defectCount} onChange={(v) => setForm({ ...form, defectCount: v })} />
        <TextAreaField label="Defect Description" value={form.defectDescription} onChange={(v) => setForm({ ...form, defectDescription: v })} placeholder="Describe any defects found…" />
      </Modal>
    </DashboardLayout>
  );
}
