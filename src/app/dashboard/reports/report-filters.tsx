"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchReportData } from "./actions";

export type ReportFilters = {
  timeframe: "bulanan" | "tahunan";
  month: number;
  year: number;
  categoryId?: number;
  bahagian?: string;
};

export function ReportFiltersBar({
  categories,
  bahagianList,
  onDataFetched
}: {
  categories: { id: number; categoryName: string }[];
  bahagianList: string[];
  onDataFetched: (data: any[], isLoading: boolean, categoryId?: number) => void;
}) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [timeframe, setTimeframe] = useState<"bulanan" | "tahunan">("bulanan");
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [categoryId, setCategoryId] = useState<number | "">(
    initialCategory ? Number(initialCategory) : ""
  );
  const [bahagian, setBahagian] = useState<string>("");

  // Year options for the past 5 years + next year
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    let active = true;
    
    async function loadData() {
      onDataFetched([], true);
      const data = await fetchReportData({
        timeframe,
        month: timeframe === "bulanan" ? month : undefined,
        year,
        categoryId: categoryId === "" ? undefined : Number(categoryId),
        bahagian: bahagian === "" ? undefined : bahagian
      });
      if (active) {
        onDataFetched(data, false, categoryId === "" ? undefined : Number(categoryId));
      }
    }
    
    loadData();
    return () => { active = false; };
  }, [timeframe, month, year, categoryId, bahagian]);

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 no-print mb-6 flex flex-col md:flex-row gap-6 items-start">
      
      {/* Filters Column (Bahagian & Category) */}
      <div className="flex-[2] w-full flex flex-col gap-4">
        {/* Bahagian Filter */}
        <div className="w-full">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Bahagian</label>
          <select
            value={bahagian}
            onChange={(e) => setBahagian(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Semua Bahagian</option>
            {bahagianList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-full">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
            ))}
          </select>
        </div>
      </div>
      {/* iOS Segmented Control & Dates */}
      <div className="flex-1 w-full flex flex-col gap-2">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Tempoh (Timeframe)</label>
        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl">
          <button
            onClick={() => setTimeframe("bulanan")}
            className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${timeframe === "bulanan" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Bulanan
          </button>
          <button
            onClick={() => setTimeframe("tahunan")}
            className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${timeframe === "tahunan" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Tahunan
          </button>
        </div>
        
        <div className="flex gap-2 mt-1">
          {timeframe === "bulanan" && (
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const d = new Date(2000, i, 1);
                return <option key={i} value={i}>{d.toLocaleString('default', { month: 'long' })}</option>
              })}
            </select>
          )}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
