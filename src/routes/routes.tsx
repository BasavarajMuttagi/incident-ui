import Login from "@/components/Login";
import MainSidebar from "@/components/MainSidebar";
import MainLayout from "@/layouts/MainLayout";
import Components from "@/pages/Components";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import { createBrowserRouter } from "react-router-dom";
import Onboard from "./Onboard";
import Private from "./Private";
import Public from "./Public";
import { IncidentForm } from "@/pages/IncidentForm";
import Incidents from "@/pages/Incidents";

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
    element: (
      <MainLayout>
        <MainLayout.Sidebar>
          <MainSidebar />
        </MainLayout.Sidebar>
        <Private />
      </MainLayout>
    ),

    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/components", element: <Components /> },
      {
        path: "/incidents",
        children: [
          { path: "", element: <Incidents /> },
          { path: "incident/create", element: <IncidentForm /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default routes;
