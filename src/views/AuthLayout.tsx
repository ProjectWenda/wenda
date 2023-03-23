import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "react-router-dom";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import LogoutButton from "../components/LogoutButton";
import { useRecoilValue } from "recoil";
import { loggedInState } from "../store";

const AuthLayout = () => {
  const getDefaultTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const loggedIn = useRecoilValue(loggedInState);
  // priority theme: local storage > system theme
  const getBaseTheme = () => {
    // returns true if dark mode, false if light mode
    const theme = localStorage.getItem("theme");
    if (theme == null) return getDefaultTheme();
    return theme === "dark";
  };
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(getBaseTheme());

  React.useEffect(() => {
    //save theme to local storage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  React.useEffect(() => {
    //get theme from local storage on page load
    const theme = localStorage.getItem("theme");
    setIsDarkMode(theme === "dark");
  }, []);

  return (
    <div className={isDarkMode ? "dark h-full" : "light h-full"}>
      <div className="h-full dark:bg-zinc-900 bg-white">
        <div className="flex dark:bg-light-gray bg-zinc-300 max-w-none h-12 items-center justify-end">
          <div className="flex items-center gap-2 mr-2">
            <button
              className="px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <FontAwesomeIcon
                icon={isDarkMode ? faSun : faMoon}
                className="text-sm"
              />
            </button>
            {loggedIn && <LogoutButton />}
          </div>
        </div>
        {loggedIn && (
          <div className="flex w-full justify-center mt-2">
            <span className="text-6xl font-['Poppins'] font-semibold antialiased drop-shadow-lg">
              W
            </span>
            <span className="text-6xl font-['Poppins'] bg-clip-text bg-gradient-to-r from-disc-blue to-purple-700 text-transparent antialiased drop-shadow-lg">
              enda
            </span>
          </div>
        )}
        <div className="flex dark:text-white mx-5 my-2 h-5/6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
