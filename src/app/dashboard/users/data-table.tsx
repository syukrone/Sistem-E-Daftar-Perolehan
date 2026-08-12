"use client";

import { useState, useTransition } from "react";
import { Search, Edit, Trash2, UserPlus, Shield, User, X } from "lucide-react";
import { format } from "date-fns";
import { createUser, updateUser, deleteUser } from "./actions";
import { useRouter } from "next/navigation";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  isActive: boolean;
};

const roleMap: Record<string, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  staff: { label: "Staff", color: "text-slate-700 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
  ppkp: { label: "PPKP", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  pptk: { label: "PPTK", color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
};

export function UsersDataTable({ data }: { data: UserItem[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [error, setError] = useState("");

  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower)
    );
  });

  const openModal = (mode: "create" | "edit" | "delete", user?: UserItem) => {
    setModalMode(mode);
    setSelectedUser(user || null);
    setError("");
    if (user && mode === "edit") {
      setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    } else {
      setFormData({ name: "", email: "", password: "", role: "staff" });
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        if (modalMode === "create") {
          if (!formData.password) {
            setError("Password is required for new users.");
            return;
          }
          await createUser(formData);
        } else if (modalMode === "edit" && selectedUser) {
          await updateUser(selectedUser.id, formData);
        } else if (modalMode === "delete" && selectedUser) {
          await deleteUser(selectedUser.id);
        }
        
        closeModal();
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Bar & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300/50 rounded-xl bg-white/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all sm:text-sm"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => openModal("create")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 shadow-xl rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Joined Date
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50 bg-transparent">
              {filteredData.length > 0 ? (
                filteredData.map((user) => {
                  const roleInfo = roleMap[user.role] || roleMap["staff"];
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                              <User className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {user.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${roleInfo.bg} ${roleInfo.color} ring-1 ring-inset ring-black/5`}>
                          {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {format(new Date(user.createdAt), "dd MMM yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal("edit", user)}
                            className="p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30 transition-colors"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal("delete", user)}
                            className="p-2 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {modalMode === "create" && "Add New User"}
                {modalMode === "edit" && "Edit User"}
                {modalMode === "delete" && "Delete User"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800/50">
                  {error}
                </div>
              )}

              {modalMode === "delete" ? (
                <div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Are you sure you want to remove <strong>{selectedUser?.name}</strong> from the system?
                    This will disable their account.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {modalMode === "edit" ? "New Password (Optional)" : "Password"}
                    </label>
                    <input
                      type="password"
                      required={modalMode === "create"}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Role / Access Level
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="staff">Staff</option>
                      <option value="ppkp">PPKP</option>
                      <option value="pptk">PPTK</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-colors ${
                    modalMode === "delete"
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  } disabled:opacity-50`}
                >
                  {isPending ? "Saving..." : modalMode === "create" ? "Create User" : modalMode === "edit" ? "Save Changes" : "Delete User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
