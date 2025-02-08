import { IncidentsTable } from "@/components/IncidentsTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Incidents = () => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="absolute right-0 top-1 bg-green-600 text-white hover:bg-green-700"
        asChild
      >
        <Link to="incident/create">New Incident</Link>
      </Button>

      <IncidentsTable />
    </>
  );
};

export default Incidents;
