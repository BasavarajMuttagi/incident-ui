import { useApiClient } from "@/axios/useApiClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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
import { Input } from "./ui/input";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  orgId: z.string(),
});

export function NewSubscriberDialogPublic({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const { post } = useApiClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      orgId,
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const result = await post(`/subscriber/public`, values);
      return result.data;
    },
    onSuccess: (data) => {
      form.reset();
      setOpen(false);
      toast.success(data.message);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }
      toast.error("Failed to create subscriber");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    subscribeMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="rounded-sm bg-blue-500 text-white hover:bg-white hover:text-blue-500"
        >
          Subscribe To Updates
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Subscribe Via Email
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Email<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {subscribeMutation.isPending
                  ? "Sending..."
                  : "Send Verification"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
