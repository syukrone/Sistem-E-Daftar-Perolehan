"use client";

import { useState } from "react";
import { Search, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type DocumentItem = {
  id: string;
  tajuk: string;
  noRujukanFail: string;
  rujukanPekeliling?: string | null;
  bahagianMemohon: string;
  tarikhTerima: Date;
  status: string;
  category: {
    categoryName: string;
  };
  createdByUser: {
    name: string;
  };
};

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending_review: { label: "Pending", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  approved: { label: "Approved", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  rejected: { label: "Rejected", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/30" },
};

export function DataTable({ data }: { data: DocumentItem[] }) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.tajuk.toLowerCase().includes(searchLower) ||
      item.noRujukanFail.toLowerCase().includes(searchLower) ||
      (item.rujukanPekeliling && item.rujukanPekeliling.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300/50 rounded-xl bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all sm:text-sm"
            placeholder="Search by Title or Ref No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Document Info
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category & Division
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date Received
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50 bg-transparent">
              {filteredData.length > 0 ? (
                filteredData.map((doc) => {
                  const statusInfo = statusMap[doc.status] || { label: doc.status, color: "text-slate-600", bg: "bg-slate-100" };
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                              <FileText className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="ml-4 max-w-sm">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2" title={doc.tajuk}>
                              {doc.tajuk}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Ref: {doc.noRujukanFail}
                            </div>
                            {doc.rujukanPekeliling && (
                              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                Pekeliling: {doc.rujukanPekeliling}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{doc.category.categoryName}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{doc.bahagianMemohon}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {format(new Date(doc.tarikhTerima), "dd MMM yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color} ring-1 ring-inset ring-black/5`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/documents/${doc.id}`}
                          className="inline-flex items-center justify-center h-9 w-9 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No documents found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
