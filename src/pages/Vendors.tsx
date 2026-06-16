import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import StatusBadge from "@/components/shared/StatusBadge";

export default function Vendors() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.crm.vendors.list.useQuery({ page, limit: 20 });

  const columns = [
    { key: "name", label: "Vendor Name" },
    { key: "contactPerson", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "rating", label: "Rating", render: (v: string) => <span className="text-[#F59E0B] font-mono-data">{v} / 5</span> },
    { key: "paymentTerms", label: "Payment" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
  ];

  return (
    <DashboardLayout>
      <DataTablePage
        title="Vendors"
        subtitle="Supplier Database"
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
