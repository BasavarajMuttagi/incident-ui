import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import routes from "@/routes/routes";
import { RouterProvider } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={routes} />
      <Toaster
        toastOptions={{
          className: "border border-border shadow-lg rounded-md",
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
