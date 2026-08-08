import React, { useState } from "react";

/* ================= TYPES ================= */
export type BarChartDataPoint = {
  label: string;
  value: number;
  secondaryValue?: number;
};

export type PieChartSegment = {
  label: string;
  value: number;
  color: string;
};

/* ================= 1. BAR & AREA TREND CHART ================= */
export const RevenueTrendBarChart: React.FC<{
  data: BarChartDataPoint[];
  title?: string;
  subtitle?: string;
}> = ({ data, title = "Weekly Revenue & Orders Trend", subtitle = "Overview of sales revenue over the past 7 days" }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 100);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 font-serif">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-brand" />
            <span className="text-gray-600 font-medium">Revenue (₹)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500" />
            <span className="text-gray-600 font-medium">Orders Count</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full flex items-end justify-between pt-8 pb-6 px-2 border-b border-gray-100">
        {/* Horizontal Background Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-6">
          <div className="border-b border-gray-400 w-full" />
          <div className="border-b border-gray-400 w-full" />
          <div className="border-b border-gray-400 w-full" />
          <div className="border-b border-gray-400 w-full" />
        </div>

        {data.map((item, idx) => {
          const heightPercent = Math.max(8, Math.round((item.value / maxValue) * 100));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="relative flex-1 flex flex-col items-center justify-end h-full group px-1 z-10"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-lg z-20 whitespace-nowrap animate-fade-in">
                  <span className="text-amber-400 font-mono">₹{item.value.toLocaleString()}</span>
                  {item.secondaryValue !== undefined && (
                    <span className="text-gray-300 ml-1.5">({item.secondaryValue} orders)</span>
                  )}
                </div>
              )}

              {/* Dual Bars */}
              <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isHovered ? "bg-brand/90 scale-105 shadow-md" : "bg-brand"
                  }`}
                />
                {item.secondaryValue !== undefined && (
                  <div
                    style={{ height: `${Math.max(10, Math.round((item.secondaryValue / 20) * 100))}%` }}
                    className="w-2.5 bg-amber-500/80 rounded-t-md transition-all"
                  />
                )}
              </div>

              {/* X Axis Label */}
              <span className="text-[11px] font-medium text-gray-500 mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================= 2. DONUT / PIE STATUS CHART ================= */
export const OrderStatusDonutChart: React.FC<{
  data: PieChartSegment[];
  title?: string;
  totalCount?: number;
}> = ({ data, title = "Order Status Distribution", totalCount }) => {
  const sum = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const computedTotal = totalCount !== undefined ? totalCount : sum;

  let cumulativeAngle = 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-gray-900 font-serif">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">Live breakdown of order statuses</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
            {data.map((seg, idx) => {
              const percentage = seg.value / sum;
              const strokeDasharray = `${percentage * 283} 283`;
              const strokeDashoffset = -cumulativeAngle * 283;
              cumulativeAngle += percentage;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Donut Inner Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-gray-900 leading-none">
              {computedTotal}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-1">
              Total Tasks
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 flex-1 w-full">
          {data.map((seg, idx) => {
            const pct = Math.round((seg.value / sum) * 100);
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-semibold text-gray-700">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-gray-900">{seg.value}</span>
                  <span className="text-gray-400 text-[10px]">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================= 3. DELIVERY PERFORMANCE BAR CHART ================= */
export const DeliveryPerformanceChart: React.FC<{
  data: BarChartDataPoint[];
  title?: string;
  subtitle?: string;
}> = ({ data, title = "Daily Delivery Completion Performance", subtitle = "Tasks completed vs target goals" }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value), 10);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 font-serif">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          Target: 8 Deliveries/day
        </span>
      </div>

      <div className="relative h-48 w-full flex items-end justify-between pt-6 pb-6 px-2 border-b border-gray-100">
        {data.map((item, idx) => {
          const heightPercent = Math.max(12, Math.round((item.value / maxValue) * 100));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="relative flex-1 flex flex-col items-center justify-end h-full group px-1.5 z-10"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isHovered && (
                <div className="absolute -top-10 bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-lg z-20 whitespace-nowrap">
                  {item.value} Orders Completed
                </div>
              )}

              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                  item.value >= 8
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-brand hover:bg-brand/90"
                }`}
              />

              <span className="text-[11px] font-medium text-gray-500 mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
