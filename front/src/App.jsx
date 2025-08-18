import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeProvider } from "./utils/DarkModeContext";
import { AuthProvider } from "./AuthContext";
import Home from "./home/home";
import Layout from "./utils/Layout";
import Visiteur from "./visiteur/visiteur";
import Visite from "./visiteur/visite";
import Service from "./service/service";
import Login from "./utils/login";
import AjoutVisiteur from "./visiteur/ajoutvisiteur";
import SuperAdminDashboard from "./superAdmin/SuperAdmin_dahsboard";
import StatistiquesSuperAdmin from "./superAdmin/SuperAdmin_Statistique";
import GestionComptes from "./superAdmin/SuperAdmin_GestionCompte";
import SuperAdminService from "./superAdmin/SuperAdmin_service";
import ProtectedRoute from "./utils/ProtectedRoute";
import About from "./about";

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              
              {/* Routes protégées */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/gestionCompte" element={<GestionComptes />} />
                <Route path="/superAdmin_dahsboard" element={<SuperAdminDashboard />} />
                <Route path="/superAdmin_stastistique" element={<StatistiquesSuperAdmin />} />
                <Route path="/superAdmin_service" element={<SuperAdminService />} />
                <Route path="/visiteur" element={<Visiteur />} />
                <Route path="/ajoutvisiteur" element={<AjoutVisiteur />} />
                <Route path="/service" element={<Service />} />
                <Route path="/visite" element={<Visite />} />
                <Route path="/about" element={<About />} />
              </Route>
              
              {/* Redirection pour les routes inconnues */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}