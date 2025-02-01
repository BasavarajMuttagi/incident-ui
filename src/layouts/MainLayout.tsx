import { SocketProvider } from "@/components/socket-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SocketProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-zinc-800">
          {children}
        </div>
      </SidebarProvider>
    </SocketProvider>
  );
};

MainLayout.Sidebar = ({ children }: { children: ReactNode }) => {
  return <aside className="h-full">{children}</aside>;
};

MainLayout.Main = ({ children }: { children: ReactNode }) => {
  return <main className="flex h-full w-full flex-1 flex-col">{children}</main>;
};

export default MainLayout;
