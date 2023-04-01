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

export interface DayTasks {
  [date: string]: {
    tasks: Task[];
  }
}

export interface ServerTasksResponse {
  [date: string]: {
    tasks: ServerTask[];
  }
}

export interface ServerTask {
  taskID: string;
  timeCreated: string;
  timeUpdated: string;
  taskDate: string;
  content: string;
  taskStatus: TaskStatus;
}

export const taskFromServer = (task: ServerTask): Task => {
  return {
    taskID: task.taskID,
    timeCreated: moment(task.timeCreated),
    timeUpdated: moment(task.timeUpdated),
    taskDate: moment(task.taskDate),
    content: task.content,
    taskStatus: task.taskStatus,
  };
}

export const dayTasksFromServer = (res: ServerTasksResponse): DayTasks => {
  const tasks: DayTasks = {};
  Object.keys(res).forEach((date) => {
    tasks[date] = {
      tasks: res[date].tasks.map((t) => taskFromServer(t)),
    };
  });
  return tasks;
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