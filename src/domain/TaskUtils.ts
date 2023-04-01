import { Moment } from "moment";
import { DayTasks, EditTaskArgs, Task, taskToServer } from "../schema/Task";
import { editTask } from "../services/tasks";

export const getTasksByDate = (tasks: DayTasks, date: Moment) =>
  tasks[date.format("YYYY-MM-DD")]
    ? tasks[date.format("YYYY-MM-DD")].tasks ?? []
    : [];

// export const getNonDayTasks = (tasks: DayTasks, date: Moment) => {
//   const newTasks : DayTasks = {...tasks};
//   delete newTasks[date.format("YYYY-MM-DD")];
//   return newTasks;
// }

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
