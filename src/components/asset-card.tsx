"use client";

import { formatCurrency } from "@/lib/utils";
import { Tables } from "../../database.types";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";

export function RecordCard({ record }: { record: Tables<"record"> }) {
  return (
    <div className="bg-gray-50 shadow-inner border px-5 py-2">
      <div className="text-xl flex items-center justify-between gap-10">
        <p>
          {formatCurrency(record.price * record.shares)}{" "}
          <span className="text-xs font-light text-gray-500">
            {record.currency}
          </span>{" "}
        </p>
        <span className="text-gray-400 border shadow-inner">
          <Link href={`/?tab=add&asset=${record.asset}`}>
            <IoMdAdd />
          </Link>
        </span>
      </div>
      <p className="text-sm text-gray-400">{record.asset} </p>
    </div>
  );
}
