import type { RouteObject } from "react-router-dom";
import Home  from "../pages/Home";
import Login  from "../pages/Login";
import NotFound  from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import { useRoutes } from "react-router-dom";

const routes: RouteObject[] = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/home", element: <Home /> },
  { path: "*", element: <NotFound /> },
  { path: "/login", element: <Login /> },
];

export function AppRoutes() {
  return useRoutes(routes);
}
