import { useState } from "react";
import { trpc } from "@/providers/trpc";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataTablePage from "@/components/shared/DataTablePage";
import { AlertTriangle } from "lucide-react";

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [showLowStock, setShowLowStock] = useState(false);

  const { data, isLoading, refetch } = trpc.crm.inventory.list.useQuery({
    lowStock: showLowStock || undefined,
    page,
    limit: 20,
  });

  const columns = [
    { key: "product.sku", label: "SKU", render: (_v: any, row: any) => row.product?.sku || "-" },
    { key: "product.name", label: "Product", render: (_v: any, row: any) => row.product?.name || "-" },
    { key: "inventory.warehouseLocation", label: "Location", render: (_v: any, row: any) => row.inventory?.warehouseLocation || "-" },
    { key: "inventory.quantityOnHand", label: "On Hand", render: (_v: any, row: any) => row.inventory?.quantityOnHand || 0 },
    { key: "inventory.quantityReserved", label: "Reserved", render: (_v: any, row: any) => row.inventory?.quantityReserved || 0 },
    {
      key: "inventory.quantityAvailable",
      label: "Available",
      render: (_v: any, row: any) => {
        const qty = row.inventory?.quantityAvailable || 0;
        const isLow = qty < 20;
        return (
          <span className={`font-mono-data ${isLow ? "text-[#B3110F] font-bold" : "text-emerald-600"}`}>
            {isLow && <AlertTriangle className="w-3 h-3 inline mr-1" />}
            {qty}
          </span>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => setShowLowStock(!showLowStock)}
          className={`brutalist-btn text-xs flex items-center gap-2 ${showLowStock ? "bg-[#E61919] text-white border-[#E61919]" : ""}`}
        >
          <AlertTriangle className="w-3 h-3" />
          {showLowStock ? "Show All" : "Low Stock Only"}
        </button>
      </div>
      <DataTablePage
        title="Inventory"
        subtitle="Real-time Stock Management"
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
