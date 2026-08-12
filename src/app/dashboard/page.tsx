import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FileText, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  // 1. Dynamic Stats Calculation
  const totalDocs = await db.document.count();
  const pendingDocs = await db.document.count({ where: { status: "pending_review" } });
  const inProgressDocs = await db.document.count({ where: { status: "in_progress" } });
  const closedDocs = await db.document.count({ where: { status: "closed" } });

  let actionRequiredCount = 0;
  if (user.role === "staff") {
    actionRequiredCount = await db.document.count({
      where: { status: "in_progress", assignedToUserId: BigInt(user.id) }
    });
  } else if (user.role === "ppkp") {
    actionRequiredCount = await db.document.count({
      where: { status: "pending_review", reviewPpkp: false }
    });
  } else if (user.role === "pptk") {
    actionRequiredCount = await db.document.count({
      where: { status: "pending_review", reviewPptk: false }
    });
  }

  const stats = [
    { name: "Total Documents", value: totalDocs.toString(), icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { name: "Pending Review", value: pendingDocs.toString(), icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { name: "Approved", value: closedDocs.toString(), icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { name: "Action Required", value: actionRequiredCount.toString(), icon: AlertCircle, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/30" },
  ];

  const categories = await db.category.findMany({
    take: 5,
    orderBy: { categoryName: "asc" }
  });

  // 2. Action Required Feed
  let actionRequiredDocs = [];
  if (user.role === "staff") {
    actionRequiredDocs = await db.document.findMany({
      where: { status: "in_progress", assignedToUserId: BigInt(user.id) },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });
  } else if (user.role === "ppkp") {
    actionRequiredDocs = await db.document.findMany({
      where: { status: "pending_review", reviewPpkp: false },
      take: 5,
      orderBy: { createdAt: "asc" },
      include: { category: true }
    });
  } else if (user.role === "pptk") {
    actionRequiredDocs = await db.document.findMany({
      where: { status: "pending_review", reviewPptk: false },
      take: 5,
      orderBy: { createdAt: "asc" },
      include: { category: true }
    });
  } else {
    actionRequiredDocs = await db.document.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });
  }

  // 3. Status Distribution Calculation
  const total = totalDocs || 1;
  const pendingPct = Math.round((pendingDocs / total) * 100);
  const progressPct = Math.round((inProgressDocs / total) * 100);
  const closedPct = Math.round((closedDocs / total) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 drop-shadow-sm mb-2">
          Welcome back, {user.name || "User"}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here is your overview of the procurement document flow.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Reports Section */}
      <div className="rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Quick Reports
          </h2>
          <Link href="/dashboard/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View All Reports
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/dashboard/reports?category=${cat.id}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center line-clamp-2">
                {cat.categoryName}
              </span>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-4 text-center text-slate-500 dark:text-slate-400">
              No categories found.
            </div>
          )}
        </div>
      </div>

      {/* Distribution Progress Bar */}
      <div className="rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Document Workflow Health
        </h2>
        <div className="w-full h-6 flex rounded-full overflow-hidden mb-3">
          <div style={{ width: `${pendingPct}%` }} className="bg-amber-400 transition-all duration-1000" title="Pending" />
          <div style={{ width: `${progressPct}%` }} className="bg-purple-500 transition-all duration-1000" title="In Progress" />
          <div style={{ width: `${closedPct}%` }} className="bg-emerald-500 transition-all duration-1000" title="Closed" />
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400"><div className="w-3 h-3 rounded-full bg-amber-400" /> Pending ({pendingPct}%)</div>
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400"><div className="w-3 h-3 rounded-full bg-purple-500" /> In Progress ({progressPct}%)</div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Closed ({closedPct}%)</div>
        </div>
      </div>

      {/* Action Required Feed */}
      <div className="rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {user.role === "admin" ? "Recent Activity" : "Action Required"}
          </h2>
          <Link href="/dashboard/documents" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </Link>
        </div>

        {actionRequiredDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/50">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tajuk</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tarikh Terima</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {actionRequiredDocs.map(doc => (
                  <tr key={doc.id.toString()} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{doc.tajuk}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{doc.category.categoryName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{format(new Date(doc.tarikhTerima), "dd MMM yyyy")}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/documents/${doc.id.toString()}`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors"
                      >
                        Buka
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-300/50 dark:border-slate-600/50 rounded-xl">
            <CheckCircle className="h-12 w-12 mb-4 opacity-50 text-emerald-500" />
            <p>You're all caught up!</p>
            <p className="text-sm mt-1 opacity-70">No documents require your immediate attention.</p>
          </div>
        )}
      </div>
    </div>
  );
}
