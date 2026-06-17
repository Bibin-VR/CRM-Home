import type { UserRole } from "@/store/useAppStore";
import { users } from "@/data/seed";

export interface RoleProfile {
  name: string;
  email: string;
  department: string;
  initials: string;
  /** Short personal tagline shown on the dashboard greeting. */
  tagline: string;
  /** Calendar event categories most relevant to this role. */
  focus: string[];
}

const TAGLINES: Record<UserRole, string> = {
  CEO: "Company-wide command. Every number rolls up to you.",
  ADMIN: "People, payroll and policy — the backbone of the plant.",
  PURCHASE: "Keep the supply chain flowing and costs in check.",
  PRODUCTION: "Run the floor. Hit the schedule. Ship the work.",
  ELECTRICAL: "Power, automation and control systems uptime.",
  QUALITY: "Nothing leaves the gate without your sign-off.",
  MECHANICAL: "Machines healthy, maintenance ahead of breakdowns.",
  DESIGN: "From concept to CAD to first article.",
  SALES: "Fill the pipeline, close the deals, grow the book.",
  COASTING: "Costing, margins and quotation accuracy.",
  PROJECT_ENGINEER: "Deliver every project on time and on budget.",
  PLANT_HEAD: "Operational ownership across the whole plant.",
};

const FOCUS: Record<UserRole, string[]> = {
  CEO: ["project", "sales", "quotation", "maintenance"],
  ADMIN: ["po", "project", "maintenance"],
  PURCHASE: ["po", "task"],
  PRODUCTION: ["production", "task", "quality"],
  ELECTRICAL: ["maintenance", "task", "project"],
  QUALITY: ["quality", "production"],
  MECHANICAL: ["maintenance", "production"],
  DESIGN: ["task", "project"],
  SALES: ["sales", "quotation"],
  COASTING: ["quotation", "sales", "project"],
  PROJECT_ENGINEER: ["project", "task", "production"],
  PLANT_HEAD: ["production", "maintenance", "po", "quality", "project"],
};

export function getProfile(role: UserRole): RoleProfile {
  const user = users.find((u) => u.role === role) ?? users[0];
  const parts = user.name.split(" ");
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return {
    name: user.name,
    email: user.email,
    department: user.department,
    initials: initials.toUpperCase(),
    tagline: TAGLINES[role],
    focus: FOCUS[role],
  };
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
