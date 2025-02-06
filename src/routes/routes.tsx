import Login from "@/components/Login";
import MainSidebar from "@/components/MainSidebar";
import MainLayout from "@/layouts/MainLayout";
import { ComponentForm } from "@/pages/ComponentForm";
import Components from "@/pages/Components";
import Dashboard from "@/pages/Dashboard";
import { IncidentForm } from "@/pages/IncidentForm";
import Incidents from "@/pages/Incidents";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Onboard from "./Onboard";
import Private from "./Private";
import Public from "./Public";

const routes = createBrowserRouter([
  {
    element: <Public />,
    children: [
      { index: true, element: <Landing /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    element: <Onboard />,
    children: [{ path: "/onboarding", element: <Onboarding /> }],
  },
  {
    element: <Private />,

    children: [
      {
        element: (
          <MainLayout>
            <MainLayout.Sidebar>
              <MainSidebar />
            </MainLayout.Sidebar>
            <MainLayout.Main>
              <Outlet />
            </MainLayout.Main>
          </MainLayout>
        ),
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          {
            path: "/components",
            children: [
              { path: "", element: <Components /> },
              { path: "component/create", element: <ComponentForm /> },
              { path: "component/edit/:id", element: <ComponentForm /> },
            ],
          },
          {
            path: "/incidents",
            children: [
              { path: "", element: <Incidents /> },
              { path: "incident/create", element: <IncidentForm /> },
              { path: "incident/edit/:id", element: <IncidentForm /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default routes;
