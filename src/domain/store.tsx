import recoil, { selector } from "recoil";
import { Task } from "./Task";
import { User } from "./User";

export const taskListState = recoil.atom<Task[]>({
  key: "taskListState",
  default: [],
});

const authCookie = document.cookie.replace(
  /(?:(?:^|.*;\s*)authuid\s*\=\s*([^;]*).*$)|^.*$/,
  "$1");

export const authUserState = recoil.atom<User | null>({
  key: "authUserState",
  default: authCookie === "" ? null : { authUId: authCookie },
});

export const loggedInState = selector<boolean>({
  key: "loggedInState",
  get: ({ get }) => {
    const userState = get(authUserState);
    return userState !== null;
  },
});
