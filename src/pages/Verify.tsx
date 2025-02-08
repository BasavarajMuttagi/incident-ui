import { useApiClient } from "@/axios/useApiClient";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  orgId: z.string(),
  verificationCode: z.string(),
});

export function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = useApiClient();

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const orgId = searchParams.get("orgId");
  const verificationCode = searchParams.get("verificationCode");

  const verificationData = verifySchema.safeParse({
    email,
    orgId,
    verificationCode,
  });

  const { isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ["verify", email, orgId, verificationCode],
    queryFn: async () => {
      if (!verificationData.success) {
        toast.error(
          error instanceof Error ? error.message : "Verification failed",
        );
      }
      const result = await post("/subscriber/verify", verificationData.data);
      toast.success("Email verified successfully!");
      return result.data;
    },
    enabled: Boolean(email && orgId && verificationCode),
    retry: false,
  });

  if (!verificationData.success) {
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
                Verifying Email
              </h2>
              <p className="text-center text-sm text-zinc-400">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {isSuccess && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-green-500">
                Email Verified!
              </h2>
              <p className="text-center text-sm text-green-300">
                Your email has been successfully verified.
              </p>
            </>
          )}

          {isError && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-red-500">
                Verification Failed
              </h2>
              <p className="text-center text-sm text-red-300">
                {error instanceof Error
                  ? error.message
                  : "Unable to verify email"}
              </p>
              <div className="mt-6 flex w-full gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-full rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-800"
                >
                  Go Back
                </button>
                <button
                  onClick={() => verificationData?.success && refetch()}
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
