import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function ManageArkibPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard/arkib");
  }

  const documents = await db.arkibDocument.findMany({
    orderBy: { publishDate: "desc" },
  });

  // Inline server action to delete a document
  async function deleteDocument(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string, 10);
    await db.arkibDocument.delete({ where: { id } });
    revalidatePath("/dashboard/arkib");
    revalidatePath("/dashboard/arkib/manage");
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/arkib" 
            className="p-2 bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm mb-1">
              Urus Arkib
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Urus senarai pekeliling yang dipaparkan dalam Arkib.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/arkib/manage/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Pekeliling
        </Link>
      </div>

      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
              <tr>
                <th className="px-6 py-4 font-semibold">No. Rujukan</th>
                <th className="px-6 py-4 font-semibold">Tajuk</th>
                <th className="px-6 py-4 font-semibold">Tarikh Keluaran</th>
                <th className="px-6 py-4 font-semibold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Tiada dokumen dijumpai. Sila muat naik pekeliling baru.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {doc.reference}
                    </td>
                    <td className="px-6 py-4">
                      {doc.title}
                    </td>
                    <td className="px-6 py-4">
                      {doc.publishDate.toLocaleDateString('ms-MY')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={deleteDocument}>
                        <input type="hidden" name="id" value={doc.id} />
                        <button
                          type="submit"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                          title="Padam Dokumen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
