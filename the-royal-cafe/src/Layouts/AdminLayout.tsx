import Sidebar from "../components/Admin/sidebar/Sidebar";

import { useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />

        <main
          className={`w-full min-h-screen transition-all duration-300 ${
            collapsed ? "ml-20" : "ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
