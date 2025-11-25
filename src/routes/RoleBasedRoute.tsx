// src/routes/RoleBasedRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../hooks/useAppSelector";

interface Props {
  requiredRole: string;
  children: ReactNode;
}

const RoleBasedRoute = ({ requiredRole, children }: Props) => {
  const user = useAppSelector((state) => state.user.currentUser);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RoleBasedRoute;
