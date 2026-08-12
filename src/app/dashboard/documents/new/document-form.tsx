"use client";

import { useActionState } from "react";
import { submitDocument } from "./actions";
import { Save } from "lucide-react";

export function DocumentForm({ categories }: { categories: { id: number; categoryName: string }[] }) {
  const [result, formAction, isPending] = useActionState(submitDocument, undefined);

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 md:p-10">
      {result?.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-100/80 border border-red-200 text-red-600 font-medium">
          {result.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarikh Terima */}
          <div>
            <label htmlFor="tarikhTerima" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              Tarikh Terima (Date Received) *
            </label>
            <input
              type="date"
              id="tarikhTerima"
              name="tarikhTerima"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Bahagian Memohon */}
          <div>
            <label htmlFor="bahagianMemohon" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              Bahagian/Jabatan Memohon *
            </label>
            <select
              id="bahagianMemohon"
              name="bahagianMemohon"
              required
              defaultValue=""
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            >
              <option value="" disabled>Select Bahagian/Jabatan</option>
              <option value="Pejabat Direktorat">Pejabat Direktorat</option>
              <option value="Bahagian Perkhidmatan Awam">Bahagian Perkhidmatan Awam</option>
              <option value="Bahagian Pembangunan Organisasi">Bahagian Pembangunan Organisasi</option>
              <option value="Bahagian Governan Dan Korporat">Bahagian Governan Dan Korporat</option>
              <option value="Bahagian Saraan Dan Pencen">Bahagian Saraan Dan Pencen</option>
              <option value="Bahagian Kerajaan Digital">Bahagian Kerajaan Digital</option>
              <option value="Bahagian Khidmat Pengurusan">Bahagian Khidmat Pengurusan</option>
              <option value="Bahagian Biasiswa Kerajaan Negeri">Bahagian Biasiswa Kerajaan Negeri</option>
              <option value="Institut Latihan Sektor Awam Negeri (INSAN)">Institut Latihan Sektor Awam Negeri (INSAN)</option>
              <option value="Unit Integriti">Unit Integriti</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          {/* No. Rujukan Fail */}
          <div>
            <label htmlFor="noRujukanFail" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              No. Rujukan Fail *
            </label>
            <input
              type="text"
              id="noRujukanFail"
              name="noRujukanFail"
              placeholder="e.g. JPAN.KEW.100-1/1/1"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Tarikh Rujukan Fail */}
          <div>
            <label htmlFor="tarikhRujukanFail" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
              Tarikh Rujukan Fail
            </label>
            <input
              type="date"
              id="tarikhRujukanFail"
              name="tarikhRujukanFail"
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          
        </div>

        {/* Tajuk Perolehan */}
        <div>
          <label htmlFor="tajuk" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
            Tajuk Perolehan *
          </label>
          <textarea
            id="tajuk"
            name="tajuk"
            rows={3}
            placeholder="Enter the title or subject of the document..."
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
          />
        </div>

        {/* Kategori Perolehan */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
            Kategori Perolehan (Category) *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Rujukan Pekeliling */}
        <div>
          <label htmlFor="rujukanPekeliling" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
            Rujukan Pekeliling (Circular Reference)
          </label>
          <input
            type="text"
            id="rujukanPekeliling"
            name="rujukanPekeliling"
            placeholder="e.g. PP 1/2026"
            className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Save className="mr-2 h-5 w-5" />
            {isPending ? "Saving Document..." : "Save Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
