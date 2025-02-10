import { useOrgRoute } from "@/hooks/useOrgRoute";
import { SignedIn, SignedOut, useOrganization } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const Public = () => {
  const { organization } = useOrganization();
  const { getOrgRoute } = useOrgRoute();
  return (
    <>
      <SignedOut>
        <Outlet />
      </SignedOut>
      <SignedIn>
        <Navigate
          to={organization ? getOrgRoute("dashboard") : "/onboarding"}
          replace
        />
      </SignedIn>
    </>
  );
};

export default Public;
