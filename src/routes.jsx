import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./dashboard/Dashboard";
import Layout from "../Layout";
import AdminLogin from "../views/login/Login";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
         path: "/",
         element: <AdminLogin/>
      },
      {
        path: "/admin/dashboard",
        element: <ProtectedRoute> <Dashboard/> </ProtectedRoute>
      }
    ],
  },
]);

export default router;