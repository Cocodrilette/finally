"use client";

import { formatCurrency } from "@/lib/utils";
import { Tables } from "../../database.types";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import { HiddableValue } from "./ui/hiddable-value";
import { SlOptions } from "react-icons/sl";
import { useState } from "react";

export function RecordCard({ record }: { record: Tables<"record"> }) {
  const value = record.price * record.shares;
  const [infoOpen, setInfoOpen] = useState(false);

  function handleInfioClick() {
    setInfoOpen(!infoOpen);
  }

  return (
    <div className="bg-gray-50 shadow-inner border px-5 py-2">
      <div className="text-xl flex items-center justify-between gap-10">
        <p>
          <HiddableValue
            className="text-gray-800"
            value={formatCurrency(value)}
          />{" "}
          <span className="text-xs font-light text-gray-500">
            {record.currency}
          </span>{" "}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/?tab=asset&asset=${record.asset}&shares=${record.shares}`}
          >
            <IoMdAdd className="text-gray-400 hover:text-gray-600 cursor-pointer" />
          </Link>
          <SlOptions
            onClick={handleInfioClick}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          />
        </div>
      </div>
      <Asset asset={record.asset} value={value} shares={record.shares} />
      {infoOpen && (
        <div className="border-t mt-2 pt-2">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Price:</span>{" "}
            <HiddableValue value={formatCurrency(record.price)} />{" "}
            {record.currency}
          </p>
          {record.note && (
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Note:</span> {record.note}
            </p>
          )}
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(record.created_at).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
        </div>
      )}
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
