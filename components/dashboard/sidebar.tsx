import { FilePlus, House, Rss, User } from "lucide-react";
import MenuLinks from "./menuLinks";

const menuItems = [
  {
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <House size={20} />,
      },
      {
        title: "Posts",
        path: "/dashboard/posts",
        icon: <Rss size={20} />,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <User size={20} />,
      },
      {
        title: "Create New",
        path: "/dashboard/create-post",
        icon: <FilePlus size={20} />,
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <div>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.list.map((link) => (
              <MenuLinks key={link.title} LinkItem={link} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
};

export default Sidebar;
