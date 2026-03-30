import { Route } from "react-router-dom";

import Dashboard from "@/pages/Admin/Dashboard";
// import Items from "@/pages/admin/Items";
// import Orders from "@/pages/admin/Orders";

export const AdminRoutes = (
  <>
    {/* <Sidebar /> */}
    <Route path="/admin/dashboard" element={<Dashboard />} />
    {/* <Route path="/admin/items" element={<Items />} /> */}
    {/* <Route path="/admin/orders" element={<Orders />} /> */}
  </>
);
