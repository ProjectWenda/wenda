import recoil from "recoil";
import { Task } from "./Task";

export const taskListState = recoil.atom<Task[]>({
  key: "taskListState",
  default: [],
});

export const authUserState = recoil.atom({
  key: "authUserState",
  default: null,
});
