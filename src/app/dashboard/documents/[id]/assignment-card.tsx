"use client";

import { useTransition, useState } from "react";
import { assignDocument } from "./actions";
import { UserCheck } from "lucide-react";

export function AssignmentCard({
  documentId,
  userRole,
  status,
  staffList
}: {
  documentId: string;
  userRole: string;
  status: string;
  staffList: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedStaff, setSelectedStaff] = useState("");

  const handleAssign = () => {
    if (!selectedStaff) return;
    startTransition(async () => {
      await assignDocument(documentId, selectedStaff);
    });
  };

  const isReady = status === "ready_for_assignment";
  const canAssign = userRole === "admin" || userRole === "ppkp" || userRole === "pptk";

  if (!canAssign || !isReady) return null;

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-6 mb-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Umpukan Kakitangan (Assignment)</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Dokumen ini telah disahkan dan sedia untuk diumpukkan kepada kakitangan untuk tindakan lanjut (kemas kini pesanan kerajaan & bil).
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300/50 bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="" disabled>Pilih Kakitangan...</option>
          {staffList.map(staff => (
            <option key={staff.id} value={staff.id}>{staff.name}</option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={isPending || !selectedStaff}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-md"
        >
          <UserCheck className="h-5 w-5" />
          {isPending ? "Assigning..." : "Assign Document"}
        </button>
      </div>
    </div>
  );
}
