import { motion } from "framer-motion";
import React from "react";
import { getUser, getUserImageColor } from "../services/discord";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import UserImage from "./UserImage";

interface UserMenuProps {
  uid: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ uid }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [userName, setUserName] = React.useState();
  const [imageColor, setImageColor] = React.useState<string>();

  React.useEffect(() => {
    const fetchData = async () => {
      const [user, imageColor] = await Promise.all([
        getUser(uid),
        getUserImageColor(uid),
      ]);
      setUserName(user.username);
      setImageColor(imageColor.rgb);
    };
    fetchData();
  }, []);

  const menuEntries = [
    <ThemeToggle showText />,
    <LogoutButton userName={userName} />,
  ];

  return userName && imageColor ? (
    <div className="relative inline-block cursor-pointer">
      <div onClick={() => setShowMenu(!showMenu)}>
        <UserImage uid={uid} />
      </div>
      {showMenu && (
        <motion.div
          animate={{ opacity: [0, 1] }}
          className="dark:bg-neutral-700 bg-zinc-100 shadow-lg dark:shadow-disc-dark-4 w-fit h-fit rounded absolute block right-0 mt-2 z-10"
          style={{
            borderWidth: 1,
            borderColor: imageColor,
            boxShadow: `0 1px 10px ${imageColor}`,
          }}
        >
          <div
            id="menu-contents"
            className="flex flex-col items-left p-2 gap-3"
          >
            {menuEntries.map((el) => {
              return (
                <div className="w-full border-b last:border-none last:pb-0 pb-3 border-neutral-600"
                  style={{
                    borderColor: imageColor,
                  }}
                >
                  {el}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  ) : null;
};

export default UserMenu;
