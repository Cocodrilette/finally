"use client";

import { useSearchParams } from "next/navigation";
import { Nav } from "./nav";
import { AddRecordView } from "./add-record-view";
import { HomeView } from "./home-view";

export function Main() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  return (
    <main className="">
      <Nav />
      {tab === "add" && <AddRecordView />}
      {tab === "home" && <HomeView />}
    </main>
  );
}
