import { Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import AjoutVisite from '@/components/AjoutVisite';
import { Loader2 } from 'lucide-react';

function AjoutVisiteForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let visiteur = null;
  try {
    const v = searchParams.get('visiteur');
    if (v) visiteur = JSON.parse(v);
  } catch {}
  return (
    <AjoutVisite
      open={true}
      visiteur={visiteur}
      onClose={() => navigate('/visiteur')}
      onSuccess={() => navigate('/visiteur')}
    />
  );
}

export default function AjoutVisitePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Suspense fallback={<div className="flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /><span>Chargement...</span></div>}>
          <AjoutVisiteForm />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
