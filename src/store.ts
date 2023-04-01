import moment from "moment";
import { selector, atom } from "recoil";
import { Task } from "./schema/Task";
import { User } from "./schema/User";

const authCookie = document.cookie.replace(
  /(?:(?:^|.*;\s*)authuid\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);

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

export const userTasksState = atom<Task[]>({
  key: "userTasksState",
  default: [],
});

export const weekTasksState = selector<Task[]>({
  key: "weekTasksState",
  get: ({ get }) => {
    const tasks = get(userTasksState);
    return tasks.filter((t) => t.taskDate.week() === moment().week());
  },
});

export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false,
});

export const draggingState = atom<boolean>({
  key: "draggingState",
  default: false,
})