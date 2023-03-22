export interface DeleteTaskArgs {
  uid: string;
  taskID: string;
}

export interface EditTaskArgs extends Partial<ServerTask> {
  uid: string;
  taskID: string;
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
  taskID: string;
  timeCreated: Moment;
  timeUpdated: Moment;
  taskDate: Moment;
  content: string;
  taskStatus: TaskStatus;
}

export interface ServerTask {
  taskID: string;
  timeCreated: string;
  timeUpdated: string;
  taskDate: string;
  content: string;
  taskStatus: TaskStatus;
}

export const tasksFromServer = (serverTasks: ServerTask[]): Task[] => {
  return serverTasks.map((t) => ({
    taskID: t.taskID,
    timeCreated: moment(t.timeCreated),
    timeUpdated: moment(t.timeUpdated),
    taskDate: moment(t.taskDate),
    content: t.content,
    taskStatus: t.taskStatus,
  }));
};

export const taskToServer = (task: Task): ServerTask => {
  return {
    taskID: task.taskID,
    timeCreated: task.timeCreated.toISOString(),
    timeUpdated: task.timeUpdated.toISOString(),
    taskDate: task.taskDate.toISOString(),
    content: task.content,
    taskStatus: task.taskStatus,
  };
}