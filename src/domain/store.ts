import { selector, atom } from "recoil";
import { getTasks } from "../services/tasks";
import { Task } from "./Task";
import { User } from "./User";

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
})
