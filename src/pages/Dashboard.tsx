import { OrganizationSwitcher } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const Dashboard = () => {
  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-end p-2">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
          }}
          hidePersonal={true}
        />
      </div>
      <div>
        <div>dashboard</div>
      </div>
    </div>
  );
};

export default Dashboard;
