import { useApiClient } from "@/axios/useApiClient";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const unsubscribeSchema = z.object({
  email: z.string().email(),
  orgId: z.string(),
  unsubscribeCode: z.string(),
});

export function Unsubscribe() {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = useApiClient();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const orgId = searchParams.get("orgId");
  const unsubscribeCode = searchParams.get("unsubscribeCode");

  const unsubscribeData = unsubscribeSchema.safeParse({
    email,
    orgId,
    unsubscribeCode,
  });

  const { isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ["unsubscribe", email, orgId, unsubscribeCode],
    queryFn: async () => {
      if (!unsubscribeData.success) {
        toast.error(
          error instanceof Error ? error.message : "Unsubscribe failed",
        );
      }
      const result = await post(
        "/subscriber/unsubscribe",
        unsubscribeData.data,
      );
      toast.success("Successfully unsubscribed!");
      return result.data;
    },
    enabled: Boolean(email && orgId && unsubscribeCode),
    retry: false,
  });

  if (!unsubscribeData.success) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading && (
            <>
              <div className="relative h-12 w-12">
                <div className="absolute h-12 w-12 rounded-full border-4 border-zinc-700"></div>
                <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500"></div>
              </div>
              <h2 className="text-xl font-semibold text-white">
                Processing Unsubscribe Request
              </h2>
              <p className="text-center text-sm text-zinc-400">
                Please wait while we process your request...
              </p>
            </>
          )}

          {isSuccess && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-green-500">
                Successfully Unsubscribed
              </h2>
              <p className="text-center text-sm text-green-300">
                You have been successfully unsubscribed from our updates.
              </p>
              <p className="mt-2 text-center text-sm text-zinc-400">
                We're sorry to see you go! If you change your mind, you can
                always subscribe again.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 w-full rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700"
              >
                Return Home
              </button>
            </>
          )}

          {isError && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-red-500">
                Unsubscribe Failed
              </h2>
              <p className="text-center text-sm text-red-300">
                {error instanceof Error
                  ? error.message
                  : "Unable to process unsubscribe request"}
              </p>
              <div className="mt-6 flex w-full gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-full rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800"
                >
                  Go Back
                </button>
                <button
                  onClick={() => unsubscribeData?.success && refetch()}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
