import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUsers } from "./actions";
import { UsersDataTable } from "./data-table";

export default async function UsersPage() {
  const session = await auth();

  // Protect the route: only admins can access
  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">
          User Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Add, modify, and manage user access levels.
        </p>
      </div>

      <UsersDataTable data={users as any} />
    </div>
  );
}
