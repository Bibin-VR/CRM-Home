import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  useCalendarEvents,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type CalendarEvent,
  type EventCategory,
} from "@/data/calendar";
import {
  ChevronLeft,
  ChevronRight,
  CalendarX,
  CalendarClock,
  AlertTriangle,
  Filter,
} from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ALL_CATEGORIES: EventCategory[] = [
  "task",
  "project",
  "po",
  "maintenance",
  "quotation",
  "sales",
  "production",
];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function Calendar() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [active, setActive] = useState<Set<EventCategory>>(new Set(ALL_CATEGORIES));
  const [selected, setSelected] = useState<Date | null>(today);

  const allEvents = useCalendarEvents();
  const events = useMemo(
    () => allEvents.filter((e) => active.has(e.category)),
    [allEvents, active],
  );

  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const eventsFor = (day: Date) => events.filter((e) => sameDay(e.date, day));

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const overdue = events.filter((e) => e.overdue);
  const horizon = new Date(todayStart);
  horizon.setDate(horizon.getDate() + 45);
  const upcoming = events.filter(
    (e) => !e.overdue && !e.done && e.date >= todayStart && e.date <= horizon,
  );

  const selectedEvents = selected ? eventsFor(selected) : [];

  const toggle = (c: EventCategory) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#1F1F22] tracking-tight font-display">Calendar</h1>
            <p className="text-sm text-[#6B6B72] mt-1">
              Reminders &amp; deadline tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="brutalist-btn p-2">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="brutalist-card px-4 py-2 text-sm font-bold font-mono-data uppercase tracking-wider min-w-[180px] text-center">
              {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="brutalist-btn p-2">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today); }} className="brutalist-btn text-xs">
              Today
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="brutalist-card p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#C28A00]" />
            {ALL_CATEGORIES.map((c) => {
              const on = active.has(c);
              return (
                <button
                  key={c}
                  onClick={() => toggle(c)}
                  className="brutalist-badge transition-all"
                  style={{
                    borderColor: CATEGORY_COLORS[c],
                    color: on ? "#fff" : CATEGORY_COLORS[c],
                    backgroundColor: on ? CATEGORY_COLORS[c] : "#fff",
                    opacity: on ? 1 : 0.6,
                  }}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Month grid */}
          <div className="xl:col-span-2 brutalist-card overflow-hidden">
            <div className="grid grid-cols-7 border-b border-black/10">
              {WEEKDAYS.map((d) => (
                <div key={d} className="px-2 py-2 text-center text-[10px] uppercase tracking-widest font-mono-data text-[#6B6B72] bg-[#F1EDE1] border-r border-[#E6E1D5] last:border-r-0">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {grid.map((day, i) => {
                if (!day) return <div key={i} className="min-h-[92px] border-r border-b border-[#E6E1D5] bg-[#F4F0E6]" />;
                const dayEvents = eventsFor(day);
                const isToday = sameDay(day, today);
                const isSelected = selected && sameDay(day, selected);
                const hasOverdue = dayEvents.some((e) => e.overdue);
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(day)}
                    className={`min-h-[92px] text-left p-1.5 border-r border-b border-[#E6E1D5] transition-colors relative ${
                      isSelected ? "bg-[#FBF3D5]" : "bg-[#FFFFFF] hover:bg-[#F4F0E6]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono-data inline-flex items-center justify-center w-6 h-6 ${
                          isToday ? "bg-[#C28A00] text-white font-bold" : "text-[#1F1F22]"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {hasOverdue && <AlertTriangle className="w-3 h-3 text-[#9A6B00]" />}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className="text-[9px] font-mono-data px-1 py-0.5 truncate text-white"
                          style={{ backgroundColor: e.overdue ? "#9A6B00" : CATEGORY_COLORS[e.category] }}
                          title={e.title}
                        >
                          {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[9px] font-mono-data text-[#6B6B72]">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side panel: selected day + agenda */}
          <div className="space-y-6">
            <div className="brutalist-card p-5">
              <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#C28A00] mb-3">
                {selected ? selected.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) : "Select a day"}
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto brutalist-scroll">
                {selectedEvents.length === 0 && (
                  <div className="text-xs font-mono-data text-[#9CA3AF]">No events on this day.</div>
                )}
                {selectedEvents.map((e) => (
                  <EventRow key={e.id} e={e} />
                ))}
              </div>
            </div>

            <div className="brutalist-card p-5 border-l-4 border-l-[#9A6B00]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#9A6B00] flex items-center gap-2">
                  <CalendarX className="w-4 h-4" /> Overdue
                </h3>
                <span className="brutalist-badge border-[#9A6B00] text-[#9A6B00] bg-red-50">{overdue.length}</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto brutalist-scroll">
                {overdue.length === 0 && <div className="text-xs font-mono-data text-[#9CA3AF]">Nothing overdue.</div>}
                {overdue.map((e) => (
                  <EventRow key={e.id} e={e} />
                ))}
              </div>
            </div>

            <div className="brutalist-card p-5 border-l-4 border-l-[#C28A00]">
              <h3 className="text-sm uppercase tracking-wider font-mono-data text-[#C28A00] flex items-center gap-2 mb-3">
                <CalendarClock className="w-4 h-4" /> Next 45 Days
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto brutalist-scroll">
                {upcoming.length === 0 && <div className="text-xs font-mono-data text-[#9CA3AF]">No upcoming deadlines.</div>}
                {upcoming.map((e) => (
                  <EventRow key={e.id} e={e} showDate />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EventRow({ e, showDate }: { e: CalendarEvent; showDate?: boolean }) {
  return (
    <div
      className={`flex items-start gap-2 p-2 border ${e.overdue ? "bg-red-50 border-[#FCA5A5]" : "bg-[#F1EDE1] border-[#E6E1D5]"}`}
    >
      <div className="w-2 h-2 mt-1.5 flex-shrink-0" style={{ backgroundColor: e.overdue ? "#9A6B00" : CATEGORY_COLORS[e.category] }} />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-[#1F1F22] font-mono-data truncate">{e.title}</div>
        <div className="text-[10px] text-[#6B6B72] font-mono-data mt-0.5 uppercase tracking-wider">
          {CATEGORY_LABELS[e.category]}
          {showDate ? ` • ${e.date.toLocaleDateString()}` : ""}
          {e.done ? " • done" : ""}
        </div>
      </div>
    </div>
  );
}
