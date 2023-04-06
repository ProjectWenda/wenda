import React from "react";
import { Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authUserState, loggedInState, themeState } from "../store";
import UserTag from "../components/UserTag";
import UserMenu from "../components/UserMenu";
import { getUser } from "../services/discord";
import { DiscordUser, getDiscordUserPrototype } from "../schema/User";

const AuthLayout = () => {
  const loggedIn = useRecoilValue(loggedInState);
  const authUser = useRecoilValue(authUserState);
  const [isDarkMode, setIsDarkMode] = useRecoilState(themeState);
  const [discordUserRes, setDiscordUserRes] = React.useState<DiscordUser>(getDiscordUserPrototype());

  React.useEffect(() => {
    //save theme to local storage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  React.useEffect(() => {
    //get theme from local storage on page load
    const theme = localStorage.getItem("theme");
    setIsDarkMode(theme === "dark");
  }, []);

  React.useEffect(() => {
    if (authUser?.authUID) {
      const fetchData = async () => {
        const user = await getUser(authUser.authUID);
        setDiscordUserRes(user);
      }
      fetchData();
    }
  }, [authUser?.authUID])

  const showUserInfo = React.useMemo(() => loggedIn && (discordUserRes.id !== ""), [loggedIn, discordUserRes])

  return (
    <div className={`flex flex-1 ${isDarkMode ? "dark" : "light"}`}>
      <div className="dark:bg-zinc-900 bg-white flex flex-col flex-1">
        <div className="flex dark:bg-light-gray bg-zinc-300 max-w-none h-20 items-center justify-end">
          <div className="w-[175px]"></div>
        {loggedIn && (
          <div className="flex w-full justify-center mt-2">
            <span className="text-6xl font-['Poppins'] antialiased">
              W
            </span>
            <span className="text-6xl font-['Poppins'] bg-clip-text bg-gradient-to-r from-disc-blue to-purple-700 text-transparent antialiased">
              enda
            </span>
          </div>
        )}
          <div className="flex items-center gap-2 mr-4">
            {showUserInfo && <UserTag user={discordUserRes} />}
            {showUserInfo && <UserMenu user={discordUserRes} />}
          </div>
        </div>
        <div className="flex dark:text-white mx-5 mt-4 mb-10 flex-1 justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
