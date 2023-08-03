import * as React from "react";
import moment, { Moment } from "moment";
import tz from "moment-timezone";
import { TextField, DateField, SelectField } from "./Field";
import {
  AddTaskArgs,
  DayTasks,
  Task,
  TaskStatus,
  getTaskStatusFromString,
  getTaskStatusString,
} from "../schema/Task";
import { mapEnum } from "../domain/codeUtils";
import { getTasksByDate } from "../domain/TaskUtils";
import { addTask } from "../services/tasks";
import { useRecoilState, useRecoilValue } from "recoil";
import { authUserState, tasksState } from "../store";
import { ConfigUpdate } from "antd/es/modal/confirm";
import { useKeyPress } from "../hooks/useKeyPress";

type AddTaskModalProps = {
  update: (configUpdate: ConfigUpdate) => void;
  closeDialog: () => void;
};

const CONTENT_PLACEHOLDER = "New task content...";

const AddTaskDialog: React.FC<AddTaskModalProps> = ({ update, closeDialog }) => {
  const [tasks, setTasks] = useRecoilState(tasksState);
  const userState = useRecoilValue(authUserState);
  const [newTaskContent, setNewTaskContent] = React.useState<string>("");
  const [newTaskDate, setNewTaskDate] = React.useState<Moment>(moment());
  const [newTaskStatus, setNewTaskStatus] = React.useState<TaskStatus>(TaskStatus.ToDo);
  const taskStatusStrings = mapEnum(TaskStatus, (status: TaskStatus) =>
    getTaskStatusString(status)
  );

  const submitTask = React.useCallback(async () => {
    closeDialog();
    const normalizedDate = tz(newTaskDate, "America/New_York").set({ hour: 8, minute: 0 });
    const newTask: Partial<Task> = {
      content: newTaskContent,
      taskStatus: newTaskStatus,
      taskDate: normalizedDate,
    };
    const addArgs: AddTaskArgs = {
      uid: userState!.authUID,
      taskData: newTask,
    };
    const newTaskRes = await addTask(addArgs);
    if (newTaskRes) {
      const newDayTasks: DayTasks = {
        ...tasks,
        [newTaskRes.taskDate.format("YYYY-MM-DD")]: {
          tasks: [...getTasksByDate(tasks, newTaskDate), newTaskRes],
        },
      };
      setTasks(newDayTasks);
    }
  }, [newTaskContent, newTaskDate, tasks, userState, newTaskStatus, closeDialog]);

  const validSubmit = React.useMemo(() => newTaskContent !== "", [newTaskContent]);

  useKeyPress(["Enter"], validSubmit ? submitTask : () => null);

  React.useEffect(() => {
    update({
      okButtonProps: {
        disabled: !validSubmit,
      },
    });
  }, [update, validSubmit]);

  React.useEffect(() => {
    update({
      onOk: submitTask,
    });
  }, [submitTask]);

  return (
    <div className="flex flex-col gap-2">
      <TextField
        label="Task Content:"
        value={newTaskContent}
        onChange={(e) => setNewTaskContent(e.target.value)}
        placeholder={CONTENT_PLACEHOLDER}
        autoFocus
      />
      <DateField
        label="Task Date:"
        value={newTaskDate}
        onChange={(date) => setNewTaskDate(date!)}
      />
      <SelectField
        label="Task Status:"
        value={getTaskStatusString(newTaskStatus)}
        onChange={(value) => setNewTaskStatus(getTaskStatusFromString(value))}
        options={taskStatusStrings}
      />
    </div>
  );
};

export default AddTaskDialog;
