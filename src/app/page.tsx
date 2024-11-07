"use client";

import { Nav } from "@/components/nav";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  console.log(tab);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <Nav />
      </main>
    </div>
  );
}
