import { AssetChartData } from "@/types";
import { RecordCard } from "./asset-card";
import { AssetChart } from "./asset-chart";
import { Tables } from "../../database.types";

export function AssetsView({
  donnutData,
  loading,
  records,
}: {
  donnutData: AssetChartData[];
  loading: boolean;
  records: Tables<"record">[];
}) {
  return (
    <div className="flex flex-col gap-5 border-t pt-2">
      <h2 className="font-mono">{">"} Assets</h2>
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
  );
}
