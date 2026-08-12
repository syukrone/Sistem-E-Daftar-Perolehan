"use client";

import { format } from "date-fns";
import { Download, Printer } from "lucide-react";

export type ReportRow = {
  bil: number;
  namaSyarikat: string;
  perkaraTajuk: string;
  amaun: number;
  noPesananKerajaan: string;
  noInvois: string;
  tarikhHantarAkaun: string | null;
  catatan: string;
  metadata?: Record<string, any> | null;
};

export function ReportTable({ data, isLoading, categoryName }: { data: ReportRow[], isLoading: boolean, categoryName?: string }) {
  
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers = ["Bil.", "Nama Syarikat / Agensi", "Perkara / Tajuk", "Amaun (RM)", "No. Pesanan Kerajaan (PK)", "No. Invois", "Tarikh Penghantaran", "Catatan"];
    
    if (categoryName === "Pakej, Latihan & Waran") {
      headers = [
        "Bil.", 
        "Nama Syarikat", 
        "Perkara / Tajuk", 
        "Amaun (RM)", 
        "No. PK / WPUA", 
        "No. Invois & Tarikh", 
        "Tarikh Penghantaran Ke Unit Akaun", 
        "Catatan"
      ];
    } else if (categoryName === "Pengangkutan & Penginapan") {
      headers = [
        "Bil.", 
        "Nama Syarikat / Pembekal", 
        "Perkara / Tajuk", 
        "No. PK / WPUA", 
        "Butiran (Penerbangan / Penginapan)", 
        "Tarikh", 
        "Amaun (RM)", 
        "No. Invois", 
        "Tarikh Penghantaran Ke Unit Akaun", 
        "Catatan"
      ];
    } else if (categoryName === "Sebut Harga & Tender Jabatan") {
      headers = ["Bil.", "Nama Syarikat / Agensi", "No. Tender/Sebut Harga", "Tajuk Perolehan", "Tempoh Kontrak", "Status Barangan", "Amaun (RM)", "Catatan"];
    } else if (categoryName === "Katering & Sajian") {
      headers = ["Bil.", "Nama Syarikat / Agensi", "Perkara / Tajuk", "No. PK", "Butiran Katering", "Amaun (RM)", "No. Invois", "Tarikh Penghantaran", "Catatan"];
    }

    const csvRows = [
      headers.join(","),
      ...data.map(row => {
        if (categoryName === "Pakej, Latihan & Waran") {
          const invoisDateStr = row.metadata?.tarikhInvois 
            ? ` ${format(new Date(row.metadata.tarikhInvois), "dd.MM.yyyy")}` 
            : "";
          const invoisAndDate = row.noInvois ? `${row.noInvois}${invoisDateStr}` : "-";
          const tarikhHantar = row.tarikhHantarAkaun 
            ? format(new Date(row.tarikhHantarAkaun), "dd.MM.yyyy") 
            : "-";

          return [
            row.bil,
            `"${(row.namaSyarikat || "-").replace(/"/g, '""')}"`,
            `"${(row.perkaraTajuk || "-").replace(/"/g, '""')}"`,
            row.amaun.toFixed(2),
            `"${(row.noPesananKerajaan || "-").replace(/"/g, '""')}"`,
            `"${invoisAndDate.replace(/"/g, '""')}"`,
            `"${tarikhHantar}"`,
            `"${(row.catatan || "-").replace(/"/g, '""')}"`
          ].join(",");
        }

        if (categoryName === "Pengangkutan & Penginapan") {
          let butiran = "-";
          let tarikh = "-";

          if (row.metadata?.passengerName || row.metadata?.flightRoute) {
            butiran = `Penumpang: ${row.metadata.passengerName || "-"} | Laluan: ${row.metadata.flightRoute || "-"}`;
            if (row.metadata?.flightClass) butiran += ` (${row.metadata.flightClass})`;
            if (row.metadata?.flightDate) tarikh = format(new Date(row.metadata.flightDate), "dd/MM/yyyy");
          } else if (row.metadata?.hotelName || row.metadata?.guestRoom) {
            butiran = `Hotel: ${row.metadata.hotelName || "-"} | Bilik: ${row.metadata.guestRoom || "-"}`;
            if (row.metadata?.stayDates) tarikh = row.metadata.stayDates;
          }

          const tarikhHantar = row.tarikhHantarAkaun 
            ? format(new Date(row.tarikhHantarAkaun), "dd/MM/yyyy") 
            : "-";

          return [
            row.bil,
            `"${(row.namaSyarikat || "-").replace(/"/g, '""')}"`,
            `"${(row.perkaraTajuk || "-").replace(/"/g, '""')}"`,
            `"${(row.noPesananKerajaan || "-").replace(/"/g, '""')}"`,
            `"${butiran.replace(/"/g, '""')}"`,
            `"${tarikh.replace(/"/g, '""')}"`,
            row.amaun.toFixed(2),
            `"${(row.noInvois || "-").replace(/"/g, '""')}"`,
            `"${tarikhHantar}"`,
            `"${(row.catatan || "-").replace(/"/g, '""')}"`
          ].join(",");
        }

        if (categoryName === "Sebut Harga & Tender Jabatan") {
          return [
            row.bil,
            `"${(row.namaSyarikat || "-").replace(/"/g, '""')}"`,
            `"${(row.noPesananKerajaan || "-").replace(/"/g, '""')}"`,
            `"${(row.perkaraTajuk || "-").replace(/"/g, '""')}"`,
            `"${(row.metadata?.contractPeriod || "-").replace(/"/g, '""')}"`,
            `"${(row.metadata?.itemStatus || "-").replace(/"/g, '""')}"`,
            row.amaun.toFixed(2),
            `"${(row.catatan || "-").replace(/"/g, '""')}"`
          ].join(",");
        }

        if (categoryName === "Katering & Sajian") {
          const kateringDetail = `${row.metadata?.paxCount ? row.metadata.paxCount + ' pax ' : ''}${row.metadata?.mealTypes ? '(' + row.metadata.mealTypes + ')' : ''}`;
          const tarikhHantar = row.tarikhHantarAkaun ? format(new Date(row.tarikhHantarAkaun), "dd/MM/yyyy") : "-";

          return [
            row.bil,
            `"${(row.namaSyarikat || "-").replace(/"/g, '""')}"`,
            `"${(row.perkaraTajuk || "-").replace(/"/g, '""')}"`,
            `"${(row.noPesananKerajaan || "-").replace(/"/g, '""')}"`,
            `"${kateringDetail.replace(/"/g, '""')}"`,
            row.amaun.toFixed(2),
            `"${(row.noInvois || "-").replace(/"/g, '""')}"`,
            `"${tarikhHantar}"`,
            `"${(row.catatan || "-").replace(/"/g, '""')}"`
          ].join(",");
        }

        // Default standard
        const tarikhHantar = row.tarikhHantarAkaun ? format(new Date(row.tarikhHantarAkaun), "dd/MM/yyyy") : "-";
        return [
          row.bil,
          `"${(row.namaSyarikat || "-").replace(/"/g, '""')}"`,
          `"${(row.perkaraTajuk || "-").replace(/"/g, '""')}"`,
          row.amaun.toFixed(2),
          `"${(row.noPesananKerajaan || "-").replace(/"/g, '""')}"`,
          `"${(row.noInvois || "-").replace(/"/g, '""')}"`,
          `"${tarikhHantar}"`,
          `"${(row.catatan || "-").replace(/"/g, '""')}"`
        ].join(",");
      })
    ];
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_Perolehan_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl overflow-hidden p-6">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Daftar Rekod Perolehan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {categoryName || "Semua Kategori"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isLoading || data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/40 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            disabled={isLoading || data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 shadow-md"
          >
            <Printer className="h-4 w-4" /> Cetak / PDF
          </button>
        </div>
      </div>

      {/* Print Header (Only visible when printing) */}
      <div className="print-only mb-8 text-center border-b-2 border-black pb-4">
         <div className="flex items-center justify-center gap-4 mb-2">
            <img src="/jpan-logo-color.png" alt="JPAN Logo" className="h-16 object-contain" />
            <div>
              <h1 className="text-xl font-bold uppercase text-black">Jabatan Perkhidmatan Awam Negeri Sabah</h1>
              <h2 className="text-lg font-semibold uppercase text-black">
                {categoryName === "Pakej, Latihan & Waran" 
                  ? "Rekod Pembayaran (Kategori: Pakej, Latihan, Konsultan & Waran)" 
                  : `Laporan Daftar Perolehan - ${categoryName || "Semua Kategori"}`}
              </h2>
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="print-table min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase w-12">Bil.</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[140px]">
                {categoryName === "Pakej, Latihan & Waran" ? "Nama Syarikat" : "Nama Syarikat / Agensi"}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[200px]">
                Perkara / Tajuk
              </th>

              {categoryName === "Pakej, Latihan & Waran" ? (
                <>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[110px]">Amaun (RM)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[120px]">No. PK / WPUA</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[140px]">No. Invois & Tarikh</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[130px]">Tarikh Penghantaran Ke Unit Akaun</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[100px]">Catatan</th>
                </>
              ) : categoryName === "Pengangkutan & Penginapan" ? (
                <>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[120px]">No. PK / WPUA</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[180px]">Butiran (Penerbangan / Penginapan)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[120px]">Tarikh</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[110px]">Amaun (RM)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[110px]">No. Invois</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[120px]">Tarikh Hantar Akaun</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[100px]">Catatan</th>
                </>
              ) : categoryName === "Sebut Harga & Tender Jabatan" ? (
                <>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">No. Tender/Sebut Harga</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tempoh Kontrak</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status Barangan</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[110px]">Amaun (RM)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Catatan</th>
                </>
              ) : categoryName === "Katering & Sajian" ? (
                <>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">No. PK</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Butiran Katering</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[110px]">Amaun (RM)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">No. Invois</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tarikh Hantar</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Catatan</th>
                </>
              ) : (
                <>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">No. Pesanan Kerajaan</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase min-w-[110px]">Amaun (RM)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">No. Invois</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tarikh Hantar</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Catatan</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50 text-sm">
            {isLoading ? (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">Memuatkan data...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">Tiada rekod ditemui untuk tapisan ini.</td></tr>
            ) : (
              data.map((row) => {
                if (categoryName === "Pakej, Latihan & Waran") {
                  return (
                    <tr key={row.bil} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.bil}.</td>
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{row.namaSyarikat}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 leading-snug">{row.perkaraTajuk}</td>
                      <td className="px-4 py-3 font-bold text-right text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {row.amaun.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.noPesananKerajaan || "-"}</td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {row.noInvois ? (
                          <div>
                            <div className="font-semibold">{row.noInvois}</div>
                            {row.metadata?.tarikhInvois && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {format(new Date(row.metadata.tarikhInvois), "dd.MM.yyyy")}
                              </div>
                            )}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {row.tarikhHantarAkaun ? format(new Date(row.tarikhHantarAkaun), "dd.MM.yyyy") : "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.catatan || "-"}</td>
                    </tr>
                  );
                }

                if (categoryName === "Pengangkutan & Penginapan") {
                  const isFlight = row.metadata?.passengerName || row.metadata?.flightRoute;
                  const isHotel = row.metadata?.hotelName || row.metadata?.guestRoom;

                  return (
                    <tr key={row.bil} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.bil}.</td>
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{row.namaSyarikat}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 leading-snug">{row.perkaraTajuk}</td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.noPesananKerajaan || "-"}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {isFlight && (
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{row.metadata?.passengerName || "-"}</span>
                            <div className="text-xs text-slate-500">{row.metadata?.flightRoute || "-"} ({row.metadata?.flightClass || "Ekonomi"})</div>
                          </div>
                        )}
                        {isHotel && (
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{row.metadata?.hotelName || "-"}</span>
                            <div className="text-xs text-slate-500">{row.metadata?.guestRoom || "-"}</div>
                          </div>
                        )}
                        {!isFlight && !isHotel && "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {row.metadata?.flightDate 
                          ? format(new Date(row.metadata.flightDate), "dd/MM/yyyy") 
                          : row.metadata?.stayDates || "-"}
                      </td>
                      <td className="px-4 py-3 font-bold text-right text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {row.amaun.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.noInvois || "-"}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {row.tarikhHantarAkaun ? format(new Date(row.tarikhHantarAkaun), "dd/MM/yyyy") : "-"}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{row.catatan || "-"}</td>
                    </tr>
                  );
                }

                if (categoryName === "Sebut Harga & Tender Jabatan") {
                  return (
                    <tr key={row.bil} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.bil}.</td>
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{row.namaSyarikat}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.perkaraTajuk}</td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{row.noPesananKerajaan || "-"}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.metadata?.contractPeriod || "-"}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.metadata?.itemStatus || "-"}</td>
                      <td className="px-4 py-3 font-bold text-right text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {row.amaun.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.catatan || "-"}</td>
                    </tr>
                  );
                }

                if (categoryName === "Katering & Sajian") {
                  return (
                    <tr key={row.bil} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.bil}.</td>
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{row.namaSyarikat}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.perkaraTajuk}</td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{row.noPesananKerajaan || "-"}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {row.metadata?.paxCount ? `${row.metadata.paxCount} pax ` : ""}
                        {row.metadata?.mealTypes ? `(${row.metadata.mealTypes})` : ""}
                      </td>
                      <td className="px-4 py-3 font-bold text-right text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {row.amaun.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{row.noInvois || "-"}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {row.tarikhHantarAkaun ? format(new Date(row.tarikhHantarAkaun), "dd/MM/yyyy") : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.catatan || "-"}</td>
                    </tr>
                  );
                }

                // Default standard table
                return (
                  <tr key={row.bil} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.bil}.</td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{row.namaSyarikat}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.perkaraTajuk}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{row.noPesananKerajaan || "-"}</td>
                    <td className="px-4 py-3 font-bold text-right text-slate-800 dark:text-slate-100 whitespace-nowrap">
                      {row.amaun.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{row.noInvois || "-"}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {row.tarikhHantarAkaun ? format(new Date(row.tarikhHantarAkaun), "dd/MM/yyyy") : "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.catatan || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

