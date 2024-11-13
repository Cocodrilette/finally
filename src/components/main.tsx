"use client";

import { useSearchParams } from "next/navigation";
import { Nav } from "./nav";
import { AddRecordView } from "./add-record-view";
import { HomeView } from "./home-view";
import { AddExpenseView } from "./add-expense-view";

export function Main() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  return (
    <main className="">
      <Nav />
      {tab === "home" && <HomeView />}
      {tab === "asset" && <AddRecordView />}
      {tab === "expense" && <AddExpenseView />}
    </main>
  );
}
