import { useApiClient } from "@/axios/useApiClient";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { IncidentStatusBadge } from "./IncidentStatusBadge";
import { IncidentStatus } from "./IncidentUpdates";
import { MaintenanceTimelineForm } from "./MaintenanceTimelineForm";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export type MaintenanceStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

type MaintenanceUpdateType = {
  id: string;
  orgId: string;
  userId: string;
  status: MaintenanceStatus;
  createdAt: Date;
  maintenanceId: string;
  message: string;
};

const columns: ColumnDef<MaintenanceUpdateType>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as IncidentStatus;
      return <IncidentStatusBadge status={status} />;
    },
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "MMM dd, yyyy hh:mm:ss a");
    },
  },
  {
    id: "edit",
    header: () => <div />,
    cell: ({ row }) => {
      const maintenance = row.original;
      return (
        <MaintenanceTimelineForm
          maintenanceId={maintenance.maintenanceId}
          maintenanceUpdateId={maintenance.id}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export function MaintenanceUpdates({
  maintenanceId,
}: {
  maintenanceId: string;
}) {
  const { get, post } = useApiClient();
  const queryClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<MaintenanceUpdateType[]>([]);
  const [clearRowSelection, setClearRowSelection] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (updates: MaintenanceUpdateType[]) => {
      const maintenanceUpdateIds = updates.map((e) => e.id);
      await post(`/maintenance/${maintenanceId}/updates/delete`, {
        maintenanceUpdateIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-maintenance-updates"] });
      setClearRowSelection(true);
      setSelectedRows([]);
      toast.success("Update(s) deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete updates");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(selectedRows);
  };

  const { data: ListData, isLoading } = useQuery<MaintenanceUpdateType[]>({
    queryKey: ["list-maintenance-updates"],
    queryFn: async () => {
      try {
        const result = await get(`/maintenance/${maintenanceId}/updates/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast.error("Error while fetching updates");
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <Skeleton className="flex h-[300px] w-full items-center justify-center rounded-md bg-zinc-900">
        <Loader2 className="animate-spin text-blue-500" />
      </Skeleton>
    );
  }

  return (
    <div className="space-y-1">
      {selectedRows.length > 0 && (
        <Button
          variant="ghost"
          className="ml-1 text-red-500 hover:bg-red-400/10 hover:text-red-600"
          onClick={handleDelete}
        >
          <div className="inline-flex items-center space-x-1">
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting</span>
              </>
            ) : (
              <span>Delete ({selectedRows.length})</span>
            )}
          </div>
        </Button>
      )}
      <DataTable
        columns={columns}
        data={ListData!}
        onRowSelectionChange={setSelectedRows}
        clearRowSelection={clearRowSelection}
      />
    </div>
  );
}
