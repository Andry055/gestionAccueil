import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import SuperNavbar from "./superAdmin/SuperAdmin_Navbar";

export default function Layout({ children }) {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, [location.pathname]);

  const hideNavbarRoutes = ["/"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && (role === "superadmin" ? <SuperNavbar /> : <Navbar />)}
      {children}
    </>
  );
}
