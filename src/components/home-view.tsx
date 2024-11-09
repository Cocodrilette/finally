import { getLastUserRecords } from "@/db";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { RecordCard } from "./asset-card";

export function HomeView() {
  const { isLoaded: isUserLoaded, userId } = useAuth();
  const [total, setTotal] = useState(0);
  const [records, setRecords] = useState<Array<Tables<"record">>>([]);
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
      setRecords(data);
    }
  }

  useEffect(() => {
    if (isUserLoaded && userId) {
      fetchRecords(userId);
    }
  }, [isUserLoaded, userId]);

  return (
    <div className="p-2">
      <h1 className="text-2xl font-thin mb-5">HOME</h1>
      <div className="flex flex-col max-w-lg m-auto">
        <p className="text-4xl font-extralight">
          {loading
            ? "00.000.000"
            : new Intl.NumberFormat("es-CO", {
                style: "decimal",
                currency: "COP",
              }).format(total)}
        </p>
        <div>
          {loading ? (
            <ul className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="w-48 h-24 bg-gray-100 animate-pulse"
                ></div>
              ))}
            </ul>
          ) : (
            <>
              {records ? (
                <ul className="flex flex-wrap gap-2">
                  {records.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      isLoading={loading}
                    />
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
