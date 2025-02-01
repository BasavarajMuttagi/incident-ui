import { CreateOrganization } from "@clerk/clerk-react";
const SignUp = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-5 bg-[#111111] py-2">
      <CreateOrganization />
    </div>
  );
};

export default SignUp;
