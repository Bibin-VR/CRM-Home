import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import InventoryPage from "./pages/InventoryPage";
import Vendors from "./pages/Vendors";
import PurchaseOrders from "./pages/PurchaseOrders";
import ProductionOrders from "./pages/ProductionOrders";
import QualityReports from "./pages/QualityReports";
import SalesLeads from "./pages/SalesLeads";
import Quotations from "./pages/Quotations";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Employees from "./pages/Employees";
import Machines from "./pages/Machines";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/products" element={<Products />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/purchase-orders" element={<PurchaseOrders />} />
      <Route path="/production-orders" element={<ProductionOrders />} />
      <Route path="/quality-reports" element={<QualityReports />} />
      <Route path="/sales-leads" element={<SalesLeads />} />
      <Route path="/quotations" element={<Quotations />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/machines" element={<Machines />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
