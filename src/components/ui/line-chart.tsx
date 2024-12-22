"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart as RechartsLineChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetHistory } from "@/types";
import { generateHexColor } from "@/lib/utils";

export function LineChart({ items }: { items: AssetHistory }) {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("all");

  const uniqueAssets = useMemo(() => {
    return [...new Set(items.map((item) => item.asset))];
  }, [items]);

  const filteredData = useMemo(() => {
    if (!selectedAsset) return [];
    const now = new Date();
    let filteredItems = items.filter((item) => item.asset === selectedAsset);

    if (timeRange === "7days") {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      filteredItems = filteredItems.filter(
        (item) => new Date(item.date) >= sevenDaysAgo
      );
    } else if (timeRange === "month") {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredItems = filteredItems.filter(
        (item) => new Date(item.date) >= oneMonthAgo
      );
    }

    return filteredItems;
  }, [selectedAsset, timeRange, items]);

  return (
    <Card className="h-full">
      <CardContent>
        <div className="mb-4 mt-6 flex space-x-4">
          <Select value={selectedAsset || ""} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {uniqueAssets.map((asset) => (
                <SelectItem key={asset} value={asset}>
                  {asset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[300px] sm:h-[300px] text-sm">
          {selectedAsset ? (
            filteredData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data
              </div>
            ) : filteredData.length < 3 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Not enough data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={filteredData}>
                  <XAxis
                    dataKey="date"
                    type="category"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <YAxis
                    dataKey="price"
                    type="number"
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `$${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `$${(value / 1000).toFixed(1)}k`;
                      }
                      return `$${value.toFixed(2)}`;
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toFixed(2)}`,
                      "Price",
                    ]}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString()
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name={selectedAsset}
                    stroke={generateHexColor(selectedAsset[0])}
                    dot={false}
                    strokeWidth={2}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select an asset to view the chart
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
