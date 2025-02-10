import logo from "@/assets/react.svg";
import { OrganizationList, UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
export default function Onboarding() {
  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/[0.08] bg-black/50 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <img src={logo} />
            <span className="text-lg font-medium">IncidentPulse</span>
          </div>
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox: "flex flex-row",
                userButtonOuterIdentifier: "order-1",
                userButtonTrigger: "flex flex-row items-center",
              },
              baseTheme: dark,
            }}
          />
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
