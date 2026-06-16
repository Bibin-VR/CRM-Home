import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  accent?: "teal" | "red" | "blue" | "amber";
}

const accentMap = {
  teal: { border: "border-[#EF4444]", bg: "bg-[#FEF2F2]", text: "text-[#EF4444]", shadow: "#EF4444" },
  red: { border: "border-[#DC2626]", bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", shadow: "#DC2626" },
  blue: { border: "border-[#3B82F6]", bg: "bg-[#EFF6FF]", text: "text-[#3B82F6]", shadow: "#3B82F6" },
  amber: { border: "border-[#F59E0B]", bg: "bg-[#FFFBEB]", text: "text-[#F59E0B]", shadow: "#F59E0B" },
};

export default function StatCard({ title, value, subtitle, icon, accent = "teal" }: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div
      className={`bg-white border-2 ${colors.border} p-5 brutalist-card-hover transition-all duration-150`}
      style={{ boxShadow: `4px 4px 0px 0px #1A1A1A` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${colors.text}`}>{icon}</div>
        {subtitle && (
          <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-mono-data">
            {subtitle}
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold font-mono-data ${colors.text} mb-1`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-[#6B7280] font-mono-data">
        {title}
      </div>
    </div>
  );
}
