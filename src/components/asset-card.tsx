import { Tables } from "../../database.types";

const copIntl = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});

export function RecordCard({
  isLoading,
  record,
}: {
  isLoading: boolean;
  record: Tables<"record">;
}) {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold">{record.asset} </h2>
          <p className="text-lg">
            {copIntl.format(record.price * record.shares)}{" "}
            <span className="text-xs font-light text-gray-500">
              {record.currency}
            </span>{" "}
          </p>
        </>
      )}
    </div>
  );
}
