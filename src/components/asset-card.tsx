import { formatCurrency } from "@/lib/utils";
import { Tables } from "../../database.types";

export function RecordCard({ record }: { record: Tables<"record"> }) {
  return (
    <div className="bg-gray-50 shadow-inner border px-5 py-2">
      <p className="text-lg">
        {formatCurrency(record.price * record.shares)}{" "}
        <span className="text-xs font-light text-gray-500">
          {record.currency}
        </span>{" "}
      </p>
      <p className="text-sm text-gray-400">{record.asset} </p>
    </div>
  );
}
