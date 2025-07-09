import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './home';
import Visiteur from "./visiteur";
import Navbar from "./navbar";
import AjoutVisiteur from "./ajoutvisiteur";
import Login from "./login";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/visiteur" element={<Visiteur />} />
      <Route path="/ajoutvisiteur" element={<AjoutVisiteur />} />
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App;
