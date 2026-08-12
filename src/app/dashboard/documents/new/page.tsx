import { db } from "@/lib/db";
import { DocumentForm } from "./document-form";

export const dynamic = "force-dynamic";

export default async function NewDocumentPage() {
  const categories = await db.category.findMany({
    orderBy: { categoryName: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm mb-2">
          Log Masuk Dokumen Baru
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Daftarkan dokumen perolehan baru ke dalam sistem untuk pengesanan dan carian.
        </p>
      </div>

      <DocumentForm categories={categories} />
    </div>
  );
}
