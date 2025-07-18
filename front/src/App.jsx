import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./home";
import Visiteur from "./visiteur";
import AjoutVisiteur from "./ajoutvisiteur";
import Login from "./login";
import Navbar from "./navbar";
import Service from "./service";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/visiteur" element={<Visiteur />} />
        <Route path="/ajoutvisiteur" element={<AjoutVisiteur />} />
        <Route path="/service" element={<Service />} />
      </Routes>
    </Router>
  );
}

export default App;
