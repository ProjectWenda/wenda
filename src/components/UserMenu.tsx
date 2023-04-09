import { motion } from "framer-motion";
import React from "react";
import { assertIsNode } from "../domain/assertions";
import { getUser, getUserImageColor } from "../services/discord";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import UserImage from "./UserImage";
import MenuItem from "./MenuItem";
import { DiscordUser } from "../schema/User";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  user: DiscordUser
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [imageColor, setImageColor] = React.useState<string>();
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      const imageColor = await getUserImageColor(user);
      setUserName(user.username);
      setImageColor(imageColor.rgb);
    };
    fetchData();
  }, [user]);

  const menuEntries = [
    <ThemeToggle showText />,
    <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>,
    <LogoutButton userName={userName} />,
  ];

  const closeOpenMenus = React.useCallback(
    ({ target }: MouseEvent) => {
      assertIsNode(target);
      if (
        triggerRef.current &&
        menuRef.current &&
        showMenu &&
        !triggerRef.current.contains(target) &&
        !menuRef.current.contains(target)
      ) {
        setShowMenu(false);
      }
    },
    [showMenu, triggerRef]
  );

  React.useEffect(() => {
    document.addEventListener("click", closeOpenMenus);
    return () => {
      document.removeEventListener("click", closeOpenMenus);
    };
  }, [showMenu]);

  return userName && imageColor ? (
    <div className="relative inline-block cursor-pointer">
      <motion.div
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowMenu(!showMenu)}
        ref={triggerRef}
      >
        <UserImage user={user} />
      </motion.div>
      {showMenu && (
        <motion.div
          animate={{ opacity: [0, 1] }}
          className="dark:bg-neutral-700 bg-zinc-100 shadow-lg dark:shadow-disc-dark-4 w-fit h-fit rounded absolute block right-0 mt-2 z-10 cursor-default"
          style={{
            borderWidth: 1,
            borderColor: imageColor,
            boxShadow: `0 1px 10px ${imageColor}`,
          }}
          ref={menuRef}
        >
          <div
            id="menu-contents"
            className="flex flex-col items-left p-2 gap-3"
          >
            {menuEntries.map((el, ind) => {
              return (
                <div
                  className="w-full border-b last:border-none last:pb-0 pb-3 border-neutral-600"
                  style={{
                    borderColor: imageColor,
                  }}
                  key={ind}
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
