import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  accent?: "teal" | "red" | "blue" | "amber";
}

// Soft tinted icon chips — the value stays ink-dark for hierarchy, matching the reference.
const accentMap = {
  teal: { chip: "bg-[#EAB308]/15 text-[#9A6B00]" },
  red: { chip: "bg-red-500/12 text-red-600" },
  blue: { chip: "bg-sky-500/12 text-sky-600" },
  amber: { chip: "bg-amber-500/15 text-amber-600" },
};

export default function StatCard({ title, value, subtitle, icon, accent = "teal" }: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div className="brutalist-card brutalist-card-hover p-5 rounded-3xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colors.chip}`}>
          {icon}
        </div>
        {subtitle && (
          <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-medium">
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-3xl font-semibold font-display text-[#1F1F22] mb-1">
        {value}
      </div>
      <div className="text-xs tracking-wide text-[#6B6B72]">
        {title}
      </div>
    </div>
  );
}
