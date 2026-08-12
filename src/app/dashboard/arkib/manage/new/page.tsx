import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { uploadArkibDocument } from "./actions";
import { FileText, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "./submit-button"; // We will create this client component next

export default async function NewArkibDocumentPage() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard/arkib");
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/dashboard/arkib/manage" 
          className="p-2 bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm mb-1">
            Muat Naik Pekeliling
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Tambah pekeliling baru ke dalam pangkalan data arkib.
          </p>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 md:p-8">
        <form action={uploadArkibDocument} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Tajuk Pekeliling *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. Garis Panduan Perolehan"
                className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reference" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  No. Rujukan *
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  required
                  placeholder="e.g. PP 1/2026"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label htmlFor="publishDate" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Tarikh Keluaran *
                </label>
                <input
                  type="date"
                  id="publishDate"
                  name="publishDate"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Fail PDF *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300/50 dark:border-slate-700/50 border-dashed rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 dark:text-slate-400">
                    <label
                      htmlFor="file"
                      className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Muat naik fail</span>
                      <input id="file" name="file" type="file" accept="application/pdf" className="sr-only" required />
                    </label>
                    <p className="pl-1">atau seret dan lepas</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    PDF sehingga 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
