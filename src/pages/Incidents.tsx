import { IncidentsTable } from "@/components/IncidentsTable";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Link } from "react-router-dom";

const Incidents = () => {
  return (
    <div className="h-full w-full p-2">
      <div className="flex items-center justify-end">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
          }}
          hidePersonal={true}
        />
      </div>

      <div className="space-y-5">
        <div className="container mx-auto py-10">
          <div className="mt-5 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="bg-green-500 text-white"
            >
              <Link to="incident/create">New Incident</Link>
            </Button>
          </div>
          <IncidentsTable />
        </div>
      </div>
    </div>
  );
};

export default Incidents;
