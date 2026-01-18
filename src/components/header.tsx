"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between p-2 border-b shadow-sm">
      <h1 className="font-[family-name:var(--font-geist-mono)] font-semibold text-xl">
        Fnlly
      </h1>
      {!loading && user && (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cerrar sesión
        </button>
      )}
    </header>
  );
}
