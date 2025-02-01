import { OrganizationList } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export default function SelectAccount() {
  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/[0.08] bg-black/50 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-blue-600"></div>
            <span className="text-lg font-medium">StatusHub</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <OrganizationList
          appearance={{
            baseTheme: dark,
          }}
          hidePersonal={true}
        />
      </div>
    </div>
  );
}
