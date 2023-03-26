import { Moment } from "moment";
import { EditTaskArgs, Task, taskToServer } from "../schema/Task";
import { editTask } from "../services/tasks";

export const getTasksByDay = (tasks: Task[], day: Moment): Task[] => {
  return tasks.filter((t) => t.taskDate.isSame(day, "date"));
};

export const editTaskToServer = async (
  task: Task,
  uid: string,
  updatedProps: Partial<Task>
) => {
  const newTask: Task = {
    ...task,
    ...updatedProps,
  };
  const editArgs: EditTaskArgs = {
    ...taskToServer(newTask),
    uid,
    taskID: task.taskID,
  };
  const editRes = await editTask(editArgs);
  if (editRes !== null) {
    return newTask;
  }
  return null;
};
