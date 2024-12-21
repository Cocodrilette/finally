"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { AssetChartData } from "@/types";
import { generateHexColor } from "@/lib/utils";

export function DonutChart({ items = [] }: { items?: AssetChartData[] }) {
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
                dataKey="value"
                nameKey="asset"
              >
                {items.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={generateHexColor(item.asset)}
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
