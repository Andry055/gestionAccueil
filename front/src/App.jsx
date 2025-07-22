import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./DarkModeContext";
import Home from "./home";
import Layout from "./Layout";
import Visiteur from "./Visiteur";
import Service from "./Service";
import Statistique from "./static";
import Login from "./Login";
import Register from "./Registre";
import AjoutVisiteur from "./AjoutVisiteur";
import SuperAdminDashboard from "./superAdmin/SuperAdmin_dahsboard";

export default function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/visiteur" element={<Visiteur />} />
          <Route path="/ajoutvisiteur" element={<AjoutVisiteur />} />
          <Route path="/service" element={<Service />} />
          <Route path="/statistique" element={<Statistique />} />
        </Routes>
        </Layout>
      </Router>
    </DarkModeProvider>
  );
}
