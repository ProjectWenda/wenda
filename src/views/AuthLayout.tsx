import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "react-router-dom";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import LogoutButton from "../components/LogoutButton";

const AuthLayout = () => {
  const getDefaultTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  // priority theme: local storage > system theme
  const getBaseTheme = () => { 
    // returns true if dark mode, false if light mode
    const theme = localStorage.getItem("theme");
    if (theme == null) return getDefaultTheme();
    return theme === "dark";
  }
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
            <LogoutButton />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center dark:text-white mt-3">
          Wenda IMPROVED
        </h1>
        <div className="flex dark:text-white mx-5 my-2 h-5/6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
