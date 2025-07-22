import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar";

export default function Layout({ children }) {
  const location = useLocation();

  // Routes où on ne veut pas afficher la navbar (login et registre)
  const hideNavbarRoutes = ["/", "/register"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
