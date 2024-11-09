import { getLastUserRecords } from "@/db";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import { RecordCard } from "./asset-card";

export function HomeView() {
  const { isLoaded: isUserLoaded, userId } = useAuth();
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
      setRecords(data);
    }
  }

  useEffect(() => {
    if (isUserLoaded && userId) {
      fetchRecords(userId);
    }
  }, [isUserLoaded, userId]);

  return (
    <div>
      <h1 className="text-2xl font-thin p-2 mb-5">HOME</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {records ? (
            <ul>
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
  );
}
