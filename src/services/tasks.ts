import axios from "axios";
import { Task } from "../domain/Task";

const baseUrl = "http://localhost:8080";

const uidParams = (uid: string) => ({
  params: {
    uid: uid,
  }
});

export const getTasks = async (uid: string) : Promise<Task[]> => {
  const response = await axios.get(`${baseUrl}/tasks`, uidParams(uid));
  return response.data;
};

export const addTask = async (uid: string, taskData: Partial<Task>) : Promise<Task> => {
  const response = await axios.post(`${baseUrl}/task?uid=${uid}`, { ...taskData });
  return response.data;
};

export const deleteTask = async (uid: string, id: number) : Promise<Task | null> => {
  const reqParam = {
    params: { uid, task_id: id }
  }
  try {
    const response = await axios.delete(`${baseUrl}/task`, reqParam);
    return response.data;
  } catch (e) {
    return null;
  }
}

export const editTask = async (uid: string, id: number, editedTaskData: Partial<Task>) : Promise<Task | null> => {
  const reqParam = {
    params: { uid, task_id: id, ...editedTaskData },
  }
  try {
    const response = await axios.put(`${baseUrl}/task`, null, reqParam);
    return response.data;
  } catch (e) {
    return null;
  }
}