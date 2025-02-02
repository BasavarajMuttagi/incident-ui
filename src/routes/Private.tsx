import { SignedIn, SignedOut, useOrganization } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
  const { organization } = useOrganization();

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
