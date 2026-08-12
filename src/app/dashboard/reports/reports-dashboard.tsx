"use client";

import { useState, Suspense } from "react";
import { ReportFiltersBar } from "./report-filters";
import { ReportTable, ReportRow } from "./report-table";

export function ReportsDashboard({ 
  categories,
  bahagianList
}: { 
  categories: { id: number; categoryName: string }[];
  bahagianList: string[];
}) {
  const [data, setData] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("Semua Kategori");

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-24 bg-white/40 dark:bg-slate-800/40 animate-pulse rounded-3xl mb-6"></div>}>
        <ReportFiltersBar 
          categories={categories} 
          bahagianList={bahagianList}
          onDataFetched={(newData, loading, categoryId) => {
            setData(newData);
            setIsLoading(loading);
            if (categoryId) {
              const cat = categories.find(c => c.id === categoryId);
              setSelectedCategoryName(cat ? cat.categoryName : "Semua Kategori");
            } else {
              setSelectedCategoryName("Semua Kategori");
            }
          }} 
        />
      </Suspense>
      <ReportTable data={data} isLoading={isLoading} categoryName={selectedCategoryName} />
    </div>
  );
}
