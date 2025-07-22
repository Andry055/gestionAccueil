import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar";

export default function Layout({ children }) {
  const location = useLocation();

  // Liste des routes où la navbar ne s'affiche pas
  const hideNavbarRoutes = ["/"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <div>{children}</div>
    </div>
  );
}
