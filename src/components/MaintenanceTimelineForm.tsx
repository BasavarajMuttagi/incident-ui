import { useApiClient } from "@/axios/useApiClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { incidentStatusOptions } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
  status: z.enum(["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"], {
    message: "Select Any One",
  }),
});

export function MaintenanceTimelineForm({
  maintenanceId,
  maintenanceUpdateId,
}: {
  maintenanceId: string;
  maintenanceUpdateId?: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { post, get, patch } = useApiClient();
  const isEditMode = Boolean(maintenanceUpdateId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "INVESTIGATING",
      message: "",
    },
  });

  useQuery({
    queryKey: ["get-maintenance-update", maintenanceId, maintenanceUpdateId],

    queryFn: async () => {
      if (!maintenanceUpdateId) return null;
      try {
        const response = await get(
          `/maintenance/${maintenanceId}/updates/${maintenanceUpdateId}`,
        );
        form.reset({
          status: response.data.status,
          message: response.data.message,
        });
      } catch (error) {
        toast.error("Failed to load maintenance update");
        throw error;
      }
    },
    enabled: Boolean(maintenanceUpdateId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        if (isEditMode) {
          await patch(
            `/maintenance/${maintenanceId}/updates/${maintenanceUpdateId}`,
            values,
          );
          toast.success("Maintenance Update Modified");
        } else {
          await post(`/maintenance/${maintenanceId}/updates/create`, values);
          toast.success("Maintenance Update Created");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error while creating or updating maintenance");
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      queryClient.refetchQueries({
        queryKey: ["list-maintenance-updates"],
      });
      if (isEditMode) {
        queryClient.refetchQueries({
          queryKey: [
            "get-maintenance-update",
            maintenanceId,
            maintenanceUpdateId,
          ],
        });
      }
      setOpen(false);
    },
    onError: () => {
      toast.error("Error while creating or updating maintenance");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  const handleOpenChange = (open: boolean) => {
    if (!isPending) {
      setOpen(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button
            variant="ghost"
            className="text-green-500 hover:bg-green-400/10 hover:text-green-600"
          >
            <div className="flex items-center space-x-1">
              <Edit className="h-4 w-4" /> <span>Edit</span>
            </div>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="text-blue-500 hover:bg-blue-400/10 hover:text-blue-600"
          >
            Record update
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditMode ? "Edit Timeline Update" : "Create Timeline Update"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 rounded-md"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Message<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[150px] bg-zinc-800"
                      placeholder="Message..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Status<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap justify-start gap-2"
                    >
                      {incidentStatusOptions.map((option) => (
                        <ToggleGroupItem
                          key={option.value}
                          value={option.value}
                          className={`flex items-center gap-2 px-4 py-2 ${option.className}`}
                        >
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isPending
                  ? isEditMode
                    ? "Saving..."
                    : "Creating..."
                  : isEditMode
                    ? "Save Changes"
                    : "Create Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
