import Login from "@/components/Login";
import MainSidebar from "@/components/MainSidebar";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import SelectAccount from "@/pages/SelectAccount";
import { createBrowserRouter } from "react-router-dom";
import Private from "./Private";
import Public from "./Public";

const routes = createBrowserRouter([
  {
    element: <Public />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <Private />,
    children: [
      {
        path: "/select",
        element: <SelectAccount />,
      },
    ],
  },
  {
    element: (
      <MainLayout>
        <MainLayout.Sidebar>
          <MainSidebar />
        </MainLayout.Sidebar>
        <Private />
      </MainLayout>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/personal",
        element: <div>Personal</div>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
