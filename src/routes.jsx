import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./dashboard/Dashboard";
import Layout from "../Layout";
import AdminLogin from "../views/login/Login";
import MyOrders from "./adminWorks/MyOrders";
import ManageUsers from "./adminWorks/ManageUsers"
import ManageProducts from "./adminWorks/ManageProducts";
import AddProduct from "./adminWorks/AddProduct";
import SingleOrder from "./adminWorks/SingleOrder";
import SingleProduct from "./adminWorks/SingleProduct";
import EditProduct from "./adminWorks/EditProduct";



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
        element: <ProtectedRoute> <MyOrders/>  </ProtectedRoute>
        },                    
      {
        path : "/admin/orders/:id",
        element: <ProtectedRoute> <SingleOrder/> </ProtectedRoute>
      },{
        path : "/admin/users",
        element: <ProtectedRoute> <ManageUsers/> </ProtectedRoute>
      },
      {
        path : "/admin/products",
        element : <ProtectedRoute> <ManageProducts/> </ProtectedRoute>
      },
      {
        path : "/admin/products/:id",
        element : <ProtectedRoute> <SingleProduct/> </ProtectedRoute>
      },{
        path : "/admin/products/new",
        element : <ProtectedRoute> <AddProduct/> </ProtectedRoute>
      },{
        path : "/admin/products/:id/edit",
        element : <ProtectedRoute> <EditProduct/> </ProtectedRoute>
      }
    ],
  },
]);

export default router;