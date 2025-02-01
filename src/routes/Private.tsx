import { SignedIn, SignedOut, useOrganization } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
  const { isLoaded, organization } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        {organization ? <Outlet /> : <Navigate to="/onboarding" replace />}
      </SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

export default Private;
