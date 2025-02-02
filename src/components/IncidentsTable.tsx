import { useApiClient } from "@/axios/useApiClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "./DataTable";

export type IncidentTableType = {
  title: string;
  status: "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";
  severity: "MINOR" | "MAJOR" | "CRITICAL";
  occuredAt: Date;
  createdAt: Date;
};

type IncidentType = {
  orgId: string;
  userId: string;
  id: string;
  description: string;
  status: "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";
  createdAt: Date;
  title: string;
  severity: "MINOR" | "MAJOR" | "CRITICAL";
  occuredAt: Date;
  resolvedAt: Date | null;
};

const columns: ColumnDef<IncidentTableType>[] = [
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
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as IncidentTableType["status"];

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
    accessorKey: "occuredAt",
    header: "Occurred at",
    cell: ({ row }) => {
      return new Date(row.getValue("occuredAt")).toLocaleString();
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleString();
    },
  },
];

export function IncidentsTable() {
  const { get } = useApiClient();

  const { data: ListData, isLoading } = useQuery<IncidentType[]>({
    queryKey: ["list-incidents"],
    queryFn: async () => {
      try {
        const result = await get(`/api/v1/incident/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast("Error while fetching incidents");
      }
    },
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-10 text-2xl font-extrabold">Incidents</h1>
        <div className="flex h-10 w-full items-center justify-center text-center text-white">
          <span>Loading... </span>
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-10 text-2xl font-extrabold">Incidents</h1>
      <DataTable columns={columns} data={ListData!} />
    </div>
  );
}
