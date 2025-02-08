import { useApiClient } from "@/axios/useApiClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ComponentType } from "./ComponentsTable";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type AttachedComponents = {
  id: string;
  status: "OPERATIONAL" | "DEGRADED" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";
  incidentId: string;
  componentId: string;
  component: ComponentType;
};

const columns: ColumnDef<AttachedComponents>[] = [
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
    accessorKey: "component.name",
    header: "Name",
  },
  // In your columns definition
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ComponentType["status"];

      const statusConfig = {
        OPERATIONAL: {
          color: "bg-emerald-500/20 text-emerald-500",
          icon: CheckCircle,
          label: "operational",
        },
        DEGRADED: {
          color: "bg-yellow-500/20 text-yellow-500",
          icon: Activity,
          label: "degraded",
        },
        PARTIAL_OUTAGE: {
          color: "bg-orange-500/20 text-orange-500",
          icon: AlertCircle,
          label: "partial outage",
        },
        MAJOR_OUTAGE: {
          color: "bg-red-500/20 text-red-500",
          icon: XCircle,
          label: "major outage",
        },
      };

      const StatusIcon = statusConfig[status].icon;

      return (
        <Badge
          className={`rounded-md ${statusConfig[status].color} hover:${statusConfig[status].color} flex w-fit items-center gap-2`}
        >
          <StatusIcon className="h-4 w-4" />
          {statusConfig[status].label}
        </Badge>
      );
    },
  },
];

export function AttachedComponents({ incidentId }: { incidentId: string }) {
  const { get, post } = useApiClient();
  const queryClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<AttachedComponents[]>([]);
  const [clearRowSelection, setClearRowSelection] = useState(false);
  const detachMutation = useMutation({
    mutationFn: async (components: AttachedComponents[]) => {
      const componentIds = components.map((e) => e.componentId);
      await post(`/incident/${incidentId}/components/detach`, { componentIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-components"] });
      setClearRowSelection(true);
      setSelectedRows([]);
      toast.success("Component(s) detached successfully");
    },
    onError: () => {
      toast.error("Failed to detach components");
    },
  });

  const handleDetach = () => {
    detachMutation.mutate(selectedRows);
  };
  const { data: ListData, isLoading } = useQuery<AttachedComponents[]>({
    queryKey: ["list-components"],
    queryFn: async () => {
      try {
        const result = await get(`/incident/${incidentId}/components/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast.error("Error while fetching components");
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
          onClick={handleDetach}
        >
          {detachMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Detaching</span>
            </>
          ) : (
            <span>Detach ({selectedRows.length})</span>
          )}
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
