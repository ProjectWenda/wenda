export interface DeleteTaskArgs {
  uid: string;
  taskID: number;
}

export interface EditTaskArgs extends Partial<ServerTask> {
  uid: string;
  taskID: number;
}

export interface AddTaskArgs {
  uid: string;
  taskData: Partial<Task>;
}

import moment from "moment";
import { Moment } from "moment";

export enum TaskStatus {
  ToDo = 0,
  Completed,
  Archived,
}

export interface Task {
  id: number;
  timeCreated: Moment;
  timeUpdated: Moment;
  taskDate: Moment;
  content: string;
  status: TaskStatus;
}

export interface ServerTask {
  id: number;
  timeCreated: string;
  timeUpdated: string;
  taskDate: string;
  content: string;
  status: TaskStatus;
}

export const tasksFromServer = (serverTasks: ServerTask[]): Task[] => {
  return serverTasks.map((t) => ({
    id: t.id,
    timeCreated: moment(t.timeCreated),
    timeUpdated: moment(t.timeUpdated),
    taskDate: moment(t.taskDate),
    content: t.content,
    status: t.status,
  }));
};

export const taskToServer = (task: Task): ServerTask => {
  return {
    id: task.id,
    timeCreated: task.timeCreated.toISOString(),
    timeUpdated: task.timeUpdated.toISOString(),
    taskDate: task.taskDate.toISOString(),
    content: task.content,
    status: task.status,
  };
}