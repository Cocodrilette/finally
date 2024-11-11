import React, { useState } from "react";
import { AssetChartData } from "@/types";
import { DonutChart } from "./ui/donut-chart";
import { LuDonut } from "react-icons/lu";

export function AssetChart({ items }: { items: AssetChartData[] }) {
  const [isChartVisible, setIsChartVisible] = useState(false);

  const toggleChartVisibility = () => {
    setIsChartVisible(!isChartVisible);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5 border shadow-inner p-1 rounded-md w-fit bg-gray-50">
        <button
          onClick={toggleChartVisibility}
          className={`text-2xl ${
            isChartVisible ? "text-gray-900" : "text-gray-500"
          }`}
        >
          <LuDonut />
        </button>
      </div>
      {isChartVisible && <DonutChart items={items} />}
    </div>
  );
}
