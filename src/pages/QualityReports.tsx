import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function QualityReports() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.qualityReports.list.useQuery({ page, limit: 20 });

  const columns = [
    { key: "qualityReport.reportNumber", label: "Report #", render: (_v: any, row: any) => row.qualityReport?.reportNumber || "-" },
    { key: "product.name", label: "Product", render: (_v: any, row: any) => row.product?.name || "-" },
    { key: "qualityReport.inspectionType", label: "Type", render: (_v: any, row: any) => <StatusBadge status={row.qualityReport?.inspectionType || ""} /> },
    { key: "qualityReport.status", label: "Status", render: (_v: any, row: any) => <StatusBadge status={row.qualityReport?.status || ""} /> },
    { key: "qualityReport.defectCount", label: "Defects", render: (_v: any, row: any) => (
      <span className={row.qualityReport?.defectCount > 0 ? "text-[#F43F5E] font-bold" : "text-[#2DD4BF]"}>
        {row.qualityReport?.defectCount || 0}
      </span>
    )},
    {
      key: "qualityReport.inspectionDate",
      label: "Date",
      render: (_v: any, row: any) =>
        row.qualityReport?.inspectionDate
          ? new Date(row.qualityReport.inspectionDate).toLocaleDateString()
          : "-",
    },
  ];

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
      />
    </DashboardLayout>
  );
}
