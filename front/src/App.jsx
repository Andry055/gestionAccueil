import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import { DarkModeProvider } from "./DarkModeContext";
import Home from "./home";
import Layout from "./Layout";
import Visiteur from "./Visiteur";
import Service from "./Service";
import Statistique from "./static";
import Login from "./Login";
import AjoutVisiteur from "./AjoutVisiteur";

export default function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
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
