import { Task } from "../domain/Task";

export interface DeleteTaskArgs {
  uid: string;
  taskId: number;
}

export interface EditTaskArgs extends Partial<Task>{
  uid: string;
  taskId: number;
}

export interface AddTaskArgs {
  uid: string;
  taskData: Partial<Task>;
}