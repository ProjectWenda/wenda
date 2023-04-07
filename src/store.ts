import moment from "moment";
import { selector, atom } from "recoil";
import { DayTasks, Task } from "./schema/Task";
import { User } from "./schema/User";

const authCookie = document.cookie.replace(/(?:(?:^|.*;\s*)authuid\s*\=\s*([^;]*).*$)|^.*$/, "$1");

const getDefaultTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const getBaseTheme = () => {
  // returns true if dark mode, false if light mode
  const theme = localStorage.getItem("theme");
  if (theme == null) return getDefaultTheme();
  return theme === "dark";
};

export const authUserState = atom<User | null>({
  key: "authUserState",
  default: authCookie === "" ? null : { authUID: authCookie },
});

export const loggedInState = selector<boolean>({
  key: "loggedInState",
  get: ({ get }) => {
    const userState = get(authUserState);
    return userState !== null;
  },
});

export const tasksState = atom<DayTasks>({
  key: "tasksState",
  default: {},
});

export const combinedTasksState = selector<Task[]>({
  key: "combinedTasksState",
  get: ({ get }) => {
    const taskDays = get(tasksState);
    const tasks = Object.values(taskDays).reduce((acc, day) => {
      return acc.concat(day.tasks);
    }, [] as Task[]);
    return tasks;
  },
});

export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false,
});

export const weekState = atom<number>({
  key: "weekState",
  default: moment().week(),
});

export const themeState = atom<boolean>({
  key: "themeState",
  default: getBaseTheme(),
});

export const draggingState = atom<boolean>({
  key: "draggingState",
  default: false,
});
