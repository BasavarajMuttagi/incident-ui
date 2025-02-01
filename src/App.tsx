import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import routes from "@/routes/routes";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
}

export default App;
