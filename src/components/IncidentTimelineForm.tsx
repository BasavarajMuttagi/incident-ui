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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Edit, Search, Shield } from "lucide-react";
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

const statusOptions = [
  {
    value: "INVESTIGATING",
    label: "Investigating",
    icon: Search,
    className:
      "bg-blue-500/20 text-blue-500 data-[state=on]:bg-blue-500 data-[state=on]:text-white",
  },
  {
    value: "IDENTIFIED",
    label: "Identified",
    icon: AlertCircle,
    className:
      "bg-violet-500/20 text-violet-500 data-[state=on]:bg-violet-500 data-[state=on]:text-white",
  },
  {
    value: "MONITORING",
    label: "Monitoring",
    icon: Shield,
    className:
      "bg-yellow-500/20 text-yellow-500 data-[state=on]:bg-yellow-500 data-[state=on]:text-white",
  },
  {
    value: "RESOLVED",
    label: "Resolved",
    icon: CheckCircle,
    className:
      "bg-green-500/20 text-green-500 data-[state=on]:bg-green-500 data-[state=on]:text-white",
  },
];

export function IncidentTimelineForm({
  incidentId,
  incidentUpdateId,
}: {
  incidentId: string;
  incidentUpdateId?: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { post, get, patch } = useApiClient();
  const isEditMode = Boolean(incidentUpdateId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "INVESTIGATING",
      message: "",
    },
  });

  useQuery({
    queryKey: ["get-incident-update", incidentId, incidentUpdateId],
    queryFn: async () => {
      if (!incidentUpdateId) return null;
      try {
        const response = await get(
          `/incident/${incidentId}/updates/${incidentUpdateId}`,
        );
        form.reset({
          status: response.data.status,
          message: response.data.message,
        });
      } catch (error) {
        toast.error("Failed to load incident update");
        throw error;
      }
    },
    enabled: Boolean(incidentUpdateId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        if (isEditMode) {
          await patch(
            `/incident/${incidentId}/updates/${incidentUpdateId}`,
            values,
          );
          toast.success("Incident Update Modified");
        } else {
          await post(`/incident/${incidentId}/updates/create`, values);
          toast.success("Incident Update Created");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error while creating or updating incident");
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      queryClient.refetchQueries({
        queryKey: ["list-incident-updates"],
      });
      if (isEditMode) {
        queryClient.refetchQueries({
          queryKey: ["get-incident-update", incidentId, incidentUpdateId],
        });
      }
      setOpen(false);
    },
    onError: () => {
      toast.error("Error while creating or updating incident");
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
            className="text-blue-500 hover:bg-blue-400/10 hover:text-blue-600"
          >
            <div className="flex items-center space-x-1">
              <Edit className="h-4 w-4" /> <span>Edit</span>
            </div>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            New Update
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Timeline Update
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
                      {statusOptions.map((option) => (
                        <ToggleGroupItem
                          key={option.value}
                          value={option.value}
                          className={`gap-2 px-4 py-2 ${option.className}`}
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
                className="bg-green-500 text-white hover:bg-green-600"
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
