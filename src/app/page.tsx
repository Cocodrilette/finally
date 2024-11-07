"use client";

import { Nav } from "@/components/nav";
import { NewFinanceRecordFormComponent } from "@/components/new-finance-record-form";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  console.log(tab);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <Nav />
        {tab === "add" && <NewFinanceRecordFormComponent />}
      </main>
    </div>
  );
}
