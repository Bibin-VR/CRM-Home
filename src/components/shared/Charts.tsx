import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { ReactNode } from "react";

const FONT = "'JetBrains Mono', monospace";
const INK = "#0B0B0B";
const RED = "#E61919";

function ChartShell({ title, icon, children, right }: { title: string; icon?: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="brutalist-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#E61919] flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#fff",
  border: `2px solid ${INK}`,
  borderRadius: 0,
  fontFamily: FONT,
  fontSize: 11,
  textTransform: "uppercase" as const,
  boxShadow: `4px 4px 0px 0px ${INK}`,
};

const axisProps = {
  tick: { fontFamily: FONT, fontSize: 10, fill: "#6B6A63" },
  stroke: INK,
};

export function BarChartCard({
  title,
  icon,
  data,
  dataKey,
  xKey,
  color = RED,
  height = 240,
}: {
  title: string;
  icon?: ReactNode;
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}) {
  return (
    <ChartShell title={title} icon={icon}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#DAD7CE" vertical={false} />
          <XAxis dataKey={xKey} {...axisProps} interval={0} angle={0} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#FDEBEB" }} />
          <Bar dataKey={dataKey} fill={color} stroke={INK} strokeWidth={2} radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function MultiBarChartCard({
  title,
  icon,
  data,
  xKey,
  series,
  height = 260,
}: {
  title: string;
  icon?: ReactNode;
  data: any[];
  xKey: string;
  series: { key: string; color: string; label: string }[];
  height?: number;
}) {
  return (
    <ChartShell title={title} icon={icon}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#DAD7CE" vertical={false} />
          <XAxis dataKey={xKey} {...axisProps} interval={0} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#FDEBEB" }} />
          <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 10, textTransform: "uppercase" }} />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} stroke={INK} strokeWidth={2} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function LineChartCard({
  title,
  icon,
  data,
  dataKey,
  xKey,
  color = INK,
  height = 240,
}: {
  title: string;
  icon?: ReactNode;
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}) {
  return (
    <ChartShell title={title} icon={icon}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#DAD7CE" vertical={false} />
          <XAxis dataKey={xKey} {...axisProps} interval={0} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ fill: RED, stroke: INK, strokeWidth: 2, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function DonutChartCard({
  title,
  icon,
  data,
  height = 240,
  right,
}: {
  title: string;
  icon?: ReactNode;
  data: { name: string; value: number; color: string }[];
  height?: number;
  right?: ReactNode;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <ChartShell title={title} icon={icon} right={right}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            stroke={INK}
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontFamily: FONT, fontSize: 10, textTransform: "uppercase" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-2 text-[10px] font-mono-data uppercase tracking-widest text-[#8C8A80]">
        Total: {total}
      </div>
    </ChartShell>
  );
}

/** Horizontal progress bar list used for completion tracking. */
export function ProgressList({
  title,
  icon,
  items,
}: {
  title: string;
  icon?: ReactNode;
  items: { label: string; value: number; sub?: string }[];
}) {
  return (
    <ChartShell title={title} icon={icon}>
      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono-data text-[#0B0B0B] truncate pr-2">{it.label}</span>
              <span className="text-xs font-mono-data font-bold text-[#E61919]">{it.value}%</span>
            </div>
            <div className="w-full h-3 bg-[#EAE8E3] border-2 border-[#0B0B0B]">
              <div
                className="h-full bg-[#E61919] transition-all"
                style={{ width: `${Math.min(100, Math.max(0, it.value))}%` }}
              />
            </div>
            {it.sub && (
              <div className="text-[10px] font-mono-data text-[#8C8A80] mt-0.5 uppercase tracking-wider">{it.sub}</div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs font-mono-data text-[#8C8A80]">No data</div>
        )}
      </div>
    </ChartShell>
  );
}
