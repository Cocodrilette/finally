import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center p-auto m-10 h-[571px]">
      <SignIn />
    </div>
  );
}
