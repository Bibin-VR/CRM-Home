import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  RefreshCw,
} from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTablePageProps {
  title: string;
  subtitle: string;
  columns: Column[];
  data: any[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  /** Extra header controls (export, secondary actions) rendered before the primary button. */
  headerActions?: React.ReactNode;
  /** Per-row action cell rendered as a trailing "Actions" column. */
  rowActions?: (row: any) => React.ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function DataTablePage({
  title,
  subtitle,
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
  searchPlaceholder = "Search...",
  onSearch,
  searchValue = "",
  actionButton,
  headerActions,
  rowActions,
  loading = false,
  onRefresh,
}: DataTablePageProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B0B0B] uppercase tracking-wider font-mono-data">
            {title}
          </h1>
          <p className="text-xs text-[#6B6A63] font-mono-data mt-1 uppercase tracking-widest">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="brutalist-btn flex items-center gap-2 text-xs"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          )}
          {headerActions}
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="brutalist-btn-primary flex items-center gap-2 text-xs"
            >
              <Plus className="w-3 h-3" />
              {actionButton.label}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {onSearch && (
        <div className="brutalist-card p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E61919]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-[#FBFAF7] border-2 border-[#DAD7CE] text-[#0B0B0B] pl-10 pr-4 py-2 text-sm font-mono-data focus:border-[#E61919] outline-none transition-colors"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="brutalist-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6B6A63] font-mono-data text-sm">
            Loading data...
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-[#6B6A63] font-mono-data text-sm">
            No records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="brutalist-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  {rowActions && <th className="whitespace-nowrap text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.id || idx} className="group">
                    {columns.map((col) => (
                      <td key={col.key} className="whitespace-nowrap">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key] ?? "-"}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="whitespace-nowrap text-right">{rowActions(row)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t-2 border-[#DAD7CE] bg-[#EAE8E3]">
            <div className="text-xs text-[#6B6A63] font-mono-data">
              Showing {Math.min((page - 1) * limit + 1, total)} -{" "}
              {Math.min(page * limit, total)} of {total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="brutalist-btn p-1 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-[#0B0B0B] font-mono-data px-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="brutalist-btn p-1 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
