import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useRecoilState } from "recoil";
import { themeState } from "../store";

interface ThemeToggleProps {
  showText?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showText }) => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(themeState);
  return (
    <div className="flex justify-between items-center w-full">
      <button
        className="px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        <FontAwesomeIcon
          icon={isDarkMode ? faSun : faMoon}
          className="text-sm"
        />
      </button>
      {showText &&
      <p className="text-sm">Theme</p>}
    </div>
  );
};

export default ThemeToggle;
