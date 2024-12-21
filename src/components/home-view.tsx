import { getLastUserRecords } from "@/db";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { formatCurrency } from "@/lib/utils";
import { PageTitle } from "./ui/page-title";
import { AssetChartData } from "@/types";
import { HiddableValue } from "./ui/hiddable-value";
import { ToggleHidenButton } from "./ui/toggle-hiden-button";
import { AssetChart } from "./asset-chart";
import { RecordCard } from "./asset-card";

export function HomeView() {
  const { isLoaded: isUserLoaded, userId } = useAuth();
  const [total, setTotal] = useState(0);
  const [records, setRecords] = useState<Array<Tables<"record">>>([]);
  const [donnutData, setDonnutData] = useState<AssetChartData[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRecords(userId: string) {
    setLoading(true);
    const { data, error } = await getLastUserRecords(userId);
    setLoading(false);

    if (error) {
      console.error("Error fetching records", error);
    }

    if (data) {
      setTotal(
        data.reduce((acc, record) => acc + record.price * record.shares, 0)
      );
      setDonnutData(
        data.map((record) => ({
          asset: record.asset.split(" ")[0],
          shares: record.shares,
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
        <AssetChart items={donnutData} />
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
                  {records.filter(record => record.shares > 0).map((record) => (
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
