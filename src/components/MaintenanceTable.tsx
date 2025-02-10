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
import { IncidentStatus } from "./IncidentUpdates";
import { Button } from "./ui/button";
export type MaintenanceTimelineType = {
  id: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  message: string;
  status: IncidentStatus;
  maintenanceId: string;
};
export type MaintenanceType = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  timeline: MaintenanceTimelineType[];
  createdAt: string;
  updatedAt: string;
};

const columns: ColumnDef<MaintenanceType>[] = [
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
        row.original.startAt,
        row.original.endAt,
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
      const data = row.getValue("endAt") as Date;
      if (!data) {
        return;
      }
      const date = new Date(data);
      return format(date, "MMM dd, yyyy hh:mm:ss a");
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const status = calculateMaintenanceStatus(
        row.original.startAt,
        row.original.endAt,
      );
      return (
        <div className="flex items-center gap-2">
          {status === "COMPLETED" ? (
            <Button variant="link" className="text-green-600" disabled>
              Complete Maintenance
            </Button>
          ) : (
            <CompleteButton id={row.original.id} />
          )}
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

  const { data: ListData, isLoading } = useQuery<MaintenanceType[]>({
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

const CompleteButton = ({ id }: { id: string }) => {
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { patch } = useApiClient();

  const handleComplete = async () => {
    try {
      setLoading(true);
      await patch(`/maintenance/${id}`, {
        endAt: new Date().toISOString(),
      });
      queryClient.invalidateQueries({
        queryKey: ["list-maintenance"],
      });
      toast.success("Maintenance completed successfully");
    } catch (error) {
      toast.error("Failed to complete maintenance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="link"
      onClick={handleComplete}
      disabled={isLoading}
      className="text-green-600"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Completing...</span>
        </div>
      ) : (
        "Complete Maintenance"
      )}
    </Button>
  );
};
