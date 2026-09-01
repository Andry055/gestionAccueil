import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }) {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !user) {
      navigate('/', { replace: true });
    }
  }, [isReady, user, navigate]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
