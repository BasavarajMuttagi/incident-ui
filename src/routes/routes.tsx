import Login from "@/components/Login";
import MainLayoutWrapper from "@/layouts/MainLayoutWrapper";
import ComponentForm from "@/pages/ComponentForm";
import Components from "@/pages/Components";
import Dashboard from "@/pages/Dashboard";
import IncidentEditForm from "@/pages/IncidentEditForm";
import { IncidentForm } from "@/pages/IncidentForm";
import Incidents from "@/pages/Incidents";
import Landing from "@/pages/Landing";
import MaintenanceEditForm from "@/pages/MaintenanceEditForm";
import { MaintenanceForm } from "@/pages/MaintenanceForm";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import PublicStatus from "@/pages/PublicStatus";
import Schedules from "@/pages/Schedules";
import Subscribers from "@/pages/Subscribers";
import { Unsubscribe } from "@/pages/Unsubscribe";
import { Verify } from "@/pages/Verify";
import { SocketProvider } from "@/providers/socket-provider";
import { createBrowserRouter } from "react-router-dom";
import Onboard from "./Onboard";
import Private from "./Private";
import Public from "./Public";

const routes = createBrowserRouter([
  { path: "/verify", element: <Verify /> },
  { path: "/unsubscribe", element: <Unsubscribe /> },
  {
    path: "/status/:orgId",
    element: (
      <SocketProvider>
        <PublicStatus />
      </SocketProvider>
    ),
  },
  {
    element: <Public />,
    children: [
      { index: true, element: <Landing /> },
      { path: "/login", element: <Login /> },
      { path: "/verify", element: <Verify /> },
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
        element: <MainLayoutWrapper />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          {
            path: "/components",
            children: [
              { path: "", element: <Components /> },
              { path: "component/create", element: <ComponentForm /> },
              {
                path: "component/edit/:componentId",
                element: <ComponentForm />,
              },
            ],
          },
          {
            path: "/incidents",
            children: [
              { path: "", element: <Incidents /> },
              { path: "incident/create", element: <IncidentForm /> },
              {
                path: "incident/edit/:incidentId",
                element: <IncidentEditForm />,
              },
            ],
          },
          {
            path: "/schedules",
            children: [
              { path: "", element: <Schedules /> },
              { path: "maintenance/create", element: <MaintenanceForm /> },
              {
                path: "maintenance/edit/:maintenanceId",
                element: <MaintenanceEditForm />,
              },
            ],
          },
          {
            path: "/subscribers",
            element: <Subscribers />,
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default routes;
