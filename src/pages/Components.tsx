import { ComponentsTable } from "@/components/ComponentsTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Components = () => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="absolute right-0 top-1 bg-green-500 text-white"
      >
        <Link to="component/create">New Component</Link>
      </Button>
      <ComponentsTable />
    </>
  );
};

export default Components;
