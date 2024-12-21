"use client";

import React from "react";
import {
  ResponsiveContainer,
  Legend,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart as RechartsLineChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { AssetChartData } from "@/types";

export function LineChart({ items = [] }: { items?: AssetChartData[] }) {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="h-[400px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart width={500} height={300} data={items}>
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="asset" />
              <YAxis dataKey="" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
