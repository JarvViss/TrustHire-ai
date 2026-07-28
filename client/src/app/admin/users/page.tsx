"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import AdminGuard from "@/components/auth/AdminGuard";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users");
      return data.data;
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: string;
      role: string;
    }) => {
      await api.patch(`/admin/user/${id}/role`, {
        role,
      });
    },
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/user/${id}`);
    },
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });
    },
  });

  const users = data?.filter(
    (u: any) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminGuard>
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-8 p-8">
        <h1 className="text-4xl font-black dark:text-white">
          User Management
        </h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <p className="dark:text-white">Loading users...</p>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  <tr>
                    <th className="p-4 font-semibold dark:text-white">
                      Name
                    </th>
                    <th className="p-4 font-semibold dark:text-white">
                      Email
                    </th>
                    <th className="p-4 font-semibold dark:text-white">
                      Role
                    </th>
                    <th className="p-4 font-semibold dark:text-white">
                      Joined
                    </th>
                    <th className="p-4 font-semibold dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr
                      key={user._id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="flex items-center gap-3 p-4 font-medium dark:text-white">
                        <img
                          src={
                            user.profileImage
                              ? `${API_BASE_URL}${user.profileImage}`
                              : `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(user.name || "User")}`
                          }
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        {user.name}
                        {user.isVerified && (
                          <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateRole.mutate({
                              id: user._id,
                              role: e.target.value,
                            })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="candidate">
                            Candidate
                          </option>
                          <option value="recruiter">
                            Recruiter
                          </option>
                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                "Delete this user?"
                              )
                            )
                              deleteUser.mutate(
                                user._id
                              );
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </AdminGuard>
  );
}
