'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import SuperNavbar from './SuperNavbar';
import AssistantIA from './AssistantIA';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const role = user?.role;
  const hideNavbarRoutes = ['/'];
  const showNavbar = !hideNavbarRoutes.includes(pathname);
  const showAssistant = showNavbar;

  return (
    <>
      {showNavbar && (role === 'superadmin' ? <SuperNavbar /> : <Navbar />)}
      {children}
      {showAssistant && <AssistantIA />}
    </>
  );
}
