import { OrganizationSwitcher } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { ReactNode } from "react";

const WindowLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="overscroll-y-scroll h-full w-full p-2">
      <div className="flex h-10 items-center justify-end">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
          }}
          hidePersonal={true}
        />
      </div>
      <div className="space-y-5">
        <div className="container relative mx-auto mt-10">{children}</div>
      </div>
    </div>
  );
};

export default WindowLayout;
