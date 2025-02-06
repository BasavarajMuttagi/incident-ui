import { useApiClient } from "@/axios/useApiClient";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";

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
type IncidentStatus =
  | "INVESTIGATING"
  | "IDENTIFIED"
  | "MONITORING"
  | "RESOLVED";
type incidentType = {
  orgId: string;
  userId: string;
  id: string;
  description: string;
  status: IncidentStatus;
  createdAt: Date;
  title: string;
  occuredAt: Date;
  resolvedAt: Date | null;
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"], {
    message: "Select Any One",
  }),
  occuredAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time",
  }),
});

function IncidentEditForm() {
  const { incidentId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { get, patch } = useApiClient();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "INVESTIGATING",
      occuredAt: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      patch(`/api/v1/incident/${incidentId}`, values),
    onSuccess: () => {
      form.reset();
      toast("Incident Created");
      queryClient.refetchQueries({
        queryKey: ["list-incidents"],
      });
      navigate(-1);
    },
    onError: () => {
      toast("Error while creating incident");
    },
  });

  useEffect(() => {
    const fetchIncident = async () => {
      if (incidentId) {
        try {
          setIsLoading(true);
          const response = await get(`/api/v1/incident/${incidentId}`);
          const { title, description, occuredAt, status } =
            response.data as incidentType;
          form.reset({
            title,
            description,
            occuredAt: formatISO(occuredAt).slice(0, 16),
            status,
          });
        } catch (error) {
          console.error(error);
          toast("Error loading component");
          navigate(-1);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchIncident();
  }, [incidentId]);

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
    <div className="mt-5 flex w-full justify-center space-y-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-3xl space-y-6 rounded-md bg-zinc-900 p-5"
        >
          <h1 className="text-xl font-semibold text-white">Edit Incident</h1>

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

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Severity<span className="text-red-500"> *</span>
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

          <FormField
            control={form.control}
            name="occuredAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Occurred At<span className="text-red-500"> *</span>
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
                    placeholder="Detailed description of the incident..."
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-500 hover:bg-green-600"
            >
              {isPending ? "Updating..." : "Update Incident"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
export default IncidentEditForm;
