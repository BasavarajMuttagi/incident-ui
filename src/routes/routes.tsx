import Auth from "@/components/Auth";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
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
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
  {
    element: <Private />,
    children: [],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
