/**
 * Client-side seed dataset for IronGrid CRM.
 *
 * This app deploys to a static host (GitHub Pages) with no backend, so all data
 * lives here as a single in-memory source of truth shared across every role.
 * Deadlines are generated relative to "today" so the calendar shows meaningful
 * upcoming reminders and overdue warnings.
 */

const NOW = new Date();
function offsetDays(days: number): Date {
  const d = new Date(NOW);
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  isActive: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  address: string;
  status: string;
  createdAt: Date;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: string;
  costPrice: string;
  reorderLevel: number;
  status: string;
}

export interface InventoryRow {
  id: number;
  productId: number;
  productName?: string;
  sku?: string;
  warehouseLocation: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
}

export interface Vendor {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: string;
  status: string;
  paymentTerms: string;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  vendorId: number;
  vendorName?: string;
  status: string;
  totalAmount: string;
  expectedDeliveryAt: Date | null;
  createdAt: Date;
}

export interface ProductionOrder {
  id: number;
  orderNumber: string;
  productId: number;
  productName?: string;
  quantity: number;
  status: string;
  priority: string;
  workCenter: string;
  scheduledEnd: Date | null;
  progress: number;
}

export interface QualityReport {
  id: number;
  reportNumber: string;
  productId: number;
  inspectionType: string;
  status: string;
  defectCount: number;
  defectDescription: string;
  inspectionDate: Date;
}

export interface SalesLead {
  id: number;
  customerId: number;
  customerName?: string;
  title: string;
  value: string;
  stage: string;
  probability: number;
  expectedCloseDate: Date | null;
  source: string;
}

export interface Quotation {
  id: number;
  quoteNumber: string;
  customerId: number;
  customerName?: string;
  status: string;
  total: string;
  validUntil: Date | null;
}

export interface Project {
  id: number;
  projectNumber: string;
  name: string;
  customerId: number;
  customerName?: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: string;
  actualCost: string;
  progress: number;
}

export interface Task {
  id: number;
  projectId: number;
  projectName?: string;
  title: string;
  status: string;
  priority: string;
  assignedTo: number;
  assigneeName?: string;
  dueDate: Date | null;
}

export interface Employee {
  id: number;
  employeeCode: string;
  name?: string;
  designation: string;
  department: string;
  salary: string;
  employmentType: string;
}

export interface Machine {
  id: number;
  machineCode: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastMaintenanceAt: Date | null;
  nextMaintenanceAt: Date | null;
}

export interface MaintenanceLog {
  id: number;
  machineId: number;
  machineName?: string;
  maintenanceType: string;
  description: string;
  cost: string;
  status: string;
  startTime: Date;
  endTime: Date | null;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  details: string;
  createdAt: Date;
}

export const users: User[] = [
  { id: 1, name: "Panduranga Desai", email: "ceo@irongrid.com", role: "CEO", department: "Executive", phone: "+1-555-0101", isActive: true },
  { id: 2, name: "Shilpa", email: "admin@irongrid.com", role: "ADMIN", department: "HR", phone: "+1-555-0102", isActive: true },
  { id: 3, name: "Robert Chen", email: "purchase@irongrid.com", role: "PURCHASE", department: "Procurement", phone: "+1-555-0103", isActive: true },
  { id: 4, name: "Maria Garcia", email: "production@irongrid.com", role: "PRODUCTION", department: "Production", phone: "+1-555-0104", isActive: true },
  { id: 5, name: "Prashant Desai", email: "electrical@irongrid.com", role: "ELECTRICAL", department: "Electrical", phone: "+1-555-0105", isActive: true },
  { id: 6, name: "Lisa Wong", email: "quality@irongrid.com", role: "QUALITY", department: "Quality Control", phone: "+1-555-0106", isActive: true },
  { id: 7, name: "Michael Brown", email: "mechanical@irongrid.com", role: "MECHANICAL", department: "Mechanical", phone: "+1-555-0107", isActive: true },
  { id: 8, name: "Emily Davis", email: "design@irongrid.com", role: "DESIGN", department: "Design", phone: "+1-555-0108", isActive: true },
  { id: 9, name: "Alex Johnson", email: "sales@irongrid.com", role: "SALES", department: "Sales", phone: "+1-555-0109", isActive: true },
  { id: 10, name: "Rachel Green", email: "coasting@irongrid.com", role: "COASTING", department: "Finance", phone: "+1-555-0110", isActive: true },
  { id: 11, name: "Tom Wilson", email: "project@irongrid.com", role: "PROJECT_ENGINEER", department: "Projects", phone: "+1-555-0111", isActive: true },
  { id: 12, name: "Kishor Patil", email: "plant@irongrid.com", role: "PLANT_HEAD", department: "Operations", phone: "+1-555-0112", isActive: true },
];

export const customers: Customer[] = [
  { id: 1, name: "Apex Manufacturing Corp", email: "contact@apex-mfg.com", phone: "+1-555-1001", company: "Apex Manufacturing Corp", industry: "Automotive", address: "123 Industrial Blvd, Detroit, MI", status: "ACTIVE", createdAt: offsetDays(-420) },
  { id: 2, name: "Titan Steel Works", email: "orders@titansteel.com", phone: "+1-555-1002", company: "Titan Steel Works", industry: "Steel", address: "456 Forge Lane, Pittsburgh, PA", status: "ACTIVE", createdAt: offsetDays(-400) },
  { id: 3, name: "NovaTech Industries", email: "procurement@novatech.com", phone: "+1-555-1003", company: "NovaTech Industries", industry: "Electronics", address: "789 Circuit Way, San Jose, CA", status: "ACTIVE", createdAt: offsetDays(-380) },
  { id: 4, name: "GreenField Energy", email: "supply@greenfield.com", phone: "+1-555-1004", company: "GreenField Energy", industry: "Energy", address: "321 Power Plant Rd, Houston, TX", status: "PROSPECT", createdAt: offsetDays(-120) },
  { id: 5, name: "Pacific Robotics", email: "info@pacificrobots.com", phone: "+1-555-1005", company: "Pacific Robotics", industry: "Robotics", address: "654 Bot Ave, Seattle, WA", status: "ACTIVE", createdAt: offsetDays(-300) },
  { id: 6, name: "Summit Construction", email: "purchasing@summit.com", phone: "+1-555-1006", company: "Summit Construction", industry: "Construction", address: "987 Builder St, Denver, CO", status: "LEAD", createdAt: offsetDays(-45) },
  { id: 7, name: "Meridian Pharma", email: "ops@meridianpharma.com", phone: "+1-555-1007", company: "Meridian Pharma", industry: "Pharmaceutical", address: "147 Pill Dr, Boston, MA", status: "ACTIVE", createdAt: offsetDays(-260) },
  { id: 8, name: "Atlas Mining Co", email: "orders@atlasmining.com", phone: "+1-555-1008", company: "Atlas Mining Co", industry: "Mining", address: "258 Ore St, Phoenix, AZ", status: "INACTIVE", createdAt: offsetDays(-500) },
  { id: 9, name: "Vanguard Defense", email: "contracts@vanguard.com", phone: "+1-555-1009", company: "Vanguard Defense", industry: "Defense", address: "369 Shield Way, Arlington, VA", status: "ACTIVE", createdAt: offsetDays(-340) },
  { id: 10, name: "Horizon Aerospace", email: "buy@horizonaero.com", phone: "+1-555-1010", company: "Horizon Aerospace", industry: "Aerospace", address: "741 Sky Ln, Wichita, KS", status: "PROSPECT", createdAt: offsetDays(-90) },
  { id: 11, name: "Crestline Foods", email: "supply@crestline.com", phone: "+1-555-1011", company: "Crestline Foods", industry: "Food Processing", address: "852 Farm Rd, Fresno, CA", status: "ACTIVE", createdAt: offsetDays(-220) },
  { id: 12, name: "IronWorks Fabrication", email: "jobs@ironworks.com", phone: "+1-555-1012", company: "IronWorks Fabrication", industry: "Fabrication", address: "963 Weld St, Cleveland, OH", status: "LEAD", createdAt: offsetDays(-30) },
  { id: 13, name: "SolarPeak Energy", email: "procure@solarpeak.com", phone: "+1-555-1013", company: "SolarPeak Energy", industry: "Renewable Energy", address: "159 Sun Ave, San Diego, CA", status: "ACTIVE", createdAt: offsetDays(-200) },
  { id: 14, name: "DeepWater Marine", email: "ops@deepwater.com", phone: "+1-555-1014", company: "DeepWater Marine", industry: "Marine", address: "357 Dock Rd, Norfolk, VA", status: "PROSPECT", createdAt: offsetDays(-75) },
  { id: 15, name: "MetroRail Transit", email: "purchasing@metrorail.com", phone: "+1-555-1015", company: "MetroRail Transit", industry: "Transportation", address: "486 Track St, Chicago, IL", status: "ACTIVE", createdAt: offsetDays(-280) },
  { id: 16, name: "ClearStream Water", email: "supply@clearstream.com", phone: "+1-555-1016", company: "ClearStream Water", industry: "Water Treatment", address: "272 Pipe Ln, Tampa, FL", status: "LEAD", createdAt: offsetDays(-20) },
  { id: 17, name: "ProBuild Materials", email: "orders@probuild.com", phone: "+1-555-1017", company: "ProBuild Materials", industry: "Construction", address: "181 Lumber Rd, Portland, OR", status: "ACTIVE", createdAt: offsetDays(-180) },
  { id: 18, name: "DataVault Systems", email: "buy@datavault.com", phone: "+1-555-1018", company: "DataVault Systems", industry: "Data Centers", address: "393 Server St, Ashburn, VA", status: "ACTIVE", createdAt: offsetDays(-160) },
  { id: 19, name: "Global PetroChem", email: "procurement@globalpetro.com", phone: "+1-555-1019", company: "Global PetroChem", industry: "Petrochemical", address: "515 Refinery Rd, Baytown, TX", status: "ACTIVE", createdAt: offsetDays(-310) },
  { id: 20, name: "RapidLogix Supply", email: "ops@rapidlogix.com", phone: "+1-555-1020", company: "RapidLogix Supply", industry: "Logistics", address: "636 Freight Way, Memphis, TN", status: "PROSPECT", createdAt: offsetDays(-60) },
];

export const products: Product[] = [
  { id: 1, sku: "IG-Steel-001", name: "Carbon Steel Plate 10mm", description: "High-strength carbon steel plate, 10mm thickness", category: "Raw Material", unitPrice: "450.00", costPrice: "320.00", reorderLevel: 50, status: "ACTIVE" },
  { id: 2, sku: "IG-Steel-002", name: "Stainless Steel Rod 25mm", description: "316L stainless steel round bar", category: "Raw Material", unitPrice: "890.00", costPrice: "650.00", reorderLevel: 30, status: "ACTIVE" },
  { id: 3, sku: "IG-Alum-001", name: "Aluminum Sheet 5mm", description: "6061-T6 aluminum alloy sheet", category: "Raw Material", unitPrice: "380.00", costPrice: "280.00", reorderLevel: 40, status: "ACTIVE" },
  { id: 4, sku: "IG-Elec-001", name: "Industrial Control Panel", description: "PLC-based industrial control system", category: "Electrical", unitPrice: "5200.00", costPrice: "3800.00", reorderLevel: 5, status: "ACTIVE" },
  { id: 5, sku: "IG-Elec-002", name: "Variable Frequency Drive 50HP", description: "VFD for motor speed control", category: "Electrical", unitPrice: "3200.00", costPrice: "2400.00", reorderLevel: 8, status: "ACTIVE" },
  { id: 6, sku: "IG-Mech-001", name: "Hydraulic Cylinder 100T", description: "Double-acting hydraulic cylinder", category: "Mechanical", unitPrice: "1800.00", costPrice: "1350.00", reorderLevel: 10, status: "ACTIVE" },
  { id: 7, sku: "IG-Mech-002", name: "Ball Bearing Set 6205", description: "Deep groove ball bearing set", category: "Mechanical", unitPrice: "45.00", costPrice: "28.00", reorderLevel: 100, status: "ACTIVE" },
  { id: 8, sku: "IG-Mech-003", name: "Conveyor Belt 1200mm", description: "Heavy-duty rubber conveyor belt", category: "Mechanical", unitPrice: "120.00", costPrice: "85.00", reorderLevel: 20, status: "ACTIVE" },
  { id: 9, sku: "IG-Fab-001", name: "Welded Frame Assembly", description: "Custom welded structural frame", category: "Fabrication", unitPrice: "2500.00", costPrice: "1800.00", reorderLevel: 5, status: "ACTIVE" },
  { id: 10, sku: "IG-Fab-002", name: "Precision CNC Part", description: "CNC machined precision component", category: "Fabrication", unitPrice: "680.00", costPrice: "480.00", reorderLevel: 15, status: "ACTIVE" },
  { id: 11, sku: "IG-Fin-001", name: "Powder Coat Finish - Black", description: "Industrial powder coating service", category: "Finishing", unitPrice: "35.00", costPrice: "22.00", reorderLevel: 10, status: "ACTIVE" },
  { id: 12, sku: "IG-Assy-001", name: "Motor Mount Assembly", description: "Complete motor mounting assembly", category: "Assembly", unitPrice: "1450.00", costPrice: "1050.00", reorderLevel: 8, status: "ACTIVE" },
  { id: 13, sku: "IG-Assy-002", name: "Gearbox Assembly 5:1", description: "Planetary gearbox assembly", category: "Assembly", unitPrice: "3200.00", costPrice: "2400.00", reorderLevel: 6, status: "ACTIVE" },
  { id: 14, sku: "IG-Tool-001", name: "Carbide End Mill 12mm", description: "Solid carbide end mill cutter", category: "Tooling", unitPrice: "85.00", costPrice: "52.00", reorderLevel: 25, status: "ACTIVE" },
  { id: 15, sku: "IG-Tool-002", name: "Drill Bit Set HSS", description: "High-speed steel drill bit set", category: "Tooling", unitPrice: "120.00", costPrice: "78.00", reorderLevel: 20, status: "ACTIVE" },
  { id: 16, sku: "IG-Fluid-001", name: "Hydraulic Oil ISO 68", description: "Industrial hydraulic oil 205L drum", category: "Consumables", unitPrice: "380.00", costPrice: "290.00", reorderLevel: 15, status: "ACTIVE" },
  { id: 17, sku: "IG-Fluid-002", name: "Cutting Fluid Synthetic", description: "Synthetic metalworking fluid", category: "Consumables", unitPrice: "95.00", costPrice: "68.00", reorderLevel: 30, status: "ACTIVE" },
  { id: 18, sku: "IG-Safe-001", name: "Safety Helmet IG-500", description: "Industrial safety helmet", category: "Safety", unitPrice: "45.00", costPrice: "28.00", reorderLevel: 50, status: "ACTIVE" },
  { id: 19, sku: "IG-Safe-002", name: "Welding Gloves Heavy Duty", description: "Leather welding gloves pair", category: "Safety", unitPrice: "25.00", costPrice: "15.00", reorderLevel: 100, status: "ACTIVE" },
  { id: 20, sku: "IG-Meas-001", name: "Digital Caliper 300mm", description: "Digital vernier caliper", category: "Measurement", unitPrice: "180.00", costPrice: "120.00", reorderLevel: 10, status: "ACTIVE" },
];

export const inventory: InventoryRow[] = [
  { id: 1, productId: 1, warehouseLocation: "WH-A-01-05", quantityOnHand: 120, quantityReserved: 30, quantityAvailable: 90 },
  { id: 2, productId: 2, warehouseLocation: "WH-A-02-03", quantityOnHand: 45, quantityReserved: 15, quantityAvailable: 30 },
  { id: 3, productId: 3, warehouseLocation: "WH-A-01-08", quantityOnHand: 78, quantityReserved: 20, quantityAvailable: 58 },
  { id: 4, productId: 4, warehouseLocation: "WH-B-03-01", quantityOnHand: 12, quantityReserved: 3, quantityAvailable: 9 },
  { id: 5, productId: 5, warehouseLocation: "WH-B-03-04", quantityOnHand: 18, quantityReserved: 5, quantityAvailable: 13 },
  { id: 6, productId: 6, warehouseLocation: "WH-C-01-02", quantityOnHand: 25, quantityReserved: 8, quantityAvailable: 17 },
  { id: 7, productId: 7, warehouseLocation: "WH-C-02-06", quantityOnHand: 350, quantityReserved: 100, quantityAvailable: 250 },
  { id: 8, productId: 8, warehouseLocation: "WH-C-01-09", quantityOnHand: 42, quantityReserved: 12, quantityAvailable: 30 },
  { id: 9, productId: 9, warehouseLocation: "WH-D-01-03", quantityOnHand: 8, quantityReserved: 2, quantityAvailable: 6 },
  { id: 10, productId: 10, warehouseLocation: "WH-D-02-01", quantityOnHand: 35, quantityReserved: 10, quantityAvailable: 25 },
  { id: 11, productId: 11, warehouseLocation: "WH-E-01-01", quantityOnHand: 4, quantityReserved: 0, quantityAvailable: 4 },
  { id: 12, productId: 12, warehouseLocation: "WH-D-01-05", quantityOnHand: 22, quantityReserved: 6, quantityAvailable: 16 },
  { id: 13, productId: 13, warehouseLocation: "WH-D-02-04", quantityOnHand: 14, quantityReserved: 4, quantityAvailable: 10 },
  { id: 14, productId: 14, warehouseLocation: "WH-F-01-02", quantityOnHand: 85, quantityReserved: 25, quantityAvailable: 60 },
  { id: 15, productId: 15, warehouseLocation: "WH-F-01-05", quantityOnHand: 55, quantityReserved: 15, quantityAvailable: 40 },
  { id: 16, productId: 16, warehouseLocation: "WH-E-02-01", quantityOnHand: 28, quantityReserved: 8, quantityAvailable: 20 },
  { id: 17, productId: 17, warehouseLocation: "WH-E-02-03", quantityOnHand: 65, quantityReserved: 20, quantityAvailable: 45 },
  { id: 18, productId: 18, warehouseLocation: "WH-G-01-01", quantityOnHand: 200, quantityReserved: 50, quantityAvailable: 150 },
  { id: 19, productId: 19, warehouseLocation: "WH-G-01-03", quantityOnHand: 350, quantityReserved: 80, quantityAvailable: 270 },
  { id: 20, productId: 20, warehouseLocation: "WH-F-02-02", quantityOnHand: 18, quantityReserved: 5, quantityAvailable: 13 },
];

export const vendors: Vendor[] = [
  { id: 1, name: "SteelMax Supply Co", contactPerson: "John Peterson", email: "sales@steelmax.com", phone: "+1-555-2001", rating: "4.50", status: "ACTIVE", paymentTerms: "Net 30" },
  { id: 2, name: "ElectroSource International", contactPerson: "Amanda Lee", email: "orders@electrosource.com", phone: "+1-555-2002", rating: "4.80", status: "ACTIVE", paymentTerms: "Net 45" },
  { id: 3, name: "Precision Metals Ltd", contactPerson: "Carlos Rivera", email: "export@precisionmetals.com", phone: "+1-555-2003", rating: "4.20", status: "ACTIVE", paymentTerms: "Net 30" },
  { id: 4, name: "Global Fluid Systems", contactPerson: "Nancy White", email: "supply@globalfluid.com", phone: "+1-555-2004", rating: "3.90", status: "ACTIVE", paymentTerms: "Net 15" },
  { id: 5, name: "TechParts Direct", contactPerson: "Kevin Zhang", email: "b2b@techparts.com", phone: "+1-555-2005", rating: "4.60", status: "ACTIVE", paymentTerms: "Net 30" },
  { id: 6, name: "Industrial Safety Gear", contactPerson: "Pat Moore", email: "orders@safetygear.com", phone: "+1-555-2006", rating: "4.30", status: "ACTIVE", paymentTerms: "Net 30" },
  { id: 7, name: "BearingWorks Corp", contactPerson: "Sam Jackson", email: "sales@bearingworks.com", phone: "+1-555-2007", rating: "4.10", status: "ACTIVE", paymentTerms: "Net 45" },
  { id: 8, name: "Fastener World", contactPerson: "Diana Ross", email: "orders@fastenerworld.com", phone: "+1-555-2008", rating: "3.80", status: "INACTIVE", paymentTerms: "Net 15" },
  { id: 9, name: "Hydraulic Solutions Inc", contactPerson: "Bob Martinez", email: "sales@hydraulicsol.com", phone: "+1-555-2009", rating: "4.70", status: "ACTIVE", paymentTerms: "Net 30" },
  { id: 10, name: "Conveyor Systems Pro", contactPerson: "Sue Taylor", email: "orders@conveyors.com", phone: "+1-555-2010", rating: "4.40", status: "ACTIVE", paymentTerms: "Net 30" },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 1, poNumber: "PO-2026-001", vendorId: 1, status: "RECEIVED", totalAmount: "45000.00", expectedDeliveryAt: offsetDays(-25), createdAt: offsetDays(-40) },
  { id: 2, poNumber: "PO-2026-002", vendorId: 2, status: "APPROVED", totalAmount: "32000.00", expectedDeliveryAt: offsetDays(6), createdAt: offsetDays(-12) },
  { id: 3, poNumber: "PO-2026-003", vendorId: 3, status: "ORDERED", totalAmount: "18500.00", expectedDeliveryAt: offsetDays(3), createdAt: offsetDays(-10) },
  { id: 4, poNumber: "PO-2026-004", vendorId: 4, status: "PENDING", totalAmount: "7600.00", expectedDeliveryAt: offsetDays(11), createdAt: offsetDays(-4) },
  { id: 5, poNumber: "PO-2026-005", vendorId: 5, status: "DRAFT", totalAmount: "28000.00", expectedDeliveryAt: offsetDays(18), createdAt: offsetDays(-2) },
  { id: 6, poNumber: "PO-2026-006", vendorId: 6, status: "RECEIVED", totalAmount: "5200.00", expectedDeliveryAt: offsetDays(-30), createdAt: offsetDays(-45) },
  { id: 7, poNumber: "PO-2026-007", vendorId: 7, status: "ORDERED", totalAmount: "12000.00", expectedDeliveryAt: offsetDays(-2), createdAt: offsetDays(-15) },
  { id: 8, poNumber: "PO-2026-008", vendorId: 9, status: "APPROVED", totalAmount: "24500.00", expectedDeliveryAt: offsetDays(9), createdAt: offsetDays(-8) },
  { id: 9, poNumber: "PO-2026-009", vendorId: 1, status: "RECEIVED", totalAmount: "38000.00", expectedDeliveryAt: offsetDays(-18), createdAt: offsetDays(-35) },
  { id: 10, poNumber: "PO-2026-010", vendorId: 10, status: "PENDING", totalAmount: "8900.00", expectedDeliveryAt: offsetDays(14), createdAt: offsetDays(-3) },
  { id: 11, poNumber: "PO-2026-011", vendorId: 3, status: "ORDERED", totalAmount: "15200.00", expectedDeliveryAt: offsetDays(1), createdAt: offsetDays(-9) },
  { id: 12, poNumber: "PO-2026-012", vendorId: 2, status: "RECEIVED", totalAmount: "28000.00", expectedDeliveryAt: offsetDays(-22), createdAt: offsetDays(-38) },
  { id: 13, poNumber: "PO-2026-013", vendorId: 5, status: "DRAFT", totalAmount: "42000.00", expectedDeliveryAt: offsetDays(24), createdAt: offsetDays(-1) },
  { id: 14, poNumber: "PO-2026-014", vendorId: 4, status: "RECEIVED", totalAmount: "6400.00", expectedDeliveryAt: offsetDays(-28), createdAt: offsetDays(-42) },
  { id: 15, poNumber: "PO-2026-015", vendorId: 7, status: "CANCELLED", totalAmount: "8500.00", expectedDeliveryAt: null, createdAt: offsetDays(-20) },
];

export const productionOrders: ProductionOrder[] = [
  { id: 1, orderNumber: "WO-2026-001", productId: 9, quantity: 10, status: "COMPLETED", priority: "HIGH", workCenter: "FAB-01", scheduledEnd: offsetDays(-30), progress: 100 },
  { id: 2, orderNumber: "WO-2026-002", productId: 12, quantity: 20, status: "IN_PROGRESS", priority: "NORMAL", workCenter: "ASSY-01", scheduledEnd: offsetDays(8), progress: 55 },
  { id: 3, orderNumber: "WO-2026-003", productId: 10, quantity: 50, status: "SCHEDULED", priority: "NORMAL", workCenter: "CNC-01", scheduledEnd: offsetDays(16), progress: 0 },
  { id: 4, orderNumber: "WO-2026-004", productId: 13, quantity: 8, status: "IN_PROGRESS", priority: "URGENT", workCenter: "ASSY-02", scheduledEnd: offsetDays(2), progress: 70 },
  { id: 5, orderNumber: "WO-2026-005", productId: 9, quantity: 15, status: "PLANNED", priority: "NORMAL", workCenter: "FAB-02", scheduledEnd: offsetDays(21), progress: 0 },
  { id: 6, orderNumber: "WO-2026-006", productId: 12, quantity: 25, status: "IN_PROGRESS", priority: "HIGH", workCenter: "ASSY-01", scheduledEnd: offsetDays(-1), progress: 85 },
  { id: 7, orderNumber: "WO-2026-007", productId: 10, quantity: 30, status: "SCHEDULED", priority: "LOW", workCenter: "CNC-02", scheduledEnd: offsetDays(25), progress: 0 },
  { id: 8, orderNumber: "WO-2026-008", productId: 13, quantity: 12, status: "ON_HOLD", priority: "NORMAL", workCenter: "ASSY-02", scheduledEnd: offsetDays(12), progress: 30 },
  { id: 9, orderNumber: "WO-2026-009", productId: 9, quantity: 20, status: "IN_PROGRESS", priority: "NORMAL", workCenter: "FAB-01", scheduledEnd: offsetDays(5), progress: 45 },
  { id: 10, orderNumber: "WO-2026-010", productId: 12, quantity: 18, status: "PLANNED", priority: "HIGH", workCenter: "ASSY-01", scheduledEnd: offsetDays(19), progress: 0 },
  { id: 11, orderNumber: "WO-2026-011", productId: 10, quantity: 40, status: "COMPLETED", priority: "NORMAL", workCenter: "CNC-01", scheduledEnd: offsetDays(-12), progress: 100 },
  { id: 12, orderNumber: "WO-2026-012", productId: 13, quantity: 6, status: "IN_PROGRESS", priority: "URGENT", workCenter: "ASSY-02", scheduledEnd: offsetDays(4), progress: 60 },
  { id: 13, orderNumber: "WO-2026-013", productId: 9, quantity: 8, status: "SCHEDULED", priority: "NORMAL", workCenter: "FAB-01", scheduledEnd: offsetDays(15), progress: 0 },
  { id: 14, orderNumber: "WO-2026-014", productId: 12, quantity: 30, status: "COMPLETED", priority: "HIGH", workCenter: "ASSY-01", scheduledEnd: offsetDays(-5), progress: 100 },
  { id: 15, orderNumber: "WO-2026-015", productId: 10, quantity: 15, status: "IN_PROGRESS", priority: "NORMAL", workCenter: "CNC-01", scheduledEnd: offsetDays(7), progress: 40 },
];

export const qualityReports: QualityReport[] = [
  { id: 1, reportNumber: "QR-2026-001", productId: 9, inspectionType: "FINAL", status: "PASS", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-150) },
  { id: 2, reportNumber: "QR-2026-002", productId: 12, inspectionType: "IN_PROCESS", status: "PENDING", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-2) },
  { id: 3, reportNumber: "QR-2026-003", productId: 13, inspectionType: "IN_PROCESS", status: "PASS", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-90) },
  { id: 4, reportNumber: "QR-2026-004", productId: 10, inspectionType: "FINAL", status: "PASS", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-60) },
  { id: 5, reportNumber: "QR-2026-005", productId: 12, inspectionType: "FINAL", status: "FAIL", defectCount: 3, defectDescription: "Dimensional tolerance exceeded on 3 units", inspectionDate: offsetDays(-40) },
  { id: 6, reportNumber: "QR-2026-006", productId: 12, inspectionType: "IN_PROCESS", status: "REWORK", defectCount: 1, defectDescription: "Surface finish below spec", inspectionDate: offsetDays(-30) },
  { id: 7, reportNumber: "QR-2026-007", productId: 9, inspectionType: "IN_PROCESS", status: "PASS", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-20) },
  { id: 8, reportNumber: "QR-2026-008", productId: 13, inspectionType: "IN_PROCESS", status: "PENDING", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-1) },
  { id: 9, reportNumber: "QR-2026-009", productId: 1, inspectionType: "INCOMING", status: "PASS", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-15) },
  { id: 10, reportNumber: "QR-2026-010", productId: 4, inspectionType: "INCOMING", status: "PASS", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(-10) },
  { id: 11, reportNumber: "QR-2026-011", productId: 10, inspectionType: "IN_PROCESS", status: "PENDING", defectCount: 0, defectDescription: "", inspectionDate: offsetDays(0) },
  { id: 12, reportNumber: "QR-2026-012", productId: 2, inspectionType: "INCOMING", status: "FAIL", defectCount: 5, defectDescription: "Rust spots detected on 5 rods", inspectionDate: offsetDays(-5) },
];

export const salesLeads: SalesLead[] = [
  { id: 1, customerId: 1, title: "Steel Plate Supply - Q3", value: "225000.00", stage: "NEGOTIATION", probability: 80, expectedCloseDate: offsetDays(13), source: "Referral" },
  { id: 2, customerId: 2, title: "Bearing Supply Contract", value: "45000.00", stage: "PROPOSAL", probability: 60, expectedCloseDate: offsetDays(29), source: "Cold Call" },
  { id: 3, customerId: 3, title: "Control Panel Installation", value: "26000.00", stage: "QUALIFIED", probability: 70, expectedCloseDate: offsetDays(3), source: "Website" },
  { id: 4, customerId: 4, title: "Energy Sector Components", value: "180000.00", stage: "NEW", probability: 20, expectedCloseDate: offsetDays(75), source: "Trade Show" },
  { id: 5, customerId: 5, title: "Robot Assembly Parts", value: "95000.00", stage: "CLOSED_WON", probability: 100, expectedCloseDate: offsetDays(-16), source: "Referral" },
  { id: 6, customerId: 6, title: "Construction Equipment Parts", value: "320000.00", stage: "CONTACTED", probability: 40, expectedCloseDate: offsetDays(90), source: "Cold Call" },
  { id: 7, customerId: 7, title: "Pharma Equipment Upgrade", value: "145000.00", stage: "PROPOSAL", probability: 65, expectedCloseDate: offsetDays(15), source: "Website" },
  { id: 8, customerId: 9, title: "Defense Components", value: "520000.00", stage: "NEGOTIATION", probability: 75, expectedCloseDate: offsetDays(8), source: "Referral" },
  { id: 9, customerId: 10, title: "Aerospace Parts Supply", value: "380000.00", stage: "QUALIFIED", probability: 55, expectedCloseDate: offsetDays(46), source: "Trade Show" },
  { id: 10, customerId: 11, title: "Food Processing Equipment", value: "78000.00", stage: "CONTACTED", probability: 45, expectedCloseDate: offsetDays(34), source: "Cold Call" },
  { id: 11, customerId: 13, title: "Solar Panel Mounting", value: "210000.00", stage: "PROPOSAL", probability: 60, expectedCloseDate: offsetDays(60), source: "Website" },
  { id: 12, customerId: 15, title: "Rail System Components", value: "890000.00", stage: "NEGOTIATION", probability: 85, expectedCloseDate: offsetDays(40), source: "Government Tender" },
];

export const quotations: Quotation[] = [
  { id: 1, quoteNumber: "QT-2026-001", customerId: 1, status: "SENT", total: "226800.00", validUntil: offsetDays(13) },
  { id: 2, quoteNumber: "QT-2026-002", customerId: 2, status: "DRAFT", total: "45360.00", validUntil: offsetDays(29) },
  { id: 3, quoteNumber: "QT-2026-003", customerId: 5, status: "ACCEPTED", total: "95040.00", validUntil: offsetDays(-16) },
  { id: 4, quoteNumber: "QT-2026-004", customerId: 7, status: "SENT", total: "145800.00", validUntil: offsetDays(4) },
  { id: 5, quoteNumber: "QT-2026-005", customerId: 9, status: "SENT", total: "523800.00", validUntil: offsetDays(8) },
  { id: 6, quoteNumber: "QT-2026-006", customerId: 15, status: "DRAFT", total: "885600.00", validUntil: offsetDays(40) },
  { id: 7, quoteNumber: "QT-2026-007", customerId: 13, status: "DRAFT", total: "210600.00", validUntil: offsetDays(60) },
];

export const projects: Project[] = [
  { id: 1, projectNumber: "PRJ-2026-001", name: "Apex Production Line Upgrade", customerId: 1, status: "ACTIVE", startDate: offsetDays(-150), endDate: offsetDays(40), budget: "500000.00", actualCost: "320000.00", progress: 65 },
  { id: 2, projectNumber: "PRJ-2026-002", name: "NovaTech Control System", customerId: 3, status: "ACTIVE", startDate: offsetDays(-130), endDate: offsetDays(14), budget: "180000.00", actualCost: "145000.00", progress: 80 },
  { id: 3, projectNumber: "PRJ-2026-003", name: "GreenField Solar Installation", customerId: 4, status: "PLANNING", startDate: offsetDays(14), endDate: offsetDays(180), budget: "750000.00", actualCost: "50000.00", progress: 8 },
  { id: 4, projectNumber: "PRJ-2026-004", name: "Vanguard Armor Plating", customerId: 9, status: "ACTIVE", startDate: offsetDays(-95), endDate: offsetDays(60), budget: "1200000.00", actualCost: "680000.00", progress: 58 },
  { id: 5, projectNumber: "PRJ-2026-005", name: "MetroRail Extension", customerId: 15, status: "ACTIVE", startDate: offsetDays(-75), endDate: offsetDays(240), budget: "2500000.00", actualCost: "920000.00", progress: 35 },
  { id: 6, projectNumber: "PRJ-2026-006", name: "Titan Conveyor Upgrade", customerId: 2, status: "COMPLETED", startDate: offsetDays(-220), endDate: offsetDays(-18), budget: "280000.00", actualCost: "275000.00", progress: 100 },
  { id: 7, projectNumber: "PRJ-2026-007", name: "Horizon Aerospace Parts", customerId: 10, status: "ACTIVE", startDate: offsetDays(-45), endDate: offsetDays(120), budget: "650000.00", actualCost: "180000.00", progress: 28 },
];

export const tasks: Task[] = [
  { id: 1, projectId: 1, title: "Site Survey and Assessment", status: "DONE", priority: "HIGH", assignedTo: 11, dueDate: offsetDays(-140) },
  { id: 2, projectId: 1, title: "Design New Layout", status: "DONE", priority: "HIGH", assignedTo: 8, dueDate: offsetDays(-110) },
  { id: 3, projectId: 1, title: "Fabricate Components", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 4, dueDate: offsetDays(5) },
  { id: 4, projectId: 1, title: "Install Equipment", status: "TODO", priority: "HIGH", assignedTo: 5, dueDate: offsetDays(28) },
  { id: 5, projectId: 2, title: "PLC Programming", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 5, dueDate: offsetDays(2) },
  { id: 6, projectId: 2, title: "Panel Fabrication", status: "DONE", priority: "NORMAL", assignedTo: 4, dueDate: offsetDays(-30) },
  { id: 7, projectId: 2, title: "System Integration", status: "TODO", priority: "HIGH", assignedTo: 5, dueDate: offsetDays(10) },
  { id: 8, projectId: 3, title: "Design Mounting Structure", status: "TODO", priority: "NORMAL", assignedTo: 8, dueDate: offsetDays(20) },
  { id: 9, projectId: 3, title: "Material Procurement", status: "TODO", priority: "NORMAL", assignedTo: 3, dueDate: offsetDays(30) },
  { id: 10, projectId: 4, title: "Material Testing", status: "DONE", priority: "URGENT", assignedTo: 6, dueDate: offsetDays(-50) },
  { id: 11, projectId: 4, title: "Prototype Fabrication", status: "IN_PROGRESS", priority: "URGENT", assignedTo: 4, dueDate: offsetDays(-1) },
  { id: 12, projectId: 4, title: "Quality Certification", status: "TODO", priority: "HIGH", assignedTo: 6, dueDate: offsetDays(45) },
  { id: 13, projectId: 5, title: "Rail Component Design", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 8, dueDate: offsetDays(6) },
  { id: 14, projectId: 5, title: "Tooling Setup", status: "TODO", priority: "NORMAL", assignedTo: 7, dueDate: offsetDays(33) },
  { id: 15, projectId: 7, title: "CAD Modeling", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 8, dueDate: offsetDays(4) },
  { id: 16, projectId: 7, title: "CNC Programming", status: "TODO", priority: "HIGH", assignedTo: 4, dueDate: offsetDays(18) },
  { id: 17, projectId: 7, title: "First Article Inspection", status: "TODO", priority: "URGENT", assignedTo: 6, dueDate: offsetDays(40) },
];

export const employees: Employee[] = [
  { id: 1, employeeCode: "IG-CEO-001", name: "James Anderson", designation: "Chief Executive Officer", department: "Executive", salary: "250000.00", employmentType: "FULL_TIME" },
  { id: 2, employeeCode: "IG-HR-001", name: "Sarah Mitchell", designation: "HR Manager", department: "HR", salary: "95000.00", employmentType: "FULL_TIME" },
  { id: 3, employeeCode: "IG-PUR-001", name: "Robert Chen", designation: "Purchase Manager", department: "Procurement", salary: "85000.00", employmentType: "FULL_TIME" },
  { id: 4, employeeCode: "IG-PRO-001", name: "Maria Garcia", designation: "Production Supervisor", department: "Production", salary: "78000.00", employmentType: "FULL_TIME" },
  { id: 5, employeeCode: "IG-ELC-001", name: "David Kim", designation: "Electrical Engineer", department: "Electrical", salary: "88000.00", employmentType: "FULL_TIME" },
  { id: 6, employeeCode: "IG-QC-001", name: "Lisa Wong", designation: "Quality Manager", department: "Quality Control", salary: "82000.00", employmentType: "FULL_TIME" },
  { id: 7, employeeCode: "IG-MEC-001", name: "Michael Brown", designation: "Mechanical Engineer", department: "Mechanical", salary: "86000.00", employmentType: "FULL_TIME" },
  { id: 8, employeeCode: "IG-DES-001", name: "Emily Davis", designation: "Design Engineer", department: "Design", salary: "80000.00", employmentType: "FULL_TIME" },
  { id: 9, employeeCode: "IG-SAL-001", name: "Alex Johnson", designation: "Sales Manager", department: "Sales", salary: "90000.00", employmentType: "FULL_TIME" },
  { id: 10, employeeCode: "IG-CST-001", name: "Rachel Green", designation: "Costing Analyst", department: "Finance", salary: "75000.00", employmentType: "FULL_TIME" },
  { id: 11, employeeCode: "IG-PRJ-001", name: "Tom Wilson", designation: "Project Engineer", department: "Projects", salary: "92000.00", employmentType: "FULL_TIME" },
  { id: 12, employeeCode: "IG-PLT-001", name: "Karen Lee", designation: "Plant Head", department: "Operations", salary: "180000.00", employmentType: "FULL_TIME" },
  { id: 13, employeeCode: "IG-PRO-002", name: "Carlos Mendez", designation: "CNC Operator", department: "Production", salary: "52000.00", employmentType: "FULL_TIME" },
  { id: 14, employeeCode: "IG-PRO-003", name: "Frank Reyes", designation: "Welder", department: "Production", salary: "48000.00", employmentType: "FULL_TIME" },
  { id: 15, employeeCode: "IG-PRO-004", name: "Nina Patel", designation: "Assembly Technician", department: "Production", salary: "50000.00", employmentType: "FULL_TIME" },
  { id: 16, employeeCode: "IG-MEC-002", name: "George Hall", designation: "Maintenance Technician", department: "Mechanical", salary: "55000.00", employmentType: "FULL_TIME" },
  { id: 17, employeeCode: "IG-ELC-002", name: "Priya Nair", designation: "Automation Engineer", department: "Electrical", salary: "82000.00", employmentType: "FULL_TIME" },
  { id: 18, employeeCode: "IG-QC-002", name: "Derek Shaw", designation: "QC Inspector", department: "Quality Control", salary: "45000.00", employmentType: "FULL_TIME" },
  { id: 19, employeeCode: "IG-SAL-002", name: "Olivia Brooks", designation: "Sales Executive", department: "Sales", salary: "58000.00", employmentType: "FULL_TIME" },
  { id: 20, employeeCode: "IG-PRJ-002", name: "Henry Ford", designation: "Junior Project Engineer", department: "Projects", salary: "65000.00", employmentType: "FULL_TIME" },
];

export const machines: Machine[] = [
  { id: 1, machineCode: "CNC-01", name: "Haas VF-4 CNC Mill", type: "CNC Machining Center", location: "Bay A-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-33), nextMaintenanceAt: offsetDays(57) },
  { id: 2, machineCode: "CNC-02", name: "Mazak Integrex i-200", type: "Multi-Tasking Machine", location: "Bay A-02", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-58), nextMaintenanceAt: offsetDays(32) },
  { id: 3, machineCode: "LATHE-01", name: "Doosan Puma 2600", type: "CNC Lathe", location: "Bay B-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-47), nextMaintenanceAt: offsetDays(43) },
  { id: 4, machineCode: "LATHE-02", name: "Okuma LB3000", type: "CNC Lathe", location: "Bay B-02", status: "MAINTENANCE", lastMaintenanceAt: offsetDays(-7), nextMaintenanceAt: offsetDays(3) },
  { id: 5, machineCode: "LATHE-03", name: "DMG Mori NLX2500", type: "CNC Lathe", location: "Bay B-03", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-94), nextMaintenanceAt: offsetDays(-4) },
  { id: 6, machineCode: "LATHE-04", name: "Hyundai WIA L260A", type: "CNC Lathe", location: "Bay B-04", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-23), nextMaintenanceAt: offsetDays(67) },
  { id: 7, machineCode: "PRESS-01", name: "Amada HFE 1303", type: "Hydraulic Press Brake", location: "Bay C-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-68), nextMaintenanceAt: offsetDays(22) },
  { id: 8, machineCode: "PRESS-02", name: "Trumpf TruBend 7036", type: "CNC Press Brake", location: "Bay C-02", status: "BREAKDOWN", lastMaintenanceAt: offsetDays(-12), nextMaintenanceAt: offsetDays(-1) },
  { id: 9, machineCode: "WELD-01", name: "Fronius TPS 500i", type: "MIG Welding Station", location: "Bay D-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-28), nextMaintenanceAt: offsetDays(62) },
  { id: 10, machineCode: "WELD-02", name: "ESAB Aristo 500", type: "TIG Welding Station", location: "Bay D-02", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-63), nextMaintenanceAt: offsetDays(27) },
  { id: 11, machineCode: "ROBOT-01", name: "KUKA KR Quantec", type: "Industrial Robot", location: "Bay E-01", status: "IDLE", lastMaintenanceAt: offsetDays(-108), nextMaintenanceAt: offsetDays(-18) },
  { id: 12, machineCode: "GRIND-01", name: "Jung JF 520", type: "Surface Grinder", location: "Bay F-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-40), nextMaintenanceAt: offsetDays(50) },
  { id: 13, machineCode: "SAW-01", name: "Kasto Win A 4.6", type: "Band Saw", location: "Bay G-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-56), nextMaintenanceAt: offsetDays(34) },
  { id: 14, machineCode: "DRILL-01", name: "Alzmetall GS-1400", type: "Drill Press", location: "Bay H-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-36), nextMaintenanceAt: offsetDays(54) },
  { id: 15, machineCode: "HEAT-01", name: "Nabertherm N300", type: "Heat Treatment Oven", location: "Bay I-01", status: "OPERATIONAL", lastMaintenanceAt: offsetDays(-89), nextMaintenanceAt: offsetDays(1) },
];

export const maintenanceLogs: MaintenanceLog[] = [
  { id: 1, machineId: 4, maintenanceType: "PREVENTIVE", description: "Scheduled spindle bearing inspection", cost: "1200.00", status: "IN_PROGRESS", startTime: offsetDays(-2), endTime: null },
  { id: 2, machineId: 8, maintenanceType: "CORRECTIVE", description: "Hydraulic system leak repair", cost: "3500.00", status: "IN_PROGRESS", startTime: offsetDays(-1), endTime: null },
  { id: 3, machineId: 11, maintenanceType: "PREVENTIVE", description: "Robot calibration and path verification", cost: "800.00", status: "SCHEDULED", startTime: offsetDays(4), endTime: null },
  { id: 4, machineId: 1, maintenanceType: "PREVENTIVE", description: "Tool changer mechanism service", cost: "950.00", status: "COMPLETED", startTime: offsetDays(-33), endTime: offsetDays(-33) },
  { id: 5, machineId: 2, maintenanceType: "PREVENTIVE", description: "Coolant system flush and refill", cost: "600.00", status: "COMPLETED", startTime: offsetDays(-58), endTime: offsetDays(-58) },
  { id: 6, machineId: 3, maintenanceType: "PREVENTIVE", description: "Chuck and tailstock inspection", cost: "450.00", status: "COMPLETED", startTime: offsetDays(-47), endTime: offsetDays(-47) },
  { id: 7, machineId: 5, maintenanceType: "PREVENTIVE", description: "Ball screw lubrication (overdue)", cost: "350.00", status: "SCHEDULED", startTime: offsetDays(-4), endTime: null },
  { id: 8, machineId: 9, maintenanceType: "CORRECTIVE", description: "Wire feeder motor replacement", cost: "1800.00", status: "COMPLETED", startTime: offsetDays(-28), endTime: offsetDays(-28) },
];

export const notifications: Notification[] = [
  { id: 1, userId: 1, title: "Purchase Order Approved", message: "PO-2026-002 has been approved for $32,000", type: "SUCCESS", isRead: false, createdAt: offsetDays(-1) },
  { id: 2, userId: 1, title: "Quality Alert", message: "QR-2026-005: Dimensional tolerance exceeded on welded frame batch", type: "WARNING", isRead: false, createdAt: offsetDays(-2) },
  { id: 3, userId: 1, title: "Machine Down", message: "PRESS-02 (Trumpf TruBend) is in BREAKDOWN status", type: "ERROR", isRead: false, createdAt: offsetDays(-1) },
  { id: 4, userId: 3, title: "New PO Request", message: "PO-2026-005 is ready for submission to TechParts Direct", type: "INFO", isRead: false, createdAt: offsetDays(-2) },
  { id: 5, userId: 4, title: "Work Order Update", message: "WO-2026-004 marked as URGENT priority", type: "WARNING", isRead: false, createdAt: offsetDays(-3) },
  { id: 6, userId: 6, title: "Incoming Inspection", message: "New incoming material requires inspection", type: "INFO", isRead: true, createdAt: offsetDays(-4) },
  { id: 7, userId: 9, title: "Deal Won!", message: "Pacific Robotics deal closed for $95,000", type: "SUCCESS", isRead: true, createdAt: offsetDays(-16) },
  { id: 8, userId: 11, title: "Project Milestone", message: "PRJ-2026-001: Fabrication phase 65% complete", type: "INFO", isRead: false, createdAt: offsetDays(-2) },
  { id: 9, userId: 12, title: "Low Stock Alert", message: "IG-Fin-001 (Powder Coat) below reorder level", type: "WARNING", isRead: false, createdAt: offsetDays(-1) },
  { id: 10, userId: 7, title: "Maintenance Due", message: "LATHE-03 maintenance is overdue", type: "WARNING", isRead: false, createdAt: offsetDays(0) },
  { id: 11, userId: 8, title: "Design Review", message: "PRJ-2026-007 CAD models ready for review", type: "INFO", isRead: false, createdAt: offsetDays(-1) },
];

export const activityLogs: ActivityLog[] = [
  { id: 1, userId: 1, action: "APPROVED", entityType: "PURCHASE_ORDER", details: "Approved PO-2026-002 for $32,000", createdAt: offsetDays(-1) },
  { id: 2, userId: 3, action: "CREATED", entityType: "PURCHASE_ORDER", details: "Created PO-2026-005 with TechParts Direct", createdAt: offsetDays(-2) },
  { id: 3, userId: 4, action: "UPDATED", entityType: "PRODUCTION_ORDER", details: "Changed priority to URGENT for WO-2026-004", createdAt: offsetDays(-3) },
  { id: 4, userId: 6, action: "CREATED", entityType: "QUALITY_REPORT", details: "Created inspection report for WO-2026-015", createdAt: offsetDays(-1) },
  { id: 5, userId: 9, action: "WON", entityType: "SALES_LEAD", details: "Closed Pacific Robotics deal for $95,000", createdAt: offsetDays(-16) },
  { id: 6, userId: 11, action: "UPDATED", entityType: "PROJECT", details: "Updated progress to 65% for PRJ-2026-001", createdAt: offsetDays(-2) },
  { id: 7, userId: 12, action: "RECEIVED", entityType: "PURCHASE_ORDER", details: "Received 100 steel plates from SteelMax", createdAt: offsetDays(-4) },
  { id: 8, userId: 7, action: "MAINTENANCE", entityType: "MACHINE", details: "Started corrective maintenance on PRESS-02", createdAt: offsetDays(-1) },
  { id: 9, userId: 8, action: "COMPLETED", entityType: "TASK", details: "Completed Design New Layout task", createdAt: offsetDays(-5) },
  { id: 10, userId: 5, action: "INSTALLED", entityType: "PROJECT", details: "Installed control panels at NovaTech", createdAt: offsetDays(-6) },
];
