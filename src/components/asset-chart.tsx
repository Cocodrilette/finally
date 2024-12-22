import React, { useState } from "react";
import { AssetChartData, AssetHistory } from "@/types";
import { DonutChart } from "./ui/donut-chart";
import { LuDonut } from "react-icons/lu";
import { AiOutlineLineChart } from "react-icons/ai";
import { ChartToggleButton } from "./ui/chart-toggle-button";
import { LineChart } from "./ui/line-chart";

type ChartType = "donut" | "line" | null;

export function AssetChart({
  donnutData,
  lineData,
}: {
  donnutData: AssetChartData[];
  lineData: AssetHistory;
}) {
  const [activeChart, setActiveChart] = useState<ChartType>(null);

  const toggleChart = (chartType: ChartType) => {
    setActiveChart((current) => (current === chartType ? null : chartType));
  };

  const filteredDonnutData = donnutData.filter((item) => item.shares > 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5 border shadow-inner p-1 rounded-md w-fit bg-gray-50">
        <ChartToggleButton
          onClick={() => toggleChart("donut")}
          isActive={activeChart === "donut"}
          icon={<LuDonut />}
        />
        <ChartToggleButton
          onClick={() => toggleChart("line")}
          isActive={activeChart === "line"}
          icon={<AiOutlineLineChart />}
        />
      </div>

      {activeChart === "donut" && <DonutChart items={filteredDonnutData} />}
      {activeChart === "line" && <LineChart items={lineData} />}
    </div>
  );
}
