import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/FleetManagement.tsx";

import ProtectedRoute from "./ProtectedRoute.tsx";
import RoleBasedRoute from "./RoleBasedRoute.tsx";

const routes: RouteObject[] = [
  {
    path: "/FleetManagement",
    element: (
      <ProtectedRoute>
        <RoleBasedRoute requiredRole="chef_parc">
          <Dashboard />
        </RoleBasedRoute>
      </ProtectedRoute>
    ),
  },

  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <RoleBasedRoute requiredRole="regulateur">
          <Home />
        </RoleBasedRoute>
      </ProtectedRoute>
    ),
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
