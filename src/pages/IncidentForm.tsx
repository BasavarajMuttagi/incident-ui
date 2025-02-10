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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { componentStatusOptions, incidentStatusOptions } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
export type ComponentType = {
  orgId: string;
  name: string;
  id: string;
  description: string | null;
  status: "OPERATIONAL" | "DEGRADED" | "PARTIAL_OUTAGE" | "MAJOR_OUTAGE";
  createdAt: Date;
  updatedAt: Date;
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"], {
    message: "Select Any One",
  }),
  occuredAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  components: z
    .array(
      z.object({
        componentId: z.string().min(1, "Component is required"),
        status: z.enum([
          "OPERATIONAL",
          "DEGRADED",
          "PARTIAL_OUTAGE",
          "MAJOR_OUTAGE",
        ]),
      }),
    )
    .optional()
    .default([]),
});

export function IncidentForm() {
  const { get } = useApiClient();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { post } = useApiClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "INVESTIGATING",
      occuredAt: "",
      components: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      post("/incident/create", values),
    onSuccess: () => {
      form.reset();
      toast.success("Incident Created");
      queryClient.refetchQueries({
        queryKey: ["list-incidents"],
      });
      navigate(-1);
    },
    onError: () => {
      toast.error("Error while creating incident");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  const { data: ListData } = useQuery<ComponentType[]>({
    queryKey: ["list-components"],
    queryFn: async () => {
      try {
        const result = await get(`/component/list`);
        return result.data;
      } catch (error) {
        console.log(error);
        toast.error("Error while fetching components");
      }
    },
  });
  return (
    <div className="mt-5 flex w-full justify-center space-y-5">
      <Card className="w-full max-w-3xl bg-zinc-900">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 rounded-md p-5"
          >
            <h1 className="text-xl font-semibold text-white">
              Create Incident
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

            <div className="space-y-4">
              <FormLabel className="text-white">Affected Components</FormLabel>

              {form.watch("components")?.map((_, index) => (
                <div key={index} className="space-y-4 rounded-md border p-4">
                  <FormField
                    control={form.control}
                    name={`components.${index}.componentId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-white">
                          Select Component Affected
                          <span className="text-red-500"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select component" />
                            </SelectTrigger>
                            <SelectContent>
                              {ListData?.filter(
                                (component) =>
                                  !form
                                    .getValues("components")
                                    .some(
                                      (selected, selectedIndex) =>
                                        selected.componentId === component.id &&
                                        selectedIndex !== index,
                                    ),
                              ).map((component) => (
                                <SelectItem
                                  key={component.id}
                                  value={component.id}
                                >
                                  {component.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`components.${index}.status`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                            {componentStatusOptions.map((option) => (
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

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const components = form.getValues("components");
                      form.setValue(
                        "components",
                        components.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div>
                <Button
                  type="button"
                  onClick={() => {
                    const currentComponents =
                      form.getValues("components") || [];
                    form.setValue("components", [
                      ...currentComponents,
                      { componentId: "", status: "OPERATIONAL" },
                    ]);
                  }}
                  disabled={
                    form.watch("components")?.length === ListData?.length
                  }
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add Component
                </Button>
              </div>
            </div>

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
                {isPending ? "Creating..." : "Create Incident"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
