// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./utils/DarkModeContext";
import { AuthProvider } from "./AuthContext";
import Home from "./home/home";
import Layout from "./utils/Layout";
import Visiteur from "./visiteur/visiteur";
import Visite from "./visiteur/visite";
import Service from "./service/service";
import Login from "./utils/login";
import Register from "./utils/Registre";
import AjoutVisiteur from "./visiteur/ajoutvisiteur";
import SuperAdminDashboard from "./superAdmin/SuperAdmin_dahsboard";
import StatistiquesSuperAdmin from "./superAdmin/SuperAdmin_Statistique";

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/superAdmin_dahsboard" element={<SuperAdminDashboard />} />
              <Route path="/superAdmin_stastistique" element={<StatistiquesSuperAdmin />} />
              <Route path="/visiteur" element={<Visiteur />} />
              <Route path="/ajoutvisiteur" element={<AjoutVisiteur />} />
              <Route path="/service" element={<Service />} />
              <Route path="/visite" element={<Visite />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}
