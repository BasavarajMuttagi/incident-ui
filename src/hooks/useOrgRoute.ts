import { useAuth } from "@clerk/clerk-react";

export const useOrgRoute = () => {
  const { orgId } = useAuth();
  const getOrgRoute = (path: string) => `/org/${orgId}/${path}`;

  return { getOrgRoute, orgId };
};
