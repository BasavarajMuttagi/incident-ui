import { SignedIn, SignedOut, useOrganization } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const Public = () => {
  const { organization } = useOrganization();

  return (
    <>
      <SignedOut>
        <Outlet />
      </SignedOut>
      <SignedIn>
        <Navigate to={organization ? "/dashboard" : "/onboarding"} replace />
      </SignedIn>
    </>
  );
};

export default Public;
