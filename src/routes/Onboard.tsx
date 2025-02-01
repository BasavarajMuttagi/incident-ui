import { useOrganization, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const Onboard = () => {
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
        {organization ? <Navigate to="/dashboard" replace /> : <Outlet />}
      </SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

export default Onboard;
