import { Task } from "../domain/Task";

export interface DeleteTaskArgs {
  uid: string;
  taskID: number;
}

export interface EditTaskArgs extends Partial<Task>{
  uid: string;
  taskID: number;
}

export interface AddTaskArgs {
  uid: string;
  taskData: Partial<Task>;
}