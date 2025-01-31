import Landing from "@/pages/Landing";
import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
]);
export default routes;
