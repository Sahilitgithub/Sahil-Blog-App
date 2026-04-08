"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies ChartConfig;

export function AppBarChart() {
  const [chartData, setChartData] = useState<{ month: string; desktop: number; mobile: number; }[]>([]);

  useEffect(() => {
    fetch("/api/visitors-data")
      .then((res) => res.json())
      .then(setChartData)
      .catch(console.error);
  }, []);

  const totalVisitors = chartData.reduce((sum, d) => sum + d.desktop + d.mobile, 0);

  return (
    <div>
      <h1 className="text-[17px]">Total Visitors ({totalVisitors})</h1>
      <ChartContainer config={chartConfig} className="min-h-[400px] w-full text-white">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={v => v.slice(0, 3)} />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
