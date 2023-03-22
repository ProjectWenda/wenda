import { EditTaskArgs, Task, taskToServer } from "../schema/Task";
import { Weekday } from "../schema/Weekday";
import { editTask } from "../services/tasks";

export const getTasksByDay = (tasks: Task[], day: Weekday): Task[] => {
  return tasks.filter((t) => t.taskDate.day() === day);
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
