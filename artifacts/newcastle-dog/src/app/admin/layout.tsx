import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Allow login page without auth
  return (
    <div className="flex bg-gray-50 dark:bg-purple-night min-h-screen">
      {session.isLoggedIn && <AdminSidebar />}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
