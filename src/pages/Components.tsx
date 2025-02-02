import { ComponentFormDialog } from "@/components/ComponentFormDialog";
import { ComponentsTable } from "@/components/ComponentsTable";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

const Components = () => {
  return (
    <div className="h-full w-full overscroll-y-auto p-2">
      <div className="flex items-center justify-end">
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
          }}
          hidePersonal={true}
        />
      </div>
      <div className="space-y-5">
        <div className="container mx-auto py-10">
          <div className="mt-5 flex justify-end">
            <ComponentFormDialog />
          </div>
          <ComponentsTable />
        </div>
      </div>
    </div>
  );
};

export default Components;
