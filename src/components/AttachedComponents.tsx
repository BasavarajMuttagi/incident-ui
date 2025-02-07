import { useApiClient } from "@/axios/useApiClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return row.original.component.name;
    },
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

  {
    id: "detach",
    header: () => <div />,
    cell: ({ row }) => {
      const component = row.original;
      console.log(component);
      return (
        <Button
          variant="ghost"
          className="text-red-500 hover:bg-red-400/10 hover:text-red-600"
        >
          <div className="inline-flex items-center space-x-1">
            <span>Detach</span> <X className="h-4 w-4" />
          </div>
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export function AttachedComponents({ incidentId }: { incidentId: string }) {
  const { get } = useApiClient();

  const { data: ListData, isLoading } = useQuery<AttachedComponents[]>({
    queryKey: ["list-components"],
    queryFn: async () => {
      try {
        const result = await get(`/incident/${incidentId}/components/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast("Error while fetching components");
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
  return <DataTable columns={columns} data={ListData!} />;
}
