import React, { useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

import { RecordChartData } from "@/types";

export function RecordLineChart({ data }: { data: RecordChartData[] }) {
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);

  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value);
  };

  const toggleChartVisibility = () => {
    setIsChartVisible(!isChartVisible);
  };

  const filteredData = selectedAsset
    ? data.filter((record) => record.asset === selectedAsset)
    : data;

  const uniqueAssets = Array.from(new Set(data.map((record) => record.asset)));

  return (
    <div className="flex flex-col justify-between items-center border shadow-inner p-2">
      <div className="flex justify-between items-center w-full">
        {isChartVisible && (
          <div className="flex items-center gap-2">
            <label htmlFor="asset-selector">Asset</label>
            <select
              id="asset-selector"
              value={selectedAsset}
              onChange={handleAssetChange}
              className="p-2 border rounded"
            >
              <option value="">All</option>
              {uniqueAssets.map((asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </select>
          </div>
        )}
        <button onClick={toggleChartVisibility}>
          {isChartVisible ? "Hide Chart" : "Show Chart"}
        </button>
      </div>
      {isChartVisible && (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart className="text-xs" data={filteredData}>
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
