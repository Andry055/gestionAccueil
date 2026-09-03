import { Routes, Route } from 'react-router-dom';
import ClientLayout from '@/components/ClientLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import VisiteurPage from '@/pages/VisiteurPage';
import VisitePage from '@/pages/VisitePage';
import AjoutVisitePage from '@/pages/AjoutVisitePage';
import ServicePage from '@/pages/ServicePage';
import AboutPage from '@/pages/AboutPage';
import SuperAdminDashboardPage from '@/pages/SuperAdminDashboardPage';
import GestionComptesPage from '@/pages/GestionComptesPage';
import SuperAdminServicePage from '@/pages/SuperAdminServicePage';
import StatistiquesPage from '@/pages/StatistiquesPage';
import SaaSAnalyticsPage from '@/pages/SaaSAnalyticsPage';

export default function App() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/visiteur" element={<VisiteurPage />} />
        <Route path="/visite" element={<VisitePage />} />
        <Route path="/visite/ajout" element={<AjoutVisitePage />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/superAdmin/dashboard" element={<SuperAdminDashboardPage />} />
        <Route path="/superAdmin/utilisateurs" element={<GestionComptesPage />} />
        <Route path="/superAdmin/service" element={<SuperAdminServicePage />} />
        <Route path="/superAdmin/statistiques" element={<StatistiquesPage />} />
        <Route path="/analytics" element={<SaaSAnalyticsPage />} />
      </Routes>
    </ClientLayout>
  );
}
