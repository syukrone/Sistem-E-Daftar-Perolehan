import { Sidebar } from "@/components/layout/sidebar";
// Force recompile layout
import { Header } from "@/components/layout/header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrintScrollRestorer } from "@/components/layout/print-scroll-restorer";
import { MainScrollRestorer } from "@/components/layout/main-scroll-restorer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
    <PrintScrollRestorer />
    <div id="dashboard-root" className="fixed inset-0 flex h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-900 z-0">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-mesh-pattern opacity-10 mix-blend-multiply pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px] mix-blend-screen pointer-events-none" />
      
      {/* Sidebar - Hidden on mobile for now */}
      <div className="hidden md:flex md:w-64 md:flex-col z-20">
        <Sidebar role={session.user.role} />
      </div>

      {/* Main Content Area */}
      <div id="layout-flex-col" className="flex flex-1 flex-col overflow-hidden min-h-0 min-w-0 z-10">
        <Header user={session.user} />
        
        <main id="main-scroll-container" className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 lg:p-8 relative">
          <MainScrollRestorer />
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
