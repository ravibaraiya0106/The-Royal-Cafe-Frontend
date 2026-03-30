import Sidebar from "@/components/Admin/SideBar/Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex mt-16">
        <Sidebar />

        <main className="ml-64 w-full p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
