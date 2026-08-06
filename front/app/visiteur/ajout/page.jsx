'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import AjoutVisiteur from '@/components/AjoutVisiteur';

function AjoutVisiteurPageContent() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <AjoutVisiteur open={true} onClose={() => router.push('/visiteur')} onSuccess={() => router.push('/visiteur')} />
    </div>
  );
}

export default function AjoutVisiteurPage() { return <AuthGuard><AjoutVisiteurPageContent /></AuthGuard>; }
