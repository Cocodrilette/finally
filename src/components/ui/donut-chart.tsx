"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { AssetChartData } from "@/types";

const defaultData: AssetChartData[] = [
  { asset: "Stock A", shares: 300 },
  { asset: "Stock B", shares: 200 },
  { asset: "Stock C", shares: 150 },
  { asset: "Stock D", shares: 100 },
  { asset: "Stock E", shares: 50 },
];

const COLORS = [
  "#1a1a1a", // Very dark gray
  "#2e2e2e",
  "#5e5e5e",
  "#7a7a7a",
  "#a0a0a0",
  "#b4b4b4",
  "#dcdcdc",
  "#e0e0e0", // Light gray
];

export function DonutChart({
  items = defaultData,
}: {
  items?: AssetChartData[];
}) {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="h-[400px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={2}
                dataKey="shares"
                nameKey="asset"
              >
                {items.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
