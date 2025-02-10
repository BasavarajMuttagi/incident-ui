import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import routes from "@/routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { useAuth } from "@clerk/clerk-react";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
  const { orgId } = useAuth();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" key={orgId}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
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
