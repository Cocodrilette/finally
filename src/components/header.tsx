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
    <header className="flex items-center justify-between p-2 border-b shadow-sm">
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
