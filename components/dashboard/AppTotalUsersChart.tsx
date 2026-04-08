import { removeRole, setRole } from "@/utils/actions";
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";

interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  image_url: string | null;
  clerkId: string;
  role: string;
  createdAt: Date;
}

export async function AppTotalUsersChart({ users }: { users: UserProps[] }) {
    const client = await clerkClient();
    const clerkUsers = (await client.users.getUserList()).data;

  return (
    <div>
      <h1 className="text-[17px]">Total Users({users.length})</h1>
      {clerkUsers.map((user) => (
        <div
          key={user.id}
          className="p-1 px-2 mb-[6px] w-full bg-[#0F172A] rounded-md shadow-slate-400 shadow-sm overflow-x-auto"
        >
          <div className="flex justify-between items-center">
            {/* Image Name And Date Start */}
            <div className="flex gap-2">
              <figure className="w-[40px] h-[40px] bg-blue-800 rounded-full">
                <Image
                  src={user.imageUrl || "/images/avatar.png"}
                  alt={user.lastName || "User Name"}
                  width={40}
                  height={40}
                  className="rounded-full w-full h-full"
                />
              </figure>
              <div>
                <h2 className="text-sm capitalize"> 
                  {user.firstName && user.lastName ? `${user.firstName + ' ' + user.lastName}` : "Unknown" }
                </h2>
                <p className="text-[11px]"> 
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm bg-green-800 rounded-md capitalize inline-block px-2">{user.publicMetadata?.role as string || "User"}</p>
              </div>
            </div>
            {/* Image Name And Date End */}
            {/* Change Role Start */}
            <div className="flex gap-2">
              {/* Mark as Admin  */}
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <button 
                  type="submit"
                  className="px-2 py-1 bg-slate-900 rounded-md text-sm border border-neutral-300" >
                      Make Admin
                  </button>
                </form>
              {/* Mark as User  */}
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="user" name="role" />
                 <button 
                  type="submit"
                  className="px-2 py-1 bg-slate-900 rounded-md text-sm border border-neutral-300" >
                      Make User
                  </button>
              </form>
               {/* Delete Clerk User */}
              <form action={removeRole}>
                <input type="hidden" value={user.id} name="id" />
                <button 
                  type="submit"
                  className="px-2 py-1 bg-red-900 rounded-md text-sm border border-neutral-300" >
                    Romove Role
                </button>
              </form>
            </div>
            {/* Change Role End */}
          </div>
        </div>
      ))}
    </div>
  );
}
