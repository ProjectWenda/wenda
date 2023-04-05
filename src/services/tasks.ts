import axios from "axios";
import {
  DayTasks,
  Task,
  dayTasksFromServer,
  taskFromServer,
} from "../schema/Task";
import {
  AddTaskArgs,
  DeleteTaskArgs,
  EditTaskArgs,
  EditOrderArgs,
} from "../schema/Task";

const inDev = import.meta.env.DEV;
const BASE_URL = inDev
  ? import.meta.env.VITE_LOCAL_BACKEND_URL
  : import.meta.env.VITE_BACKEND_URL;

const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getTasks = async (uid: string): Promise<DayTasks> => {
  const response = await axios.get(`${BASE_URL}/tasks`, { params: { uid, timezone: LOCAL_TIMEZONE } });
  return dayTasksFromServer(response.data);
};

export const addTask = async (args: AddTaskArgs): Promise<Task> => {
  const response = await axios.post(
    `${BASE_URL}/task?uid=${args.uid}`,
    args.taskData,
    { params: { timezone: LOCAL_TIMEZONE } }
  );
  return taskFromServer(response.data);
};

export const deleteTask = async (
  args: DeleteTaskArgs
): Promise<Task | null> => {
  try {
    const response = await axios.delete(`${BASE_URL}/task`, { params: args });
    return taskFromServer(response.data);
  } catch (e) {
    return null;
  }
};

export const editTask = async (args: EditTaskArgs): Promise<Task | null> => {
  try {
    const response = await axios.put(`${BASE_URL}/task`, null, { params: args });
    return taskFromServer(response.data);
  } catch (e) {
    return null;
  }
};

export const editOrder = async (args: EditOrderArgs) => {
  const response = await axios.post(`${BASE_URL}/order`, null, { params: args });
  return response.data;
};
