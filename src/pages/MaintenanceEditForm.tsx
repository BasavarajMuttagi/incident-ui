import { useApiClient } from "@/axios/useApiClient";
import { MaintenanceTimelineForm } from "@/components/MaintenanceTimelineForm";
import { MaintenanceUpdates } from "@/components/MaintenanceUpdates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/ui/button";

type MaintenanceStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
type MaintenanceType = {
  orgId: string;
  id: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time",
  }),
  endAt: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
});

function MaintenanceEditForm() {
  const { maintenanceId } = useParams();
  const { get, patch } = useApiClient();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startAt: "",
      endAt: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      patch(`/maintenance/${maintenanceId}`, values),
    onSuccess: () => {
      form.reset();
      toast.success("Maintenance Updated");
      queryClient.refetchQueries({
        queryKey: ["list-maintenance"],
      });
      navigate(-1);
    },
    onError: () => {
      toast.error("Error while updating maintenance");
    },
  });

  const { isLoading } = useQuery({
    queryKey: ["maintenance", maintenanceId],
    queryFn: async () => {
      if (!maintenanceId) return null;
      try {
        const response = await get(`/maintenance/${maintenanceId}`);
        const { title, description, startAt, endAt } =
          response.data as MaintenanceType;
        form.reset({
          title,
          description,
          startAt: formatISO(new Date(startAt)).slice(0, 16),
          endAt: endAt ? formatISO(new Date(endAt)).slice(0, 16) : undefined,
        });
        return response.data;
      } catch (error) {
        toast.error("Error loading maintenance");
        navigate(-1);
        throw error;
      }
    },
    enabled: Boolean(maintenanceId),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  if (isLoading) {
    return (
      <div className="mt-5 flex h-[610px] w-full items-center justify-center">
        <div className="flex h-full w-full max-w-3xl items-center justify-center space-y-6 rounded-md bg-zinc-900 p-5">
          <div className="flex items-center space-x-2">
            <span>Loading...</span>
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 flex w-full flex-col items-center justify-center space-y-10">
      <Card className="w-full max-w-3xl bg-zinc-900">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 rounded-md p-5"
          >
            <h1 className="text-xl font-semibold text-white">
              Edit Maintenance
            </h1>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Title<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="border-0 bg-zinc-800" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Start Time<span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        className="bg-zinc-800"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        className="bg-zinc-800"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Description<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[150px] bg-zinc-800"
                      placeholder="Detailed description of the maintenance..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="bg-zinc-800 text-white hover:bg-zinc-700"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isPending ? "Updating..." : "Update Maintenance"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      <div className="w-full max-w-3xl space-y-6">
        {maintenanceId && (
          <Card className="w-full bg-zinc-900">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Updates</span>
                <MaintenanceTimelineForm maintenanceId={maintenanceId} />
              </CardTitle>
            </CardHeader>

            <CardContent className="mt-2 min-h-52 space-y-2 p-0">
              <MaintenanceUpdates maintenanceId={maintenanceId} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MaintenanceEditForm;
