import { useApiClient } from "@/axios/useApiClient";
import { Card } from "@/components/ui/card";
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
import { Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  status: z.enum(["OPERATIONAL", "DEGRADED", "PARTIAL_OUTAGE", "MAJOR_OUTAGE"]),
  description: z.string(),
});

const statusOptions = [
  {
    value: "OPERATIONAL",
    label: "Operational",
    icon: CheckCircle,
    className:
      "bg-emerald-500/20 text-emerald-500 data-[state=on]:bg-emerald-500 data-[state=on]:text-white",
  },
  {
    value: "DEGRADED",
    label: "Degraded",
    icon: Activity,
    className:
      "bg-yellow-500/20 text-yellow-500 data-[state=on]:bg-yellow-500 data-[state=on]:text-white",
  },
  {
    value: "PARTIAL_OUTAGE",
    label: "Partial Outage",
    icon: AlertCircle,
    className:
      "bg-orange-500/20 text-orange-500 data-[state=on]:bg-orange-500 data-[state=on]:text-white",
  },
  {
    value: "MAJOR_OUTAGE",
    label: "Major Outage",
    icon: XCircle,
    className:
      "bg-red-500/20 text-red-500 data-[state=on]:bg-red-500 data-[state=on]:text-white",
  },
];

function ComponentForm() {
  const { componentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { post, get, patch } = useApiClient();
  const isEditMode = Boolean(componentId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "OPERATIONAL",
      description: "",
    },
  });

  const { isLoading: isFetching } = useQuery({
    queryKey: ["component", componentId],
    queryFn: async () => {
      if (!componentId) return null;
      try {
        const response = await get(`/component/${componentId}`);
        form.reset(response.data);
        return response.data;
      } catch (error) {
        toast.error("Error loading component");
        navigate(-1);
        throw error;
      }
    },
    enabled: Boolean(componentId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (isEditMode) {
        return patch(`/component/${componentId}`, values);
      }
      return post("/component/create", values);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Component Updated" : "Component Created");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["list-components"] });
      navigate(-1);
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <div className="mt-5 flex w-full justify-center space-y-5">
      <Card className="w-full max-w-3xl bg-zinc-900">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 rounded-md p-5"
          >
            <h1 className="text-xl font-semibold text-white">
              {isEditMode ? "Edit Component" : "Create Component"}
            </h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Name<span className="text-red-500">*</span>
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
                    Status<span className="text-red-500">*</span>
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
                          className={`flex items-center gap-2 rounded-md px-4 py-2 ${option.className}`}
                        >
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[150px] resize-none border-0 bg-zinc-800"
                      placeholder="Enter description..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="bg-zinc-800 text-white hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                disabled={isPending || isFetching}
                type="submit"
                className="bg-green-500 text-white hover:bg-green-400"
              >
                {isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update"
                    : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
export default ComponentForm;
