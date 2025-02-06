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
import { useQueryClient } from "@tanstack/react-query";
import { Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
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

export function ComponentForm() {
  const { componentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchComponent = async () => {
      if (componentId) {
        try {
          setIsLoading(true);
          const response = await get(`/api/v1/component/${componentId}`);
          form.reset({
            name: response.data.name,
            status: response.data.status,
            description: response.data.description,
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

    fetchComponent();
  }, [componentId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (isEditMode) {
        await patch(`/api/v1/component/${componentId}`, values);
        toast("Component Updated");
      } else {
        await post("/api/v1/component/create", values);
        toast("Component Created");
      }
      form.reset();
      queryClient.refetchQueries({
        queryKey: ["list-components"],
      });
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5 flex w-full justify-center space-y-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-3xl space-y-6 rounded-md bg-zinc-900 p-5"
        >
          <h1 className="text-xl font-semibold text-white">
            {isEditMode ? "Update Component" : "Create Component"}
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
              disabled={isLoading}
              type="submit"
              className="bg-green-500 text-white hover:bg-green-400"
            >
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Component"
                  : "Create Component"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
