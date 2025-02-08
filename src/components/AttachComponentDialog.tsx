import { useApiClient } from "@/axios/useApiClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { ScrollArea } from "./ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { componentStatusOptions } from "@/lib/utils";

type ComponentType = {
  id: string;
  name: string;
};

const formSchema = z.object({
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
    .min(1, "At least one component is required"),
});

export function AttachComponentDialog({ incidentId }: { incidentId: string }) {
  const [open, setOpen] = useState(false);
  const { get, post } = useApiClient();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      components: [],
    },
  });

  const { data: ListData } = useQuery<ComponentType[]>({
    queryKey: ["unattached-components"],
    queryFn: async () => {
      const response = await get(
        `/incident/${incidentId}/components/unattached`,
      );
      return response.data;
    },
    enabled: open,
  });

  const attachMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      await post(`/incident/${incidentId}/components/attach`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-components"] });
      form.reset();
      setOpen(false);
      toast.success("Components attached successfully");
    },
    onError: () => {
      toast.error("Failed to attach components");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    attachMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-500 hover:bg-blue-400/10 hover:text-blue-600"
        >
          Attach
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Attach Components
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {form.watch("components")?.map((_, index) => (
                  <div key={index} className="space-y-4 rounded-md border p-4">
                    <FormField
                      control={form.control}
                      name={`components.${index}.componentId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Select Component
                            <span className="text-red-500"> *</span>
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select component" />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`components.${index}.status`}
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
                          <FormMessage className="text-red-500" />
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

              <div className="flex justify-end gap-4">
                <Button
                  type="submit"
                  disabled={attachMutation.isPending}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {attachMutation.isPending ? "Attaching..." : "Attach"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
