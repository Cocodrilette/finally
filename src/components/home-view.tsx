import { getLastUserRecords, getRecordsByUser } from "@/db";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { RecordCard } from "./asset-card";
import { formatCurrency } from "@/lib/utils";
import { PageTitle } from "./ui/page-title";
import { RecordLineChart } from "./record-line-chart";
import { RecordChartData } from "@/types";
import { HiddableValue } from "./ui/hiddable-value";
import { ToggleHidenButton } from "./ui/toggle-hiden-button";

export function HomeView() {
  const { isLoaded: isUserLoaded, userId } = useAuth();
  const [total, setTotal] = useState(0);
  const [records, setRecords] = useState<Array<Tables<"record">>>([]);
  const [allRecords, setAllRecords] = useState<RecordChartData[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRecords(userId: string) {
    setLoading(true);
    const { data, error } = await getLastUserRecords(userId);
    const { data: allRecords, error: allRecordError } = await getRecordsByUser(
      userId
    );
    setLoading(false);

    if (error || allRecordError) {
      console.error("Error fetching records", error);
    }

    if (data && allRecords) {
      setTotal(
        data.reduce((acc, record) => acc + record.price * record.shares, 0)
      );
      setAllRecords(
        allRecords.map((record) => ({
          asset: record.asset.split(" ")[0],
          created_at: record.created_at,
          price: record.shares * record.price,
        }))
      );
      setRecords(data);
    }
  }

  useEffect(() => {
    if (isUserLoaded && userId) {
      fetchRecords(userId);
    }
  }, [isUserLoaded, userId]);

  return (
    <div className="flex flex-col max-w-xl m-auto">
      {/* 
        Title
      */}
      <div className="flex items-center">
        <PageTitle>
          <HiddableValue
            value={loading ? "330.144.889,95" : formatCurrency(total)}
          />
        </PageTitle>
        <ToggleHidenButton />
      </div>
      {/*
       */}
      <div className="p-2 flex flex-col gap-5">
        <RecordLineChart data={allRecords} />
        <div>
          {loading ? (
            <ul className="flex flex-wrap gap-2">
              {Array.from({ length: 1 }).map((_, index) => (
                <RecordCard
                  key={index}
                  record={{
                    asset: "BTC",
                    currency: "COP",
                    price: 330_144_889.95,
                    shares: 1,
                    id: 0,
                    user: "Who?",
                    created_at: new Date().toISOString(),
                    note: "",
                  }}
                />
              ))}
            </ul>
          ) : (
            <>
              {records ? (
                <ul className="flex flex-wrap gap-2">
                  {records.map((record) => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </ul>
              ) : (
                <p>No records found</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
