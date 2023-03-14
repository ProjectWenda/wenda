import axios from "axios";
import { Task } from "../domain/Task";
import { AddTaskArgs, DeleteTaskArgs, EditTaskArgs } from "../schema/Task";

const baseUrl = "http://localhost:8080";

export const getTasks = async (uid: string) : Promise<Task[]> => {
  const response = await axios.get(`${baseUrl}/tasks`, { params: { uid } });
  return response.data;
};

export const addTask = async (args: AddTaskArgs) : Promise<Task> => {
  const response = await axios.post(`${baseUrl}/task?uid=${args.uid}`, args.taskData);
  return response.data;
};

export const deleteTask = async (args : DeleteTaskArgs) : Promise<Task | null> => {
  try {
    const response = await axios.delete(`${baseUrl}/task`, { params: args });
    return response.data;
  } catch (e) {
    return null;
  }
}

export const editTask = async (args: EditTaskArgs) : Promise<Task | null> => {
  try {
    const response = await axios.put(`${baseUrl}/task`, null, { params: args });
    return response.data;
  } catch (e) {
    return null;
  }
}