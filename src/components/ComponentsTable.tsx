import { useApiClient } from "@/axios/useApiClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Edit,
  Loader2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";

export type ComponentTableType = {
  name: string;
  status: "OPERATIONAL" | "DEGRADED" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";
};

type ComponentType = {
  orgId: string;
  name: string;
  id: string;
  description: string | null;
  status: "OPERATIONAL" | "DEGRADED" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";
  createdAt: Date;
  updatedAt: Date;
};

const columns: ColumnDef<ComponentTableType>[] = [
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
      const status = row.getValue("status") as ComponentTableType["status"];

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
    id: "edit",
    header: () => <div />,
    cell: ({ row }) => {
      const component = row.original;

      return (
        <Button variant="ghost" className="hover:text-blue-500">
          <Link
            to={`/components/component/edit/${component.name}`}
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" /> <span>Edit</span>
          </Link>
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export function ComponentsTable() {
  const { get } = useApiClient();

  const { data: ListData, isLoading } = useQuery<ComponentType[]>({
    queryKey: ["list-components"],
    queryFn: async () => {
      try {
        const result = await get(`/api/v1/component/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast("Error while fetching components");
      }
    },
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-10 text-2xl font-extrabold">Components</h1>
        <div className="flex h-10 w-full items-center justify-center text-center text-white">
          <span>Loading... </span>
          <Loader2 className="animate-spin text-blue-500" />
        </div>
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
