import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from './AppLayout';
import AssistantIA from './AssistantIA';

export default function ClientLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const pathname = location.pathname;

  // Hide layout on login and register pages
  const hideLayoutRoutes = ['/', '/register'];
  const showLayout = !hideLayoutRoutes.includes(pathname) && user;

  if (!showLayout) {
    return (
      <>
        {children}
        {user && <AssistantIA />}
      </>
    );
  }

  return (
    <AppLayout>
      {children}
      <AssistantIA />
    </AppLayout>
  );
}
