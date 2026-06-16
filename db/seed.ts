// @ts-nocheck
import { getDb } from "../api/queries/connection";
import {
  users,
  customers,
  products,
  inventory,
  vendors,
  purchaseOrders,
  purchaseOrderItems,
  productionOrders,
  qualityReports,
  salesLeads,
  quotations,
  projects,
  tasks,
  employees,
  machines,
  maintenanceLogs,
  notifications,
  activityLogs,
} from "./schema";

const db = getDb();

async function seed() {
  console.log("Seeding database...");

  // ─── USERS ─────────────────────────────────────────────────────
  console.log("Seeding users...");
  const userData = [
    { name: "James Anderson", email: "ceo@irongrid.com", role: "CEO", department: "Executive", phone: "+1-555-0101" },
    { name: "Sarah Mitchell", email: "admin@irongrid.com", role: "ADMIN", department: "HR", phone: "+1-555-0102" },
    { name: "Robert Chen", email: "purchase@irongrid.com", role: "PURCHASE", department: "Procurement", phone: "+1-555-0103" },
    { name: "Maria Garcia", email: "production@irongrid.com", role: "PRODUCTION", department: "Production", phone: "+1-555-0104" },
    { name: "David Kim", email: "electrical@irongrid.com", role: "ELECTRICAL", department: "Electrical", phone: "+1-555-0105" },
    { name: "Lisa Wong", email: "quality@irongrid.com", role: "QUALITY", department: "Quality Control", phone: "+1-555-0106" },
    { name: "Michael Brown", email: "mechanical@irongrid.com", role: "MECHANICAL", department: "Mechanical", phone: "+1-555-0107" },
    { name: "Emily Davis", email: "design@irongrid.com", role: "DESIGN", department: "Design", phone: "+1-555-0108" },
    { name: "Alex Johnson", email: "sales@irongrid.com", role: "SALES", department: "Sales", phone: "+1-555-0109" },
    { name: "Rachel Green", email: "coasting@irongrid.com", role: "COASTING", department: "Finance", phone: "+1-555-0110" },
    { name: "Tom Wilson", email: "project@irongrid.com", role: "PROJECT_ENGINEER", department: "Projects", phone: "+1-555-0111" },
    { name: "Karen Lee", email: "plant@irongrid.com", role: "PLANT_HEAD", department: "Operations", phone: "+1-555-0112" },
  ];
  await db.insert(users).values(userData.map((u, i) => ({ ...u, unionId: `union_${i + 1}` })));

  // ─── CUSTOMERS ─────────────────────────────────────────────────
  console.log("Seeding customers...");
  const customerData = [
    { name: "Apex Manufacturing Corp", email: "contact@apex-mfg.com", phone: "+1-555-1001", company: "Apex Manufacturing Corp", industry: "Automotive", address: "123 Industrial Blvd, Detroit, MI", status: "ACTIVE" },
    { name: "Titan Steel Works", email: "orders@titansteel.com", phone: "+1-555-1002", company: "Titan Steel Works", industry: "Steel", address: "456 Forge Lane, Pittsburgh, PA", status: "ACTIVE" },
    { name: "NovaTech Industries", email: "procurement@novatech.com", phone: "+1-555-1003", company: "NovaTech Industries", industry: "Electronics", address: "789 Circuit Way, San Jose, CA", status: "ACTIVE" },
    { name: "GreenField Energy", email: "supply@greenfield.com", phone: "+1-555-1004", company: "GreenField Energy", industry: "Energy", address: "321 Power Plant Rd, Houston, TX", status: "PROSPECT" },
    { name: "Pacific Robotics", email: "info@pacificrobots.com", phone: "+1-555-1005", company: "Pacific Robotics", industry: "Robotics", address: "654 Bot Ave, Seattle, WA", status: "ACTIVE" },
    { name: "Summit Construction", email: "purchasing@summit.com", phone: "+1-555-1006", company: "Summit Construction", industry: "Construction", address: "987 Builder St, Denver, CO", status: "LEAD" },
    { name: "Meridian Pharma", email: "ops@meridianpharma.com", phone: "+1-555-1007", company: "Meridian Pharma", industry: "Pharmaceutical", address: "147 Pill Dr, Boston, MA", status: "ACTIVE" },
    { name: "Atlas Mining Co", email: "orders@atlasmining.com", phone: "+1-555-1008", company: "Atlas Mining Co", industry: "Mining", address: "258 Ore St, Phoenix, AZ", status: "INACTIVE" },
    { name: "Vanguard Defense", email: "contracts@vanguard.com", phone: "+1-555-1009", company: "Vanguard Defense", industry: "Defense", address: "369 Shield Way, Arlington, VA", status: "ACTIVE" },
    { name: "Horizon Aerospace", email: "buy@horizonaero.com", phone: "+1-555-1010", company: "Horizon Aerospace", industry: "Aerospace", address: "741 Sky Ln, Wichita, KS", status: "PROSPECT" },
    { name: "Crestline Foods", email: "supply@crestline.com", phone: "+1-555-1011", company: "Crestline Foods", industry: "Food Processing", address: "852 Farm Rd, Fresno, CA", status: "ACTIVE" },
    { name: "IronWorks Fabrication", email: "jobs@ironworks.com", phone: "+1-555-1012", company: "IronWorks Fabrication", industry: "Fabrication", address: "963 Weld St, Cleveland, OH", status: "LEAD" },
    { name: "SolarPeak Energy", email: "procure@solarpeak.com", phone: "+1-555-1013", company: "SolarPeak Energy", industry: "Renewable Energy", address: "159 Sun Ave, San Diego, CA", status: "ACTIVE" },
    { name: "DeepWater Marine", email: "ops@deepwater.com", phone: "+1-555-1014", company: "DeepWater Marine", industry: "Marine", address: "357 Dock Rd, Norfolk, VA", status: "PROSPECT" },
    { name: "MetroRail Transit", email: "purchasing@metrorail.com", phone: "+1-555-1015", company: "MetroRail Transit", industry: "Transportation", address: "486 Track St, Chicago, IL", status: "ACTIVE" },
    { name: "ClearStream Water", email: "supply@clearstream.com", phone: "+1-555-1016", company: "ClearStream Water", industry: "Water Treatment", address: "272 Pipe Ln, Tampa, FL", status: "LEAD" },
    { name: "ProBuild Materials", email: "orders@probuild.com", phone: "+1-555-1017", company: "ProBuild Materials", industry: "Construction", address: "181 Lumber Rd, Portland, OR", status: "ACTIVE" },
    { name: "DataVault Systems", email: "buy@datavault.com", phone: "+1-555-1018", company: "DataVault Systems", industry: "Data Centers", address: "393 Server St, Ashburn, VA", status: "ACTIVE" },
    { name: "Global PetroChem", email: "procurement@globalpetro.com", phone: "+1-555-1019", company: "Global PetroChem", industry: "Petrochemical", address: "515 Refinery Rd, Baytown, TX", status: "ACTIVE" },
    { name: "RapidLogix Supply", email: "ops@rapidlogix.com", phone: "+1-555-1020", company: "RapidLogix Supply", industry: "Logistics", address: "636 Freight Way, Memphis, TN", status: "PROSPECT" },
  ];
  await db.insert(customers).values(customerData);

  // ─── PRODUCTS ──────────────────────────────────────────────────
  console.log("Seeding products...");
  const productData = [
    { sku: "IG-Steel-001", name: "Carbon Steel Plate 10mm", description: "High-strength carbon steel plate, 10mm thickness", category: "Raw Material", unitPrice: "450.00", costPrice: "320.00", reorderLevel: 50, status: "ACTIVE" },
    { sku: "IG-Steel-002", name: "Stainless Steel Rod 25mm", description: "316L stainless steel round bar", category: "Raw Material", unitPrice: "890.00", costPrice: "650.00", reorderLevel: 30, status: "ACTIVE" },
    { sku: "IG-Alum-001", name: "Aluminum Sheet 5mm", description: "6061-T6 aluminum alloy sheet", category: "Raw Material", unitPrice: "380.00", costPrice: "280.00", reorderLevel: 40, status: "ACTIVE" },
    { sku: "IG-Elec-001", name: "Industrial Control Panel", description: "PLC-based industrial control system", category: "Electrical", unitPrice: "5200.00", costPrice: "3800.00", reorderLevel: 5, status: "ACTIVE" },
    { sku: "IG-Elec-002", name: "Variable Frequency Drive 50HP", description: "VFD for motor speed control", category: "Electrical", unitPrice: "3200.00", costPrice: "2400.00", reorderLevel: 8, status: "ACTIVE" },
    { sku: "IG-Mech-001", name: "Hydraulic Cylinder 100T", description: "Double-acting hydraulic cylinder", category: "Mechanical", unitPrice: "1800.00", costPrice: "1350.00", reorderLevel: 10, status: "ACTIVE" },
    { sku: "IG-Mech-002", name: "Ball Bearing Set 6205", description: "Deep groove ball bearing set", category: "Mechanical", unitPrice: "45.00", costPrice: "28.00", reorderLevel: 100, status: "ACTIVE" },
    { sku: "IG-Mech-003", name: "Conveyor Belt 1200mm", description: "Heavy-duty rubber conveyor belt", category: "Mechanical", unitPrice: "120.00", costPrice: "85.00", reorderLevel: 20, status: "ACTIVE" },
    { sku: "IG-Fab-001", name: "Welded Frame Assembly", description: "Custom welded structural frame", category: "Fabrication", unitPrice: "2500.00", costPrice: "1800.00", reorderLevel: 5, status: "ACTIVE" },
    { sku: "IG-Fab-002", name: "Precision CNC Part", description: "CNC machined precision component", category: "Fabrication", unitPrice: "680.00", costPrice: "480.00", reorderLevel: 15, status: "ACTIVE" },
    { sku: "IG-Fin-001", name: "Powder Coat Finish - Black", description: "Industrial powder coating service", category: "Finishing", unitPrice: "35.00", costPrice: "22.00", reorderLevel: 0, status: "ACTIVE" },
    { sku: "IG-Assy-001", name: "Motor Mount Assembly", description: "Complete motor mounting assembly", category: "Assembly", unitPrice: "1450.00", costPrice: "1050.00", reorderLevel: 8, status: "ACTIVE" },
    { sku: "IG-Assy-002", name: "Gearbox Assembly 5:1", description: "Planetary gearbox assembly", category: "Assembly", unitPrice: "3200.00", costPrice: "2400.00", reorderLevel: 6, status: "ACTIVE" },
    { sku: "IG-Tool-001", name: "Carbide End Mill 12mm", description: "Solid carbide end mill cutter", category: "Tooling", unitPrice: "85.00", costPrice: "52.00", reorderLevel: 25, status: "ACTIVE" },
    { sku: "IG-Tool-002", name: "Drill Bit Set HSS", description: "High-speed steel drill bit set", category: "Tooling", unitPrice: "120.00", costPrice: "78.00", reorderLevel: 20, status: "ACTIVE" },
    { sku: "IG-Fluid-001", name: "Hydraulic Oil ISO 68", description: "Industrial hydraulic oil 205L drum", category: "Consumables", unitPrice: "380.00", costPrice: "290.00", reorderLevel: 15, status: "ACTIVE" },
    { sku: "IG-Fluid-002", name: "Cutting Fluid Synthetic", description: "Synthetic metalworking fluid", category: "Consumables", unitPrice: "95.00", costPrice: "68.00", reorderLevel: 30, status: "ACTIVE" },
    { sku: "IG-Safe-001", name: "Safety Helmet IG-500", description: "Industrial safety helmet", category: "Safety", unitPrice: "45.00", costPrice: "28.00", reorderLevel: 50, status: "ACTIVE" },
    { sku: "IG-Safe-002", name: "Welding Gloves Heavy Duty", description: "Leather welding gloves pair", category: "Safety", unitPrice: "25.00", costPrice: "15.00", reorderLevel: 100, status: "ACTIVE" },
    { sku: "IG-Meas-001", name: "Digital Caliper 300mm", description: "Digital vernier caliper", category: "Measurement", unitPrice: "180.00", costPrice: "120.00", reorderLevel: 10, status: "ACTIVE" },
  ];
  await db.insert(products).values(productData);

  // ─── INVENTORY ─────────────────────────────────────────────────
  console.log("Seeding inventory...");
  const invData = [
    { productId: 1, warehouseLocation: "WH-A-01-05", quantityOnHand: 120, quantityReserved: 30, quantityAvailable: 90, updatedBy: 2 },
    { productId: 2, warehouseLocation: "WH-A-02-03", quantityOnHand: 45, quantityReserved: 15, quantityAvailable: 30, updatedBy: 2 },
    { productId: 3, warehouseLocation: "WH-A-01-08", quantityOnHand: 78, quantityReserved: 20, quantityAvailable: 58, updatedBy: 2 },
    { productId: 4, warehouseLocation: "WH-B-03-01", quantityOnHand: 12, quantityReserved: 3, quantityAvailable: 9, updatedBy: 2 },
    { productId: 5, warehouseLocation: "WH-B-03-04", quantityOnHand: 18, quantityReserved: 5, quantityAvailable: 13, updatedBy: 2 },
    { productId: 6, warehouseLocation: "WH-C-01-02", quantityOnHand: 25, quantityReserved: 8, quantityAvailable: 17, updatedBy: 2 },
    { productId: 7, warehouseLocation: "WH-C-02-06", quantityOnHand: 350, quantityReserved: 100, quantityAvailable: 250, updatedBy: 2 },
    { productId: 8, warehouseLocation: "WH-C-01-09", quantityOnHand: 42, quantityReserved: 12, quantityAvailable: 30, updatedBy: 2 },
    { productId: 9, warehouseLocation: "WH-D-01-03", quantityOnHand: 8, quantityReserved: 2, quantityAvailable: 6, updatedBy: 2 },
    { productId: 10, warehouseLocation: "WH-D-02-01", quantityOnHand: 35, quantityReserved: 10, quantityAvailable: 25, updatedBy: 2 },
    { productId: 11, warehouseLocation: "WH-E-01-01", quantityOnHand: 0, quantityReserved: 0, quantityAvailable: 0, updatedBy: 2 },
    { productId: 12, warehouseLocation: "WH-D-01-05", quantityOnHand: 22, quantityReserved: 6, quantityAvailable: 16, updatedBy: 2 },
    { productId: 13, warehouseLocation: "WH-D-02-04", quantityOnHand: 14, quantityReserved: 4, quantityAvailable: 10, updatedBy: 2 },
    { productId: 14, warehouseLocation: "WH-F-01-02", quantityOnHand: 85, quantityReserved: 25, quantityAvailable: 60, updatedBy: 2 },
    { productId: 15, warehouseLocation: "WH-F-01-05", quantityOnHand: 55, quantityReserved: 15, quantityAvailable: 40, updatedBy: 2 },
    { productId: 16, warehouseLocation: "WH-E-02-01", quantityOnHand: 28, quantityReserved: 8, quantityAvailable: 20, updatedBy: 2 },
    { productId: 17, warehouseLocation: "WH-E-02-03", quantityOnHand: 65, quantityReserved: 20, quantityAvailable: 45, updatedBy: 2 },
    { productId: 18, warehouseLocation: "WH-G-01-01", quantityOnHand: 200, quantityReserved: 50, quantityAvailable: 150, updatedBy: 2 },
    { productId: 19, warehouseLocation: "WH-G-01-03", quantityOnHand: 350, quantityReserved: 80, quantityAvailable: 270, updatedBy: 2 },
    { productId: 20, warehouseLocation: "WH-F-02-02", quantityOnHand: 18, quantityReserved: 5, quantityAvailable: 13, updatedBy: 2 },
  ];
  await db.insert(inventory).values(invData);

  // ─── VENDORS ───────────────────────────────────────────────────
  console.log("Seeding vendors...");
  const vendorData = [
    { name: "SteelMax Supply Co", contactPerson: "John Peterson", email: "sales@steelmax.com", phone: "+1-555-2001", address: "100 Foundry Rd, Gary, IN", rating: "4.50", status: "ACTIVE", paymentTerms: "Net 30" },
    { name: "ElectroSource International", contactPerson: "Amanda Lee", email: "orders@electrosource.com", phone: "+1-555-2002", address: "200 Circuit Blvd, Austin, TX", rating: "4.80", status: "ACTIVE", paymentTerms: "Net 45" },
    { name: "Precision Metals Ltd", contactPerson: "Carlos Rivera", email: "export@precisionmetals.com", phone: "+1-555-2003", address: "300 Alloy Way, Buffalo, NY", rating: "4.20", status: "ACTIVE", paymentTerms: "Net 30" },
    { name: "Global Fluid Systems", contactPerson: "Nancy White", email: "supply@globalfluid.com", phone: "+1-555-2004", address: "400 Pipeline St, Tulsa, OK", rating: "3.90", status: "ACTIVE", paymentTerms: "Net 15" },
    { name: "TechParts Direct", contactPerson: "Kevin Zhang", email: "b2b@techparts.com", phone: "+1-555-2005", address: "500 Silicon Ave, San Jose, CA", rating: "4.60", status: "ACTIVE", paymentTerms: "Net 30" },
    { name: "Industrial Safety Gear", contactPerson: "Pat Moore", email: "orders@safetygear.com", phone: "+1-555-2006", address: "600 Guard Ln, Milwaukee, WI", rating: "4.30", status: "ACTIVE", paymentTerms: "Net 30" },
    { name: " BearingWorks Corp", contactPerson: "Sam Jackson", email: "sales@bearingworks.com", phone: "+1-555-2007", address: "700 Rotation Rd, Charlotte, NC", rating: "4.10", status: "ACTIVE", paymentTerms: "Net 45" },
    { name: "Fastener World", contactPerson: "Diana Ross", email: "orders@fastenerworld.com", phone: "+1-555-2008", address: "800 Bolt St, Cleveland, OH", rating: "3.80", status: "INACTIVE", paymentTerms: "Net 15" },
    { name: "Hydraulic Solutions Inc", contactPerson: "Bob Martinez", email: "sales@hydraulicsol.com", phone: "+1-555-2009", address: "900 Pressure Way, Houston, TX", rating: "4.70", status: "ACTIVE", paymentTerms: "Net 30" },
    { name: "Conveyor Systems Pro", contactPerson: "Sue Taylor", email: "orders@conveyors.com", phone: "+1-555-2010", address: "101 Belt Blvd, Atlanta, GA", rating: "4.40", status: "ACTIVE", paymentTerms: "Net 30" },
  ];
  await db.insert(vendors).values(vendorData);

  // ─── PURCHASE ORDERS ───────────────────────────────────────────
  console.log("Seeding purchase orders...");
  const poData = [
    { poNumber: "PO-2024-001", vendorId: 1, status: "RECEIVED", totalAmount: "45000.00", requestedBy: 3, approvedBy: 1 },
    { poNumber: "PO-2024-002", vendorId: 2, status: "APPROVED", totalAmount: "32000.00", requestedBy: 3, approvedBy: 1 },
    { poNumber: "PO-2024-003", vendorId: 3, status: "ORDERED", totalAmount: "18500.00", requestedBy: 3, approvedBy: 12 },
    { poNumber: "PO-2024-004", vendorId: 4, status: "PENDING", totalAmount: "7600.00", requestedBy: 3 },
    { poNumber: "PO-2024-005", vendorId: 5, status: "DRAFT", totalAmount: "28000.00", requestedBy: 3 },
    { poNumber: "PO-2024-006", vendorId: 6, status: "RECEIVED", totalAmount: "5200.00", requestedBy: 3, approvedBy: 12 },
    { poNumber: "PO-2024-007", vendorId: 7, status: "ORDERED", totalAmount: "12000.00", requestedBy: 3, approvedBy: 1 },
    { poNumber: "PO-2024-008", vendorId: 9, status: "APPROVED", totalAmount: "24500.00", requestedBy: 3, approvedBy: 12 },
    { poNumber: "PO-2024-009", vendorId: 1, status: "RECEIVED", totalAmount: "38000.00", requestedBy: 3, approvedBy: 1 },
    { poNumber: "PO-2024-010", vendorId: 10, status: "PENDING", totalAmount: "8900.00", requestedBy: 3 },
    { poNumber: "PO-2024-011", vendorId: 3, status: "ORDERED", totalAmount: "15200.00", requestedBy: 3, approvedBy: 12 },
    { poNumber: "PO-2024-012", vendorId: 2, status: "RECEIVED", totalAmount: "28000.00", requestedBy: 3, approvedBy: 1 },
    { poNumber: "PO-2024-013", vendorId: 5, status: "DRAFT", totalAmount: "42000.00", requestedBy: 3 },
    { poNumber: "PO-2024-014", vendorId: 4, status: "RECEIVED", totalAmount: "6400.00", requestedBy: 3, approvedBy: 12 },
    { poNumber: "PO-2024-015", vendorId: 7, status: "CANCELLED", totalAmount: "8500.00", requestedBy: 3, approvedBy: 1 },
  ];
  await db.insert(purchaseOrders).values(poData);

  // ─── PURCHASE ORDER ITEMS ──────────────────────────────────────
  console.log("Seeding purchase order items...");
  const poiData = [
    { purchaseOrderId: 1, productId: 1, quantity: 100, unitPrice: "450.00", totalPrice: "45000.00", receivedQuantity: 100 },
    { purchaseOrderId: 2, productId: 4, quantity: 10, unitPrice: "3200.00", totalPrice: "32000.00", receivedQuantity: 0 },
    { purchaseOrderId: 3, productId: 2, quantity: 50, unitPrice: "370.00", totalPrice: "18500.00", receivedQuantity: 0 },
    { purchaseOrderId: 4, productId: 16, quantity: 20, unitPrice: "380.00", totalPrice: "7600.00", receivedQuantity: 0 },
    { purchaseOrderId: 5, productId: 5, quantity: 10, unitPrice: "2800.00", totalPrice: "28000.00", receivedQuantity: 0 },
    { purchaseOrderId: 6, productId: 18, quantity: 200, unitPrice: "26.00", totalPrice: "5200.00", receivedQuantity: 200 },
    { purchaseOrderId: 7, productId: 7, quantity: 300, unitPrice: "40.00", totalPrice: "12000.00", receivedQuantity: 0 },
    { purchaseOrderId: 8, productId: 6, quantity: 15, unitPrice: "1633.33", totalPrice: "24500.00", receivedQuantity: 0 },
    { purchaseOrderId: 9, productId: 1, quantity: 80, unitPrice: "475.00", totalPrice: "38000.00", receivedQuantity: 80 },
    { purchaseOrderId: 10, productId: 8, quantity: 80, unitPrice: "111.25", totalPrice: "8900.00", receivedQuantity: 0 },
    { purchaseOrderId: 11, productId: 3, quantity: 40, unitPrice: "380.00", totalPrice: "15200.00", receivedQuantity: 0 },
    { purchaseOrderId: 12, productId: 4, quantity: 8, unitPrice: "3500.00", totalPrice: "28000.00", receivedQuantity: 8 },
    { purchaseOrderId: 13, productId: 5, quantity: 15, unitPrice: "2800.00", totalPrice: "42000.00", receivedQuantity: 0 },
    { purchaseOrderId: 14, productId: 16, quantity: 20, unitPrice: "320.00", totalPrice: "6400.00", receivedQuantity: 20 },
    { purchaseOrderId: 15, productId: 6, quantity: 5, unitPrice: "1700.00", totalPrice: "8500.00", receivedQuantity: 0 },
  ];
  await db.insert(purchaseOrderItems).values(poiData);

  // ─── PRODUCTION ORDERS ─────────────────────────────────────────
  console.log("Seeding production orders...");
  const prodData = [
    { orderNumber: "WO-2024-001", productId: 9, quantity: 10, status: "COMPLETED", priority: "HIGH", workCenter: "FAB-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-002", productId: 12, quantity: 20, status: "IN_PROGRESS", priority: "NORMAL", workCenter: "ASSY-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-003", productId: 10, quantity: 50, status: "SCHEDULED", priority: "NORMAL", workCenter: "CNC-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-004", productId: 13, quantity: 8, status: "IN_PROGRESS", priority: "URGENT", workCenter: "ASSY-02", assignedTo: 4, createdBy: 1 },
    { orderNumber: "WO-2024-005", productId: 9, quantity: 15, status: "PLANNED", priority: "NORMAL", workCenter: "FAB-02", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-006", productId: 12, quantity: 25, status: "IN_PROGRESS", priority: "HIGH", workCenter: "ASSY-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-007", productId: 10, quantity: 30, status: "SCHEDULED", priority: "LOW", workCenter: "CNC-02", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-008", productId: 13, quantity: 12, status: "ON_HOLD", priority: "NORMAL", workCenter: "ASSY-02", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-009", productId: 9, quantity: 20, status: "IN_PROGRESS", priority: "NORMAL", workCenter: "FAB-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-010", productId: 12, quantity: 18, status: "PLANNED", priority: "HIGH", workCenter: "ASSY-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-011", productId: 10, quantity: 40, status: "COMPLETED", priority: "NORMAL", workCenter: "CNC-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-012", productId: 13, quantity: 6, status: "IN_PROGRESS", priority: "URGENT", workCenter: "ASSY-02", assignedTo: 4, createdBy: 1 },
    { orderNumber: "WO-2024-013", productId: 9, quantity: 8, status: "SCHEDULED", priority: "NORMAL", workCenter: "FAB-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-014", productId: 12, quantity: 30, status: "COMPLETED", priority: "HIGH", workCenter: "ASSY-01", assignedTo: 4, createdBy: 12 },
    { orderNumber: "WO-2024-015", productId: 10, quantity: 15, status: "IN_PROGRESS", priority: "NORMAL", workCenter: "CNC-01", assignedTo: 4, createdBy: 12 },
  ];
  await db.insert(productionOrders).values(prodData);

  // ─── QUALITY REPORTS ───────────────────────────────────────────
  console.log("Seeding quality reports...");
  const qrData = [
    { reportNumber: "QR-2024-001", productionOrderId: 1, productId: 9, inspectionType: "FINAL", status: "PASS", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-01-15") },
    { reportNumber: "QR-2024-002", productionOrderId: 2, productId: 12, inspectionType: "IN_PROCESS", status: "PENDING", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-02-20") },
    { reportNumber: "QR-2024-003", productionOrderId: 4, productId: 13, inspectionType: "IN_PROCESS", status: "PASS", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-03-05") },
    { reportNumber: "QR-2024-004", productionOrderId: 11, productId: 10, inspectionType: "FINAL", status: "PASS", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-03-18") },
    { reportNumber: "QR-2024-005", productionOrderId: 14, productId: 12, inspectionType: "FINAL", status: "FAIL", inspectorId: 6, defectCount: 3, defectDescription: "Dimensional tolerance exceeded on 3 units", correctiveAction: "Recalibrate CNC machine, re-run batch", inspectionDate: new Date("2024-04-02") },
    { reportNumber: "QR-2024-006", productionOrderId: 6, productId: 12, inspectionType: "IN_PROCESS", status: "REWORK", inspectorId: 6, defectCount: 1, defectDescription: "Surface finish below spec", correctiveAction: "Re-polish affected parts", inspectionDate: new Date("2024-04-10") },
    { reportNumber: "QR-2024-007", productionOrderId: 9, productId: 9, inspectionType: "IN_PROCESS", status: "PASS", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-05-01") },
    { reportNumber: "QR-2024-008", productionOrderId: 12, productId: 13, inspectionType: "IN_PROCESS", status: "PENDING", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-05-15") },
    { reportNumber: "QR-2024-009", productId: 1, inspectionType: "INCOMING", status: "PASS", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-06-01") },
    { reportNumber: "QR-2024-010", productId: 4, inspectionType: "INCOMING", status: "PASS", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-06-05") },
    { reportNumber: "QR-2024-011", productionOrderId: 15, productId: 10, inspectionType: "IN_PROCESS", status: "PENDING", inspectorId: 6, defectCount: 0, defectDescription: "", correctiveAction: "", inspectionDate: new Date("2024-06-10") },
    { reportNumber: "QR-2024-012", productId: 2, inspectionType: "INCOMING", status: "FAIL", inspectorId: 6, defectCount: 5, defectDescription: "Rust spots detected on 5 rods", correctiveAction: "Return to supplier, request replacement", inspectionDate: new Date("2024-06-12") },
  ];
  await db.insert(qualityReports).values(qrData);

  // ─── SALES LEADS ───────────────────────────────────────────────
  console.log("Seeding sales leads...");
  const leadsData = [
    { customerId: 1, title: "Steel Plate Supply - Q3", description: "Supply 500 carbon steel plates for automotive line", value: "225000.00", stage: "NEGOTIATION", probability: 80, expectedCloseDate: new Date("2024-07-30"), assignedTo: 9, source: "Referral" },
    { customerId: 2, title: "Bearing Supply Contract", description: "Annual bearing supply contract for steel plant", value: "45000.00", stage: "PROPOSAL", probability: 60, expectedCloseDate: new Date("2024-08-15"), assignedTo: 9, source: "Cold Call" },
    { customerId: 3, title: "Control Panel Installation", description: "Install 5 industrial control panels for new line", value: "26000.00", stage: "QUALIFIED", probability: 70, expectedCloseDate: new Date("2024-07-20"), assignedTo: 9, source: "Website" },
    { customerId: 4, title: "Energy Sector Components", description: "Custom components for energy plant upgrade", value: "180000.00", stage: "NEW", probability: 20, expectedCloseDate: new Date("2024-09-30"), assignedTo: 9, source: "Trade Show" },
    { customerId: 5, title: "Robot Assembly Parts", description: "Precision parts for robotic assembly line", value: "95000.00", stage: "CLOSED_WON", probability: 100, expectedCloseDate: new Date("2024-06-01"), assignedTo: 9, source: "Referral" },
    { customerId: 6, title: "Construction Equipment Parts", description: "Heavy-duty parts for construction fleet", value: "320000.00", stage: "CONTACTED", probability: 40, expectedCloseDate: new Date("2024-10-15"), assignedTo: 9, source: "Cold Call" },
    { customerId: 7, title: "Pharma Equipment Upgrade", description: "Stainless steel components for pharma line", value: "145000.00", stage: "PROPOSAL", probability: 65, expectedCloseDate: new Date("2024-08-01"), assignedTo: 9, source: "Website" },
    { customerId: 9, title: "Defense Components", description: "Hardened components for defense application", value: "520000.00", stage: "NEGOTIATION", probability: 75, expectedCloseDate: new Date("2024-07-25"), assignedTo: 9, source: "Referral" },
    { customerId: 10, title: "Aerospace Parts Supply", description: "Titanium alloy parts for aerospace", value: "380000.00", stage: "QUALIFIED", probability: 55, expectedCloseDate: new Date("2024-09-01"), assignedTo: 9, source: "Trade Show" },
    { customerId: 11, title: "Food Processing Equipment", description: "Stainless equipment for processing line", value: "78000.00", stage: "CONTACTED", probability: 45, expectedCloseDate: new Date("2024-08-20"), assignedTo: 9, source: "Cold Call" },
    { customerId: 13, title: "Solar Panel Mounting", description: "Custom mounting frames for solar farm", value: "210000.00", stage: "PROPOSAL", probability: 60, expectedCloseDate: new Date("2024-09-15"), assignedTo: 9, source: "Website" },
    { customerId: 15, title: "Rail System Components", description: "Railway components for metro extension", value: "890000.00", stage: "NEGOTIATION", probability: 85, expectedCloseDate: new Date("2024-10-30"), assignedTo: 9, source: "Government Tender" },
  ];
  await db.insert(salesLeads).values(leadsData);

  // ─── QUOTATIONS ────────────────────────────────────────────────
  console.log("Seeding quotations...");
  const quoteData = [
    { quoteNumber: "QT-2024-001", customerId: 1, leadId: 1, status: "SENT", subtotal: "210000.00", taxAmount: "16800.00", total: "226800.00", validUntil: new Date("2024-07-30"), preparedBy: 10 },
    { quoteNumber: "QT-2024-002", customerId: 2, leadId: 2, status: "DRAFT", subtotal: "42000.00", taxAmount: "3360.00", total: "45360.00", validUntil: new Date("2024-08-15"), preparedBy: 10 },
    { quoteNumber: "QT-2024-003", customerId: 5, leadId: 5, status: "ACCEPTED", subtotal: "88000.00", taxAmount: "7040.00", total: "95040.00", validUntil: new Date("2024-06-01"), preparedBy: 10 },
    { quoteNumber: "QT-2024-004", customerId: 7, leadId: 7, status: "SENT", subtotal: "135000.00", taxAmount: "10800.00", total: "145800.00", validUntil: new Date("2024-08-01"), preparedBy: 10 },
    { quoteNumber: "QT-2024-005", customerId: 9, leadId: 8, status: "SENT", subtotal: "485000.00", taxAmount: "38800.00", total: "523800.00", validUntil: new Date("2024-07-25"), preparedBy: 10 },
    { quoteNumber: "QT-2024-006", customerId: 15, leadId: 12, status: "DRAFT", subtotal: "820000.00", taxAmount: "65600.00", total: "885600.00", validUntil: new Date("2024-10-30"), preparedBy: 10 },
    { quoteNumber: "QT-2024-007", customerId: 13, leadId: 11, status: "DRAFT", subtotal: "195000.00", taxAmount: "15600.00", total: "210600.00", validUntil: new Date("2024-09-15"), preparedBy: 10 },
  ];
  await db.insert(quotations).values(quoteData);

  // ─── PROJECTS ──────────────────────────────────────────────────
  console.log("Seeding projects...");
  const projData = [
    { projectNumber: "PRJ-2024-001", name: "Apex Production Line Upgrade", description: "Upgrade existing production line for Apex Manufacturing", customerId: 1, status: "ACTIVE", startDate: new Date("2024-01-15"), endDate: new Date("2024-08-30"), budget: "500000.00", actualCost: "320000.00", projectManagerId: 11, progress: 65 },
    { projectNumber: "PRJ-2024-002", name: "NovaTech Control System", description: "Design and install new PLC control system for NovaTech", customerId: 3, status: "ACTIVE", startDate: new Date("2024-02-01"), endDate: new Date("2024-07-15"), budget: "180000.00", actualCost: "145000.00", projectManagerId: 11, progress: 80 },
    { projectNumber: "PRJ-2024-003", name: "GreenField Solar Installation", description: "Solar mounting structure fabrication and installation", customerId: 4, status: "PLANNING", startDate: new Date("2024-07-01"), endDate: new Date("2024-12-31"), budget: "750000.00", actualCost: "50000.00", projectManagerId: 11, progress: 8 },
    { projectNumber: "PRJ-2024-004", name: "Vanguard Armor Plating", description: "Ballistic armor plate manufacturing project", customerId: 9, status: "ACTIVE", startDate: new Date("2024-03-15"), endDate: new Date("2024-10-30"), budget: "1200000.00", actualCost: "680000.00", projectManagerId: 11, progress: 58 },
    { projectNumber: "PRJ-2024-005", name: "MetroRail Extension", description: "Rail components for metro line extension", customerId: 15, status: "ACTIVE", startDate: new Date("2024-04-01"), endDate: new Date("2025-03-31"), budget: "2500000.00", actualCost: "920000.00", projectManagerId: 11, progress: 35 },
    { projectNumber: "PRJ-2024-006", name: "Titan Conveyor Upgrade", description: "Replace conveyor system in steel plant", customerId: 2, status: "COMPLETED", startDate: new Date("2023-11-01"), endDate: new Date("2024-05-30"), budget: "280000.00", actualCost: "275000.00", projectManagerId: 11, progress: 100 },
    { projectNumber: "PRJ-2024-007", name: "Horizon Aerospace Parts", description: "Titanium component manufacturing for aerospace", customerId: 10, status: "ACTIVE", startDate: new Date("2024-05-01"), endDate: new Date("2024-12-15"), budget: "650000.00", actualCost: "180000.00", projectManagerId: 11, progress: 28 },
  ];
  await db.insert(projects).values(projData);

  // ─── TASKS ─────────────────────────────────────────────────────
  console.log("Seeding tasks...");
  const taskData = [
    { projectId: 1, title: "Site Survey and Assessment", description: "Complete site survey of existing line", status: "DONE", priority: "HIGH", assignedTo: 11, dueDate: new Date("2024-01-30") },
    { projectId: 1, title: "Design New Layout", description: "Design optimized production layout", status: "DONE", priority: "HIGH", assignedTo: 8, dueDate: new Date("2024-02-28") },
    { projectId: 1, title: "Fabricate Components", description: "Fabricate custom components for upgrade", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 4, dueDate: new Date("2024-06-30") },
    { projectId: 1, title: "Install Equipment", description: "Install and commission new equipment", status: "TODO", priority: "HIGH", assignedTo: 5, dueDate: new Date("2024-08-15") },
    { projectId: 2, title: "PLC Programming", description: "Program Siemens S7-1500 PLC", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 5, dueDate: new Date("2024-06-15") },
    { projectId: 2, title: "Panel Fabrication", description: "Fabricate control panels", status: "DONE", priority: "NORMAL", assignedTo: 4, dueDate: new Date("2024-04-30") },
    { projectId: 2, title: "System Integration", description: "Integrate with existing SCADA", status: "TODO", priority: "HIGH", assignedTo: 5, dueDate: new Date("2024-07-01") },
    { projectId: 3, title: "Design Mounting Structure", description: "Design custom solar mounting frames", status: "TODO", priority: "NORMAL", assignedTo: 8, dueDate: new Date("2024-07-30") },
    { projectId: 3, title: "Material Procurement", description: "Procure aluminum and fasteners", status: "TODO", priority: "NORMAL", assignedTo: 3, dueDate: new Date("2024-08-15") },
    { projectId: 4, title: "Material Testing", description: "Test ballistic properties of steel", status: "DONE", priority: "URGENT", assignedTo: 6, dueDate: new Date("2024-04-15") },
    { projectId: 4, title: "Prototype Fabrication", description: "Fabricate prototype armor plates", status: "IN_PROGRESS", priority: "URGENT", assignedTo: 4, dueDate: new Date("2024-07-30") },
    { projectId: 4, title: "Quality Certification", description: "Obtain defense quality certification", status: "TODO", priority: "HIGH", assignedTo: 6, dueDate: new Date("2024-09-30") },
    { projectId: 5, title: "Rail Component Design", description: "Design rail clips and fasteners", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 8, dueDate: new Date("2024-06-30") },
    { projectId: 5, title: "Tooling Setup", description: "Setup dedicated tooling for rail parts", status: "TODO", priority: "NORMAL", assignedTo: 7, dueDate: new Date("2024-08-30") },
    { projectId: 7, title: "CAD Modeling", description: "Create 3D models for aerospace parts", status: "IN_PROGRESS", priority: "HIGH", assignedTo: 8, dueDate: new Date("2024-06-30") },
    { projectId: 7, title: "CNC Programming", description: "Create 5-axis CNC programs", status: "TODO", priority: "HIGH", assignedTo: 4, dueDate: new Date("2024-08-15") },
    { projectId: 7, title: "First Article Inspection", description: "Complete FAI for all parts", status: "TODO", priority: "URGENT", assignedTo: 6, dueDate: new Date("2024-09-30") },
  ];
  await db.insert(tasks).values(taskData);

  // ─── EMPLOYEES ─────────────────────────────────────────────────
  console.log("Seeding employees...");
  const empData = [
    { userId: 1, employeeCode: "IG-CEO-001", designation: "Chief Executive Officer", department: "Executive", salary: "250000.00", employmentType: "FULL_TIME" },
    { userId: 2, employeeCode: "IG-HR-001", designation: "HR Manager", department: "HR", salary: "95000.00", employmentType: "FULL_TIME" },
    { userId: 3, employeeCode: "IG-PUR-001", designation: "Purchase Manager", department: "Procurement", salary: "85000.00", employmentType: "FULL_TIME" },
    { userId: 4, employeeCode: "IG-PRO-001", designation: "Production Supervisor", department: "Production", salary: "78000.00", employmentType: "FULL_TIME" },
    { userId: 5, employeeCode: "IG-ELC-001", designation: "Electrical Engineer", department: "Electrical", salary: "88000.00", employmentType: "FULL_TIME" },
    { userId: 6, employeeCode: "IG-QC-001", designation: "Quality Manager", department: "Quality Control", salary: "82000.00", employmentType: "FULL_TIME" },
    { userId: 7, employeeCode: "IG-MEC-001", designation: "Mechanical Engineer", department: "Mechanical", salary: "86000.00", employmentType: "FULL_TIME" },
    { userId: 8, employeeCode: "IG-DES-001", designation: "Design Engineer", department: "Design", salary: "80000.00", employmentType: "FULL_TIME" },
    { userId: 9, employeeCode: "IG-SAL-001", designation: "Sales Manager", department: "Sales", salary: "90000.00", employmentType: "FULL_TIME" },
    { userId: 10, employeeCode: "IG-CST-001", designation: "Costing Analyst", department: "Finance", salary: "75000.00", employmentType: "FULL_TIME" },
    { userId: 11, employeeCode: "IG-PRJ-001", designation: "Project Engineer", department: "Projects", salary: "92000.00", employmentType: "FULL_TIME" },
    { userId: 12, employeeCode: "IG-PLT-001", designation: "Plant Head", department: "Operations", salary: "180000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-PRO-002", designation: "CNC Operator", department: "Production", salary: "52000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-PRO-003", designation: "Welder", department: "Production", salary: "48000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-PRO-004", designation: "Assembly Technician", department: "Production", salary: "50000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-MEC-002", designation: "Maintenance Technician", department: "Mechanical", salary: "55000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-ELC-002", designation: "Automation Engineer", department: "Electrical", salary: "82000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-QC-002", designation: "QC Inspector", department: "Quality Control", salary: "45000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-SAL-002", designation: "Sales Executive", department: "Sales", salary: "58000.00", employmentType: "FULL_TIME" },
    { employeeCode: "IG-PRJ-002", designation: "Junior Project Engineer", department: "Projects", salary: "65000.00", employmentType: "FULL_TIME" },
  ];
  await db.insert(employees).values(empData);

  // ─── MACHINES ──────────────────────────────────────────────────
  console.log("Seeding machines...");
  const machineData = [
    { machineCode: "CNC-01", name: "Haas VF-4 CNC Mill", type: "CNC Machining Center", location: "Bay A-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-05-15"), nextMaintenanceAt: new Date("2024-08-15") },
    { machineCode: "CNC-02", name: "Mazak Integrex i-200", type: "Multi-Tasking Machine", location: "Bay A-02", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-04-20"), nextMaintenanceAt: new Date("2024-07-20") },
    { machineCode: "LATHE-01", name: "Doosan Puma 2600", type: "CNC Lathe", location: "Bay B-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-05-01"), nextMaintenanceAt: new Date("2024-08-01") },
    { machineCode: "LATHE-02", name: "Okuma LB3000", type: "CNC Lathe", location: "Bay B-02", status: "MAINTENANCE", lastMaintenanceAt: new Date("2024-06-10"), nextMaintenanceAt: new Date("2024-06-20") },
    { machineCode: "LATHE-03", name: "DMG Mori NLX2500", type: "CNC Lathe", location: "Bay B-03", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-03-15"), nextMaintenanceAt: new Date("2024-06-15") },
    { machineCode: "LATHE-04", name: "Hyundai WIA L260A", type: "CNC Lathe", location: "Bay B-04", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-05-25"), nextMaintenanceAt: new Date("2024-08-25") },
    { machineCode: "PRESS-01", name: "Amada HFE 1303", type: "Hydraulic Press Brake", location: "Bay C-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-04-10"), nextMaintenanceAt: new Date("2024-07-10") },
    { machineCode: "PRESS-02", name: "Trumpf TruBend 7036", type: "CNC Press Brake", location: "Bay C-02", status: "BREAKDOWN", lastMaintenanceAt: new Date("2024-06-05"), nextMaintenanceAt: new Date("2024-06-18") },
    { machineCode: "WELD-01", name: "Fronius TPS 500i", type: "MIG Welding Station", location: "Bay D-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-05-20"), nextMaintenanceAt: new Date("2024-08-20") },
    { machineCode: "WELD-02", name: "ESAB Aristo 500", type: "TIG Welding Station", location: "Bay D-02", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-04-15"), nextMaintenanceAt: new Date("2024-07-15") },
    { machineCode: "ROBOT-01", name: "KUKA KR Quantec", type: "Industrial Robot", location: "Bay E-01", status: "IDLE", lastMaintenanceAt: new Date("2024-03-01"), nextMaintenanceAt: new Date("2024-06-01") },
    { machineCode: "GRIND-01", name: "Jung JF 520", type: "Surface Grinder", location: "Bay F-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-05-08"), nextMaintenanceAt: new Date("2024-08-08") },
    { machineCode: "SAW-01", name: "Kasto Win A 4.6", type: "Band Saw", location: "Bay G-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-04-22"), nextMaintenanceAt: new Date("2024-07-22") },
    { machineCode: "DRILL-01", name: " Alzmetall GS-1400", type: "Drill Press", location: "Bay H-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-05-12"), nextMaintenanceAt: new Date("2024-08-12") },
    { machineCode: "HEAT-01", name: "Nabertherm N300", type: "Heat Treatment Oven", location: "Bay I-01", status: "OPERATIONAL", lastMaintenanceAt: new Date("2024-03-20"), nextMaintenanceAt: new Date("2024-06-20") },
  ];
  await db.insert(machines).values(machineData);

  // ─── MAINTENANCE LOGS ──────────────────────────────────────────
  console.log("Seeding maintenance logs...");
  const maintData = [
    { machineId: 4, maintenanceType: "PREVENTIVE", description: "Scheduled spindle bearing inspection", performedBy: 7, cost: "1200.00", startTime: new Date("2024-06-10T08:00:00"), endTime: new Date("2024-06-12T16:00:00"), status: "COMPLETED" },
    { machineId: 8, maintenanceType: "CORRECTIVE", description: "Hydraulic system leak repair", performedBy: 7, cost: "3500.00", startTime: new Date("2024-06-05T09:00:00"), status: "IN_PROGRESS" },
    { machineId: 11, maintenanceType: "PREVENTIVE", description: "Robot calibration and path verification", performedBy: 5, cost: "800.00", startTime: new Date("2024-06-01T08:00:00"), endTime: new Date("2024-06-01T14:00:00"), status: "COMPLETED" },
    { machineId: 1, maintenanceType: "PREVENTIVE", description: "Tool changer mechanism service", performedBy: 7, cost: "950.00", startTime: new Date("2024-05-15T08:00:00"), endTime: new Date("2024-05-15T16:00:00"), status: "COMPLETED" },
    { machineId: 2, maintenanceType: "PREVENTIVE", description: "Coolant system flush and refill", performedBy: 7, cost: "600.00", startTime: new Date("2024-04-20T08:00:00"), endTime: new Date("2024-04-20T12:00:00"), status: "COMPLETED" },
    { machineId: 3, maintenanceType: "PREVENTIVE", description: "Chuck and tailstock inspection", performedBy: 7, cost: "450.00", startTime: new Date("2024-05-01T08:00:00"), endTime: new Date("2024-05-01T14:00:00"), status: "COMPLETED" },
    { machineId: 6, maintenanceType: "PREVENTIVE", description: "Ball screw lubrication", performedBy: 7, cost: "350.00", startTime: new Date("2024-05-25T08:00:00"), endTime: new Date("2024-05-25T11:00:00"), status: "COMPLETED" },
    { machineId: 9, maintenanceType: "CORRECTIVE", description: "Wire feeder motor replacement", performedBy: 5, cost: "1800.00", startTime: new Date("2024-05-20T10:00:00"), endTime: new Date("2024-05-20T18:00:00"), status: "COMPLETED" },
  ];
  await db.insert(maintenanceLogs).values(maintData);

  // ─── NOTIFICATIONS ─────────────────────────────────────────────
  console.log("Seeding notifications...");
  const notifData = [
    { userId: 1, title: "Purchase Order Approved", message: "PO-2024-002 has been approved for $32,000", type: "SUCCESS", relatedEntityType: "PURCHASE_ORDER", relatedEntityId: 2 },
    { userId: 1, title: "Quality Alert", message: "QR-2024-005: Dimensional tolerance exceeded on welded frame batch", type: "WARNING", relatedEntityType: "QUALITY_REPORT", relatedEntityId: 5 },
    { userId: 1, title: "Machine Down", message: "PRESS-02 (Trumpf TruBend) is in BREAKDOWN status", type: "ERROR", relatedEntityType: "MACHINE", relatedEntityId: 8 },
    { userId: 3, title: "New PO Request", message: "PO-2024-005 is ready for submission to TechParts Direct", type: "INFO", relatedEntityType: "PURCHASE_ORDER", relatedEntityId: 5 },
    { userId: 4, title: "Work Order Update", message: "WO-2024-004 marked as URGENT priority", type: "WARNING", relatedEntityType: "PRODUCTION_ORDER", relatedEntityId: 4 },
    { userId: 6, title: "Incoming Inspection", message: "New incoming material requires inspection", type: "INFO", relatedEntityType: "QUALITY_REPORT", relatedEntityId: 9 },
    { userId: 9, title: "Deal Won!", message: "Pacific Robotics deal closed for $95,000", type: "SUCCESS", relatedEntityType: "SALES_LEAD", relatedEntityId: 5 },
    { userId: 11, title: "Project Milestone", message: "PRJ-2024-001: Fabrication phase 65% complete", type: "INFO", relatedEntityType: "PROJECT", relatedEntityId: 1 },
    { userId: 12, title: "Low Stock Alert", message: "IG-Fluid-001 (Hydraulic Oil) below reorder level", type: "WARNING", relatedEntityType: "INVENTORY", relatedEntityId: 16 },
    { userId: 1, title: "Employee Onboarding", message: "New hire starting in Production department next week", type: "INFO", relatedEntityType: "EMPLOYEE" },
    { userId: 7, title: "Maintenance Due", message: "CNC-02 maintenance scheduled for July 20", type: "INFO", relatedEntityType: "MACHINE", relatedEntityId: 2 },
    { userId: 8, title: "Design Review", message: "PRJ-2024-007 CAD models ready for review", type: "INFO", relatedEntityType: "PROJECT", relatedEntityId: 7 },
  ];
  await db.insert(notifications).values(notifData);

  // ─── ACTIVITY LOGS ─────────────────────────────────────────────
  console.log("Seeding activity logs...");
  const actData = [
    { userId: 1, action: "APPROVED", entityType: "PURCHASE_ORDER", entityId: 2, details: "Approved PO-2024-002 for $32,000" },
    { userId: 3, action: "CREATED", entityType: "PURCHASE_ORDER", entityId: 5, details: "Created PO-2024-005 with TechParts Direct" },
    { userId: 4, action: "UPDATED", entityType: "PRODUCTION_ORDER", entityId: 4, details: "Changed priority to URGENT for WO-2024-004" },
    { userId: 6, action: "CREATED", entityType: "QUALITY_REPORT", entityId: 11, details: "Created inspection report for WO-2024-015" },
    { userId: 9, action: "WON", entityType: "SALES_LEAD", entityId: 5, details: "Closed Pacific Robotics deal for $95,000" },
    { userId: 11, action: "UPDATED", entityType: "PROJECT", entityId: 1, details: "Updated progress to 65% for PRJ-2024-001" },
    { userId: 12, action: "RECEIVED", entityType: "PURCHASE_ORDER", entityId: 1, details: "Received 100 steel plates from SteelMax" },
    { userId: 7, action: "MAINTENANCE", entityType: "MACHINE", entityId: 8, details: "Started corrective maintenance on PRESS-02" },
    { userId: 8, action: "COMPLETED", entityType: "TASK", entityId: 2, details: "Completed Design New Layout task" },
    { userId: 5, action: "INSTALLED", entityType: "PROJECT", entityId: 2, details: "Installed control panels at NovaTech" },
  ];
  await db.insert(activityLogs).values(actData);

  console.log("Seeding complete!");
}

seed().catch(console.error);
