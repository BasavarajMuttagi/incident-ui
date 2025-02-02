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
import { Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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
    label: "Performance Issues",
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

export function ComponentFormDialog({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { post } = useApiClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "OPERATIONAL",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await post("/api/v1/component/create", values);
      form.reset();
      refetch();
      setOpen(false);
      toast("Component Created");
    } catch (error) {
      console.error(error);
      toast("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setOpen(open);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-500 text-white">
          New Component
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Component
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 rounded-md"
          >
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
            <div className="flex items-center justify-end space-x-3">
              <Button
                disabled={isLoading}
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-green-500 text-white hover:bg-green-400"
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
