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
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Info, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  severity: z.enum(["MINOR", "MAJOR", "CRITICAL"], {
    message: "Select Any One",
  }),
  occuredAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

const severityOptions = [
  {
    value: "MINOR",
    label: "Minor",
    icon: Info,
    className:
      "bg-blue-500/20 text-blue-500 data-[state=on]:bg-blue-500 data-[state=on]:text-white",
  },
  {
    value: "MAJOR",
    label: "Major",
    icon: AlertCircle,
    className:
      "bg-orange-500/20 text-orange-500 data-[state=on]:bg-orange-500 data-[state=on]:text-white",
  },
  {
    value: "CRITICAL",
    label: "Critical",
    icon: XCircle,
    className:
      "bg-red-500/20 text-red-500 data-[state=on]:bg-red-500 data-[state=on]:text-white",
  },
];

export function IncidentForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { post } = useApiClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "MINOR",
      occuredAt: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      post("/api/v1/incident/create", values),
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-2">
      <div className="flex items-center justify-end">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
          }}
          hidePersonal={true}
        />
      </div>
      <div className="mt-5 flex w-full justify-center space-y-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-3xl space-y-6 rounded-md bg-zinc-900 p-5"
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
              name="severity"
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
                      {severityOptions.map((option) => (
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
                {isPending ? "Submitting..." : "Submit Incident"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
