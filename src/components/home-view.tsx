import { getLastUserRecords } from "@/db";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { formatCurrency } from "@/lib/utils";
import { PageTitle } from "./ui/page-title";
import { AssetChartData } from "@/types";
import { HiddableValue } from "./ui/hiddable-value";
import { ToggleHidenButton } from "./ui/toggle-hiden-button";
import { AssetsView } from "./assets-view";

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
      <div className="p-2 flex flex-col gap-10">
        <AssetsView
          donnutData={donnutData}
          loading={loading}
          records={records}
        />
        {/* <ExpensesView loading={loading} /> */}
      </div>
    </div>
  );
}
