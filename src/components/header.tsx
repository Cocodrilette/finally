"use client";

import {
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  const { isLoaded, userId } = useAuth();
  return (
    <header className="flex items-center justify-between px-5 py-2 border-b shadow-sm mb-5">
      <h1 className="font-[family-name:var(--font-geist-mono)] font-semibold text-xl">
        Fnlly
      </h1>
      {isLoaded && userId && (
        <SignOutButton>
          <UserButton />
        </SignOutButton>
      )}
    </header>
  );
}
