import { SignedIn, SignedOut, useOrganization } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const Onboard = () => {
  const { organization } = useOrganization();

  return (
    <>
      <SignedIn>
        {organization ? <Navigate to="/dashboard" replace /> : <Outlet />}
      </SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

export default Onboard;
