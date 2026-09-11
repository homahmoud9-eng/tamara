import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import '../admin.css';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/admin-login');
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
