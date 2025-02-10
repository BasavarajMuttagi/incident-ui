import { useApiClient } from "@/axios/useApiClient";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ComponentStatusBadge } from "./ComponentStatusBadge";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useOrgRoute } from "@/hooks/useOrgRoute";

export type ComponentType = {
  orgId: string;
  name: string;
  id: string;
  description: string | null;
  status: "OPERATIONAL" | "DEGRADED" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";
  createdAt: Date;
  updatedAt: Date;
};

const columns: ColumnDef<ComponentType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  // In your columns definition
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ComponentType["status"];
      return <ComponentStatusBadge status={status} />;
    },
  },
  {
    id: "edit",
    header: "Edit",
    cell: ({ row }) => {
      const component = row.original;
      const { getOrgRoute } = useOrgRoute();
      return (
        <Button
          variant="ghost"
          className="text-green-500 hover:bg-green-400/10 hover:text-green-600"
          asChild
        >
          <Link to={getOrgRoute(`components/component/edit/${component.id}`)}>
            <Edit className="h-4 w-4" /> <span>Edit</span>
          </Link>
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => <DeleteButton id={row.original.id} />,
  },
];

export function ComponentsTable() {
  const { get } = useApiClient();

  const { data: ListData, isLoading } = useQuery<ComponentType[]>({
    queryKey: ["list-components"],
    queryFn: async () => {
      try {
        const result = await get(`/component/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast.error("Error while fetching components");
      }
    },
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-10 text-2xl font-extrabold">Components</h1>
        <Skeleton className="flex h-[300px] w-full items-center justify-center rounded-md border bg-zinc-900">
          <Loader2 className="animate-spin text-blue-500" />
        </Skeleton>
      </div>
    );
  }
  return (
    <div>
      <div>
        <h1 className="mb-10 text-2xl font-extrabold">Components</h1>
      </div>
      <DataTable columns={columns} data={ListData!} />
    </div>
  );
}

const DeleteButton = ({ id }: { id: string }) => {
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { delete: deleteComponent } = useApiClient();
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteComponent(`/component/${id}`);
      queryClient.refetchQueries({
        queryKey: ["list-components"],
      });
      toast.success("Component Deleted");
    } catch (error) {
      console.log(error);
      toast.error("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:bg-red-400/10 hover:text-red-600"
      onClick={() => handleDelete()}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash className="h-4 w-4" />
      )}
    </Button>
  );
};
