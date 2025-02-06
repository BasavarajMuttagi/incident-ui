import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SocketProvider } from "@/providers/socket-provider";
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
  return (
    <main className="flex h-full w-full flex-1">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col p-5">{children}</div>
      </ScrollArea>
    </main>
  );
};

export default MainLayout;
