"use client";

import { formatCurrency } from "@/lib/utils";
import { Tables } from "../../database.types";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import { HiddableValue } from "./ui/hiddable-value";

export function RecordCard({ record }: { record: Tables<"record"> }) {
  const value = record.price * record.shares;

  return (
    <div className="bg-gray-50 shadow-inner border px-5 py-2">
      <div className="text-xl flex items-center justify-between gap-10">
        <p>
          <HiddableValue value={formatCurrency(value)} />{" "}
          <span className="text-xs font-light text-gray-500">
            {record.currency}
          </span>{" "}
        </p>
        <span className="text-gray-400 border shadow-inner">
          <Link href={`/?tab=add&asset=${record.asset}&shares=${record.shares}`}>
            <IoMdAdd />
          </Link>
        </span>
      </div>
      <Asset asset={record.asset} value={value} shares={record.shares} />
    </div>
  );
}

function Asset({
  asset,
  value,
  shares,
}: {
  asset: string;
  value: number;
  shares: number;
}) {
  return (
    <p className="text-sm text-gray-400">
      {asset}{" "}
      {value === shares ? (
        ""
      ) : (
        <>
          (<HiddableValue value={shares.toString()} />)
        </>
      )}
    </p>
  );
}
