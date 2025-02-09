import { useApiClient } from "@/axios/useApiClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export type SubscriberTableType = {
  id: string;
  email: string;
  status: "PENDING" | "SUBSCRIBED" | "UNSUBSCRIBED";
  isVerified: boolean;
  createdAt: Date;
};

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  SUBSCRIBED: {
    label: "Subscribed",
    color: "bg-green-500/10 text-green-500",
  },
  UNSUBSCRIBED: {
    label: "Unsubscribed",
    color: "bg-red-500/10 text-red-500",
  },
};

const columns: ColumnDef<SubscriberTableType>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as SubscriberTableType["status"];
      return (
        <Badge className={`rounded-md ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified") as boolean;
      return (
        <Badge
          className={`rounded-md ${
            isVerified
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {isVerified ? "Verified" : "Not Verified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Subscribed At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "MMM dd, yyyy hh:mm:ss a");
    },
  },

  {
    id: "delete",
    header: () => <div />,
    cell: ({ row }) => {
      const [isLoading, setLoading] = useState(false);
      const queryClient = useQueryClient();
      const data = row.original;
      const { delete: deleteSubscriber } = useApiClient();
      const handleDelete = async () => {
        try {
          setLoading(true);
          await deleteSubscriber(`/subscriber/${data.id}`);
          queryClient.refetchQueries({
            queryKey: ["list-subscribers"],
          });
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
    },
  },
];

export function SubscribersTable() {
  const { get } = useApiClient();

  const { data: subscribers, isLoading } = useQuery<SubscriberTableType[]>({
    queryKey: ["list-subscribers"],
    queryFn: async () => {
      try {
        const result = await get(`/subscriber/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast.error("Error while fetching subscribers");
      }
    },
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-10 text-2xl font-extrabold">Subscribers</h1>
        <Skeleton className="flex h-[300px] w-full items-center justify-center rounded-md border bg-zinc-900">
          <Loader2 className="animate-spin text-blue-500" />
        </Skeleton>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-10 text-2xl font-extrabold">Subscribers</h1>
      <DataTable columns={columns} data={subscribers!} />
    </div>
  );
}
