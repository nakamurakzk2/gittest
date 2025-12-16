import { AdminSessionProvider } from "@/providers/admin-session-provider";
import AdminHeaderView from "./_components/AdminHeaderView";

export default function AdminLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <AdminSessionProvider>
      <AdminHeaderView />
      {children}
    </AdminSessionProvider>
  );
}
