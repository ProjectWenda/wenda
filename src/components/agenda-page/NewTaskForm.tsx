import {
  faCircleXmark,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useKeyPress } from "../../hooks/useKeyPress";
import { Task, TaskStatus, AddTaskArgs } from "../../schema/Task";
import { Weekday } from "../../schema/Weekday";
import { addTask } from "../../services/tasks";
import { tasksState, weekState } from "../../store";
import IconButton from "../IconButton";

interface NewTaskFormProps {
  setAddingNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  dayOfWeek: Weekday;
  uid: string;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({
  setAddingNewTask,
  dayOfWeek,
  uid,
}) => {
  const [_, setTaskListState] = useRecoilState(tasksState);
  const [newContent, setNewContent] = React.useState("");
  const week = useRecoilValue(weekState);

  const stopAddingTask = () => {
    setAddingNewTask(false);
    setNewContent("");
  };

  const handleSubmit = async () => {
    const newTask: Partial<Task> = {
      content: newContent,
      taskStatus: TaskStatus.ToDo,
      taskDate: moment().week(week).day(dayOfWeek),
    };
    const addArgs: AddTaskArgs = {
      uid,
      taskData: newTask,
    };
    const newTaskRes = await addTask(addArgs);
    setTaskListState((prev) => [...prev, newTaskRes]);
    stopAddingTask();
  };

  useKeyPress(["Enter"], handleSubmit);
  useKeyPress(["Escape"], stopAddingTask);

  return (
    <div className="flex flex-col m-1">
      <div className="rounded-t bg-slate-50 dark:bg-zinc-800 p-2 min-h-20 shadow">
        <input
          value={newContent}
          className="pl-1 rounded dark:bg-zinc-700 bg-white"
          onChange={(e) => setNewContent(e.target.value)}
          autoFocus
        />
      </div>
      <div className="bg-disc-light-blue rounded-b flex justify-end p-1 shadow gap-2">
        <IconButton icon={faCircleXmark} onClick={stopAddingTask} size="sm" />
        <IconButton icon={faCheckCircle} onClick={handleSubmit} size="sm" />
      </div>
    </div>
  );
};

export default NewTaskForm;
