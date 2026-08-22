import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./dashboard/Dashboard";
import Layout from "../Layout";
import AdminLogin from "../views/login/Login";
import MyOrders from "./adminWorks/MyOrders";
import ManageUsers from "./adminWorks/ManageUsers"
import ManageProducts from "./adminWorks/ManageProducts";


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
      },{
        path : "/admin/orders",
        element: <MyOrders/>
      },{
        path : "/admin/users",
        element: <ManageUsers/>
      },
      {
        path : "/admin/products",
        element : <ManageProducts/>
      },
    ],
  },
]);

export default router;