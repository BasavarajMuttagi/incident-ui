import { IncidentsTable } from "@/components/IncidentsTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Incidents = () => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="absolute right-0 top-1 bg-green-500 text-white"
        asChild
      >
        <Link to="incident/create">New Incident</Link>
      </Button>

      <IncidentsTable />
    </>
  );
};

export default Incidents;
