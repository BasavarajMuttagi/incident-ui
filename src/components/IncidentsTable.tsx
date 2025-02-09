import { useApiClient } from "@/axios/useApiClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { incidentStatusConfig } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit, Loader2, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { IncidentTimelineForm } from "./IncidentTimelineForm";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
export type IncidentTableType = {
  id: string;
  title: string;
  status: "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";
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

      const StatusIcon = incidentStatusConfig[status].icon;

      return (
        <Badge
          className={`rounded-md ${incidentStatusConfig[status].color} hover:${incidentStatusConfig[status].color} flex w-fit items-center gap-2`}
        >
          <StatusIcon className="h-4 w-4" />
          {incidentStatusConfig[status].label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "occuredAt",
    header: "Occurred at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("occuredAt"));
      return format(date, "MMM dd, yyyy hh:mm:ss a");
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
    id: "record-update",
    header: () => <div />,
    cell: ({ row }) => {
      const incident = row.original;
      if (incident.status === "RESOLVED") {
        return (
          <Button
            disabled
            variant="ghost"
            className="text-blue-500 hover:bg-blue-400/10 hover:text-blue-600"
          >
            Record update
          </Button>
        );
      }
      return <IncidentTimelineForm incidentId={incident.id} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "edit",
    header: () => <div />,
    cell: ({ row }) => {
      const incident = row.original;

      return (
        <Button
          variant="ghost"
          className="text-green-500 hover:bg-green-400/10 hover:text-green-600"
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

export function IncidentsTable() {
  const { get } = useApiClient();

  const { data: ListData, isLoading } = useQuery<IncidentType[]>({
    queryKey: ["list-incidents"],
    queryFn: async () => {
      try {
        const result = await get(`/incident/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast.error("Error while fetching incidents");
      }
    },
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-10 text-2xl font-extrabold">Incidents</h1>
        <Skeleton className="flex h-[300px] w-full items-center justify-center rounded-md border bg-zinc-900">
          <Loader2 className="animate-spin text-blue-500" />
        </Skeleton>
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
