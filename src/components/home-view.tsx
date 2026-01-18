import { getLastUserRecords } from "@/db";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { formatCurrency, getAssetsHistory } from "@/lib/utils";
import { PageTitle } from "./ui/page-title";
import { AssetChartData, AssetHistory } from "@/types";
import { HiddableValue } from "./ui/hiddable-value";
import { ToggleHidenButton } from "./ui/toggle-hiden-button";
import { AssetChart } from "./asset-chart";
import { RecordCard } from "./asset-card";
import { createClient } from "@/lib/supabase/client";

export function HomeView() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [records, setRecords] = useState<Array<Tables<"record">>>([]);
  const [donnutData, setDonnutData] = useState<AssetChartData[]>([]);
  const [assetHistory, setAssetHistory] = useState<AssetHistory>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      setIsUserLoaded(true);
    };

    getUser();
  }, [supabase]);

  async function fetchRecords(userId: string) {
    setLoading(true);
    const { data: lastUserRecords, error: lastUserRecordsError } =
      await getLastUserRecords(userId);
    const { data: userRecords, error: userRecordsError } =
      await getAssetsHistory(userId);
    setLoading(false);

    if (lastUserRecordsError) {
      console.error("Error fetching records", lastUserRecordsError);
    }
    if (userRecordsError) {
      console.error("Error fetching records", userRecordsError);
    }

    if (lastUserRecords) {
      setTotal(
        lastUserRecords.reduce(
          (acc, record) => acc + record.price * record.shares,
          0
        )
      );
      setDonnutData(
        lastUserRecords.map((record) => ({
          asset: record.asset.split(" ")[0],
          shares: record.shares,
          price: record.price,
          value: record.price * record.shares,
        }))
      );
      setRecords(lastUserRecords);
    }

    if (userRecords) {
      setAssetHistory(userRecords);
    }
  }

  useEffect(() => {
    if (isUserLoaded && userId) {
      fetchRecords(userId);
    }
  }, [isUserLoaded, userId]);

  return (
    <div className="flex flex-col max-w-2xl m-auto">
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
        <AssetChart donnutData={donnutData} lineData={assetHistory} />
        <div>
          <ul className="flex flex-wrap gap-2">
            {loading ? (
              <>
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
              </>
            ) : (
              <>
                {records ? (
                  <>
                    {records
                      .filter((record) => record.shares > 0)
                      .map((record) => (
                        <RecordCard key={record.id} record={record} />
                      ))}
                  </>
                ) : (
                  <p>No records found</p>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
