import { useApiClient } from "@/axios/useApiClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Loader2,
  Search,
  Shield,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
type IncidentStatus =
  | "INVESTIGATING"
  | "IDENTIFIED"
  | "MONITORING"
  | "RESOLVED";

type IncidentUpdateType = {
  id: string;
  orgId: string;
  userId: string;
  status: IncidentStatus;
  createdAt: Date;
  incidentId: string;
  message: string;
};

const columns: ColumnDef<IncidentUpdateType>[] = [
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
      const status = row.getValue("status") as IncidentUpdateType["status"];

      const statusConfig = {
        INVESTIGATING: {
          color: "bg-blue-500/15 text-blue-400",
          icon: Search,
          label: "investigating",
        },
        IDENTIFIED: {
          color: "bg-violet-500/15 text-violet-400",
          icon: AlertCircle,
          label: "identified",
        },
        MONITORING: {
          color: "bg-yellow-500/15 text-yellow-400",
          icon: Shield,
          label: "monitoring",
        },
        RESOLVED: {
          color: "bg-green-500/15 text-green-400",
          icon: CheckCircle,
          label: "resolved",
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
      const incident = row.original;

      return (
        <Button
          variant="ghost"
          className="text-blue-500 hover:bg-blue-400/10 hover:text-blue-600"
          asChild
        >
          <Link to={`/incidents/incident/edit/${incident.id}`}>
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
    header: () => <div />,
    cell: () => (
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:bg-red-400/10 hover:text-red-600"
      >
        <Trash className="h-4 w-4" />
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export function IncidentUpdates({ incidentId }: { incidentId: string }) {
  const { get } = useApiClient();

  const { data: ListData, isLoading } = useQuery<IncidentUpdateType[]>({
    queryKey: ["list-incident-updates"],
    queryFn: async () => {
      try {
        const result = await get(`/api/v1/incident/${incidentId}/updates`);
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
