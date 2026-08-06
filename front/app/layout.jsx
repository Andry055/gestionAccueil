import './globals.css';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'VisiTrack - Gestion des visiteurs',
  description: "Application de gestion et de suivi des visiteurs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <DarkModeProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
