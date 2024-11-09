import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center pt-5 m-auto h-[571px]">
      <SignIn />
    </div>
  );
}
