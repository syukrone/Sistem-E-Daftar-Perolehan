"use client";

import { useState } from "react";
import { Search, FileText, Download, Eye, Settings } from "lucide-react";
import Link from "next/link";
import { ArkibDocument } from "@/generated/prisma/client";

export function ArkibClientPage({ 
  initialDocuments,
  isAdmin
}: { 
  initialDocuments: ArkibDocument[],
  isAdmin: boolean
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPekeliling = initialDocuments.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm mb-2">
            Arkib Pekeliling
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Pusat rujukan untuk semua dokumen dan pekeliling rasmi (Circulars). Anda boleh melihat atau memuat turun dokumen-dokumen ini untuk rujukan perolehan.
          </p>
        </div>
        
        {isAdmin && (
          <Link
            href="/dashboard/arkib/manage"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/40 focus:ring-2 focus:ring-emerald-500/50"
          >
            <Settings className="w-5 h-5" />
            Urus Arkib
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari pekeliling mengikut tajuk atau nombor rujukan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPekeliling.length > 0 ? (
          filteredPekeliling.map((doc) => (
            <div 
              key={doc.id}
              className="group bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-2xl group-hover:bg-red-400/20 transition-all duration-500 pointer-events-none" />
              
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl shrink-0 border border-red-100 dark:border-red-800/30">
                  <FileText className="w-8 h-8 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 mb-2">
                    {doc.reference}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2" title={doc.title}>
                    {doc.title}
                  </h3>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Keluaran: {new Date(doc.publishDate).toLocaleDateString('ms-MY')}
                </span>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Papar Dokumen"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                  <a 
                    href={doc.fileUrl}
                    download
                    className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                    title="Muat Turun Dokumen"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700/50 rounded-3xl">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">Tiada Rekod Ditemui</h3>
            <p className="text-slate-500 dark:text-slate-400">Sila minta pentadbir untuk memuat naik pekeliling ke dalam arkib.</p>
          </div>
        )}
      </div>

    </div>
  );
}
