import { MaintenanceTable } from "@/components/MaintenanceTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Schedules = () => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="absolute right-0 top-1 bg-green-600 text-white hover:bg-green-700"
        asChild
      >
        <Link to="maintenance/create">New Maintenance</Link>
      </Button>

      <MaintenanceTable />
    </>
  );
};

export default Schedules;
