import { db } from "@/lib/db";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const documentsRaw = await db.document.findMany({
    include: {
      category: {
        select: { categoryName: true },
      },
      createdByUser: {
        select: { name: true },
      },
    },
    orderBy: { tarikhTerima: "desc" },
  });

  // Convert BigInt IDs to string to avoid React serialization errors when passing to the Client Component
  const documents = documentsRaw.map((doc) => ({
    ...doc,
    id: doc.id.toString(),
  }));

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm mb-2">
          Senarai Dokumen
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Urus, jejak dan lihat status terkini bagi semua dokumen perolehan yang telah didaftarkan.
        </p>
      </div>

      <DataTable data={documents} />
    </div>
  );
}
