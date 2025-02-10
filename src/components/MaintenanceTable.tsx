import { useApiClient } from "@/axios/useApiClient";
import { MaintenanceStatusBadge } from "@/components/MaintenanceStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateMaintenanceStatus } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit, Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";

type MaintenanceTableType = {
  id: string;
  title: string;
  description: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
};

const columns: ColumnDef<MaintenanceTableType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = calculateMaintenanceStatus(
        new Date(row.original.startAt),
        new Date(row.original.endAt),
      );
      return <MaintenanceStatusBadge status={status} text />;
    },
  },
  {
    accessorKey: "startAt",
    header: "Start at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startAt"));
      return format(date, "MMM dd, yyyy hh:mm:ss a");
    },
  },
  {
    accessorKey: "endAt",
    header: "End at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endAt"));
      return format(date, "MMM dd, yyyy hh:mm:ss a");
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8 border-input p-0 hover:bg-green-400/10 hover:text-green-600"
          >
            <Link to={`maintenance/edit/${row.original.id}`}>
              <Edit className="h-4 w-4 text-green-600" />
            </Link>
          </Button>
          <DeleteButton id={row.original.id} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export function MaintenanceTable() {
  const { get } = useApiClient();

  const { data: ListData, isLoading } = useQuery<MaintenanceTableType[]>({
    queryKey: ["list-maintenance"],
    queryFn: async () => {
      try {
        const result = await get(`/maintenance/list`);
        return result.data;
      } catch (error) {
        toast.error("Failed to fetch maintenance list");
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-10 text-2xl font-extrabold">Maintenance</h1>
      <DataTable columns={columns} data={ListData!} />
    </div>
  );
}

const DeleteButton = ({ id }: { id: string }) => {
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { delete: deleteMaintenance } = useApiClient();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteMaintenance(`/maintenance/${id}`);
      queryClient.invalidateQueries({
        queryKey: ["list-maintenance"],
      });
      toast.success("Maintenance deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete maintenance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      className="h-8 w-8 border-input p-0 hover:bg-destructive hover:text-destructive-foreground"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash className="h-4 w-4 text-red-400" />
      )}
    </Button>
  );
};
