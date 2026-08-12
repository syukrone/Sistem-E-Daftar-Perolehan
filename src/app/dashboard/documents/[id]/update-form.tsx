"use client";

import { useActionState, useState } from "react";
import { submitProcurementUpdate } from "./actions";
import { Save, Plane, Hotel, Layers, FileText, Calendar, Building2, CreditCard } from "lucide-react";

export function UpdateForm({
  documentId,
  userRole,
  status,
  assignedUserId,
  currentUserId,
  categoryName
}: {
  documentId: string;
  userRole: string;
  status: string;
  assignedUserId: string | null;
  currentUserId: string;
  categoryName: string;
}) {
  const [result, formAction, isPending] = useActionState(submitProcurementUpdate, undefined);
  const [transportSubtype, setTransportSubtype] = useState<"wpua" | "hotel" | "both">("wpua");

  const isAssignedToMe = assignedUserId === currentUserId;
  const isReady = status === "in_progress";

  if (!isReady || !isAssignedToMe || userRole !== "staff") return null;

  const isTransportCategory = categoryName === "Pengangkutan & Penginapan";
  const isTrainingCategory = categoryName === "Pakej, Latihan & Waran";

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Kemaskini Maklumat Perolehan
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kategori: <span className="font-semibold text-slate-700 dark:text-slate-200">{categoryName}</span>
          </p>
        </div>

        {/* Sub-type switcher for Pengangkutan & Penginapan */}
        {isTransportCategory && (
          <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-900/60 rounded-2xl border border-slate-300/40 dark:border-slate-700/40">
            <button
              type="button"
              onClick={() => setTransportSubtype("wpua")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                transportSubtype === "wpua"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              Penerbangan (WPUA)
            </button>
            <button
              type="button"
              onClick={() => setTransportSubtype("hotel")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                transportSubtype === "hotel"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Hotel className="w-3.5 h-3.5" />
              Penginapan (Hotel)
            </button>
            <button
              type="button"
              onClick={() => setTransportSubtype("both")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                transportSubtype === "both"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Kedua-duanya
            </button>
          </div>
        )}
      </div>
      
      {result?.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-100/80 border border-red-200 text-red-600 font-medium text-sm">
          {result.error}
        </div>
      )}

      {result?.success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-700 font-medium text-sm">
          {result.message}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="documentId" value={documentId} />
        {isTransportCategory && <input type="hidden" name="meta_transportSubtype" value={transportSubtype} />}
        
        {/* Core Financial & Accounting Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              {isTrainingCategory ? "No. PK / WPUA" : isTransportCategory ? "No. PK / No. WPUA" : "No. Pesanan Kerajaan (LPO)"}
            </label>
            <input 
              type="text" 
              name="noPesananKerajaan" 
              placeholder={isTrainingCategory ? "Cth: AC 314801" : "Cth: AC 123456"}
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              {isTrainingCategory ? "Nama Syarikat / Pembekal" : "Nama Syarikat / Pembekal / Agensi"}
            </label>
            <input 
              type="text" 
              name="namaPembekal" 
              placeholder={isTrainingCategory ? "Cth: Hyatt Regency Kinabalu" : "Cth: Syarikat ABC Sdn Bhd"}
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Amaun (RM)</label>
            <input 
              type="number" 
              step="0.01" 
              name="amaun" 
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">No. Invois</label>
            <input 
              type="text" 
              name="noInvois" 
              placeholder="Cth: 206617 / INV26-067"
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>

          {/* Tarikh Invois (Important for Pakej, Latihan & Waran) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Tarikh Invois</label>
            <input 
              type="date" 
              name="meta_tarikhInvois" 
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Tarikh Penghantaran Ke Unit Akaun</label>
            <input 
              type="date" 
              name="tarikhHantarAkaun" 
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>
        </div>

        {/* Dynamic Category Specific: Pakej, Latihan & Waran (Attachment Format) */}
        {isTrainingCategory && (
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-base">
              <Building2 className="w-5 h-5" />
              Butiran Pakej, Latihan & Konsultan
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Jenis Perolehan Latihan</label>
                <select 
                  name="meta_jenisLatihan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/50 text-sm"
                >
                  <option value="Pakej Seminar / Bengkel / Kursus">Pakej Seminar / Bengkel / Kursus</option>
                  <option value="Yuran Penyertaan Program Latihan (LDP)">Yuran Penyertaan Program Latihan (LDP)</option>
                  <option value="Perkhidmatan Konsultan / Penceramah">Perkhidmatan Konsultan / Penceramah</option>
                  <option value="Pembelian Kelengkapan / Pokok Hiasan / Bahan">Pembelian Kelengkapan / Pokok Hiasan / Bahan</option>
                  <option value="Waran Peruntukan Kecil">Waran Peruntukan Kecil</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tarikh Program / Latihan</label>
                <input 
                  type="text" 
                  name="meta_trainingDates" 
                  placeholder="Cth: 22-23 Januari 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/50 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tempat Program / Lokasi</label>
                <input 
                  type="text" 
                  name="meta_trainingLocation" 
                  placeholder="Cth: Hyatt Regency Kinabalu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/50 text-sm" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Category Specific: Pengangkutan & Penginapan */}
        {isTransportCategory && (
          <div className="space-y-4">
            {/* WPUA Flight Section */}
            {(transportSubtype === "wpua" || transportSubtype === "both") && (
              <div className="bg-sky-50/50 dark:bg-sky-900/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-800/30 space-y-4">
                <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-base">
                  <Plane className="w-5 h-5" />
                  Maklumat Penerbangan (WPUA)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Penumpang</label>
                    <input 
                      type="text" 
                      name="meta_passengerName" 
                      placeholder="Cth: En. Mohd Ali" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/50 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Laluan Penerbangan</label>
                    <input 
                      type="text" 
                      name="meta_flightRoute" 
                      placeholder="Cth: BKI - KUL - BKI" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/50 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kelas Penerbangan</label>
                    <select 
                      name="meta_flightClass"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/50 text-sm"
                    >
                      <option value="Ekonomi">Ekonomi</option>
                      <option value="Perniagaan">Perniagaan (Business)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tarikh Penerbangan</label>
                    <input 
                      type="date" 
                      name="meta_flightDate" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/50 text-sm" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hotel Accommodation Section */}
            {(transportSubtype === "hotel" || transportSubtype === "both") && (
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 space-y-4">
                <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-base">
                  <Hotel className="w-5 h-5" />
                  Maklumat Penginapan (Hotel)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Hotel</label>
                    <input 
                      type="text" 
                      name="meta_hotelName" 
                      placeholder="Cth: Promenade Hotel" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/50 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Tetamu & Jenis Bilik</label>
                    <input 
                      type="text" 
                      name="meta_guestRoom" 
                      placeholder="Cth: En. Ahmad (Deluxe King)" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/50 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tarikh Penginapan (Check-in / Check-out)</label>
                    <input 
                      type="text" 
                      name="meta_stayDates" 
                      placeholder="Cth: 01-06/02/2026" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/50 text-sm" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Category Specific: Katering & Sajian */}
        {categoryName === "Katering & Sajian" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-800/30">
            <div className="col-span-full">
              <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">Maklumat Katering</h4>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Jumlah Pax</label>
              <input type="number" name="meta_paxCount" className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Jenis Hidangan</label>
              <input type="text" name="meta_mealTypes" placeholder="Cth: Breakfast, Lunch, Hi-Tea" className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500/50" />
            </div>
          </div>
        )}

        {/* Dynamic Category Specific: Sebut Harga & Tender Jabatan */}
        {categoryName === "Sebut Harga & Tender Jabatan" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/30">
            <div className="col-span-full">
              <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Maklumat Tender / Sebut Harga</h4>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Tempoh Kontrak</label>
              <input type="text" name="meta_contractPeriod" placeholder="Cth: 20 Minggu / 3 Tahun" className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Status Barangan</label>
              <select name="meta_itemStatus" className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50">
                <option value="">Sila Pilih</option>
                <option value="Tempatan">Buatan Tempatan</option>
                <option value="Import">Barangan Import</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Catatan / Kod AP & Bahagian */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
            Catatan {isTrainingCategory && "(cth: AP103 (BPO) / Kod AP & Bahagian)"}
          </label>
          <textarea 
            name="catatan" 
            rows={2} 
            placeholder={isTrainingCategory ? "Cth: AP103 (BPO)" : "Catatan tambahan jika ada..."}
            className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="mr-2 h-5 w-5" />
            {isPending ? "Menyimpan..." : "Simpan & Tutup Fail"}
          </button>
        </div>
      </form>
    </div>
  );
}

