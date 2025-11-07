import { createBrowserRouter, Outlet } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";

import Transactions from "@/pages/Transactions";
// import Layout from "@/components/layout/Layout";
import Users from "@/pages/User";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
