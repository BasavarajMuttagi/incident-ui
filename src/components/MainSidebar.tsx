import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import {
  AlertTriangle,
  BarChart2,
  BookOpen,
  Box,
  Calendar,
  Heart,
  LayoutDashboard,
  Link,
  LucideIcon,
  MessageSquare,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const mainMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Box, label: "Components", path: "/components" },
  { icon: AlertTriangle, label: "Incidents", path: "/incidents" },
  { icon: BarChart2, label: "Metrics", path: "/metrics" },
  { icon: Calendar, label: "Schedules", path: "/schedules" },
  { icon: Users, label: "Subscribers", path: "/subscribers" },
];

const secondaryMenuItems: MenuItem[] = [
  { icon: Link, label: "Status Page", path: "/status" },
  { icon: BookOpen, label: "Documentation", path: "/docs" },
  { icon: MessageSquare, label: "Join Discord", path: "/discord" },
  { icon: Heart, label: "Sponsor Cachet", path: "/sponsor" },
];

const MainSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map(({ icon: Icon, label, path }) => (
      <SidebarMenuItem key={label}>
        <SidebarMenuButton
          className={`w-full ${location.pathname === path ? "bg-zinc-700" : ""}`}
          onClick={() => navigate(path)}
        >
          <Icon className="mr-3" />
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  return (
    <Sidebar className="flex h-screen flex-col text-xl">
      <SidebarHeader className="my-2">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-green-500" />
          <span className="text-lg font-bold">Incident</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-1 flex-col justify-around">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(mainMenuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(secondaryMenuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="my-5 h-10">
        <UserButton
          showName
          appearance={{
            elements: {
              userButtonBox: "flex flex-row",
              userButtonOuterIdentifier: "order-1",
              userButtonTrigger: "flex flex-row items-center",
            },
            baseTheme: dark,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
