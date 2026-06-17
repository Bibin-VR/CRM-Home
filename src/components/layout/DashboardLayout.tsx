import { type ReactNode } from "react";
import { useAppStore } from "@/store/useAppStore";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      <Sidebar />
      <Header />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
