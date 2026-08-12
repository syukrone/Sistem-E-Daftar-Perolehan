import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ReviewCard } from "./review-card";
import { AssignmentCard } from "./assignment-card";
import { UpdateForm } from "./update-form";
import { FileText, Calendar, Building, Info, UserCheck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  const document = await db.document.findUnique({
    where: { id: BigInt(id) },
    include: {
      category: true,
      createdByUser: true,
      assignedToUser: true,
      procurementUpdates: {
        include: { updatedByUser: true }
      }
    }
  });

  if (!document) {
    notFound();
  }

  // Fetch staff for assignment dropdown if user is PPKP, PPTK or Admin
  let staffList: { id: string; name: string }[] = [];
  if (session.user.role === "admin" || session.user.role === "ppkp" || session.user.role === "pptk") {
    const staff = await db.user.findMany({
      where: { role: "staff" },
      select: { id: true, name: true }
    });
    staffList = staff.map(s => ({ id: s.id.toString(), name: s.name }));
  }

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    pending_review: { label: "Pending Review", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
    ready_for_assignment: { label: "Ready for Assignment", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
    in_progress: { label: "In Progress (Staff)", color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
    closed: { label: "Closed", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  };

  const statusInfo = statusMap[document.status] || { label: document.status, color: "text-slate-600", bg: "bg-slate-100" };

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      
      {/* Header Info Card */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${statusInfo.bg} ${statusInfo.color} ring-1 ring-inset ring-black/5 shadow-sm`}>
             {statusInfo.label}
           </span>
        </div>
        
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 pr-32">
              {document.tajuk}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Ref:</span> {document.noRujukanFail}
            </p>
            {document.rujukanPekeliling && (
              <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">Pekeliling:</span> {document.rujukanPekeliling}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Bahagian Memohon</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{document.bahagianMemohon}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tarikh Terima</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{format(new Date(document.tarikhTerima), "dd MMM yyyy")}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kategori</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{document.category.categoryName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Log Oleh</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{document.createdByUser.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Card: For PPKP & PPTK */}
      <ReviewCard 
        documentId={id} 
        userRole={session.user.role}
        isPpkpChecked={document.reviewPpkp}
        isPptkChecked={document.reviewPptk}
        ppkpDate={document.reviewPpkpAt}
        pptkDate={document.reviewPptkAt}
        catatanPpkp={document.catatanPpkp}
        catatanPptk={document.catatanPptk}
      />

      {/* Assignment Card: Appears when reviews are done and user is Admin/PPKP */}
      <AssignmentCard 
        documentId={id}
        userRole={session.user.role}
        status={document.status}
        staffList={staffList}
      />

      {/* Staff Update Form: Appears when assigned to a Staff */}
      <UpdateForm 
        documentId={id}
        userRole={session.user.role}
        status={document.status}
        assignedUserId={document.assignedToUserId?.toString() || null}
        currentUserId={session.user.id}
        categoryName={document.category.categoryName}
      />
      
      {/* Completed Updates Log */}
      {document.procurementUpdates.length > 0 && (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-emerald-200 dark:border-emerald-900/50 shadow-xl rounded-3xl p-6 mb-6">
          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            Maklumat Perolehan (Telah Selesai)
          </h3>
          <div className="space-y-4">
            {document.procurementUpdates.map(update => {
              const meta = (update.metadata && typeof update.metadata === 'object') ? update.metadata as Record<string, any> : {};
              
              return (
                <div key={update.id.toString()} className="bg-emerald-50/60 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">No. PK / WPUA</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{update.noPesananKerajaan || '-'}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pembekal / Syarikat</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{update.namaPembekal || '-'}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Amaun (RM)</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {update.amaun ? Number(update.amaun).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">No. Invois</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {update.noInvois || '-'}
                        {meta.tarikhInvois && (
                          <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
                            Tarikh: {format(new Date(meta.tarikhInvois), "dd.MM.yyyy")}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Additional Metadata Details */}
                  {(meta.jenisLatihan || meta.passengerName || meta.hotelName || meta.contractPeriod || meta.paxCount || update.tarikhHantarAkaun) && (
                    <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      {meta.jenisLatihan && (
                        <div>
                          <span className="text-slate-500 block text-xs">Jenis Latihan/Waran:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{meta.jenisLatihan}</span>
                        </div>
                      )}
                      {meta.passengerName && (
                        <div>
                          <span className="text-slate-500 block text-xs">Penumpang:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{meta.passengerName}</span>
                          <span className="text-xs text-slate-500 block">{meta.flightRoute || "-"} ({meta.flightClass || "Ekonomi"})</span>
                        </div>
                      )}
                      {meta.flightDate && (
                        <div>
                          <span className="text-slate-500 block text-xs">Tarikh Penerbangan:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{format(new Date(meta.flightDate), "dd/MM/yyyy")}</span>
                        </div>
                      )}
                      {meta.hotelName && (
                        <div>
                          <span className="text-slate-500 block text-xs">Hotel & Bilik:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{meta.hotelName} ({meta.guestRoom || "-"})</span>
                        </div>
                      )}
                      {meta.stayDates && (
                        <div>
                          <span className="text-slate-500 block text-xs">Tarikh Penginapan:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{meta.stayDates}</span>
                        </div>
                      )}
                      {meta.contractPeriod && (
                        <div>
                          <span className="text-slate-500 block text-xs">Tempoh Kontrak:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{meta.contractPeriod}</span>
                        </div>
                      )}
                      {meta.paxCount && (
                        <div>
                          <span className="text-slate-500 block text-xs">Katering:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{meta.paxCount} Pax {meta.mealTypes ? `(${meta.mealTypes})` : ''}</span>
                        </div>
                      )}
                      {update.tarikhHantarAkaun && (
                        <div>
                          <span className="text-slate-500 block text-xs">Tarikh Hantar Ke Akaun:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{format(new Date(update.tarikhHantarAkaun), "dd.MM.yyyy")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {update.catatan && (
                    <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Catatan / Rujukan</span>
                      <p className="text-slate-800 dark:text-slate-200 text-sm mt-0.5 font-medium">{update.catatan}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
