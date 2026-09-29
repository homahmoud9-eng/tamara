import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import '../admin.css';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) {
    redirect('/vision-login');
  }

  const session = await decrypt(sessionToken);
  if (!session || !session.adminId) {
    redirect('/vision-login');
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
