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
