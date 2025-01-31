import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
const Auth = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-5 bg-[#111111] py-2">
      <SignIn appearance={{ baseTheme: dark }} />
    </div>
  );
};

export default Auth;
