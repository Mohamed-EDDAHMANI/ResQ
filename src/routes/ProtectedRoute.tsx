// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../hooks/useAppSelector";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.user.currentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;