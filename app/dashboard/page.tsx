import { AppTotalUsersChart } from "@/components/dashboard/AppTotalUsersChart";
import  {AppBarChart}  from "@/components/dashboard/AppBarChart";
import { getPosts, getUsers } from "@/utils/prisma/prismaPost";
import AllPost from "./posts/AllPost";

const Dashboard = async () => {
  // Get all posts
  const posts = await getPosts();
  // Get all users
  const users = await getUsers();

  return (
    <main className="p-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Show all visitors part */}
        <div className="bg-black/50 p-4 rounded-lg">
          <AppBarChart />
        </div>
        {/* Show all users part */}
        <div className="p-4 rounded-lg bg-black">
          <AppTotalUsersChart users={users} />
        </div>
      </div>
        {/* Show all posts part */}
      <div className="bg-black p-4 rounded-lg mt-4">
        <AllPost posts={posts} />
      </div>
    </main>
  );
};

export default Dashboard;
