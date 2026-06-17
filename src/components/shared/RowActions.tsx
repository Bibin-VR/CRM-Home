import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

/** Header button that exports the current rows to CSV. */
export function ExportButton({
  filename,
  columns,
  rows,
}: {
  filename: string;
  columns: { key: string; label: string }[];
  rows: any[];
}) {
  return (
    <button
      type="button"
      onClick={() => exportCsv(filename, columns, rows)}
      className="brutalist-btn flex items-center gap-2 text-xs"
      title="Export visible rows to CSV"
    >
      <Download className="w-3 h-3" />
      Export
    </button>
  );
}

/** Compact inline status dropdown used for "update status" row actions. */
export function InlineStatus({
  value,
  options,
  onChange,
  disabled,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  if (disabled) {
    return <span className="text-[10px] font-mono-data text-[#8C8A80] uppercase">read-only</span>;
  }
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="bg-[#FBFAF7] border-2 border-[#0B0B0B] text-[#0B0B0B] text-[11px] font-mono-data uppercase px-2 py-1 outline-none focus:border-[#E61919] cursor-pointer"
      style={{ borderRadius: 0 }}
      title="Update status"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

/** Small text button for row-level actions (Edit, Manage…). */
export function RowButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-1 border-2 border-[#0B0B0B] bg-[#FBFAF7] text-[#0B0B0B] text-[11px] font-mono-data uppercase tracking-wider px-2 py-1 hover:bg-[#E61919] hover:text-white hover:border-[#E61919] transition-colors"
      title={label}
    >
      {icon}
      {label}
    </button>
  );
}
