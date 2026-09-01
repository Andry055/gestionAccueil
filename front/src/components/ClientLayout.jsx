import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import SuperNavbar from './SuperNavbar';
import AssistantIA from './AssistantIA';

export default function ClientLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const pathname = location.pathname;

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
