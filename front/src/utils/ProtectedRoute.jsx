// src/utils/ProtectedRoute.jsx
import { useAuth } from "../AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return <div>Chargement...</div>; // Ou un spinner de chargement
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;