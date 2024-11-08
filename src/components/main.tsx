"use client";

import { useSearchParams } from "next/navigation";
import { Nav } from "./nav";
import { AddRecordView } from "./add-record-view";
import { HomeView } from "./home-view";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export function Main() {
  const { isLoaded: isUserLoaded, userId } = useAuth();

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  useEffect(() => {
    console.log("isLoaded", isUserLoaded);
    console.log("userId", userId);
  }, [isUserLoaded, userId]);

  return (
    <main className="">
      <Nav />
      {tab === "add" && <AddRecordView />}
      {tab === "home" && <HomeView />}
    </main>
  );
}
