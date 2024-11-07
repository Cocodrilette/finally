"use client";

import { AddRecordView } from "@/components/add-record-view";
import { HomeView } from "@/components/home-view";
import { Nav } from "@/components/nav";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <Nav />
        {tab === "add" && <AddRecordView />}
        {tab === "home" && <HomeView />}
      </main>
    </div>
  );
}
