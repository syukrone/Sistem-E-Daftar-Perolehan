import { db } from "@/lib/db";
import { ReportsDashboard } from "./reports-dashboard";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const categories = await db.category.findMany({
    orderBy: { categoryName: "asc" }
  });

  const bahagianList = [
    "Pejabat Direktorat",
    "Bahagian Perkhidmatan Awam",
    "Bahagian Pembangunan Organisasi",
    "Bahagian Governan Dan Korporat",
    "Bahagian Saraan Dan Pencen",
    "Bahagian Kerajaan Digital",
    "Bahagian Khidmat Pengurusan",
    "Bahagian Biasiswa Kerajaan Negeri",
    "Institut Latihan Sektor Awam Negeri (INSAN)",
    "Unit Integriti",
    "Lain-lain"
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8 no-print">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm mb-2">
          Modul Laporan
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Jana laporan perolehan mengikut kategori dan tempoh masa. Anda boleh muat turun dalam format CSV atau Cetak sebagai PDF.
        </p>
      </div>

      <ReportsDashboard categories={categories} bahagianList={bahagianList} />
    </div>
  );
}
