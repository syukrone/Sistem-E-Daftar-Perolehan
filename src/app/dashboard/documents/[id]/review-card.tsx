"use client";

import { useTransition, useState } from "react";
import { signOffReview } from "./actions";
import { CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

export function ReviewCard({
  documentId,
  userRole,
  isPpkpChecked,
  isPptkChecked,
  ppkpDate,
  pptkDate,
  catatanPpkp,
  catatanPptk
}: {
  documentId: string;
  userRole: string;
  isPpkpChecked: boolean;
  isPptkChecked: boolean;
  ppkpDate: Date | null;
  pptkDate: Date | null;
  catatanPpkp?: string | null;
  catatanPptk?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [notePpkp, setNotePpkp] = useState("");
  const [notePptk, setNotePptk] = useState("");

  const handleSignOff = (roleType: "ppkp" | "pptk") => {
    startTransition(async () => {
      const note = roleType === "ppkp" ? notePpkp : notePptk;
      const result = await signOffReview(documentId, roleType, note);
      if (result?.error) {
        alert("Error: " + result.error);
      }
    });
  };

  const canSignPpkp = !isPpkpChecked && (userRole === "ppkp" || userRole === "pptk" || userRole === "admin");
  const canSignPptk = !isPptkChecked && (userRole === "pptk" || userRole === "ppkp" || userRole === "admin");

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 mb-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Pengesahan (Review)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PPKP Review */}
        <div className={`p-4 rounded-xl border ${isPpkpChecked ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30' : 'bg-slate-50 border-slate-200/50 dark:bg-slate-900/40 dark:border-slate-700/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">PPKP Review</p>
              {isPpkpChecked && ppkpDate ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Signed on {format(new Date(ppkpDate), "dd MMM yyyy HH:mm")}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Pending review</p>
              )}
              {isPpkpChecked && catatanPpkp && (
                <div className="mt-3 p-3 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-emerald-100 dark:border-emerald-800/30 text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-xs text-slate-500 block mb-1">Catatan:</span>
                  {catatanPpkp}
                </div>
              )}
            </div>
            {isPpkpChecked ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            ) : canSignPpkp ? (
              <div className="flex flex-col items-end gap-2 w-full max-w-xs ml-4">
                <textarea
                  value={notePpkp}
                  onChange={(e) => setNotePpkp(e.target.value)}
                  placeholder="Tambah catatan (opsional)..."
                  className="w-full text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                  rows={2}
                />
                <button
                  onClick={() => handleSignOff("ppkp")}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  {userRole === "ppkp" ? "Sign Off" : "Sign Off (On Behalf)"}
                </button>
              </div>
            ) : (
              <Circle className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            )}
          </div>
        </div>

        {/* PPTK Review */}
        <div className={`p-4 rounded-xl border ${isPptkChecked ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30' : 'bg-slate-50 border-slate-200/50 dark:bg-slate-900/40 dark:border-slate-700/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">PPTK Review</p>
              {isPptkChecked && pptkDate ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Signed on {format(new Date(pptkDate), "dd MMM yyyy HH:mm")}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Pending review</p>
              )}
              {isPptkChecked && catatanPptk && (
                <div className="mt-3 p-3 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-emerald-100 dark:border-emerald-800/30 text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-xs text-slate-500 block mb-1">Catatan:</span>
                  {catatanPptk}
                </div>
              )}
            </div>
            {isPptkChecked ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            ) : canSignPptk ? (
              <div className="flex flex-col items-end gap-2 w-full max-w-xs ml-4">
                <textarea
                  value={notePptk}
                  onChange={(e) => setNotePptk(e.target.value)}
                  placeholder="Tambah catatan (opsional)..."
                  className="w-full text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                  rows={2}
                />
                <button
                  onClick={() => handleSignOff("pptk")}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  {userRole === "pptk" ? "Sign Off" : "Sign Off (On Behalf)"}
                </button>
              </div>
            ) : (
              <Circle className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
