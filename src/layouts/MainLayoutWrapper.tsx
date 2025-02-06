import MainSidebar from "@/components/MainSidebar";
import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";
import WindowLayout from "./WindowLayout";

const MainLayoutWrapper = () => {
  return (
    <MainLayout>
      <MainLayout.Sidebar>
        <MainSidebar />
      </MainLayout.Sidebar>
      <MainLayout.Main>
        <WindowLayout>
          <Outlet />
        </WindowLayout>
      </MainLayout.Main>
    </MainLayout>
  );
};

export default MainLayoutWrapper;
