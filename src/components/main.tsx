"use client";

import { useSearchParams } from "next/navigation";
import { Nav } from "./nav";
import { AddRecordView } from "./add-record-view";
import { HomeView } from "./home-view";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { usersTable } from "@/db/schema";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export function Main() {
  const { isLoaded: isUserLoaded, userId } = useAuth();

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  async function fetchUser() {
    const user = await db
      .select()
      .from(usersTable)
      .where(sql`id = ${userId}`);

    if (user) {
      console.log("User is logged in");
    } else {
      console.log("User is not in the database");
    }
  }

  useEffect(() => {
    console.log("isLoaded", isUserLoaded);
    console.log("userId", userId);

    if (isUserLoaded && userId) {
      fetchUser();
    } else {
      console.log("User is not logged in");
    }
  }, [isUserLoaded, userId]);

  return (
    <main className="">
      <Nav />
      {tab === "add" && <AddRecordView />}
      {tab === "home" && <HomeView />}
    </main>
  );
}
