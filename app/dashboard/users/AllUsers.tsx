"use client";

import Loading from "@/app/loading";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  emailAddresses: { emailAddress: string }[];
  password: string;
  imageUrl: string | null;
  clerkId: string;
  publicMetadata: {
    role: string;
  };
  createdAt: Date;
}

const AllUsers = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load users");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if(!confirmDelete) return;

    const loadingToast = toast.loading("Deleting user...");

    try {
      setDeletingUserId(userId);
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user", error);
      toast.error("Failed to delete user");
    } finally {
      toast.dismiss(loadingToast);
      setDeletingUserId(null);
    }
  };

  if (initialLoading) {
    return <Loading />;
  }

  console.log("user image data", users)


  return (
    <section className="p-4 bg-[#020617] text-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Users ({users.length})</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm bg-red-700 rounded-md p-1 text-white hover:underline"
        >
          Go Back
        </button>
      </div>

      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">No users found.</div>
        ) : (
          <table className="mt-3 w-full text-center bg-gray-900">
            <thead className="bg-[#1E293B]">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b bg-[#020617] hover:bg-[#0F172A]"> 
                <td className="px-4 py-2">
                  <figure className="flex justify-center items-center">
                     <Image 
                      src={user.imageUrl || "./images/avatar.png"}
                      alt="avatar"
                      width={35}
                      height={35}
                      className="rounded-full" />
                  </figure>
                </td>
                  <td className="px-4 py-2">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-2">
                    {user.emailAddresses[0]?.emailAddress}
                  </td>
                  <td className="px-4 py-2">
                    {user.publicMetadata?.role || "User"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={deletingUserId === user.id}
                      className="text-red-500 hover:text-red-700"
                    >
                      {deletingUserId === user.id ? "Deleting..." : <Trash2 size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AllUsers;
