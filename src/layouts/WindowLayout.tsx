import { OrganizationSwitcher } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { ReactNode } from "react";

const WindowLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full w-full">
      <div className="flex h-10 items-center justify-end">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
          }}
          hidePersonal={true}
        />
      </div>
      <div className="space-y-5">
        <div className="container relative m-10 mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default WindowLayout;
